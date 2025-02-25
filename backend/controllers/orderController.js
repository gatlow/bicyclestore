const User = require("../models/User");
const Order = require("../models/Order");

// Получение всех заказов
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("userId").populate("items.productId");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Получение одного заказа по ID
exports.getOrderById = async (req, res) => {
  const { id } = req.params;
  try {
    const order = await Order.findById(id).populate("userId").populate("items.productId");
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Создание нового заказа
exports.createOrder = async (req, res) => {
  const { userId, items, total } = req.body;
  try {
    const order = new Order({ userId, items, total });
    await order.save();
    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ message: "Invalid data", error });
  }
};

// Обновление заказа по ID
exports.updateOrder = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const order = await Order.findByIdAndUpdate(id, { status }, { new: true });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Удаление заказа по ID
exports.deleteOrder = async (req, res) => {
  const { id } = req.params;
  try {
    const order = await Order.findByIdAndDelete(id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
