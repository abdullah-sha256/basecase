"""
Aggregate practice statistics for the stats/history page.

All figures are derived from completed Attempt rows (score is not null)
plus the problem catalog, computed per request in the user's local day
boundaries where day-level grouping matters.
"""
from collections import defaultdict
from datetime import timedelta

from django.utils import timezone

from .models import Attempt, Problem

HEATMAP_WEEKS = 12
RECENT_LIMIT = 15
PASSING_SCORE = 6  # keep in sync with srs.PASSING_SCORE


def _streak(active_days):
    """
    Longest run of consecutive days ending today or yesterday, given a
    set of date objects on which the user completed an attempt.
    """
    if not active_days:
        return 0
    today = timezone.localdate()
    if today not in active_days and (today - timedelta(days=1)) not in active_days:
        return 0
    streak = 0
    day = today if today in active_days else today - timedelta(days=1)
    while day in active_days:
        streak += 1
        day -= timedelta(days=1)
    return streak


def build_stats(user):
    """
    Return the full stats payload for a user.
    """
    completed = list(
        Attempt.objects
        .filter(user=user, score__isnull=False)
        .select_related('problem')
        .order_by('timestamp')
    )

    total_attempts = len(completed)
    solved_problem_ids = {
        a.problem_id for a in completed if a.score >= PASSING_SCORE
    }
    total_solved = len(solved_problem_ids)
    scores = [a.score for a in completed]
    avg_score = round(sum(scores) / len(scores), 1) if scores else 0
    total_minutes = sum(a.duration or 0 for a in completed)

    # Activity heatmap: attempts per local day over the trailing window.
    today = timezone.localdate()
    window_start = today - timedelta(days=HEATMAP_WEEKS * 7 - 1)
    per_day = defaultdict(int)
    active_days = set()
    for attempt in completed:
        day = timezone.localtime(attempt.timestamp).date()
        active_days.add(day)
        if day >= window_start:
            per_day[day] += 1
    heatmap = [
        {'date': (window_start + timedelta(days=i)).isoformat(),
         'count': per_day.get(window_start + timedelta(days=i), 0)}
        for i in range(HEATMAP_WEEKS * 7)
    ]

    # Per-category coverage: solved vs. total in each category.
    totals_by_category = defaultdict(int)
    for problem in Problem.objects.all():
        totals_by_category[problem.category] += 1
    solved_by_category = defaultdict(int)
    for problem in Problem.objects.filter(id__in=solved_problem_ids):
        solved_by_category[problem.category] += 1
    categories = [
        {
            'category': category,
            'label': label,
            'solved': solved_by_category.get(category, 0),
            'total': totals_by_category.get(category, 0),
        }
        for category, label in Problem.Category.choices
        if totals_by_category.get(category, 0) > 0
    ]

    # Recent completed attempts, newest first.
    recent = [
        {
            'problem_id': a.problem_id,
            'name': a.problem.name,
            'difficulty': a.problem.difficulty,
            'score': a.score,
            'duration': a.duration,
            'num_attempts': a.num_attempts,
            'timestamp': a.timestamp.isoformat(),
        }
        for a in reversed(completed[-RECENT_LIMIT:])
    ]

    return {
        'totals': {
            'attempts': total_attempts,
            'solved': total_solved,
            'catalog': Problem.objects.count(),
            'avg_score': avg_score,
            'minutes': total_minutes,
            'streak': _streak(active_days),
        },
        'heatmap': heatmap,
        'categories': categories,
        'recent': recent,
    }
