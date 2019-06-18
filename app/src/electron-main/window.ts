import { BrowserWindow, BrowserWindowConstructorOptions } from 'electron';
import { Disposable, Emitter } from 'event-kit';
import { ILCUData } from 'models';
import { toFileUrl } from '../lib/path';
import { RiotWSProtocol } from './riot-ws';

function now(): number {
  const time = process.hrtime();
  return time[0] * 1000 + time[1] / 1000000;
}

export class AppWindow {
  private lcuData: ILCUData | null = null;
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
      backgroundColor: '#EAEAEA',
      show: false,
      webPreferences: {
        disableBlinkFeatures: 'Auxclick',
        nodeIntegration: true,
      },
    };

    this.window = new BrowserWindow(windowOptions);
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

    this.window.loadURL(toFileUrl(__dirname, 'index.html'));
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
  }

  public sendConnect(data: ILCUData) {
    this.show();

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

    console.log('de');
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
}
