const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Mahsulot nomi majburiy'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Tavsif majburiy'],
    },
    price: {
      type: Number,
      required: [true, 'Narx majburiy'],
      min: [0, "Narx manfiy bo'lmaydi"],
    },
    discountPrice: {
      type: Number,
      default: 0,
    },
    category: {
      type: String,
      required: [true, 'Kategoriya majburiy'],
      enum: ['men', 'women', 'kids', 'shoes', 'accessories'],
    },
    subCategory: {
      type: String,
      default: '',
    },
    images: [
      {
        type: String,
      },
    ],
    sizes: [
      {
        type: String,
        enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
      },
    ],
    colors: [
      {
        name: { type: String },
        hex: { type: String },
      },
    ],
    brand: {
      type: String,
      default: '',
    },
    stock: {
      type: Number,
      required: true,
      default: 0,
    },
    sold: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: 0,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    reviews: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        name: { type: String },
        rating: { type: Number },
        comment: { type: String },
      },
    ],
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
)

const Product = mongoose.model('Product', productSchema)

module.exports = Product