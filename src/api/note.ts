import { get, post } from './request'

export function getNoteList(page = 1, size = 10) {
  return get('/api/note/list', { page, size })
}

export function getNoteDetail(id: number) {
  return get('/api/note/detail/' + id)
}

export function publishNote(data: { title: string; content?: string; images?: string; productId?: number }) {
  return post('/api/note/publish', data)
}

export function getMyNotes(page = 1, size = 10) {
  return get('/api/note/mine', { page, size })
}
