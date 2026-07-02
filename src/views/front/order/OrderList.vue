<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getMyOrders } from '@/api/order'

const router = useRouter()
const orders = ref<any[]>([])
const status = ref<number|string>('all')
const loading = ref(false)
const page = ref(1)
const total = ref(0)
const tabs = [{label:'全部',value:'all'},{label:'待支付',value:0},{label:'已支付',value:1},{label:'已完成',value:2},{label:'已取消',value:3}]

async function load() {
  loading.value = true
  try {
    const statusParam = status.value === 'all' ? undefined : Number(status.value)
    const res: any = await getMyOrders({ page: page.value, size: 10, status: statusParam })
    orders.value = res.records || []
    total.value = res.total || 0
  } catch { orders.value = [] }
  finally { loading.value = false }
}
onMounted(load)
function onTabChange(val: any) { status.value = val; page.value = 1; load() }
const statusMap: Record<number, string> = { 0:'待支付', 1:'已支付', 2:'已完成', 3:'已取消', 4:'退款中', 5:'已退款' }
</script>

<template>
  <div class="order-list-page">
    <h2>我的订单</h2>
    <el-tabs :model-value="status" @tab-change="onTabChange">
      <el-tab-pane v-for="t in tabs" :key="t.label" :label="t.label" :name="t.value" />
    </el-tabs>
    <el-card v-for="o in orders" :key="o.id" class="order-card" @click="router.push('/center/order/'+o.id)">
      <div class="order-row">
        <span>订单号：{{ o.orderNo }}</span>
        <span :class="'status status-'+o.status">{{ statusMap[o.status] || '未知' }}</span>
      </div>
      <div class="order-row">
        <span>金额：¥{{ o.totalAmount }}</span>
        <span>{{ o.travelDate ? '出行：'+o.travelDate : '' }}</span>
      </div>
      <p class="order-time">{{ o.createTime }}</p>
    </el-card>
    <el-empty v-if="!orders.length && !loading" description="暂无订单" />
    <el-pagination v-if="total>10" v-model:current-page="page" :total="total" :page-size="10" @current-change="load" />
  </div>
</template>
<style scoped>
.order-list-page { max-width: 800px; margin: 20px auto; padding: 0 20px; }
.order-card { margin-bottom: 12px; cursor: pointer; }
.order-row { display: flex; justify-content: space-between; font-size: 14px; margin: 4px 0; }
.status { font-weight: 600; }
.status-0 { color: #e6a23c; } .status-1 { color: #409eff; } .status-2 { color: #67c23a; }
.status-3 { color: #c0c4cc; } .status-4 { color: #f56c6c; } .status-5 { color: #909399; }
.order-time { color: #909399; font-size: 12px; margin: 4px 0 0; }
</style>
