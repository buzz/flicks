import os
import sys
import cherrypy

from flicks.settings import FRONTEND_DIST_ROOT
from flicks.wsgi import application


if __name__ == '__main__':
  try:
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'flicks.settings')
    cherrypy.tree.graft(application, '/')
    cherrypy.tree.mount(None, '/static', {'/' : {
      'tools.staticdir.dir': os.path.join(FRONTEND_DIST_ROOT, 'static'),
      'tools.staticdir.on': True,
      }})
    cherrypy.engine.start()
    cherrypy.engine.block()
  except KeyboardInterrupt:
    cherrypy.engine.exit()
    sys.exit()
