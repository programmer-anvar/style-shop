import { addToCart } from '@/features/cartSlice'
import { clearProduct, fetchProductById } from '@/features/productSlice'
import type { AppDispatch, RootState } from '@/features/store'
import { Heart, RotateCcw, Shield, ShoppingBag, Truck } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'

const ProductDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const { product, isLoading } = useSelector(
    (state: RootState) => state.product
  )
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    if (id) dispatch(fetchProductById(id))

    return () => {
      dispatch(clearProduct())
    }
  }, [id, dispatch])

  if (isLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='animate-pulse text-gray-400'>Loading...</div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <p className='text-gray-500 mb-4'>Product not found</p>
          <button
            onClick={() => navigate(-1)}
            className='text-sm underline hover:text-gray-500'
          >
            Go back
          </button>
        </div>
      </div>
    )
  }

  const handleAddToCart = () => {
    if(!selectedSize){
      toast.error("iltimos o'lcham tanlang")
      return
    }
    if(!selectedColor && product.colors.length > 0){
      toast.error("Iltimos rang tanlang")
      return
    }

    dispatch(
      addToCart({
        product,
        quantity,
        size: selectedSize,
        color: selectedColor
      })
    )

    toast.success("saatchaga qo'shish")
  }

  return (
    <div className='min-h-screen px-20 py-12'>
      {/* Breadcrumb */}
      <div className='flex items-center gap-2 text-sm text-gray-400 mb-8'>
        <button onClick={() => navigate('/')}>Home</button>
        <span>›</span>
        <button onClick={() => navigate(`/${product.category}`)}>
          {product.category}
        </button>
        <span>›</span>
        <span className='text-gray-800'>{product.name}</span>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-12'>
        {/* Left — Images */}
        <div className='flex gap-4'>
          {/* Thumbnails */}
          <div className='flex flex-col gap-3'>
            {product.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setSelectedImage(i)}
                className={`w-16 h-20 overflow-hidden border-2 transition ${
                  selectedImage === i ? 'border-black' : 'border-transparent'
                }`}
              >
                <img
                  src={img}
                  alt={product.name}
                  onError={(e) => {
                    e.currentTarget.src =
                      'https://placehold.co/400x500/f5f5f5/888?text=No+Image'
                  }}
                  className='w-full h-full object-cover'
                />
              </button>
            ))}
          </div>

          {/* Main image */}
          <div className='flex-1 bg-gray-100 overflow-hidden max-h-[600px]'>
            <img
              src={product.images[selectedImage]}
              alt={product.name}
              onError={(e) => {
                e.currentTarget.src =
                  'https://placehold.co/400x500/f5f5f5/888?text=No+Image'
              }}
              className='w-full h-full object-cover object-top'
            />
          </div>
        </div>

        {/* Right — Info */}
        <div>
          <h1 className='text-2xl font-bold mb-2'>{product.name}</h1>

          {/* Price */}
          <div className='flex items-center gap-3 mb-4'>
            {product.discountPrice > 0 ? (
              <>
                <span className='text-xl font-semibold text-red-500'>
                  ${product.discountPrice}
                </span>
                <span className='text-gray-400 line-through'>
                  ${product.price}
                </span>
              </>
            ) : (
              <span className='text-xl font-semibold'>${product.price}</span>
            )}
          </div>

          {/* Rating */}
          <div className='flex items-center gap-2 mb-6'>
            <div className='flex text-yellow-400 text-sm'>
              {'★'.repeat(Math.round(product.rating))}
              {'☆'.repeat(5 - Math.round(product.rating))}
            </div>
            <span className='text-sm text-gray-400'>
              ({product.numReviews} reviews)
            </span>
          </div>

          {/* Description */}
          <p className='text-sm text-gray-500 leading-relaxed mb-6'>
            {product.description}
          </p>

          {/* Color */}
          {product.colors.length > 0 && (
            <div className='mb-6'>
              <p className='text-sm font-medium mb-3'>
                Color:{' '}
                <span className='font-normal text-gray-500'>
                  {selectedColor || 'Select color'}
                </span>
              </p>
              <div className='flex gap-2'>
                {product.colors.map((color) => (
                  <button
                    key={color._id}
                    title={color.name}
                    onClick={() => setSelectedColor(color.name)}
                    className={`w-8 h-8 rounded-full border-2 transition ${
                      selectedColor === color.name
                        ? 'border-black scale-110'
                        : 'border-transparent'
                    }`}
                    style={{ backgroundColor: color.hex }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Size */}
          {product.sizes.length > 0 && (
            <div className='mb-6'>
              <div className='flex items-center justify-between mb-3'>
                <p className='text-sm font-medium'>Size</p>
                <button className='text-xs text-gray-400 underline'>
                  Size Guide
                </button>
              </div>
              <div className='flex gap-2'>
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-10 h-10 text-xs border transition ${
                      selectedSize === size
                        ? 'bg-black text-white border-black'
                        : 'border-gray-200 hover:border-black'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className='flex items-center gap-4 mb-6'>
            <div className='flex items-center border border-gray-200'>
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className='w-10 h-10 text-lg hover:bg-gray-50 transition'
              >
                −
              </button>
              <span className='w-10 text-center text-sm'>{quantity}</span>
              <button
                onClick={() =>
                  setQuantity(Math.min(product.stock, quantity + 1))
                }
                className='w-10 h-10 text-lg hover:bg-gray-50 transition'
              >
                +
              </button>
            </div>
            <span className='text-xs text-gray-400'>
              {product.stock} in stock
            </span>
          </div>

          {/* Buttons */}
          <div className='flex flex-col gap-3 mb-8'>
            <button
            onClick={handleAddToCart}
            className='w-full bg-black text-white py-4 text-sm font-medium hover:bg-gray-800 transition flex items-center justify-center gap-2'>
              <ShoppingBag className='w-4 h-4' />
              Add to Cart
            </button>
            <button className='w-full border border-gray-200 py-4 text-sm hover:border-black transition flex items-center justify-center gap-2'>
              <Heart className='w-4 h-4' />
              Add to Wishlist
            </button>
          </div>
        </div>
      </div>
      {/* Shipping info */}
      <div className='flex items-center justify-between pt-6 border-t border-gray-100'>
        <div className='flex items-center gap-3'>
          <Truck className='w-4 h-4 text-gray-400' />
          <div>
            <p className='text-sm font-medium'>Free Shipping</p>
            <p className='text-xs text-gray-400'>On orders over $100</p>
          </div>
        </div>
        <div className='flex items-center gap-3'>
          <RotateCcw className='w-4 h-4 text-gray-400' />
          <div>
            <p className='text-sm font-medium'>Easy Returns</p>
            <p className='text-xs text-gray-400'>30-day return policy</p>
          </div>
        </div>
        <div className='flex items-center gap-3'>
          {/* <Shield className='w-4 h-4 text-gray-400' /> */}
          <div>
            <p className='text-sm font-medium'>Secure Payment</p>
            <p className='text-xs text-gray-400'>100% secure checkout</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail
