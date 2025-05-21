class ProductVariant {
  constructor(size, color, stock, product = null) {
    this.size = size;
    this.color = color;
    this.stock = stock;
    this.product = product; // referencia a Product para relación inversa
  }
}

module.exports = ProductVariant;
