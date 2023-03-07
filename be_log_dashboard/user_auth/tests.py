from datetime import datetime

from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient, APIRequestFactory, APITestCase
from .views import TokenObtainPairView, TokenRefreshView
from django.utils.translation import gettext as _
from rest_framework_simplejwt.tokens import RefreshToken


class AuthTestCase(APITestCase):
    """Test case to check the login

    Inherits:
        rest_framework.test.APITestCase
    """
    def setUp(self) -> None:
        now = datetime.now()
        self.factory = APIRequestFactory()
        self.view = TokenObtainPairView.as_view()
        self.url = reverse("token_obtain_pair")
        self.username = "test" + now.strftime("%m/%d/%Y,%H:%M:%S")
        self.password = self.username
        self.email = self.username + "@test.com"
        User.objects.create_user(username=self.username, password=self.password, email=self.email)
        

    def test_valid_login(self):        
        request = self.factory.post(
            self.url, {"username": self.username, "password": self.password}, format="json"
        )
        response = self.view(request)
        user = User.objects.get(pk=response.data.get('user').get('id'))
        self.assertEqual(status.HTTP_200_OK, response.status_code,)
        self.assertEqual(user.username, response.data.get('user').get('username'))
        self.assertEqual(user.pk, response.data.get('user').get('id'))
        self.assertEqual(user.email, response.data.get('user').get('email'))
        self.assertEqual(user.last_login, response.data.get('user').get('last_login'))

    def test_invalid_login_invalid_username(self):
        request = self.factory.post(
            self.url, {"username": self.username+"invalid", "password": self.password}, format="json"
        )
        response = self.view(request)
        self.assertEqual(status.HTTP_401_UNAUTHORIZED,response.status_code)
        self.assertEqual(_("Invalid credentials"),response.data.get("error"))
    
    def test_invalid_login_invalid_password(self):
        request = self.factory.post(
            self.url, {"username": self.username, "password": self.password+"invalid"}, format="json"
        )
        response = self.view(request)
        self.assertEqual(status.HTTP_401_UNAUTHORIZED,response.status_code)
        self.assertEqual(_("Invalid credentials"),response.data.get("error"))
    
    def test_invalid_login_invalid_username_and_password(self):
        request = self.factory.post(
            self.url, {"username": self.username+"invalid", "password": self.password+"invalid"}, format="json"
        )
        response = self.view(request)
        self.assertEqual(status.HTTP_401_UNAUTHORIZED,response.status_code)
        self.assertEqual(_("Invalid credentials"),response.data.get("error"))
    
    def test_invalid_login_no_username_and_password(self):
        request = self.factory.post(
            self.url, {}, format="json"
        )
        response = self.view(request)
        self.assertEqual(status.HTTP_400_BAD_REQUEST, response.status_code)
        self.assertEqual(_("Username and password are required"),response.data.get("error"))
    
    def test_invalid_login_no_username(self):
        request = self.factory.post(
            self.url, {"password":self.password}, format="json"
        )
        response = self.view(request)
        self.assertEqual(status.HTTP_400_BAD_REQUEST, response.status_code)
        self.assertEqual(_("Username is required"),response.data.get("error"))
    
    def test_invalid_login_no_password(self):
        request = self.factory.post(
            self.url, {"username":self.username}, format="json"
        )
        response = self.view(request)
        self.assertEqual(status.HTTP_400_BAD_REQUEST, response.status_code)
        self.assertEqual(_("Password is required"),response.data.get("error"))
    
