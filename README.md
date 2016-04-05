# Flicks

Flicks is a web application for movie collectors. It consists of

* A thin REST back-end implemented using [Django](https://www.djangoproject.com/)
* A user interface implemented using HTML5/[Backbone](http://backbonejs.org/)

## Features

in the works…

## Requirements

* Python 2.7
* [Virtualenv](https://virtualenv.pypa.io/)
* MySQL *(Django supports a variety of other databases which are untested but should work too)*
* [Node.js 5.1.0](https://nodejs.org/) *(other versions might work)*
* [Bower](http://bower.io/)
* [npm](https://www.npmjs.com/)

Many more dependencies are automatically installed using pip, bower and npm.

## Installation

Clone the repository:

    $ git clone https://github.com/buzz/flicks.git
    $ cd flicks

It is highly recommended to use a Virtualenv to manage Flicks' dependencies:

    $ virtualenv venv
    $ source venv/bin/activate
    $ pip install -r requirements.txt

### Configuration file

Never edit `flicks/settings.py` directly! It serves as the default configuration file. You override everything in your own file:

Create configuration file:

    $ cp flicks/settings_local.example.py flicks/settings_local.py

[Generate](http://www.miniwebtool.com/django-secret-key-generator/) and add a [SECRET_KEY](https://docs.djangoproject.com/en/dev/ref/settings/#secret-key) to your `settings_local.py` otherwise Django will not start.

You can have a look at `flicks/settings.py` for a list of other settings.

#### Database

The database section looks like this on my developer box:

    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.mysql',
            'NAME': 'flicks',
            'USER': 'root',
            'PASSWORD': '',
            'HOST': '',
            'PORT': '',
            'OPTIONS': {
                'init_command': 'SET storage_engine=MyISAM', # for full-text index!
            },
        }
    }

Make sure this database exists and is accessible.

For an installation without a dedicated database server you might try SQLite which is not tested but probably works:

    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': 'flicks',
        }
    }

#### Paths

Flicks parses media files and also displays and downloads movie artwork. The following two configuration options set the locations for the movie and image folder:

    MOVIES_ROOT = '/path/to/flicks'
    COVERS_ROOT = '/path/to/covers'

*Note:* Flicks stores movies and covers in a particular folder/file structure:

* `MOVIES_ROOT`  
Movies are organized in sub-directories:  
`MOVIES_ROOT/0000/00XX/` for the entries 1 to 99  
`MOVIES_ROOT/0100/01XX/` for the entries 100 to 199 and so forth…  
Each directory contains all files related to one entry.
* `COVERS_ROOT` follows a simple format:  
`COVERS_ROOT/movies_N.jpg`, where N is the movie ID without leading zeros.

The directory structure is important to know but Flicks is actually organizing this for you.

### Set-up database

To initialize the database, type:

    $ ./manage.py syncdb

To migrate all database tables:

    $ ./manage.py migrate

### Build front-end

Now everything is setup so your computer can run the Flicks back-end. The actual user interface is built with HTML5 and  [Backbone](http://backbonejs.org/)/[Marionette](http://marionettejs.com/). The project is managed using grunt:

    $ cd flicksfrontend
    $ bower install
    $ npm install
    $ grunt dist

The `grunt dist` command should generate the web app files in the `dist` folder.

*Note:* You can use `grunt dev` to start a server for front-end developing on port `7000`.

### Create symlink for covers

After building the front-end you need to create a symlink to the covers:

    $ cd dist/static
    $ ln -s COVERS_ROOT .

*Note:* Replace `COVERS_ROOT` with the actual path to the covers folder.

## Run Flicks

You can start Flicks by using the following command:

    $ ./manage.py runserver_plus

Fire up a browser and point it to `http://localhost:8000/`.

## Management tools

### Sync' with IMDb

Sync' all movies with IMDb that haven't been sync'd for more than one week:

    $ ./manage.py imdb_sync

*Note:* Can also be triggered for single movies in the front-end.

### Import from local directory

Import movies from `SRC_DIR` (single files and directories are interpreted as one movie) to `MOVIES_ROOT`:

    $ ./manage.py import_from_dir SRC_DIR

*Note:* It greatly enhances IMDb search result quality if movie file names include title and year.

**Warning:** This script does actually quite a lot and moves data across your file system. So use with care!

This outlines the process:

* Walks directory tree under `SRC_DIR`, for each encountered file/directory:
 1. Perform IMDb query based on file name
 1. Let user choose from results or input custom IMDb number
 1. Warns if movie already exists in database
 1. Moves files to correct folder inside `MOVIES_ROOT`
 1. Sets `added_on` date field according to file modification time
 1. Triggers IMDb import
 1. Triggers cover import

*Note:* Media file parsing is not performed here. Look next command for this.

### Scan media files

Scan the folder `MOVIES_ROOT` for media file information using [MediaInfo](https://mediaarea.net/en/MediaInfo):

    $ ./manage.py scan_files

### Set `added_on` field

Scan the folder `MOVIES_ROOT` and set `added_on` field according to file modification time.

    $ ./manage.py set_added_on_from_file

### Import from AMC

Import from [Ant Movie Catalog](http://www.antp.be/software/moviecatalog) (needs [ElementTree](http://effbot.org/zone/element-index.htm)):

    $ ./manage.py import_amc_xml

## Server deployment

This is beyond the scope of this document.

Hosting a Django application is [well documented](https://docs.djangoproject.com/en/1.9/howto/deployment/) and usually involves running [Gunicorn](http://gunicorn.org/) or similar behind a web server like nginx or Apache. This is the way to go if you want to expose Flicks to the Internet and add features like TLS encryption and/or authentication.

## License

This product is licensed under the terms of the **GNU GENERAL PUBLIC LICENSE Version 2**.

Pleaser refer to the LICENSE file for details.
