import request from './request'

export function uploadFile(file: File) {
  const formData = new FormData()
  formData.append('file', file)
  return request.post('/api/common/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }).then((res) => res.data.data ?? res.data)
}
