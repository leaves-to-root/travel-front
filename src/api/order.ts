import { post, get } from './request'
import type { CreateOrderRequest } from './types'

export function createOrder(data: CreateOrderRequest) {
  return post('/api/order/create', data)
}

export function createBatchOrder(data: CreateOrderRequest[]) {
  return post('/api/order/createBatch', data)
}

export function payOrder(orderId: number) {
  return get('/api/order/pay/' + orderId)
}

export function getMyOrders(params: { page?: number; size?: number; status?: number }) {
  return get('/api/order/my', params)
}

export function getOrderDetail(orderId: number) {
  return get('/api/order/detail/' + orderId)
}

export function cancelOrder(orderId: number) {
  return post('/api/order/cancel/' + orderId)
}

export function refundOrder(orderId: number, reason?: string) {
  return post('/api/order/refund/' + orderId, { reason })
}
