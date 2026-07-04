<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAdminStore } from '@/stores/user'
import { ElMessage } from 'element-plus'

const router = useRouter()
const adminStore = useAdminStore()
const form = ref({ username: 'admin', password: '' })
const loading = ref(false)

async function handleLogin() {
  loading.value = true
  try {
    await adminStore.login(form.value)
    ElMessage.success('登录成功')
    router.push('/admin/dashboard')
  } catch (err: any) {
    ElMessage.error(err.message || '登录失败')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="admin-login-page">
    <div class="login-card">
      <h2>管理后台登录</h2>
      <el-form @keyup.enter="handleLogin">
        <el-form-item>
          <el-input v-model="form.username" placeholder="管理员账号" size="large" />
        </el-form-item>
        <el-form-item>
          <el-input v-model="form.password" type="password" placeholder="密码" size="large" show-password />
        </el-form-item>
        <el-button type="primary" size="large" :loading="loading" style="width:100%" @click="handleLogin">登 录</el-button>
      </el-form>
    </div>
  </div>
</template>

<style scoped>
.admin-login-page { height: 100vh; display: flex; align-items: center; justify-content: center; background: #2c3e50; }
.login-card { background: #fff; padding: 40px; border-radius: 8px; width: 380px; }
.login-card h2 { text-align: center; margin-bottom: 30px; }
</style>
