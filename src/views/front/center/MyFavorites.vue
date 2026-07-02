<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getFavoriteList, toggleFavorite } from '@/api/favorite'
import { ElMessage } from 'element-plus'

const router = useRouter()
const products = ref<any[]>([])
onMounted(async () => { try { products.value = await getFavoriteList() || [] } catch {} })
async function removeFav(id: number) {
  await toggleFavorite(id)
  products.value = products.value.filter((p: any) => p.id !== id)
  ElMessage.success('已取消收藏')
}
</script>

<template>
  <div><h2>我的收藏</h2>
    <el-row :gutter="16">
      <el-col :span="8" v-for="p in products" :key="p.id" style="margin-bottom:16px">
        <el-card :body-style="{padding:0}" shadow="hover" @click="router.push('/product/'+p.id)">
          <img :src="p.cover" style="width:100%;height:160px;object-fit:cover" />
          <div style="padding:10px">
            <h4>{{ p.title }}</h4>
            <p style="color:#f56c6c;font-weight:700">¥{{ p.price }}</p>
            <el-button size="small" @click.stop="removeFav(p.id)">取消收藏</el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-empty v-if="!products.length" description="暂无收藏" />
  </div>
</template>
<style scoped>
div { max-width: 1000px; margin: 20px auto; padding: 0 20px; }
</style>
