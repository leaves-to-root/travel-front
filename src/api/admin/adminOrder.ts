import { get, post } from '../request'

export function getOrderList(params: { page?: number; size?: number; status?: number; keyword?: string }) {
  return get('/api/admin/order/list', params)
}

export function getOrderDetail(id: number) {
  return get('/api/admin/order/detail/' + id)
}

export function confirmOrder(id: number) {
  return post('/api/admin/order/confirm/' + id)
}

export function approveRefund(id: number) {
  return post('/api/admin/order/refund/' + id)
}
