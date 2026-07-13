from typing import Any, Dict
from django.contrib.auth import get_user_model
from rest_framework import serializers
from django.contrib.auth.models import AbstractBaseUser


class UserSerializer(serializers.ModelSerializer):
    """
    Serializer for the User model.

    This serializer handles the serialization and deserialization of user data,
    including the creation and updating of user instances. It ensures that passwords
    are securely hashed before being saved to the database.
    """

    class Meta:
        model = get_user_model()
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'password')
        extra_kwargs = {
            'password': {'write_only': True},
        }

    def create(self, validated_data: Dict[str, Any]) -> AbstractBaseUser:
        """
        Create a new user instance with a securely hashed password.

        This method overrides the default `create` method to ensure that the
        password provided in `validated_data` is hashed using the `create_user`
        method from the User model's manager.

        Args:
            validated_data (dict): The validated data from the serializer.

        Returns:
            User: The created user instance
        """
        user = self.Meta.model.objects.create_user(**validated_data)
        return user

    def update(self, instance: AbstractBaseUser, validated_data: Dict[str, Any]) -> AbstractBaseUser:
        """
        Update an existing user instance, securely hashing the password if provided.

        This method overrides the default `update` method to check if a password
        is present in `validated_data`. If it is, the password is hashed using
        the `set_password` method of the user instance before saving.

        Args:
            instance (User): The existing user instance to be updated.
            validated_data (dict): The validated data from the serializer.

        Returns:
            User: The updated user instance.
        """
        if 'password' in validated_data:
            instance.set_password(validated_data.pop('password'))

        return super().update(instance, validated_data)
