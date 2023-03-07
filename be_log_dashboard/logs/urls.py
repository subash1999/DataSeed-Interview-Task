from django.urls import path

from . import views
from django.urls import path, include
from rest_framework import routers
from .views import SourceViewSet

router = routers.DefaultRouter()

router.register(r'source', SourceViewSet, basename="source")

urlpatterns = [

    path('', include(router.urls)),
]