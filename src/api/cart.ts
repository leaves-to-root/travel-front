import { get, post, del } from './request'

export function getCartList() {
  return get('/api/cart/list')
}

export function addCart(data: { productId: number; travelDate?: string; quantity?: number }) {
  return post('/api/cart/add', data)
}

export function updateCart(cartId: number, quantity: number) {
  return post('/api/cart/update', { cartId, quantity })
}

export function removeCart(cartId: number) {
  return del('/api/cart/remove/' + cartId)
}
