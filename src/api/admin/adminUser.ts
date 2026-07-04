import { get, put } from '../request'

export function getUserList(params: { page?: number; size?: number; keyword?: string }) {
  return get('/api/admin/user/list', params)
}

export function toggleUserStatus(userId: number, status: number) {
  return put('/api/admin/user/status/' + userId, { status })
}
