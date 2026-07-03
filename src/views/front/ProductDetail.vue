<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getProductDetail } from '@/api/product'
import { toggleFavorite, getFavoriteStatus } from '@/api/favorite'
import { getProductComments } from '@/api/comment'
import { addCart } from '@/api/cart'
import { addHistory } from '@/api/history'
import { getToken } from '@/utils/auth'
import { ElMessage } from 'element-plus'

const route = useRoute(); const router = useRouter()
const product = ref<any>({}); const schedules = ref<any[]>([]); const comments = ref<any[]>([])
const isFavorited = ref(false); const selectedTab = ref('detail'); const selectedSchedule = ref<any>(null)
const loading = ref(true)

const images = computed(() => { try { return JSON.parse(product.value.images || '[]') } catch { return [] } })
const tags = computed(() => (product.value.tags || '').split(',').filter(Boolean))

onMounted(async () => {
  const id = Number(route.params.id);
  try { const d:any = await getProductDetail(id); product.value=d.product||{}; schedules.value=(d.schedules||[]).filter((s:any)=>s.stock>0); if(schedules.value.length) selectedSchedule.value=schedules.value[0] }
  catch { ElMessage.error('产品不存在') }
  finally { loading.value=false }
  try { const r:any=await getProductComments(id); comments.value=r.records||[] } catch {}
  if(getToken()) { addHistory(id).catch(()=>{}); try{const r:any=await getFavoriteStatus(id);isFavorited.value=r.favorited}catch{} }
})

async function handleFavorite() {
  if(!getToken()){ElMessage.warning('请先登录');router.push('/login?redirect='+route.fullPath);return}
  await toggleFavorite(product.value.id); isFavorited.value=!isFavorited.value; ElMessage.success(isFavorited.value?'已收藏':'已取消')
}

async function handleAddCart() {
  if(!getToken()){ElMessage.warning('请先登录');router.push('/login?redirect='+route.fullPath);return}
  await addCart({productId:product.value.id,travelDate:selectedSchedule.value?.travelDate}); ElMessage.success('已加入购物车')
}

function goBuy() {
  if(!getToken()){ElMessage.warning('请先登录');router.push('/login?redirect='+route.fullPath);return}
  router.push({path:'/checkout',query:{productId:product.value.id}})
}
</script>

<template>
<div class="detail-page" v-loading="loading">
  <div class="content-wrap">
    <!-- Header -->
    <div class="detail-header glass-card">
      <el-row :gutter="24">
        <el-col :span="12">
          <el-carousel height="380px" v-if="images.length" class="img-carousel">
            <el-carousel-item v-for="(img,i) in images" :key="i"><img :src="img" class="detail-img" /></el-carousel-item>
          </el-carousel>
          <img v-else :src="product.cover" class="detail-img static" />
        </el-col>
        <el-col :span="12" class="info-col">
          <div class="tags" v-if="tags.length"><el-tag v-for="t in tags" :key="t" size="small" effect="plain">{{ t }}</el-tag></div>
          <h1 class="product-title">{{ product.title }}</h1>
          <p class="product-sub">{{ product.subtitle }}</p>
          <div class="price-area">
            <span class="price">¥{{ product.price }}</span>
            <span class="old-price" v-if="product.marketPrice>product.price">¥{{ product.marketPrice }}</span>
            <span class="discount-badge" v-if="product.marketPrice>product.price">省 ¥{{ (product.marketPrice-product.price).toFixed(0) }}</span>
          </div>
          <div class="meta-row">
            <span>📍 {{ product.destination }}</span>
            <span>📅 {{ product.days }}天</span>
            <span>⭐ {{ product.score }}</span>
            <span>🛒 {{ product.sales }}人已购</span>
          </div>
          <div class="schedule" v-if="schedules.length">
            <p class="s-label">选择出行日期：</p>
            <el-radio-group v-model="selectedSchedule" class="s-group">
              <el-radio-button v-for="s in schedules" :key="s.id" :value="s" :disabled="s.stock<=0">
                {{ s.travelDate }}<br/><small>¥{{ s.price }}</small>
              </el-radio-button>
            </el-radio-group>
          </div>
          <div class="actions">
            <el-button type="primary" size="large" class="btn-buy" @click="goBuy">立即预订</el-button>
            <el-button size="large" class="btn-cart" @click="handleAddCart">加入购物车</el-button>
            <el-button :class="['btn-fav',{fav:isFavorited}]" @click="handleFavorite">{{ isFavorited?'❤ 已收藏':'🤍 收藏' }}</el-button>
          </div>
        </el-col>
      </el-row>
    </div>

    <!-- Tabs -->
    <div class="detail-tabs glass-card">
      <el-tabs v-model="selectedTab">
        <el-tab-pane label="📋 行程详情" name="detail"><div v-html="product.detail||'暂无详情'" class="rich-text" /></el-tab-pane>
        <el-tab-pane label="💰 费用说明" name="cost"><div v-html="product.costExplain||'暂无说明'" class="rich-text" /></el-tab-pane>
        <el-tab-pane :label="'💬 用户评价 ('+comments.length+')'" name="comment">
          <div v-if="!comments.length" class="empty">暂无评价</div>
          <div v-for="c in comments" :key="c.id" class="comment-item">
            <div class="c-header"><span>用户{{ c.userId }}</span><span class="c-score">{{'⭐'.repeat(c.score)}}</span><span class="c-time">{{c.createTime}}</span></div>
            <p class="c-content">{{ c.content }}</p>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</div>
