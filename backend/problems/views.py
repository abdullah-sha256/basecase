import math
from django.utils import timezone
from . import grading, srs, stats
from .models import Problem, Attempt, ReviewState
from .serializers import (
    ProblemListSerializer,
    ProblemDetailSerializer,
    AttemptSerializer,
    AttemptCompleteSerializer,
)
from rest_framework import generics, permissions, status, response, views

class ProblemList(generics.ListAPIView):
    """
    API view to retrieve a list of problems.
    """
    queryset = Problem.objects.all()
    serializer_class = ProblemListSerializer
    pagination_class = None

    def get_serializer_context(self):
        """
        Add the request context to the serializer context.
        """
        context = super().get_serializer_context()
        include_param = self.request.query_params.get('include', '')
        context['include_lastAttempt'] = 'lastAttempt' in include_param.split(',')
        return context

class AttemptListCreate(generics.RetrieveAPIView, generics.CreateAPIView):
    """
    API view to retrieve a problem and its list of attempts or create a new attempt for a specific problem.
    """
    queryset = Problem.objects.all()
    serializer_class = ProblemDetailSerializer
    permission_classes = (permissions.IsAuthenticated,)
    pagination_class = None

    def post(self, request, *args, **kwargs):
        """
        Handle POST requests to create a new attempt for the specific problem.
        """
        problem = self.get_object()

        attempt_data = request.data.copy()
        attempt_data['user'] = request.user.id
        attempt_data['problem'] = problem.id

        serializedAttempt = AttemptSerializer(data=attempt_data)
        if serializedAttempt.is_valid():
            serializedAttempt.save(problem=problem, user=request.user)
            return response.Response(serializedAttempt.data, status=status.HTTP_201_CREATED)
        return response.Response(serializedAttempt.errors, status=status.HTTP_400_BAD_REQUEST)

class AttemptComplete(generics.UpdateAPIView):
    """
    API view to complete (score) an in-progress attempt.

    The client submits either a rubric `outcome` (from which the score is
    computed) or a raw `score` of 0 for forfeit/time-up, plus optionally
    `num_attempts`. The elapsed `duration` is computed server-side from
    the attempt's start timestamp, and the user's spaced-repetition state
    for the problem advances with the resulting score.
    """
    serializer_class = AttemptCompleteSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        # Users can only complete their own attempts.
        return Attempt.objects.filter(user=self.request.user)

    def perform_update(self, serializer):
        attempt = serializer.instance
        elapsed_seconds = (timezone.now() - attempt.timestamp).total_seconds()
        # Duration is stored in whole minutes, within the model's 1-1440 bounds.
        duration = min(max(math.ceil(elapsed_seconds / 60), 1), 1440)

        outcome = serializer.validated_data.pop('outcome', None)
        if outcome is not None:
            score = srs.compute_score(
                outcome, elapsed_seconds, attempt.problem.difficulty,
                serializer.validated_data.get('num_attempts'))
            saved = serializer.save(duration=duration, score=score)
        else:
            saved = serializer.save(duration=duration)

        srs.record_review(saved.user, saved.problem, saved.score)


class AttemptGrade(views.APIView):
    """
    API view that asks Claude for an advisory grade of a pasted solution.

    POST /attempts/<id>/grade/ with {"code": "...", "notes": "..."}.
    Returns {"outcome", "feedback"} for the client to prefill the rubric;
    the user can override before submitting. Returns 503 when AI grading
    is not configured on the server.
    """
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, pk):
        if not grading.is_available():
            return response.Response(
                {'detail': 'AI grading is not configured on this server.'},
                status=status.HTTP_503_SERVICE_UNAVAILABLE)

        attempt = generics.get_object_or_404(
            Attempt.objects.filter(user=request.user), pk=pk)
        if not attempt.is_in_progress:
            return response.Response(
                {'detail': 'This attempt has already been completed.'},
                status=status.HTTP_400_BAD_REQUEST)

        code = (request.data.get('code') or '').strip()
        if not code:
            return response.Response(
                {'detail': 'A solution is required to grade.'},
                status=status.HTTP_400_BAD_REQUEST)
        if len(code) > 20000:
            return response.Response(
                {'detail': 'The solution is too long to grade.'},
                status=status.HTTP_400_BAD_REQUEST)

        try:
            suggestion = grading.grade_solution(
                attempt.problem, code, (request.data.get('notes') or '')[:2000])
        except Exception:
            return response.Response(
                {'detail': 'AI grading failed. Please score manually.'},
                status=status.HTTP_502_BAD_GATEWAY)

        return response.Response({
            'outcome': suggestion.outcome,
            'feedback': suggestion.feedback,
        })


class TodayPlan(views.APIView):
    """
    API view returning today's study plan: problems due for review per
    the spaced-repetition schedule, plus fresh picks from the user's
    least-covered categories.
    """
    permission_classes = (permissions.IsAuthenticated,)

    NEW_PICKS = 2

    def get(self, request):
        now = timezone.now()

        due_states = (ReviewState.objects
                      .filter(user=request.user, next_review_at__lte=now)
                      .order_by('next_review_at')
                      .select_related('problem'))
        due_problems = [state.problem for state in due_states]

        attempted_ids = (Attempt.objects
                         .filter(user=request.user)
                         .values_list('problem_id', flat=True)
                         .distinct())
        fresh = Problem.objects.exclude(id__in=attempted_ids)

        # Pick new problems from the categories the user has covered least.
        attempted_by_category = {}
        for problem in Problem.objects.filter(id__in=attempted_ids):
            attempted_by_category[problem.category] = (
                attempted_by_category.get(problem.category, 0) + 1)
        new_problems = sorted(
            fresh,
            key=lambda p: (attempted_by_category.get(p.category, 0), p.id),
        )[:self.NEW_PICKS]

        context = {'request': request, 'include_lastAttempt': True}
        return response.Response({
            'reviews': ProblemListSerializer(
                due_problems, many=True, context=context).data,
            'new': ProblemListSerializer(
                new_problems, many=True, context=context).data,
        })


class ClientConfig(views.APIView):
    """
    API view exposing feature availability to the frontend.
    """
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        return response.Response({'ai_grading': grading.is_available()})


class Stats(views.APIView):
    """
    API view returning aggregate practice statistics for the current
    user: headline totals, a daily activity heatmap, per-category
    coverage, and recent completed attempts.
    """
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        return response.Response(stats.build_stats(request.user))