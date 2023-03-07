from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from rest_framework import status
from django.utils.translation import gettext as _


class TokenObtainPairView(APIView):
    # This view allows unauthenticated requests
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs) -> Response:
        """This method handles POST requests to Token Obtain View

        Args:
            request (HttpRequest): { username: <username>, password: <password>}


        Returns:
            Response: if valid request { user: {username:<username>, email:<email>, id: <id>}, access: <access>,refresh: <refresh>}
                otherwise {error: <erorr_message>} with status code 401 or 400
        """
        username = request.data.get("username")
        password = request.data.get("password")
        if username is None and password is None:
            return Response(
                {"error": _("Username and password are required")},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if username is None:
            return Response(
                {"error": _("Username is required")}, status=status.HTTP_400_BAD_REQUEST
            )
        if password is None:
            return Response(
                {"error": _("Password is required")}, status=status.HTTP_400_BAD_REQUEST
            )
        user = authenticate(username=username, password=password)
        if user:
            refresh = RefreshToken.for_user(user)
            return Response(
                {
                    "user": {
                        "username": user.username,
                        "email": user.email,
                        "id" : user.pk,
                        "last_login": user.last_login
                    },
                    "refresh": str(refresh),
                    "access": str(refresh.access_token),
                },
                status=status.HTTP_200_OK,
            )
        else:
            return Response(
                data={"error": _("Invalid credentials")},
                status=status.HTTP_401_UNAUTHORIZED,
            )


class TokenRefreshView(APIView):
    # Checking if the user is authenticated.
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs) -> Response:
        """This Method handles the refresh token request for the view

        Args:
            request (HttpRequest): { "refresh": <refresh_token>}

        Returns:
            Response: if valid response { "access": <access_token> }
                otherwise { "error": <error> } and status = 400
        """
        refresh = request.data.get("refresh")
        if refresh is None:
            return Response(
                {"error": _("Invalid refresh token")},
                status=status.HTTP_401_UNAUTHORIZED
            )

        token = RefreshToken(refresh)
        return Response(
            {
                "access": str(token.access_token),
            },
            status=status.HTTP_200_OK,
        )
