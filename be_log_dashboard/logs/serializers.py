from rest_framework import serializers
from .models import Source, Log


class SourceSerializer(serializers.ModelSerializer):
    logs_count = serializers.IntegerField(source="logs.count", read_only=True)

    class Meta:
        model = Source
        fields = ["id", "name", "description", "log_format", "user", "logs_count"]
