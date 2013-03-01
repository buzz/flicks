from flicksapp.models import Movie, Country, Language, Person, Genre, Keyword
from rest_framework import serializers

class PersonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Person
        fields = ('id', 'name')

class GenreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Genre

class CountrySerializer(serializers.ModelSerializer):
    class Meta:
        model = Country

class LanguageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Language

class KeywordSerializer(serializers.ModelSerializer):
    class Meta:
        model = Keyword

class MovieDetailSerializer(serializers.ModelSerializer):
    """
    Includes full movie information
    """
    cast = PersonSerializer(many=True)
    directors = PersonSerializer(many=True)
    producers = PersonSerializer(many=True)
    writers = PersonSerializer(many=True)
    genres = GenreSerializer(many=True)
    countries = CountrySerializer(many=True)
    languages = LanguageSerializer(many=True)
    keywords = KeywordSerializer(many=True)
    class Meta:
        model = Movie

class MovieListSerializer(MovieDetailSerializer):
    """
    Includes only data for the grid view.
    """
    class Meta:
        model = Movie
        fields = ('id', 'title', 'directors', 'year', 'rating', 'imdb_id',
                  'languages', 'countries', 'genres', 'runtime', 'favourite',
                  'seen')
