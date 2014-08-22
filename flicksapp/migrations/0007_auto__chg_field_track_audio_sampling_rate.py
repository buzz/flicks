# -*- coding: utf-8 -*-
from south.utils import datetime_utils as datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):

        # Changing field 'Track.audio_sampling_rate'
        db.alter_column(u'flicksapp_track', 'audio_sampling_rate', self.gf('django.db.models.fields.CharField')(max_length=20, null=True))

    def backwards(self, orm):

        # Changing field 'Track.audio_sampling_rate'
        db.alter_column(u'flicksapp_track', 'audio_sampling_rate', self.gf('django.db.models.fields.PositiveIntegerField')(null=True))

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
            'file_size': ('django.db.models.fields.PositiveIntegerField', [], {'null': 'True', 'blank': 'True'}),
            'file_type': ('django.db.models.fields.CharField', [], {'default': "'V'", 'max_length': '1'}),
            'filename': ('django.db.models.fields.CharField', [], {'max_length': '255'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'overall_bit_rate': ('django.db.models.fields.PositiveIntegerField', [], {'null': 'True', 'blank': 'True'}),
            'tracks': ('django.db.models.fields.related.ManyToManyField', [], {'related_name': "'file'", 'symmetrical': 'False', 'to': u"orm['flicksapp.Track']"}),
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
            'files': ('django.db.models.fields.related.ManyToManyField', [], {'related_name': "'movie'", 'symmetrical': 'False', 'to': u"orm['flicksapp.File']"}),
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
            'audio_channels': ('django.db.models.fields.PositiveIntegerField', [], {'null': 'True', 'blank': 'True'}),
            'audio_sampling_rate': ('django.db.models.fields.CharField', [], {'max_length': '20', 'null': 'True', 'blank': 'True'}),
            'bit_rate': ('django.db.models.fields.PositiveIntegerField', [], {'null': 'True', 'blank': 'True'}),
            'codec': ('django.db.models.fields.CharField', [], {'max_length': '100', 'null': 'True', 'blank': 'True'}),
            'format': ('django.db.models.fields.CharField', [], {'max_length': '100', 'null': 'True', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'language': ('django.db.models.fields.CharField', [], {'max_length': '100', 'null': 'True', 'blank': 'True'}),
            'stream_size': ('django.db.models.fields.PositiveIntegerField', [], {'null': 'True', 'blank': 'True'}),
            'track_id': ('django.db.models.fields.PositiveIntegerField', [], {'default': '0'}),
            'track_type': ('django.db.models.fields.CharField', [], {'default': "'V'", 'max_length': '1'}),
            'video_aspect_ratio': ('django.db.models.fields.FloatField', [], {'null': 'True', 'blank': 'True'}),
            'video_bpp': ('django.db.models.fields.FloatField', [], {'null': 'True', 'blank': 'True'}),
            'video_frame_rate': ('django.db.models.fields.FloatField', [], {'null': 'True', 'blank': 'True'}),
            'video_height': ('django.db.models.fields.PositiveIntegerField', [], {'null': 'True', 'blank': 'True'}),
            'video_width': ('django.db.models.fields.PositiveIntegerField', [], {'null': 'True', 'blank': 'True'}),
            'writing_library': ('django.db.models.fields.CharField', [], {'max_length': '255', 'null': 'True', 'blank': 'True'})
        }
    }

    complete_apps = ['flicksapp']