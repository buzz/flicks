from decimal import Decimal

from django.core.serializers import serialize
from django.core.serializers.json import DjangoJSONEncoder
from django.db.models.query import QuerySet


class FlicksJSONEncoder(DjangoJSONEncoder):
    def default(self, obj):
        if isinstance(obj, Decimal):
            # django encoder serializes decimal to str??
            return float(obj)
        if isinstance(obj, QuerySet):
            return serialize('python', obj)
        return super(self.__class__, self).default(obj)
