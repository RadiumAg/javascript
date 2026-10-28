# SPEC: renren-fast-vue (Vue2 + Element UI) — Functional Specification for React + Ant Design Rewrite

Source studied:
- Frontend: `/Users/zly/Desktop/work/javascript/books/谷粒商城/fontend/src`
- Backend: `/Users/zly/Desktop/work/javascript/books/谷粒商城/gulimall/renren-fast/src/main/java/io/renren/modules` (sys, job, oss)

---

## 0. Global infrastructure

### 0.1 Backend server config (application.yml)

- `server.port: 8080`
- `server.servlet.context-path: /renren-fast`
- Jackson: `time-zone: GMT+8`, `date-format: yyyy-MM-dd HH:mm:ss` (all `Date` fields serialize as `"yyyy-MM-dd HH:mm:ss"` strings; job entities also carry explicit `@JsonFormat` with the same pattern).
- multipart max 100MB.
- Redis disabled (`spring.redis.open: false`, `renren.redis.open: false`) — token is stored in DB table `sys_user_token`.
- Frontend dev `static/config/index.js`: `window.SITE_CONFIG['baseUrl'] = 'http://localhost:8080/renren-fast'`. So every `adornUrl('x')` in dev resolves to `http://localhost:8080/renren-fast/x` (or `/proxyApi/x` when `process.env.OPEN_PROXY` and non-production).
- Token validity: `renren.jwt.expire: 604800` (7 days). Login response also returns `expire`.

### 0.2 HTTP layer (`utils/httpRequest.js`)

- axios instance, timeout 30s, `withCredentials: true`, default `Content-Type: application/json; charset=utf-8`.
- Request interceptor: sets header `token = Vue.cookie.get('token')` (cookie name is literally `token`).
- Response interceptor: if `response.data.code === 401` → `clearLoginInfo()` + `router.push({name:'login'})`. Note the backend `OAuth2Filter` returns HTTP 200 with body `{"code":401,"msg":"invalid token"}` when token missing/invalid.
- `adornUrl(actionName)` → `baseUrl + actionName` (paths in this doc are the `actionName`, i.e. relative to the context path `/renren-fast`).
- `adornParams(params = {}, openDefaultParams = true)` → merges `{ t: Date.now() }` into GET query params (cache-buster). **Every GET also sends `t=<timestamp>`.**
- `adornData(data = {}, openDefaultData = true, contentType = 'json')` → merges `{ t: Date.now() }` and `JSON.stringify`s (or `qs.stringify` for form). With `openDefaultData=false` the payload is sent verbatim (used for array bodies on delete/pause/resume/run endpoints). **JSON POSTs therefore include a stray `"t"` field, which backend `@RequestBody` DTOs ignore.**

### 0.3 Auth & routing model (router/index.js, OAuth2Filter)

- Hash-mode router. Global routes: `/404`, `/login`. Main layout route `/` (redirect to `home`), children `home`, `theme`, `demo-echarts`, `demo-ueditor`; `mainRoutes.beforeEnter` requires cookie token, else redirect to login.
- On first non-global navigation, `router.beforeEach` calls `GET /sys/menu/nav` **once** (`isAddDynamicMenuRoutes` flag), then:
  - stores `sessionStorage.menuList` = `data.menuList` (tree), `sessionStorage.permissions` = `data.permissions` (array of perm codes);
  - builds dynamic routes from leaf menus whose `url` is set: route path/name = `url.replace('/','-')` (leading `/` stripped first), `meta = { menuId, title: name, isDynamic: true, isTab: true, iframeUrl: '' }`;
  - if menu `url` is an `http(s)://` URL, route path/name = `i-<menuId>` and `meta.iframeUrl = url` (rendered in iframe tab);
  - component resolved lazily as `views/modules/<url>` (e.g. url `sys/user` → `modules/sys/user.vue`);
  - fallback `{ path:'*', redirect:'404' }`.
- Permission check `isAuth(key)` (`utils/index.js`): `JSON.parse(sessionStorage.permissions || '[]').indexOf(key) !== -1`. Used as `v-if="isAuth('...')"` on buttons.
- Backend token extraction (`OAuth2Filter.getRequestToken`): header `token` first, **falling back to query parameter `?token=`** — this is how the OSS upload (native form POST, cannot set headers) authenticates.

### 0.4 `/sys/menu/nav` response shape (exact)

`{"code":0,"msg":"success","menuList":[...],"permissions":["sys:user:list", ...]}`

- `menuList` is a **tree**: `SysMenuEntity` objects; children nested under field **`list`** (not `children`). Only `type in (0,1)` (catalog/menu) are included — buttons are excluded from the nav tree. Root nodes are those whose parent is absent.
- `permissions` is the flat `Set<String>` of `perms` codes of all the user's menus (buttons included).
- For userId==1 (SUPER_ADMIN) all menus are returned; otherwise only menus granted via role↔menu.

### 0.5 Standard response envelope

`R extends HashMap<String,Object>`: `{ "code": 0, "msg": "success", ...extras }`. Non-zero `code` + `msg` = business error (frontend shows `data.msg` via `this.$message.error`).
Paginated extras: `"page": PageUtils` with fields **`totalCount, pageSize, totalPage, currPage, list`**. Frontend binds `total` to `data.page.totalCount`, rows to `data.page.list`.

### 0.6 Pagination params contract (backend `Query.getPage`)

