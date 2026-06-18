import { clearCart, removeFromCart, updateQuantity } from "@/features/cartSlice"
import type { AppDispatch, RootState } from "@/features/store"
import { Trash2 } from "lucide-react"
import toast from "react-hot-toast"
import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"

const Cart = () => {
    const dispatch = useDispatch<AppDispatch>()
    const navigate = useNavigate()
    const { items, subtotal, shippingPrice, total} = useSelector((state: RootState) => state.cart)
    const {user} = useSelector((state: RootState) => state.auth)

    const handleRemove = (productId: string, size: string, color: string) => {
        dispatch(removeFromCart({productId, size, color}))
        toast.success("Savatchadan o'chrildi")
    }

    const handleQuantity = (
        productId: string,
        size: string,
        color: string,
        quantity: number
    ) => {
        if(quantity < 1) return
        dispatch(updateQuantity({ productId, size, color, quantity}))
    }

    const handleCheckout = () => {
        if(!user){
            toast.error("Iltimos avval login qiling!")
            navigate('/login')
            return
        }
        navigate('/checkout')
    }
  return (
    <div className="min-h-screen px-12 py-12">
      <h1 className="text-2xl font-bold mb-8">
        Your Cart ({items.length})
      </h1>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24">
            <p className="text-gray-500 mb-6">Your cart is empt</p>
            <Link to='/' className="bg-black text-white px-8 py-3 text-sm hover:bg-gray-800 transition">
            Continue shopping
            </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="md:col-span-2">
                {items.map((item) => (
                    <div key={`${item.product._id}-${item.size}-${item.color}`}
                    className="flex gap-6 py-6 border-b border-gray-100">
                        <Link to={`/product/${item.product._id}`}
                        className="w-24 h-32 bg-gray-200 overflow-hidden flex-shrink-0">
                            <img
                             src={item.product.images[0]} 
                             alt={item.product.name}
                             onError={(e) => {
                                e.currentTarget.src = 'https://placehold.co/400x500/f5f5f5/888?text=No+Image'
                             }}
                             className="w-full h-full object-cover" />
                             {item.product.name}
                        </Link>
                       
                       <div className="flex-1">
                        <div className="flex items-start justify-between">
                            <div>
                                <Link to={`/product/${item.product._id}`}
                                className="text-sm font-medium hover:underline">
                                    {item.product.name}
                                </Link>
                                <p className="text-xs text-gray-400 mt-1">
                                    {item.color} | {item.size}
                                </p>
                            </div>
                            <button
                            onClick={() => 
                                handleRemove(
                                    item.product._id,
                                    item.size,
                                    item.color
                                )
                            }
                            className="text-gray-400 hover:text-red-500 transition"
                            >
                                <Trash2 className="w-4 h-4"/>
                            </button>
                        </div>

                        <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center border border-gray-200">
                                <button
                                onClick={() => 
                                    handleQuantity(
                                        item.product._id,
                                        item.size,
                                        item.color,
                                        item.quantity - 1
                                    )
                                }
                                className="w-8 h-8 text-lg hover:bg-gray-50 transition"
                                >
                                    -
                                </button>
                                <span className="w-8 text-center text-sm">
                                    {item.quantity}
                                </span>
                                <button 
                                onClick={() =>
                                    handleQuantity(
                                        item.product._id,
                                        item.size,
                                        item.color,
                                        item.quantity + 1
                                    )
                                }
                                className="w-8 h-8 text-lg hover:bg-gray-50 transition"
                                >
                                    +
                                </button>
                            </div>

                            <p className="text-sm font-medium">
                                $
                                {(
                                    (item.product.discountPrice > 0
                                        ? item.product.discountPrice
                                        : item.product.price) * item.quantity
                                ). toFixed(2)}
                            </p>
                        </div>
                       </div>
                    </div>
                ))}

                <button
              onClick={() => {
                dispatch(clearCart())
                toast.success('Savatcha tozalandi')
              }}
              className='mt-6 text-sm text-gray-400 hover:text-red-500 transition underline'
            >
              Clear cart
            </button>
            </div>

            <div className="md:col-span-1">
                <div className="bg-gray-50 p-8">
                    <h2 className="text-lg font-bold mb-6">Order Summary</h2>

                    <div className='flex justify-between text-sm mb-3'>
                        <span className='text-gray-500'>Subtotal</span>
                        <span>${subtotal.toFixed(2)}</span>
                    </div>
                     <div className='flex justify-between text-sm mb-6'>
                        <span className='text-gray-500'>Shipping</span>
                        <span className={shippingPrice === 0 ? 'text-green-500' : ''}>
                        {shippingPrice === 0 ? 'FREE' : `$${shippingPrice}`}
                        </span>
                    </div>

                     {shippingPrice > 0 && (
                <p className='text-xs text-gray-400 mb-4'>
                  ${(100 - subtotal).toFixed(2)} more for free shipping!
                </p>
              )}

              <div className='border-t border-gray-200 pt-4 mb-6'>
                <div className='flex justify-between font-bold'>
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className='w-full bg-black text-white py-4 text-sm font-medium hover:bg-gray-800 transition'
              >
                Checkout
              </button>

               <Link
                to='/'
                className='block text-center text-sm text-gray-500 mt-4 hover:text-black transition'
              >
                ← Continue Shopping
              </Link>
                </div>
            </div>
        </div>
      )}
    </div>
  )
}

export default Cart
