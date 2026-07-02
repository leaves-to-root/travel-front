<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getDashboard } from '@/api/admin/adminStats'

const stats = ref<any>({})
onMounted(async () => { try { stats.value = await getDashboard() || {} } catch {} })
</script>

<template>
<div>
  <h2 class="dash-title">📊 控制台</h2>
  <!-- Stats Cards -->
  <div class="stat-cards">
    <div class="stat-card" style="--c:#667eea">
      <div class="sc-icon">👥</div>
      <div class="sc-num">{{ stats.totalUsers || 0 }}</div>
      <div class="sc-label">总用户数</div>
      <div class="sc-sub">今日新增 +{{ stats.newUsersToday || 0 }}</div>
    </div>
    <div class="stat-card" style="--c:#f5576c">
      <div class="sc-icon">📦</div>
      <div class="sc-num">{{ stats.totalOrders || 0 }}</div>
      <div class="sc-label">总订单数</div>
      <div class="sc-sub">今日 {{ stats.todayOrders || 0 }} 单</div>
    </div>
    <div class="stat-card" style="--c:#4facfe">
      <div class="sc-icon">💰</div>
      <div class="sc-num">¥{{ stats.totalRevenue || 0 }}</div>
      <div class="sc-label">总营收</div>
    </div>
    <div class="stat-card" style="--c:#f093fb">
      <div class="sc-icon">⭐</div>
      <div class="sc-num">4.8</div>
      <div class="sc-label">平均评分</div>
    </div>
  </div>

  <!-- Hot Products -->
  <div class="hot-section glass-card" style="padding:24px;margin-top:24px;">
    <h3>🔥 热销产品 Top 5</h3>
    <el-table :data="stats.hotProducts || []" class="hot-table">
      <el-table-column prop="title" label="产品名" min-width="200" />
      <el-table-column prop="price" label="价格" width="100" />
      <el-table-column prop="sales" label="销量" width="100">
        <template #default="{row}"><el-tag type="danger">{{ row.sales }}</el-tag></template>
      </el-table-column>
      <el-table-column prop="score" label="评分" width="80" />
    </el-table>
  </div>
</div>
</template>

<style scoped>
.dash-title { font-family: 'Fredoka',sans-serif; font-size: 24px; margin-bottom: 24px; color: #2d3436; }
.stat-cards { display: grid; grid-template-columns: repeat(4,1fr); gap: 18px; }
.stat-card { background: #fff; padding: 24px; border-radius: 16px; border-top: 3px solid var(--c); box-shadow: 0 2px 16px rgba(0,0,0,.04); transition: all .3s; }
.stat-card:hover { transform: translateY(-3px); box-shadow: 0 8px 30px rgba(0,0,0,.08); }
.sc-icon { font-size: 28px; margin-bottom: 8px; }
.sc-num { font-family: 'Fredoka',sans-serif; font-size: 28px; font-weight: 700; color: #2d3436; }
.sc-label { font-size: 13px; color: #a0a8ac; margin: 4px 0; }
.sc-sub { font-size: 12px; color: #67c23a; }
.hot-table :deep(th) { font-weight: 600; color: #2d3436; }
@media (max-width:768px) { .stat-cards { grid-template-columns: repeat(2,1fr); } }
</style>
