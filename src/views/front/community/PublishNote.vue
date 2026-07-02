<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { publishNote } from '@/api/note'
import { ElMessage } from 'element-plus'

const router = useRouter()
const form = ref({ title: '', content: '', productId: undefined as number | undefined })
const loading = ref(false)

async function handlePublish() {
  if (!form.value.title) { ElMessage.warning('请输入标题'); return }
  loading.value = true
  try {
    await publishNote(form.value)
    ElMessage.success('游记发布成功！')
    router.push('/notes')
  } catch (err: any) { ElMessage.error(err.message || '发布失败') }
  finally { loading.value = false }
}
</script>

<template>
  <div class="publish-page">
    <h2>发布游记</h2>
    <el-card>
      <el-form :model="form" label-width="0">
        <el-form-item><el-input v-model="form.title" placeholder="标题" size="large" /></el-form-item>
        <el-form-item><el-input v-model="form.productId" placeholder="关联产品ID（可选）" type="number" /></el-form-item>
        <el-form-item>
          <el-input v-model="form.content" type="textarea" :rows="12" placeholder="开始写游记..." />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="loading" @click="handlePublish">发布</el-button>
          <el-button @click="router.push('/notes')">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
<style scoped>
.publish-page { max-width: 700px; margin: 20px auto; padding: 0 20px; }
</style>
