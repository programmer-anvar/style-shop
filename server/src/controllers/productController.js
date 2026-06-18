const Product = require('../models/Product');

const getAllProducts = async (req, res) => {
    try {
        const {
            category,
            brand,
            size,
            color,
            minPrice,
            maxPrice,
            sort,
            search,
            page,
            limit
        } = req.query

        const filter = {}

        if(category) filter.category = category
        if(brand) filter.brand = brand
        if(size) filter.sizes = { $in: [size]}
        if(color) filter.colors = { $elemMatch: { name: color } }
        if(minPrice || maxPrice){
            filter.price = {}
            if(minPrice) filter.price.$gte = Number(minPrice)
                if(maxPrice) filter.price.$lte = Number(maxPrice)
        }

        if(search) {
            filter.name = { $regex: search, $options: 'i' }
        }

        const sortOptions = {};
        if(sort === 'popular') sortOptions.sold = -1
        else if(sort === 'newest') sortOptions.createdAt = -1
        else if(sort === 'price-low') sortOptions.createdAt = 1
        else if(sort === 'price-high') sortOptions.price = -1
        else sortOptions.createdAt = -1

        const pageNumber = Number(page) || 1
        const limitNumber = Number(limit) || 12
        const skip = (pageNumber - 1) * limitNumber

        const total = await Product.countDocuments(filter)

        const products = await Product.find(filter)
        .sort(sortOptions)
        .skip(skip)
        .limit(limitNumber)

        res.status(200).json({
            success: true,
            total,
            page: pageNumber,
            pages: Math.ceil(total / limitNumber),
            products
        })
    } catch (error) {
        res.status(500)
        throw error
    }
}

const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
        if(!product){
            res.status(404)
            throw new Error("Mahsulot topilmadi")
        }

        res.status(200).json({
            success: true,
            product
        })
    } catch (error) {
        res.status(res.statusCode === 200 ? 500 : res.statusCode)
        throw error
    }
}

const createProduct = async (req, res) => {
    try {
        const {
            name,
            description,
            price,
            discountPrice,
            category,
            subCategory,
            images,
            sizes,
            colors,
            brand,
            stock,
            isFeatured,
        } = req.body

        const product = await Product.create({
            name,
            description,
            price,
            discountPrice,
            category,
            subCategory,
            images,
            sizes,
            colors,
            brand,
            stock,
            isFeatured
        })

        res.status(201).json({
            success: true,
            product
        })
    } catch (error) {
        res.status(500)
        throw error
    }
}

const updateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)

        if(!product){
            res.status(404)
            throw new Error('Mahsulot topilmadi')
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        )

        res.status(200).json({
            success: true,
            product: updateProduct
        })
    } catch (error) {
        res.status(res.statusCode === 200 ? 500 : res.statusCode)
    throw error
    }
}

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)

    if (!product) {
      res.status(404)
      throw new Error('Mahsulot topilmadi')
    }

    await Product.findByIdAndDelete(req.params.id)

    res.status(200).json({
      success: true,
      message: 'Mahsulot o\'chirildi',
    })
  } catch (error) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode)
    throw error
  }
}

module.exports = {getAllProducts, getProductById, createProduct, updateProduct, deleteProduct}