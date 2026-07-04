<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getUserList, toggleUserStatus, distributeCoupon } from '@/api/admin/adminUser'
import { getCouponList } from '@/api/admin/adminCoupon'
import { ElMessage } from 'element-plus'

const users = ref<any[]>([]); const total = ref(0); const page = ref(1)
const keyword = ref('')
const couponDialogVisible = ref(false)
const coupons = ref<any[]>([])
const selectedUserId = ref<number>(0)
const selectedCouponId = ref<number>(0)

async function load() {
  try { const r: any = await getUserList({ page: page.value, size: 10, keyword: keyword.value || undefined }); users.value = r.records || []; total.value = r.total || 0 } catch {}
}
onMounted(load)
async function toggle(u: any) {
  const ns = u.status === 1 ? 0 : 1
  await toggleUserStatus(u.id, ns); u.status = ns
  ElMessage.success('状态已更新')
}

async function openCouponDialog(userId: number) {
  selectedUserId.value = userId
  selectedCouponId.value = 0
  try {
    const r: any = await getCouponList({ page: 1, size: 100 })
    coupons.value = r.records || []
  } catch {
    ElMessage.error('获取优惠券列表失败')
    return
  }
  couponDialogVisible.value = true
}

async function handleDistribute() {
  if (!selectedCouponId.value) {
    ElMessage.warning('请选择优惠券')
    return
  }
  try {
    await distributeCoupon(selectedUserId.value, selectedCouponId.value)
    ElMessage.success('优惠券分发成功')
    couponDialogVisible.value = false
  } catch (err: any) {
    ElMessage.error(err.message || '分发失败')
  }
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
      <el-table-column label="操作" width="180">
        <template #default="{row}">
          <el-button size="small" :type="row.status===1?'warning':'success'" @click="toggle(row)">{{ row.status===1?'禁用':'启用' }}</el-button>
          <el-button size="small" type="primary" @click="openCouponDialog(row.id)">发优惠券</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination v-if="total>10" v-model:current-page="page" :total="total" @current-change="load" />

    <el-dialog v-model="couponDialogVisible" title="分发优惠券" width="400px">
      <el-select v-model="selectedCouponId" placeholder="请选择优惠券" style="width:100%">
        <el-option v-for="c in coupons" :key="c.id" :label="c.name + ' (剩余:' + c.remainCount + ')'" :value="c.id" />
      </el-select>
      <template #footer>
        <el-button @click="couponDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleDistribute">确认分发</el-button>
      </template>
    </el-dialog>
  </div>
</template>