</template>

<style scoped>
.detail-page { background:#fdf8f3; min-height:80vh; }
.content-wrap { max-width:1100px; margin:0 auto; padding:24px 20px; }
.detail-header { padding: 28px; margin-bottom: 20px; }
.img-carousel :deep(.el-carousel__container) { border-radius: 12px; }
.detail-img { width:100%;height:100%;object-fit:cover;border-radius:12px; }
.detail-img.static { height:380px; }
.info-col { padding-left: 12px; }
.tags { margin-bottom: 10px; display: flex; gap: 6px; flex-wrap: wrap; }
.product-title { font-size: 26px; font-weight: 700; color: #2d3436; margin: 8px 0; }
.product-sub { color: #636e72; font-size: 15px; margin-bottom: 16px; }
.price-area { display: flex; align-items: baseline; gap: 10px; margin-bottom: 14px; }
.price { color: #f5576c; font-size: 30px; font-weight: 700; }
.old-price { color: #c0c4cc; font-size: 16px; text-decoration: line-through; }
.discount-badge { background: linear-gradient(135deg,#f5576c,#FF6B35); color:#fff; padding:2px 10px; border-radius:12px; font-size:12px; font-weight:600; }
.meta-row { display: flex; gap: 14px; flex-wrap: wrap; color: #636e72; font-size: 14px; margin-bottom: 16px; }
.schedule { margin: 16px 0; } .s-label { font-size: 14px; color: #636e72; margin-bottom: 8px; }
.actions { margin-top: 20px; display: flex; gap: 12px; }
.btn-buy { background: linear-gradient(135deg,#FF6B35,#f5576c)!important; border:none!important; border-radius:12px!important; font-weight:600!important; box-shadow:0 6px 24px rgba(255,107,53,.3)!important; }
.btn-buy:hover { transform:translateY(-2px);box-shadow:0 8px 30px rgba(255,107,53,.4)!important; }
.btn-cart { border:2px solid #FF6B35!important; color:#FF6B35!important; border-radius:12px!important; font-weight:600!important; }
.btn-fav { border-radius:12px!important; }
.btn-fav.fav { color:#f5576c!important; border-color:#f5576c!important; }

.detail-tabs { padding: 24px; margin-bottom: 20px; }
.rich-text { min-height:200px; line-height:1.9; font-size:15px; }
.rich-text :deep(img) { max-width:100%; border-radius:8px; }
.comment-item { padding:14px 0; border-bottom:1px solid #f0e6e0; }
.c-header { display:flex; gap:14px; font-size:13px; color:#a0a8ac; }
.c-score { color:#e6a23c; } .c-content { margin:6px 0 0; font-size:14px; }
.empty { text-align:center;padding:40px;color:#a0a8ac; }
</style>
