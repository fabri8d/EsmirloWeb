const {createOrderService, getOrderByIdService, updateOrderStatusService, cancelOrderService, getAllOrdersService, getOrdersByUserIdService, getOrdersByUsernameService, getOrdersFilteredService} = require('../services/orderService');

async function createOrder(req, res) {
  try {
    const dataSource = req.app.get('dataSource');
    const orderData = req.body;

    const result = await createOrderService(dataSource, orderData);
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
    const newStatus = req.body.status; 

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
    const userId = req.user.id; 

    const orders = await getOrdersByUserIdService(dataSource, userId);
    res.json(orders);
  } catch (err) {
    console.error("Error fetching orders by user ID:", err);
    res.status(500).json({ error: err.message });
  }
}
async function getOrdersByUsername(req, res) {
  try {
    const dataSource = req.app.get('dataSource');
    const username = req.user.username; 

    const orders = await getOrdersByUsernameService(dataSource, username);
    res.json(orders);
  } catch (err) {
    console.error("Error fetching orders by user ID:", err);
    res.status(500).json({ error: err.message });
  }
}
async function getOrdersFiltered(req, res) {
  try {
    const dataSource = req.app.get('dataSource');
    const { startDate, endDate, status, username, page = 1, limit = 5 } = req.query;

    const filters = {
      startDate,
      endDate,
      status,
      username,
      page: parseInt(page),
      limit: parseInt(limit)
    };

    const { orders, total } = await getOrdersFilteredService(dataSource, filters);

    res.json({ orders, total });
  } catch (err) {
    console.error("Error fetching filtered orders:", err);
    res.status(500).json({ error: err.message });
  }
}


module.exports = {
  createOrder,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
  getAllOrders,
  getOrdersByUserId,
  getOrdersByUsername,
  getOrdersFiltered
};