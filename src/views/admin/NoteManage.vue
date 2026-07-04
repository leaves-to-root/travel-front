<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getNoteList, updateNoteStatus, deleteNote } from '@/api/admin/adminNote'
import { ElMessage, ElMessageBox } from 'element-plus'

const list = ref<any[]>([]); const total = ref(0); const page = ref(1); const status = ref<number|undefined>()
async function load() { try { const r: any = await getNoteList({ page: page.value, size: 10, status: status.value }); list.value = r.records || []; total.value = r.total || 0 } catch {} }
onMounted(load)
async function update(id: number, st: number) { await updateNoteStatus(id, st); ElMessage.success('已更新'); load() }
async function del(id: number) { await ElMessageBox.confirm('确认删除？'); await deleteNote(id); load() }
const statusMap: Record<number,string> = {0:'待审核',1:'已发布',2:'已下架'}
const statusType: Record<number,string> = {0:'warning',1:'success',2:'info'}
</script>

<template>
  <div>
    <h2>游记管理</h2>
    <el-select v-model="status" placeholder="全部" clearable style="width:120px;margin-bottom:16px" @change="load">
      <el-option v-for="(v,k) in statusMap" :key="k" :label="v" :value="k" />
    </el-select>
    <el-table :data="list" border stripe>
      <el-table-column prop="id" label="ID" width="50" />
      <el-table-column prop="title" label="标题" min-width="200" />
      <el-table-column prop="userId" label="作者" width="70" />
      <el-table-column prop="viewCount" label="阅读" width="60" />
      <el-table-column prop="likeCount" label="点赞" width="60" />
      <el-table-column label="状态" width="80"><template #default="{row}"><el-tag :type="statusType[row.status]">{{ statusMap[row.status] }}</el-tag></template></el-table-column>
      <el-table-column prop="createTime" label="时间" width="150" />
      <el-table-column label="操作" width="160">
        <template #default="{row}">
          <el-button v-if="row.status===0" size="small" @click="update(row.id,1)">通过</el-button>
          <el-button v-if="row.status===1" size="small" @click="update(row.id,2)">下架</el-button>
          <el-button size="small" type="danger" @click="del(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination v-if="total>10" v-model:current-page="page" :total="total" @current-change="load" />
  </div>
</template>
