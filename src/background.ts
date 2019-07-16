import { app } from 'electron';
import LCUConnector from 'lcu-connector';
import { AppWindow } from './electron/window';

const isDevelopment = process.env.NODE_ENV !== 'production';
const connector = new LCUConnector('');
let mainWindow: AppWindow | null = null;

type OnDidLoadFn = (window: AppWindow) => void;
let onDidLoadFns: OnDidLoadFn[] | null = [];

let isDuplicateInstance: boolean;
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
app.on('ready', async () => {
  // if (isDevelopment && !process.env.IS_TEST) {
  //   // Install Vue Devtools
  //   try {
  //     await installVueDevtools()
  //   } catch (e) {
  //     console.error('Vue Devtools failed to install:', e.toString())
  //   }
  // }
  // if (isDuplicateInstance) {
  //   return;
  // }

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
