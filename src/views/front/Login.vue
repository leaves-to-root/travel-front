<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { getCaptcha, sendEmailCode } from '@/api/auth'
import { ElMessage } from 'element-plus'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const activeTab = ref<'username' | 'email'>('username')
const loading = ref(false)
const emailSending = ref(false)
const emailCountdown = ref(0)

// 用户名登录表单
const usernameForm = ref({ username: '', password: '', captchaKey: '', captchaCode: '' })
const captchaImage = ref('')

// 邮箱登录表单
const emailForm = ref({ email: '', emailCode: '' })

// 获取图形验证码
async function refreshCaptcha() {
  try {
    const res: any = await getCaptcha()
    captchaImage.value = res.captchaImage
    usernameForm.value.captchaKey = res.captchaKey
    usernameForm.value.captchaCode = ''
  } catch { ElMessage.error('获取验证码失败') }
}

onMounted(refreshCaptcha)

// 发送邮箱验证码
async function handleSendEmailCode() {
  if (!emailForm.value.email) { ElMessage.warning('请输入邮箱'); return }
  emailSending.value = true
  try {
    await sendEmailCode(emailForm.value.email)
    ElMessage.success('验证码已发送')
    emailCountdown.value = 60
    const timer = setInterval(() => {
      emailCountdown.value--
      if (emailCountdown.value <= 0) clearInterval(timer)
    }, 1000)
  } catch (err: any) { ElMessage.error(err.message || '发送失败') }
  finally { emailSending.value = false }
}

// 用户名登录
async function handleUsernameLogin() {
  const f = usernameForm.value
  if (!f.username || !f.password) { ElMessage.warning('请输入用户名和密码'); return }
  if (!f.captchaCode) { ElMessage.warning('请输入图形验证码'); return }
  loading.value = true
  try {
    await userStore.login({ loginType: 'username', ...f })
    ElMessage.success('登录成功')
    router.push((route.query.redirect as string) || '/')
  } catch (err: any) { ElMessage.error(err.message || '登录失败'); refreshCaptcha() }
  finally { loading.value = false }
}

// 邮箱登录
async function handleEmailLogin() {
  const f = emailForm.value
  if (!f.email || !f.emailCode) { ElMessage.warning('请输入邮箱和验证码'); return }
  loading.value = true
  try {
    await userStore.login({ loginType: 'email', ...f })
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

    <!-- Tab 切换 -->
    <div class="login-tabs">
      <span :class="{ active: activeTab === 'username' }" @click="activeTab = 'username'">用户名登录</span>
      <span :class="{ active: activeTab === 'email' }" @click="activeTab = 'email'">邮箱登录</span>
    </div>

    <!-- 用户名登录 -->
    <el-form v-if="activeTab === 'username'" :model="usernameForm" @keyup.enter="handleUsernameLogin">
      <el-form-item>
        <el-input v-model="usernameForm.username" placeholder="用户名" size="large" prefix-icon="User" class="auth-input" />
      </el-form-item>
      <el-form-item>
        <el-input v-model="usernameForm.password" type="password" placeholder="密码" size="large" prefix-icon="Lock" show-password class="auth-input" />
      </el-form-item>
      <el-form-item>
        <div style="display:flex;gap:12px;width:100%">
          <el-input v-model="usernameForm.captchaCode" placeholder="图形验证码" size="large" class="auth-input" style="flex:1" />
          <img :src="captchaImage" @click="refreshCaptcha" title="点击刷新" style="height:40px;cursor:pointer;border-radius:8px" />
        </div>
      </el-form-item>
      <el-button type="primary" size="large" :loading="loading" class="auth-btn" @click="handleUsernameLogin">登 录</el-button>
    </el-form>

    <!-- 邮箱登录 -->
    <el-form v-if="activeTab === 'email'" :model="emailForm" @keyup.enter="handleEmailLogin">
      <el-form-item>
        <el-input v-model="emailForm.email" placeholder="邮箱" size="large" prefix-icon="Message" class="auth-input" />
      </el-form-item>
      <el-form-item>
        <div style="display:flex;gap:12px;width:100%">
          <el-input v-model="emailForm.emailCode" placeholder="邮箱验证码" size="large" class="auth-input" style="flex:1" />
          <el-button size="large" :loading="emailSending" :disabled="emailCountdown > 0" @click="handleSendEmailCode" style="white-space:nowrap">
            {{ emailCountdown > 0 ? emailCountdown + 's' : '发送验证码' }}
          </el-button>
        </div>
      </el-form-item>
      <el-button type="primary" size="large" :loading="loading" class="auth-btn" @click="handleEmailLogin">登 录</el-button>
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
.auth-card { position: relative; z-index: 1; width: 420px; padding: 40px; text-align: center; }
.auth-icon { width: 64px; height: 64px; background: linear-gradient(135deg,#667eea,#f5576c); border-radius: 16px; display: flex; align-items: center; justify-content: center; font-size: 28px; margin: 0 auto 16px; box-shadow: 0 8px 30px rgba(102,126,234,.3); }
.auth-header h2 { font-size: 24px; font-weight: 700; color: #2d3436; margin-bottom: 6px; }
.auth-header p { font-size: 14px; color: #a0a8ac; margin-bottom: 8px; }

.login-tabs { display: flex; gap: 0; margin-bottom: 20px; border-radius: 10px; overflow: hidden; border: 1px solid rgba(102,126,234,.15); }
.login-tabs span { flex: 1; padding: 10px 0; font-size: 14px; cursor: pointer; transition: all .3s; color: #a0a8ac; background: rgba(255,255,255,.4); }
.login-tabs span.active { color: #fff; background: linear-gradient(135deg,#667eea,#764ba2); font-weight: 600; }

.auth-input :deep(.el-input__wrapper) { border-radius: 12px !important; background: rgba(255,255,255,.5) !important; }
.auth-btn { width: 100%; height: 46px; border-radius: 12px !important; font-size: 16px !important; font-weight: 600 !important; background: linear-gradient(135deg,#667eea,#764ba2) !important; border: none !important; box-shadow: 0 6px 24px rgba(102,126,234,.35) !important; }
.auth-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(102,126,234,.45) !important; }
.auth-footer { margin-top: 20px; font-size: 14px; color: #a0a8ac; }
.auth-footer a { color: #FF6B35; font-weight: 600; }
.auth-back { display: block; margin-top: 16px; font-size: 13px; color: #a0a8ac; }
</style>
