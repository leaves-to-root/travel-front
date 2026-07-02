<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getOrderDetail, cancelOrder, payOrder, refundOrder } from '@/api/order'
import { ElMessage, ElMessageBox } from 'element-plus'

const route = useRoute()
const router = useRouter()
const order = ref<any>({})
const items = ref<any[]>([])
const loading = ref(true)

onMounted(async () => {
  const id = Number(route.params.id)
  if (!id) return
  try {
    const data: any = await getOrderDetail(id)
    order.value = data.order || {}
    items.value = data.items || []
  } catch { ElMessage.error('订单不存在'); router.push('/center/order') }
  finally { loading.value = false }
})
const statusMap: Record<number, string> = { 0:'待支付', 1:'已支付', 2:'已完成', 3:'已取消', 4:'退款中', 5:'已退款' }
async function handlePay() { await payOrder(order.value.id); ElMessage.success('支付成功'); await load(); }
async function handleCancel() { await ElMessageBox.confirm('确认取消？'); await cancelOrder(order.value.id); await load(); }
async function handleRefund() { await ElMessageBox.prompt('请输入退款原因'); await refundOrder(order.value.id, '用户申请'); await load(); }
async function load() { const data: any = await getOrderDetail(Number(route.params.id)); order.value = data.order || {}; items.value = data.items || [] }
</script>

<template>
  <div class="order-detail-page" v-loading="loading">
    <h2>订单详情</h2>
    <el-card>
      <p>订单号：{{ order.orderNo }}</p>
      <p>状态：<span :class="'status-'+order.status">{{ statusMap[order.status] || '未知' }}</span></p>
      <p>总金额：¥{{ order.totalAmount }}  实付：¥{{ order.payAmount }}</p>
      <p>联系人：{{ order.contactName }}  电话：{{ order.contactPhone }}</p>
      <p>出行日期：{{ order.travelDate }}  人数：{{ order.personCount }}</p>
      <p>创建时间：{{ order.createTime }}</p>
      <p v-if="order.payTime">支付时间：{{ order.payTime }}</p>
      <div class="item-list">
        <h4>产品明细</h4>
        <div v-for="it in items" :key="it.id" class="item">
          <span>{{ it.productName }} × {{ it.quantity }}</span>
          <span>¥{{ it.subtotal }}</span>
        </div>
      </div>
      <div class="actions" v-if="order.status === 0">
        <el-button type="primary" @click="handlePay">支付</el-button>
        <el-button @click="handleCancel">取消订单</el-button>
      </div>
      <div class="actions" v-if="order.status === 1">
        <el-button @click="handleRefund">申请退款</el-button>
      </div>
    </el-card>
  </div>
</template>
<style scoped>
.order-detail-page { max-width: 700px; margin: 20px auto; padding: 0 20px; }
.item-list { margin-top: 16px; }
.item { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f0f0f0; }
.actions { margin-top: 20px; display: flex; gap: 12px; }
</style>
