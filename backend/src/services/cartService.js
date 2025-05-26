const ProductVariant = require("../models/products/ProductVariant.js");

async function addProductToCartService(dataSource, userId, productVariantId, quantity) {
  const cartRepo = dataSource.getRepository("Cart");
  const cartItemRepo = dataSource.getRepository("CartItem");
  const productVariantRepo = dataSource.getRepository(ProductVariant);

  // Find or create the user's cart
  let cart = await cartRepo.findOne({
    where: { user: { id: userId }, status: "open" },
    relations: ["items"]
  });

  if (!cart) {
    cart = new (require("../models/orders/Cart.js"))();
    cart.user = { id: userId }; // Assuming user is an object with an id
    await cartRepo.save(cart);
  }

  // Find the product variant
  const productVariant = await productVariantRepo.findOne({
    where: { id: productVariantId }
  });

  if (!productVariant) {
    throw new Error("Product variant not found.");
  }

  // Check if the item already exists in the cart
  let cartItem = cart.items.find(item => item.productVariant.id === productVariantId);

  if (cartItem) {
    // Update quantity and price
    cartItem.quantity += quantity;
    cartItem.price = productVariant.price; // Update price to current price
  } else {
    // Create a new CartItem
    cartItem = new (require("../models/orders/CartItem.js"))(
      null, quantity, productVariant.price, cart, productVariant
    );
    cart.items.push(cartItem);
  }

  // Save the updated cart and items
  await cartItemRepo.save(cartItem);
  return await cartRepo.save(cart);
}
async function getCartService(dataSource, userId) {
  const cartRepo = dataSource.getRepository("Cart");

  // Find the user's cart
  const cart = await cartRepo.findOne({
    where: { user: { id: userId }, status: "open" },
    relations: ["items", "items.productVariant"]
  });

  if (!cart) {
    throw new Error("Cart not found.");
  }

  return cart;
}
async function updateCartItemService(dataSource, userId, cartItemId, quantity) {
  const cartRepo = dataSource.getRepository("Cart");
  const cartItemRepo = dataSource.getRepository("CartItem");

  // Find the user's cart
  const cart = await cartRepo.findOne({
    where: { user: { id: userId }, status: "open" },
    relations: ["items"]
  });

  if (!cart) {
    throw new Error("Cart not found.");
  }

  // Find the cart item
  const cartItem = await cartItemRepo.findOne({
    where: { id: cartItemId, cart: { id: cart.id } },
    relations: ["productVariant"]
  });

  if (!cartItem) {
    throw new Error("Cart item not found.");
  }

  // Update quantity and price
  cartItem.quantity = quantity;
  cartItem.price = cartItem.productVariant.price; // Update price to current price

  // Save the updated cart item
  return await cartItemRepo.save(cartItem);
}
async function removeCartItemService(dataSource, userId, cartItemId) {
  const cartRepo = dataSource.getRepository("Cart");
  const cartItemRepo = dataSource.getRepository("CartItem");

  // Find the user's cart
  const cart = await cartRepo.findOne({
    where: { user: { id: userId }, status: "open" },
    relations: ["items"]
  });

  if (!cart) {
    throw new Error("Cart not found.");
  }

  // Find the cart item
  const cartItem = await cartItemRepo.findOne({
    where: { id: cartItemId, cart: { id: cart.id } }
  });

  if (!cartItem) {
    throw new Error("Cart item not found.");
  }

  // Remove the item from the cart
  await cartItemRepo.remove(cartItem);

  // Update the cart items
  cart.items = cart.items.filter(item => item.id !== cartItemId);
  
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
  clearCartService
};