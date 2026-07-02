<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getProductList, saveProduct, toggleProductStatus, deleteProduct } from '@/api/admin/adminProduct'
import { ElMessage, ElMessageBox } from 'element-plus'

const products = ref<any[]>([]); const total = ref(0); const page = ref(1)
const dialog = ref(false); const form = ref<any>({})
const keyword = ref('')
async function load() {
  try { const r: any = await getProductList({ page: page.value, size: 10, keyword: keyword.value || undefined }); products.value = r.records || []; total.value = r.total || 0 } catch {}
}
onMounted(load)
async function handleSave() { await saveProduct(form.value); ElMessage.success('保存成功'); dialog.value = false; load() }
function edit(p: any) { form.value = { ...p }; dialog.value = true }
function newP() { form.value = { title: '', price: 0, stock: 0 }; dialog.value = true }
async function toggle(p: any) { await toggleProductStatus(p.id, p.status===1?0:1); p.status = p.status===1?0:1 }
async function del(id: number) { await ElMessageBox.confirm('确认删除？'); await deleteProduct(id); load() }
</script>

<template>
  <div>
    <div style="display:flex;justify-content:space-between;margin-bottom:16px">
      <h2>产品管理</h2>
      <el-button type="primary" @click="newP">新增产品</el-button>
    </div>
    <el-table :data="products" border stripe>
      <el-table-column prop="id" label="ID" width="50" />
      <el-table-column prop="title" label="标题" min-width="200" />
      <el-table-column prop="price" label="价格" width="100" />
      <el-table-column prop="stock" label="库存" width="70" />
      <el-table-column prop="sales" label="销量" width="70" />
      <el-table-column prop="createTime" label="创建时间" width="150" />
      <el-table-column label="状态" width="80"><template #default="{row}"><el-tag :type="row.status===1?'success':'info'">{{ row.status===1?'上架':'下架' }}</el-tag></template></el-table-column>
      <el-table-column label="操作" width="160">
        <template #default="{row}">
          <el-button size="small" @click="edit(row)">编辑</el-button>
          <el-button size="small" :type="row.status===1?'warning':'success'" @click="toggle(row)">{{ row.status===1?'下架':'上架' }}</el-button>
          <el-button size="small" type="danger" @click="del(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination v-if="total>10" v-model:current-page="page" :total="total" @current-change="load" />
    <el-dialog v-model="dialog" :title="form.id?'编辑产品':'新增产品'" width="700px">
      <el-form :model="form" label-width="80px">
        <el-form-item label="标题"><el-input v-model="form.title" /></el-form-item>
        <el-form-item label="副标题"><el-input v-model="form.subtitle" /></el-form-item>
        <el-form-item label="价格"><el-input-number v-model="form.price" :min="0" /></el-form-item>
        <el-form-item label="库存"><el-input-number v-model="form.stock" :min="0" /></el-form-item>
        <el-form-item label="目的地"><el-input v-model="form.destination" /></el-form-item>
        <el-form-item label="封面"><el-input v-model="form.cover" placeholder="图片URL" /></el-form-item>
        <el-form-item label="详情"><el-input v-model="form.detail" type="textarea" :rows="4" /></el-form-item>
        <el-form-item label="标签"><el-input v-model="form.tags" placeholder="逗号分隔" /></el-form-item>
      </el-form>
      <template #footer><el-button type="primary" @click="handleSave">保存</el-button></template>
    </el-dialog>
  </div>
</template>
