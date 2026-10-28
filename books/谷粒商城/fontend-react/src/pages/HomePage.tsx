import { Card, Typography } from 'antd';

/** 对应 views/common/home.vue（静态介绍页） */
export default function HomePage() {
  return (
    <Card>
      <Typography.Title level={3}>renren-fast-react</Typography.Title>
      <Typography.Paragraph>
        本项目是 renren-fast-vue（Vue2 + Element UI）后台管理前端的 React + Ant Design 重写版，
        功能与接口行为与原版对齐：登录验证码、token 鉴权、动态菜单路由、按钮权限、
        用户/角色/菜单/参数/日志管理、定时任务（Quartz）、云存储（七牛/阿里/腾讯）。
      </Typography.Paragraph>
      <Typography.Paragraph>
        通过左侧菜单进入各管理功能；默认账号 <Typography.Text code>admin</Typography.Text> /
        密码 <Typography.Text code>admin</Typography.Text>。
      </Typography.Paragraph>
    </Card>
  );
}
