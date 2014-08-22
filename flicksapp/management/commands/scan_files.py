from django.core.management.base import BaseCommand
import os
import re
import subprocess

from pymediainfo import MediaInfo
from flicksapp.models import Movie, File, Track
from flicksapp.choices import FILE_TYPES, PICTURE_TYPE, VIDEO_TYPE, NFO_TYPE, \
    SUBTITLES_TYPE, OTHER_TYPE, AUDIO_TYPE


IGNORES = (
    '^\..+\.sha1$',
    '\.ifo$',
    '\.bup$',
    '\.vob$',
)

MEDIAINFO_MAPPING_GENERAL = (
    ('codec',                'container_format'),
    ('file_size',            'file_size'),
    ('duration',             'duration'),
    ('overall_bit_rate',     'overall_bit_rate'),
    ('writing_application',  'writing_application'),
    ('writing_library',      'writing_library'),
)
MEDIAINFO_MAPPING_TRACK_BASE = (
    ('format',               'format'),
    ('codec_info',           'codec'),
    ('bit_rate',             'bit_rate'),
    ('stream_size',          'stream_size'),
    ('writing_library',      'writing_library'),
    ('language',             'language'),
)
MEDIAINFO_MAPPING_VIDEO = MEDIAINFO_MAPPING_TRACK_BASE + (
    ('width',                'video_width'),
    ('height',               'video_height'),
    ('display_aspect_ratio', 'video_aspect_ratio'),
    ('frame_rate',           'video_frame_rate'),
    ('bits__pixel_frame',    'video_bpp'),
)
MEDIAINFO_MAPPING_AUDIO = MEDIAINFO_MAPPING_TRACK_BASE + (
    ('bit_rate_mode',        'audio_bit_rate_mode'),
    ('sampling_rate',        'audio_sampling_rate'),
    ('channel_s',            'audio_channels'),
)
MEDIAINFO_MAPPING_SUBTITLES = MEDIAINFO_MAPPING_TRACK_BASE

class Command(BaseCommand):
    help = 'Scans media files using mediainfo'

    def handle(self, *args, **options):
        i = 0
        nodir = 0
        file_count_new = 0
        file_count_updated = 0
        track_count_new = 0
        track_count_updated = 0
        dir_count = 0
        for m in Movie.objects.all():
            i += 1
            mdir = m.media_directory
            if not os.path.isdir(mdir):
                nodir += 1
                continue
            print '*' * 80
            print ' %25s %90s' % \
                (mdir, m.title.encode('ascii', 'replace'))
            for root, dirs, files in os.walk(mdir):

                # warn for dirs
                for d in dirs:
                    print 'Warning: Directory found: %s%s' % (root, d)
                    dir_count += 1

                # check media files
                for f in files:
                    # ignore?
                    ignore = False
                    for p in IGNORES:
                        if re.search(p, f, flags=re.IGNORECASE):
                            ignore = True
                            break
                    if ignore:
                        continue
                    filename = '%s/%s' % (root, f)
                    print f

                    # create/update file object
                    qs = File.objects.filter(filename=f, movie=m)
                    if qs.count() > 0:
                        file_obj = qs.first()
                        file_count_updated += 1
                    else:
                        file_obj = File.objects.create(filename=f, movie=m)
                        file_obj.save()
                        file_count_new += 1

                    # file type
                    for file_type, n, patterns in FILE_TYPES:
                        found = False
                        if patterns is None:
                            file_obj.file_type = file_type
                            found = True
                        else:
                            for pat in patterns:
                                pattern = '.+\.%s$' % pat
                                if re.search(pattern, f, flags=re.IGNORECASE):
                                    file_obj.file_type = file_type
                                    found = True
                                    break
                            if found:
                                break
                    # print 'Assigning file type %s' % file_type

                    # file command
                    file_output = subprocess.check_output([
                        'file', '--brief', filename])
                    file_obj.file_output = file_output

                    # mediainfo
                    if file_obj.file_type != VIDEO_TYPE:
                        file_obj.save()
                        continue
                    media_info = MediaInfo.parse(filename)
                    for track in media_info.tracks:
                        # general
                        if track.track_type == 'General':
                            for key, model_attr in MEDIAINFO_MAPPING_GENERAL:
                                value = getattr(track, key)
                                setattr(file_obj, model_attr, value)
                            continue
                        # media track
                        elif track.track_type == 'Video':
                            track_type = VIDEO_TYPE
                            mapping = MEDIAINFO_MAPPING_VIDEO
                        elif track.track_type == 'Audio':
                            track_type = AUDIO_TYPE
                            mapping = MEDIAINFO_MAPPING_AUDIO
                        elif track.track_type == 'Text':
                            track_type = SUBTITLES_TYPE
                            mapping = MEDIAINFO_MAPPING_SUBTITLES
                        elif track.track_type == 'None' or \
                          track.track_type == 'Menu':
                            continue
                        else:
                            print 'Warning: Unknown track type: %s' % \
                              track.track_type
                            continue
                        qs = Track.objects.filter(file=file_obj,
                            track_type=track_type, track_id=track.track_id)
                        if qs.count() > 0:
                            track_obj = qs.first()
                            track_count_updated += 1
                        else:
                            track_obj = Track.objects.create(file=file_obj,
                                track_type=track_type, track_id=track.track_id)
                            track_obj.save()
                            track_count_new += 1
                        for key, model_attr in mapping:
                            value = getattr(track, key)
                            setattr(track_obj, model_attr, value)
                        track_obj.save()

                    file_obj.save()

        track_count = track_count_new + track_count_updated
        file_count = file_count_new + file_count_updated
        print 'Found %d tracks (%d new, %d updated)' % \
          (track_count, track_count_new, track_count_updated)
        print ' in %d files (%d new, %d updated)' % \
          (file_count, file_count_new, file_count_updated)
        print '%d movies processed (of which %d have no dir)' % \
          (i, nodir)
        print '%d invalid subdirs in folders found' % dir_count
