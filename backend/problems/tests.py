from datetime import timedelta
from unittest import mock

from django.contrib.auth import get_user_model
from django.test import SimpleTestCase
from django.urls import reverse
from django.utils import timezone
from rest_framework import status
from rest_framework.test import APITestCase

from . import srs
from .models import Attempt, Problem, ReviewState


class AttemptCompleteTests(APITestCase):
    """
    Tests for the attempt-complete endpoint (PATCH /attempts/<id>/).
    """

    def setUp(self):
        user_model = get_user_model()
        self.user = user_model.objects.create_user(
            username='alice', email='alice@example.com', password='pw')
        self.other_user = user_model.objects.create_user(
            username='bob', email='bob@example.com', password='pw')
        self.problem = Problem.objects.create(
            id='two-sum', name='Two Sum', lc_id='two-sum',
            difficulty='easy', category='arrays-hashing')
        self.attempt = Attempt.objects.create(
            user=self.user, problem=self.problem)
        self.url = reverse('attempt-complete', args=[self.attempt.id])
        self.client.force_authenticate(self.user)

    def test_complete_attempt_sets_score_and_duration(self):
        # Backdate the start so the computed (ceil'd) duration is 5 minutes.
        Attempt.objects.filter(pk=self.attempt.pk).update(
            timestamp=timezone.now() - timedelta(minutes=4, seconds=30))

        response = self.client.patch(
            self.url, {'score': 7, 'num_attempts': 2}, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.attempt.refresh_from_db()
        self.assertEqual(self.attempt.score, 7)
        self.assertEqual(self.attempt.num_attempts, 2)
        self.assertEqual(self.attempt.duration, 5)
        self.assertFalse(self.attempt.is_in_progress)

    def test_forfeit_with_score_zero_marks_abandoned(self):
        response = self.client.patch(self.url, {'score': 0}, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.attempt.refresh_from_db()
        self.assertEqual(self.attempt.score, 0)
        self.assertTrue(self.attempt.has_abandoned)
        # Even an instant forfeit records at least one minute.
        self.assertGreaterEqual(self.attempt.duration, 1)

    def test_duration_is_computed_server_side(self):
        # A client-provided duration must be ignored.
        response = self.client.patch(
            self.url, {'score': 5, 'duration': 999}, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.attempt.refresh_from_db()
        self.assertNotEqual(self.attempt.duration, 999)

    def test_cannot_complete_attempt_twice(self):
        self.client.patch(self.url, {'score': 5}, format='json')
        response = self.client.patch(self.url, {'score': 9}, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.attempt.refresh_from_db()
        self.assertEqual(self.attempt.score, 5)

    def test_score_is_required(self):
        response = self.client.patch(self.url, {'num_attempts': 3}, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.attempt.refresh_from_db()
        self.assertTrue(self.attempt.is_in_progress)

    def test_score_out_of_range_rejected(self):
        response = self.client.patch(self.url, {'score': 11}, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_cannot_complete_another_users_attempt(self):
        self.client.force_authenticate(self.other_user)
        response = self.client.patch(self.url, {'score': 5}, format='json')

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_requires_authentication(self):
        self.client.force_authenticate(None)
        response = self.client.patch(self.url, {'score': 5}, format='json')

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_list_serializes_last_attempt_id(self):
        response = self.client.get('/problems/?include=lastAttempt')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            response.data[0]['last_attempt']['id'], self.attempt.id)


class ComputeScoreTests(SimpleTestCase):
    """
    Tests for the rubric -> score mapping.
    """

    def test_failed_is_always_zero(self):
        self.assertEqual(srs.compute_score('failed', 60, 'easy', 1), 0)

    def test_clean_base_score(self):
        # 15 of 20 minutes used: no speed bonus.
        self.assertEqual(srs.compute_score('clean', 15 * 60, 'easy', 1), 9)

    def test_clean_fast_solve_earns_bonus(self):
        # 5 of 20 minutes used: +1 speed bonus.
        self.assertEqual(srs.compute_score('clean', 5 * 60, 'easy', 1), 10)

    def test_many_tries_costs_a_point(self):
        self.assertEqual(srs.compute_score('hints', 30 * 60, 'medium', 4), 5)

    def test_partial_never_drops_below_one(self):
        self.assertEqual(srs.compute_score('partial', 39 * 60, 'medium', 9), 2)


class Sm2Tests(SimpleTestCase):
    """
    Tests for the SM-2 scheduler math.
    """

    def test_first_pass_reviews_next_day(self):
        easiness, interval, reps = srs.sm2_update(2.5, 0, 0, 8)
        self.assertEqual((interval, reps), (1, 1))

    def test_second_pass_reviews_in_six_days(self):
        easiness, interval, reps = srs.sm2_update(2.5, 1, 1, 8)
        self.assertEqual((interval, reps), (6, 2))

    def test_third_pass_multiplies_by_easiness(self):
        easiness, interval, reps = srs.sm2_update(2.5, 6, 2, 10)
        self.assertEqual(reps, 3)
        self.assertGreater(interval, 6)

    def test_failing_score_resets_cycle(self):
        easiness, interval, reps = srs.sm2_update(2.8, 15, 3, 3)
        self.assertEqual((interval, reps), (1, 0))

    def test_easiness_never_drops_below_minimum(self):
        easiness = 1.3
        for _ in range(10):
            easiness, _, _ = srs.sm2_update(easiness, 1, 1, 6)
        self.assertGreaterEqual(easiness, srs.MIN_EASINESS)


class ReviewScheduleTests(APITestCase):
    """
    Tests for review-state updates on completion and the daily plan.
    """

    def setUp(self):
        user_model = get_user_model()
        self.user = user_model.objects.create_user(
            username='alice', email='alice@example.com', password='pw')
        self.easy = Problem.objects.create(
            id='two-sum', name='Two Sum', lc_id='two-sum',
            difficulty='easy', category='arrays-hashing')
        self.medium = Problem.objects.create(
            id='course-schedule', name='Course Schedule', lc_id='course-schedule',
            difficulty='medium', category='graphs')
        self.hard = Problem.objects.create(
            id='word-ladder', name='Word Ladder', lc_id='word-ladder',
            difficulty='hard', category='graphs')
        self.client.force_authenticate(self.user)

    def _complete(self, problem, body):
        attempt = Attempt.objects.create(user=self.user, problem=problem)
        url = reverse('attempt-complete', args=[attempt.id])
        return attempt, self.client.patch(url, body, format='json')

    def test_completing_with_outcome_computes_score_and_schedules_review(self):
        attempt, resp = self._complete(self.easy, {'outcome': 'clean', 'num_attempts': 1})

        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        attempt.refresh_from_db()
        self.assertEqual(attempt.score, 10)  # instant solve earns the speed bonus

        state = ReviewState.objects.get(user=self.user, problem=self.easy)
        self.assertEqual(state.repetitions, 1)
        self.assertEqual(state.interval_days, 1)
        self.assertIsNotNone(state.next_review_at)

    def test_forfeit_schedules_a_next_day_retry(self):
        attempt, resp = self._complete(self.easy, {'score': 0})

        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        state = ReviewState.objects.get(user=self.user, problem=self.easy)
        self.assertEqual((state.interval_days, state.repetitions), (1, 0))

    def test_outcome_and_score_together_rejected(self):
        attempt, resp = self._complete(self.easy, {'outcome': 'clean', 'score': 5})
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)

    def test_today_plan_lists_due_reviews_and_new_picks(self):
        # A review that came due an hour ago, and one due tomorrow.
        now = timezone.now()
        ReviewState.objects.create(
            user=self.user, problem=self.easy,
            next_review_at=now - timedelta(hours=1))
        ReviewState.objects.create(
            user=self.user, problem=self.medium,
            next_review_at=now + timedelta(days=1))
        Attempt.objects.create(user=self.user, problem=self.easy)
        Attempt.objects.create(user=self.user, problem=self.medium)

        resp = self.client.get(reverse('plan-today'))

        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        review_ids = [p['id'] for p in resp.data['reviews']]
        self.assertEqual(review_ids, ['two-sum'])
        new_ids = [p['id'] for p in resp.data['new']]
        self.assertIn('word-ladder', new_ids)
        self.assertNotIn('two-sum', new_ids)

    def test_today_plan_requires_authentication(self):
        self.client.force_authenticate(None)
        resp = self.client.get(reverse('plan-today'))
        self.assertEqual(resp.status_code, status.HTTP_401_UNAUTHORIZED)


class AttemptGradeTests(APITestCase):
    """
    Tests for the AI grading endpoint (Claude is mocked throughout).
    """

    def setUp(self):
        user_model = get_user_model()
        self.user = user_model.objects.create_user(
            username='alice', email='alice@example.com', password='pw')
        self.problem = Problem.objects.create(
            id='two-sum', name='Two Sum', lc_id='two-sum',
            difficulty='easy', category='arrays-hashing')
        self.attempt = Attempt.objects.create(
            user=self.user, problem=self.problem)
        self.url = reverse('attempt-grade', args=[self.attempt.id])
        self.client.force_authenticate(self.user)

    def test_unavailable_without_credentials(self):
        with mock.patch('problems.grading.is_available', return_value=False):
            resp = self.client.post(self.url, {'code': 'def x(): pass'}, format='json')
        self.assertEqual(resp.status_code, status.HTTP_503_SERVICE_UNAVAILABLE)

    def test_grade_returns_suggestion(self):
        from problems.grading import GradeSuggestion
        suggestion = GradeSuggestion(
            outcome='hints', feedback='Solid hash-map approach; watch the edge case.')
        with mock.patch('problems.grading.is_available', return_value=True), \
                mock.patch('problems.views.grading.grade_solution',
                           return_value=suggestion) as graded:
            resp = self.client.post(
                self.url, {'code': 'def two_sum(nums, t): ...'}, format='json')

        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(resp.data['outcome'], 'hints')
        self.assertIn('hash-map', resp.data['feedback'])
        graded.assert_called_once()

    def test_grade_requires_code(self):
        with mock.patch('problems.grading.is_available', return_value=True):
            resp = self.client.post(self.url, {'code': '  '}, format='json')
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)

    def test_grade_failure_maps_to_bad_gateway(self):
        with mock.patch('problems.grading.is_available', return_value=True), \
                mock.patch('problems.views.grading.grade_solution',
                           side_effect=RuntimeError('api down')):
            resp = self.client.post(self.url, {'code': 'x'}, format='json')
        self.assertEqual(resp.status_code, status.HTTP_502_BAD_GATEWAY)

    def test_cannot_grade_completed_attempt(self):
        Attempt.objects.filter(pk=self.attempt.pk).update(
            score=5, duration=10, num_attempts=1)
        with mock.patch('problems.grading.is_available', return_value=True):
            resp = self.client.post(self.url, {'code': 'x'}, format='json')
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)

    def test_config_reports_grading_availability(self):
        with mock.patch('problems.views.grading.is_available', return_value=True):
            resp = self.client.get(reverse('client-config'))
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertTrue(resp.data['ai_grading'])
