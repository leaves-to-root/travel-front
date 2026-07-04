<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getNoteDetail } from '@/api/note'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()
const note = ref<any>({})
const loading = ref(true)
onMounted(async () => {
  try { note.value = await getNoteDetail(Number(route.params.id)) || {} }
  catch { ElMessage.error('游记不存在'); router.push('/notes') }
  finally { loading.value = false }
})
</script>

<template>
  <div class="note-detail-page" v-loading="loading">
    <el-card v-if="note.id">
      <h1>{{ note.title }}</h1>
      <div class="meta">👤 用户{{ note.userId }} | 👁 {{ note.viewCount }} | 👍 {{ note.likeCount }} | {{ note.createTime }}</div>
      <div class="content" v-html="note.content || ''"></div>
      <div v-if="note.productId" class="relate">
        <el-tag @click="router.push('/product/'+note.productId)" style="cursor:pointer">查看关联产品 →</el-tag>
      </div>
    </el-card>
  </div>
</template>
<style scoped>
.note-detail-page { max-width: 800px; margin: 20px auto; padding: 0 20px; }
.meta { color: #909399; font-size: 14px; margin: 8px 0 20px; }
.content { line-height: 1.9; font-size: 15px; }
.content :deep(img) { max-width: 100%; border-radius: 8px; margin: 10px 0; }
.relate { margin-top: 20px; }
</style>
