async function addProductToCartService(dataSource, userId, productVariantId, quantity) {
  const cartRepo = dataSource.getRepository("Cart");
  const cartItemRepo = dataSource.getRepository("CartItem");
  const productVariantRepo = dataSource.getRepository("ProductVariant");
  console.log("User ID:", userId);
  console.log("Product Variant ID:", productVariantId);
  let cart = await cartRepo.findOne({
    where: { user: { id: userId }, status: "open" },
  });

  if (!cart) {
    const Cart = require("../models/orders/Cart.js");
    cart = new Cart();
    cart.user = { id: userId };
    await cartRepo.save(cart);
  }

  const productVariant = await productVariantRepo.findOne({
    where: { id: productVariantId },
    relations: ["product"]
  });

  if (!productVariant) {
    throw new Error("Product variant not found.");
  }

  const price = productVariant.product.price;
  if (price == null) {
    throw new Error("Product price not found.");
  }

  let cartItem = await cartItemRepo.findOne({
    where: {
      cart: { id: cart.id },
      productVariant: { id: productVariantId }
    },
    relations: ["productVariant"]
  });

  if (cartItem) {
    cartItem.quantity += quantity;
    cartItem.price = price;
  } else {
    const CartItem = require("../models/orders/CartItem.js");
    cartItem = new CartItem(null, quantity, price, cart, productVariant);
  }

  await cartItemRepo.save(cartItem);

  cart = await cartRepo.findOne({
    where: { id: cart.id },
    relations: ["items", "items.productVariant"]
  });

  const cleanCart = {
    ...cart,
    items: cart.items.map(item => ({
      id: item.id,
      quantity: item.quantity,
      price: item.price,
      productVariant: item.productVariant,
    }))
  };

  return cleanCart;
}


async function getCartService(dataSource, userId) {
  const cartRepo = dataSource.getRepository("Cart");

  let cart = await cartRepo.findOne({
    where: { user: { id: userId }, status: "open" },
    relations: [
      "items",
      "items.productVariant",
      "items.productVariant.product",
      "items.productVariant.product.variants" 
    ]
  });

  if (!cart) {

    cart = new (require("../models/orders/Cart.js"))();
    cart.user = { id: userId };
    await cartRepo.save(cart);

    cart = await cartRepo.findOne({
      where: { id: cart.id },
      relations: [
        "items",
        "items.productVariant",
        "items.productVariant.product",
        "items.productVariant.product.variants" 
      ]
    });
  }

  return cart;
}


async function updateCartItemService(dataSource, userId, cartItemId, quantity, size) {
  const cartRepo = dataSource.getRepository("Cart");
  const cartItemRepo = dataSource.getRepository("CartItem");
  const productVariantRepo = dataSource.getRepository("ProductVariant");

  const cart = await cartRepo.findOne({
    where: { user: { id: userId }, status: "open" },
    relations: ["items"]
  });

  if (!cart) {
    throw new Error("Cart not found.");
  }

  const cartItem = await cartItemRepo.findOne({
    where: { id: cartItemId, cart: { id: cart.id } },
    relations: ["productVariant", "productVariant.product"]
  });

  if (!cartItem) {
    throw new Error("Cart item not found.");
  }
  console.log("Producto ID:", cartItem.productVariant.product.id);
  console.log("Color actual variante:", cartItem.productVariant.color);
  console.log("Tamaño solicitado:", size);

  const nuevoVariant = await productVariantRepo.findOne({
    where: {
      product: { id: cartItem.productVariant.product.id },
      color: cartItem.productVariant.color,
      size: size,

    }
  });

  if (!nuevoVariant) {
    throw new Error("No existe variante con el tamaño y color solicitado.", cartItem.productVariant.color);
  }

  // Actualizar el item del carrito con la nueva variante y cantidad
  cartItem.productVariant = nuevoVariant;
  cartItem.quantity = quantity;
  cartItem.price = nuevoVariant.price;

  // Guardar cambios
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

async function getItemCountService(dataSource, userId) {
  const cartRepo = dataSource.getRepository("Cart");
  const cart = await cartRepo.findOne({
    where: { user: { id: userId }, status: "open" },
    relations: ["items"]
  });

  if (!cart) {
    return 0; 
  }
  const totalCount = cart.items.reduce((acc, item) => acc + item.quantity, 0);
  return totalCount;
}
module.exports = {
  addProductToCartService,
  getCartService,
  updateCartItemService,
  removeCartItemService,
  clearCartService,
  updateCartStatusService,
  getItemCountService
};