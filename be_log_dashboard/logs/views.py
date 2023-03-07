from rest_framework import viewsets
from .models import Source
from .serializers import SourceSerializer
from rest_framework.permissions import IsAuthenticated

class SourceViewSet(viewsets.ModelViewSet):
    """View for the CRUD operations on source model
        Model: logs.models.Source
        Serializer: logs.serializers.SourceSerializer
        permission: only authenticated users
    """
    queryset = Source.objects.all()
    serializer_class = SourceSerializer
    permission_classes = [IsAuthenticated]
