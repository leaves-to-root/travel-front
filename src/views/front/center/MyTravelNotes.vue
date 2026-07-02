<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getMyNotes } from '@/api/note'

const router = useRouter()
const notes = ref<any[]>([])
const loading = ref(false)
const page = ref(1); const total = ref(0)
async function load() {
  loading.value = true
  try { const r: any = await getMyNotes(page.value, 10); notes.value = r.records || []; total.value = r.total || 0 }
  catch { notes.value = [] }
  finally { loading.value = false }
}
onMounted(load)
</script>

<template>
  <div><h2>我的游记</h2>
    <el-button @click="router.push('/notes/publish')" type="primary" style="margin-bottom:16px">写游记</el-button>
    <el-card v-for="n in notes" :key="n.id" style="margin-bottom:12px;cursor:pointer" @click="router.push('/notes/'+n.id)">
      <h4>{{ n.title }}</h4>
      <p style="color:#909399;font-size:13px">{{ n.createTime }} | 阅读 {{ n.viewCount }} | 点赞 {{ n.likeCount }}</p>
    </el-card>
    <el-empty v-if="!notes.length && !loading" description="暂无游记" />
  </div>
</template>
<style scoped>
div { max-width: 800px; margin: 20px auto; padding: 0 20px; }
</style>
