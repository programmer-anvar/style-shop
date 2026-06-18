import { clearCart } from '@/features/cartSlice'
import type { AppDispatch, RootState } from '@/features/store'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { createOrder } from '@/features/orderSlice'

const Checkout = () => {
    const dispatch = useDispatch<AppDispatch>()
    const navigate = useNavigate()
    const { items, subtotal, shippingPrice, total} = useSelector((state: RootState) => state.cart)
    const { user } = useSelector((state: RootState) => state.auth)

    const [formData, setFormData] = useState({
        fullName: user?.name || '',
        address: '',
        city: '',
        zipCode: '',
        country: '',
        phone: ''
    })

    const [isLoading, setIsLoading] = useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({...formData, [e.target.name]: e.target.value})
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if(items.length === 0){
            toast.error("savatcha bo'sh")
            return
        }
        setIsLoading(true)

        try {
           const orderData = {
      items: items.map((item) => ({
        product: item.product._id,
        name: item.product.name,
        image: item.product.images[0],
        price:
          item.product.discountPrice > 0
            ? item.product.discountPrice
            : item.product.price,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
      })),
      shippingAddress: formData,
      paymentMethod: 'stripe',
      subtotal,
      shippingPrice,
      total,
    }

            await dispatch(createOrder(orderData)).unwrap()
            toast.success('Buyurtma berildi!')
            dispatch(clearCart())
            navigate('/')
        } catch (error) {
            toast.error('Xato yuz berdi!')
        }finally{
            setIsLoading(false)
        }
    }
  return (
    <div className='min-h-screen px-12 py-12'>
      <h1 className='text-2xl font-bold mb-8'>Checkout</h1>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-12'>
        <div className='md:col-span-2'>
            <h2 className='text-lg font-semibold mb-6'>Shipping information</h2>

            <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                    <label className='text-sm font-medium text-gray-700 block mb-1'>
                        Full Name
                    </label>
                    <input 
                    type="text"
                    name='fullName'
                    value={formData.fullName} 
                    onChange={handleChange}
                    placeholder='Anvar John'
                    required
                    className='w-full border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black transition'/>
                </div>

                <div>
                    <label className='text-sm font-medium text-gray-700 block mb-1'>
                        Phone
                    </label>
                    <input 
                    type="text"
                    name='phone'
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder='+998901234567'
                    required
                    className='w-full border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black transition'
                   />
                </div>
                </div>

                <div>
                    <label className='text-sm font-medium text-gray-700 block mb-1'>
                        Address
                    </label>
                     <input
                        type='text'
                        name='address'
                        value={formData.address}
                        onChange={handleChange}
                        placeholder='123 Fashion Street'
                        required
                        className='w-full border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black transition'
                    />
                </div>

                <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                    <div>
                        <label className='text-sm font-medium text-gray-700 block mb-1'>
                            City
                        </label>
                        <input 
                        type="text"
                        name='city'
                        value={formData.city}
                        onChange={handleChange}
                        className='w-full border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black transition' />
                    </div>

                    <div>
                        <label className='text-sm font-medium text-gray-700 block mb-1'>
                            Zip Code
                        </label>
                        <input 
                        type="text"
                        name='zipCode'
                        value={formData.zipCode}
                        onChange={handleChange}
                        className='w-full border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black transition'
                         />
                    </div>
                     <div>
                <label className='text-sm font-medium text-gray-700 block mb-1'>
                  Country
                </label>
                <input
                  type='text'
                  name='country'
                  value={formData.country}
                  onChange={handleChange}
                  placeholder='Uzbekistan'
                  required
                  className='w-full border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black transition'
                />
              </div>
                </div>

                <button
                type='submit'
                disabled={isLoading}
                className='bg-black text-white py-4 text-sm font-medium hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed mt-4'
                >
                    {isLoading ? 'Placing order...' : 'place order'}
                </button>
            </form>
        </div>

        <div className='md:col-span-1'>
            <div className='bg-gray-50 py-8'>
                <h2 className='text-lg font-bold mb-6'>Order Summary</h2>

                <div className='flex flex-col gap-4 mb-6'>
                    {items.map((item) => (
                        <div 
                        key={`${item.product._id}-${item.size}-${item.color}`}
                        className='flex gap-3'
                        >
                            <div className='w-12 h-16 bg-gray-200 overflow-hidden flex-shrink-0'>
                                <img 
                                src={item.product.images[0]}
                                alt={item.product.name}
                                onError={(e) => {
                                    e.currentTarget.src = 'https://placehold.co/400x500/f5f5f5/888?text=No+Image'
                                }}
                                className='w-full h-full object-cover'
                                />
                            </div>
                            <div flex-1>
                                <p className='text-xs font-medium'>{item.product.name}</p>
                                <p className='text-xs text-gray-400'>
                                {item.color} | {item.size} | x{item.quantity}
                                </p>
                                <div className='text-xs font-medium mt-1'>
                                    $
                                    {(
                                        (item.product.discountPrice > 0
                                            ? item.product.discountPrice
                                            : item.product.price) * item.quantity
                                    ).toFixed(2)}
                                </div>

                               
                            </div>
                        </div>
                    ))}
                </div>
                 <div className='border-t border-gray-200 pt-4'>
                                    <div className='flex justify-between text-sm mb-2'>
                                        <span className='text-gray-500'>Subtotal</span>
                                        <span>${subtotal.toFixed(2)}</span>
                                    </div>
                                     <div className='flex justify-between font-bold'>
                                    <span>Total</span>
                                    <span>${total.toFixed(2)}</span>
                                </div>
                                </div>
            </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout
