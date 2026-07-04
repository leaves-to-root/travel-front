<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getMessages, markRead, markAllRead } from '@/api/message'
import { ElMessage } from 'element-plus'

const messages = ref<any[]>([])
const page = ref(1); const total = ref(0)
async function load() {
  try { const r: any = await getMessages(page.value, 20); messages.value = r.records || []; total.value = r.total || 0 } catch {}
}
onMounted(load)
async function handleRead(id: number) { await markRead(id); messages.value = messages.value.map((m:any) => m.id===id ? {...m,isRead:1} : m) }
async function handleAllRead() { await markAllRead(); messages.value = messages.value.map((m:any) => ({...m,isRead:1})); ElMessage.success('已全部标记') }
</script>

<template>
  <div><h2>消息通知</h2>
    <el-button size="small" @click="handleAllRead" style="margin-bottom:12px">全部标记已读</el-button>
    <el-card v-for="m in messages" :key="m.id" style="margin-bottom:8px">
      <div @click="handleRead(m.id)" style="cursor:pointer">
        <span v-if="!m.isRead" style="display:inline-block;width:8px;height:8px;background:#f56c6c;border-radius:50%;margin-right:6px"></span>
        <strong>{{ m.title }}</strong>
        <span style="float:right;color:#909399;font-size:12px">{{ m.createTime }}</span>
      </div>
      <p style="color:#606266;margin:6px 0 0;font-size:14px">{{ m.content }}</p>
    </el-card>
    <el-empty v-if="!messages.length" description="暂无消息" />
  </div>
</template>
<style scoped>
div { max-width: 700px; margin: 20px auto; padding: 0 20px; }
</style>
