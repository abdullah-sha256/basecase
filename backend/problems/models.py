from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
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

    id = models.CharField(max_length=100, primary_key=True, verbose_name="Problem ID")

    name = models.CharField(max_length=100, unique=True)

    lc_id = models.CharField(max_length=100, unique=True)

    difficulty = models.CharField(max_length=7, choices=Difficulty.choices)

    category = models.CharField(max_length=100, choices=Category.choices)

    def get_last_attempt(self, user):
        if user.is_anonymous:
            return None
        return Attempt.objects.filter(user=user, problem=self).order_by('-timestamp').first()

    def get_attempts(self, user):
        if user.is_anonymous:
            return None
        return Attempt.objects.filter(user=user, problem=self).order_by('-timestamp').all()

    def __str__(self):
        return f'Problem "{self.name}" - Category: {self.get_category_display()}, Difficulty: {self.get_difficulty_display()}'

# TODO: Consider adding efficiency, notes and solution section. 
class Attempt(models.Model):
    user = models.ForeignKey(get_user_model(), on_delete=models.CASCADE, verbose_name="User")
    problem = models.ForeignKey('Problem', on_delete=models.CASCADE, verbose_name="Problem")
    timestamp = models.DateTimeField(auto_now_add=True, verbose_name="Timestamp")
    duration = models.PositiveSmallIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(1440)],
        verbose_name="Duration (minutes)",
        null=True,  # Allow null to indicate in progress
        blank=True
    )
    score = models.PositiveSmallIntegerField(
        validators=[MinValueValidator(0), MaxValueValidator(10)],
        verbose_name="Score",
        null=True,  # Allow null to indicate in progress
        blank=True
    )
    num_attempts = models.PositiveSmallIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(10)],
        verbose_name="Number of attempts until completed",
        null=True,  # Allow null to indicate in progress
        blank=True
    )

    class Meta:
        unique_together = ('user', 'problem', 'timestamp')
        verbose_name = "Problem Attempt"
        verbose_name_plural = "Problem Attempts"

    def __str__(self):
        return f'Attempt by {self.user.username} on {self.problem.name} - Started at {self.timestamp.strftime("%Y-%m-%d %H:%M:%S")} with score: {self.score if self.score is not None else "N/A"}'

    @property
    def is_in_progress(self):
        """
        Returns True if the attempt is in progress, meaning score, duration, 
        and num_attempts are all None (indicating that the attempt has not been completed).
        """
        return self.score is None and self.duration is None and self.num_attempts is None

    @property
    def has_abandoned(self):
        """
        Returns True if the user has abandoned the problem, 
        which is defined as having a score of 0.
        """
        return self.score == 0