import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Provider } from 'react-redux'
import { store } from './features/store.ts'
import { RouterProvider } from 'react-router-dom'
import router from './router/index.tsx'
import { initCart } from './features/cartSlice.ts'
import { Toaster } from 'react-hot-toast'
store.dispatch(initCart())

createRoot(document.getElementById('root')!).render(
    <Provider store={store}>
      <RouterProvider router={router} />
      <Toaster
      position='top-right'
      toastOptions={{
        duration: 3000,
        style:{
          background: '#111',
          color: '#fff',
          fontSize: '14px'
        }
      }}
      />
    </Provider>
)
