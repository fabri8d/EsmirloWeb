class OrderItem {
  constructor(id, productId, productName, productDescription, productPrice, productImageUrl, productVariantId, categoryId, categoryName, variantQuantity, variantSize, variantColor, createdAt, updatedAt, order) {
    this.id = id;
    this.productId = productId;
    this.productName = productName;
    this.productDescription = productDescription;
    this.productPrice = productPrice;
    this.productImageUrl = productImageUrl;
    this.productVariantId = productVariantId;
    this.categoryId = categoryId;
    this.categoryName = categoryName;
    this.variantQuantity = variantQuantity;
    this.variantSize = variantSize;
    this.variantColor = variantColor;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.order = order;
  }
}

module.exports = OrderItem;
