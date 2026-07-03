<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getHistoryList } from '@/api/history'

const router = useRouter()
const products = ref<any[]>([])
onMounted(async () => { try { products.value = await getHistoryList() || [] } catch {} })
</script>

<template>
  <div><h2>浏览历史</h2>
    <el-row :gutter="16">
      <el-col :span="6" v-for="p in products" :key="p.id" style="margin-bottom:16px">
        <el-card :body-style="{padding:0}" shadow="hover" @click="router.push('/product/'+p.id)">
          <img :src="p.cover" style="width:100%;height:140px;object-fit:cover" />
          <div style="padding:10px">
            <h4 style="font-size:14px">{{ p.title }}</h4>
            <span style="color:#f56c6c">¥{{ p.price }}</span>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-empty v-if="!products.length" description="暂无浏览历史" />
  </div>
</template>
<style scoped>
div { max-width: 1000px; margin: 20px auto; padding: 0 20px; }
</style>
