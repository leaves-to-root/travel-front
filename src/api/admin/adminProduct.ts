import { get, post, put, del } from '../request'

export function getProductList(params: { page?: number; size?: number; keyword?: string }) {
  return get('/api/admin/product/list', params)
}

export function saveProduct(data: any) {
  return post('/api/admin/product/save', data)
}

export function getProductDetail(id: number) {
  return get('/api/admin/product/detail/' + id)
}

export function toggleProductStatus(id: number, status: number) {
  return put('/api/admin/product/status/' + id, { status })
}

export function deleteProduct(id: number) {
  return del('/api/admin/product/delete/' + id)
}
