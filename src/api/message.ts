import { get, put } from './request'

export function getMessages(page = 1, size = 10) {
  return get('/api/message/list', { page, size })
}

export function getUnreadCount() {
  return get('/api/message/unread-count')
}

export function markRead(messageId: number) {
  return put('/api/message/read/' + messageId)
}

export function markAllRead() {
  return put('/api/message/read-all')
}
