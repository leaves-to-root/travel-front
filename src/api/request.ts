import axios from 'axios'
import type { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { ElMessage } from 'element-plus'
import { getToken, getAdminToken, removeToken, removeAdminToken } from '@/utils/auth'

const request: AxiosInstance = axios.create({
  baseURL: '/',
  timeout: 15000,
})

// 请求拦截器：自动注入 token
request.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 判断是否是 admin 路径
    const isAdmin = config.url?.startsWith('/api/admin')
    const token = isAdmin ? getAdminToken() : getToken()
    if (token) {
      config.headers.Authorization = token
    }
    return config
  },
  (error) => Promise.reject(error),
)

// 响应拦截器：统一处理 Result 格式
request.interceptors.response.use(
  (response: AxiosResponse) => {
    const res = response.data
    if (res.code === 200) {
      return response
    }
    // 未登录
    if (res.code === 401) {
      removeToken()
      removeAdminToken()
      window.location.href = response.config.url?.startsWith('/api/admin') ? '/admin/login' : '/login'
      return Promise.reject(new Error(res.msg || '未登录'))
    }
    ElMessage.error(res.msg || '请求失败')
    return Promise.reject(new Error(res.msg || '请求失败'))
  },
  (error) => {
    ElMessage.error(error.message || '网络错误')
    return Promise.reject(error)
  },
)

// 快捷方法，直接返回 data.data
export function get<T = any>(url: string, params?: any): Promise<T> {
  return request.get(url, { params }).then((res) => res.data.data ?? res.data)
}

export function post<T = any>(url: string, data?: any): Promise<T> {
  return request.post(url, data).then((res) => res.data.data ?? res.data)
}

export function put<T = any>(url: string, data?: any): Promise<T> {
  return request.put(url, data).then((res) => res.data.data ?? res.data)
}

export function del<T = any>(url: string, params?: any): Promise<T> {
  return request.delete(url, { params }).then((res) => res.data.data ?? res.data)
}

export default request
