import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '@/api'
import type { Product } from '@/types'

interface ProductState {
  products: Product[]
  featuredProducts: Product[]
  product: Product | null
  isLoading: boolean
  error: string | null
  total: number
  pages: number
  page: number
}

const initialState: ProductState = {
  products: [],
  featuredProducts: [],
  product: null,
  isLoading: false,
  error: null,
  total: 0,
  pages: 1,
  page: 1,
}

export const fetchProducts = createAsyncThunk(
  'product/fetchAll',
  async (params: Record<string, string | number>, { rejectWithValue }) => {
    try {
      const queryString = new URLSearchParams(
        Object.entries(params).reduce(
          (acc, [Key, value]) => {
            if (value) acc[Key] = String(value)
            return acc
          },
          {} as Record<string, string>
        )
      ).toString()
      const { data } = await api.get(`/products?${queryString}`)
      return data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Xato yuz berdi')
    }
  }
)

export const fetchFeaturedProducts = createAsyncThunk(
  'product/fetchFeatured',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/products?isFeatured=true&limit=4')
      return data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Xato yuz berdi')
    }
  }
)

export const fetchProductById = createAsyncThunk(
  'product/fetchById',
  async (id: string, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/products/${id}`)
      return data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Xato yuz berdi')
    }
  }
)

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    clearProduct: (state) => {
      state.product = null
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchProducts
      .addCase(fetchProducts.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.isLoading = false
        state.products = action.payload.products
        state.total = action.payload.total
        state.pages = action.payload.pages
        state.page = action.payload.page
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

      // fetchFeaturedProducts
      .addCase(fetchFeaturedProducts.pending, (state) => {
        state.isLoading = true
      })
      .addCase(fetchFeaturedProducts.fulfilled, (state, action) => {
        state.isLoading = false
        state.featuredProducts = action.payload.products
      })
      .addCase(fetchFeaturedProducts.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

      // fetchProductById
      .addCase(fetchProductById.pending, (state) => {
        state.isLoading = true
        state.product = null
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.isLoading = false
        state.product = action.payload.product
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  },
})

export const { clearProduct, clearError } = productSlice.actions
export default productSlice.reducer
