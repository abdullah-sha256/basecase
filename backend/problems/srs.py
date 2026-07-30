"""
Spaced-repetition scheduling (SM-2) and rubric-based attempt scoring.

Scores are 0-10 (the Attempt model's scale). SM-2 works on 0-5 quality
grades, so scores are halved when fed into the scheduler.
"""
import math
from datetime import timedelta

from django.utils import timezone

# Attempt time budgets in seconds, by difficulty. Keep in sync with
# frontend/src/constants/utils.ts.
DIFFICULTY_TO_MAX_ATTEMPT_SECONDS = {
    'easy': 20 * 60,
    'medium': 40 * 60,
    'hard': 60 * 60,
}

# Rubric outcomes and their base scores (0-10).
OUTCOME_BASE_SCORES = {
    'clean': 9,    # solved without help
    'hints': 6,    # solved after hints or peeking at the approach
    'partial': 3,  # partial progress, didn't finish
    'failed': 0,   # couldn't solve / forfeit / time-up
}

# SM-2 constants.
MIN_EASINESS = 1.3
DEFAULT_EASINESS = 2.5
PASSING_SCORE = 6  # scores below this reset the review cycle


def compute_score(outcome, duration_seconds, difficulty, num_attempts=None):
    """
    Compute a 0-10 score from the rubric outcome plus objective signals.

    - Fast, clean solves earn a bonus: finishing within half the time
      budget adds 1.
    - Grinding through many submissions costs 1 (4 or more tries).
    - A failed outcome is always 0 (it marks the attempt as abandoned).
    """
    base = OUTCOME_BASE_SCORES[outcome]
    if outcome == 'failed':
        return 0

    score = base
    budget = DIFFICULTY_TO_MAX_ATTEMPT_SECONDS[difficulty]
    if duration_seconds <= budget / 2:
        score += 1
    if num_attempts is not None and num_attempts >= 4:
        score -= 1

    return max(1, min(10, score))


def sm2_update(easiness, interval_days, repetitions, score):
    """
    Advance an SM-2 review state by one scored attempt.

    Returns (easiness, interval_days, repetitions). `score` is 0-10 and
    mapped to SM-2's 0-5 quality grade.
    """
    quality = score / 2

    if score < PASSING_SCORE:
        # Failed recall: reset the cycle; see it again tomorrow.
        return easiness, 1, 0

    easiness = easiness + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
    easiness = max(MIN_EASINESS, easiness)

    repetitions += 1
    if repetitions == 1:
        interval_days = 1
    elif repetitions == 2:
        interval_days = 6
    else:
        interval_days = math.ceil(interval_days * easiness)

    return easiness, interval_days, repetitions


def record_review(user, problem, score):
    """
    Update (or create) the user's ReviewState for a problem after a
    scored attempt, and return it.
    """
    from .models import ReviewState

    state, _ = ReviewState.objects.get_or_create(
        user=user,
        problem=problem,
        defaults={'easiness': DEFAULT_EASINESS, 'interval_days': 0, 'repetitions': 0},
    )
    state.easiness, state.interval_days, state.repetitions = sm2_update(
        state.easiness, state.interval_days, state.repetitions, score)
    state.last_reviewed_at = timezone.now()
    state.next_review_at = state.last_reviewed_at + timedelta(days=state.interval_days)
    state.save()
    return state
