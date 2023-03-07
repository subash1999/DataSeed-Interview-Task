from django.core.paginator import Paginator
from django.db.models import Q
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from rest_framework.pagination import PageNumberPagination
import logging
logger = logging.getLogger('app')

from .models import Source
from .serializers import SourceSerializer
from rest_framework.filters import SearchFilter
from rest_framework.pagination import PageNumberPagination

class SourcePagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100

class SourceViewSet(viewsets.ModelViewSet):
    """View for the CRUD operations on source model
    
    Model: logs.models.Source
    Serializer: logs.serializers.SourceSerializer
    permission: only authenticated users
    """
    queryset = Source.objects.all()
    serializer_class = SourceSerializer
    pagination_class = SourcePagination
    filter_backends = [SearchFilter]
    search_fields = ['name', 'description']
    permission_classes = [IsAuthenticated]

