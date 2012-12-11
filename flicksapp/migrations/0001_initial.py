# -*- coding: utf-8 -*-
import datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding model 'Country'
        db.create_table('flicksapp_country', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('name', self.gf('django.db.models.fields.CharField')(unique=True, max_length=200)),
        ))
        db.send_create_signal('flicksapp', ['Country'])

        # Adding model 'Genre'
        db.create_table('flicksapp_genre', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('name', self.gf('django.db.models.fields.CharField')(unique=True, max_length=200)),
        ))
        db.send_create_signal('flicksapp', ['Genre'])

        # Adding model 'Person'
        db.create_table('flicksapp_person', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('imdb_id', self.gf('django.db.models.fields.PositiveIntegerField')(unique=True, null=True, blank=True)),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=200)),
        ))
        db.send_create_signal('flicksapp', ['Person'])

        # Adding model 'Language'
        db.create_table('flicksapp_language', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('name', self.gf('django.db.models.fields.CharField')(unique=True, max_length=200)),
        ))
        db.send_create_signal('flicksapp', ['Language'])

        # Adding model 'Keyword'
        db.create_table('flicksapp_keyword', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('name', self.gf('django.db.models.fields.CharField')(unique=True, max_length=200)),
        ))
        db.send_create_signal('flicksapp', ['Keyword'])

        # Adding model 'File'
        db.create_table('flicksapp_file', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('filename', self.gf('django.db.models.fields.CharField')(max_length=255)),
            ('filetype', self.gf('django.db.models.fields.CharField')(max_length=1)),
            ('mediainfo', self.gf('django.db.models.fields.TextField')()),
        ))
        db.send_create_signal('flicksapp', ['File'])

        # Adding model 'Movie'
        db.create_table('flicksapp_movie', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('imdb_id', self.gf('django.db.models.fields.PositiveIntegerField')(db_index=True, null=True, blank=True)),
            ('title', self.gf('django.db.models.fields.CharField')(max_length=200)),
            ('akas', self.gf('django.db.models.fields.TextField')()),
            ('year', self.gf('django.db.models.fields.PositiveIntegerField')(db_index=True, null=True, blank=True)),
            ('rating', self.gf('django.db.models.fields.DecimalField')(null=True, max_digits=3, decimal_places=1, blank=True)),
            ('votes', self.gf('django.db.models.fields.PositiveIntegerField')(null=True, blank=True)),
            ('runtime', self.gf('django.db.models.fields.PositiveIntegerField')(null=True, blank=True)),
            ('plot_outline', self.gf('django.db.models.fields.TextField')(blank=True)),
            ('plot', self.gf('django.db.models.fields.TextField')(blank=True)),
            ('mpaa', self.gf('django.db.models.fields.CharField')(max_length=200, blank=True)),
            ('added_on', self.gf('django.db.models.fields.DateField')(null=True)),
            ('imdb_sync_on', self.gf('django.db.models.fields.DateTimeField')(null=True)),
            ('seen', self.gf('django.db.models.fields.BooleanField')(default=False)),
            ('favourite', self.gf('django.db.models.fields.BooleanField')(default=False)),
            ('notes', self.gf('django.db.models.fields.TextField')(blank=True)),
        ))
        db.send_create_signal('flicksapp', ['Movie'])

        # Adding M2M table for field countries on 'Movie'
        db.create_table('flicksapp_movie_countries', (
            ('id', models.AutoField(verbose_name='ID', primary_key=True, auto_created=True)),
            ('movie', models.ForeignKey(orm['flicksapp.movie'], null=False)),
            ('country', models.ForeignKey(orm['flicksapp.country'], null=False))
        ))
        db.create_unique('flicksapp_movie_countries', ['movie_id', 'country_id'])

        # Adding M2M table for field genres on 'Movie'
        db.create_table('flicksapp_movie_genres', (
            ('id', models.AutoField(verbose_name='ID', primary_key=True, auto_created=True)),
            ('movie', models.ForeignKey(orm['flicksapp.movie'], null=False)),
            ('genre', models.ForeignKey(orm['flicksapp.genre'], null=False))
        ))
        db.create_unique('flicksapp_movie_genres', ['movie_id', 'genre_id'])

        # Adding M2M table for field directors on 'Movie'
        db.create_table('flicksapp_movie_directors', (
            ('id', models.AutoField(verbose_name='ID', primary_key=True, auto_created=True)),
            ('movie', models.ForeignKey(orm['flicksapp.movie'], null=False)),
            ('person', models.ForeignKey(orm['flicksapp.person'], null=False))
        ))
        db.create_unique('flicksapp_movie_directors', ['movie_id', 'person_id'])

        # Adding M2M table for field producers on 'Movie'
        db.create_table('flicksapp_movie_producers', (
            ('id', models.AutoField(verbose_name='ID', primary_key=True, auto_created=True)),
            ('movie', models.ForeignKey(orm['flicksapp.movie'], null=False)),
            ('person', models.ForeignKey(orm['flicksapp.person'], null=False))
        ))
        db.create_unique('flicksapp_movie_producers', ['movie_id', 'person_id'])

        # Adding M2M table for field writers on 'Movie'
        db.create_table('flicksapp_movie_writers', (
            ('id', models.AutoField(verbose_name='ID', primary_key=True, auto_created=True)),
            ('movie', models.ForeignKey(orm['flicksapp.movie'], null=False)),
            ('person', models.ForeignKey(orm['flicksapp.person'], null=False))
        ))
        db.create_unique('flicksapp_movie_writers', ['movie_id', 'person_id'])

        # Adding M2M table for field cast on 'Movie'
        db.create_table('flicksapp_movie_cast', (
            ('id', models.AutoField(verbose_name='ID', primary_key=True, auto_created=True)),
            ('movie', models.ForeignKey(orm['flicksapp.movie'], null=False)),
            ('person', models.ForeignKey(orm['flicksapp.person'], null=False))
        ))
        db.create_unique('flicksapp_movie_cast', ['movie_id', 'person_id'])

        # Adding M2M table for field languages on 'Movie'
        db.create_table('flicksapp_movie_languages', (
            ('id', models.AutoField(verbose_name='ID', primary_key=True, auto_created=True)),
            ('movie', models.ForeignKey(orm['flicksapp.movie'], null=False)),
            ('language', models.ForeignKey(orm['flicksapp.language'], null=False))
        ))
        db.create_unique('flicksapp_movie_languages', ['movie_id', 'language_id'])

        # Adding M2M table for field keywords on 'Movie'
        db.create_table('flicksapp_movie_keywords', (
            ('id', models.AutoField(verbose_name='ID', primary_key=True, auto_created=True)),
            ('movie', models.ForeignKey(orm['flicksapp.movie'], null=False)),
            ('keyword', models.ForeignKey(orm['flicksapp.keyword'], null=False))
        ))
        db.create_unique('flicksapp_movie_keywords', ['movie_id', 'keyword_id'])

        # Adding M2M table for field files on 'Movie'
        db.create_table('flicksapp_movie_files', (
            ('id', models.AutoField(verbose_name='ID', primary_key=True, auto_created=True)),
            ('movie', models.ForeignKey(orm['flicksapp.movie'], null=False)),
            ('file', models.ForeignKey(orm['flicksapp.file'], null=False))
        ))
        db.create_unique('flicksapp_movie_files', ['movie_id', 'file_id'])


    def backwards(self, orm):
        # Deleting model 'Country'
        db.delete_table('flicksapp_country')

        # Deleting model 'Genre'
        db.delete_table('flicksapp_genre')

        # Deleting model 'Person'
        db.delete_table('flicksapp_person')

        # Deleting model 'Language'
        db.delete_table('flicksapp_language')

        # Deleting model 'Keyword'
        db.delete_table('flicksapp_keyword')

        # Deleting model 'File'
        db.delete_table('flicksapp_file')

        # Deleting model 'Movie'
        db.delete_table('flicksapp_movie')

        # Removing M2M table for field countries on 'Movie'
        db.delete_table('flicksapp_movie_countries')

        # Removing M2M table for field genres on 'Movie'
        db.delete_table('flicksapp_movie_genres')

        # Removing M2M table for field directors on 'Movie'
        db.delete_table('flicksapp_movie_directors')

        # Removing M2M table for field producers on 'Movie'
        db.delete_table('flicksapp_movie_producers')

        # Removing M2M table for field writers on 'Movie'
        db.delete_table('flicksapp_movie_writers')

        # Removing M2M table for field cast on 'Movie'
        db.delete_table('flicksapp_movie_cast')

        # Removing M2M table for field languages on 'Movie'
        db.delete_table('flicksapp_movie_languages')

        # Removing M2M table for field keywords on 'Movie'
        db.delete_table('flicksapp_movie_keywords')

        # Removing M2M table for field files on 'Movie'
        db.delete_table('flicksapp_movie_files')


    models = {
        'flicksapp.country': {
            'Meta': {'object_name': 'Country'},
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '200'})
        },
        'flicksapp.file': {
            'Meta': {'object_name': 'File'},
            'filename': ('django.db.models.fields.CharField', [], {'max_length': '255'}),
            'filetype': ('django.db.models.fields.CharField', [], {'max_length': '1'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'mediainfo': ('django.db.models.fields.TextField', [], {})
        },
        'flicksapp.genre': {
            'Meta': {'object_name': 'Genre'},
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '200'})
        },
        'flicksapp.keyword': {
            'Meta': {'object_name': 'Keyword'},
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '200'})
        },
        'flicksapp.language': {
            'Meta': {'object_name': 'Language'},
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '200'})
        },
        'flicksapp.movie': {
            'Meta': {'object_name': 'Movie'},
            'added_on': ('django.db.models.fields.DateField', [], {'null': 'True'}),
            'akas': ('django.db.models.fields.TextField', [], {}),
            'cast': ('django.db.models.fields.related.ManyToManyField', [], {'related_name': "'acted_in'", 'symmetrical': 'False', 'to': "orm['flicksapp.Person']"}),
            'countries': ('django.db.models.fields.related.ManyToManyField', [], {'related_name': "'movies'", 'symmetrical': 'False', 'to': "orm['flicksapp.Country']"}),
            'directors': ('django.db.models.fields.related.ManyToManyField', [], {'related_name': "'directed'", 'symmetrical': 'False', 'to': "orm['flicksapp.Person']"}),
            'favourite': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'files': ('django.db.models.fields.related.ManyToManyField', [], {'to': "orm['flicksapp.File']", 'symmetrical': 'False'}),
            'genres': ('django.db.models.fields.related.ManyToManyField', [], {'related_name': "'movies'", 'symmetrical': 'False', 'to': "orm['flicksapp.Genre']"}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'imdb_id': ('django.db.models.fields.PositiveIntegerField', [], {'db_index': 'True', 'null': 'True', 'blank': 'True'}),
            'imdb_sync_on': ('django.db.models.fields.DateTimeField', [], {'null': 'True'}),
            'keywords': ('django.db.models.fields.related.ManyToManyField', [], {'related_name': "'movies'", 'symmetrical': 'False', 'to': "orm['flicksapp.Keyword']"}),
            'languages': ('django.db.models.fields.related.ManyToManyField', [], {'related_name': "'movies'", 'symmetrical': 'False', 'to': "orm['flicksapp.Language']"}),
            'mpaa': ('django.db.models.fields.CharField', [], {'max_length': '200', 'blank': 'True'}),
            'notes': ('django.db.models.fields.TextField', [], {'blank': 'True'}),
            'plot': ('django.db.models.fields.TextField', [], {'blank': 'True'}),
            'plot_outline': ('django.db.models.fields.TextField', [], {'blank': 'True'}),
            'producers': ('django.db.models.fields.related.ManyToManyField', [], {'related_name': "'produced'", 'symmetrical': 'False', 'to': "orm['flicksapp.Person']"}),
            'rating': ('django.db.models.fields.DecimalField', [], {'null': 'True', 'max_digits': '3', 'decimal_places': '1', 'blank': 'True'}),
            'runtime': ('django.db.models.fields.PositiveIntegerField', [], {'null': 'True', 'blank': 'True'}),
            'seen': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'title': ('django.db.models.fields.CharField', [], {'max_length': '200'}),
            'votes': ('django.db.models.fields.PositiveIntegerField', [], {'null': 'True', 'blank': 'True'}),
            'writers': ('django.db.models.fields.related.ManyToManyField', [], {'related_name': "'written'", 'symmetrical': 'False', 'to': "orm['flicksapp.Person']"}),
            'year': ('django.db.models.fields.PositiveIntegerField', [], {'db_index': 'True', 'null': 'True', 'blank': 'True'})
        },
        'flicksapp.person': {
            'Meta': {'object_name': 'Person'},
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'imdb_id': ('django.db.models.fields.PositiveIntegerField', [], {'unique': 'True', 'null': 'True', 'blank': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '200'})
        }
    }

    complete_apps = ['flicksapp']
