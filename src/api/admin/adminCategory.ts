import { get, post, del } from '../request'

export function getCategoryList(parentId?: number) {
  return get('/api/admin/category/list', parentId !== undefined ? { parentId } : undefined)
}

export function saveCategory(data: any) {
  return post('/api/admin/category/save', data)
}

export function deleteCategory(id: number) {
  return del('/api/admin/category/delete/' + id)
}
