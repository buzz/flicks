from cherrypy_server import run_server, stop_server
from startgui import startgui

PORT = 61234

def run():
  run_server(PORT)
  startgui(PORT)
  stop_server()

if __name__ == '__main__':
  run()
