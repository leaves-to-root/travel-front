import { get } from '../request'

export function getLogList(params: { page?: number; size?: number }) {
  return get('/api/admin/log/list', params)
}
