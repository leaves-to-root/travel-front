import { get, put } from './request'

export function getUserProfile() {
  return get('/api/user/profile')
}

export function updateProfile(data: Record<string, any>) {
  return put('/api/user/profile', data)
}

export function changePassword(data: { oldPassword: string; newPassword: string }) {
  return put('/api/user/password', data)
}
