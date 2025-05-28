const ProductVariant = require("../models/products/ProductVariant.js");

async function addProductToCartService(dataSource, userId, productVariantId, quantity) {
  const cartRepo = dataSource.getRepository("Cart");
  const cartItemRepo = dataSource.getRepository("CartItem");
  const productVariantRepo = dataSource.getRepository("ProductVariant");
  const productRepo = dataSource.getRepository("Product");

  // Find or create the user's cart
  let cart = await cartRepo.findOne({
    where: { user: { id: userId }, status: "open" },
    relations: ["items", "items.productVariant"]
  });

  if (!cart) {
    cart = new (require("../models/orders/Cart.js"))();
    cart.user = { id: userId };
    await cartRepo.save(cart);
  }

  // Find the product variant with product relation
  const productVariant = await productVariantRepo.findOne({
    where: { id: productVariantId },
    relations: ["product"]
  });

  if (!productVariant) {
    throw new Error("Product variant not found.");
  }

  // Obtener precio desde el producto padre
  const price = productVariant.product.price;
  if (price == null) {
    throw new Error("Product price not found.");
  }

  // Check if the item already exists in the cart
  let cartItem = cart.items.find(item => item.productVariant.id === productVariantId);

  if (cartItem) {
    // Update quantity and price
    cartItem.quantity += quantity;
    cartItem.price = price;
  } else {
    // Create a new CartItem
    cartItem = new (require("../models/orders/CartItem.js"))(
      null, quantity, price, cart, productVariant
    );
    cart.items.push(cartItem);
  }

  // Save the updated cart and items
  await cartItemRepo.save(cartItem);
  await cartRepo.save(cart);

  // Limpiar la estructura para evitar referencias circulares
  const cleanCart = {
    ...cart,
    items: cart.items.map(item => ({
      id: item.id,
      quantity: item.quantity,
      price: item.price,
      productVariant: item.productVariant,
      // quitamos 'cart' para evitar ciclo
    }))
  };

  return cleanCart;
}

async function getCartService(dataSource, userId) {
  const cartRepo = dataSource.getRepository("Cart");

  // Buscar carrito abierto del usuario con relaciones completas
  let cart = await cartRepo.findOne({
    where: { user: { id: userId }, status: "open" },
    relations: [
      "items",
      "items.productVariant",
      "items.productVariant.product"
    ]
  });

  if (!cart) {
    // Si no tiene carrito abierto, crear uno nuevo
    cart = new (require("../models/orders/Cart.js"))();
    cart.user = { id: userId };
    await cartRepo.save(cart);

    // Cargar carrito vacío con relaciones para evitar errores frontend
    cart = await cartRepo.findOne({
      where: { id: cart.id },
      relations: [
        "items",
        "items.productVariant",
        "items.productVariant.product"
      ]
    });
  }

  return cart;
}


async function updateCartItemService(dataSource, userId, cartItemId, quantity) {
  const cartRepo = dataSource.getRepository("Cart");
  const cartItemRepo = dataSource.getRepository("CartItem");

  const cart = await cartRepo.findOne({
    where: { user: { id: userId }, status: "open" },
    relations: ["items"]
  });

  if (!cart) {
    throw new Error("Cart not found.");
  }

  const cartItem = await cartItemRepo.findOne({
    where: { id: cartItemId, cart: { id: cart.id } },
    relations: ["productVariant"]
  });

  if (!cartItem) {
    throw new Error("Cart item not found.");
  }

  cartItem.quantity = quantity;
  cartItem.price = cartItem.productVariant.price;

  return await cartItemRepo.save(cartItem);
}
async function removeCartItemService(dataSource, userId, cartItemId) {
  const cartRepo = dataSource.getRepository("Cart");
  const cartItemRepo = dataSource.getRepository("CartItem");

  const cart = await cartRepo.findOne({
    where: { user: { id: userId }, status: "open" },
    relations: ["items"]
  });

  if (!cart) throw new Error("Cart not found.");

  const cartItem = await cartItemRepo.findOne({
    where: { id: cartItemId, cart: { id: cart.id } }
  });

  if (!cartItem) throw new Error("Cart item not found.");

  await cartItemRepo.remove(cartItem);

  return { message: "Item removed from cart." };
}
async function updateCartStatusService(dataSource, cartId, newStatus) {
  const cartRepo = dataSource.getRepository("Cart");

  // Find the cart by ID
  const cart = await cartRepo.findOne({
    where: { id: cartId },
    relations: ["items"]
  });

  if (!cart) {
    throw new Error("Cart not found.");
  }

  // Update the status
  cart.status = newStatus;

  // Save the updated cart
  return await cartRepo.save(cart);
  
}

async function clearCartService(dataSource, userId) {
  const cartRepo = dataSource.getRepository("Cart");

  // Find the user's cart
  const cart = await cartRepo.findOne({
    where: { user: { id: userId }, status: "open" },
    relations: ["items"]
  });

  if (!cart) {
    throw new Error("Cart not found.");
  }

  // Clear the cart items
  cart.items = [];

  return await cartRepo.save(cart);
}
module.exports = {
  addProductToCartService,
  getCartService,
  updateCartItemService,
  removeCartItemService,
  clearCartService,
  updateCartStatusService
};