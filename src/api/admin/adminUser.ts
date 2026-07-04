import { get, put, post } from '../request'

export function getUserList(params: { page?: number; size?: number; keyword?: string }) {
  return get('/api/admin/user/list', params)
}

export function toggleUserStatus(userId: number, status: number) {
  return put('/api/admin/user/status/' + userId, { status })
}

export function distributeCoupon(userId: number, couponId: number) {
  return post('/api/admin/user/coupon/' + userId, { couponId })
}
