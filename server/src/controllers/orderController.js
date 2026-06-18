const Order = require("../models/Order");
const Product = require("../models/Product");

const createOrder = async (req, res) => {
  try {
    const {
      items,
      shippingAddress,
      paymentMethod,
      subtotal,
      shippingPrice,
      total,
    } = req.body;
    if (!items || items.length === 0) {
      res.status(400);
      throw new Error("Buyurtmada mahsulot yo'q");
    }

    const order = await Order.create({
      user: req.user._id,
      items,
      shippingAddress,
      paymentMethod,
      subtotal,
      shippingPrice,
      total,
    });

    for (const item of items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity, sold: item.quantity }
      });
    }

    res.status(201).json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode);
    throw error;
  }
};

const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate("items.product", "name images price");

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    res.status(500);
    throw error;
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "name email")
      .populate("items.product", "name images price");

    if (!order) {
      res.status(404);
      throw new Error("Buyurtma topilmadi");
    }

    if (
      order.user._id.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      res.status(403);
      throw new Error("Bu buyurtmani ko'rishga ruxsat yo'q");
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode);
    throw error;
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .sort({ createdAt: -1 })
      .populate("user", "name email");

    const total = await Order.countDocuments();

    const totalRevenue = orders.reduce((acc, order) => {
      return acc + order.total;
    }, 0);

    res.status(200).json({
      success: true,
      total,
      totalRevenue,
      orders,
    });
  } catch (error) {
    res.status(500);
    throw error;
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      res.status(404);
      throw new Error("Buyurtma topilmadi");
    }

    order.status = status;

    if (status === "delivered") {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
    }

    if (status === "cancelled") {
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: item.quantity, sold: -item.quantity },
        });
      }
    }

    await order.save();

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode);
    throw error;
  }
};


module.exports = {createOrder, getMyOrders, getOrderById, getAllOrders, updateOrderStatus}