<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getUserProfile, updateProfile, changePassword } from '@/api/user'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'

const userStore = useUserStore()
const user = ref<any>({})
const pwForm = ref({ oldPassword: '', newPassword: '', confirmNew: '' })
const pwDialog = ref(false)

onMounted(async () => {
  try { user.value = await getUserProfile(); userStore.setUser(user.value) } catch {}
})
async function handleSave() {
  await updateProfile({ nickname: user.value.nickname, gender: user.value.gender, email: user.value.email })
  userStore.setUser(user.value)
  ElMessage.success('保存成功')
}
async function handleChangePw() {
  if (pwForm.value.newPassword !== pwForm.value.confirmNew) { ElMessage.warning('确认密码不一致'); return }
  await changePassword({ oldPassword: pwForm.value.oldPassword, newPassword: pwForm.value.newPassword })
  ElMessage.success('密码已修改')
  pwDialog.value = false
}
</script>

<template>
  <div class="profile-page">
    <h2>个人资料</h2>
    <el-card>
      <el-form :model="user" label-width="80px">
        <el-form-item label="头像">
          <el-avatar :size="60" :src="user.avatar">{{ user.nickname?.[0] }}</el-avatar>
        </el-form-item>
        <el-form-item label="用户名"><el-input v-model="user.username" disabled /></el-form-item>
        <el-form-item label="昵称"><el-input v-model="user.nickname" /></el-form-item>
        <el-form-item label="手机号"><el-input v-model="user.phone" disabled /></el-form-item>
        <el-form-item label="邮箱"><el-input v-model="user.email" /></el-form-item>
        <el-form-item label="性别">
          <el-radio-group v-model="user.gender">
            <el-radio :value="1">男</el-radio>
            <el-radio :value="2">女</el-radio>
            <el-radio :value="0">保密</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="积分"><el-input :model-value="user.points" disabled /></el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSave">保存</el-button>
          <el-button @click="pwDialog = true">修改密码</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-dialog v-model="pwDialog" title="修改密码" width="400px">
      <el-form :model="pwForm" label-width="90px">
        <el-form-item label="旧密码"><el-input v-model="pwForm.oldPassword" type="password" /></el-form-item>
        <el-form-item label="新密码"><el-input v-model="pwForm.newPassword" type="password" /></el-form-item>
        <el-form-item label="确认密码"><el-input v-model="pwForm.confirmNew" type="password" /></el-form-item>
      </el-form>
      <template #footer><el-button type="primary" @click="handleChangePw">确认修改</el-button></template>
    </el-dialog>
  </div>
</template>
<style scoped>
.profile-page { max-width: 600px; margin: 20px auto; padding: 0 20px; }
</style>
