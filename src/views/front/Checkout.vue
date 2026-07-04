<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getProductDetail } from '@/api/product'
import { createOrder } from '@/api/order'
import { addCart } from '@/api/cart'
import { getMyCoupons } from '@/api/coupon'
import { ElMessage } from 'element-plus'

const router = useRouter()
const route = useRoute()
const productId = Number(route.query.productId || 0)
const product = ref<any>({})
const schedules = ref<any[]>([])
const form = ref({ contactName: '', contactPhone: '', personCount: 1, scheduleId: undefined as number|undefined, couponId: undefined as number|undefined, remark: '' })
const myCoupons = ref<any[]>([])
const loading = ref(false)

onMounted(async () => {
  if (productId) {
    const data: any = await getProductDetail(productId)
    product.value = data.product
    schedules.value = (data.schedules || []).filter((s: any) => s.stock > 0)
  }
  try { myCoupons.value = await getMyCoupons() || [] } catch {}
})

async function handleCreate() {
  if (!form.value.contactName) { ElMessage.warning('请填写联系人'); return }
  if (!form.value.contactPhone) { ElMessage.warning('请填写联系电话'); return }
  loading.value = true
  try {
    const res: any = await createOrder({
      productId,
      scheduleId: form.value.scheduleId,
      travelDate: schedules.value.find((s: any) => s.id === form.value.scheduleId)?.travelDate,
      contactName: form.value.contactName,
      contactPhone: form.value.contactPhone,
      personCount: form.value.personCount,
      remark: form.value.remark,
      couponId: form.value.couponId,
    })
    ElMessage.success('下单成功！')
    router.push('/center/order/' + res.orderId)
  } catch (err: any) {
    ElMessage.error(err.message || '下单失败')
  } finally { loading.value = false }
}
</script>

<template>
  <div class="checkout-page">
    <h2>确认订单</h2>
    <el-row :gutter="24">
      <el-col :span="16">
        <el-card>
          <h3>{{ product.title }}</h3>
          <p class="price">¥{{ product.price }}</p>
          <el-form :model="form" label-width="90px">
            <el-form-item label="出行日期">
              <el-select v-model="form.scheduleId" placeholder="请选择日期">
                <el-option v-for="s in schedules" :key="s.id" :label="s.travelDate + ' ¥' + s.price" :value="s.id" />
              </el-select>
            </el-form-item>
            <el-form-item label="出行人数">
              <el-input-number v-model="form.personCount" :min="1" :max="20" />
            </el-form-item>
            <el-form-item label="联系人">
              <el-input v-model="form.contactName" placeholder="请输入联系人" />
            </el-form-item>
            <el-form-item label="联系电话">
              <el-input v-model="form.contactPhone" placeholder="请输入手机号" />
            </el-form-item>
            <el-form-item label="优惠券">
              <el-select v-model="form.couponId" placeholder="不使用优惠券" clearable>
                <el-option v-for="c in myCoupons.filter((x:any)=>x.status===0)" :key="c.id" :label="'优惠券 #' + c.couponId" :value="c.id" />
              </el-select>
            </el-form-item>
            <el-form-item label="备注">
              <el-input v-model="form.remark" type="textarea" rows="2" />
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card>
          <h4>订单摘要</h4>
          <p>产品：{{ product.title }}</p>
          <p>单价：¥{{ product.price }}</p>
          <p>人数：{{ form.personCount }}</p>
          <p class="total">合计：¥{{ (product.price || 0) * form.personCount }}</p>
          <el-button type="primary" size="large" :loading="loading" @click="handleCreate" style="width:100%">提交订单</el-button>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped>
.checkout-page { max-width: 1000px; margin: 20px auto; padding: 0 20px; }
.price { color: #f56c6c; font-size: 20px; font-weight: 700; }
.total { color: #f56c6c; font-size: 18px; font-weight: 700; text-align: right; }
</style>
