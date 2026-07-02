<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getOrderList, confirmOrder, approveRefund } from '@/api/admin/adminOrder'
import { ElMessage, ElMessageBox } from 'element-plus'

const orders = ref<any[]>([]); const total = ref(0); const page = ref(1); const status = ref<number|undefined>()
const statusMap: Record<number, string> = {0:'待支付',1:'已支付',2:'已完成',3:'已取消',4:'退款中',5:'已退款'}
const statusType: Record<number, string> = {0:'warning',1:'primary',2:'success',3:'info',4:'danger',5:'info'}
async function load() {
  try { const r: any = await getOrderList({ page: page.value, size: 10, status: status.value }); orders.value = r.records || []; total.value = r.total || 0 } catch {}
}
onMounted(load)
async function confirm(id: number) { await ElMessageBox.confirm('确认完成？'); await confirmOrder(id); ElMessage.success('已确认'); load() }
async function refund(id: number) { await ElMessageBox.confirm('通过退款？'); await approveRefund(id); ElMessage.success('已退款'); load() }
</script>

<template>
  <div>
    <h2>订单管理</h2>
    <el-select v-model="status" placeholder="全部状态" clearable style="width:150px;margin-bottom:16px" @change="load">
      <el-option v-for="(v,k) in statusMap" :key="k" :label="v" :value="k" />
    </el-select>
    <el-table :data="orders" border stripe>
      <el-table-column prop="id" label="ID" width="50" />
      <el-table-column prop="orderNo" label="订单号" width="180" />
      <el-table-column prop="totalAmount" label="金额" width="100" />
      <el-table-column prop="contactName" label="联系人" />
      <el-table-column prop="contactPhone" label="电话" />
      <el-table-column label="状态" width="80"><template #default="{row}"><el-tag :type="statusType[row.status]">{{ statusMap[row.status] }}</el-tag></template></el-table-column>
      <el-table-column prop="createTime" label="创建时间" width="150" />
      <el-table-column label="操作" width="130">
        <template #default="{row}">
          <el-button v-if="row.status===1" size="small" @click="confirm(row.id)">确认</el-button>
          <el-button v-if="row.status===4" size="small" type="danger" @click="refund(row.id)">退款</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination v-if="total>10" v-model:current-page="page" :total="total" @current-change="load" />
  </div>
</template>
