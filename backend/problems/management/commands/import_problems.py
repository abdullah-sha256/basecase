import json, os
from django.core.management.base import BaseCommand
from problems.models import Problem

class Command(BaseCommand):
    help = 'Import problems from a JSON file'

    def handle(self, *args, **kwargs):
        current_dir = os.path.dirname(__file__)
        file_path = os.path.join(current_dir, 'problems.json')

        with open(file_path) as f:
            data = json.load(f)

        for problem in data:
            Problem.objects.create(
                id=problem['id'],
                name=problem['name'],
                lc_id=problem['lc_id'],
                difficulty=problem['difficulty'],
                category=problem['category']
            )

        self.stdout.write(self.style.SUCCESS('Successfully imported problems'))
