import { get } from './request'

export function getCategoryTree() {
  return get('/api/category/tree')
}

export function getCategoryList() {
  return get('/api/category/list')
}
