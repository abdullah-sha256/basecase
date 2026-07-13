from unicodedata import category
from rest_framework import serializers
from .models import Problem, Attempt
from django.contrib.auth import get_user_model

class UserSerializer(serializers.ModelSerializer):
    """
    Serializer for the User model.
    """
    class Meta:
        model = get_user_model()
        fields = ('id', 'username', 'email')

class ProblemListSerializer(serializers.ModelSerializer):
    """
    Serializer for the Problem model when used in a list view.

    Additional Fields:
    -   `last_attempt`: Represents the user's most recent attempt on the problem.
        This field is conditionally included based on the context provided to the serializer.
        It serializes key details such as the timestamp, duration, score, and number of attempts.
    """
    class Meta:
        model = Problem
        fields = '__all__'

    last_attempt = serializers.SerializerMethodField()

    def get_last_attempt(self, problem):
        """
        Retrieve the last attempt for the given problem made by the current user.
        """
        fields = ['timestamp', 'duration', 'score', 'num_attempts']
        last_attempt = problem.get_last_attempt(self.context['request'].user)

        if last_attempt:
            return AttemptSerializer(last_attempt, fields=fields).data
        return None
    
    def to_representation(self, instance):
        """
        Override to_representation to conditionally include the lastAttempt field.

        This method checks the serializer context to determine whether the 'lastAttempt'
        field should be included in the serialized representation of the Problem instance.
        """
        representation = super().to_representation(instance)
        if not self.context.get('include_lastAttempt'):
            representation.pop('last_attempt', None)
        return representation
    
class ProblemDetailSerializer(serializers.ModelSerializer):
    """
    Serializer for the Problem model when used in a detail view.

    Additional Fields:
    - `attempts`: A list of all attempts made by the current user on the problem.
      This gives a detailed history of how the user has engaged with the problem.
    """
    attempts = serializers.SerializerMethodField()

    class Meta:
        model = Problem
        fields = '__all__'

    def get_attempts(self, problem):
        """
        Retrieve all attempts for the given problem made by the current user.
        """
        attempts = problem.get_attempts(self.context['request'].user)
        if attempts:
            return AttemptSerializer(attempts, many=True).data
        return []

class AttemptSerializer(serializers.ModelSerializer):
    """
    Serializer for the Attempt model.
    """
    class Meta:
        model = Attempt
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        """
        Initialize the AttemptSerializer with optional dynamic field selection.

        The `fields` argument can be used to specify which fields should be included
        in the serialized representation of the Attempt instance. If `fields` is not
        provided, the default behavior is to include all fields.

        Example:
            AttemptSerializer(instance=attempt, fields=['id', 'timestamp', 'score'])
        """
        fields = kwargs.pop('fields', None)
        super().__init__(*args, **kwargs)

        if fields is not None:
            allowed = set(fields)
            existing = set(self.fields.keys())
            for field_name in existing - allowed:
                self.fields.pop(field_name)