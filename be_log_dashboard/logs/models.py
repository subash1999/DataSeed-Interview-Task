from django.db import models
from django.contrib.auth.models import User

# Create your models here.
from django.utils import timezone


class BaseModel(models.Model):
    """An abstract base model that includes common fields for all models in the application.

    Attributes:
        created_at (datetime): The date and time the object was created.
        updated_at (datetime): The date and time the object was last updated.

    Meta:
        abstract (bool): A flag indicating that this model is
            abstract and cannot be instantiated directly.
    """

    created_at = models.DateTimeField(default=timezone.now, editable=False)
    updated_at = models.DateTimeField(auto_now=True, editable=False)

    class Meta:
        abstract = True


class Source(BaseModel):
    """A Django model representing a source of logs that inherits from the BaseModel.

    Attributes:
        name (CharField): The name of the source. 
            A required field with a maximum length of 500 characters.
        user (ForeignKey): A foreign key to the built-in Django User model. 
            Represents the user who owns the source.
        log_format (TextField): The field helps the user to put a validate string 
            for each line of the logs to be bulk imported. 
            An optional field that can be blank or null.

    Methods:
        __str__(self): Returns the name of the source.

    """

    name = models.CharField(max_length=500, null=False, blank=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, blank=False, null=False, related_name="sources")
    log_format = models.TextField(blank=True, null=True)

    class Meta:
        unique_together = ('name', 'user',)

    def __str__(self) -> str:
        return str(self.name)


class Severity(BaseModel):
    """A Django model representing the severity levels 
        for a source that inherits from the BaseModel.

    Attributes:
        level (IntegerField): An integer field representing the severity level. 
            It is a required field and must be unique.
        name (TextField): A text field representing the name of the severity level. 
            It is a required field and must be unique.
        source (ForeignKey): A foreign key to the Source model. 
            It represents the source that the severity level is associated with.
        is_default (BooleanField): A boolean field representing whether 
            this severity level is the default one for the associated source.

    Methods:
        __str__(self): Returns a string representation of the severity level instance, 
            which includes the severity level and name.
    """

    level = models.IntegerField(blank=False, null=False, unique=True)
    name = models.TextField(blank=False, null=False, unique=True)
    source = models.ForeignKey(
        Source, on_delete=models.CASCADE, blank=False, null=False, related_name="severities"
    )
    is_default = models.BooleanField(blank=False, null=False, default=False)

    def __str__(self) -> str:
        return self.level + ": " + self.name


class Correlation(BaseModel):
    """A Django model representing a correlation in a project,
        which inherits from the BaseModel.

    Attributes:
        correlation_id (TextField): A text field representing the correlation ID. 
            It is a required field.
        description (TextField): A text field representing a description of the correlation. 
            It is an optional field.
        source (ForeignKey): A foreign key to the Source model. 
            It represents the source that the correlation is associated with.

    Methods:
        __str__(self) -> str: Returns a string representation of the correlation instance, 
            which includes the correlation ID.
    """

    correlation_id = models.TextField(blank=False, null=False)
    description = models.TextField(blank=True, null=True)
    source = models.ForeignKey(Source, on_delete=models.CASCADE, blank=False, null=False, related_name="correlations")

    def __str__(self) -> str:
        return str(self.correlation_id)


class Log(BaseModel):
    """
    A model representing a log message with its timestamp, 
        message content, correlation ID, and severity level.

    Attributes:
        timestamp (DateTimeField): The date and time the log message was created.
        message (TextField): The content of the log message.
        correlation (ForeignKey): The correlation ID associated with the log message, which can be null.
        severity (ForeignKey): The severity level associated with the log message.

    Methods:
        __str__(self) -> str: Returns a string representation of the log
    """

    timestamp = models.DateTimeField(blank=False, null=False)
    message = models.TextField(blank=True, null=False)
    correlation = models.ForeignKey(
        Correlation, on_delete=models.CASCADE, null=True, blank=True, related_name="logs"
    )
    severity = models.ForeignKey(
        Severity, on_delete=models.CASCADE, null=False, blank=False, related_name="logs"
    )

    def __str__(self) -> str:
        """
        Returns a formatted string representation of the log message, 
            including source, severity level, timestamp, correlation ID, and message.
        Returns:
        __str__(self) -> str:  The returned string is in the format:
            <source name> <severity level> <timestamp> [<correlation ID>] <message>
        """
        log_string = (
            f"""{self.severity.source} {self.severity.name} {self.timestamp} """
        )
        log_string += f"""[{self.correlation}]  {self.message}"""
        return log_string
