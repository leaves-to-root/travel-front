<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getCartList, updateCart, removeCart } from '@/api/cart'
import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter()
const carts = ref<any[]>([])

onMounted(load)
async function load() {
  try { carts.value = await getCartList() || [] } catch { carts.value = [] }
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
  if (!carts.value.length) { ElMessage.warning('购物车为空'); return }
  router.push('/checkout')
}
</script>

<template>
  <div class="cart-page">
    <h2>购物车</h2>
    <el-empty v-if="!carts.length" description="购物车是空的" />
    <el-card v-for="c in carts" :key="c.cartId" class="cart-item">
      <div class="cart-row">
        <img :src="c.productCover" class="cart-img" @click="router.push('/product/'+c.productId)" />
        <div class="cart-info" @click="router.push('/product/'+c.productId)">
          <h4>{{ c.productTitle }}</h4>
          <p>出行日期：{{ c.travelDate || '待定' }}</p>
          <p class="price">¥{{ c.price }}</p>
        </div>
        <div class="cart-qty">
          <el-input-number v-model="c.quantity" :min="1" :max="99" size="small" @change="handleUpdate(c)" />
        </div>
        <el-button type="danger" size="small" @click="handleRemove(c.cartId)">删除</el-button>
      </div>
    </el-card>
    <div class="cart-footer" v-if="carts.length">
      <el-button type="primary" size="large" @click="goCheckout">去结算</el-button>
    </div>
  </div>
</template>

<style scoped>
.cart-page { max-width: 800px; margin: 20px auto; padding: 0 20px; }
.cart-item { margin-bottom: 12px; }
.cart-row { display: flex; align-items: center; gap: 16px; }
.cart-img { width: 100px; height: 70px; object-fit: cover; border-radius: 6px; cursor: pointer; }
.cart-info { flex: 1; cursor: pointer; }
.cart-info h4 { margin: 0 0 4px; font-size: 15px; }
.cart-info p { margin: 2px 0; color: #909399; font-size: 13px; }
.cart-qty { width: 120px; }
.cart-footer { text-align: right; margin-top: 20px; }
</style>
