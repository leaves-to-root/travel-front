import { get } from './request'

export function getHomeData() {
  return get('/api/home/data')
}
