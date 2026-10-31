import { useEffect, useState } from 'react';
import { message } from '@/api/feedback';
import { Button, Form, Input } from 'antd';
import { UserOutlined, LockOutlined, SafetyOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { API_BASE, apiPost, setToken } from '@/api/http';
import { getUUID } from '@/utils';
import { useAuthStore } from '@/store/auth';

/** 对应 views/common/login.vue */
export default function LoginPage() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [uuid, setUuid] = useState(getUUID());
  const [captchaSrc, setCaptchaSrc] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const resetSession = useAuthStore((s) => s.resetForNewSession);

  const refreshCaptcha = () => {
    const u = getUUID();
    setUuid(u);
    setCaptchaSrc(`${API_BASE}/captcha.jpg?uuid=${u}`);
  };

  useEffect(() => {
    refreshCaptcha();
  }, []);

  const submit = async () => {
    const values = await form.validateFields();
    setSubmitting(true);
    try {
      const data = await apiPost<{ code: number; msg?: string; token?: string }>('/sys/login', {
        username: values.username,
        password: values.password,
        uuid,
        captcha: values.captcha
      });
      if (data && data.code === 0 && data.token) {
        setToken(data.token);
        // 重新登录后强制再拉 nav（对应 isAddDynamicMenuRoutes 重置），但保留刚写入的 token
        resetSession();
        navigate('/home', { replace: true });
        window.location.reload();
      } else {
        refreshCaptcha();
        message.error(data.msg || '登录失败');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-bg">
      <div className="login-brand">
        <h2>renren-fast-react</h2>
        <p>
          renren-fast-react 基于 React、Ant Design 构建，实现 renren-fast 后台管理前端功能。
          前后端分离，通过 token 进行数据交互。
        </p>
      </div>
      <div className="login-panel">
        <h3 style={{ marginTop: 0 }}>管理员登录</h3>
        <Form form={form} onFinish={submit} size="large">
          <Form.Item
            name="username"
            rules={[{ required: true, message: '帐号不能为空' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="帐号" autoComplete="off" />
          </Form.Item>
          <Form.Item name="password" rules={[{ required: true, message: '密码不能为空' }]}>
            <Input.Password prefix={<LockOutlined />} placeholder="密码" autoComplete="off" />
          </Form.Item>
          <Form.Item rules={[{ required: true, message: '验证码不能为空' }]}>
            <div style={{ display: 'flex', gap: 12 }}>
              <Form.Item name="captcha" noStyle rules={[{ required: true, message: '验证码不能为空' }]}>
                <Input prefix={<SafetyOutlined />} placeholder="验证码" style={{ flex: 1 }} />
              </Form.Item>
              <img
                className="login-captcha-img"
                style={{ width: 120 }}
                src={captchaSrc}
                onClick={refreshCaptcha}
                alt="captcha"
              />
            </div>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={submitting}>
              登录
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
