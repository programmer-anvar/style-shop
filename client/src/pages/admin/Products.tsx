import { useEffect, useState } from 'react'
import api from '@/api'
import { Pencil, Trash2, Plus, X } from 'lucide-react'
import toast from 'react-hot-toast'
import type { Product } from '@/types'
import ImageUpload from '@/components/ImageUpload'
const Products = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editProduct, setEditProduct] = useState<Product | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    discountPrice: '',
    category: 'men',
    subCategory: '',
    brand: '',
    stock: '',
    isFeatured: false,
    sizes: [] as string[],
    images: [''],
  })

  const fetchProducts = async () => {
    try {
      const { data } = await api.get('/products')
      setProducts(data.products)
    } catch (error) {
      toast.error('Mahsulotlarni yuklashda xato!')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const handleDelete = async (id: string) => {
    if (!window.confirm('Mahsulotni o\'chirishni tasdiqlaysizmi?')) return

    try {
      await api.delete(`/products/${id}`)
      toast.success('Mahsulot o\'chirildi!')
      fetchProducts()
    } catch (error) {
      toast.error('Xato yuz berdi!')
    }
  }

  const handleEdit = (product: Product) => {
    setEditProduct(product)
    setFormData({
      name: product.name,
      description: product.description,
      price: String(product.price),
      discountPrice: String(product.discountPrice),
      category: product.category,
      subCategory: product.subCategory,
      brand: product.brand,
      stock: String(product.stock),
      isFeatured: product.isFeatured,
      sizes: product.sizes,
      images: product.images,
    })
    setModalOpen(true)
  }

  const handleAdd = () => {
    setEditProduct(null)
    setFormData({
      name: '',
      description: '',
      price: '',
      discountPrice: '',
      category: 'men',
      subCategory: '',
      brand: '',
      stock: '',
      isFeatured: false,
      sizes: [],
      images: [''],
    })
    setModalOpen(true)
  }

  const handleSizeToggle = (size: string) => {
    setFormData({
      ...formData,
      sizes: formData.sizes.includes(size)
        ? formData.sizes.filter((s) => s !== size)
        : [...formData.sizes, size],
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const productData = {
        ...formData,
        price: Number(formData.price),
        discountPrice: Number(formData.discountPrice),
        stock: Number(formData.stock),
        images: formData.images.filter((img) => img !== ''),
      }

      if (editProduct) {
        await api.put(`/products/${editProduct._id}`, productData)
        toast.success('Mahsulot yangilandi!')
      } else {
        await api.post('/products', productData)
        toast.success('Mahsulot qo\'shildi!')
      }

      setModalOpen(false)
      fetchProducts()
    } catch (error) {
      toast.error('Xato yuz berdi!')
    }
  }
return (
    <div className='p-8'>
      {/* Header */}
      <div className='flex items-center justify-between mb-8'>
        <h1 className='text-2xl font-bold'>Products</h1>
        <button
          onClick={handleAdd}
          className='flex items-center gap-2 bg-black text-white px-4 py-2 text-sm hover:bg-gray-800 transition'
        >
          <Plus className='w-4 h-4' />
          Add Product
        </button>
      </div>

      {/* Products Table */}
      {isLoading ? (
        <div className='text-center py-12 text-gray-400'>Loading...</div>
      ) : (
        <div className='bg-white rounded-lg border border-gray-100'>
          <table className='w-full'>
            <thead>
              <tr className='border-b border-gray-100'>
                <th className='text-left px-6 py-3 text-xs text-gray-400 font-medium'>IMAGE</th>
                <th className='text-left px-6 py-3 text-xs text-gray-400 font-medium'>NAME</th>
                <th className='text-left px-6 py-3 text-xs text-gray-400 font-medium'>CATEGORY</th>
                <th className='text-left px-6 py-3 text-xs text-gray-400 font-medium'>PRICE</th>
                <th className='text-left px-6 py-3 text-xs text-gray-400 font-medium'>STOCK</th>
                <th className='text-left px-6 py-3 text-xs text-gray-400 font-medium'>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id} className='border-b border-gray-50 hover:bg-gray-50 transition'>
                  <td className='px-6 py-4'>
                    <div className='w-12 h-16 bg-gray-100 overflow-hidden'>
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        onError={(e) => {
                          e.currentTarget.src = 'https://placehold.co/100x130/f5f5f5/888?text=No+Image'
                        }}
                        className='w-full h-full object-cover'
                      />
                    </div>
                  </td>
                  <td className='px-6 py-4'>
                    <p className='text-sm font-medium'>{product.name}</p>
                    <p className='text-xs text-gray-400'>{product.brand}</p>
                  </td>
                  <td className='px-6 py-4 text-sm text-gray-500 capitalize'>{product.category}</td>
                  <td className='px-6 py-4'>
                    <p className='text-sm font-medium'>${product.price}</p>
                    {product.discountPrice > 0 && (
                      <p className='text-xs text-red-500'>${product.discountPrice}</p>
                    )}
                  </td>
                  <td className='px-6 py-4'>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      product.stock > 10
                        ? 'bg-green-100 text-green-600'
                        : product.stock > 0
                        ? 'bg-yellow-100 text-yellow-600'
                        : 'bg-red-100 text-red-600'
                    }`}>
                      {product.stock > 0 ? `${product.stock} left` : 'Out of stock'}
                    </span>
                  </td>
                  <td className='px-6 py-4'>
                    <div className='flex items-center gap-2'>
                      <button
                        onClick={() => handleEdit(product)}
                        className='p-2 hover:bg-gray-100 rounded transition'
                      >
                        <Pencil className='w-4 h-4 text-gray-500' />
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className='p-2 hover:bg-red-50 rounded transition'
                      >
                        <Trash2 className='w-4 h-4 text-red-400' />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className='fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4'>
          <div className='bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg'>
            <div className='flex items-center justify-between px-6 py-4 border-b border-gray-100'>
              <h2 className='font-semibold'>
                {editProduct ? 'Edit Product' : 'Add Product'}
              </h2>
              <button onClick={() => setModalOpen(false)}>
                <X className='w-5 h-5' />
              </button>
            </div>

            <form onSubmit={handleSubmit} className='px-6 py-6 flex flex-col gap-4'>
              {/* Name */}
              <div>
                <label className='text-sm font-medium block mb-1'>Name</label>
                <input
                  type='text'
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className='w-full border border-gray-200 px-4 py-2 text-sm outline-none focus:border-black'
                />
              </div>

              {/* Description */}
              <div>
                <label className='text-sm font-medium block mb-1'>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  required
                  className='w-full border border-gray-200 px-4 py-2 text-sm outline-none focus:border-black resize-none'
                />
              </div>

              {/* Price & Discount */}
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <label className='text-sm font-medium block mb-1'>Price</label>
                  <input
                    type='number'
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                    className='w-full border border-gray-200 px-4 py-2 text-sm outline-none focus:border-black'
                  />
                </div>
                <div>
                  <label className='text-sm font-medium block mb-1'>Discount Price</label>
                  <input
                    type='number'
                    value={formData.discountPrice}
                    onChange={(e) => setFormData({ ...formData, discountPrice: e.target.value })}
                    className='w-full border border-gray-200 px-4 py-2 text-sm outline-none focus:border-black'
                  />
                </div>
              </div>

              {/* Category & Brand */}
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <label className='text-sm font-medium block mb-1'>Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className='w-full border border-gray-200 px-4 py-2 text-sm outline-none focus:border-black'
                  >
                    {['men', 'women', 'kids', 'shoes', 'accessories'].map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className='text-sm font-medium block mb-1'>Brand</label>
                  <input
                    type='text'
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    className='w-full border border-gray-200 px-4 py-2 text-sm outline-none focus:border-black'
                  />
                </div>
              </div>

              {/* Stock */}
              <div>
                <label className='text-sm font-medium block mb-1'>Stock</label>
                <input
                  type='number'
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  required
                  className='w-full border border-gray-200 px-4 py-2 text-sm outline-none focus:border-black'
                />
              </div>

              {/* Sizes */}
              <div>
                <label className='text-sm font-medium block mb-2'>Sizes</label>
                <div className='flex gap-2'>
                  {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                    <button
                      key={size}
                      type='button'
                      onClick={() => handleSizeToggle(size)}
                      className={`w-10 h-10 text-xs border transition ${
                        formData.sizes.includes(size)
                          ? 'bg-black text-white border-black'
                          : 'border-gray-200'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Images Upload */}
              <div>
                <label className='text-sm font-medium block mb-2'>Images</label>
                <ImageUpload
                  images={formData.images}
                  onChange={(urls) => setFormData({ ...formData, images: urls })}
                />
              </div>

              {/* Featured */}
              <label className='flex items-center gap-2 cursor-pointer'>
                <input
                  type='checkbox'
                  checked={formData.isFeatured}
                  onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                  className='w-4 h-4 accent-black'
                />
                <span className='text-sm'>Featured Product</span>
              </label>

              <button
                type='submit'
                className='bg-black text-white py-3 text-sm font-medium hover:bg-gray-800 transition mt-2'
              >
                {editProduct ? 'Update Product' : 'Add Product'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Products
