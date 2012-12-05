from django.core.exceptions import ValidationError

def validate_imdb_id(value):
    if value < 0 or value > 9999999:
        raise ValidationError(u'%s must be >= 0 and <= 9999999' % value)
