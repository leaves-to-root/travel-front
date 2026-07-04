# 旅游网站 (Travel Website)

**Spring Boot 3.5.16 + Vue 3.5 + Element Plus** 全栈项目

## 功能概览

### 用户端 (前台)
- **用户认证**：注册/登录、修改密码、个人资料管理
- **首页**：轮播图、热门推荐、特价优惠、搜索
- **旅游产品**：分类筛选、列表分页、产品详情（行程/费用/团期选择）
- **购物车**：增删改查，批量结算
- **订单系统**：下单支付（模拟）、查看订单、取消/退款
- **收藏/浏览历史**
- **优惠券**：领取/使用
- **社区互动**：游记发布/浏览、产品评价评分
- **站内消息通知**

### 后台管理端
- 控制台仪表盘（核心指标）
- 产品管理（CRUD、上下架）
- 分类管理（多级）
- 轮播图管理
- 订单管理（确认/退款）
- 用户管理（启用/禁用）
- 优惠券管理
- 游记审核
- 操作日志

## 技术栈

### 后端 (travel/)
- Java 21, Spring Boot 3.5.16
- MyBatis-Plus 3.5.16 (ORM + 分页)
- MySQL 8.x (数据库)
- Redis (Token 存储)
- Knife4j (API 文档，访问 `/doc.html`)
- Hutool 5.8.42 (工具类)
- 鉴权方式：Redis Token + 拦截器
- 密码加密：BCrypt

### 前端 (travel-front/)
- Vue 3.5 (Composition API + `<script setup>`)
- Vite 8, TypeScript 6
- Element Plus (UI 组件)
- Pinia (状态管理)
- Vue Router 5
- Axios (HTTP 请求)

## 本地运行

### 前置条件
1. **MySQL 8.x** — 创建数据库 `travel` 并导入初始化脚本
2. **Redis** — 启动本地 Redis 服务（默认端口 6379）
3. **Java 21** + **Maven**
4. **Node.js 22+** + **npm**

### 1. 初始化数据库

```sql
-- 在 MySQL 中执行
CREATE DATABASE travel DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
```

导入表结构和初始数据：
```bash
# 方式一：使用 MySQL 命令行
mysql -u root -p travel < travel/数据库/schema.sql
mysql -u root -p travel < travel/数据库/data.sql

# 方式二：在数据库管理工具（Navicat/DataGrip）中分别执行两个 SQL 文件
```

### 2. 配置数据库连接

编辑 `travel/src/main/resources/application.yml`，修改数据库连接和 Redis 连接：
```yaml
spring:
  datasource:
    url: jdbc:mysql://127.0.0.1:3306/travel
    username: root
    password: 你的密码
  data:
    redis:
      host: 127.0.0.1
      port: 6379
      password: 你的Redis密码（如果没有则留空）
```

### 3. 启动后端

```bash
cd travel
mvn spring-boot:run
```

启动后访问：
- API 文档：http://localhost:8080/doc.html
- 测试接口：http://localhost:8080/api/test/hello

### 4. 启动前端

```bash
cd travel-front
npm install
npm run dev
```

启动后访问：http://localhost:5173

### 5. 默认账号

| 角色 | 账号 | 密码 |
|------|------|------|
| 前台用户 | user1 / user2 | 123456 |
| 后台管理 | admin | 123456 |

## 项目结构

### 后端 (travel/)
```
src/main/java/com/travel/
├── common/              # 通用类（Result, ResultCode, BizException, Constants）
│   └── context/         # LoginUser, BaseContext(ThreadLocal), TokenService
├── config/              # 配置（MyBatis, Redis, WebMvc, Knife4j, MyMetaObjectHandler）
├── controller/          # 用户端 API
│   └── admin/           # 后台 API
├── converter/           # Jackson 时间序列化
├── dto/
│   ├── request/         # 请求 DTO
│   └── response/        # 响应 VO
├── entity/              # 数据库实体（共 16 张表）
│   └── base/            # BaseEntity 基类
├── interceptor/         # 登录拦截器 + 管理员拦截器
├── mapper/              # MyBatis-Plus Mapper
├── properties/          # 配置属性类
├── service/             # 业务接口
│   └── impl/            # 业务实现
└── utils/               # 工具类（PasswordUtil, ALiYunOssUtil）
```

### 前端 (travel-front/)
```
src/
├── api/                 # API 请求模块（按业务拆分）
│   ├── request.ts       # Axios 封装（拦截器、统一错误处理）
│   ├── types.ts         # TypeScript 类型定义
│   └── admin/           # 后台 API 模块
├── layouts/             # 布局组件
│   ├── FrontLayout.vue  # 前台布局（导航栏+页脚）
│   └── AdminLayout.vue  # 后台布局（侧边栏+顶栏）
├── router/              # 路由配置（含权限守卫）
├── stores/              # Pinia 状态管理
│   └── user.ts          # 用户 + 管理员 store
├── utils/
│   └── auth.ts          # Token 管理（localStorage）
└── views/
    ├── front/           # 用户端页面
    │   ├── Login.vue / Register.vue
    │   ├── Home.vue / ProductList.vue / ProductDetail.vue
    │   ├── Cart.vue / Checkout.vue
    │   ├── order/       # 订单列表/详情
    │   ├── center/      # 个人中心（资料/收藏/游记/历史/消息）
    │   └── community/   # 游记列表/详情/发布
    └── admin/           # 后台页面（Dashboard/用户/产品/分类/轮播图/订单/优惠券/游记/日志）
```

## 关于第三方依赖的说明

- **支付/短信/第三方登录**：定义为预留接口，未真实集成。支付使用模拟逻辑（一键支付成功）。
- **阿里云 OSS**：如需使用文件上传功能，请在 `application.yml` 中填写 OSS 配置；否则上传功能会返回错误但不影响其他功能。

## API 文档

启动后端后访问 http://localhost:8080/doc.html（Knife4j UI）查看所有 API 接口文档。
