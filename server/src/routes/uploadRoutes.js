const express = require('express')
const { cloudinary, upload } = require('../config/cloudinary')
const { protect, adminOnly } = require('../middleware/authMiddleware')

const router = express.Router()

router.post('/', protect, adminOnly, upload.array('images', 5), async (req, res) => {
  try {
    console.log('Files:', req.files?.length)

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'Fayl topilmadi' })
    }

    // Har bir faylni Cloudinary ga yuklaymiz
    const uploadPromises = req.files.map((file) => {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
  {
    folder: 'styleshop',
    transformation: [{ width: 800, height: 1000, crop: 'fill' }],
  },
  (error, result) => {
    console.log('Cloudinary callback:', { error, result })
    if (error) {
      reject(error)
    } else if (!result) {
      reject(new Error('Result null'))
    } else {
      resolve(result.secure_url)
    }
  }
)
console.log('File buffer:', file.buffer ? file.buffer.length : 'UNDEFINED')
uploadStream.end(file.buffer)
      })
    })

    const urls = await Promise.all(uploadPromises)

    res.status(200).json({
      success: true,
      urls,
    })
  } catch (error) {
    console.error('Upload error:', error.message)
    res.status(500).json({ success: false, message: error.message })
  }
})

module.exports = router