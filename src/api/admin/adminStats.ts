import { get } from '../request'

export function getDashboard() {
  return get('/api/admin/stats/dashboard')
}