- GET query params `page` (1-based current page, default 1) and `limit` (default 10). Also optional `sidx` (order field) + `order` (`asc`/`desc`) — **unused by any of the pages in scope** (no sortable columns wired).
- The extra `t` param is harmless (ignored).
- All list endpoints accept params as `@RequestParam Map<String,Object>` and filter with LIKE on the documented field.

### 0.7 `utils/index.js`

- `getUUID()`: v4-like uuid string built with `Math.random()` (template `xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx`). Used only for the captcha `uuid`. (Bug in the original: the 'y' branch computes `('r&0x3'|'0x8')` which is always `8`; harmless.)
- `isAuth(key)`: see 0.3.
- `treeDataTranslate(data, id='id', pid='parentId')`: converts a **flat** array into a tree by mutating objects — attaches children under `children` and depth under `_level` (root items have no `_level`... items whose `pid` lookup exists and `id!==pid` become children; the rest are returned as roots). Used with `'menuId'` as id in menu/role pages. In React you can use `Tree` data directly; produce `children` + level for indent.
- `clearLoginInfo()`: deletes `token` cookie, `store.commit('resetStore')` (resets all vuex state to initial snapshot `window.SITE_CONFIG.storeState`), resets `router.options.isAddDynamicMenuRoutes=false` so nav is refetched after re-login. React equivalent: clear token, reset global store, force nav refetch.
- `utils/validate.js`: regex helpers `isEmail`, `isMobile` (`/^1[0-9]{10}$/`), `isPhone`, `isURL` (`/^http[s]?:\/\/.*/` — used to decide iframe menus).

### 0.8 `store/modules/common.js` (vuex) — state to reproduce in React context/store

`documentClientHeight` (px, kept on window resize by main.vue), `navbarLayoutType` (`'default'|'inverse'`), `sidebarLayoutSkin` (`'light'|'dark'`), `sidebarFold` (bool), `menuList` (from sessionStorage), `menuActiveName`, `contentIsNeedRefresh` (used to force-remount main content for "refresh tab"), `mainTabs` (array of `{menuId,name,title,type:'module'|'iframe',iframeUrl,params,query}`), `mainTabsActiveName`.
`store/modules/user.js`: `{ id, name }` — set from `/sys/user/info` at app boot.

---

## 1. Layout views

### 1.1 `views/main.vue` — root layout shell

- Purpose: full-screen layout wrapper (navbar + sidebar + content), fullscreen loading until current user loaded.
- APIs:
  - `GET /sys/user/info` (`adornParams()` → only `t`) — no permission needed (logged-in user). Reads `data.user.userId`, `data.user.username`; stores into user store; then turns off loading. Envelope: `{code:0, user: SysUserEntity{userId,username,...}}`.
- Behavior: on mount + window resize, updates `documentClientHeight = document.documentElement.clientHeight`. Provides `refresh()` via DI (`provide/inject`) that toggles `contentIsNeedRefresh` true→false in `$nextTick` to remount `<main-content>` (used by the tab "refresh" action).
- Renders `main-navbar`, `main-sidebar`, and `main-content` (only when `!contentIsNeedRefresh`).

### 1.2 `views/main-sidebar.vue`

- Purpose: left menu. Static items: 首页 (→ route `home`), demo group (`echarts`, `ueditor`). Dynamic items: recursive `<sub-menu>` for each entry of `menuList` (loaded from `sessionStorage.menuList` in `created()`).
- No APIs.
- Route watch (`routeHandle`): when current route `meta.isTab` — if a tab with `name===route.name` doesn't exist in `mainTabs`, push a new tab object `{menuId: meta.menuId||name, name, title: meta.title, type: iframeUrl is URL ? 'iframe':'module', iframeUrl, params, query}`; then set `menuActiveName = String(tab.menuId)` and `mainTabsActiveName = tab.name`. For dynamic tabs not found in `dynamicMenuRoutes` (sessionStorage) it logs an error.
- Reactive to store: skin (`light`/`dark`), collapse (`sidebarFold`).

### 1.3 `views/main-sidebar-sub-menu.vue` (recursive `sub-menu`)

- Props: `menu` (SysMenuEntity nav node), `dynamicMenuRoutes` (array).
- If `menu.list` non-empty → `el-submenu` (index = `String(menu.menuId)`, icon = `menu.icon` via svg sprite, title = `menu.name`), recursing on `menu.list`.
- Else → `el-menu-item` (index = `String(menu.menuId)`); click = `gotoRouteHandle(menu)`: find in `dynamicMenuRoutes` the route whose `meta.menuId === menu.menuId` and `$router.push({name})`.
- No APIs.

### 1.4 `views/main-navbar.vue`

- Purpose: top bar. Left: brand text "人人快速开发平台" (click → home), collapse toggle icon (flips `sidebarFold`). Right: theme settings (→ route `theme`, badge "new"), 官方社区 external link, Git源码 dropdown (3 external links), user avatar dropdown with **修改密码** and **退出**.
- API:
  - `POST /sys/logout` — body `adornData()` → `{"t":...}`; requires valid token (Shiro filter; no explicit perms). On `code===0`: `clearLoginInfo()` + `$router.push({name:'login'})`. Wrapped in confirm dialog "确定进行[退出]操作?".
- Mounts `main-navbar-update-password` dialog lazily (`v-if` + `ref.init()`).

