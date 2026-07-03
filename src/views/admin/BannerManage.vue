<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getBannerList, saveBanner, deleteBanner } from '@/api/admin/adminBanner'
import { ElMessage, ElMessageBox } from 'element-plus'

const list = ref<any[]>([]); const dialog = ref(false); const form = ref<any>({})
async function load() { try { list.value = await getBannerList() || [] } catch {} }
onMounted(load)
async function handleSave() { await saveBanner(form.value); ElMessage.success('保存成功'); dialog.value = false; load() }
function edit(p: any) { form.value = { ...p }; dialog.value = true }
function add() { form.value = { image: '', title: '', sort: 0 }; dialog.value = true }
async function del(id: number) { await ElMessageBox.confirm('确认删除？'); await deleteBanner(id); load() }
</script>

<template>
  <div>
    <div style="display:flex;justify-content:space-between"><h2>轮播图管理</h2><el-button type="primary" @click="add">新增</el-button></div>
    <el-table :data="list" border stripe>
      <el-table-column prop="id" label="ID" width="60" />
      <el-table-column prop="title" label="标题" />
      <el-table-column prop="sort" label="排序" width="70" />
      <el-table-column label="预览" width="120"><template #default="{row}"><el-image :src="row.image" style="width:100px;height:50px" fit="cover" /></template></el-table-column>
      <el-table-column label="状态" width="70"><template #default="{row}"><el-tag :type="row.status===1?'success':'info'">{{ row.status===1?'启用':'禁用' }}</el-tag></template></el-table-column>
      <el-table-column label="操作" width="120">
        <template #default="{row}"><el-button size="small" @click="edit(row)">编辑</el-button><el-button size="small" type="danger" @click="del(row.id)">删除</el-button></template>
      </el-table-column>
    </el-table>
    <el-dialog v-model="dialog" :title="form.id?'编辑':'新增'" width="500px">
      <el-form :model="form" label-width="70px">
        <el-form-item label="标题"><el-input v-model="form.title" /></el-form-item>
        <el-form-item label="图片"><el-input v-model="form.image" placeholder="图片URL" /></el-form-item>
        <el-form-item label="链接"><el-input v-model="form.link" placeholder="跳转链接" /></el-form-item>
        <el-form-item label="排序"><el-input-number v-model="form.sort" /></el-form-item>
      </el-form>
      <template #footer><el-button type="primary" @click="handleSave">保存</el-button></template>
    </el-dialog>
  </div>
</template>
