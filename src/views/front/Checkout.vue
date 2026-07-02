<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getProductDetail } from '@/api/product'
import { createOrder, createBatchOrder } from '@/api/order'
import { getMyCoupons } from '@/api/coupon'
import { getCartList, removeCart } from '@/api/cart'
import { ElMessage } from 'element-plus'
import type { CreateOrderRequest } from '@/api/types'

const router = useRouter()
const route = useRoute()

const productId = Number(route.query.productId || 0)
const cartIdQuery = (route.query.cartIds as string) || ''
const isBatch = !productId && !!cartIdQuery
const cartIds = cartIdQuery.split(',').map(Number).filter(Boolean)

const product = ref<any>({})
const schedules = ref<any[]>([])
const singleForm = ref({
  contactName: '',
  contactPhone: '',
  personCount: 1,
  scheduleId: undefined as number | undefined,
  couponId: undefined as number | undefined,
  remark: '',
})

const batchItems = ref<any[]>([])
const myCoupons = ref<any[]>([])
const loading = ref(false)

onMounted(async () => {
  try {
    myCoupons.value = await getMyCoupons() || []
  } catch {}

  if (isBatch) {
    await loadBatchItems()
  } else if (productId) {
    const data: any = await getProductDetail(productId)
    product.value = data.product || {}
    schedules.value = (data.schedules || []).filter((s: any) => s.stock > 0)
  }
})

async function loadBatchItems() {
  let carts: any[] = []
  try {
    carts = (await getCartList()) || []
  } catch {
    carts = []
  }
  const selected = carts.filter((c: any) => cartIds.includes(c.cartId))
  if (!selected.length) {
    ElMessage.warning('所选购物车项为空')
    return
  }
  const items: any[] = []
  for (const c of selected) {
    try {
      const data: any = await getProductDetail(c.productId)
      const product = data.product || {}
      const schedules = (data.schedules || []).filter((s: any) => s.stock > 0)
      const defaultSchedule = schedules.find((s: any) => s.travelDate === c.travelDate) || schedules[0]
      items.push({
        cartId: c.cartId,
        product,
        schedules,
        form: {
          scheduleId: defaultSchedule?.id,
          personCount: c.quantity || 1,
          contactName: '',
          contactPhone: '',
          couponId: undefined as number | undefined,
          remark: '',
        },
      })
    } catch {
      ElMessage.warning('加载商品 ' + c.productTitle + ' 失败')
    }
  }
  batchItems.value = items
}

function itemPrice(item: any) {
  const schedule = item.schedules.find((s: any) => s.id === item.form.scheduleId)
  return schedule ? schedule.price : item.product.price
}

function itemTravelDate(item: any) {
  const schedule = item.schedules.find((s: any) => s.id === item.form.scheduleId)
  return schedule ? schedule.travelDate : item.product.travelDate
}

const singleTotal = computed(() => {
  const price = schedules.value.find((s: any) => s.id === singleForm.value.scheduleId)?.price ?? product.value.price
  return (price || 0) * (singleForm.value.personCount || 1)
})

const batchTotal = computed(() => {
  return batchItems.value.reduce((sum, item) => sum + itemPrice(item) * (item.form.personCount || 1), 0)
})

function validateSingle() {
  if (!singleForm.value.contactName) { ElMessage.warning('请填写联系人'); return false }
  if (!singleForm.value.contactPhone) { ElMessage.warning('请填写联系电话'); return false }
  return true
}

function validateBatch() {
  for (const item of batchItems.value) {
    if (!item.form.contactName) { ElMessage.warning('请填写 ' + item.product.title + ' 的联系人'); return false }
    if (!item.form.contactPhone) { ElMessage.warning('请填写 ' + item.product.title + ' 的联系电话'); return false }
  }
  return true
}

async function handleSingleCreate() {
  if (!validateSingle()) return
  loading.value = true
  try {
    const res: any = await createOrder({
      productId,
      scheduleId: singleForm.value.scheduleId,
      travelDate: schedules.value.find((s: any) => s.id === singleForm.value.scheduleId)?.travelDate,
      contactName: singleForm.value.contactName,
      contactPhone: singleForm.value.contactPhone,
      personCount: singleForm.value.personCount,
      remark: singleForm.value.remark,
      couponId: singleForm.value.couponId,
    })
    ElMessage.success('下单成功！')
    router.push('/center/order/' + res.orderId)
  } catch (err: any) {
    ElMessage.error(err.message || '下单失败')
  } finally {
    loading.value = false
  }
}