### 1.5 `views/main-navbar-update-password.vue` (password dialog)

- Purpose: change current user's password.
- Form fields / validation:
  - 账号 — read-only text (store `user.name`).
  - `password` 原密码 — required, `el-input type=password`.
  - `newPassword` 新密码 — required.
  - `confirmPassword` 确认密码 — required + custom validator equal to `newPassword` ("确认密码与新密码不一致").
- API: `POST /sys/user/password` — body `{t, password, newPassword}` (backend DTO `PasswordForm{password,newPassword}`; both are hashed server-side with current user's salt via `Sha256Hash`; wrong old password → `{code:500,msg:"原密码不正确"}`).
- On success: message toast, close dialog, **clear `mainTabs`, `clearLoginInfo()`, redirect to login** (force re-login).

### 1.6 `views/main-content.vue`

- Purpose: content area. If route `meta.isTab` → Element tabs UI over `mainTabs`: closable tabs, tab click pushes stored route; tab remove drops from `mainTabs` and if active tab removed navigates to last remaining (or `home` + clear `menuActiveName` when empty). Dropdown tools: 关闭当前/关闭其它/关闭全部标签页, 刷新当前标签页 (calls injected `refresh()`).
- Each tab body: `iframe` when `type==='iframe'` (src `item.iframeUrl`, 100% size) else `<keep-alive><router-view/></keep-alive>`. Non-tab routes render router-view directly in an `el-card`.
- Content height calc: `documentClientHeight - 50(navbar) - 30(padding) - 2 (- 40 when tabs)`; `height` style for iframe tabs, `minHeight` otherwise.
- No APIs.

---

## 2. Common pages

### 2.1 `views/common/login.vue`

- Purpose: admin login with image captcha.
- APIs:
  - Captcha image (not axios): `<img src>` = `adornUrl('/captcha.jpg?uuid=<uuid>')` → `GET /captcha.jpg?uuid=` — backend streams JPEG, `Cache-Control: no-store,no-cache`. uuid is regenerated on every click-to-refresh and on component create.
  - `POST /sys/login` — body `{t, username, password, uuid, captcha}` (backend `SysLoginForm{username,password,captcha,uuid}`). Server: validates captcha (per-uuid, 1-time), checks `Sha256Hash(password, salt)` equality, rejects `status===0` ("账号已被锁定,请联系管理员"). Success: `{code:0, token:"<sha256 userId:uuid>", expire:2592000? — actually 604800}`.
- Form: `userName` required ("帐号不能为空"), `password` required, `captcha` required. Enter key submits.
- On success: `this.$cookie.set('token', data.token)` (cookie, path default) then `router.replace({name:'home'})` — triggers nav fetch. On failure: refresh captcha + `$message.error(data.msg)`.
- Note: field is `userName` in the form model but sent as `username`.

### 2.2 `views/common/home.vue`

- Static intro page (project description, links, QQ groups). No APIs, no state.

### 2.3 `views/common/404.vue`

- Static "400"-styled not-found page (typo in original: shows `400`), buttons 返回上一页 (`$router.go(-1)`) and 进入首页 (`router.push name:'home'`). No APIs.

### 2.4 `views/common/theme.vue` (brief)

- Layout settings only (local, no persistence beyond vuex): radio groups bound (computed get/set) to `common.navbarLayoutType` (`default`/`inverse`) and `common.sidebarLayoutSkin` (`light`/`dark`).

---

## 3. sys module

### 3.1 `views/modules/sys/user.vue` (route `/sys-user`)

- Purpose: admin users list with search/pagination/CRUD.
- APIs:
  - `GET /sys/user/list` params `{t, page, limit, username}` (search box model name is `userName`; query key is `username`). Backend perms `sys:user:list`; non-super-admin gets hidden filter `createUserId=<current>` (only sees self-created). Response rows (`page.list[]`): `SysUserEntity` — `userId, username, email, mobile, status, createTime, createUserId, salt(⚠ returned), password(⚠ returned by select* )`. Frontend uses `userId, username, email, mobile, status, createTime`.
  - `POST /sys/user/delete` body = **raw JSON array of Long userIds** (`adornData(ids,false)`). Perms `sys:user:delete`. Backend refuses if ids contains `1` ("系统管理员不能删除") or current user id ("当前用户不能删除"); also deletes `sys_user_role` rows (via `deleteBatch` service? — here it's `removeByIds`; role links are cleaned in DB layer of original renren-fast `deleteBatch` service override — see note §7 D12).
- Table columns: selection | `userId` "ID" (w80) | `username` "用户名" | `email` "邮箱" | `mobile` "手机号" | `status` "状态" (tag: `0`→danger 禁用, else 正常) | `createTime` "创建时间" (w180) | actions "操作" (w150, fixed right).
- Pagination: `page-sizes [10,20,50,100]`, layout total,sizes,prev,pager,next,jumper; `total` ← `page.totalCount`. Size change resets page to 1.
- Actions/permissions:
  - 查询 — no perm.
  - 新增 `v-if isAuth('sys:user:save')` → open user-add-or-update (no id).
  - 批量删除 `v-if isAuth('sys:user:delete')`, disabled unless selection; confirm text embeds joined ids.
  - Row 修改 `v-if isAuth('sys:user:update')`; Row 删除 `v-if isAuth('sys:user:delete')`.
- Refetch on `activated()` (keep-alive re-entry) — in React with tabs, refetch when the tab remounts/activates.

### 3.2 `views/modules/sys/user-add-or-update.vue` (dialog)

- Purpose: create/edit admin user incl. role assignment.
- On `init(id)`:
  - `GET /sys/role/select` (params `{t}`) → `{code:0, list:[{roleId, roleName, ...}]}` — perms `sys:role:select`; non-super-admin only gets self-created roles. Feeds the role checkbox group.
  - If editing: `GET /sys/user/info/{userId}` → `{code:0, user:{username, salt, email, mobile, roleIdList:[Long], status}}` — perms `sys:user:info`. Populates form (password left blank; `salt` kept hidden).
- Form fields:
  - `userName` 用户名 (input) — required "用户名不能为空".
  - `password` 密码 (password input) — custom validator: required only when creating (`!dataForm.id`); on edit may be blank (= keep old).
  - `comfirmPassword` 确认密码 (sic, "comfirm") — required when creating; must equal `password`.
  - `email` 邮箱 — required + `isEmail` format check. (Backend also `@NotBlank @Email` on Add/Update groups.)
  - `mobile` 手机号 — required + `isMobile` (`^1\d{10}$`).
  - `roleIdList` 角色 — `el-checkbox-group` over role/select list, label = roleName, value = roleId.
  - `status` 状态 — radio `0 禁用` / `1 正常` (default 1).
- Submit: `POST /sys/user/save` (create) or `/sys/user/update` (edit) — **same URL pattern for both**, body:
  `{t, userId: id|undefined, username, password, salt, email, mobile, status, roleIdList}`.
  Perms `sys:user:save` / `sys:user:update`. Server:
  - save: generates random 20-char salt, `Sha256Hash(password,salt)`, sets createTime/createUserId, then `sys_user_role` replace (saveOrUpdate). Role 越权 check: non-admin may only assign roles they created.
  - update: if password blank → not changed; else re-hashed **with the submitted `salt`** (that's why the form carries salt from info). Updates roles too (delete+insert links).
- Success → toast, close, `$emit('refreshDataList')` (parent reloads list). Failure → `$message.error(data.msg)`.

### 3.3 `views/modules/sys/role.vue`

- Purpose: roles list, search by name, CRUD; edit opens the menu-permission tree.
- APIs:
  - `GET /sys/role/list` params `{t, page, limit, roleName}`. Perms `sys:role:list`; non-super-admin filtered by `createUserId`. Rows `SysRoleEntity`: `roleId, roleName, remark, createTime, createUserId`.
  - `POST /sys/role/delete` body raw array `[roleId,...]`. Perms `sys:role:delete`. Backend cascades: deletes `sys_role_menu` and `sys_user_role` rows for those roles.
- Columns: selection | `roleId` "ID" (80) | `roleName` "角色名称" | `remark` "备注" | `createTime` "创建时间" (180) | 操作 (150).
- Actions: 查询; 新增 (`sys:role:save`); 批量删除 (`sys:role:delete`, disabled without selection); row 修改 (`sys:role:update`), 删除 (`sys:role:delete`). Pagination identical to user page.

### 3.4 `views/modules/sys/role-add-or-update.vue` (dialog with menu tree) — **role↔menu assignment**

- On `init(id)`:
  - `GET /sys/menu/list` (params `{t}`) — NOTE: this endpoint returns a **bare JSON array of SysMenuEntity (no `code` envelope)**; frontend pipes it into `treeDataTranslate(data,'menuId')` to build `children` tree for the `el-tree` (`props: {label:'name', children:'children'}`, `node-key="menuId"`, `default-expand-all`, `show-checkbox`). Perms `sys:menu:list`.
  - If editing: `GET /sys/role/info/{roleId}` → `{code:0, role:{roleName, remark, menuIdList:[Long]}}` (perms `sys:role:info`). Frontend then:
    - finds sentinel `tempKey = -666666` inside `menuIdList`; if present, **splices it and everything after it off** (i.e. relies on stored order to separate "fully checked" from "half-checked parents"), then `setCheckedKeys(menuIdList)`.
- Form: `roleName` required ("角色名称不能为空"); `remark` free text; 授权 tree (no form validation).
- Submit: `POST /sys/role/save` | `/sys/role/update` body:
  `{t, roleId: id|undefined, roleName, remark, menuIdList: [...getCheckedKeys(), -666666, ...getHalfCheckedKeys()]}`.
  **The full payload semantics**: checked leaf/parent ids, then the sentinel `-666666` marker, then half-checked parent ids — the entire array is persisted verbatim into `sys_role_menu` (one row per id, including `-666666` and parents). The sentinel lets the loader distinguish which entries were fully-checked vs half-checked (Element UI `setCheckedKeys` auto-checks parents otherwise). This is a hack; a React rewrite can either replicate it (to keep reading legacy rows) or store only leaf/checked ids and recompute parents.
  - Backend save/update: validates (`roleName @NotBlank`), sets createUserId, `checkPrems`: non-admin cannot grant menus beyond own menus ("新增角色的权限，已超出你的权限范围"); rewrites `sys_role_menu` (delete-all-then-insert).
- Perms: `sys:role:save` / `sys:role:update` (page buttons), `sys:menu:list` + `sys:role:info` for load.

### 3.5 `views/modules/sys/menu.vue`

- Purpose: menu management, rendered as **tree table** (rows nested via `row-key="menuId"` + `treeDataTranslate` children). No pagination, no search.
- APIs:
  - `GET /sys/menu/list` — same **bare array** endpoint as §3.4 (this controller does enrich each row with `parentName` from a parent lookup, so the 上级菜单 column is populated). Perms `sys:menu:list`. Frontend builds tree and renders with Element tree-table support (`row-key` + `children` in data; original also ships `components/table-tree-column` but this page doesn't use it — it relies on el-table `row-key` + expandable children… see §6).
  - `POST /sys/menu/delete/{menuId}` (id in path; body `{"t":...}` ignored). Perms `sys:menu:delete`. Backend guards: `menuId <= 31` → "系统菜单，不能删除"; children/buttons exist → "请先删除子菜单或按钮".
- Columns: `name` "名称" (min150) | `parentName` "上级菜单" (120) | icon (svg `<icon-svg :name="row.icon">`) "图标" | `type` "类型" (0→目录 / 1→菜单(success) / 2→按钮(info) tags) | `orderNum` "排序号" | `url` "菜单URL" (tooltip-overflow) | `perms` "授权标识" (overflow) | 操作 (150): 修改 `v-if isAuth('sys:menu:update')`, 删除 `v-if isAuth('sys:menu:delete')`. Toolbar 新增 `v-if isAuth('sys:menu:save')`.
- Refetch via `activated()`.

### 3.6 `views/modules/sys/menu-add-or-update.vue` (dialog)

- On `init(id)`:
  - `GET /sys/menu/select` → `{code:0, menuList:[...]}` — menus of type 目录/菜单 only (`queryNotButtonList`) plus a synthetic root `{menuId:0, name:'一级菜单', parentId:-1, open:true}`. Perms `sys:menu:select`. `treeDataTranslate(menuList,'menuId')` → parent-select `el-tree` (single-select, highlight-current, inside `el-popover` triggered by a readonly input).
  - If editing: `GET /sys/menu/info/{menuId}` → `{code:0, menu:{menuId,type,name,parentId,url,perms,orderNum,icon}}`. Perms `sys:menu:info`.
- Form fields (dynamic by type):
  - `type` 类型 — radio group indexes 0/1/2 ↔ labels `['目录','菜单','按钮']` (default 1).
  - `name` — label becomes `<typeLabel>名称`; required "菜单名称不能为空".
  - `parentName` (display) backed by `parentId` — required via tree selection (popover readonly input; rules msg "上级菜单不能为空" trigger change). Default: set current node via `setCurrentKey(parentId)`.
  - `url` 菜单路由 — `v-if type===1`; custom validator: required when type 1 ("菜单URL不能为空"). Value convention: `模块/页面` like `sys/user`, or full http(s) URL for iframe.
  - `perms` 授权标识 — `v-if type!==0`; comma-separated codes, e.g. `sys:user:list,sys:user:save`.
  - `orderNum` 排序号 — `v-if type!==2`; `el-input-number` min 0.
  - `icon` 菜单图标 — `v-if type!==2`; readonly input + popover grid of all svg sprite names (`Icon.getNameList()` from `@/icons`).
- Submit: `POST /sys/menu/save` | `/sys/menu/update` body `{t, menuId: id|undefined, type, name, parentId, url, perms, orderNum, icon}`. Perms `sys:menu:save`/`sys:menu:update`.
  Server `verifyForm`: name/parentId required; type=1 requires url; **parent type rules**: parent of 目录/菜单 must be 目录(type 0); parent of 按钮 must be 菜单(type 1). (React should mirror these or get 500 `msg` back.)
- Interactions: after save emits `refreshDataList`; changes to menu affect sidebar only after logout/re-login or full reload (nav is fetched once per session).

### 3.7 `views/modules/sys/config.vue` (参数管理 / sys_config)

- APIs:
  - `GET /sys/config/list` params `{t, page, limit, paramKey}`; backend LIKE `param_key` **and hard filter `status = 1`** (see §7 D7). Perms `sys:config:list`. Rows: `{id, paramKey, paramValue, remark}`.
  - `POST /sys/config/delete` body raw array `[id...]`. Perms `sys:config:delete`.
- Columns: selection | `id` "ID"(80) | `paramKey` "参数名" | `paramValue` "参数值" | `remark` "备注" | 操作(150): 修改/删除.
- ⚠ **No `isAuth` guards on any button on this page** (all shown unconditionally) even though backend enforces `sys:config:*` codes. React rewrite: keep visible-always to match, or gate with codes `sys:config:save/update/delete` (recommended; backend rejects anyway).
- Pagination pattern as user page. `paramKey` search input; refetch on `activated()`.

### 3.8 `views/modules/sys/config-add-or-update.vue`

- `init(id)`: if editing `GET /sys/config/info/{id}` → `{code:0, config:{paramKey,paramValue,remark}}` (perms `sys:config:info`). No list/select calls.
- Form: `paramKey` required; `paramValue` required; `remark` optional (all text inputs).
- Submit: `POST /sys/config/save` | `/sys/config/update` body `{t, id: id|undefined, paramKey, paramValue, remark}`. Server validates `paramKey`/`paramValue` `@NotBlank`; saves to DB (+redis cache ops when enabled).
- Note: unlike other dialogs, here `visible=true` immediately in `init` (no chained promises).

### 3.9 `views/modules/sys/log.vue` (操作日志)

- API: `GET /sys/log/list` params `{t, page, limit, key}`. Perms `sys:log:list`. Backend `SysLogServiceImpl.queryPage`: `key` is LIKE-matched against **`username` only** (frontend placeholder says "用户名／用户操作" — see §7 D9).
- Rows `SysLogEntity`: `id, username, operation, method, params, time, ip, createDate`.
- Columns: `id` "ID"(80) | `username` "用户名" | `operation` "用户操作" | `method` "请求方法"(150, overflow) | `params` "请求参数"(150, overflow) | `time` "执行时长(毫秒)" | `ip` "IP地址"(150) | `createDate` "创建时间"(180).
- Read-only: search + pagination only; fetched in `created()` (no `activated`).

---

## 4. job module (quartz)

### 4.1 `views/modules/job/schedule.vue`

- APIs (all under `/sys/schedule`, base controller `ScheduleJobController`; **all POST mappings are `@RequestMapping` — accept any verb, frontend always uses POST**):
  - `GET /sys/schedule/list` params `{t, page, limit, beanName}` — LIKE `bean_name`. Perms `sys:schedule:list`. Rows `ScheduleJobEntity`: `jobId, beanName, params, cronExpression, status, remark, createTime` ("yyyy-MM-dd HH:mm:ss").
  - `POST /sys/schedule/delete` raw array `[jobId...]` — perms `sys:schedule:delete`. Backend: for each id `ScheduleUtils.deleteScheduleJob` (remove quartz detail, forceRefire) then `removeByIds`.
  - `POST /sys/schedule/pause` raw array — perms `sys:schedule:pause`. Backend: `scheduler.pauseJob(key)` per id + bulk DB update `status=1 (PAUSE)`.
  - `POST /sys/schedule/resume` raw array — perms `sys:schedule:resume`. `scheduler.resumeJob` + DB `status=0 (NORMAL)`.
  - `POST /sys/schedule/run` raw array — perms `sys:schedule:run`. `ScheduleUtils.run` = trigger job **once immediately** (with `triggerNow` param in JobDataMap so the task bean's `run(params)` executes right away; does **not** change cron/status). Note: run of a paused job still executes once (quartz trigger fired directly).
  - Semantics summary: `status` 0=正常 1=暂停; stored in DB **and mirrored in quartz scheduler state**; save always creates with status NORMAL and schedules it; delete/pause/resume keep both in sync.
- Columns: selection | `jobId` "ID"(80) | `beanName` "bean名称" | `params` "参数" | `cronExpression` "cron表达式" | `remark` "备注" | `status` "状态" (tag: 0→正常, else danger 暂停 — **inverse of user page!**) | 操作 (150, five text buttons per row: 修改/删除/暂停/恢复/立即执行).
- Toolbar: 查询; 新增 `sys:schedule:save`; 批量删除/批量暂停/批量恢复/批量立即执行 (all `type="danger"`, disabled unless selection, each requires the corresponding code `sys:schedule:delete/pause/resume/run`); 日志列表 button `v-if isAuth('sys:schedule:log')` opens schedule-log dialog.
- Every batch/row op wrapped in `$confirm` with `[id=...]进行[...]操作?` message and success-toast → refetch.

### 4.2 `views/modules/job/schedule-add-or-update.vue`

- `init(id)`: if editing `GET /sys/schedule/info/{jobId}` → `{code:0, schedule:{beanName, params, cronExpression, remark, status}}` (perms `sys:schedule:info`).
- Form: `beanName` required (message text wrongly says "用户名不能为空"; backend msg "bean名称不能为空"); placeholder "spring bean名称, 如: testTask". `params` optional. `cronExpression` required ("0 0 12 * * ?" placeholder). `remark` optional. (Hidden `status` retained from info.)
- Submit: `POST /sys/schedule/save` | `/sys/schedule/update` body:
  `{t, jobId: id|undefined, beanName, params, cronExpression, remark, status: (id? status : undefined)}` — **status omitted on create** (server forces NORMAL). Perms `sys:schedule:save/update`.
  - save: `saveJob` inserts row + `ScheduleUtils.createScheduleJob` (stores jobId into params JSON under key `ScheduleJobEntity.JOB_PARAM_KEY="JOB_PARAM_KEY"`, cron trigger, paused if status!=0).
  - update: `ScheduleUtils.updateScheduleJob` (reschedule/recover-paused) + `updateById`. Invalid cron → quartz `SchedulerException` surfaces as `{code:500,msg:...}` shown by `$message.error`.

### 4.3 `views/modules/job/schedule-log.vue` (dialog, width 75%, table height 460)

- APIs:
  - `GET /sys/scheduleLog/list` params `{t, page, limit, jobId}` — `jobId` value comes from input `dataForm.id` ("任务ID" search box); backend LIKE `job_id` (string like-match). Perms **`sys:schedule:log`** (same code as the 日志列表 button). Rows `ScheduleJobLogEntity`: `logId, jobId, beanName, params, status, error, times, createTime`.
  - `GET /sys/scheduleLog/info/{logId}` → `{code:0, log:{..., error}}` — **no permission annotation on this endpoint**. Triggered by clicking the danger 失败 tag; `$alert(data.log.error)`.
- Columns: `logId` "日志ID"(80) | `jobId` "任务ID"(80) | `beanName` "bean名称" | `params` "参数" | `status` "状态" (0→成功; else danger 失败, clickable) | `times` "耗时(单位: 毫秒)" | `createTime` "执行时间"(180).
- Opened by parent `schedule.vue` via `ref.init()`; no refreshDataList emit.

---

## 5. oss module

### 5.1 `views/modules/oss/oss.vue` (文件列表)

- APIs:
  - `GET /sys/oss/list` params `{t, page, limit}` (no search). Perms `sys:oss:all` (single code protecting all four endpoints). Rows `SysOssEntity`: `id, url, createDate`.
  - `POST /sys/oss/delete` raw array `[id...]`. Perms `sys:oss:all`. Note: backend `removeByIds` deletes DB rows only — files in cloud storage are NOT deleted.
- Columns: selection | `id` "ID"(80) | `url` "URL地址" | `createDate` "创建时间"(180) | 操作: 删除 only.
- Toolbar: 云存储配置 (opens oss-config dialog), 上传文件 (opens oss-upload dialog, emits `refreshDataList` on close), 批量删除 (disabled without selection). ⚠ **No `isAuth` guards anywhere on this page** (backend still enforces `sys:oss:all`).
- Refetch on `activated()`.

### 5.2 `views/modules/oss/oss-config.vue` (云存储配置 dialog)

- API: `GET /sys/oss/config` → `{code:0, config: CloudStorageConfig}` — config JSON stored in `sys_config` table under key **`CLOUD_STORAGE_CONFIG_KEY`** (`ConfigConstant.CLOUD_STORAGE_CONFIG_KEY`, value = JSON via Gson; read with `getConfigObject`). Response object fields (all camelCase, flat):
  - `type` (1七牛/2阿里云/3腾讯云)
  - Qiniu: `qiniuDomain, qiniuPrefix, qiniuAccessKey, qiniuSecretKey, qiniuBucketName`
  - Aliyun: `aliyunDomain, aliyunPrefix, aliyunEndPoint, aliyunAccessKeyId, aliyunAccessKeySecret, aliyunBucketName`
  - Qcloud: `qcloudDomain, qcloudPrefix, qcloudAppId(Integer), qcloudSecretId, qcloudSecretKey, qcloudBucketName, qcloudRegion`
- Form: no `dataRule` at all (empty rules); radio 存储类型 drives `v-if` blocks with the field groups above (labels: 域名/路径前缀/AccessKey/SecretKey/空间名… see component). Qiniu block also has an external link 免费申请(七牛)10GB.
- Submit: `POST /sys/oss/saveConfig` body = **entire current `dataForm` object** (spread from GET config, plus `t`) — server re-validates with `@Range(1..3) type` + group validation by type (`QiniuGroup`/`AliyunGroup`/`QcloudGroup`: domain `@URL`, required keys per provider; `qcloudAppId` `@NotNull Integer`) then Gson-serializes into `sys_config` (`updateValueByKey`). Missing values → `{code:500,msg:"...不能为空"}` toast.
- Note: when config never saved, GET returns `config` = empty `{}`/null → frontend assigns `[]` (quirk: `data.config` falsy → `this.dataForm = []`).
- No refreshDataList emit on save success (just closes dialog).

### 5.3 `views/modules/oss/oss-upload.vue` (上传文件 dialog)

- Uses `el-upload` native multipart (bypasses axios):
  - `action` = `adornUrl('/sys/oss/upload?token=' + cookie token)` → `POST /sys/oss/upload?token=...` (backend OAuth2Filter accepts token from query param — necessary since browser form POST can't set the `token` header).
  - Field name: `file` (`@RequestParam("file") MultipartFile`, default el-upload name).
  - `multiple`, drag-drop enabled; `beforeUpload` rejects non `image/jpeg|jpg|png|gif` with toast "只支持jpg、png、gif格式的图片！".
  - Success per file: response `{code:0, msg:"success", url:"<uploaded url>"}`; the dialog doesn't use `url` — it counts completions and when all files done shows `$confirm('操作成功, 是否继续操作?')` (cancel → close). Failure → `$message.error(response.msg)` (e.g. "上传文件不能为空", "请先配置，才能获取验证码" style cloud-config errors: OSSFactory returns 500 msg if `CLOUD_STORAGE_CONFIG_KEY` unset).
  - On dialog close (`@close`): clears fileList and `$emit('refreshDataList')` → parent list reloads (uploaded rows land in `sys_oss`).
- React equivalent: antd `Upload` with `action=<url>?token=<token>` or customRequest adding header; validate types client-side; refresh list on modal close.

---

## 6. `components/table-tree-column/index.vue` (brief)

Reusable `el-table-column` for manual tree flattening in a plain (non-row-key) table: props `prop`, `treeKey='id'`, `parentKey='parentId'`, `levelKey='_level'`, `childKey='children'`. Renders expand caret + indented label (`_level * 7px`); toggling splices children rows in/out of the parent table's store data and recurses to remove descendants. **Not used by any in-scope page** (menu.vue uses `row-key` + nested `children` data instead), but exists in the repo — a React version would be replaced by antd Table's built-in `childrenColumnName`/`expandable`.

Also present (out of scope, noted for completeness): `components/icon-svg` (svg-sprite `<svg><use xlink:href="#icon-{name}">` wrapper — sidebar/menu icons use `icon-<name>` names stored in `sys_menu.icon`).

---

## 7. Discrepancies & gotchas (frontend vs backend) — for the rewrite

| # | Item | Detail / recommendation |
|---|------|-------------------------|
| D1 | Cache-buster `t` | Every GET query and JSON POST body carries `t` (timestamp). GET list endpoints receive it inside `@RequestParam Map` and ignore it; POST `@RequestBody` DTOs ignore it. Safe to drop in React, but harmless to keep. |
| D2 | Delete/batch bodies are raw arrays | `/sys/user/delete`, `/sys/role/delete`, `/sys/config/delete`, `/sys/oss/delete`, `/sys/schedule/{delete,pause,resume,run}` expect JSON `Long[]` directly (not wrapped `{ids:[...]}`). |
| D3 | `/sys/menu/list` has no envelope | Returns a **bare array** (no `code`). `/sys/menu/select` returns `{code:0,menuList}` with synthetic root `menuId:0,'一级菜单'`. Don't uniformly unwrap `data.code`. |
| D4 | Nav tree children key | `/sys/menu/nav` nests under **`list`**, while the role-permission tree built client-side uses **`children`** (treeDataTranslate). Rewrite must map accordingly. |
| D5 | Role menu tree sentinel | `menuIdList` persisted includes half-checked parent ids **and the fake id `-666666`**, relying on stored order to reconstruct checked vs half-checked on edit (`indexOf(-666666)` → truncate). React should either replicate this encoding or migrate to storing only leaf ids. |
| D6 | Login body naming | Vue model `userName` but sends `username`; backend `SysLoginForm{username,password,captcha,uuid}` — matches. `uuid` ties captcha to image request `GET /captcha.jpg?uuid=`. |
| D7 | config list hidden filter | `SysConfigServiceImpl.queryPage` adds `status = 1` although `SysConfigEntity` (as used by this admin) has no status field and the UI never sets it — rows with status≠1 are invisible here. Gulimall uses sys_config `status` semantics; keep the filter when reusing the backend. |
| D8 | Log search misleading | Placeholder "用户名／用户操作" but backend LIKEs `username` **only** (operation not searched). |
| D9 | User table select* leak | `/sys/user/list` and `/info/{id}` return `password`/`salt`; the UI ignores them; user-add intentionally reloads `salt` to let `/update` re-hash a new password with it. |
| D10 | Status polarity | User status: 0=禁用, 1=正常. Schedule status: **0=正常, 1=暂停**. Schedule-log status: 0=成功, else 失败. Don't share one tag map. |
| D11 | scheduleLog/info unauthenticated perms | `GET /sys/scheduleLog/info/{logId}` has no `@RequiresPermissions` (login-only). List endpoint requires code `sys:schedule:log` (note: the button and the API share one code; there is no separate `sys:scheduleLog:list`). |
| D12 | user delete cascade | Backend `deleteBatch` here is plain `removeByIds`; role links (`sys_user_role`) cleanup relies on the renren service layer (original renren-fast deletes links too; verify when testing against gulimall fork — UI assumes full delete). |
| D13 | Missing frontend perms gating | config.vue and oss.vue render all buttons without `isAuth(...)`; the menu page gates only save/update/delete. Backend enforces `sys:config:*` / `sys:oss:all` regardless (401→ relogin; permission fail → `R.error(403,"没有权限")`? Actually Shiro `AuthorizationException` handler returns `{code:500,msg:"没有权限，请联系管理员授权"}` — surface as error toast). |
| D14 | 401 handling | Token invalid → HTTP **200** body `{code:401,msg:"invalid token"}` (axios response interceptor catches it globally → clear + login route). |
| D15 | OSS upload auth | Only endpoint consuming token from **query param** (`?token=`) because upload posts a raw form without headers. |
| D16 | oss delete doesn't delete files | Removes `sys_oss` rows only; cloud objects remain. |
| D17 | schedule save ignores client status | Frontend sends `status: undefined` on create; server forces `NORMAL(0)`; cron validation happens at quartz time (runtime error toast). |
| D18 | menu delete guard | ids ≤ 31 undeletable ("系统菜单，不能删除"); non-empty children → error. Also backend structural rules (button parent must be menu, etc.) enforced server-side. |
| D19 | schedule job edit duplication | `ScheduleJobServiceImpl.update` in this fork calls `ScheduleUtils.updateScheduleJob(scheduler, scheduleJob)` twice (visible code duplication); behaviorally idempotent-ish, no frontend impact. |
| D20 | `isAuth` source | Permission codes come exclusively from `/sys/menu/nav` `permissions` (sessionStorage), i.e. `sys_menu.perms` strings of type-2 buttons. Seed codes needed by UI: `sys:user:save/update/delete/info/list`, `sys:role:*`, `sys:menu:*`, `sys:config:*`, `sys:log:list`, `sys:schedule:list/save/update/delete/pause/resume/run/info/log`, `sys:oss:all`. |

### Route/menu URL convention

Sidebar → route mapping requires `sys_menu.url` values: `sys/user`, `sys/role`, `sys/menu`, `sys/config`, `sys/log`, `job/schedule`, `oss/oss` → route names `sys-user`, `sys-role`, `sys-menu`, `sys-config`, `sys-log`, `job-schedule`, `oss-oss`; components resolved from `views/modules/<url>`. External URLs (`http…`) become iframe tabs `i-<menuId>`.
