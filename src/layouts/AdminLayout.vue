<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAdminStore } from '@/stores/user'
import { getAdminToken } from '@/utils/auth'
import { ElMessage } from 'element-plus'
import { Monitor, User, Goods, Tickets, Picture, List, GoodsFilled, EditPen, Document, ChatDotRound, DataAnalysis, Grid } from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()
const adminStore = useAdminStore()

onMounted(() => { if (getAdminToken()) adminStore.fetchAdmin() })

function logout() { adminStore.logout(); ElMessage.success('已退出'); router.push('/admin/login') }

const menuItems = [
  { path: '/admin/dashboard', icon: Monitor, label: '控制台' },
  { path: '/admin/user', icon: User, label: '用户管理' },
  { path: '/admin/product', icon: Goods, label: '产品管理' },
  { path: '/admin/category', icon: Tickets, label: '分类管理' },
  { path: '/admin/banner', icon: Picture, label: '轮播图' },
  { path: '/admin/order', icon: List, label: '订单管理' },
  { path: '/admin/coupon', icon: GoodsFilled, label: '优惠券' },
  { path: '/admin/note', icon: EditPen, label: '游记管理' },
  { path: '/admin/log', icon: Document, label: '操作日志' },
  { path: '/admin/message', icon: ChatDotRound, label: '系统消息' },
  { path: '/admin/analysis', icon: DataAnalysis, label: '用户分析' },
]
</script>

<template>
<el-container class="admin-wrap">
  <!-- Dark Aurora Sidebar -->
  <el-aside width="230px" class="admin-sidebar">
    <div class="sidebar-logo" @click="router.push('/admin/dashboard')">
      <div class="s-logo-icon">✈</div>
      <div>
        <div class="s-logo-text">旅行网管理</div>
        <div class="s-logo-sub">Admin Console</div>
      </div>
    </div>
    <el-menu :default-active="route.path" router class="side-menu"
             background-color="transparent" text-color="rgba(255,255,255,.7)" active-text-color="#fff">
      <el-menu-item v-for="item in menuItems" :key="item.path" :index="item.path" class="menu-item">
        <el-icon><component :is="item.icon" /></el-icon>
        <span>{{ item.label }}</span>
      </el-menu-item>
    </el-menu>
    <div class="sidebar-footer">
      <div class="s-version">v1.0</div>
    </div>
  </el-aside>

  <!-- Main Area -->
  <el-container>
    <el-header class="admin-header">
      <span class="page-title">{{ route.meta?.title || '管理控制台' }}</span>
      <el-dropdown trigger="click">
        <div class="admin-user">
          <el-avatar :size="32" class="header-ava">A</el-avatar>
          <span>{{ adminStore.adminInfo?.nickname || '管理员' }}</span>
        </div>
        <template #dropdown>
          <el-dropdown-menu><el-dropdown-item @click="logout">退出登录</el-dropdown-item></el-dropdown-menu>
        </template>
      </el-dropdown>
    </el-header>
    <el-main class="admin-main">
      <router-view v-slot="{ Component }">
        <transition name="page" mode="out-in"><component :is="Component" /></transition>
      </router-view>
    </el-main>
  </el-container>
</el-container>
</template>

<style scoped>
.admin-wrap { height: 100vh; }
.admin-sidebar {
  background: linear-gradient(180deg, #1a1a2e 0%, #16213e 40%, #0f3460 100%) !important;
  position: relative;
  overflow: hidden;
}
.admin-sidebar::before {
  content: ''; position: absolute; top: -30%; right: -40%;
  width: 300px; height: 300px;
  background: radial-gradient(circle, rgba(102,126,234,.2) 0%, transparent 70%);
  pointer-events: none;
}
.admin-sidebar::after {
  content: ''; position: absolute; bottom: 0; left: -30%;
  width: 200px; height: 200px;
  background: radial-gradient(circle, rgba(240,147,251,.12) 0%, transparent 70%);
  pointer-events: none;
}

.sidebar-logo { display: flex; align-items: center; gap: 12px; padding: 22px 20px; cursor: pointer; position: relative; z-index:1; }
.s-logo-icon { width: 40px; height: 40px; background: linear-gradient(135deg,#667eea,#f5576c); border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 20px; }
.s-logo-text { color: #fff; font-family: 'Fredoka',sans-serif; font-size: 16px; font-weight: 600; }
.s-logo-sub { color: rgba(255,255,255,.4); font-size: 10px; letter-spacing: .05em; }

.side-menu { border-right: none !important; position: relative; z-index: 1; }
.menu-item { margin: 2px 10px; border-radius: 10px; transition: all .25s; }
.menu-item:hover { background: rgba(255,255,255,.08) !important; }
.menu-item.is-active { background: rgba(255,255,255,.12) !important; }

.sidebar-footer { position: absolute; bottom: 20px; left: 0; right: 0; text-align: center; z-index:1; }
.s-version { color: rgba(255,255,255,.2); font-size: 11px; }

.admin-header { background: #fff; border-bottom: 1px solid #f0e6e0; display: flex; align-items: center; justify-content: space-between; padding: 0 24px; height: 60px; }
.page-title { font-family: 'Fredoka',sans-serif; font-size: 17px; font-weight: 600; color: #2d3436; }
.admin-user { display: flex; align-items: center; gap: 10px; cursor: pointer; font-size: 14px; }
.admin-main { background: #f8f4f0; min-height: calc(100vh - 60px); }

.page-enter-active { transition: opacity .3s ease, transform .3s ease; }
.page-leave-active { transition: opacity .2s ease, transform .2s ease; }
.page-enter-from { opacity: 0; transform: translateY(10px); }
.page-leave-to { opacity: 0; transform: translateY(-8px); }
</style>
