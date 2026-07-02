import { post, get } from './request'

export function toggleFavorite(productId: number) {
  return post('/api/favorite/toggle', { productId })
}

export function getFavoriteStatus(productId: number) {
  return get('/api/favorite/status/' + productId)
}

export function getFavoriteList() {
  return get('/api/favorite/list')
}
