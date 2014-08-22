# -*- coding: utf-8 -*-
from south.utils import datetime_utils as datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding field 'Track.file'
        db.add_column(u'flicksapp_track', 'file',
                      self.gf('django.db.models.fields.related.ForeignKey')(default=None, related_name='tracks', to=orm['flicksapp.File']),
                      keep_default=False)

        # Removing M2M table for field files on 'Movie'
        db.delete_table(db.shorten_name(u'flicksapp_movie_files'))

        # Adding field 'File.movie'
        db.add_column(u'flicksapp_file', 'movie',
                      self.gf('django.db.models.fields.related.ForeignKey')(default=None, related_name='files', to=orm['flicksapp.Movie']),
                      keep_default=False)

        # Removing M2M table for field tracks on 'File'
        db.delete_table(db.shorten_name(u'flicksapp_file_tracks'))


    def backwards(self, orm):
        # Deleting field 'Track.file'
        db.delete_column(u'flicksapp_track', 'file_id')

        # Adding M2M table for field files on 'Movie'
        m2m_table_name = db.shorten_name(u'flicksapp_movie_files')
        db.create_table(m2m_table_name, (
            ('id', models.AutoField(verbose_name='ID', primary_key=True, auto_created=True)),
            ('movie', models.ForeignKey(orm[u'flicksapp.movie'], null=False)),
            ('file', models.ForeignKey(orm[u'flicksapp.file'], null=False))
        ))
        db.create_unique(m2m_table_name, ['movie_id', 'file_id'])

        # Deleting field 'File.movie'
        db.delete_column(u'flicksapp_file', 'movie_id')

        # Adding M2M table for field tracks on 'File'
        m2m_table_name = db.shorten_name(u'flicksapp_file_tracks')
        db.create_table(m2m_table_name, (
            ('id', models.AutoField(verbose_name='ID', primary_key=True, auto_created=True)),
            ('file', models.ForeignKey(orm[u'flicksapp.file'], null=False)),
            ('track', models.ForeignKey(orm[u'flicksapp.track'], null=False))
        ))
        db.create_unique(m2m_table_name, ['file_id', 'track_id'])


    models = {
        u'flicksapp.country': {
            'Meta': {'object_name': 'Country'},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '200'})
        },
        u'flicksapp.file': {
            'Meta': {'object_name': 'File'},
            'container_format': ('django.db.models.fields.CharField', [], {'max_length': '100', 'null': 'True', 'blank': 'True'}),
            'duration': ('django.db.models.fields.PositiveIntegerField', [], {'null': 'True', 'blank': 'True'}),
            'file_output': ('django.db.models.fields.CharField', [], {'max_length': '255', 'null': 'True', 'blank': 'True'}),
            'file_size': ('django.db.models.fields.BigIntegerField', [], {'null': 'True', 'blank': 'True'}),
            'file_type': ('django.db.models.fields.CharField', [], {'default': "'V'", 'max_length': '1'}),
            'filename': ('django.db.models.fields.CharField', [], {'max_length': '255'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'movie': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'files'", 'to': u"orm['flicksapp.Movie']"}),
            'overall_bit_rate': ('django.db.models.fields.PositiveIntegerField', [], {'null': 'True', 'blank': 'True'}),
            'writing_application': ('django.db.models.fields.CharField', [], {'max_length': '255', 'null': 'True', 'blank': 'True'}),
            'writing_library': ('django.db.models.fields.CharField', [], {'max_length': '255', 'null': 'True', 'blank': 'True'})
        },
        u'flicksapp.genre': {
            'Meta': {'object_name': 'Genre'},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '200'})
        },
        u'flicksapp.keyword': {
            'Meta': {'object_name': 'Keyword'},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '200'})
        },
        u'flicksapp.language': {
            'Meta': {'object_name': 'Language'},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '200'})
        },
        u'flicksapp.movie': {
            'Meta': {'object_name': 'Movie'},
            'added_on': ('django.db.models.fields.DateField', [], {'null': 'True'}),
            'akas': ('flicksapp.fields.ListField', [], {}),
            'cast': ('django.db.models.fields.related.ManyToManyField', [], {'related_name': "'acted_in'", 'symmetrical': 'False', 'to': u"orm['flicksapp.Person']"}),
            'countries': ('django.db.models.fields.related.ManyToManyField', [], {'related_name': "'movies'", 'symmetrical': 'False', 'to': u"orm['flicksapp.Country']"}),
            'directors': ('django.db.models.fields.related.ManyToManyField', [], {'related_name': "'directed'", 'symmetrical': 'False', 'to': u"orm['flicksapp.Person']"}),
            'favourite': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'genres': ('django.db.models.fields.related.ManyToManyField', [], {'related_name': "'movies'", 'symmetrical': 'False', 'to': u"orm['flicksapp.Genre']"}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'imdb_id': ('django.db.models.fields.PositiveIntegerField', [], {'db_index': 'True', 'null': 'True', 'blank': 'True'}),
            'imdb_sync_on': ('django.db.models.fields.DateTimeField', [], {'null': 'True'}),
            'karagarga_id': ('django.db.models.fields.PositiveIntegerField', [], {'null': 'True', 'blank': 'True'}),
            'keywords': ('django.db.models.fields.related.ManyToManyField', [], {'related_name': "'movies'", 'symmetrical': 'False', 'to': u"orm['flicksapp.Keyword']"}),
            'languages': ('django.db.models.fields.related.ManyToManyField', [], {'related_name': "'movies'", 'symmetrical': 'False', 'to': u"orm['flicksapp.Language']"}),
            'mpaa': ('django.db.models.fields.CharField', [], {'max_length': '200', 'blank': 'True'}),
            'notes': ('django.db.models.fields.TextField', [], {'blank': 'True'}),
            'on_karagarga': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'plot': ('django.db.models.fields.TextField', [], {'blank': 'True'}),
            'plot_outline': ('django.db.models.fields.TextField', [], {'blank': 'True'}),
            'producers': ('django.db.models.fields.related.ManyToManyField', [], {'related_name': "'produced'", 'symmetrical': 'False', 'to': u"orm['flicksapp.Person']"}),
            'rating': ('django.db.models.fields.DecimalField', [], {'null': 'True', 'max_digits': '3', 'decimal_places': '1', 'blank': 'True'}),
            'runtime': ('django.db.models.fields.PositiveIntegerField', [], {'null': 'True', 'blank': 'True'}),
            'seen': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'title': ('django.db.models.fields.CharField', [], {'max_length': '200'}),
            'trumpable': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'votes': ('django.db.models.fields.PositiveIntegerField', [], {'null': 'True', 'blank': 'True'}),
            'writers': ('django.db.models.fields.related.ManyToManyField', [], {'related_name': "'written'", 'symmetrical': 'False', 'to': u"orm['flicksapp.Person']"}),
            'year': ('django.db.models.fields.PositiveIntegerField', [], {'db_index': 'True', 'null': 'True', 'blank': 'True'})
        },
        u'flicksapp.person': {
            'Meta': {'object_name': 'Person'},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'imdb_id': ('django.db.models.fields.PositiveIntegerField', [], {'unique': 'True', 'null': 'True', 'blank': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '200'})
        },
        u'flicksapp.track': {
            'Meta': {'object_name': 'Track'},
            'audio_bit_rate_mode': ('django.db.models.fields.CharField', [], {'max_length': '20', 'null': 'True', 'blank': 'True'}),
            'audio_channels': ('django.db.models.fields.CharField', [], {'max_length': '20', 'null': 'True', 'blank': 'True'}),
            'audio_sampling_rate': ('django.db.models.fields.CharField', [], {'max_length': '20', 'null': 'True', 'blank': 'True'}),
            'bit_rate': ('django.db.models.fields.PositiveIntegerField', [], {'null': 'True', 'blank': 'True'}),
            'codec': ('django.db.models.fields.CharField', [], {'max_length': '100', 'null': 'True', 'blank': 'True'}),
            'file': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'tracks'", 'to': u"orm['flicksapp.File']"}),
            'format': ('django.db.models.fields.CharField', [], {'max_length': '100', 'null': 'True', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'language': ('django.db.models.fields.CharField', [], {'max_length': '100', 'null': 'True', 'blank': 'True'}),
            'stream_size': ('django.db.models.fields.BigIntegerField', [], {'null': 'True', 'blank': 'True'}),
            'track_id': ('django.db.models.fields.PositiveIntegerField', [], {'default': '0'}),
            'track_type': ('django.db.models.fields.CharField', [], {'default': "'V'", 'max_length': '1'}),
            'video_aspect_ratio': ('django.db.models.fields.FloatField', [], {'null': 'True', 'blank': 'True'}),
            'video_bpp': ('django.db.models.fields.FloatField', [], {'null': 'True', 'blank': 'True'}),
            'video_frame_rate': ('django.db.models.fields.FloatField', [], {'null': 'True', 'blank': 'True'}),
            'video_height': ('django.db.models.fields.PositiveSmallIntegerField', [], {'null': 'True', 'blank': 'True'}),
            'video_width': ('django.db.models.fields.PositiveSmallIntegerField', [], {'null': 'True', 'blank': 'True'}),
            'writing_library': ('django.db.models.fields.CharField', [], {'max_length': '255', 'null': 'True', 'blank': 'True'})
        }
    }

    complete_apps = ['flicksapp']