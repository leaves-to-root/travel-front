// 通用类型定义

export interface Result<T = any> {
  code: number
  msg: string
  data: T
}

export interface PageResult<T = any> {
  current: number
  size: number
  total: number
  pages: number
  records: T[]
}

export interface LoginRequest {
  loginType?: string   // 'username' | 'email'，默认 username
  username?: string    // 用户名登录
  password?: string    // 用户名登录
  captchaKey?: string  // 图形验证码 key
  captchaCode?: string // 图形验证码
  email?: string       // 邮箱登录
  emailCode?: string   // 邮箱验证码
}

export interface RegisterRequest {
  username?: string
  email: string
  emailCode: string
  password: string
  nickname?: string
}

export interface ProductQueryRequest {
  keyword?: string
  categoryId?: number
  minPrice?: number
  maxPrice?: number
  sortBy?: string
  sortDir?: string
  page?: number
  size?: number
}

export interface CreateOrderRequest {
  productId: number
  scheduleId?: number
  travelDate?: string
  contactName?: string
  contactPhone?: string
  personCount?: number
  remark?: string
  couponId?: number
}

export interface User {
  id: number
  username: string
  phone: string
  email: string
  nickname: string
  avatar: string
  gender: number
  status: number
  points: number
  memberLevel: number
}

export interface Product {
  id: number
  categoryId: number
  title: string
  subtitle: string
  destination: string
  departure: string
  price: number
  marketPrice: number
  stock: number
  cover: string
  images: string
  detail: string
  costExplain: string
  days: number
  tags: string
  score: number
  sales: number
  status: number
  isHot: number
  isSpecial: number
}

export interface Order {
  id: number
  orderNo: string
  userId: number
  totalAmount: number
  payAmount: number
  status: number
  payType: string
  payTime: string
  travelDate: string
  contactName: string
  contactPhone: string
  personCount: number
  remark: string
  couponAmount: number
  refundReason: string
  createTime: string
}

export interface TravelNote {
  id: number
  userId: number
  title: string
  content: string
  images: string
  video: string
  productId: number
  likeCount: number
  viewCount: number
  status: number
  createTime: string
}

export interface Coupon {
  id: number
  name: string
  type: number
  faceValue: number
  minAmount: number
  totalCount: number
  remainCount: number
  startTime: string
  endTime: string
  validDays: number
  status: number
}

export interface Comment {
  id: number
  userId: number
  productId: number
  orderId: number
  score: number
  content: string
  images: string
  createTime: string
}

export interface Category {
  id: number
  parentId: number
  name: string
  icon: string
  sort: number
  status: number
}

export interface Banner {
  id: number
  image: string
  link: string
  title: string
  sort: number
  status: number
}

export interface Message {
  id: number
  userId: number
  title: string
  content: string
  type: number
  isRead: number
  createTime: string
}
