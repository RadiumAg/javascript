import { Button, Form, Input, message } from 'antd';
import './login.css';
import { login } from '../../utils/interface.';

interface LoginUser {
  username: string;
  password: string;
}

const layout1 = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};

const layout2 = {
  labelCol: { span: 0 },
  wrapperCol: { span: 24 },
};

export function Login() {
  const onFinsih = async (values: LoginUser) => {
    const res = await login(values.username, values.password);

    if (res.status === 201 || res.status === 200) {
      message.success('登录成功');

      console.log(res.data);
    } else {
      message.error(res.data.data || '系统繁忙，请稍后再试');
    }
  };

  return (
    <div id="login-container">
      <h1>会议室预订系统</h1>
      <Form {...layout1} onFinish={onFinsih} colon={false} autoComplete="off">
        <Form.Item
          label="用户名"
          name="username"
          rules={[{ required: true, message: '请输入用户名!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="密码"
          name="password"
          rules={[{ required: true, message: '请输入密码!' }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item {...layout2}>
          <div className="links">
            <a href="">创建账号</a>
            <a href="">忘记密码</a>
          </div>
        </Form.Item>

        <Form.Item {...layout2}>
          <Button className="btn" type="primary" htmlType="submit">
            登录
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
