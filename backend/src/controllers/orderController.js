const {createOrderService, getOrderByIdService, updateOrderStatusService, cancelOrderService, getAllOrdersService, getOrdersByUserIdService} = require('../services/orderService');

async function createOrder(req, res) {
  try {
    const dataSource = req.app.get('dataSource');
    const userId = req.user.id; // Assuming user ID is available in req.user
    const orderData = req.body;

    const result = await createOrderService(dataSource, userId, orderData);
    res.status(201).json(result);
  } catch (err) {
    console.error("Error creating order:", err);
    res.status(500).json({ error: err.message });
  }
} 
async function getOrderById(req, res) {
  try {
    const dataSource = req.app.get('dataSource');
    const orderId = req.params.id;

    const order = await getOrderByIdService(dataSource, orderId);
    res.json(order);
  } catch (err) {
    console.error("Error fetching order by ID:", err);
    res.status(500).json({ error: err.message });
  }
}
async function updateOrderStatus(req, res) {
  try {
    const dataSource = req.app.get('dataSource');
    const orderId = req.params.id;
    const newStatus = req.body.status; // Assuming status is sent in the request body

    const result = await updateOrderStatusService(dataSource, orderId, newStatus);
    res.json(result);
  } catch (err) {
    console.error("Error updating order status:", err);
    res.status(500).json({ error: err.message });
  }
}
async function cancelOrder(req, res) {
  try {
    const dataSource = req.app.get('dataSource');
    const orderId = req.params.id;

    const result = await cancelOrderService(dataSource, orderId);
    res.json(result);
  } catch (err) {
    console.error("Error cancelling order:", err);
    res.status(500).json({ error: err.message });
  }
}
async function getAllOrders(req, res) {
  try {
    const dataSource = req.app.get('dataSource');
    const orders = await getAllOrdersService(dataSource);
    res.json(orders);
  } catch (err) {
    console.error("Error fetching all orders:", err);
    res.status(500).json({ error: err.message });
  }
}
async function getOrdersByUserId(req, res) {
  try {
    const dataSource = req.app.get('dataSource');
    const userId = req.user.id; // Assuming user ID is available in req.user

    const orders = await getOrdersByUserIdService(dataSource, userId);
    res.json(orders);
  } catch (err) {
    console.error("Error fetching orders by user ID:", err);
    res.status(500).json({ error: err.message });
  }
}
module.exports = {
  createOrder,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
  getAllOrders,
  getOrdersByUserId
};