import { get, post, del } from '../request'

export function getCategoryList() {
  return get('/api/admin/category/list')
}

export function saveCategory(data: any) {
  return post('/api/admin/category/save', data)
}

export function deleteCategory(id: number) {
  return del('/api/admin/category/delete/' + id)
}
