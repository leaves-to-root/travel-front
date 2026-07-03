import { get, post, del } from '../request'

export function getCouponList(params: { page?: number; size?: number }) {
  return get('/api/admin/coupon/list', params)
}

export function saveCoupon(data: any) {
  return post('/api/admin/coupon/save', data)
}

export function deleteCoupon(id: number) {
  return del('/api/admin/coupon/delete/' + id)
}
