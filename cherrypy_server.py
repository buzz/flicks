import os
import sys
import cherrypy

from flicks.settings import FRONTEND_DIST_ROOT
from flicks.wsgi import application


def run_server(port):
  os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'flicks.settings')
  cherrypy.config.update({
    'server.socket_host': '127.0.0.1',
    'server.socket_port': port,
    })
  cherrypy.tree.graft(application, '/')
  cherrypy.tree.mount(None, '/static', {'/' : {
    'tools.staticdir.dir': os.path.join(FRONTEND_DIST_ROOT, 'static'),
    'tools.staticdir.on': True,
    }})
  cherrypy.engine.start()

def stop_server():
  cherrypy.engine.exit()

if __name__ == '__main__':
  run_server(61234)
