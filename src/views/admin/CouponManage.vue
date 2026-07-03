<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getCouponList, saveCoupon, deleteCoupon } from '@/api/admin/adminCoupon'
import { ElMessage, ElMessageBox } from 'element-plus'

const list = ref<any[]>([]); const total = ref(0); const page = ref(1); const dialog = ref(false); const form = ref<any>({})
async function load() { try { const r: any = await getCouponList({ page: page.value, size: 10 }); list.value = r.records || []; total.value = r.total || 0 } catch {} }
onMounted(load)
async function handleSave() { await saveCoupon(form.value); ElMessage.success('保存成功'); dialog.value = false; load() }
function add() { form.value = { name: '', type: 1, faceValue: 0, minAmount: 0, totalCount: 0, validDays: 30 }; dialog.value = true }
async function del(id: number) { await ElMessageBox.confirm('确认删除？'); await deleteCoupon(id); load() }
</script>

<template>
  <div>
    <div style="display:flex;justify-content:space-between"><h2>优惠券管理</h2><el-button type="primary" @click="add">新增</el-button></div>
    <el-table :data="list" border stripe>
      <el-table-column prop="id" label="ID" width="50" />
      <el-table-column prop="name" label="名称" />
      <el-table-column prop="faceValue" label="面值" width="80" />
      <el-table-column prop="minAmount" label="门槛" width="80" />
      <el-table-column prop="totalCount" label="总量" width="60" />
      <el-table-column prop="remainCount" label="剩余" width="60" />
      <el-table-column prop="startTime" label="开始" width="140" />
      <el-table-column prop="endTime" label="结束" width="140" />
      <el-table-column label="状态" width="70"><template #default="{row}"><el-tag :type="row.status===1?'success':'info'">{{ row.status===1?'启用':'禁用' }}</el-tag></template></el-table-column>
      <el-table-column label="操作" width="120">
        <template #default="{row}"><el-button size="small" @click="form={...row};dialog=true">编辑</el-button><el-button size="small" type="danger" @click="del(row.id)">删除</el-button></template>
      </el-table-column>
    </el-table>
    <el-pagination v-if="total>10" v-model:current-page="page" :total="total" @current-change="load" />
    <el-dialog v-model="dialog" title="优惠券" width="500px">
      <el-form :model="form" label-width="80px">
        <el-form-item label="名称"><el-input v-model="form.name" /></el-form-item>
        <el-form-item label="类型"><el-select v-model="form.type"><el-option :value="1" label="满减" /><el-option :value="2" label="折扣" /><el-option :value="3" label="直减" /></el-select></el-form-item>
        <el-form-item label="面额"><el-input-number v-model="form.faceValue" :min="0" /></el-form-item>
        <el-form-item label="门槛"><el-input-number v-model="form.minAmount" :min="0" /></el-form-item>
        <el-form-item label="总量"><el-input-number v-model="form.totalCount" :min="0" /></el-form-item>
        <el-form-item label="有效天数"><el-input-number v-model="form.validDays" :min="1" /></el-form-item>
      </el-form>
      <template #footer><el-button type="primary" @click="handleSave">保存</el-button></template>
    </el-dialog>
  </div>
</template>
