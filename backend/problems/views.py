import math
from django.utils import timezone
from .models import Problem, Attempt
from .serializers import (
    ProblemListSerializer,
    ProblemDetailSerializer,
    AttemptSerializer,
    AttemptCompleteSerializer,
)
from rest_framework import generics, permissions, status, response

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

    The client submits `score` (0-10; 0 means forfeited/failed) and
    optionally `num_attempts`. The elapsed `duration` is computed
    server-side from the attempt's start timestamp.
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
        serializer.save(duration=duration)