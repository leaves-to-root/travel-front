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

// 首次加载验证码
refreshCaptcha()

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

// GitHub 登录
function handleGithubLogin() {
  // 跳到后端 /api/auth/github/authorize → GitHub → 回调重定向回来带 github_token
  window.location.href = '/api/auth/github/authorize'
}

// 捕获 GitHub 回调的 token
onMounted(async () => {
  const ghToken = route.query.github_token as string
  const ghError = route.query.github_error as string
  if (ghError) {
    ElMessage.error(decodeURIComponent(ghError))
    router.replace('/login')
    return
  }
  if (ghToken) {
    try {
      await userStore.loginWithToken(ghToken)
      ElMessage.success('GitHub 登录成功')
      router.push('/')
    } catch (err: any) {
      ElMessage.error(err.message || 'GitHub 登录失败')
      router.replace('/login')
    }
  }
})
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

    <!-- 第三方登录分隔 -->
    <div class="oauth-divider"><span>第三方登录</span></div>
    <button class="github-btn" @click="handleGithubLogin">
      <svg viewBox="0 0 16 16" width="18" height="18" fill="currentColor" style="margin-right:8px"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>
      GitHub 登录
    </button>

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

.oauth-divider { display: flex; align-items: center; text-align: center; margin: 22px 0 14px; color: #a0a8ac; font-size: 12px; }
.oauth-divider::before, .oauth-divider::after { content: ''; flex: 1; height: 1px; background: rgba(160,168,172,.3); }
.oauth-divider span { padding: 0 12px; }
.github-btn { width: 100%; height: 44px; border-radius: 12px; border: 1px solid rgba(45,52,54,.15); background: #fff; color: #2d3436; font-size: 14px; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all .25s; }
.github-btn:hover { background: #2d3436; color: #fff; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(45,52,54,.2); }
</style>
