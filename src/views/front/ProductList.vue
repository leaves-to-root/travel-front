<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getProductList } from '@/api/product'
import { getCategoryTree } from '@/api/category'
import type { Product, Category } from '@/api/types'

const route = useRoute()
const router = useRouter()
const products = ref<Product[]>([])
const categories = ref<Category[]>([])
const loading = ref(false)
const page = ref(1); const total = ref(0)
const keyword = ref('')
const categoryId = ref<number | undefined>(undefined)
const sortBy = ref('')
const sortDir = ref('desc')

// 每个排序字段各自的排序方向状态
const sortDirs = reactive<Record<string, string>>({
  price: 'asc',
  sales: 'desc',
  score: 'desc',
})

// 点击排序按钮：同字段切换方向，不同字段使用各自记住的方向
function onSortClick(field: string) {
  if (sortBy.value === field) {
    // 同一字段：切换方向
    sortDirs[field] = sortDirs[field] === 'asc' ? 'desc' : 'asc'
  } else {
    // 切换到新字段：使用该字段记住的方向
    sortBy.value = field
  }
  sortDir.value = sortDirs[field]
  page.value = 1
}

// 点击默认
function onSortDefault() {
  sortBy.value = ''
  sortDir.value = 'desc'
  page.value = 1
}

// 当前排序字段的图标
function sortIcon(field: string) {
  if (sortBy.value !== field) return ''
  return sortDirs[field] === 'asc' ? '↑' : '↓'
}

async function load() {
  loading.value = true
  try {
    const res: any = await getProductList({
      keyword: keyword.value || undefined, categoryId: categoryId.value || undefined,
      sortBy: sortBy.value || undefined, sortDir: sortBy.value ? sortDir.value : undefined,
      page: page.value, size: 12,
    })
    products.value = res.records || []; total.value = res.total || 0
  } catch { products.value = [] }
  finally { loading.value = false }
}

onMounted(async () => {
  keyword.value = (route.query.keyword as string) || ''
  if (route.query.categoryId) categoryId.value = Number(route.query.categoryId)
  try { categories.value = (await getCategoryTree()).filter((c: Category) => c.parentId === 0) } catch {}
  await load()
})

watch([page, categoryId, sortBy, sortDir, keyword], load)
</script>

<template>
<div class="list-page">
  <div class="content-wrap">
    <h2 class="page-title">🏖 探索旅游产品</h2>

    <!-- Filter Bar -->
    <div class="filter-bar glass-card">
      <div class="filter-row">
        <span class="flabel">分类：</span>
        <button class="ftag" :class="{ on: !categoryId }" @click="categoryId=undefined;page=1">全部</button>
        <button v-for="c in categories" :key="c.id" class="ftag" :class="{ on: categoryId===c.id }" @click="categoryId=c.id;page=1">{{ c.name }}</button>
      </div>
      <div class="filter-row">
        <span class="flabel">排序：</span>
        <button class="ftag" :class="{ on: !sortBy }" @click="onSortDefault">默认</button>
        <button class="ftag" :class="{ on: sortBy==='price' }" @click="onSortClick('price')">价格{{ sortIcon('price') }}</button>
        <button class="ftag" :class="{ on: sortBy==='sales' }" @click="onSortClick('sales')">销量{{ sortIcon('sales') }}</button>
        <button class="ftag" :class="{ on: sortBy==='score' }" @click="onSortClick('score')">评分{{ sortIcon('score') }}</button>
      </div>
    </div>

    <!-- Product Grid -->
    <div class="product-grid" v-loading="loading">
      <div class="product-card glass-card" v-for="p in products" :key="p.id" @click="router.push('/product/'+p.id)">
        <div class="card-img-wrap">
          <img :src="p.cover" class="card-img" loading="lazy" />
          <span class="card-days">{{ p.days }}天</span>
        </div>
        <div class="card-body">
          <h4 class="card-title">{{ p.title }}</h4>
          <p class="card-dest">📍 {{ p.destination }}</p>
          <div class="card-footer">
            <span class="price">¥{{ p.price }}</span>
            <span class="old-price" v-if="p.marketPrice > p.price">¥{{ p.marketPrice }}</span>
            <span class="score">⭐ {{ p.score }}</span>
            <span class="sales">已售 {{ p.sales }}</span>
          </div>
        </div>
      </div>
      <div v-if="!products.length && !loading" class="empty">😕 没有找到产品，换个关键词试试</div>
    </div>

    <div class="pagination" v-if="total > 0">
      <el-pagination v-model:current-page="page" :total="total" :page-size="12" layout="prev, pager, next" background />
    </div>
  </div>
</div>
</template>

<style scoped>
.list-page { background: #fdf8f3; min-height: 80vh; }
.content-wrap { max-width: 1200px; margin: 0 auto; padding: 24px 20px; }
.page-title { font-family: 'Fredoka',sans-serif; font-size: 26px; margin-bottom: 20px; color: #2d3436; }

/* Filter */
.filter-bar { padding: 16px 20px; margin-bottom: 24px; }
.filter-row { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; flex-wrap: wrap; }
.filter-row:last-child { margin-bottom: 0; }
.flabel { font-size: 13px; color: #636e72; min-width: 36px; font-weight: 600; }
.ftag { padding: 5px 14px; border-radius: 20px; border: 1.5px solid #e0d5cc; background: transparent; color: #636e72; font-size: 13px; cursor: pointer; transition: all .2s; font-family: inherit; }
.ftag:hover { border-color: #FF6B35; color: #FF6B35; }
.ftag.on { background: #FF6B35; color: #fff; border-color: #FF6B35; }

/* Product Grid */
.product-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 20px; }
.product-card { cursor: pointer; overflow: hidden; border-radius: 14px; background: rgba(255,255,255,.72); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,.4); transition: all .35s ease; }
.product-card:hover { transform: translateY(-5px); box-shadow: 0 14px 40px rgba(0,0,0,.1); }
.card-img-wrap { position: relative; height: 180px; overflow: hidden; }
.card-img { width: 100%; height: 100%; object-fit: cover; transition: transform .5s ease; }
.product-card:hover .card-img { transform: scale(1.06); }
.card-days { position: absolute; bottom: 10px; left: 10px; background: rgba(0,0,0,.55); color: #fff; padding: 2px 10px; border-radius: 12px; font-size: 12px; backdrop-filter: blur(4px); }
.card-body { padding: 14px; }
.card-title { font-size: 15px; font-weight: 600; margin-bottom: 4px; color: #2d3436; overflow:hidden;text-overflow:ellipsis;white-space:nowrap; }
.card-dest { font-size: 12px; color: #a0a8ac; margin-bottom: 8px; }
.card-footer { display: flex; align-items: baseline; gap: 6px; flex-wrap: wrap; }
.price { color: #f5576c; font-size: 18px; font-weight: 700; }
.old-price { color: #c0c4cc; font-size: 12px; text-decoration:line-through; }
.score { color: #e6a23c; font-size: 12px; margin-left: auto; }
.sales { color: #a0a8ac; font-size: 11px; }

.pagination { display: flex; justify-content: center; margin-top: 32px; }
.empty { text-align: center; padding: 60px; color: #a0a8ac; font-size: 16px; }

@media (max-width: 1024px) { .product-grid { grid-template-columns: repeat(2,1fr); } }
@media (max-width: 640px) { .product-grid { grid-template-columns: 1fr; } }
</style>
