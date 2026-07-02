<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { getToken } from '@/utils/auth'
import { ElMessage } from 'element-plus'
import { Search, Location, Headset } from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const searchKeyword = ref('')
const isLoggedIn = ref(!!getToken())
const isScrolled = ref(false)

onMounted(async () => {
  window.addEventListener('scroll', () => {
    isScrolled.value = window.scrollY > 40
  })
  if (getToken()) {
    try { await userStore.fetchUser() } catch { isLoggedIn.value = false }
  }
})

function goSearch() {
  if (searchKeyword.value.trim()) {
    router.push({ path: '/product', query: { keyword: searchKeyword.value.trim() } })
  }
}

function logout() {
  userStore.logout()
  isLoggedIn.value = false
  ElMessage.success('已退出登录')
  router.push('/')
}

const navItems = [
  { path: '/', label: '首页', icon: '🏠' },
  { path: '/product', label: '旅游产品', icon: '🏖' },
  { path: '/notes', label: '游记分享', icon: '📖' },
]
</script>

<template>
  <div class="front-layout">
    <!-- Aurora + Glass 导航栏 -->
    <header class="navbar" :class="{ 'navbar-scrolled': isScrolled }">
      <!-- Aurora 背景条 -->
      <div class="navbar-aurora"></div>
      <div class="navbar-inner">
        <!-- Logo -->
        <div class="nav-logo" @click="router.push('/')">
          <div class="logo-icon-box">
            <span class="logo-icon-svg">✈</span>
          </div>
          <div class="logo-text-group">
            <span class="logo-title">旅行网</span>
            <span class="logo-subtitle">Travel Explorer</span>
          </div>
        </div>

        <!-- 导航链接 -->
        <nav class="nav-links">
          <router-link v-for="item in navItems" :key="item.path" :to="item.path" class="nav-link" :class="{ active: (item.path === '/' ? route.path === '/' : route.path.startsWith(item.path)) }">
            <span class="nav-icon">{{ item.icon }}</span>
            {{ item.label }}
            <span class="nav-underline"></span>
          </router-link>
        </nav>

        <!-- 搜索框 -->
        <div class="nav-search">
          <el-input
            v-model="searchKeyword"
            placeholder="搜索目的地..."
            size="default"
            class="search-input"
            @keyup.enter="goSearch"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
        </div>

        <!-- 用户区 -->
        <div class="nav-user">
          <template v-if="isLoggedIn && userStore.userInfo">
            <el-dropdown trigger="click">
              <div class="user-badge">
                <el-avatar :size="36" :src="userStore.userInfo.avatar || ''" class="user-avatar">
                  {{ userStore.userInfo.nickname?.[0] || 'U' }}
                </el-avatar>
                <span class="user-name">{{ userStore.userInfo.nickname }}</span>
                <span class="user-chevron">▾</span>
              </div>
              <template #dropdown>
                <el-dropdown-menu class="user-dropdown-menu">
                  <el-dropdown-item @click="router.push('/center/order')">
                    <el-icon><List /></el-icon> 我的订单
                  </el-dropdown-item>
                  <el-dropdown-item @click="router.push('/center/profile')">
                    <el-icon><User /></el-icon> 个人中心
                  </el-dropdown-item>
                  <el-dropdown-item @click="router.push('/center/favorites')">
                    ❤ 我的收藏
                  </el-dropdown-item>
                  <el-dropdown-item @click="router.push('/cart')">
                    🛒 购物车
                  </el-dropdown-item>
                  <el-dropdown-item divided @click="logout">
                    🚪 退出登录
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
          <template v-else>
            <el-button class="btn-login" size="default" @click="router.push('/login')">登录</el-button>
            <el-button class="btn-register" size="default" @click="router.push('/register')">注册</el-button>
          </template>
        </div>
      </div>
    </header>

    <!-- 主内容 -->
    <main class="main-content">
      <router-view v-slot="{ Component }">
        <transition name="page" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <!-- 页脚 -->
    <footer class="site-footer">
      <div class="footer-inner">
        <div class="footer-grid">
          <div class="footer-col">
            <h4>✈ 旅行网</h4>
            <p>探索世界，遇见美好。为您提供最优质的旅行服务和最难忘的旅行体验。</p>
          </div>
          <div class="footer-col">
            <h5>快速链接</h5>
            <a href="#">关于我们</a>
            <a href="#">热门线路</a>
            <a href="#">特价优惠</a>
            <a href="#">游记分享</a>
          </div>
          <div class="footer-col">
            <h5>客户服务</h5>
            <a href="#">帮助中心</a>
            <a href="#">退款政策</a>
            <a href="#">隐私条款</a>
            <a href="#">联系我们</a>
          </div>
          <div class="footer-col">
            <h5>关注我们</h5>
            <div class="social-links">
              <a href="#" class="social-icon">📱</a>
              <a href="#" class="social-icon">💬</a>
              <a href="#" class="social-icon">📷</a>
            </div>
          </div>
        </div>
        <div class="footer-bottom">
          <p>&copy; 2026 旅行网 Travel Explorer. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script lang="ts">
import { List, User } from '@element-plus/icons-vue'
export default {}
</script>

<style scoped>
/* ===== Navbar ===== */
.navbar {
  position: sticky;
  top: 0;
  z-index: 1000;
  transition: var(--transition-smooth);
}

.navbar-aurora {
  position: absolute;
  inset: 0;
  background: var(--bg-glass);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border-bottom: 1px solid var(--border-glass);
  transition: var(--transition-smooth);
  z-index: 0;
}

.navbar-scrolled .navbar-aurora {
  background: rgba(255, 255, 255, 0.92);
  box-shadow: var(--shadow-md);
}

