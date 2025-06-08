const { addProductToCartService,
  getCartService,
  updateCartItemService,
  removeCartItemService,
  clearCartService,
  updateCartStatusService,
  getItemCountService
} = require('../services/cartService');


 async function addProductToCart(req, res){
  try {
    const dataSource = req.app.get('dataSource');
    const userId = req.user.id; // Asegúrate de que el ID del usuario esté disponible en req.user
    const productId = req.body.productId;
    const quantity = req.body.quantity || 1; // Si no se proporciona cantidad, usar 1

    const result = await addProductToCartService(dataSource, userId, productId, quantity);
    res.status(201).json(result);
  } catch (err) {
    console.error("Error al agregar producto al carrito:", err);
    res.status(500).json({ error: err.message });
  }
}

async function getCart(req, res) {
  try {
    const dataSource = req.app.get('dataSource');
    const userId = req.user.id; // Asegúrate de que el ID del usuario esté disponible en req.user
    const cart = await getCartService(dataSource, userId);
    res.json(cart);
  } catch (err) {
    console.error("Error al obtener el carrito:", err);
    res.status(500).json({ error: err.message });
  }
}

async function updateCartStatus(req, res) {
  try {
    const dataSource = req.app.get('dataSource');
    const userId = req.user.id; // Asegúrate de que el ID del usuario esté disponible en req.user
    const cartId = req.params.id;
    const newStatus = req.body.status; // Asumiendo que el nuevo estado se envía en el cuerpo de la solicitud

    const result = await updateCartStatusService(dataSource, cartId, newStatus);
    res.json(result);
  } catch (err) {
    console.error("Error al actualizar el estado del carrito:", err);
    res.status(500).json({ error: err.message });
  }
}

async function updateCartItem(req, res) {
  try {
    const dataSource = req.app.get('dataSource');
    const userId = req.user.id; 
    const cartItemId = req.params.id;
    const quantity = req.body.quantity;
    const size = req.body.size;
    console.log("Datos recibidos:", { userId, cartItemId, quantity, size });
    const result = await updateCartItemService(dataSource, userId, cartItemId, quantity, size);
    res.json(result);
  } catch (err) {
    console.error("Error al actualizar el artículo del carrito:", err);
    res.status(500).json({ error: err.message });
  }
}

async function removeCartItem(req, res) {
  try {
    const dataSource = req.app.get('dataSource');
    const userId = req.user.id;
    const cartItemId = req.params.id;

    const result = await removeCartItemService(dataSource, userId, cartItemId);
    res.json(result);
  } catch (err) {
    console.error("Error al eliminar el artículo del carrito:", err);
    res.status(500).json({ error: err.message });
  }
}

async function clearCart(req, res) {
  try {
    const dataSource = req.app.get('dataSource');
    const userId = req.user.id; 

    const result = await clearCartService(dataSource, userId);
    res.json(result);
  } catch (err) {
    console.error("Error al limpiar el carrito:", err);
    res.status(500).json({ error: err.message });
  }
}
async function getItemCount(req, res) {
  try {
    const dataSource = req.app.get('dataSource');
    const userId = req.user.id;

    const count = await getItemCountService(dataSource, userId);
    res.json({ count });
  } catch (err) {
    console.error("Error al obtener la cantidad de artículos en el carrito:", err);
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  addProductToCart,
  getCart,
  updateCartItem,
  removeCartItem,
  clearCart,
  updateCartStatus,
  getItemCount
};