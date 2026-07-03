<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { sendMessage, sendMessageToAll, getMessageList } from '@/api/admin/adminMessage'
import { getUserList } from '@/api/admin/adminUser'
import { ElMessage, ElMessageBox } from 'element-plus'

const activeTab = ref<'send' | 'history'>('send')

// 发送表单
type TargetType = 'single' | 'all'
const targetType = ref<TargetType>('single')
const users = ref<any[]>([])
const selectedUserId = ref<number | null>(null)
const title = ref('')
const content = ref('')
const sending = ref(false)

const historyList = ref<any[]>([])
const historyTotal = ref(0)
const page = ref(1)

onMounted(async () => {
  try { const r: any = await getUserList({ page: 1, size: 999 }); users.value = r.records || [] } catch {}
  loadHistory()
})

async function loadHistory() {
  try {
    const r: any = await getMessageList(page.value, 20)
    historyList.value = r.records || []
    historyTotal.value = r.total || 0
  } catch {}
}

async function handleSend() {
  if (!title.value || !content.value) { ElMessage.warning('请填写标题和内容'); return }
  if (targetType.value === 'single' && !selectedUserId.value && selectedUserId.value !== 0) {
    ElMessage.warning('请选择用户')
    return
  }

  if (targetType.value === 'all') {
    try {
      await ElMessageBox.confirm('确定要发送给所有用户吗？', '确认')
    } catch { return }
  }

  sending.value = true
  try {
    if (targetType.value === 'single') {
      await sendMessage({ userId: selectedUserId.value!, title: title.value, content: content.value })
    } else {
      await sendMessageToAll({ title: title.value, content: content.value })
    }
    ElMessage.success('消息已发送')
    title.value = ''
    content.value = ''
    selectedUserId.value = null
    loadHistory()
  } catch (err: any) { ElMessage.error(err.message || '发送失败') }
  finally { sending.value = false }
}
</script>

<template>
  <div>
    <h2>系统消息</h2>

    <el-tabs v-model="activeTab" style="margin-top:16px">
      <el-tab-pane label="发送消息" name="send">
        <el-card>
          <el-form label-width="80px">
            <el-form-item label="发送方式">
              <el-radio-group v-model="targetType">
                <el-radio value="single">指定用户</el-radio>
                <el-radio value="all">全部用户</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="接收用户" v-if="targetType === 'single'">
              <el-select v-model="selectedUserId" filterable placeholder="选择用户" style="width:100%">
                <el-option v-for="u in users" :key="u.id" :label="`${u.nickname || u.username} (${u.email || '无邮箱'})`" :value="u.id" />
              </el-select>
            </el-form-item>
            <el-form-item label="标题">
              <el-input v-model="title" placeholder="消息标题" maxlength="128" />
            </el-form-item>
            <el-form-item label="内容">
              <el-input v-model="content" type="textarea" :rows="4" placeholder="消息内容" maxlength="1000" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" :loading="sending" @click="handleSend">发送消息</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-tab-pane>

      <el-tab-pane label="发送记录" name="history">
        <el-card>
          <el-table :data="historyList" style="width:100%" v-if="historyList.length">
            <el-table-column label="ID" prop="id" width="60" />
            <el-table-column label="用户ID" prop="userId" width="80" />
            <el-table-column label="标题" prop="title" min-width="150" show-overflow-tooltip />
            <el-table-column label="内容" prop="content" min-width="250" show-overflow-tooltip />
            <el-table-column label="已读" width="80">
              <template #default="{ row }"><span :style="{color:row.isRead?'#67c23a':'#f56c6c'}">{{ row.isRead ? '已读' : '未读' }}</span></template>
            </el-table-column>
            <el-table-column label="发送时间" prop="createTime" width="170" />
          </el-table>
          <el-empty v-if="!historyList.length" description="暂无发送记录" />
        </el-card>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
