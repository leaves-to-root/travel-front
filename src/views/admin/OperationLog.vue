<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getLogList } from '@/api/admin/adminLog'

const list = ref<any[]>([]); const total = ref(0); const page = ref(1)
async function load() { try { const r: any = await getLogList({ page: page.value, size: 20 }); list.value = r.records || []; total.value = r.total || 0 } catch {} }
onMounted(load)
</script>

<template>
  <div>
    <h2>操作日志</h2>
    <el-table :data="list" border stripe>
      <el-table-column prop="id" label="ID" width="50" />
      <el-table-column prop="adminName" label="操作人" width="100" />
      <el-table-column prop="action" label="操作" min-width="200" />
      <el-table-column prop="module" label="模块" width="100" />
      <el-table-column prop="ip" label="IP" width="130" />
      <el-table-column prop="costMs" label="耗时(ms)" width="80" />
      <el-table-column prop="createTime" label="时间" width="150" />
    </el-table>
    <el-pagination v-if="total>20" v-model:current-page="page" :total="total" :page-size="20" @current-change="load" />
  </div>
</template>
