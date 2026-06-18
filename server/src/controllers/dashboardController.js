const Order = require('../models/Order')
const Product = require('../models/Product')
const User = require('../models/User')

const getDashboardStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments()
    const totalProducts = await Product.countDocuments()
    const totalUsers = await User.countDocuments()

    const revenueResult = await Order.aggregate([
      { $match: { status: { $ne: 'cancelled' } } },
      { $group: { _id: null, total: { $sum: '$total' } } },
    ])

    const totalRevenue = revenueResult[0]?.total || 0

    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('user', 'name email')

    res.status(200).json({
      success: true,
      stats: {
        totalOrders,
        totalProducts,
        totalUsers,
        totalRevenue,
      },
      recentOrders,
    })
  } catch (error) {
    res.status(500)
    throw error
  }
}

module.exports = { getDashboardStats }