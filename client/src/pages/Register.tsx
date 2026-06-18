import { registerUser } from '@/features/authSlice'
import type { AppDispatch, RootState } from '@/features/store'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'

const Register = () => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const { user, isLoading, error } = useSelector(
    (state: RootState) => state.auth
  )
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [localError, setLocalError] = useState('')

  useEffect(() => {
    if (user) navigate('/')
  }, [user, navigate])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLocalError('')

    if (formData.password !== formData.confirmPassword) {
      setLocalError('Parollar mos kelmadi')
    }

    if (formData.password.length < 6) {
      setLocalError('Parol kamida 6 ta belgi bo/lishi kerak')
      return
    }

    dispatch(
      registerUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      })
    )
  }

  return (
    <div className='min-h-screen bg-gray-50 flex items-center justify-center px-4'>
      <div className='bg-white w-full max-w-md p-10'>
        <Link
          to='/'
          className='block text-center font-bold text-xl tracking-widest mb-8'
        >
          STYLESHOP
        </Link>
        <h1 className='text-2xl font-bold mb-2'>Create account</h1>
        <p className='text-gray-500 text-sm mb-8'>
          Fill in the details below to create your account
        </p>

        {(error || localError) && (
          <div className='bg-red-50 text-red-500 text-sm px-4 py-3 mb-6'>
            {localError || error}
          </div>
        )}

        <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
          <div>
            <label className='text-sm font-medium text-gray-700 block mb-1'>
              Full Name
            </label>
            <input
              type='text'
              name='name'
              value={formData.name}
              onChange={handleChange}
              placeholder='Anvar John'
              required
              className='w-full border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black transition'
            />
          </div>
          <div>
            <label className='text-sm font-medium text-gray-700 block mb-1'>
              Email
            </label>
            <input
              type='email'
              name='email'
              value={formData.email}
              onChange={handleChange}
              placeholder='Anvar@gmail.com'
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
              placeholder='*******'
              required
              className='w-full border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black transition'
            />
          </div>
          <div>
            <label className='text-sm font-medium text-gray-700 block mb-1'>
              Confirm password
            </label>
            <input
              type='password'
              name='confirmPassword'
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder='********'
              required
              className='w-full border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black transition'
            />
          </div>
          <button
            type='submit'
            disabled={isLoading}
            className='bg-black text-white py-3 text-sm font-medium hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed mt-2'
          >
            {isLoading ? 'Create account...' : 'Create Account'}
          </button>
        </form>
        <p className='text-center text-sm text-gray-500 mt-6'>
          Already have an ccount?{' '}
          <Link to='/login' className='text-black font-medium hover:underline'>
            Login
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Register
