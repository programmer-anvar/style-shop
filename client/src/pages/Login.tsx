import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { loginUser } from '@/features/authSlice'
import type { AppDispatch, RootState } from '@/features/store'

const Login = () => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const { user, isLoading, error } = useSelector(
    (state: RootState) => state.auth
  )

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  useEffect(() => {
    if (user) navigate('/')
  }, [user, navigate])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    dispatch(loginUser(formData))
  }

  return (
    <div className='min-h-screen bg-gray-50 flex items-center justify-center px-4'>
      <div className='bg-white w-full max-w-md p-10'>
        {/* Logo */}
        <Link
          to='/'
          className='block text-center font-bold text-xl tracking-widest mb-8'
        >
          STYLESHOP
        </Link>

        <h1 className='text-2xl font-bold mb-2'>Welcome back</h1>
        <p className='text-gray-500 text-sm mb-8'>
          Enter your email and password to login
        </p>

        {/* Error */}
        {error && (
          <div className='bg-red-50 text-red-500 text-sm px-4 py-3 mb-6'>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
          <div>
            <label className='text-sm font-medium text-gray-700 block mb-1'>
              Email
            </label>
            <input
              type='email'
              name='email'
              value={formData.email}
              onChange={handleChange}
              placeholder='anvar@gmail.com'
              required
              className='w-full border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black transition'
            />
          </div>

          <div>
            <label className='text-sm font-medium text-gray-700 block mb-1'>
              Password
            </label>
            <input
              type='password'
              name='password'
              value={formData.password}
              onChange={handleChange}
              placeholder='••••••'
              required
              className='w-full border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black transition'
            />
          </div>

          <button
            type='submit'
            disabled={isLoading}
            className='bg-black text-white py-3 text-sm font-medium hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed mt-2'
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className='text-center text-sm text-gray-500 mt-6'>
          Don't have an account?{' '}
          <Link
            to='/register'
            className='text-black font-medium hover:underline'
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login
