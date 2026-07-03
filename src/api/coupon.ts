import { get, post } from './request'

export function getCouponList() {
  return get('/api/coupon/list')
}

export function grabCoupon(couponId: number) {
  return post('/api/coupon/grab/' + couponId)
}

export function getMyCoupons() {
  return get('/api/coupon/mine')
}
