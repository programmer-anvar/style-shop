import type { CartItem } from '@/types'
import { createSlice } from '@reduxjs/toolkit'

interface CartState {
  items: CartItem[]
  subtotal: number
  shippingPrice: number
  total: number
}

const calculateTotals = (items: CartItem[]) => {
  const subtotal = items.reduce((acc, item) => {
    const price =
      item.product.discountPrice > 0
        ? item.product.discountPrice
        : item.product.price
    return acc + price * item.quantity
  }, 0)

  const shippingPrice = subtotal >= 100 ? 0 : 10
  const total = subtotal + shippingPrice

  return { subtotal, shippingPrice, total }
}

const initialState: CartState = {
  items: localStorage.getItem('cart')
    ? JSON.parse(localStorage.getItem('cart') as string)
    : [],
  subtotal: 0,
  shippingPrice: 0,
  total: 0,
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { product, quantity, size, color } = action.payload

      const existingItem = state.items.find(
        (item) =>
          item.product._id === product._id &&
          item.size === size &&
          item.color === color
      )

      if (existingItem) {
        existingItem.quantity += quantity
      } else {
        state.items.push({ product, quantity, size, color })
      }

      const totals = calculateTotals(state.items)
      state.subtotal = totals.subtotal
      state.shippingPrice = totals.shippingPrice
      state.total = totals.total

      localStorage.setItem('cart', JSON.stringify(state.items))
    },

    removeFromCart: (state, action) => {
      state.items = state.items.filter(
        (item) =>
          !(
            item.product._id === action.payload.productId &&
            item.size === action.payload.size &&
            item.color === action.payload.color
          )
      )

      const totals = calculateTotals(state.items)
      state.subtotal = totals.subtotal
      state.shippingPrice = totals.shippingPrice
      state.total = totals.total

      localStorage.setItem('cart', JSON.stringify(state.items))
    },

    updateQuantity: (state, action) => {
      const { productId, size, color, quantity } = action.payload

      const item = state.items.find(
        (item) =>
          item.product._id === productId &&
          item.size === size &&
          item.color === color
      )

      if (item) {
        item.quantity = quantity
      }

      const totals = calculateTotals(state.items)
      state.subtotal = totals.subtotal
      state.shippingPrice = totals.shippingPrice
      state.total = totals.total

      localStorage.setItem('cart', JSON.stringify(state.items))
    },

    clearCart: (state) => {
      state.items = []
      state.subtotal = 0
      state.shippingPrice = 0
      state.total = 0
      localStorage.removeItem('cart')
    },

    initCart: (state) => {
      const totals = calculateTotals(state.items)
      state.subtotal = totals.subtotal
      state.shippingPrice = totals.shippingPrice
      state.total = totals.total
    },
  },
})

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  initCart,
} = cartSlice.actions
export default cartSlice.reducer
