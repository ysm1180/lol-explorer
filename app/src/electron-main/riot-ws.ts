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
  }

  private registerListeners() {
    log.info('register listener');
    if (this.ws) {
      for (var event in this.listeners) {
        this.ws.on(event, this.listeners[event]);
      }

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
  }

  public close() {
    if (this.ws) {
      this.ws.close();
    }
  }

  public terminate() {
    if (this.ws) {
      this.ws.terminate();
    }
  }

  public on(event: string, listener: (this: WebSocket, ...args: any[]) => void) {
    this.listeners[event] = listener;
    if (this.ws) {
      this.ws.addListener(event, listener);
    }
  }

  public subscribe(topic: string, callback: (...args: any[]) => void) {
    this.on(topic, callback);
    this.send(MESSAGE_TYPES.SUBSCRIBE, topic);
  }

  public unsubscribe(topic: string) {
    if (this.ws) {
      this.ws.removeListener(topic, this.listeners[topic]);
      this.send(MESSAGE_TYPES.UNSUBSCRIBE, topic);
    }

    delete this.listeners[topic];
  }

  public send(type: number, message: any) {
    if (this.ws) {
      this.ws.send(JSON.stringify([type, message]));
    }
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
        log.log('Unknown call: ', data);
        break;
      case MESSAGE_TYPES.EVENT:
        const [topic, payload] = data;
        this.ws!.emit(topic, payload);
        break;
      default:
        log.log('Unknown type: ', [type, data]);
        break;
    }
  }

  public dispose() {
    if (this.ws) {
      for (var event in this.listeners) {
        this.ws.removeListener(event, this.listeners[event]);
      }
    }

    this.listeners = {};
    this.ws = null;
  }
}
