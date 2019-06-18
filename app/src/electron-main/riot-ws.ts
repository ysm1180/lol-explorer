import * as WebSocket from 'ws';
import * as log from 'electron-log';

const MESSAGE_TYPES = {
  WELCOME: 0,
  PREFIX: 1,
  CALL: 2,
  CALLRESULT: 3,
  CALLERROR: 4,
  SUBSCRIBE: 5,
  UNSUBSCRIBE: 6,
  PUBLISH: 7,
  EVENT: 8,
};

export class RiotWSProtocol {
  private retryCount: number = 0;
  private ws: WebSocket | null = null;
  private listeners: { [key: string]: (...args: any[]) => void } = {};

  constructor(private url: string) {
    this.connect();
  }

  private registerListeners() {
    if (this.ws) {
      this.on('open', () => {
        log.info('[RiotWSProtocol] Connected.');
        this.retryCount = 0;
      });

      this.on('error', (e: { code: string; message: string }) => {
        if (e.code === 'ECONNREFUSED') {
          setTimeout(() => {
            if (this.retryCount < 3) {
              log.info('[RiotWSProtocol] Retry connection...');
              this.connect();
              this.retryCount++;
            } else {
              log.info('[RiotWSProtocol] Fail to connection!!!');
            }
          }, 1000);
        } else {
          log.error(e.message);
          throw new Error(e.message);
        }
      });

      this.on('message', this._onMessage.bind(this));

      this.on('close', () => {
        log.info('[RiotWSProtocol] Closed connection...');
        this.dispose();
      });
    }
  }

  public connect() {
    this.ws = new WebSocket(this.url, 'wamp', { rejectUnauthorized: false });
    this.registerListeners();
    for (var event in this.listeners) {
      this.ws.on(event, this.listeners[event]);
    }
  }

  public close() {
    this.ws!.close();
  }

  public terminate() {
    this.ws!.terminate();
  }

  public on(event: string, listener: (this: WebSocket, ...args: any[]) => void) {
    this.listeners[event] = listener;
    this.ws!.addListener(event, listener);
  }

  public subscribe(topic: string, callback: (...args: any[]) => void) {
    this.on(topic, callback);
    this.send(MESSAGE_TYPES.SUBSCRIBE, topic);
  }

  public unsubscribe(topic: string) {
    this.ws!.removeListener(topic, this.listeners[topic]);
    this.send(MESSAGE_TYPES.UNSUBSCRIBE, topic);

    delete this.listeners[topic];
  }

  public send(type: number, message: any) {
    this.ws!.send(JSON.stringify([type, message]));
  }

  private _onMessage(message: any) {
    const [type, ...data] = JSON.parse(message);

    switch (type) {
      case MESSAGE_TYPES.WELCOME:
        // this.session = data[0];
        // this.protocolVersion = data[1];
        // this.details = data[2];
        break;
      case MESSAGE_TYPES.CALLRESULT:
        log.log(
          'Unknown call, if you see this file an issue at https://discord.gg/hPtrMcx with the following data:',
          data
        );
        break;
      case MESSAGE_TYPES.EVENT:
        const [topic, payload] = data;
        this.ws!.emit(topic, payload);
        break;
      default:
        log.log(
          'Unknown type, if you see this file an issue with at https://discord.gg/hPtrMcx with the following data:',
          [type, data]
        );
        break;
    }
  }

  public dispose() {
    if (this.ws) {
      for (var event in this.listeners) {
        this.ws.removeListener(event, this.listeners[event]);
      }

      if (this.ws.readyState === WebSocket.OPEN) {
        this.ws.close();
      }
    }

    this.listeners = {};
    this.ws = null;
  }
}