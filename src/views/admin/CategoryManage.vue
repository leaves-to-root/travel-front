<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getCategoryList, saveCategory, deleteCategory } from '@/api/admin/adminCategory'
import { ElMessage, ElMessageBox } from 'element-plus'

const list = ref<any[]>([]); const dialog = ref(false); const form = ref<any>({})
const parents = ref<any[]>([])
async function load() { try { list.value = await getCategoryList() || [] } catch {} }
async function loadParents() { try { parents.value = await getCategoryList(0) || [] } catch {} }
onMounted(() => { load(); loadParents() })
async function handleSave() { await saveCategory(form.value); ElMessage.success('保存成功'); dialog.value = false; load() }
function edit(p: any) { form.value = { ...p }; dialog.value = true }
function add() { form.value = { name: '', parentId: 0 }; dialog.value = true }
async function del(id: number) { await ElMessageBox.confirm('确认删除？'); await deleteCategory(id); load() }
</script>

<template>
  <div>
    <div style="display:flex;justify-content:space-between"><h2>分类管理</h2><el-button type="primary" @click="add">新增</el-button></div>
    <el-table :data="list" border stripe>
      <el-table-column prop="id" label="ID" width="60" />
      <el-table-column prop="name" label="名称" />
      <el-table-column prop="parentId" label="父ID" width="70" />
      <el-table-column prop="sort" label="排序" width="70" />
      <el-table-column label="状态" width="70"><template #default="{row}"><el-tag :type="row.status===1?'success':'info'">{{ row.status===1?'启用':'禁用' }}</el-tag></template></el-table-column>
      <el-table-column label="操作" width="120">
        <template #default="{row}"><el-button size="small" @click="edit(row)">编辑</el-button><el-button size="small" type="danger" @click="del(row.id)">删除</el-button></template>
      </el-table-column>
    </el-table>
    <el-dialog v-model="dialog" :title="form.id?'编辑':'新增'" width="400px">
      <el-form :model="form" label-width="70px">
        <el-form-item label="父分类">
          <el-select v-model="form.parentId" placeholder="请选择父分类" style="width:100%">
            <el-option label="顶级分类" :value="0" />
            <el-option v-for="p in parents" :key="p.id" :label="p.name" :value="p.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="名称"><el-input v-model="form.name" /></el-form-item>
      </el-form>
      <template #footer><el-button type="primary" @click="handleSave">保存</el-button></template>
    </el-dialog>
  </div>
</template>
