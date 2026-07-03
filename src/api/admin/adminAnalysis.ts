import { get } from '../request'

export function getUserAnalysis() {
  return get('/api/admin/analysis/users')
}

export function getUserHistory(userId: number) {
  return get(`/api/admin/analysis/user/${userId}/history`)
}
