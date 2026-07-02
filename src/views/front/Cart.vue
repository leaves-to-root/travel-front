<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getCartList, updateCart, removeCart } from '@/api/cart'
import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter()
const carts = ref<any[]>([])
const selected = ref<number[]>([])

onMounted(load)
async function load() {
  try {
    carts.value = await getCartList() || []
    selected.value = []
  } catch {
    carts.value = []
  }
}
async function handleUpdate(item: any) {
  if (item.quantity < 1) { item.quantity = 1 }
  await updateCart(item.cartId, item.quantity)
}
async function handleRemove(cartId: number) {
  await ElMessageBox.confirm('确定删除？')
  await removeCart(cartId)
  await load()
}
function goCheckout() {
  if (!selected.value.length) { ElMessage.warning('请至少选择一件商品'); return }
  router.push('/checkout?cartIds=' + selected.value.join(','))
}
</script>

<template>
  <div class="cart-page">
    <h2>购物车</h2>
    <el-empty v-if="!carts.length" description="购物车是空的" />
    <el-checkbox-group v-model="selected" v-if="carts.length">
      <el-card v-for="c in carts" :key="c.cartId" class="cart-item" :body-style="{ padding: '20px' }">
        <div class="cart-row">
          <el-checkbox :value="c.cartId" class="cart-checkbox" />
          <img :src="c.productCover" class="cart-img" @click="router.push('/product/'+c.productId)" />
          <div class="cart-info" @click="router.push('/product/'+c.productId)">
            <h4 class="cart-title">{{ c.productTitle }}</h4>
            <p class="cart-date">出行日期：{{ c.travelDate || '待定' }}</p>
            <p class="cart-price">¥{{ c.price }}</p>
          </div>
          <div class="cart-qty">
            <el-input-number v-model="c.quantity" :min="1" :max="99" size="small" @change="handleUpdate(c)" />
          </div>
          <el-button type="danger" size="small" class="cart-delete" @click="handleRemove(c.cartId)">删除</el-button>
        </div>
      </el-card>
    </el-checkbox-group>
    <div class="cart-footer" v-if="carts.length">
      <span class="selected-info">已选 {{ selected.length }} 件</span>
      <el-button type="primary" size="large" @click="goCheckout">去结算</el-button>
    </div>
  </div>
</template>

<style scoped>
.cart-page { max-width: 900px; margin: 20px auto; padding: 0 20px; }
.cart-item { margin-bottom: 16px; }
.cart-row { display: flex; align-items: flex-start; gap: 20px; }
.cart-checkbox { flex-shrink: 0; margin-top: 25px; }
.cart-img { width: 120px; height: 80px; object-fit: cover; border-radius: 8px; cursor: pointer; flex-shrink: 0; margin-top: 5px; }
.cart-info { flex: 1; cursor: pointer; min-width: 0; padding-top: 5px; }
.cart-title { margin: 0 0 12px; font-size: 16px; font-weight: 600; color: #303133; line-height: 1.4; word-break: break-word; }
.cart-date { margin: 0 0 10px; color: #909399; font-size: 14px; line-height: 1.5; }
.cart-price { margin: 0; color: #f56c6c; font-size: 18px; font-weight: 700; line-height: 1.5; }
.cart-qty { width: 130px; flex-shrink: 0; margin-top: 25px; }
.cart-delete { flex-shrink: 0; margin-top: 25px; }
.cart-footer { display: flex; align-items: center; justify-content: space-between; margin-top: 24px; padding: 16px 20px; background: #f5f7fa; border-radius: 8px; }
.selected-info { color: #606266; font-size: 15px; }
</style>
