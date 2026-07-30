import time

from django.core.management.base import BaseCommand

from problems import leetcode
from problems.models import Problem


class Command(BaseCommand):
    help = ('Prefetch problem statements from LeetCode into the database '
            'so grading never waits on a network fetch.')

    def add_arguments(self, parser):
        parser.add_argument(
            '--delay', type=float, default=0.5,
            help='Seconds to sleep between requests (default 0.5).')

    def handle(self, *args, **options):
        missing = Problem.objects.filter(statement='')
        fetched = failed = 0

        for problem in missing:
            statement = leetcode.get_statement(problem)
            if statement:
                fetched += 1
            else:
                failed += 1
                self.stdout.write(f'  no statement for {problem.lc_id}')
            time.sleep(options['delay'])

        self.stdout.write(self.style.SUCCESS(
            f'Fetched {fetched} statements '
            f'({failed} unavailable, {Problem.objects.exclude(statement="").count()} total cached).'))
