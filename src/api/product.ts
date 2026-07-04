import { post, get } from './request'
import type { ProductQueryRequest } from './types'

export function getProductList(data: ProductQueryRequest) {
  return post('/api/product/list', data)
}

export function getProductDetail(id: number) {
  return get('/api/product/detail/' + id)
}

export function getHotProducts() {
  return get('/api/product/hot')
}
