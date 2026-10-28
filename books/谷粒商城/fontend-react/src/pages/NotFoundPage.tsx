import { Button, Result, Space } from 'antd';
import { useNavigate } from 'react-router-dom';

/** 对应 views/common/404.vue */
export default function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <Result
      status="404"
      title="404"
      subTitle="对不起，你访问的页面不存在。"
      extra={
        <Space>
          <Button type="primary" onClick={() => navigate(-1)}>
            返回上一页
          </Button>
          <Button onClick={() => navigate('/home')}>进入首页</Button>
        </Space>
      }
    />
  );
}
