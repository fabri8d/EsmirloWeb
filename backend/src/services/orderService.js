const Product = require("../models/products/Product.js");
const ProductVariant = require("../models/products/ProductVariant.js");
const Category = require("../models/products/Category.js");
const OrderItem = require("../models/orders/OrderItem.js");
const Order = require("../models/orders/Order.js");
const Cart = require("../models/orders/Cart.js");
const CartItem = require("../models/orders/CartItem.js");

async function createOrderService(dataSource, orderData) {
  const cartRepo = dataSource.getRepository(Cart);
  const cartItemRepo = dataSource.getRepository(CartItem);
  const orderRepo = dataSource.getRepository(Order);
  const orderItemRepo = dataSource.getRepository(OrderItem);

  // Buscar el carrito con sus items y usuario
  const cart = await cartRepo.findOne({
    where: { id: cartId, status: "open" },
    relations: ["items", "user"]
  });

  if (!cart) {
    throw new Error("Carrito no encontrado o no abierto.");
  }

  if (cart.items.length === 0) {
    throw new Error("Carrito vacio.");
  }

  const user = cart.user;

  // Calcular el total
  const totalAmount = cart.items.reduce((sum, item) => {
    return sum + parseFloat(item.price);
  }, 0);

  // Crear la orden
  const order = orderRepo.create({
    user: user,
    status: "pending",
    totalAmount,
    aaddress: orderData.address ?? null,
    postalCode: orderData.postalCode ?? null,
    province: orderData.province ?? null,
    deliveryMethod: orderData.deliveryMethod || "store_pickup",
    username: user.username,
    userFirstName: user.firstName,
    userLastName: user.lastName,
    userEmail: user.email,
    items: [] // Se llenará abajo
  });

  // Crear los items de la orden
  const orderItems = cart.items.map(cartItem =>
    orderItemRepo.create({
      productId: cartItem.productId,
      productName: cartItem.productName,
      productDescription: cartItem.productDescription,
      productPrice: cartItem.productPrice,
      productImageUrl: cartItem.productImageUrl,
      productVariantId: cartItem.productVariantId,
      categoryId: cartItem.categoryId,
      categoryName: cartItem.categoryName,
      variantQuantity: cartItem.quantity,
      variantSize: cartItem.variantSize,
      variantColor: cartItem.variantColor,
      price: cartItem.price,
      order: order
    })
  );

  order.items = orderItems;

  // Guardar la orden y los items
  await orderRepo.save(order);

  // Marcar el carrito como "confirmed"
  cart.status = "confirmed";
  await cartRepo.save(cart);

  return order;
}

async function getOrderByIdService(dataSource, orderId) {
  const orderRepo = dataSource.getRepository(Order);

  // Buscar la orden por ID con sus items
  const order = await orderRepo.findOne({
    where: { id: orderId },
    relations: ["items", "user"]
  });

  if (!order) {
    throw new Error("Orden no encontrada.");
  }

  return order;
}

async function getOrdersByUserIdService(dataSource, userId) {
  const orderRepo = dataSource.getRepository(Order);

  // Buscar las órdenes del usuario con sus items
  const orders = await orderRepo.find({
    where: { user: { id: userId } },
    relations: ["items", "user"]
  });

  if (orders.length === 0) {
    throw new Error("No se encontraron órdenes para este usuario.");
  }

  return orders;
}

async function cancelOrderService(dataSource, orderId) {
  const orderRepo = dataSource.getRepository(Order);

  // Buscar la orden por ID
  const order = await orderRepo.findOne({
    where: { id: orderId },
    relations: ["items"]
  });

  if (!order) {
    throw new Error("Orden no encontrada.");
  }

  // Cambiar el estado de la orden a "cancelled"
  order.status = "cancelled";

  // Guardar los cambios
  await orderRepo.save(order);

  return {
    message: "Orden cancelada con éxito.",
    orderId: order.id
  };
}

async function updateOrderStatusService(dataSource, orderId, newStatus) {
  const orderRepo = dataSource.getRepository(Order);

  // Buscar la orden por ID
  const order = await orderRepo.findOne({
    where: { id: orderId },
    relations: ["items"]
  });

  if (!order) {
    throw new Error("Orden no encontrada.");
  }

  // Validar el nuevo estado
  const validStatuses = ["pending", "paid", "shipped", "completed", "cancelled"];
  if (!validStatuses.includes(newStatus)) {
    throw new Error("Estado inválido.");
  }

  // Actualizar el estado de la orden
  order.status = newStatus;

  // Guardar los cambios
  await orderRepo.save(order);

  return {
    message: "Estado de la orden actualizado con éxito.",
    orderId: order.id,
    newStatus: order.status
  };
}

async function getAllOrdersService(dataSource) {
  const orderRepo = dataSource.getRepository(Order);

  // Obtener todas las órdenes con sus items
  const orders = await orderRepo.find({
    relations: ["items", "user"]
  });

  if (orders.length === 0) {
    throw new Error("No se encontraron órdenes.");
  }

  return orders;
}
module.exports = {
  createOrderService,
  getOrderByIdService,
  getOrdersByUserIdService,
  cancelOrderService,
  updateOrderStatusService,
  getAllOrdersService
};