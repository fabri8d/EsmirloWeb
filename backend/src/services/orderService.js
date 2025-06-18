const { sendEmailOrderUser, sendEmailOrderAdmin } = require("./emailService.js");
const Product = require("../models/products/Product.js");
const ProductVariant = require("../models/products/ProductVariant.js");
const Category = require("../models/products/Category.js");
const OrderItem = require("../models/orders/OrderItem.js");
const Order = require("../models/orders/Order.js");
const Cart = require("../models/orders/Cart.js");
const CartItem = require("../models/orders/CartItem.js");
const User = require("../models/users/User.js");


async function createOrderService(dataSource, orderData) {
  const cartRepo = dataSource.getRepository(Cart);
  const cartItemRepo = dataSource.getRepository(CartItem);
  const orderRepo = dataSource.getRepository(Order);
  const orderItemRepo = dataSource.getRepository(OrderItem);
  const productVariantRepo = dataSource.getRepository(ProductVariant);


  const cart = await cartRepo.findOne({
    where: { id: orderData.cartId, status: "open" },
    relations: ["items", "user"]
  });

  if (!cart) {
    throw new Error("Carrito no encontrado o no abierto.");
  }

  if (cart.items.length === 0) {
    throw new Error("Carrito vacío.");
  }

  const cartItems = await cartItemRepo.find({
    where: { cart: { id: cart.id } },
    relations: ["productVariant", "productVariant.product", "productVariant.product.category"]
  });

  for (const item of cartItems) {
    const variant = item.productVariant;
    if (variant.stock < item.quantity) {
      throw new Error(`Stock insuficiente para ${variant.product.name} (${variant.color}, ${variant.size}).`);
    }
  }

  const user = cart.user;

  const totalAmount = cart.items.reduce((sum, item) => {
    return sum + parseFloat(item.price * item.quantity);
  }, 0);


  const order = orderRepo.create({
    user: user,
    status: "pending",
    totalAmount,
    address: orderData.address ?? null,
    postalCode: orderData.postalCode ?? null,
    province: orderData.province ?? null,
    deliveryMethod: orderData.deliveryMethod || "store_pickup",
    username: user.username,
    userFirstName: user.firstName,
    userLastName: user.lastName,
    userEmail: user.email,
  });

  const savedOrder = await orderRepo.save(order);

  const orderItems = cartItems.map(cartItem =>
    orderItemRepo.create({
      productId: cartItem.productVariant.product.id,
      productName: cartItem.productVariant.product.name,
      productDescription: cartItem.productVariant.product.description,
      productPrice: cartItem.productVariant.product.price,
      productImageUrl: cartItem.productVariant.product.imageUrl,
      productVariantId: cartItem.productVariant.id,
      categoryId: cartItem.productVariant.product.category.id,
      categoryName: cartItem.productVariant.product.category.name,
      variantQuantity: cartItem.quantity,
      variantSize: cartItem.productVariant.size,
      variantColor: cartItem.productVariant.color,
      price: cartItem.productVariant.product.price * cartItem.quantity,
      order: savedOrder
    })
  );
  await orderItemRepo.save(orderItems);

  for (const item of cartItems) {
    const variant = item.productVariant;
    variant.stock -= item.quantity;
    if (variant.stock < 0) {
      throw new Error(`Error interno: stock negativo para ${variant.product.name} (${variant.color}, ${variant.size})`);
    }

    await productVariantRepo.save(variant);
  }

  cart.status = "ordered";
  await cartRepo.save(cart);

  savedOrder.items = orderItems;

  sendEmailOrderUser(user.email, savedOrder);
  const userRepo = dataSource.getRepository(User);
  const adminUsers = await userRepo.find({ where: { role: "admin" } });
  const adminEmails = adminUsers.map(admin => admin.email);

  sendEmailOrderAdmin('leandrobiondi12@gmail.com'/*adminEmails*/, savedOrder);


  return savedOrder;
}



async function getOrderByIdService(dataSource, orderId) {
  const orderRepo = dataSource.getRepository(Order);

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

  const order = await orderRepo.findOne({
    where: { id: orderId },
    relations: ["items"]
  });

  if (!order) {
    throw new Error("Orden no encontrada.");
  }

  order.status = "cancelled";

  await orderRepo.save(order);

  return {
    message: "Orden cancelada con éxito.",
    orderId: order.id
  };
}

async function updateOrderStatusService(dataSource, orderId, newStatus) {
  const orderRepo = dataSource.getRepository(Order);

  const order = await orderRepo.findOne({
    where: { id: orderId },
    relations: ["items"]
  });

  if (!order) {
    throw new Error("Orden no encontrada.");
  }

  const validStatuses = ["pending", "paid", "shipped", "completed", "cancelled"];
  if (!validStatuses.includes(newStatus)) {
    throw new Error("Estado inválido.");
  }

  order.status = newStatus;

  await orderRepo.save(order);

  return {
    message: "Estado de la orden actualizado con éxito.",
    orderId: order.id,
    newStatus: order.status
  };
}

async function getAllOrdersService(dataSource) {
  const orderRepo = dataSource.getRepository(Order);

  const orders = await orderRepo.find({
    relations: ["items", "user"]
  });

  if (orders.length === 0) {
    throw new Error("No se encontraron órdenes.");
  }

  return orders;
}

async function getOrdersByUsernameService(dataSource, username) {
  const orderRepo = dataSource.getRepository(Order);
  const userRepo = dataSource.getRepository(User);
  const user = await userRepo.findOne({
    where: { username: username }
  });

  const orders = await orderRepo.find({
    where: { user: { id: user.id } },
    relations: ["items", "user"]
  });

  if (orders.length === 0) {
    throw new Error("No se encontraron órdenes para este usuario.");
  }

  return orders;
}
async function getOrdersFilteredService(dataSource, filters) {
  const orderRepo = dataSource.getRepository(Order);
  const { status, startDate, endDate, username, page = 1, limit = 10 } = filters;

  let query = orderRepo.createQueryBuilder("order")
    .leftJoinAndSelect("order.items", "items")
    .leftJoinAndSelect("order.user", "user");

  if (status) query = query.andWhere("order.status = :status", { status });
  if (username) query = query.andWhere("user.username LIKE :username", { username: `%${username}%` });
  if (startDate) query = query.andWhere("order.createdAt >= :startDate", { startDate: new Date(startDate).toISOString() });
  if (endDate) {
    const end = new Date(endDate);
    end.setDate(end.getDate() + 1);
    query = query.andWhere("order.createdAt < :endDate", { endDate: end.toISOString() });
  }

  const skip = (page - 1) * limit;

  const [orders, total] = await query
    .skip(skip)
    .take(limit)
    .getManyAndCount();

  return { orders, total };
}



module.exports = {
  createOrderService,
  getOrderByIdService,
  getOrdersByUserIdService,
  cancelOrderService,
  updateOrderStatusService,
  getAllOrdersService,
  getOrdersByUsernameService,
  getOrdersFilteredService
};