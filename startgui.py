import platform
import ctypes
import os
import sys

libcef_so = os.path.join(os.path.dirname(os.path.abspath(__file__)),\
        'libcef.so')
if os.path.exists(libcef_so):
    # Import local module
    ctypes.CDLL(libcef_so, ctypes.RTLD_GLOBAL)
    if 0x02070000 <= sys.hexversion < 0x03000000:
        import cefpython_py27 as cefpython
    else:
        raise Exception('Unsupported python version: %s' % sys.version)
else:
    # Import from package
    from cefpython3 import cefpython

import pygtk
pygtk.require('2.0')
import gtk
import gobject
import re

from flicks.settings_cherrypy import DEBUG

def GetApplicationPath(file=None):
    import re, os, platform
    # On Windows after downloading file and calling Browser.GoForward(),
    # current working directory is set to %UserProfile%.
    # Calling os.path.dirname(os.path.realpath(__file__))
    # returns for eg. "C:\Users\user\Downloads". A solution
    # is to cache path on first call.
    if not hasattr(GetApplicationPath, 'dir'):
        if hasattr(sys, 'frozen'):
            dir = os.path.dirname(sys.executable)
        elif '__file__' in globals():
            dir = os.path.dirname(os.path.realpath(__file__))
        else:
            dir = os.getcwd()
        GetApplicationPath.dir = dir
    # If file is None return current directory without trailing slash.
    if file is None:
        file = ''
    # Only when relative path.
    if not file.startswith("/") and not file.startswith("\\") and (
            not re.search(r"^[\w-]+:", file)):
        path = GetApplicationPath.dir + os.sep + file
        if platform.system() == "Windows":
            path = re.sub(r"[/\\]+", re.escape(os.sep), path)
        path = re.sub(r"[/\\]+$", "", path)
        return path
    return str(file)

def ExceptHook(excType, excValue, traceObject):
    import traceback, os, time, codecs
    # This hook does the following: in case of exception write it to
    # the "error.log" file, display it to the console, shutdown CEF
    # and exit application immediately by ignoring "finally" (_exit()).
    errorMsg = '\n'.join(traceback.format_exception(excType, excValue,
            traceObject))
    errorFile = GetApplicationPath('error.log')
    try:
        appEncoding = cefpython.g_applicationSettings['string_encoding']
    except:
        appEncoding = 'utf-8'
    if type(errorMsg) == bytes:
        errorMsg = errorMsg.decode(encoding=appEncoding, errors='replace')
    try:
        with codecs.open(errorFile, mode='a', encoding=appEncoding) as fp:
            fp.write('\n[%s] %s\n' % (
                    time.strftime('%Y-%m-%d %H:%M:%S'), errorMsg))
    except:
        print('[pygtk_.py]: WARNING: failed writing to error file: %s' % (
                errorFile))
    # Convert error message to ascii before printing, otherwise
    # you may get error like this:
    # | UnicodeEncodeError: 'charmap' codec can't encode characters
    errorMsg = errorMsg.encode('ascii', errors='replace')
    errorMsg = errorMsg.decode('ascii', errors='replace')
    print('\n'+errorMsg+'\n')
    cefpython.QuitMessageLoop()
    cefpython.Shutdown()
    os._exit(1)

class FlicksUI:
    mainWindow = None
    container = None
    browser = None
    exiting = None
    searchEntry = None
    vbox = None

    def __init__(self, port):
        self.mainWindow = gtk.Window(gtk.WINDOW_TOPLEVEL)
        self.mainWindow.connect('destroy', self.OnExit)
        self.mainWindow.set_size_request(width=1000, height=800)
        self.mainWindow.set_title('Flicks')
        self.mainWindow.realize()

        self.vbox = gtk.VBox(False, 0)
        if platform.system() == 'Windows':
            self.vbox.connect('size-allocate', self.OnVboxSize)
        self.mainWindow.add(self.vbox)

        try:
          windowID = self.vbox.get_window().handle
        except AttributeError:
          m = re.search('GtkVBox at 0x(\w+)', str(self.vbox))
          hexID = m.group(1)
          windowID = int(hexID, 16)

        windowInfo = cefpython.WindowInfo()
        windowInfo.SetAsChild(windowID)
        self.browser = cefpython.CreateBrowserSync(
            windowInfo,
            browserSettings={},
            navigateUrl='http://127.0.0.1:%d' % port)

        self.vbox.show()
        self.mainWindow.show()
        gobject.timeout_add(10, self.OnTimer)

    def OnWidgetClick(self, widget, data):
        self.mainWindow.get_window().focus()

    def OnTimer(self):
        if self.exiting:
            return False
        cefpython.MessageLoopWork()
        return True

    def OnFocusIn(self, widget, data):
        # This function is currently not called by any of code,
        # but if you would like for browser to have automatic focus
        # add such line:
        # self.mainWindow.connect('focus-in-event', self.OnFocusIn)
        self.browser.SetFocus(True)

    def OnVboxSize(self, widget, sizeAlloc):
        cefpython.WindowUtils.OnSize(self.vbox.get_window().handle, 0, 0, 0)

    def OnExit(self, widget, data=None):
        self.exiting = True
        gtk.main_quit()

def startgui(port):
    version = '.'.join(map(str, list(gtk.gtk_version)))
    print('[pygtk_.py] GTK version: %s' % version)

    # Intercept python exceptions. Exit app immediately when exception
    # happens on any of the threads.
    sys.excepthook = ExceptHook

    # Application settings
    settings = {
        'debug': DEBUG,
        'log_severity': cefpython.LOGSEVERITY_INFO, # LOGSEVERITY_VERBOSE
        'log_file': DEBUG and GetApplicationPath('debug.log') or '',
        'release_dcheck_enabled': DEBUG,
        'locales_dir_path': os.path.join(
            cefpython.GetModuleDirectory(), 'locales'),
        'resources_dir_path': cefpython.GetModuleDirectory(),
        'browser_subprocess_path': os.path.join(
            cefpython.GetModuleDirectory(), 'subprocess'),
    }

    cefpython.Initialize(settings)

    gobject.threads_init() # Timer for the message loop
    FlicksUI(port)
    gtk.main()

    cefpython.Shutdown()

if __name__ == '__main__':
  startgui(61234)
