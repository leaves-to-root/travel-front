<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getUserAnalysis, getUserHistory } from '@/api/admin/adminAnalysis'
import { ElMessage } from 'element-plus'

const users = ref<any[]>([])
const loading = ref(false)
const historyDialog = ref(false)
const currentUserName = ref('')
const historyList = ref<any[]>([])
const historyLoading = ref(false)

onMounted(load)

async function load() {
  loading.value = true
  try { users.value = await getUserAnalysis() }
  catch (err: any) { ElMessage.error(err.message || '加载失败') }
  finally { loading.value = false }
}

async function openHistory(u: any) {
  currentUserName.value = u.nickname || u.username || ('用户 ' + u.userId)
  historyDialog.value = true
  historyLoading.value = true
  try { historyList.value = await getUserHistory(u.userId) }
  catch (err: any) { ElMessage.error(err.message || '加载失败'); historyList.value = [] }
  finally { historyLoading.value = false }
}
</script>

<template>
  <div>
    <h2>用户分析</h2>
    <p style="color:#909399;font-size:13px;margin-bottom:16px">
      统计每位用户的浏览次数，并展示其浏览最多的前 3 个分类（按顶级分类聚合）
    </p>

    <el-card v-loading="loading">
      <el-table :data="users" style="width:100%" v-if="users.length">
        <el-table-column label="用户" min-width="180">
          <template #default="{ row }">
            <div style="display:flex;align-items:center;gap:10px">
              <el-avatar :size="32" :src="row.avatar">{{ (row.nickname || row.username || 'U')[0] }}</el-avatar>
              <div>
                <div style="font-weight:600">{{ row.nickname || row.username || '未命名' }}</div>
                <div style="font-size:12px;color:#909399">{{ row.username }}</div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="浏览次数" prop="viewCount" width="110" align="center">
          <template #default="{ row }">
            <el-tag :type="row.viewCount > 0 ? 'primary' : 'info'" effect="plain">{{ row.viewCount }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="偏好分类（浏览次数最多前3）" min-width="320">
          <template #default="{ row }">
            <template v-if="row.topCategories && row.topCategories.length">
              <el-tag
                v-for="(c, i) in row.topCategories"
                :key="c.categoryId"
                :type="(['danger', 'warning', 'success'] as any)[i] || 'primary'"
                style="margin-right:8px"
              >
                {{ c.categoryName }} · {{ c.count }}次
              </el-tag>
            </template>
            <span v-else style="color:#c0c4cc;font-size:13px">暂无浏览数据</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" align="center" fixed="right">
          <template #default="{ row }">
            <el-button text type="primary" @click="openHistory(row)">浏览记录</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-empty v-else-if="!loading" description="暂无用户数据" />
    </el-card>

    <el-dialog v-model="historyDialog" :title="`${currentUserName} 的浏览记录`" width="640px">
      <div v-loading="historyLoading">
        <el-table :data="historyList" v-if="historyList.length" style="width:100%">
          <el-table-column label="产品" min-width="240">
            <template #default="{ row }">
              <div style="display:flex;align-items:center;gap:10px">
                <el-image v-if="row.cover" :src="row.cover" style="width:42px;height:42px;border-radius:6px;flex-shrink:0" fit="cover" />
                <span>{{ row.title }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="价格" prop="price" width="100" />
          <el-table-column label="浏览时间" prop="viewTime" width="180" />
        </el-table>
        <el-empty v-else-if="!historyLoading" description="该用户暂无浏览记录" />
      </div>
    </el-dialog>
  </div>
</template>
