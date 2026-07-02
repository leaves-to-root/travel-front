import { createRouter, createWebHistory } from 'vue-router'
import { getToken, getAdminToken } from '@/utils/auth'
import FrontLayout from '@/layouts/FrontLayout.vue'
import AdminLayout from '@/layouts/AdminLayout.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // =========== 前台路由（游客和用户） ===========
    {
      path: '/',
      component: FrontLayout,
      children: [
        { path: '', name: 'Home', component: () => import('@/views/front/Home.vue') },
        { path: 'product', name: 'ProductList', component: () => import('@/views/front/ProductList.vue') },
        { path: 'product/:id', name: 'ProductDetail', component: () => import('@/views/front/ProductDetail.vue') },
        { path: 'cart', name: 'Cart', component: () => import('@/views/front/Cart.vue'), meta: { requiresAuth: true } },
        { path: 'checkout', name: 'Checkout', component: () => import('@/views/front/Checkout.vue'), meta: { requiresAuth: true } },
        // 个人中心
        { path: 'center/order', name: 'OrderList', component: () => import('@/views/front/order/OrderList.vue'), meta: { requiresAuth: true } },
        { path: 'center/order/:id', name: 'OrderDetail', component: () => import('@/views/front/order/OrderDetail.vue'), meta: { requiresAuth: true } },
        { path: 'center/profile', name: 'Profile', component: () => import('@/views/front/center/Profile.vue'), meta: { requiresAuth: true } },
        { path: 'center/favorites', name: 'MyFavorites', component: () => import('@/views/front/center/MyFavorites.vue'), meta: { requiresAuth: true } },
        { path: 'center/notes', name: 'MyTravelNotes', component: () => import('@/views/front/center/MyTravelNotes.vue'), meta: { requiresAuth: true } },
        { path: 'center/history', name: 'History', component: () => import('@/views/front/center/History.vue'), meta: { requiresAuth: true } },
        { path: 'center/messages', name: 'Messages', component: () => import('@/views/front/center/Messages.vue'), meta: { requiresAuth: true } },
        // 社区
        { path: 'notes', name: 'TravelNoteList', component: () => import('@/views/front/community/TravelNoteList.vue') },
        { path: 'notes/:id', name: 'TravelNoteDetail', component: () => import('@/views/front/community/TravelNoteDetail.vue') },
        { path: 'notes/publish', name: 'PublishNote', component: () => import('@/views/front/community/PublishNote.vue'), meta: { requiresAuth: true } },
      ],
    },
    // 独立登录页面
    { path: '/login', name: 'Login', component: () => import('@/views/front/Login.vue') },
    { path: '/register', name: 'Register', component: () => import('@/views/front/Register.vue') },

    // =========== 管理后台 ===========
    { path: '/admin/login', name: 'AdminLogin', component: () => import('@/views/admin/Login.vue') },
    {
      path: '/admin',
      component: AdminLayout,
      redirect: '/admin/dashboard',
      meta: { requiresAdmin: true },
      children: [
        { path: 'dashboard', name: 'Dashboard', component: () => import('@/views/admin/Dashboard.vue') },
        { path: 'user', name: 'AdminUser', component: () => import('@/views/admin/UserManage.vue') },
        { path: 'product', name: 'AdminProduct', component: () => import('@/views/admin/ProductManage.vue') },
        { path: 'category', name: 'AdminCategory', component: () => import('@/views/admin/CategoryManage.vue') },
        { path: 'banner', name: 'AdminBanner', component: () => import('@/views/admin/BannerManage.vue') },
        { path: 'order', name: 'AdminOrder', component: () => import('@/views/admin/OrderManage.vue') },
        { path: 'coupon', name: 'AdminCoupon', component: () => import('@/views/admin/CouponManage.vue') },
        { path: 'note', name: 'AdminNote', component: () => import('@/views/admin/NoteManage.vue') },
        { path: 'log', name: 'AdminLog', component: () => import('@/views/admin/OperationLog.vue') },
      ],
    },
  ],
})

// 全局路由守卫
router.beforeEach((to, _from, next) => {
  // 前台需要登录的页面
  if (to.meta.requiresAuth) {
    if (!getToken()) {
      return next({ path: '/login', query: { redirect: to.fullPath } })
    }
  }
  // 后台需要管理员登录
  if (to.meta.requiresAdmin) {
    if (!getAdminToken()) {
      return next('/admin/login')
    }
  }
  next()
})

export default router
