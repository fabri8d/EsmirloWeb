const { EntitySchema } = require("typeorm");
const Cart = require("../../models/orders/Cart.js");

module.exports = new EntitySchema({
  name: "Cart",
  target: Cart,
  tableName: "carts",
  columns: {
    id: { primary: true, type: "int", generated: true },
    createdAt: { type: "timestamp", createDate: true },
    updatedAt: { type: "timestamp", updateDate: true },
    status: {
      type: "enum",
      enum: ["open", "ordered", "abandoned"],
      default: "open"
    },
  },
  relations: {
    user: {
      type: "many-to-one",
      target: "User",
      nullable: false,
      onDelete: "CASCADE",
    },
    items: {
      type: "one-to-many",
      target: "CartItem",
      inverseSide: "cart",
      cascade: true
    }
  }
});