async function handleBatchCreate() {
  if (!validateBatch()) return
  loading.value = true
  try {
    const reqs: CreateOrderRequest[] = batchItems.value.map((item) => {
      const schedule = item.schedules.find((s: any) => s.id === item.form.scheduleId)
      return {
        productId: item.product.id,
        scheduleId: item.form.scheduleId,
        travelDate: schedule ? schedule.travelDate : undefined,
        contactName: item.form.contactName,
        contactPhone: item.form.contactPhone,
        personCount: item.form.personCount,
        remark: item.form.remark,
        couponId: item.form.couponId,
      }
    })
    await createBatchOrder(reqs)
    for (const item of batchItems.value) {
      await removeCart(item.cartId)
    }
    ElMessage.success('支付成功！')
    router.push('/center/order')
  } catch (err: any) {
    ElMessage.error(err.message || '支付失败')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="checkout-page">
    <h2>确认订单</h2>

    <!-- 单商品结算（立即预订入口） -->
    <template v-if="!isBatch">
      <el-row :gutter="24">
        <el-col :span="16">
          <el-card>
            <h3>{{ product.title }}</h3>
            <p class="price">¥{{ product.price }}</p>
            <el-form :model="singleForm" label-width="90px">
              <el-form-item label="出行日期">
                <el-select v-model="singleForm.scheduleId" placeholder="请选择日期">
                  <el-option v-for="s in schedules" :key="s.id" :label="s.travelDate + ' ¥' + s.price" :value="s.id" />
                </el-select>
              </el-form-item>
              <el-form-item label="出行人数">
                <el-input-number v-model="singleForm.personCount" :min="1" :max="20" />
              </el-form-item>
              <el-form-item label="联系人">
                <el-input v-model="singleForm.contactName" placeholder="请输入联系人" />
              </el-form-item>
              <el-form-item label="联系电话">
                <el-input v-model="singleForm.contactPhone" placeholder="请输入手机号" />
              </el-form-item>
              <el-form-item label="优惠券">
                <el-select v-model="singleForm.couponId" placeholder="不使用优惠券" clearable>
                  <el-option v-for="c in myCoupons.filter((x:any)=>x.status===0)" :key="c.id" :label="'优惠券 #' + c.couponId" :value="c.id" />
                </el-select>
              </el-form-item>
              <el-form-item label="备注">
                <el-input v-model="singleForm.remark" type="textarea" rows="2" />
              </el-form-item>
            </el-form>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card>
            <h4>订单摘要</h4>
            <p>产品：{{ product.title }}</p>
            <p>单价：¥{{ product.price }}</p>
            <p>人数：{{ singleForm.personCount }}</p>
            <p class="total">合计：¥{{ singleTotal }}</p>
            <el-button type="primary" size="large" :loading="loading" @click="handleSingleCreate" style="width:100%">提交订单</el-button>
          </el-card>
        </el-col>
      </el-row>
    </template>

    <!-- 购物车批量结算 -->
    <template v-else>
      <el-row :gutter="24">
        <el-col :span="16">
          <el-card v-for="(item, idx) in batchItems" :key="item.cartId" class="batch-item">
            <h3>订单 {{ idx + 1 }}：{{ item.product.title }}</h3>
            <p class="price">¥{{ item.product.price }}</p>
            <el-form :model="item.form" label-width="90px">
              <el-form-item label="出行日期">
                <el-select v-model="item.form.scheduleId" placeholder="请选择日期">
                  <el-option v-for="s in item.schedules" :key="s.id" :label="s.travelDate + ' ¥' + s.price" :value="s.id" />
                </el-select>
              </el-form-item>
              <el-form-item label="出行人数">
                <el-input-number v-model="item.form.personCount" :min="1" :max="20" />
              </el-form-item>
              <el-form-item label="联系人">
                <el-input v-model="item.form.contactName" placeholder="请输入联系人" />
              </el-form-item>
              <el-form-item label="联系电话">
                <el-input v-model="item.form.contactPhone" placeholder="请输入手机号" />
              </el-form-item>
              <el-form-item label="优惠券">
                <el-select v-model="item.form.couponId" placeholder="不使用优惠券" clearable>
                  <el-option v-for="c in myCoupons.filter((x:any)=>x.status===0)" :key="c.id" :label="'优惠券 #' + c.couponId" :value="c.id" />
                </el-select>
              </el-form-item>
              <el-form-item label="备注">
                <el-input v-model="item.form.remark" type="textarea" rows="2" />
              </el-form-item>
            </el-form>
            <div class="item-total">小计：¥{{ itemPrice(item) * item.form.personCount }}</div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card class="summary-card">
            <h4>订单摘要</h4>
            <p>共 {{ batchItems.length }} 笔订单</p>
            <p class="total">合计：¥{{ batchTotal }}</p>
            <el-button type="primary" size="large" :loading="loading" @click="handleBatchCreate" style="width:100%">一键付款</el-button>
          </el-card>
        </el-col>
      </el-row>
    </template>
  </div>
</template>

<style scoped>
.checkout-page { max-width: 1000px; margin: 20px auto; padding: 0 20px; }
.price { color: #f56c6c; font-size: 20px; font-weight: 700; }
.total { color: #f56c6c; font-size: 18px; font-weight: 700; text-align: right; margin-top: 12px; }
.batch-item { margin-bottom: 16px; }
.item-total { text-align: right; color: #f56c6c; font-weight: 700; margin-top: 8px; }
.summary-card { position: sticky; top: 20px; }
</style>
