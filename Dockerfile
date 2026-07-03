# ============================================
# Stage 1: Node 构建
# ============================================
FROM node:22-alpine AS builder

WORKDIR /app

# 先复制 package 文件利用缓存
COPY package*.json ./
RUN npm ci

# 复制源码并构建
COPY . .
RUN npm run build-only

# ============================================
# Stage 2: Nginx 部署
# ============================================
FROM nginx:1.27-alpine

# 复制构建产物
COPY --from=builder /app/dist /usr/share/nginx/html

# 复制 nginx 配置
COPY nginx.conf /etc/nginx/conf.d/default.conf

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
    CMD nc -z localhost 80 || exit 1

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
