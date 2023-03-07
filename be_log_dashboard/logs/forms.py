from django.core.exceptions import NON_FIELD_ERRORS
from django.forms import ModelForm
from .models import Source

class SourceForm(ModelForm):
    model = Source
    class Meta:
        error_messages = {
            NON_FIELD_ERRORS: {
                'unique_together': "Source name should be unique for a user.",
            }
        }