.navbar-inner {
  position: relative;
  z-index: 1;
  max-width: 1300px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  padding: 10px 24px;
  gap: 20px;
}

/* Logo */
.nav-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  user-select: none;
}

.logo-icon-box {
  width: 42px;
  height: 42px;
  background: linear-gradient(135deg, #667eea, #f5576c);
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition-spring);
}

.nav-logo:hover .logo-icon-box {
  transform: rotate(-8deg) scale(1.08);
}

.logo-icon-svg {
  font-size: 22px;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,.2));
}

.logo-text-group {
  display: flex;
  flex-direction: column;
}

.logo-title {
  font-family: var(--font-heading);
  font-size: 18px;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea, #f5576c);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1.2;
}

.logo-subtitle {
  font-size: 10px;
  color: var(--text-muted);
  font-weight: 400;
  letter-spacing: 0.05em;
}

/* Nav Links */
.nav-links {
  display: flex;
  gap: 4px;
}

.nav-link {
  position: relative;
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 8px 16px;
  border-radius: var(--radius-sm);
  color: var(--text-secondary);
  font-family: var(--font-heading);
  font-weight: 500;
  font-size: 14px;
  transition: var(--transition-smooth);
}

.nav-link:hover { color: var(--color-primary); background: rgba(255, 107, 53, 0.06); }

.nav-link.active { color: var(--color-primary); background: rgba(255, 107, 53, 0.1); }

.nav-icon { font-size: 16px; }

.nav-underline {
  position: absolute; bottom: 4px; left: 50%;
  transform: translateX(-50%) scaleX(0);
  width: calc(100% - 32px); height: 2px;
  background: var(--color-primary); border-radius: 2px;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.nav-link.active .nav-underline { transform: translateX(-50%) scaleX(1); }

/* Search */
.nav-search { flex: 1; max-width: 320px; }

.search-input :deep(.el-input__wrapper) {
  border-radius: 24px !important;
  background: rgba(255,255,255,0.6) !important;
  border: 1px solid var(--border-glass) !important;
  transition: var(--transition-smooth) !important;
}

.search-input :deep(.el-input__wrapper:hover) {
  background: rgba(255,255,255,0.85) !important;
  box-shadow: var(--shadow-sm) !important;
}

/* User Area */
.nav-user { display: flex; align-items: center; gap: 8px; }

.user-badge {
  display: flex; align-items: center; gap: 8px; cursor: pointer;
  padding: 4px 12px 4px 4px; border-radius: 24px;
  background: rgba(255,255,255,0.5); border: 1px solid var(--border-glass);
  transition: var(--transition-smooth);
}

.user-badge:hover { background: rgba(255,255,255,0.85); box-shadow: var(--shadow-sm); }

.user-avatar { border: 2px solid transparent; background: linear-gradient(135deg, #667eea, #f5576c) border-box; }

.user-name { font-family: var(--font-heading); font-weight: 500; font-size: 14px; color: var(--text-primary); }

.user-chevron { color: var(--text-muted); font-size: 11px; }

/* Buttons */
.btn-login {
  background: transparent !important; border: 1.5px solid var(--color-primary) !important;
  color: var(--color-primary) !important; border-radius: 24px !important;
  font-family: var(--font-heading) !important; font-weight: 500 !important;
  transition: var(--transition-smooth) !important;
}

.btn-login:hover { background: var(--color-primary) !important; color: #fff !important; }

.btn-register {
  background: var(--color-primary) !important; border: none !important;
  color: #fff !important; border-radius: 24px !important;
  font-family: var(--font-heading) !important; font-weight: 500 !important;
  box-shadow: 0 4px 14px rgba(255, 107, 53, 0.35) !important;
  transition: var(--transition-smooth) !important;
}

.btn-register:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(255, 107, 53, 0.45) !important;
}

/* Main Content */
.main-content { flex: 1; min-height: 60vh; }

/* Footer */
.site-footer {
  background: linear-gradient(180deg, #1a1a2e 0%, #16213e 100%);
  color: rgba(255,255,255,0.8); margin-top: 60px;
}

.footer-inner { max-width: 1200px; margin: 0 auto; padding: 48px 24px 24px; }

.footer-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 40px; }

.footer-col h4 { font-size: 20px; margin-bottom: 12px; color: #fff; }

.footer-col h5 { font-size: 14px; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 16px; color: var(--color-primary-light); }

.footer-col p { font-size: 14px; line-height: 1.7; }

.footer-col a { display: block; color: rgba(255,255,255,0.6); font-size: 14px; padding: 4px 0; transition: var(--transition-fast); }

.footer-col a:hover { color: var(--color-primary-light); }

.social-links { display: flex; gap: 12px; }

.social-icon { font-size: 22px; }

.footer-bottom { margin-top: 40px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.1); text-align: center; font-size: 13px; color: rgba(255,255,255,0.4); }

/* Page Transition */
.page-enter-active { transition: opacity 0.4s ease, transform 0.4s ease; }
.page-leave-active { transition: opacity 0.25s ease, transform 0.25s ease; }
.page-enter-from { opacity: 0; transform: translateY(16px); }
.page-leave-to { opacity: 0; transform: translateY(-12px); }

/* Responsive */
@media (max-width: 768px) {
  .navbar-inner { flex-wrap: wrap; gap: 10px; padding: 10px 16px; }
  .nav-links { order: 3; width: 100%; justify-content: center; gap: 2px; }
  .nav-search { order: 3; max-width: 100%; }
  .footer-grid { grid-template-columns: 1fr 1fr; gap: 24px; }
}
</style>
