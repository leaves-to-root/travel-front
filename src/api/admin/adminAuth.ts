import { post, get } from '../request'

export function login(data: { username: string; password: string }) {
  return post('/api/admin/auth/login', data)
}

export function getCurrentAdmin() {
  return get('/api/admin/auth/current')
}

export function logout() {
  return post('/api/admin/auth/logout')
}
