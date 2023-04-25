## [English](README.md) | [中文](readme_zh.md)

### 介绍

`MessageBus`用于与单个或多个Iframe发送和接收消息，仿EventBus API，简单易用，同时支持通过打印调试日志查看通信过程。

### 安装
```
yarn add iframe-msg-bus 
npm install iframe-msg-bus
```

### 用法

1. 创建一个 `MessageBus` 实例。

```javascript
const bus = new MessageBus(window, {
  targetOrigin: 'https://example.com',
});
```

2. 发送消息。

```javascript
bus.emit('my-event', { myData: 'foo' });
```

3. 注册事件监听器。

```javascript
bus.on('my-event', (data) => {
  console.log(data.myData);
});
```

### 示例项目
[react](examples/react)
[vue](examples/vue)
### API

#### `MessageBus`

- `constructor(win: Window, options?: Options)`: 创建一个新的 `MessageBus` 实例。参数：
  - `win`: 用于发送消息的窗口。
  - `options`: 可选的配置选项对象。
    - `debug`: 是否启用调试日志记录。
    - `targetOrigin`: `postMessage` 调用的目标源。
    - `maxHandshakeTime`: 等待握手响应的最大时间。

- `setDebug(debug: boolean)`: 启用或禁用调试日志记录。参数：
  - `debug`: 是否启用调试日志记录。

- `emit(eventName: string, data?: Record<string, unknown>)`: 发送一个带有指定事件名和数据的消息。参数：
  - `eventName`: 要发送的事件名称。
  - `data`: 包含要发送的数据的可选对象。

- `on(eventName: string, listener: (...args: any[]) => void)`: 为指定的事件注册一个监听器。参数：
  - `eventName`: 要监听的事件名称。
  - `listener`: 当事件被接收时要调用的函数。

- `onGlobal(listener: (...args: any[]) => void)`: 注册一个全局监听器。参数：
  - `listener`: 当事件被接收时要调用的函数。

- `once(eventName: string, listener: (...args: any[]) => void)`: 为指定的事件注册一个一次性监听器。参数：
  - `eventName`: 要监听的事件名称。
  - `listener`: 当事件被接收时要调用的函数。

- `off(eventName: string, listener?: (...args: any[]) => void)`: 为指定的事件移除监听器。参数：
  - `eventName`: 要移除监听的事件名称。
  - `listener`: 要移除的监听器，如果为空则移除此事件名称绑定的所有监听器。

- `offGlobal(listener?: (...args: any[]) => void)`: 移除全局监听器。参数：
  - `listener`: 要移除的监听器，如果为空则移除所有全局监听器。

#### `Options`

- `debug?: boolean`: 是否启用调试日志记录，默认关闭。
- `targetOrigin?: string`: `postMessage` 调用的目标源，默认为`*`。
- `maxHandshakeTime?: number`: 等待握手响应的最大时间,单位为毫秒，默认为5000ms。


