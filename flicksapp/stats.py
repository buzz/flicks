import re
from datetime import date
from django.db.models import Min, Max

from flicksapp.constants import STATS_PIE_MAX_BINS, STATS_BAR_MAX_BINS


def frange(x, y, step):
    '''
    Range generator that works with float step.
    '''
    while x < y:
        yield x
        x += step


def pie_data(objs, show_others=True, max_bins=STATS_PIE_MAX_BINS):
    '''
    Generates statistic data for a pie chart.
    '''
    others = 0
    data = []
    if show_others:
        max_bins -= 1
    for obj in objs.add_num_movies().only('name'):
        if len(data) >= max_bins:
            others += obj.num_movies
        else:
            data.append({
                'label': obj.name,
                'value': obj.num_movies,
            })
    if others > 0 and show_others:
        data.append({
            'label': 'Others',
            'value': others,
        })
    return data


def bar_data(objs, attr_name, show_others=False, max_bins=STATS_BAR_MAX_BINS):
    '''
    Generates statistic data for a bar/line chart.
    '''
    others = 0
    values = []
    labels = []
    if show_others:
        max_bins -= 1
    objs_ = show_others and objs or objs[:max_bins]
    for obj in objs_:
        if len(values) >= max_bins:
            others += getattr(obj, attr_name)
        else:
            values.append(getattr(obj, attr_name))
            labels.append(obj.name)
    if others > 0 and show_others:
        values.append(others)
        labels.append('Others')
    return {
        'labels': labels,
        'datasets': [{
            'label': 'data',
            'data': values
        }]
    }


def bar_data_hist(objs, search_params, data_min, data_max, step=1):
    '''
    Generates statistic data for a bar/line chart (histogram).
    '''
    values = []
    labels = []
    label_string = step >= 1 and '%d' or '%0.1f'
    for x in frange(data_min, data_max + 1, step):
        v = objs.filter(**(search_params(x, x + step))).count()
        values.append(v)
        labels.append(label_string % x)
    return {
        'labels': labels,
        'datasets': [{
            'label': 'data',
            'data': values
        }]
    }


def imdb_sync_on_data(objs):
    agg = objs.aggregate(Min('imdb_sync_on'), Max('imdb_sync_on'))
    imdb_sync_on_min = agg['imdb_sync_on__min']
    imdb_sync_on_max = agg['imdb_sync_on__max']

    values = []
    labels = []

    d = [imdb_sync_on_min.year, imdb_sync_on_min.month]
    while True:
        d1 = [d[0], d[1] + 1]
        if d1[1] > 12:
            d1[0] += 1
            d1[1] = 1
        v = objs.filter(imdb_sync_on__gte=date(d[0], d[1], 1),
                        imdb_sync_on__lt=date(d1[0], d1[1], 1)).count()
        values.append(v)
        labels.append('%d-%02d' % (d[0], d[1]))

        d = [d[0], d[1] + 1]
        if d[1] > 12:
            d[0] += 1
            d[1] = 1
        if d[0] >= imdb_sync_on_max.year and d[1] > imdb_sync_on_max.month:
            break

    return {
        'labels': labels,
        'datasets': [{
            'label': 'data',
            'data': values
        }]
    }

def mpaa_data(objs):
    '''
    Generates statistic data for MPAA.
    '''
    mpaa_counts = {}
    mpaas = objs.filter(mpaa__contains='Rated ').values_list('mpaa', flat=True)
    for value in mpaas:
        m = re.search('Rated ([^ ]+) ', value)
        if m:
            mpaa = m.group(1)
            if mpaa in mpaa_counts:
                mpaa_counts[mpaa] += 1
            else:
                mpaa_counts[mpaa] = 1
        else:
            print 'Warning: Unparsable mpaa found: %s' % value

    data = []
    for key, count in mpaa_counts.iteritems():
        data.append({
            'label': key,
            'value': count
        })
    data.append({
        'label': 'Not rated',
        'value': objs.exclude(mpaa__contains='Rated ').count()
    })
    return data
