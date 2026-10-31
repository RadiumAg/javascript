import { Modal, Form, Input } from 'antd';
import { message } from '@/api/feedback';
import { useNavigate } from 'react-router-dom';
import { apiPost, assertOk } from '@/api/http';
import { useAuthStore } from '@/store/auth';
import { useTabsStore } from '@/store/tabs';

/** 对应 main-navbar-update-password.vue：修改成功后清空 tab、退出登录 */
export default function PasswordModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const clearLogin = useAuthStore((s) => s.clearLogin);
  const closeAll = useTabsStore((s) => s.closeAll);

  const submit = async () => {
    const values = await form.validateFields();
    const data = await apiPost('/sys/user/password', {
      password: values.password,
      newPassword: values.newPassword
    });
    if (assertOk(data)) {
      message.success('密码修改成功，请重新登录');
      form.resetFields();
      onClose();
      closeAll();
      clearLogin();
      navigate('/login', { replace: true });
    }
  };

  return (
    <Modal title="修改密码" open={open} onOk={submit} onCancel={onClose} destroyOnHidden>
      <Form form={form} labelCol={{ span: 6 }} wrapperCol={{ span: 16 }}>
        <Form.Item label="账号">
          <span>{user?.username ?? ''}</span>
        </Form.Item>
        <Form.Item name="password" label="原密码" rules={[{ required: true, message: '原密码不能为空' }]}>
          <Input.Password autoComplete="off" />
        </Form.Item>
        <Form.Item name="newPassword" label="新密码" rules={[{ required: true, message: '新密码不能为空' }]}>
          <Input.Password autoComplete="off" />
        </Form.Item>
        <Form.Item
          name="confirmPassword"
          label="确认密码"
          dependencies={['newPassword']}
          rules={[
            { required: true, message: '确认密码不能为空' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('newPassword') === value) return Promise.resolve();
                return Promise.reject(new Error('确认密码与新密码不一致'));
              }
            })
          ]}
        >
          <Input.Password autoComplete="off" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
