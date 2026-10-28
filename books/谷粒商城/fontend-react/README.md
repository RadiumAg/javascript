# renren-fast-react

renren-fast 后台管理前端的 React 重写版（Vite + React 18 + TypeScript + Ant Design 5），
功能对照同目录的 `../fontend`（renren-fast-vue，Vue2 + Element UI）。
接口行为规格见 [SPEC-renren-fast-vue.md](./SPEC-renren-fast-vue.md)。

## 运行

```bash
npm install --registry=https://registry.npmmirror.com   # 直连 npm 偶尔 ECONNRESET
npm run dev                                              # http://localhost:5173
```

后端 renren-fast 默认端口 8080，但本机 8080 被 Nacos 控制台占用，用 8086 启动：

```bash
cd ../gulimall/renren-fast
MYSQL_ROOT_PASSWORD=*** mvn -B -DskipTests package   # JDK11: mise x java@temurin-11
mise exec java@temurin-11.0.32+101 -- java -jar target/renren-fast.jar --server.port=8086
```

前端 dev 代理由 `.env.development` 的 `VITE_API_TARGET` 指定（默认 http://localhost:8086），
`/proxyApi/*` -> `<target>/renren-fast/*`。

## 已实现 / 未实现

- 已实现：登录（验证码 + token cookie）、动态菜单路由、多页签(keep-alive)、按钮权限 isAuth、
  修改密码/退出、用户/角色(菜单树授权，兼容 -666666 哨兵编码)/菜单(树表格)/参数/日志、
  定时任务(增删改+暂停/恢复/立即执行+日志)、OSS(列表/上传/云存储配置)。
- 未实现：菜单里 product/coupon/ware/order/member/content 等谷粒商城业务页面
  （这些 .vue 由 renren-generator 生成，从未并入 renren-fast-vue）。
  点击会显示"未实现"提示，登记到 `src/modules/registry.tsx` 即可接入。
- 简化：主题页仅占位；菜单图标不做 svg 映射；SQL监控菜单里的 druid 链接仍指向 8080（DB 数据）。

## 结构

```
src/
  api/http.ts          axios 封装：token 头、GET 附加 t、code:401 全局登出
  store/auth.ts        用户/nav/权限（对应 vuex + router.beforeEach 动态路由）
  store/tabs.ts        多页签
  layout/MainLayout    导航栏/侧边菜单/页签内容区（keep-alive 常驻渲染）
  modules/registry.tsx 菜单 url -> 页面组件登记表
  pages/…              sys / job / oss 页面
```
