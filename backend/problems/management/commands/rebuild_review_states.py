from datetime import timedelta

from django.core.management.base import BaseCommand

from problems import srs
from problems.models import Attempt, ReviewState


class Command(BaseCommand):
    help = ('Rebuild spaced-repetition review states by replaying every '
            'completed attempt in chronological order.')

    def handle(self, *args, **options):
        ReviewState.objects.all().delete()

        states = {}
        completed = (Attempt.objects
                     .exclude(score__isnull=True)
                     .order_by('timestamp'))
        for attempt in completed:
            key = (attempt.user_id, attempt.problem_id)
            easiness, interval, reps = states.get(
                key, (srs.DEFAULT_EASINESS, 0, 0))
            easiness, interval, reps = srs.sm2_update(
                easiness, interval, reps, attempt.score)
            states[key] = (easiness, interval, reps)

            ReviewState.objects.update_or_create(
                user_id=attempt.user_id,
                problem_id=attempt.problem_id,
                defaults={
                    'easiness': easiness,
                    'interval_days': interval,
                    'repetitions': reps,
                    'last_reviewed_at': attempt.timestamp,
                    'next_review_at': attempt.timestamp + timedelta(days=interval),
                },
            )

        self.stdout.write(self.style.SUCCESS(
            f'Rebuilt {len(states)} review states from '
            f'{completed.count()} completed attempts.'))
