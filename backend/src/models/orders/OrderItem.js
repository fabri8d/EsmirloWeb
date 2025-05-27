class OrderItem {
  constructor() {
    this.id = undefined;
    this.productId = undefined;
    this.productName = '';
    this.productDescription = '';
    this.productPrice = 0.00;
    this.productImageUrl = '';
    this.productVariantId = undefined;
    this.categoryId = undefined;
    this.categoryName = '';
    this.variantQuantity = 1;
    this.variantSize = '';
    this.variantColor = '';
    this.createdAt = undefined;
    this.updatedAt = undefined;
    this.order = undefined;
  }
}

module.exports = OrderItem;
