const { EntitySchema } = require("typeorm");
const Order = require("../../models/orders/Order.js");

module.exports = new EntitySchema({
  name: "Order",
  target: Order,
  tableName: "orders",
  columns: {
    id: { primary: true, type: "int", generated: true },
    createdAt: { type: "timestamp", createDate: true },
    updatedAt: { type: "timestamp", updateDate: true },
    status: {
      type: "enum",
      enum: ["pending", "paid", "shipped", "completed", "cancelled"],
      default: "pending"
    },
    totalAmount: { type: "decimal", precision: 10, scale: 2 },
    deliveryMethod: {
      type: "enum",
      enum: ["store_pickup", "home_delivery"],
      default: "store_pickup"
    },
    address: { type: "varchar", length: 255, nullable: true },
    postalCode: { type: "varchar", length: 20, nullable: true },
    province: { type: "varchar", length: 100, nullable: true },
    username: { type: "varchar" },
    userFirstName: { type: "varchar" },
    userLastName: { type: "varchar" },
    userEmail: { type: "varchar" },
},
  relations: {
    user: {
      type: "many-to-one",
      target: "User",
      nullable: true,
      onDelete: "SET NULL",
    },
    items: {
      type: "one-to-many",
      target: "OrderItem",
      inverseSide: "order",
      cascade: true
    }
  }
});