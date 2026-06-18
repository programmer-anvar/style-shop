import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '@/api'
import type { Order } from '@/types'

interface OrderState {
    orders: Order[]
    order: Order | null
    isLoading: boolean
    error: string | null
    success: boolean
}
const initialState: OrderState = {
  orders: [],
  order: null,
  isLoading: false,
  error: null,
  success: false,
}

export const createOrder = createAsyncThunk(
    'order/create', async (
         orderData: {
      items: {
        product: string
        name: string
        image: string
        price: number
        quantity: number
        size: string
        color: string
      }[]
      shippingAddress: {
        fullName: string
        address: string
        city: string
        zipCode: string
        country: string
        phone: string
      }
      paymentMethod: string
      subtotal: number
      shippingPrice: number
      total: number
    },
    { rejectWithValue }
    ) => {
        try {
            const { data } = await api.post('orders', orderData)
            return data
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Xato yuz berdi')
        }
    }
)


const orderSlice = createSlice({
    name: 'order',
    initialState,
    reducers: {
        clearOrder: (state) => {
            state.order = null
            state.success = false
            state.error = null
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(createOrder.pending, (state) => {
            state.isLoading = true
            state.error = null
            state.success = false
        })
        .addCase(createOrder.fulfilled, (state, action) => {
            state.isLoading = false
            state.success = true
            state.order = action.payload.order
        })
        .addCase(createOrder.rejected, (state, action) => {
            state.isLoading = false
            state.error = action.payload as string
        })
    }
})

export const { clearOrder } = orderSlice.actions
export default orderSlice.reducer