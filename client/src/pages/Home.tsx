import { fetchFeaturedProducts } from '@/features/productSlice'
import type { AppDispatch, RootState } from '@/features/store'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

const Home = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { featuredProducts, isLoading } = useSelector(
    (state: RootState) => state.product
  )

  useEffect(() => {
    dispatch(fetchFeaturedProducts())
  }, [dispatch])
  return (
    <main>
      {/* Hero Section */}
      <section className='relative bg-[#f0ede8] min-h-[500px] flex items-center overflow-hidden'>
        <div className='px-20 py-16 z-10'>
          <p className='text-xs tracking-[4px] text-gray-500 uppercase mb-4'>
            New Arrivals
          </p>
          <h1 className='text-6xl font-bold leading-tight text-gray-900 mb-6'>
            Spring <br /> Collection <br /> 2026
          </h1>
          <p className='text-gray-500 text-sm mb-8 max-w-xs'>
            Discover the latest trends and timeless pieces, made for you.
          </p>
          <Link
            to='/men'
            className='bg-black text-white text-sm px-8 py-3 hover:bg-gray-800 transition'
          >
            SHOP NOW
          </Link>
        </div>
      </section>

      {/* Categories */}
      <section className='px-20 py-12'>
        <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
          {[
            {
              name: 'Men',
              sub: 'Collection',
              path: '/men',
              bg: 'bg-[#dce4ec]',
            },
            {
              name: 'Women',
              sub: 'Collection',
              path: '/women',
              bg: 'bg-[#ede8e0]',
            },
            {
              name: 'Shoes',
              sub: 'Collection',
              path: '/shoes',
              bg: 'bg-[#e8e8e8]',
            },
            {
              name: 'Accessories',
              sub: 'Collection',
              path: '/accessories',
              bg: 'bg-[#e0ddd8]',
            },
          ].map((cat) => (
            <Link
              key={cat.path}
              to={cat.path}
              className={`${cat.bg} rounded p-6 flex justify-between items-end hover:opacity-90 transition min-h-[120px]`}
            >
              <div>
                <p className='font-semibold text-base'>{cat.name}</p>
                <p className='text-xs text-gray-500'>{cat.sub}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      {/* Featured Products */}
      <section className='px-20 py-12'>
        <div className='flex items-center justify-between mb-8'>
          <h2 className='text-xl font-bold'>Featured Products</h2>
          <Link
            to='/men'
            className='text-sm text-gray-500 hover:text-black transition'
          >
            View all
          </Link>
        </div>

        {isLoading ? (
          <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className='animate-pulse'>
                <div className='bg-gray-200 aspect-[3/4] mb-3' />
                <div className='bg-gray-200 h-4 w-3/4 mb-2' />
                <div className='bg-gray-200 h-4 w-1/4' />
              </div>
            ))}
          </div>
        ) : (
          <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
            {featuredProducts.map((product) => (
              <Link
                key={product._id}
                to={`/product/${product._id}`}
                className='group cursor-pointer'
              >
                <div className='bg-gray-100 aspect-[3/4] mb-3 overflow-hidden'>
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    onError={(e) => {
                      e.currentTarget.src =
                        'https://placehold.co/400x500/f5f5f5/888?text=No+Image'
                    }}
                    className='w-full h-full object-cover group-hover:scale-105 transition duration-300'
                  />
                </div>
                <p className='text-sm font-medium'>{product.name}</p>
                <div className='flex items-center gap-2 mt-1'>
                  {product.discountPrice > 0 ? (
                    <>
                      <p className='text-sm text-red-500 font-medium'>
                        ${product.discountPrice}
                      </p>
                      <p className='text-sm text-gray-400 line-through'>
                        ${product.price}
                      </p>
                    </>
                  ) : (
                    <p className='text-sm text-gray-500'>${product.price}</p>
                  )}
                </div>
                <div className='flex text-yellow-400 text-xs mt-1'>
                  {'★'.repeat(Math.round(product.rating))}
                  {'☆'.repeat(5 - Math.round(product.rating))}
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Promo Banners */}
      <section className='px-20 py-6'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div className='bg-[#f0ede8] p-10 flex flex-col justify-center min-h-[160px]'>
            <p className='text-xs text-gray-500 uppercase tracking-widest mb-2'>
              Up to 50% off
            </p>
            <h3 className='text-2xl font-bold mb-3'>Mid Season Sale</h3>
            <Link to='/sale' className='text-sm font-medium hover:underline'>
              Shop now →
            </Link>
          </div>
          <div className='bg-[#e8e4dc] p-10 flex flex-col justify-center min-h-[160px]'>
            <p className='text-xs text-gray-500 uppercase tracking-widest mb-2'>
              Free Delivery
            </p>
            <h3 className='text-2xl font-bold mb-3'>On orders over $100</h3>
            <Link to='/men' className='text-sm font-medium hover:underline'>
              Shop now →
            </Link>
          </div>
        </div>
      </section>

      {/* Footer Icons */}
      <section className='px-20 py-8 border-t border-gray-100'>
        <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
          {[
            { icon: '🚚', title: 'Free Shipping', sub: 'On orders over $100' },
            { icon: '↩', title: 'Easy Returns', sub: '30-day return policy' },
            {
              icon: '🔒',
              title: 'Secure Payment',
              sub: '100% secure checkout',
            },
            { icon: '💬', title: '24/7 Support', sub: "We're here to help" },
          ].map((item) => (
            <div key={item.title} className='flex items-center gap-4'>
              <span className='text-2xl'>{item.icon}</span>
              <div>
                <p className='text-sm font-semibold'>{item.title}</p>
                <p className='text-xs text-gray-500'>{item.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}

export default Home
