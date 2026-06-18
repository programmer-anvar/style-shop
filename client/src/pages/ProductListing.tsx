import { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProducts } from '@/features/productSlice'
import type { AppDispatch, RootState } from '@/features/store'
import { SlidersHorizontal, X } from 'lucide-react'

const ProductListing = () => {
  const { category } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const dispatch = useDispatch<AppDispatch>()
  const { products, isLoading, total, pages } = useSelector(
    (state: RootState) => state.product
  )

  const [filterOpen, setFilterOpen] = useState(false)
  const [filters, setFilters] = useState({
    sort: searchParams.get('sort') || 'newest',
    size: searchParams.get('size') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    page: Number(searchParams.get('page')) || 1,
  })

  useEffect(() => {
    const params: Record<string, string | number> = {
      page: filters.page,
      sort: filters.sort,
    }

    if (category) params.category = category
    if (filters.size) params.size = filters.size
    if (filters.minPrice) params.minPrice = filters.minPrice
    if (filters.maxPrice) params.maxPrice = filters.maxPrice

    dispatch(fetchProducts(params))

    // URL ni yangilaymiz
    const newParams: Record<string, string> = {
      sort: filters.sort,
      page: String(filters.page),
    }
    if (filters.size) newParams.size = filters.size
    if (filters.minPrice) newParams.minPrice = filters.minPrice
    if (filters.maxPrice) newParams.maxPrice = filters.maxPrice

    setSearchParams(newParams)
  }, [category, filters, dispatch])

  const handleSortChange = (sort: string) => {
    setFilters({ ...filters, sort, page: 1 })
  }

  const handleSizeChange = (size: string) => {
    setFilters({ ...filters, size: filters.size === size ? '' : size, page: 1 })
  }

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value, page: 1 })
  }

  const handlePageChange = (page: number) => {
    setFilters({ ...filters, page })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const clearFilters = () => {
    setFilters({
      sort: 'newest',
      size: '',
      minPrice: '',
      maxPrice: '',
      page: 1,
    })
  }

  return (
    <div className='min-h-screen'>
      {/* Header */}
      <div className='px-12 py-8 border-b border-gray-100'>
        <h1 className='text-2xl font-bold capitalize'>
          {category || 'All Products'}
        </h1>
        <p className='text-sm text-gray-500 mt-1'>{total} products</p>
      </div>

      <div className='flex'>
        {/* Sidebar Filters — Desktop */}
        <aside className='hidden md:block w-64 px-8 py-8 border-r border-gray-100 sticky top-[80px] h-screen overflow-y-auto'>
          {/* Categories */}
          <div className='mb-8'>
            <h3 className='text-xs font-semibold mb-4 uppercase tracking-wider text-gray-400'>
              Categories
            </h3>
            {[
              'All',
              'T-Shirts',
              'Shirts',
              'Hoodies & Sweatshirts',
              'Jackets',
              'Pants',
              'Shorts',
              'Suits',
            ].map((cat) => (
              <button
                key={cat}
                className='block text-sm mb-2 text-gray-500 hover:text-black transition text-left'
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Price Range */}
          <div className='mb-8'>
            <h3 className='text-xs font-semibold mb-4 uppercase tracking-wider text-gray-400'>
              Price
            </h3>
            <div className='flex items-center justify-between text-xs text-gray-400 mb-2'>
              <span>$0</span>
              <span>$300+</span>
            </div>
            <input
              type='range'
              min={0}
              max={300}
              value={filters.maxPrice || 300}
              onChange={(e) =>
                setFilters({ ...filters, maxPrice: e.target.value, page: 1 })
              }
              className='w-full accent-black'
            />
            <div className='flex gap-2 mt-3'>
              <input
                type='number'
                name='minPrice'
                value={filters.minPrice}
                onChange={handlePriceChange}
                placeholder='$0'
                className='w-full border border-gray-200 px-3 py-2 text-xs outline-none focus:border-black'
              />
              <input
                type='number'
                name='maxPrice'
                value={filters.maxPrice}
                onChange={handlePriceChange}
                placeholder='$300'
                className='w-full border border-gray-200 px-3 py-2 text-xs outline-none focus:border-black'
              />
            </div>
          </div>

          {/* Size */}
          <div className='mb-8'>
            <div className='flex items-center justify-between mb-4'>
              <h3 className='text-xs font-semibold uppercase tracking-wider text-gray-400'>
                Size
              </h3>
            </div>
            <div className='flex flex-col gap-2'>
              {['XS', 'S', 'L', 'XL', 'XXL'].map((size) => (
                <label
                  key={size}
                  className='flex items-center gap-2 cursor-pointer'
                >
                  <input
                    type='checkbox'
                    checked={filters.size === size}
                    onChange={() => handleSizeChange(size)}
                    className='w-4 h-4 accent-black'
                  />
                  <span className='text-sm text-gray-600'>{size}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Color */}
          <div className='mb-8'>
            <h3 className='text-xs font-semibold mb-4 uppercase tracking-wider text-gray-400'>
              Color
            </h3>
            <div className='flex flex-wrap gap-2'>
              {[
                { name: 'Black', hex: '#111111' },
                { name: 'Gray', hex: '#6b7280' },
                { name: 'Navy', hex: '#1e3a5f' },
                { name: 'Brown', hex: '#92400e' },
                { name: 'Red', hex: '#dc2626' },
                { name: 'Blue', hex: '#3b82f6' },
                { name: 'DarkBlue', hex: '#1e40af' },
                { name: 'Orange', hex: '#f97316' },
                { name: 'White', hex: '#f5f5f5' },
              ].map((color) => (
                <button
                  key={color.name}
                  title={color.name}
                  onClick={() =>
                    setFilters({
                      ...filters,
                      page: 1,
                    })
                  }
                  className='w-6 h-6 rounded-full border border-gray-200 hover:scale-110 transition'
                  style={{ backgroundColor: color.hex }}
                />
              ))}
            </div>
          </div>

          {/* Brand */}
          <div className='mb-8'>
            <h3 className='text-xs font-semibold mb-4 uppercase tracking-wider text-gray-400'>
              Brand
            </h3>
            {['Nike', 'Adidas', 'Zara', 'H&M', 'Uniqlo', 'Other'].map(
              (brand) => (
                <label
                  key={brand}
                  className='flex items-center gap-2 mb-2 cursor-pointer'
                >
                  <input type='checkbox' className='w-4 h-4 accent-black' />
                  <span className='text-sm text-gray-600'>{brand}</span>
                </label>
              )
            )}
          </div>

          {/* Sort */}
          <div className='mb-8'>
            <h3 className='text-xs font-semibold mb-4 uppercase tracking-wider text-gray-400'>
              Sort By
            </h3>
            {[
              { label: 'Popular', value: 'popular' },
              { label: 'Newest', value: 'newest' },
              { label: 'Price: Low to High', value: 'price-low' },
              { label: 'Price: High to Low', value: 'price-high' },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => handleSortChange(option.value)}
                className={`block text-sm mb-2 transition text-left ${
                  filters.sort === option.value
                    ? 'text-black font-medium'
                    : 'text-gray-500 hover:text-black'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          <button
            onClick={clearFilters}
            className='text-sm text-gray-500 hover:text-black underline transition'
          >
            Clear all filters
          </button>
        </aside>

        {/* Products */}
        <main className='flex-1 px-8 py-8'>
          {/* Mobile filter button */}
          <div className='md:hidden flex items-center justify-between mb-6'>
            <button
              onClick={() => setFilterOpen(true)}
              className='flex items-center gap-2 text-sm border border-gray-200 px-4 py-2'
            >
              <SlidersHorizontal className='w-4 h-4' />
              Filters
            </button>
          </div>

          {/* Products Grid */}
          {isLoading ? (
            <div className='grid grid-cols-2 md:grid-cols-3 gap-6'>
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className='animate-pulse'>
                  <div className='bg-gray-200 aspect-[3/4] mb-3' />
                  <div className='bg-gray-200 h-4 w-3/4 mb-2' />
                  <div className='bg-gray-200 h-4 w-1/4' />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className='flex flex-col items-center justify-center py-24'>
              <p className='text-gray-500 text-lg'>No products found</p>
              <button
                onClick={clearFilters}
                className='mt-4 text-sm underline hover:text-gray-500'
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className='grid grid-cols-2 md:grid-cols-3 gap-6'>
              {products.map((product) => (
                <a
                  key={product._id}
                  href={`/product/${product._id}`}
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
                </a>
              ))}
            </div>
          )}

          {/* Pagination */}
          {pages > 1 && (
            <div className='flex items-center justify-center gap-2 mt-12'>
              {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => handlePageChange(p)}
                  className={`w-9 h-9 text-sm transition ${
                    filters.page === p
                      ? 'bg-black text-white'
                      : 'border border-gray-200 hover:border-black'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Mobile Filter Panel */}
      {filterOpen && (
        <div className='fixed inset-0 z-50 bg-white overflow-y-auto md:hidden'>
          <div className='flex items-center justify-between px-6 py-4 border-b border-gray-100'>
            <h2 className='font-semibold'>Filters</h2>
            <button onClick={() => setFilterOpen(false)}>
              <X className='w-5 h-5' />
            </button>
          </div>
          <div className='px-6 py-6'>
            {/* Sort */}
            <div className='mb-8'>
              <h3 className='text-sm font-semibold mb-4 uppercase tracking-wider'>
                Sort By
              </h3>
              {[
                { label: 'Newest', value: 'newest' },
                { label: 'Popular', value: 'popular' },
                { label: 'Price: Low to High', value: 'price-low' },
                { label: 'Price: High to Low', value: 'price-high' },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    handleSortChange(option.value)
                    setFilterOpen(false)
                  }}
                  className={`block text-sm mb-3 ${
                    filters.sort === option.value
                      ? 'text-black font-medium'
                      : 'text-gray-500'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
            {/* Size */}
            <div className='mb-8'>
              <h3 className='text-sm font-semibold mb-4 uppercase tracking-wider'>
                Size
              </h3>
              <div className='flex flex-wrap gap-2'>
                {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                  <button
                    key={size}
                    onClick={() => handleSizeChange(size)}
                    className={`w-10 h-10 text-xs border transition ${
                      filters.size === size
                        ? 'bg-black text-white border-black'
                        : 'border-gray-200'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
            <button
              onClick={() => {
                clearFilters()
                setFilterOpen(false)
              }}
              className='w-full bg-black text-white py-3 text-sm mt-4'
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductListing
