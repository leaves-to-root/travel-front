import { get, put, del } from '../request'

export function getNoteList(params: { page?: number; size?: number; status?: number }) {
  return get('/api/admin/note/list', params)
}

export function updateNoteStatus(id: number, status: number) {
  return put('/api/admin/note/status/' + id, { status })
}

export function deleteNote(id: number) {
  return del('/api/admin/note/delete/' + id)
}
