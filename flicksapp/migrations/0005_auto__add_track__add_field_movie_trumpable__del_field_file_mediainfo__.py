# -*- coding: utf-8 -*-
import datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding model 'Track'
        db.create_table('flicksapp_track', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('format', self.gf('django.db.models.fields.CharField')(max_length=100, null=True, blank=True)),
            ('codec', self.gf('django.db.models.fields.CharField')(max_length=100, null=True, blank=True)),
            ('bit_rate', self.gf('django.db.models.fields.PositiveIntegerField')(null=True, blank=True)),
            ('stream_size', self.gf('django.db.models.fields.PositiveIntegerField')(null=True, blank=True)),
            ('writing_library', self.gf('django.db.models.fields.CharField')(max_length=255, null=True, blank=True)),
            ('language', self.gf('django.db.models.fields.CharField')(max_length=100, null=True, blank=True)),
            ('video_width', self.gf('django.db.models.fields.PositiveIntegerField')(null=True, blank=True)),
            ('video_height', self.gf('django.db.models.fields.PositiveIntegerField')(null=True, blank=True)),
            ('video_aspect_ratio', self.gf('django.db.models.fields.FloatField')(null=True, blank=True)),
            ('video_frame_rate', self.gf('django.db.models.fields.FloatField')(null=True, blank=True)),
            ('video_bpp', self.gf('django.db.models.fields.FloatField')(null=True, blank=True)),
            ('audio_bit_rate_mode', self.gf('django.db.models.fields.CharField')(max_length=20, null=True, blank=True)),
            ('audio_sampling_rate', self.gf('django.db.models.fields.PositiveIntegerField')(null=True, blank=True)),
            ('audio_channels', self.gf('django.db.models.fields.PositiveIntegerField')(null=True, blank=True)),
        ))
        db.send_create_signal('flicksapp', ['Track'])

        # Adding field 'Movie.trumpable'
        db.add_column('flicksapp_movie', 'trumpable',
                      self.gf('django.db.models.fields.BooleanField')(default=False),
                      keep_default=False)

        # Deleting field 'File.mediainfo'
        db.delete_column('flicksapp_file', 'mediainfo')

        # Adding field 'File.container_format'
        db.add_column('flicksapp_file', 'container_format',
                      self.gf('django.db.models.fields.CharField')(max_length=100, null=True, blank=True),
                      keep_default=False)

        # Adding field 'File.container_format_info'
        db.add_column('flicksapp_file', 'container_format_info',
                      self.gf('django.db.models.fields.CharField')(max_length=255, null=True, blank=True),
                      keep_default=False)

        # Adding field 'File.file_size'
        db.add_column('flicksapp_file', 'file_size',
                      self.gf('django.db.models.fields.PositiveIntegerField')(null=True, blank=True),
                      keep_default=False)

        # Adding field 'File.duration'
        db.add_column('flicksapp_file', 'duration',
                      self.gf('django.db.models.fields.PositiveIntegerField')(null=True, blank=True),
                      keep_default=False)

        # Adding field 'File.overall_bit_rate'
        db.add_column('flicksapp_file', 'overall_bit_rate',
                      self.gf('django.db.models.fields.PositiveIntegerField')(null=True, blank=True),
                      keep_default=False)

        # Adding field 'File.writing_application'
        db.add_column('flicksapp_file', 'writing_application',
                      self.gf('django.db.models.fields.CharField')(max_length=255, null=True, blank=True),
                      keep_default=False)

        # Adding field 'File.writing_library'
        db.add_column('flicksapp_file', 'writing_library',
                      self.gf('django.db.models.fields.CharField')(max_length=255, null=True, blank=True),
                      keep_default=False)

        # Adding M2M table for field tracks on 'File'
        db.create_table('flicksapp_file_tracks', (
            ('id', models.AutoField(verbose_name='ID', primary_key=True, auto_created=True)),
            ('file', models.ForeignKey(orm['flicksapp.file'], null=False)),
            ('track', models.ForeignKey(orm['flicksapp.track'], null=False))
        ))
        db.create_unique('flicksapp_file_tracks', ['file_id', 'track_id'])


    def backwards(self, orm):
        # Deleting model 'Track'
        db.delete_table('flicksapp_track')

        # Deleting field 'Movie.trumpable'
        db.delete_column('flicksapp_movie', 'trumpable')

        # Adding field 'File.mediainfo'
        db.add_column('flicksapp_file', 'mediainfo',
                      self.gf('django.db.models.fields.TextField')(default=None),
                      keep_default=False)

        # Deleting field 'File.container_format'
        db.delete_column('flicksapp_file', 'container_format')

        # Deleting field 'File.container_format_info'
        db.delete_column('flicksapp_file', 'container_format_info')

        # Deleting field 'File.file_size'
        db.delete_column('flicksapp_file', 'file_size')

        # Deleting field 'File.duration'
        db.delete_column('flicksapp_file', 'duration')

        # Deleting field 'File.overall_bit_rate'
        db.delete_column('flicksapp_file', 'overall_bit_rate')

        # Deleting field 'File.writing_application'
        db.delete_column('flicksapp_file', 'writing_application')

        # Deleting field 'File.writing_library'
        db.delete_column('flicksapp_file', 'writing_library')

        # Removing M2M table for field tracks on 'File'
        db.delete_table('flicksapp_file_tracks')


    models = {
        'flicksapp.country': {
            'Meta': {'object_name': 'Country'},
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '200'})
        },
        'flicksapp.file': {
            'Meta': {'object_name': 'File'},
            'container_format': ('django.db.models.fields.CharField', [], {'max_length': '100', 'null': 'True', 'blank': 'True'}),
            'container_format_info': ('django.db.models.fields.CharField', [], {'max_length': '255', 'null': 'True', 'blank': 'True'}),
            'duration': ('django.db.models.fields.PositiveIntegerField', [], {'null': 'True', 'blank': 'True'}),
            'file_size': ('django.db.models.fields.PositiveIntegerField', [], {'null': 'True', 'blank': 'True'}),
            'filename': ('django.db.models.fields.CharField', [], {'max_length': '255'}),
            'filetype': ('django.db.models.fields.CharField', [], {'max_length': '1'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'overall_bit_rate': ('django.db.models.fields.PositiveIntegerField', [], {'null': 'True', 'blank': 'True'}),
            'tracks': ('django.db.models.fields.related.ManyToManyField', [], {'related_name': "'file'", 'symmetrical': 'False', 'to': "orm['flicksapp.Track']"}),
            'writing_application': ('django.db.models.fields.CharField', [], {'max_length': '255', 'null': 'True', 'blank': 'True'}),
            'writing_library': ('django.db.models.fields.CharField', [], {'max_length': '255', 'null': 'True', 'blank': 'True'})
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
            'akas': ('flicksapp.fields.ListField', [], {}),
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
            'trumpable': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'votes': ('django.db.models.fields.PositiveIntegerField', [], {'null': 'True', 'blank': 'True'}),
            'writers': ('django.db.models.fields.related.ManyToManyField', [], {'related_name': "'written'", 'symmetrical': 'False', 'to': "orm['flicksapp.Person']"}),
            'year': ('django.db.models.fields.PositiveIntegerField', [], {'db_index': 'True', 'null': 'True', 'blank': 'True'})
        },
        'flicksapp.person': {
            'Meta': {'object_name': 'Person'},
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'imdb_id': ('django.db.models.fields.PositiveIntegerField', [], {'unique': 'True', 'null': 'True', 'blank': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '200'})
        },
        'flicksapp.track': {
            'Meta': {'object_name': 'Track'},
            'audio_bit_rate_mode': ('django.db.models.fields.CharField', [], {'max_length': '20', 'null': 'True', 'blank': 'True'}),
            'audio_channels': ('django.db.models.fields.PositiveIntegerField', [], {'null': 'True', 'blank': 'True'}),
            'audio_sampling_rate': ('django.db.models.fields.PositiveIntegerField', [], {'null': 'True', 'blank': 'True'}),
            'bit_rate': ('django.db.models.fields.PositiveIntegerField', [], {'null': 'True', 'blank': 'True'}),
            'codec': ('django.db.models.fields.CharField', [], {'max_length': '100', 'null': 'True', 'blank': 'True'}),
            'format': ('django.db.models.fields.CharField', [], {'max_length': '100', 'null': 'True', 'blank': 'True'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'language': ('django.db.models.fields.CharField', [], {'max_length': '100', 'null': 'True', 'blank': 'True'}),
            'stream_size': ('django.db.models.fields.PositiveIntegerField', [], {'null': 'True', 'blank': 'True'}),
            'video_aspect_ratio': ('django.db.models.fields.FloatField', [], {'null': 'True', 'blank': 'True'}),
            'video_bpp': ('django.db.models.fields.FloatField', [], {'null': 'True', 'blank': 'True'}),
            'video_frame_rate': ('django.db.models.fields.FloatField', [], {'null': 'True', 'blank': 'True'}),
            'video_height': ('django.db.models.fields.PositiveIntegerField', [], {'null': 'True', 'blank': 'True'}),
            'video_width': ('django.db.models.fields.PositiveIntegerField', [], {'null': 'True', 'blank': 'True'}),
            'writing_library': ('django.db.models.fields.CharField', [], {'max_length': '255', 'null': 'True', 'blank': 'True'})
        }
    }

    complete_apps = ['flicksapp']