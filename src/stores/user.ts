import { ref } from 'vue'
import { defineStore } from 'pinia'
import { setToken, removeToken, getToken, setAdminToken, removeAdminToken, getAdminToken } from '@/utils/auth'
import { login as userLogin, getCurrentUser } from '@/api/auth'
import { login as adminLogin, getCurrentAdmin } from '@/api/admin/adminAuth'
import type { User } from '@/api/types'

/** 用户端 Auth Store */
export const useUserStore = defineStore('user', () => {
  const token = ref(getToken())
  const userInfo = ref<User | null>(null)

  async function login(data: { username?: string; phone?: string; password: string }) {
    const res: any = await userLogin(data)
    token.value = res.token
    setToken(res.token)
    // 获取用户详情
    try {
      userInfo.value = await getCurrentUser()
    } catch {
      // ignore
    }
    return res
  }

  function setUser(user: User) {
    userInfo.value = user
  }

  function logout() {
    token.value = null
    userInfo.value = null
    removeToken()
  }

  async function fetchUser() {
    try {
      userInfo.value = await getCurrentUser()
    } catch {
      logout()
    }
  }

  return { token, userInfo, login, setUser, logout, fetchUser }
})

/** 后台 Admin Auth Store */
export const useAdminStore = defineStore('admin', () => {
  const token = ref(getAdminToken())
  const adminInfo = ref<any>(null)

  async function login(data: { username: string; password: string }) {
    const res: any = await adminLogin(data)
    token.value = res.token
    setAdminToken(res.token)
    try {
      adminInfo.value = await getCurrentAdmin()
    } catch { /* ignore */ }
    return res
  }

  function logout() {
    token.value = null
    adminInfo.value = null
    removeAdminToken()
  }

  async function fetchAdmin() {
    try {
      adminInfo.value = await getCurrentAdmin()
    } catch {
      logout()
    }
  }

  return { token, adminInfo, login, logout, fetchAdmin }
})
