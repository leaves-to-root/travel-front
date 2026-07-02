import { get, post, del } from '../request'

export function getBannerList() {
  return get('/api/admin/banner/list')
}

export function saveBanner(data: any) {
  return post('/api/admin/banner/save', data)
}

export function deleteBanner(id: number) {
  return del('/api/admin/banner/delete/' + id)
}
