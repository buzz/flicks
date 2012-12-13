# -*- coding: utf-8 -*-
import datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Deleting field 'Movie.cover_filename'
        db.delete_column('flicksapp_movie', 'cover_filename')

        # Adding field 'Movie.on_karagarga'
        db.add_column('flicksapp_movie', 'on_karagarga',
                      self.gf('django.db.models.fields.BooleanField')(default=False),
                      keep_default=False)

        # Adding field 'Movie.karagarga_id'
        db.add_column('flicksapp_movie', 'karagarga_id',
                      self.gf('django.db.models.fields.PositiveIntegerField')(null=True, blank=True),
                      keep_default=False)


    def backwards(self, orm):
        # Adding field 'Movie.cover_filename'
        db.add_column('flicksapp_movie', 'cover_filename',
                      self.gf('django.db.models.fields.CharField')(default='', max_length=15, blank=True),
                      keep_default=False)

        # Deleting field 'Movie.on_karagarga'
        db.delete_column('flicksapp_movie', 'on_karagarga')

        # Deleting field 'Movie.karagarga_id'
        db.delete_column('flicksapp_movie', 'karagarga_id')


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
            'karagarga_id': ('django.db.models.fields.PositiveIntegerField', [], {'null': 'True', 'blank': 'True'}),
            'keywords': ('django.db.models.fields.related.ManyToManyField', [], {'related_name': "'movies'", 'symmetrical': 'False', 'to': "orm['flicksapp.Keyword']"}),
            'languages': ('django.db.models.fields.related.ManyToManyField', [], {'related_name': "'movies'", 'symmetrical': 'False', 'to': "orm['flicksapp.Language']"}),
            'mpaa': ('django.db.models.fields.CharField', [], {'max_length': '200', 'blank': 'True'}),
            'notes': ('django.db.models.fields.TextField', [], {'blank': 'True'}),
            'on_karagarga': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
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