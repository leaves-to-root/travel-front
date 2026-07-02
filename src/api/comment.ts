import { get, post } from './request'

export function getProductComments(productId: number, page = 1, size = 10) {
  return get('/api/comment/product/' + productId, { page, size })
}

export function submitComment(data: { productId: number; orderId?: number; score: number; content?: string; images?: string }) {
  return post('/api/comment/submit', data)
}
