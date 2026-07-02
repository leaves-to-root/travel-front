import { post, get } from './request'
import type { LoginRequest, RegisterRequest } from './types'

export function login(data: LoginRequest) {
  return post('/api/auth/login', data)
}

export function register(data: RegisterRequest) {
  return post('/api/auth/register', data)
}

export function logout() {
  return post('/api/auth/logout')
}

export function getCurrentUser() {
  return get('/api/auth/current')
}
