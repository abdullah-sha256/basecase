from django.db import models
from django.contrib.auth import get_user_model

class Problem(models.Model):
    
    class Difficulty(models.TextChoices):
        """
        Allowed difficulty levels for a problem.
        """
        EASY = 'easy', 'Easy'
        MEDIUM = 'medium', 'Medium'
        HARD = 'hard', 'Hard'

    class Category(models.TextChoices):
        """
        Allowed categories for a problem.
        """
        ARRAYS_HASHING = 'arrays-hashing', 'Arrays and Hashing'
        TWO_POINTERS = 'two-pointers', "Two Pointers"
        SLIDING_WINDOW = 'sliding-window', "Sliding Window"
        STACK = 'stack', "Stack"
        BINARY_SEARCH = 'binary-search', 'Binary Search'
        LINKED_LIST = 'linked-list', 'Linked List'
        TREES = 'trees', 'Trees'
        HEAP_PQ = 'heap-pq', 'Heap / Priority Queue'
        BACKTRACKING = 'backtracking', 'Backtracking'
        TRIES = 'tries', 'Tries',
        GRAPHS = 'graphs', 'Graphs'
        ADVANCED_GRAPHS = 'advanced-graphs', 'Advanced Graphs'
        DYNAMIC_1D = 'dynamic-1d', '1-D Dynamic Programming'
        DYNAMIC_2D = 'dynamic-2d', '2-D Dynamic Programming'
        GREEDY = 'greedy', 'Greedy'
        INTERVALS = 'intervals', 'Intervals'
        MATH_GEOM = 'math-geom', 'Math and Geometry'
        BIT_MANIP = 'bit-manip', 'Bit Manipulation'

    name = models.CharField(max_length=100, unique=True)

    leetcode_url = models.URLField(unique=True)

    difficulty = models.CharField(max_length=7, choices=Difficulty.choices)

    category = models.CharField(max_length=100, choices=Category.choices)

    def __str__(self):
        return f'{self.get_difficulty_display()} - {self.leetcode_url}'


class Attempt(models.Model):
    user = models.ForeignKey(get_user_model(), on_delete=models.CASCADE)
    problem = models.ForeignKey(Problem, on_delete=models.CASCADE)
    perceived_difficulty = models.CharField(max_length=7, choices=Problem.Difficulty.choices)
    time_taken = models.PositiveIntegerField(help_text="Time taken in minutes")
    date_time = models.DateTimeField(auto_now_add=True)
    completed = models.BooleanField(default=False)

    class Meta:
        unique_together = ('user', 'problem', 'date_time')

    def __str__(self):
        return f'{self.user.username} - {self.problem.leetcode_url} - {self.date_time}'