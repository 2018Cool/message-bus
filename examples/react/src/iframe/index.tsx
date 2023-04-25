import { Button, Card, Input, Space } from 'antd';
import { MessageBus } from 'iframe-msg-bus';
import { useEffect, useState } from 'react';
import ReactDom from 'react-dom';
import './index.less';

const bus = new MessageBus(window, { debug: true });
const eventName = 'msg2';
const IframePage = () => {
  const [receiveMsg, setReceiveMsg] = useState('');
  const [msg, setMsg] = useState('');
  const sendMsg = () => {
    bus.emit('msg', { content: msg });
  };
  const close = () => {
    bus.off(eventName);
  };
  useEffect(() => {
    const handler = (data: any) => setReceiveMsg(data.content);
    bus.on(eventName, handler);
  }, []);

  return (
    <div>
      <Card title="发送的消息">
        <Space>
          <Input onChange={(e) => setMsg(e.target.value)}></Input>
          <Button onClick={sendMsg}>发送</Button>
        </Space>
      </Card>
      <Card
        title="收到的消息"
        extra={<Button onClick={close}>关闭事件接收</Button>}
      >
        <Input.TextArea value={receiveMsg}></Input.TextArea>
      </Card>
    </div>
  );
};
export default IframePage;

if (process.env.NODE_ENV !== 'development') {
  ReactDom.render(<IframePage />, document.getElementById('root'));
}
