import { post, get } from '../request'

export function sendMessage(data: { userId: number | number[]; title: string; content: string }) {
  return post('/api/admin/message/send', data)
}

export function sendMessageToAll(data: { title: string; content: string }) {
  return post('/api/admin/message/send-all', data)
}

export function getMessageList(page = 1, size = 20) {
  return get('/api/admin/message/list', { page, size })
}
