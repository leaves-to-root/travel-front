<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getMessages, markRead, markAllRead } from '@/api/message'
import { ElMessage } from 'element-plus'

const messages = ref<any[]>([])
const page = ref(1); const totalPages = ref(1)

async function load() {
  try {
    const r: any = await getMessages(page.value, 20)
    messages.value = r.records || []
    totalPages.value = r.pages || 1
  } catch {}
}

onMounted(load)

async function handleRead(id: number) {
  await markRead(id)
  messages.value = messages.value.map((m: any) => m.id === id ? { ...m, isRead: 1 } : m)
}

async function handleAllRead() {
  await markAllRead()
  messages.value = messages.value.map((m: any) => ({ ...m, isRead: 1 }))
  ElMessage.success('已全部标记已读')
}
</script>

<template>
  <div class="inbox-page">
    <div class="inbox-header">
      <h2>📬 收件箱</h2>
      <el-button size="small" text type="primary" :disabled="!messages.length" @click="handleAllRead">
        全部标为已读
      </el-button>
    </div>

    <div v-if="messages.length" class="msg-list">
      <div v-for="m in messages" :key="m.id"
           :class="['msg-card', { unread: !m.isRead }]"
           @click="!m.isRead && handleRead(m.id)">
        <div class="msg-dot" v-if="!m.isRead"></div>
        <div class="msg-body">
          <div class="msg-head">
            <span class="msg-title">{{ m.title }}</span>
            <span class="msg-time">{{ m.createTime }}</span>
          </div>
          <p class="msg-content">{{ m.content }}</p>
        </div>
      </div>
      <div v-if="totalPages > 1" class="msg-pages">
        <el-button size="small" :disabled="page <= 1" @click="page--; load()">上一页</el-button>
        <span style="margin:0 12px;color:#909399;font-size:13px">{{ page }} / {{ totalPages }}</span>
        <el-button size="small" :disabled="page >= totalPages" @click="page++; load()">下一页</el-button>
      </div>
    </div>

    <el-empty v-else description="暂无系统消息" />
  </div>
</template>

<style scoped>
.inbox-page { max-width: 700px; margin: 20px auto; padding: 0 20px; }
.inbox-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
.inbox-header h2 { font-size: 20px; font-weight: 700; color: #2d3436; }

.msg-list { display: flex; flex-direction: column; gap: 10px; }

.msg-card {
  display: flex; align-items: flex-start; gap: 12px;
  background: #fff; border: 1px solid #e8e8e8; border-radius: 12px;
  padding: 16px; transition: all .2s; cursor: default;
}
.msg-card.unread { background: #f0f4ff; border-color: #d0d8f0; cursor: pointer; }
.msg-card.unread:hover { transform: translateY(-1px); box-shadow: 0 4px 16px rgba(102,126,234,.12); }

.msg-dot { width: 10px; height: 10px; background: #f56c6c; border-radius: 50%; flex-shrink: 0; margin-top: 5px; }
.msg-body { flex: 1; min-width: 0; }
.msg-head { display: flex; justify-content: space-between; align-items: center; gap: 12px; }
.msg-title { font-size: 15px; font-weight: 600; color: #2d3436; }
.msg-time { font-size: 12px; color: #b0b8c0; white-space: nowrap; }
.msg-content { margin: 6px 0 0; font-size: 14px; color: #606266; line-height: 1.5; word-break: break-word; }

.msg-pages { display: flex; align-items: center; justify-content: center; margin-top: 16px; }
</style>
