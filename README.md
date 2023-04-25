## [English](README.md) | [中文](readme_zh.md)

### Introduction

`MessageBus` is used to send and receive messages to one or multiple iframes, with an API similar to EventBus. It is easy to use and supports debugging by printing logs to view the communication process.

### Installation
```
yarn add iframe-msg-bus 
npm install iframe-msg-bus
```

### Usage

1. Create a `MessageBus` instance.

```javascript
const bus = new MessageBus(window, {
  targetOrigin: 'https://example.com',
});
```

2. Send a message.

```javascript
bus.emit('my-event', { myData: 'foo' });
```

3. Register an event listener.

```javascript
bus.on('my-event', (data) => {
  console.log(data.myData);
});
```

### Examples
- [react](examples/react)
- [vue](examples/vue)

### API

#### `MessageBus`

- `constructor(win: Window, options?: Options)`: Create a new `MessageBus` instance. Parameters:
  - `win`: The window used to send messages.
  - `options`: Optional configuration options object.
    - `debug`: Whether to enable debugging log recording.
    - `targetOrigin`: The target origin for the `postMessage` call.
    - `maxHandshakeTime`: The maximum time to wait for a handshake response.

- `setDebug(debug: boolean)`: Enables or disables debugging log recording. Parameter:
  - `debug`: Whether to enable debugging log recording.

- `emit(eventName: string, data?: Record<string, unknown>)`: Sends a message with the specified event name and data. Parameters:
  - `eventName`: The event name to send.
  - `data`: An optional object containing the data to send.

- `on(eventName: string, listener: (...args: any[]) => void)`: Registers a listener for the specified event. Parameters:
  - `eventName`: The name of the event to listen for.
  - `listener`: The function to call when the event is received.

- `onGlobal(listener: (...args: any[]) => void)`: Registers a global listener. Parameter:
  - `listener`: The function to call when an event is received.

- `once(eventName: string, listener: (...args: any[]) => void)`: Registers a one-time listener for the specified event. Parameters:
  - `eventName`: The name of the event to listen for.
  - `listener`: The function to call when the event is received.

- `off(eventName: string, listener?: (...args: any[]) => void)`: Removes a listener for the specified event. Parameters:
  - `eventName`: The name of the event to remove the listener for.
  - `listener`: The listener to remove, or null to remove all listeners for this event name.

- `offGlobal(listener?: (...args: any[]) => void)`: Removes a global listener. Parameter:
  - `listener`: The listener to remove, or null to remove all global listeners.

#### `Options`

- `debug?: boolean`: Whether to enable debugging log recording. Defaults to false.
- `targetOrigin?: string`: The target origin for the `postMessage` call. Defaults to `*`.
- `maxHandshakeTime?: number`: The maximum time to wait for a handshake response in milliseconds. Defaults to 5000ms.