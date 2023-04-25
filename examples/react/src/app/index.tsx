import { Button, Card, Input, Space } from 'antd';
import { MessageBus } from 'iframe-msg-bus';
import { useEffect, useRef, useState } from 'react';
import './index.less';

const eventName = 'msg';
const AppPage = () => {
  const [receiveMsg, setReceiveMsg] = useState('');
  const [bus, setBus] = useState<MessageBus>();
  const [msg, setMsg] = useState('');
  const iframeRef = useRef<HTMLIFrameElement>(null);
  useEffect(() => {
    if (!iframeRef.current?.contentWindow) return;
    const bus = new MessageBus(iframeRef.current?.contentWindow, {
      debug: true,
      maxHandshakeTime: 3000,
      targetOrigin: 'http://localhost:8000',
    });
    const handler = (data: any) => {
      setReceiveMsg(data.content);
    };

    bus?.on(eventName, handler);
    setBus(bus);
  }, []);
  const sendMsg = () => {
    bus?.emit('msg2', { content: msg });
  };
  const close = () => {
    bus?.off(eventName);
    bus?.offGlobal();
  };
  useEffect(() => {
    bus?.onGlobal((data) => console.log('global:', data));
  }, [bus]);

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
      <Card title="嵌入页面" style={{ background: '#d9d9d9' }}>
        <iframe
          src="http://localhost:8000/iframe"
          ref={iframeRef}
          frameBorder="none"
          width="100%"
          height="400px"
        ></iframe>
      </Card>
    </div>
  );
};
export default AppPage;
