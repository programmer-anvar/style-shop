import { useState } from 'react'
import { uploadImages } from '@/api/uploadApi'
import { X, Upload } from 'lucide-react'
import toast from 'react-hot-toast'

interface Props {
  images: string[]
  onChange: (urls: string[]) => void
}

const ImageUpload = ({ images, onChange }: Props) => {
  const [isUploading, setIsUploading] = useState(false)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return

    setIsUploading(true)
    try {
      const urls = await uploadImages(e.target.files)
      onChange([...images.filter((img) => img !== ''), ...urls])
      toast.success('Rasmlar yuklandi!')
    } catch (error) {
      toast.error('Rasmlarni yuklashda xato!')
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemove = (index: number) => {
    onChange(images.filter((_, i) => i !== index))
  }

  return (
    <div>
      {/* Preview */}
      <div className='flex flex-wrap gap-3 mb-3'>
        {images.filter((img) => img !== '').map((img, i) => (
          <div key={i} className='relative w-20 h-24 bg-gray-100 overflow-hidden'>
            <img
              src={img}
              alt={`Product ${i + 1}`}
              className='w-full h-full object-cover'
            />
            <button
              type='button'
              onClick={() => handleRemove(i)}
              className='absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center'
            >
              <X className='w-3 h-3' />
            </button>
          </div>
        ))}
      </div>

      {/* Upload button */}
      <label className={`flex items-center gap-2 border border-dashed border-gray-300 px-4 py-3 text-sm text-gray-500 cursor-pointer hover:border-black transition ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
        <Upload className='w-4 h-4' />
        {isUploading ? 'Yuklanmoqda...' : 'Rasmlarni tanlang'}
        <input
          type='file'
          multiple
          accept='image/*'
          onChange={handleUpload}
          disabled={isUploading}
          className='hidden'
        />
      </label>
    </div>
  )
}

export default ImageUpload