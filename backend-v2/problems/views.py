from rest_framework import generics
from .models import Problem
from .serializers import ProblemSerializer
from rest_framework import generics

class ProblemListCreate(generics.ListCreateAPIView):
    """
    API view to retrieve a list of problems or create a new problem.

    GET:
    Return a list of all existing problems. Supports filtering, searching, and ordering 
    based on specific fields if configured in the serializer or view.

    POST:
    Create a new problem instance. The request must include all required fields 
    specified in the ProblemSerializer. Returns the created problem data if successful.

    Attributes:
        queryset: A queryset that retrieves all Problem instances from the database.
        serializer_class: The serializer class that handles the serialization and 
        deserialization of Problem instances.
    """
    queryset = Problem.objects.all()
    serializer_class = ProblemSerializer