<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const loginForm = ref({ username: '', password: '' })
const loading = ref(false)

async function handleLogin() {
  if (!loginForm.value.username || !loginForm.value.password) { ElMessage.warning('请输入账号和密码'); return }
  loading.value = true
  try {
    await userStore.login(loginForm.value)
    ElMessage.success('登录成功')
    router.push((route.query.redirect as string) || '/')
  } catch (err: any) { ElMessage.error(err.message || '登录失败') }
  finally { loading.value = false }
}
</script>

<template>
<div class="auth-page">
  <div class="auth-bg"></div>
  <div class="auth-card glass-card">
    <div class="auth-header">
      <div class="auth-icon">✈</div>
      <h2>欢迎回来</h2>
      <p>登录你的旅行网账号</p>
    </div>
    <el-form :model="loginForm" @keyup.enter="handleLogin">
      <el-form-item>
        <el-input v-model="loginForm.username" placeholder="用户名 / 手机号" size="large" prefix-icon="User" class="auth-input" />
      </el-form-item>
      <el-form-item>
        <el-input v-model="loginForm.password" type="password" placeholder="密码" size="large" prefix-icon="Lock" show-password class="auth-input" />
      </el-form-item>
      <el-button type="primary" size="large" :loading="loading" class="auth-btn" @click="handleLogin">登 录</el-button>
    </el-form>
    <div class="auth-footer">
      <span>还没有账号？</span><router-link to="/register">立即注册 →</router-link>
    </div>
    <router-link to="/" class="auth-back">← 返回首页</router-link>
  </div>
</div>
</template>

<style scoped>
.auth-page { min-height: 100vh; display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden; }
.auth-bg { position: absolute; inset: -30%; background: radial-gradient(ellipse at 30% 20%, rgba(102,126,234,.25) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(240,147,251,.2) 0%, transparent 50%); animation: bg-drift 12s ease-in-out infinite alternate; z-index: 0; }
@keyframes bg-drift { 0% { transform: translate(-2%,-2%) rotate(-1deg); } 100% { transform: translate(2%,2%) rotate(1deg); } }
.auth-card { position: relative; z-index: 1; width: 420px; padding: 44px 40px; text-align: center; }
.auth-icon { width: 64px; height: 64px; background: linear-gradient(135deg,#667eea,#f5576c); border-radius: 16px; display: flex; align-items: center; justify-content: center; font-size: 28px; margin: 0 auto 16px; box-shadow: 0 8px 30px rgba(102,126,234,.3); }
.auth-header h2 { font-size: 24px; font-weight: 700; color: #2d3436; margin-bottom: 6px; }
.auth-header p { font-size: 14px; color: #a0a8ac; margin-bottom: 28px; }
.auth-input :deep(.el-input__wrapper) { border-radius: 12px !important; background: rgba(255,255,255,.5) !important; }
.auth-btn { width: 100%; height: 46px; border-radius: 12px !important; font-size: 16px !important; font-weight: 600 !important; background: linear-gradient(135deg,#667eea,#764ba2) !important; border: none !important; box-shadow: 0 6px 24px rgba(102,126,234,.35) !important; }
.auth-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(102,126,234,.45) !important; }
.auth-footer { margin-top: 20px; font-size: 14px; color: #a0a8ac; }
.auth-footer a { color: #FF6B35; font-weight: 600; }
.auth-back { display: block; margin-top: 16px; font-size: 13px; color: #a0a8ac; }
</style>
