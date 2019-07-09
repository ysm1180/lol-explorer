import { BrowserWindow, BrowserWindowConstructorOptions } from 'electron';
import { Disposable, Emitter } from 'event-kit';
import { lcuData } from 'models';
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib';
import { RiotWSProtocol } from './riot-ws';

function now(): number {
  const time = process.hrtime();
  return time[0] * 1000 + time[1] / 1000000;
}

export class AppWindow {
  private lcuData: lcuData | null = null;
  private window: BrowserWindow;
  private emitter = new Emitter();
  private riotWs: RiotWSProtocol | null = null;

  private _loadTime: number | null = null;

  constructor() {
    const windowOptions: BrowserWindowConstructorOptions = {
      x: 100,
      y: 100,
      width: 960,
      height: 660,
      frame: false,
      backgroundColor: '#2F3437',
      show: false,
      webPreferences: {
        disableBlinkFeatures: 'Auxclick',
        nodeIntegration: true,
        webSecurity: false,
      },
    };

    this.window = new BrowserWindow(windowOptions);
    this.window.removeMenu();
  }

  public load() {
    let startLoad = 0;
    this.window.webContents.once('did-start-loading', () => {
      this._loadTime = null;

      startLoad = now();
    });

    this.window.webContents.once('did-finish-load', () => {
      if (process.env.NODE_ENV === 'development') {
        this.window.webContents.openDevTools();
      }

      this._loadTime = now() - startLoad;

      this.maybeEmitDidLoad();
    });

    this.window.webContents.on('did-finish-load', () => {
      this.window.webContents.setVisualZoomLevelLimits(1, 1);

      if (this.lcuData) {
        this.sendConnect(this.lcuData);
      }
    });

    this.window.webContents.on('did-fail-load', () => {
      this.window.webContents.openDevTools();
      this.window.show();
    });

    this.window.on('focus', () => this.window.webContents.send('focus'));
    this.window.on('blur', () => this.window.webContents.send('blur'));

    if (process.env.WEBPACK_DEV_SERVER_URL) {
      // Load the url of the dev server if in development mode
      this.window.loadURL(process.env.WEBPACK_DEV_SERVER_URL as string);
      if (!process.env.IS_TEST) { this.window.webContents.openDevTools(); }
    } else {
      createProtocol('app');
      // Load the index.html when not in development
      this.window.loadURL('app://./index.html');
    }
  }

  public isMinimized() {
    return this.window.isMinimized();
  }

  public isVisible() {
    return this.window.isVisible();
  }

  public restore() {
    this.window.restore();
  }

  public focus() {
    this.window.focus();
  }

  public show() {
    this.window.show();
  }

  public sendConnect(data: lcuData) {
    this.show();

    console.log(`Basic ${Buffer.from(`${data.username}:${data.password}`).toString('base64')}`);
    this.connectRiotWebSocket(
      `wss://${data.username}:${data.password}@${data.address}:${data.port}/`
    );

    this.lcuData = data;
    this.window.webContents.send('lcu-connect', data);
  }

  public sendDisconnect() {
    if (this.riotWs) {
      this.riotWs.close();
      this.riotWs = null;
    }

    this.lcuData = null;
    this.window.webContents.send('lcu-disconnect');
  }

  private get rendererLoaded(): boolean {
    return !!this.loadTime;
  }

  public onClose(fn: () => void) {
    this.window.on('closed', fn);
  }

  public onDidLoad(fn: () => void): Disposable {
    return this.emitter.on('did-load', fn);
  }

  public get loadTime(): number | null {
    return this._loadTime;
  }

  public destroy() {
    this.window.destroy();
  }

  private maybeEmitDidLoad() {
    if (!this.rendererLoaded) {
      return;
    }

    this.emitter.emit('did-load', null);
  }

  private connectRiotWebSocket(url: string) {
    this.riotWs = new RiotWSProtocol(url);
    this.riotWs.on('open', () => {
      console.info('[RiotWSProtocol] Subscribe event.');
      this.riotWs!.subscribe('OnJsonApiEvent', (data) => {
        this.window.webContents.send('lcu-api-message', data);
      });
    });
    this.riotWs.connect();
  }
}
