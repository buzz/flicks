from datetime import datetime
import re
import elementtree.ElementTree as et

from django.core.management.base import BaseCommand
from flicksapp.models import Movie, Country, Person, Genre, File


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
        # add movies
        movies = xml_doc.findall("//Movie")
        for i, movie in enumerate(movies):
            a = movie.attrib
            # keep track of imported fields
            fields = {}
            if (i + 1) % 100 == 0:
                self.stdout.write("Notice: Imported %d movies\n" % (i + 1))
            new_movie = Movie()
            try:
                new_movie.id = int(a["Number"])
                new_movie.title = a["OriginalTitle"].strip()
            except KeyError:
                self.stdout.write(
                    "Panic! Could not extract Number nor OriginalTitle." +
                    "Skipping title: %s\n" % a)
                continue
            new_movie.save() # or relations cannot be assigned
            # if we can extract imdb id we leave most other fields
            # empty that can be filled by imdb
            try:
                url = a["URL"]
                new_movie.imdb_id = parse_imdb(url)
                fields['imdb_id'] = True
            except (KeyError, AttributeError):
                # if imdb id is not present we need to copy other
                # fields
                fields['imdb_id'] = False
                if url and len(url) > 2:
                    new_movie.notes = "URL: %s\n" % url.strip()
                    fields['notes'] = True
                # director
                try:
                    director_name = a["Director"].strip()
                    try:
                        p = Person.objects.get(name=director_name)
                    except Person.DoesNotExist:
                        # ok we have to fill imdb person ourselves in some cases
                        if director_name == 'David Lynch':
                            imdb_id = 186
                        elif director_name == 'Carsten Walter':
                            imdb_id = None
                        elif director_name == 'Roger Sommer':
                            imdb_id = None
                        elif director_name == 'Dieter Rhode':
                            imdb_id = None
                        else:
                            raise Exception(
                                "Panic! Manually assign imdb id for person " +
                                "'%s' (%s)\n" %
                                (director_name, new_movie.title))
                        p = Person(imdb_id=imdb_id, name=director_name)
                        p.save()
                    new_movie.directors.add(p)
                    fields['directors'] = True
                except KeyError:
                    fields['directors'] = False
                # country
                try:
                    country_name = a["Country"].strip()
                    c, created = Country.objects.get_or_create(
                        name=country_name)
                    c.save()
                    new_movie.countries.add(c)
                    fields['countries'] = True
                except KeyError:
                    fields['countries'] = False
                # category
                try:
                    genre_name = a["Category"].strip()
                    g, created = Genre.objects.get_or_create(
                        name=genre_name)
                    g.save()
                    new_movie.genres.add(g)
                    fields['genres'] = True
                except KeyError:
                    fields['genres'] = False
                # year
                try:
                    new_movie.year = int(a["Year"].strip())
                    fields['year'] = True
                except (KeyError, ValueError):
                    fields['year'] = False
                # runtime
                try:
                    new_movie.runtime = int(a["Length"].strip())
                    fields['runtime'] = True
                except (KeyError, ValueError):
                    fields['runtime'] = False
                # plot (description)
                try:
                    new_movie.plot = a["Description"].strip()
                    fields['plot'] = True
                except (KeyError, ValueError):
                    fields['plot'] = False

            # always import non-imdb fields
            # seen (checked)
            try:
                checked = a["Checked"]
                if checked == 'True':
                    seen = True
                elif checked == 'False':
                    seen = False
                else:
                    raise ValueError()
                new_movie.seen = seen
                fields['seen'] = True
            except (KeyError, ValueError):
                fields['seen'] = False
            # picture
            try:
                f = File.objects.create(
                    filename=a["Picture"].strip(), filetype=File.PICTURE_TYPE)
                f.save()
                new_movie.files.add(f)
                fields['picture'] = True
            except (KeyError, ValueError):
                fields['picture'] = False
            # date added
            try:
                new_movie.added_on = datetime.strptime(a["Date"], '%m/%d/%Y')
                fields['added_on'] = True
            except (KeyError, ValueError):
                fields['added_on'] = False

            # finally save movie
            new_movie.save()

            # log import
            imported = ' '.join([f for f in fields.keys() if fields[f]])
            not_imported = ' '.join(
                [('-%s' % f) for f in fields.keys() if not fields[f]])
            self.stdout.write(
                "Imported '%s' (%s %s)\n" %
                (new_movie.title, imported, not_imported))
