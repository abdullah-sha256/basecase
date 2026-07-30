from datetime import timedelta

from django.contrib.auth import get_user_model
from django.urls import reverse
from django.utils import timezone
from rest_framework import status
from rest_framework.test import APITestCase

from .models import Attempt, Problem


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
