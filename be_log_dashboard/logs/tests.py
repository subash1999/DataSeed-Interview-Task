from datetime import datetime

from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework import status
from rest_framework.test import  RequestsClient, APIRequestFactory, APITestCase, force_authenticate
from .models import Source
from django.utils.translation import gettext as _
from .views import SourceViewSet
# Create your tests here.
class AuthTestCase(APITestCase):
    """Test case to check the login

    Inherits:
        rest_framework.test.APITestCase
    """
    def setUp(self) -> None:
        now = datetime.now()
        
        self.client =  RequestsClient()
       
        self.username = "test" + now.strftime("%m/%d/%Y,%H:%M:%S")
        self.password = self.username
        self.email = self.username + "@test.com"
        self.user = User.objects.create_user(username=self.username, password=self.password, email=self.email)
        self.name = "source1"
        self.source = Source.objects.create(name=self.name,user=self.user)

    def test_source_list(self):     
        url = reverse("source-list")   
        view = SourceViewSet.as_view({'get': 'list'})
        factory = APIRequestFactory()
        request = factory.get(
            url, format="json"
        )
        force_authenticate(request, user=self.user)
        response = view(request)
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        self.assertEqual(1, len(response.data))
        if(len(response.data)> 0):
            self.assertIsInstance(response.data[0].get("logs_count"),int )
    
    def test_create_source_same_name(self):     
        url = reverse("source-list")   
        view = SourceViewSet.as_view({'post': 'create'})
        factory = APIRequestFactory()
        request = factory.post(
            url, {"user":self.user.pk,"name":self.name},format="json"
        )
        force_authenticate(request, user=self.user)
        response = view(request)
        self.assertEqual(status.HTTP_400_BAD_REQUEST, response.status_code)
    
    def test_create_source_valid(self):     
        url = reverse("source-list")   
        view = SourceViewSet.as_view({'post': 'create'})
        factory = APIRequestFactory()
        request = factory.post(
            url, {"user":self.user.pk,"name":self.name+"_2"},format="json"
        )
        force_authenticate(request, user=self.user)
        response = view(request)
        self.assertEqual(status.HTTP_201_CREATED, response.status_code)