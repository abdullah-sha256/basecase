from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.exceptions import MethodNotAllowed
from django.contrib.auth import get_user_model
from rest_framework import viewsets, mixins, permissions, status
from .serializers import UserSerializer


class UserViewSet(mixins.UpdateModelMixin,
                    viewsets.GenericViewSet):
    """
    A viewset that provides custom actions for user registration, login, and logout,
    while limiting the available HTTP methods to update and partially update a user.

    The 'retrieve' action is disabled, and the 'list' action returns the current authenticated user's details.
    
    Custom Actions:
        - register: Allows any user to register by providing the necessary data.
        - login: Allows any user to obtain an authentication token by providing valid credentials.
        - logout: Allows an authenticated user to log out by deleting their authentication token.
    """
    serializer_class = UserSerializer
    queryset = get_user_model().objects.all()
    permission_classes = [permissions.IsAuthenticated]

    def list(self, request, *args, **kwargs):
        """
        Return the details of the current logged-in user.
        """
        user = request.user
        serializer = self.get_serializer(user)
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        """
        Disable creating a new user through this viewset. Use the 'register' action instead.
        """
        raise MethodNotAllowed('POST')

    def destroy(self, request, *args, **kwargs):
        """
        Disable deleting a user through this viewset.
        """
        raise MethodNotAllowed('DELETE')

    @action(detail=False, methods=['post'], permission_classes=[permissions.AllowAny])
    def register(self, request):
        """
        Register a new user.
        
        URI: POST /account/register/
        """
        user_serializer = self.get_serializer(data=request.data)
        user_serializer.is_valid(raise_exception=True)
        user = user_serializer.save()

        token, _ = Token.objects.get_or_create(user=user)
        return Response({
            'user': user_serializer.data,
            'token': token.key
        }, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['post'], permission_classes=[permissions.AllowAny])
    def login(self, request):
        """
        Login a user and return an authentication token.
        
        URI: POST /account/login/
        """
        view = ObtainAuthToken.as_view()
        return view(request._request)

    @action(detail=False, methods=['delete'], permission_classes=[permissions.IsAuthenticated])
    def logout(self, request):
        """
        Logout a user by deleting their authentication token.
        
        URI: POST /account/logout/
        """
        Token.objects.filter(user=request.user).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)