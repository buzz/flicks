import os
import sys
import cherrypy
from django.core.wsgi import get_wsgi_application

from flicks.settings_cherrypy import STATICFILES_DIRS, COVERS_ROOT


def run_server(port):
  cherrypy.config.update({
    'server.socket_host': '127.0.0.1', # listen only on localhost!
    'server.socket_port': port,
    'server.thread_pool': 4,
  })

  # wsgi app
  os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'flicks.settings_cherrypy')
  application = get_wsgi_application()
  cherrypy.tree.graft(application, '/')

  # serve static files and covers
  cherrypy.tree.mount(None, '/static', {
    '/covers': {
      'tools.staticdir.dir': COVERS_ROOT,
      'tools.staticdir.on': True,
    },
    '/': {
      'tools.staticdir.dir': STATICFILES_DIRS[0],
      'tools.staticdir.on': True,
    },
  })
  cherrypy.engine.start()

def stop_server():
  cherrypy.engine.exit()

if __name__ == '__main__':
  try:
    run_server(61234)
    cherrypy.engine.block()
  except KeyboardInterrupt:
    stop_server()
