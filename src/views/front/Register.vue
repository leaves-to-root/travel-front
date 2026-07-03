<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { register, sendEmailCode } from '@/api/auth'
import { ElMessage } from 'element-plus'

const router = useRouter()
const form = ref({ username: '', email: '', emailCode: '', password: '', confirmPassword: '', nickname: '' })
const loading = ref(false)
const emailSending = ref(false)
const emailCountdown = ref(0)

async function handleSendEmailCode() {
  if (!form.value.email) { ElMessage.warning('请输入邮箱'); return }
  emailSending.value = true
  try {
    await sendEmailCode(form.value.email)
    ElMessage.success('验证码已发送')
    emailCountdown.value = 60
    const timer = setInterval(() => {
      emailCountdown.value--
      if (emailCountdown.value <= 0) clearInterval(timer)
    }, 1000)
  } catch (err: any) { ElMessage.error(err.message || '发送失败') }
  finally { emailSending.value = false }
}

async function handleRegister() {
  if (!form.value.email) { ElMessage.warning('请输入邮箱'); return }
  if (!form.value.emailCode) { ElMessage.warning('请输入邮箱验证码'); return }
  if (form.value.password !== form.value.confirmPassword) { ElMessage.warning('两次密码不一致'); return }
  if (form.value.password.length < 6) { ElMessage.warning('密码至少6位'); return }
  loading.value = true
  try {
    await register(form.value)
    ElMessage.success('注册成功')
    router.push('/login')
  } catch (err: any) { ElMessage.error(err.message || '注册失败') }
  finally { loading.value = false }
}
</script>

<template>
<div class="auth-page">
  <div class="auth-bg"></div>
  <div class="auth-card glass-card">
    <div class="auth-header">
      <div class="auth-icon">🌟</div>
      <h2>创建账号</h2>
      <p>开启你的旅行之旅</p>
    </div>
    <el-form :model="form" @keyup.enter="handleRegister">
      <el-form-item>
        <el-input v-model="form.email" placeholder="邮箱（必填）" size="large" class="auth-input" />
      </el-form-item>
      <el-form-item>
        <div style="display:flex;gap:12px;width:100%">
          <el-input v-model="form.emailCode" placeholder="邮箱验证码" size="large" class="auth-input" style="flex:1" />
          <el-button size="large" :loading="emailSending" :disabled="emailCountdown > 0" @click="handleSendEmailCode" style="white-space:nowrap">
            {{ emailCountdown > 0 ? emailCountdown + 's' : '发送验证码' }}
          </el-button>
        </div>
      </el-form-item>
      <el-form-item><el-input v-model="form.username" placeholder="用户名（选填）" size="large" class="auth-input" /></el-form-item>
      <el-form-item><el-input v-model="form.nickname" placeholder="昵称（选填）" size="large" class="auth-input" /></el-form-item>
      <el-form-item><el-input v-model="form.password" type="password" placeholder="密码（至少6位）" size="large" show-password class="auth-input" /></el-form-item>
      <el-form-item><el-input v-model="form.confirmPassword" type="password" placeholder="确认密码" size="large" show-password class="auth-input" /></el-form-item>
      <el-button type="primary" size="large" :loading="loading" class="auth-btn" @click="handleRegister">注 册</el-button>
    </el-form>
    <div class="auth-footer"><span>已有账号？</span><router-link to="/login">立即登录 →</router-link></div>
  </div>
</div>
</template>

<style scoped>
.auth-page { min-height: 100vh; display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden; }
.auth-bg { position: absolute; inset: -30%; background: radial-gradient(ellipse at 70% 30%,rgba(110,231,255,.2) 0%,transparent 50%),radial-gradient(ellipse at 30% 80%,rgba(240,147,251,.2) 0%,transparent 50%); animation: bg-drift 12s ease-in-out infinite alternate; z-index: 0; }
@keyframes bg-drift { 0% { transform: translate(-2%,-2%) rotate(-1deg); } 100% { transform: translate(2%,2%) rotate(1deg); } }
.auth-card { position: relative; z-index: 1; width: 420px; padding: 36px 40px; text-align: center; margin: 40px 0; }
.auth-icon { width: 64px; height: 64px; background: linear-gradient(135deg,#4facfe,#00f2fe); border-radius: 16px; display: flex; align-items: center; justify-content: center; font-size: 28px; margin: 0 auto 12px; box-shadow: 0 8px 30px rgba(79,172,254,.3); }
.auth-header h2 { font-size: 24px; font-weight: 700; color: #2d3436; margin-bottom: 4px; }
.auth-header p { font-size: 14px; color: #a0a8ac; margin-bottom: 24px; }
.auth-input :deep(.el-input__wrapper) { border-radius: 12px !important; background: rgba(255,255,255,.5) !important; }
.auth-btn { width: 100%; height: 46px; border-radius: 12px !important; font-size: 16px !important; font-weight: 600 !important; background: linear-gradient(135deg,#4facfe,#00f2fe) !important; border: none !important; box-shadow: 0 6px 24px rgba(79,172,254,.35) !important; }
.auth-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(79,172,254,.45) !important; }
.auth-footer { margin-top: 16px; font-size: 14px; color: #a0a8ac; }
.auth-footer a { color: #FF6B35; font-weight: 600; }
</style>
