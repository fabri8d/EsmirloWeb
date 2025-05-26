const { EntitySchema } = require("typeorm");
const CartItem = require("../../models/orders/CartItem.js");

module.exports = new EntitySchema({
  name: "CartItem",
  target: CartItem,
  tableName: "cart_items",
  columns: {
    id: { primary: true, type: "int", generated: true },
    quantity: { type: "int" },
    price: { type: "decimal" } // precio en el momento del agregado
  },
  relations: {
    cart: {
      type: "many-to-one",
      target: "Cart",
      onDelete: "CASCADE"
    },
    productVariant: {
      type: "many-to-one",
      target: "ProductVariant",
      eager: true,
      nullable: false
    }
  }
});
