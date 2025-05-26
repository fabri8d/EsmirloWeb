class CartItem {
  constructor(id, quantity, price, cart, productVariant) {
    this.id = id;
    this.quantity = quantity;
    this.price = price;
    this.cart = cart;
    this.productVariant = productVariant;
  }
}

module.exports = CartItem;
