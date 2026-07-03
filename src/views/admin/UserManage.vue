<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getUserList, toggleUserStatus } from '@/api/admin/adminUser'
import { ElMessage } from 'element-plus'

const users = ref<any[]>([]); const total = ref(0); const page = ref(1)
const keyword = ref('')
async function load() {
  try { const r: any = await getUserList({ page: page.value, size: 10, keyword: keyword.value || undefined }); users.value = r.records || []; total.value = r.total || 0 } catch {}
}
onMounted(load)
async function toggle(u: any) {
  const ns = u.status === 1 ? 0 : 1
  await toggleUserStatus(u.id, ns); u.status = ns
  ElMessage.success('状态已更新')
}
</script>

<template>
  <div>
    <h2>用户管理</h2>
    <el-input v-model="keyword" placeholder="搜索昵称/手机号" style="width:300px;margin-bottom:16px" clearable @input="load" />
    <el-table :data="users" border stripe>
      <el-table-column prop="id" label="ID" width="60" />
      <el-table-column prop="nickname" label="昵称" />
      <el-table-column prop="username" label="用户名" />
      <el-table-column prop="phone" label="手机号" />
      <el-table-column prop="email" label="邮箱" />
      <el-table-column prop="points" label="积分" />
      <el-table-column prop="createTime" label="注册时间" width="160" />
      <el-table-column label="状态" width="100">
        <template #default="{row}"><el-tag :type="row.status===1?'success':'danger'">{{ row.status===1?'正常':'禁用' }}</el-tag></template>
      </el-table-column>
      <el-table-column label="操作" width="100">
        <template #default="{row}"><el-button size="small" :type="row.status===1?'warning':'success'" @click="toggle(row)">{{ row.status===1?'禁用':'启用' }}</el-button></template>
      </el-table-column>
    </el-table>
    <el-pagination v-if="total>10" v-model:current-page="page" :total="total" @current-change="load" />
  </div>
</template>
