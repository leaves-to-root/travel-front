<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getNoteList } from '@/api/note'

const router = useRouter()
const notes = ref<any[]>([])
const loading = ref(false)
const page = ref(1); const total = ref(0)
async function load() {
  loading.value = true
  try { const r: any = await getNoteList(page.value, 10); notes.value = r.records || []; total.value = r.total || 0 }
  catch { notes.value = [] }
  finally { loading.value = false }
}
onMounted(load)
</script>

<template>
  <div class="note-list-page">
    <div class="header-bar">
      <h2>游记分享</h2>
      <el-button type="primary" @click="router.push('/notes/publish')">写游记</el-button>
    </div>
    <el-row :gutter="20" v-loading="loading">
      <el-col :span="12" v-for="n in notes" :key="n.id" style="margin-bottom:20px">
        <el-card shadow="hover" @click="router.push('/notes/'+n.id)" style="cursor:pointer">
          <h3>{{ n.title }}</h3>
          <p style="color:#909399;font-size:13px">👤 用户{{ n.userId }} | 👁 {{ n.viewCount }} | 👍 {{ n.likeCount }} | {{ n.createTime }}</p>
        </el-card>
      </el-col>
    </el-row>
    <el-empty v-if="!notes.length && !loading" description="暂无游记" />
    <el-pagination v-if="total>10" v-model:current-page="page" :total="total" @current-change="load" />
  </div>
</template>
<style scoped>
.note-list-page { max-width: 900px; margin: 20px auto; padding: 0 20px; }
.header-bar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
</style>
