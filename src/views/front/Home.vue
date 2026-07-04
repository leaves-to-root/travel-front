<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getHomeData } from '@/api/home'
import { searchKeyword } from '@/stores/search'

interface Banner { id: number; image: string; link: string; title: string }
interface Product { id: number; title: string; subtitle: string; cover: string; price: number; marketPrice: number; score: number; sales: number }

const router = useRouter()
const banners = ref<Banner[]>([])
const hotProducts = ref<Product[]>([])
const specialProducts = ref<Product[]>([])
const loading = ref(true)

onMounted(async () => {
  try {
    const data: any = await getHomeData()
    banners.value = data.banners || []
    hotProducts.value = data.hotProducts || []
    specialProducts.value = data.specialProducts || []
  } catch { /* ignore */ } finally { loading.value = false }
})

function goProduct(id: number) { router.push('/product/' + id) }
function goSearch() {
  const keyword = searchKeyword.value.trim()
  if (keyword) {
    router.push({ path: '/product', query: { keyword } })
  }
}
</script>

<template>
<div class="home-page">
  <!-- ===== Aurora Hero ===== -->
  <section class="hero">
    <div class="hero-bg"></div>
    <div class="hero-content">
      <h1 class="hero-title">
        <span class="gradient-text">探索世界</span><br/>遇见最美的风景
      </h1>
      <p class="hero-desc">发现最适合你的旅行线路，开启一段难忘的旅程</p>
      <div class="hero-stats">
        <div class="stat-item"><span class="stat-num">100+</span><span class="stat-label">热门目的地</span></div>
        <div class="stat-item"><span class="stat-num">5000+</span><span class="stat-label">满意客户</span></div>
        <div class="stat-item"><span class="stat-num">98%</span><span class="stat-label">好评率</span></div>
      </div>
    </div>
    <div class="hero-float float-1">🏝</div>
    <div class="hero-float float-2">✈</div>
    <div class="hero-float float-3">🌍</div>
  </section>

  <div class="content-wrap">
    <!-- ===== 轮播图 ===== -->
    <section class="section" v-if="banners.length">
      <el-carousel height="380px" class="banner-carousel" indicator-position="outside">
        <el-carousel-item v-for="b in banners" :key="b.id">
          <div class="banner-slide" @click="goProduct(Number(b.link?.split('/').pop()) || 1)">
            <img :src="b.image" :alt="b.title" class="banner-img" />
            <div class="banner-overlay">
              <h3>{{ b.title }}</h3>
              <el-button round class="banner-btn">立即查看 →</el-button>
            </div>
          </div>
        </el-carousel-item>
      </el-carousel>
    </section>

    <!-- ===== 热门推荐 ===== -->
    <section class="section">
      <div class="section-header">
        <h2 class="section-title">🔥 热门推荐</h2>
        <router-link to="/product" class="section-more">查看全部 →</router-link>
      </div>
      <div class="product-grid" v-if="hotProducts.length">
        <div class="product-card glass-card" v-for="p in hotProducts" :key="p.id" @click="goProduct(p.id)">
          <div class="card-img-wrap">
            <img :src="p.cover" class="card-img" loading="lazy" />
            <div class="card-badge" v-if="p.marketPrice > p.price">特惠</div>
          </div>
          <div class="card-body">
            <h4 class="card-title">{{ p.title }}</h4>
            <p class="card-sub">{{ p.subtitle }}</p>
            <div class="card-footer">
              <div class="price-group">
                <span class="price">¥{{ p.price }}</span>
                <span class="old-price" v-if="p.marketPrice > p.price">¥{{ p.marketPrice }}</span>
              </div>
              <span class="rating">⭐ {{ p.score }}</span>
            </div>
          </div>
        </div>
      </div>
      <div v-else-if="!loading" class="empty-state">
        <span class="empty-icon">🗺</span>
        <p>暂无推荐产品</p>
      </div>
    </section>

    <!-- ===== 特价优惠 ===== -->
    <section class="section">
      <div class="section-header">
        <h2 class="section-title">💰 限时特惠</h2>
      </div>
      <div class="product-grid" v-if="specialProducts.length">
        <div class="product-card glass-card special-card" v-for="p in specialProducts" :key="p.id" @click="goProduct(p.id)">
          <div class="card-img-wrap">
            <img :src="p.cover" class="card-img" loading="lazy" />
            <div class="sale-tag">SALE</div>
          </div>
          <div class="card-body">
            <h4 class="card-title">{{ p.title }}</h4>
            <div class="card-footer">
              <div class="price-group">
                <span class="price special-price">¥{{ p.price }}</span>
                <span class="old-price">¥{{ p.marketPrice }}</span>
              </div>
              <span class="discount">省 ¥{{ (p.marketPrice - p.price).toFixed(0) }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== CTA Banner ===== -->
    <section class="cta-section aurora-coral-mint">
      <div class="cta-content">
        <h2>准备好开始你的旅程了吗？</h2>
        <p>注册即可领取新人专属优惠券，开启精彩旅行</p>
        <el-button round size="large" class="cta-btn" @click="router.push('/register')">立即注册 →</el-button>
      </div>
    </section>
  </div>
</div>
</template>

<style scoped>
/* ===== Hero ===== */
.hero {
  position: relative;
  padding: 80px 24px 60px;
  text-align: center;
  overflow: hidden;
}
.hero-bg {
  position: absolute;
  inset: -50%;
  background:
    radial-gradient(ellipse at 25% 20%, rgba(102,126,234,.18) 0%, transparent 50%),
    radial-gradient(ellipse at 75% 70%, rgba(240,147,251,.14) 0%, transparent 50%),
    radial-gradient(ellipse at 50% 50%, rgba(255,107,53,.06) 0%, transparent 55%);
  animation: bg-drift 14s ease-in-out infinite alternate;
  pointer-events: none;
  z-index: 0;
}
@keyframes bg-drift { 0% { transform: translate(-2%,-2%) rotate(-1deg); } 100% { transform: translate(3%,3%) rotate(1deg); } }
.hero-content { position: relative; z-index: 1; max-width: 700px; margin: 0 auto; }
.hero-title { font-size: 48px; font-weight: 700; line-height: 1.2; margin-bottom: 16px; color: #2d3436; }
.gradient-text { background: linear-gradient(135deg,#667eea,#f5576c,#FF6B35); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
.hero-desc { font-size: 18px; color: #636e72; margin-bottom: 32px; }
.hero-search { max-width: 480px; margin: 0 auto 40px; }
.hero-inp :deep(.el-input__wrapper) { border-radius: 32px !important; padding: 6px 20px !important; box-shadow: 0 4px 24px rgba(0,0,0,.08) !important; border: none !important; }
.hero-stats { display: flex; justify-content: center; gap: 48px; }
.stat-item { display: flex; flex-direction: column; }
.stat-num { font-family: 'Fredoka',sans-serif; font-size: 28px; font-weight: 700; color: #FF6B35; }
.stat-label { font-size: 13px; color: #a0a8ac; }
.hero-float { position: absolute; font-size: 40px; opacity: .12; z-index: 0; pointer-events: none; animation: float 5s ease-in-out infinite; }
.float-1 { top: 15%; left: 8%; animation-delay: 0s; }
.float-2 { top: 25%; right: 10%; animation-delay: 1.5s; }
.float-3 { bottom: 20%; left: 50%; animation-delay: 3s; }
@keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-16px); } }

/* ===== Content ===== */
.content-wrap { max-width: 1200px; margin: 0 auto; padding: 0 20px 40px; }
.section { margin-top: 40px; }
.section-header { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 20px; }
.section-title { font-size: 24px; font-weight: 700; color: #2d3436; }
.section-more { font-size: 14px; color: #FF6B35; font-weight: 500; transition: all .2s; }
.section-more:hover { transform: translateX(4px); }

/* ===== Banner ===== */
.banner-slide { position: relative; cursor: pointer; border-radius: 16px; overflow: hidden; }
.banner-img { width: 100%; height: 100%; object-fit: cover; }
.banner-overlay { position: absolute; inset: 0; background: linear-gradient(0deg,rgba(0,0,0,.55) 0%,transparent 50%); display: flex; flex-direction: column; justify-content: flex-end; padding: 32px; color: #fff; }
.banner-overlay h3 { font-size: 22px; font-weight: 600; margin-bottom: 8px; }
.banner-btn { background: rgba(255,255,255,.25) !important; backdrop-filter: blur(8px); border: 1px solid rgba(255,255,255,.3) !important; color: #fff !important; }

/* ===== Product Cards (Glass) ===== */
.product-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
.product-card { cursor: pointer; border-radius: 16px; overflow: hidden; position: relative; background: rgba(255,255,255,.75); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,.4); transition: all .35s ease; }
.product-card:hover { transform: translateY(-6px); box-shadow: 0 16px 48px rgba(0,0,0,.1); }
.card-img-wrap { position: relative; overflow: hidden; height: 200px; }
.card-img { width: 100%; height: 100%; object-fit: cover; transition: transform .5s ease; }
.product-card:hover .card-img { transform: scale(1.06); }
.card-badge { position: absolute; top: 12px; right: 12px; background: linear-gradient(135deg,#f5576c,#FF6B35); color: #fff; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; }
.sale-tag { position: absolute; top: 12px; left: 12px; background: #f5576c; color: #fff; padding: 4px 12px; border-radius: 4px; font-size: 12px; font-weight: 700; letter-spacing: .05em; animation: pulse-tag 2s ease-in-out infinite; }
@keyframes pulse-tag { 0%,100% { opacity: 1; } 50% { opacity: .75; } }
.card-body { padding: 16px; }
.card-title { font-size: 16px; font-weight: 600; color: #2d3436; margin-bottom: 4px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.card-sub { font-size: 13px; color: #a0a8ac; margin-bottom: 10px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.card-footer { display: flex; justify-content: space-between; align-items: center; }
.price-group { display: flex; align-items: baseline; gap: 8px; }
.price { color: #f5576c; font-size: 20px; font-weight: 700; }
.special-price { color: #FF6B35; }
.old-price { color: #c0c4cc; font-size: 13px; text-decoration: line-through; }
.rating { color: #e6a23c; font-size: 13px; font-weight: 500; }
.discount { color: #f5576c; font-size: 13px; font-weight: 600; }
.special-card { border-left: 3px solid #FF6B35; }

/* ===== CTA Section ===== */
.cta-section { margin-top: 48px; padding: 60px 24px; border-radius: 24px; text-align: center; }
.cta-content h2 { font-size: 28px; color: #fff; margin-bottom: 12px; }
.cta-content p { font-size: 16px; color: rgba(255,255,255,.8); margin-bottom: 24px; }
.cta-btn { background: #fff !important; color: #FF6B35 !important; font-weight: 600 !important; padding: 12px 32px !important; box-shadow: 0 8px 30px rgba(0,0,0,.15) !important; }
.cta-btn:hover { transform: translateY(-2px); box-shadow: 0 12px 36px rgba(0,0,0,.2) !important; }

/* ===== Empty State ===== */
.empty-state { text-align: center; padding: 60px; }
.empty-icon { font-size: 48px; opacity: .3; }

@media (max-width: 768px) {
  .hero-title { font-size: 32px; }
  .hero-stats { gap: 24px; }
  .product-grid { grid-template-columns: 1fr; }
  .banner-carousel :deep(.el-carousel__container) { height: 220px !important; }
}
</style>
