# TYPES
PICTURE_TYPE   = 'P'
VIDEO_TYPE     = 'V'
NFO_TYPE       = 'N'
SUBTITLES_TYPE = 'S'
OTHER_TYPE     = 'O'
AUDIO_TYPE     = 'A'

# FILE_TYPES_CHOICES
FILE_TYPES = (
    (PICTURE_TYPE, 'Picture',
    ('jpg', 'png', 'gif', 'bmp')),

    (VIDEO_TYPE, 'Video',
    ('avi', 'mkv', 'mpg', 'mpeg', 'mov', 'mp4', 'flv', 'ogm', 'vob')),

    (NFO_TYPE, 'NFO',
    ('nfo',)),

    (SUBTITLES_TYPE, 'Subtitles',
    ('srt', 'sub')),

    (OTHER_TYPE, 'Other', None),
)
FILE_TYPE_CHOICES = [(a, b) for (a, b, c) in FILE_TYPES]

# TRACK_TYPE_CHOICES

TRACK_TYPE_CHOICES = (
    (VIDEO_TYPE,     'Video'),
    (AUDIO_TYPE,     'Audio'),
    (SUBTITLES_TYPE, 'Subtitles'),
)
