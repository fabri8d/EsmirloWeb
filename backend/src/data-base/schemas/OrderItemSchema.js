const { EntitySchema } = require("typeorm");
const OrderItem = require("../../models/orders/OrderItem.js");
module.exports = new EntitySchema({
  name: "OrderItem",
  target: OrderItem,
  tableName: "order_items",
  columns: {
    id: { primary: true, type: "int", generated: true },
    productId: { type: "int", nullable: false },
    productName: { type: "varchar" },
    productDescription: { type: "text" },
    productPrice: { type: "decimal" },
    productImageUrl: { type: "varchar"},
    productVariantId: { type: "int", nullable: false },
    categoryId: { type: "int", nullable: false },
    categoryName: { type: "varchar" },
    variantQuantity: { type: "int", default: 1 },
    variantSize: { type: "varchar" },
    variantColor: { type: "varchar" },
    createdAt: { type: "timestamp", createDate: true },
    updatedAt: { type: "timestamp", updateDate: true }
  },
  relations: {
    order: {
      type: "many-to-one",
      target: "Order",
      inverseSide: "items",
      joinColumn: true,
      onDelete: "CASCADE"
    },
  }
});