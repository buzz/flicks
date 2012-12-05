import re
import elementtree.ElementTree as et
from pprint import pprint

from django.core.management.base import BaseCommand


imdb_regex = re.compile("http://.*imdb.com/title/tt0*(\d+)")
imdb_regex2 = re.compile("http://.*imdb.com/Title\?0*(\d+)")

def parse_imdb(f):
    """Parse imdb number out of imdb url. Skip field if not possible."""
    global imdb_regex, imdb_regex2
    r = imdb_regex.match(f)
    try:
        return int(r.groups()[0])
    except AttributeError:
        r = imdb_regex2.match(f)
        return int(r.groups()[0])

class Command(BaseCommand):
    args = '<FILE>'
    help = 'Imports AMC XML file'

    def handle(self, *args, **options):
        # load xml file
        try:
            xml_doc = et.parse(args[0])
        except IndexError:
            self.stdout.write('No file given\n')
            return
        except IOError:
            self.stdout.write("Could not open file: %s" % args[0])
            return
        # find dups
        imdb_ids = {}
        movies = xml_doc.findall("//Movie")
        for i, movie in enumerate(movies):
            a = movie.attrib
            m = {}
            m['id'] = int(a["Number"])
            m['title'] = a["OriginalTitle"]
            try:
                url = a["URL"]
                imdb_id = parse_imdb(url)
            except (KeyError, AttributeError):
                continue
            if imdb_ids.has_key(imdb_id):
                imdb_ids[imdb_id].append(m)
            else:
                imdb_ids[imdb_id] = [m]
        print "> 1"
        pprint([(k, imdb_ids[k]) for k in imdb_ids.keys() if len(imdb_ids[k]) > 1])
        print "< 0"
        pprint([(k, imdb_ids[k]) for k in imdb_ids.keys() if len(imdb_ids[k]) < 0])
