from django.db import models
from django.db.models import Count
from django.db.models.query import QuerySet


class NumMoviesMixin(object):
    def add_num_movies(self, relation_name='movies'):
        return self.annotate(
            num_movies=Count(relation_name)).order_by('-num_movies')


class NumMoviesQuerySet(QuerySet, NumMoviesMixin):
    pass


class NumMoviesManager(models.Manager, NumMoviesMixin):
    def get_query_set(self):
        return NumMoviesQuerySet(self.model, using=self._db)


class PersonManager(NumMoviesManager):
    def actors(self):
        '''Returns people that acted in at least one movie.'''
        return self.annotate(
            acted_in_count=Count('acted_in')).filter(acted_in_count__gt=0)
    def directors(self):
        '''Returns people that directed at least one movie.'''
        return self.annotate(
            directed_count=Count('directed')).filter(directed_count__gt=0)
    def writers(self):
        '''Returns people that have written at least one movie script.'''
        return self.annotate(
            written_count=Count('written')).filter(written_count__gt=0)
