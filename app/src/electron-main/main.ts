import { app } from 'electron';
import { AppWindow } from './window';
import LCUConnector = require('lcu-connector');

const connector = new LCUConnector('');
let mainWindow: AppWindow | null = null;

type OnDidLoadFn = (window: AppWindow) => void;
let onDidLoadFns: Array<OnDidLoadFn> | null = [];

let isDuplicateInstance = false;
const gotSingleInstanceLock = app.requestSingleInstanceLock();
isDuplicateInstance = !gotSingleInstanceLock;

app.commandLine.appendSwitch('--ignore-certificate-errors');

app.on('second-instance', (event, args, workingDirectory) => {
  // Someone tried to run a second instance, we should focus our window.
  if (mainWindow) {
    if (mainWindow.isMinimized()) {
      mainWindow.restore();
    }

    if (!mainWindow.isVisible()) {
      mainWindow.show();
    }

    mainWindow.focus();
  }
});

if (isDuplicateInstance) {
  app.quit();
}

app.on('activate', () => {
  onDidLoad((window) => {
    window.show();
  });
});

let lcuData;
app.on('ready', () => {
  if (isDuplicateInstance) {
    return;
  }

  mainWindow = createWindow();

  connector.on('connect', (data) => {
    lcuData = data;
    if (mainWindow) {
      mainWindow.sendConnect(lcuData);
    }
  });

  connector.on('disconnect', () => {
    lcuData = null;

    if (mainWindow) {
      mainWindow.sendDisconnect();
    }
  });

  connector.start();
});

function createWindow() {
  const window = new AppWindow();
  if (process.env.NODE_ENV === 'development') {
    const {
      default: installExtension,
      REACT_DEVELOPER_TOOLS,
      REACT_PERF,
      REDUX_DEVTOOLS,
    } = require('electron-devtools-installer');
    require('electron-debug')({ showDevTools: true });
    const extensions = [REACT_DEVELOPER_TOOLS, REACT_PERF, REDUX_DEVTOOLS];
    for (const extension of extensions) {
      try {
        installExtension(extension);
      } catch (e) {}
    }
  }

  window.onClose(() => {
    mainWindow = null;
    app.quit();
  });

  window.onDidLoad(() => {
    window.show();

    const fns = onDidLoadFns!;
    onDidLoadFns = null;
    for (const fn of fns) {
      fn(window);
    }
  });

  window.load();

  return window;
}

function onDidLoad(fn: OnDidLoadFn) {
  if (onDidLoadFns) {
    onDidLoadFns.push(fn);
  } else {
    if (mainWindow) {
      fn(mainWindow);
    }
  }
}
