import { get, post } from './request'

export function addHistory(productId: number) {
  return post('/api/history/add', { productId })
}

export function getHistoryList() {
  return get('/api/history/list')
}
