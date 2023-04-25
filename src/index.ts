import { guid } from './utils/guid';
import { Logger } from './utils/logger';

type Options = {
  debug?: boolean;
  targetOrigin?: string;
  maxHandshakeTime?: number;
};

export class MessageBus {
  private win: Window;
  private id: string = '';
  private handlerMap: Map<string | Symbol, Map<any, any>>;
  private globalSymbol: Symbol;
  private targetOrigin: string;
  private maxHandshakeTime: number;

  /**
   * Creates a new MessageBus instance.
   * @param win The window to send messages from.
   * @param options An object containing optional configuration options.
   * @param options.debug Whether to enable debug logging.
   * @param options.targetOrigin The target origin for postMessage calls.
   * @param options.maxHandshakeTime The maximum time to wait for a handshake response.
   */
  constructor(win: Window, options?: Options) {
    this.win = win;
    this.handlerMap = new Map<string | Symbol, Map<any, any>>();
    this.globalSymbol = Symbol('global');
    const {
      debug = false,
      targetOrigin = '*',
      maxHandshakeTime = 5000,
    } = options ?? {};
    this.targetOrigin = targetOrigin;
    this.maxHandshakeTime = maxHandshakeTime;
    Logger.enabled = debug;
    this.startHandshake();
  }

  /**
   * Enables or disables debug logging.
   * @param debug Whether to enable debug logging.
   */
  public setDebug(debug: boolean) {
    Logger.enabled = debug;
  }

  private startHandshake() {
    if (!this.maxHandshakeTime) return;
    const hello = '_hello_';
    if (this.inIframe) {
      this.once(hello, () => {
        Logger.log('receive a hello message');
        this.emit(hello, { target: location.href });
      });
      return;
    }

    this.id = guid();
    let count = 0;
    const interval = 100;
    const timer = setInterval(() => {
      if (count * interval >= this.maxHandshakeTime) {
        clearInterval(timer);
        Logger.error('Handshake failed!');
      }
      Logger.log('Send a hello message');
      this.emit(hello);
      count++;
    }, interval);
    this.once(hello, ({ target }) => {
      Logger.log(
        `Handshake successful! Spend ${count * interval}ms; Bus ID:${
          this.id
        }; Target ${target}`,
      );
      clearInterval(timer);
    });
  }

  public get inIframe() {
    return this.win === window;
  }
  public setBusId(id: string) {
    this.id = id;
  }

  /**
   * Returns a message handler function for the given event name and listener.
   * @param eventName The name of the event to handle.
   * @param listener The listener function to call when the event is received.
   * @param callback An optional callback function to call after the listener has been called.
   * @returns A message handler function.
   * @private
   */
  private getHandler(
    eventName: string | Symbol,
    listener?: any,
    callback?: () => void,
  ) {
    let handler = listener;
    const eventMap =
      this.handlerMap.get(eventName) ?? new Map<Function, Function>();
    if (eventMap.has(listener)) {
      handler = eventMap.get(listener);
      return handler;
    }
    handler = (event: any) => {
      const eventData = event.data;
      if (this.maxHandshakeTime > 0) {
        if (!this.id && this.inIframe && eventData._bus_id_) {
          this.setBusId(eventData._bus_id_);
        }
        if (eventData?._bus_id_ !== this.id && !this.inIframe) return;
      }

      if (eventData?.eventName === eventName) {
        Logger.log('on', eventName ?? '', eventData.data);
        listener?.(eventData.data);
        callback?.();
      } else if (eventName === this.globalSymbol) {
        Logger.log('onGlobal', event?.data);
        listener?.(event);
        callback?.();
      }
    };
    eventMap.set(listener, handler);
    if (!this.handlerMap.has(eventName)) {
      this.handlerMap.set(eventName, eventMap);
    }
    return handler;
  }

  /**
   * Sends a message with the given event name and data.
   * @param eventName The name of the event to emit.
   * @param data An optional object containing data to send with the message.
   */
  public emit(eventName: string, data?: Record<string, unknown>) {
    Logger.log('emit', eventName, data);
    const win = this.inIframe ? this.win.parent : this.win;
    win?.postMessage({ eventName, data, _bus_id_: this.id }, this.targetOrigin);
  }

  /**
   * Registers a listener for the given event name.
   * @param eventName The name of the event to listen for.
   * @param listener A function to call when the event is received.
   */
  public on(eventName: string, listener: (...args: any[]) => void) {
    const handler = this.getHandler(eventName, listener);
    window.addEventListener('message', handler);
  }

  /**
   * Registers a one-time listener for the given event name.
   * @param eventName The name of the event to listen for.
   * @param listener A function to call when the event is received.
   */
  public once(eventName: string, listener: (...args: any[]) => void) {
    const handler = this.getHandler(eventName, listener, () =>
      this.off(eventName, listener),
    );
    window.addEventListener('message', handler);
  }

  /**
   * Registers a global listener for all events.
   * @param listener A function to call when any event is received.
   */
  public onGlobal(listener: (...args: any[]) => void) {
    const handler = this.getHandler(this.globalSymbol, listener);
    window.addEventListener('message', handler);
  }

  /**
   * Removes a global listener for all events.
   * @param listener An optional function to remove. If not provided, all global listeners will be removed.
   */
  public offGlobal(listener?: (...args: any[]) => void) {
    this.off(this.globalSymbol, listener);
  }

  /**
   * Removes a listener for the given event name.
   * @param eventName The name of the event to remove the listener for.
   * @param listener An optional function to remove. If not provided, all listeners for the event will be removed.
   */
  public off(eventName: string | Symbol, listener?: (...args: any[]) => void) {
    const eventMap = this.handlerMap.get(eventName);
    if (!listener && eventMap) {
      eventMap.forEach((handler) =>
        window.removeEventListener('message', handler),
      );
      this.handlerMap.delete(eventName);
      return;
    }
    const handler = eventMap?.get(listener);
    if (!handler) return;
    window.removeEventListener('message', handler);
    eventMap?.delete(listener);
  }
}
