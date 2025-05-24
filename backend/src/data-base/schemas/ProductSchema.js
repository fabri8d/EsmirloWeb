const { EntitySchema } = require("typeorm");
const Product = require("../../models/products/Product.js");

module.exports = new EntitySchema({
  name: "Product",
  target: Product,
  tableName: "products",
  columns: {
    id: { primary: true, type: "int", generated: true },
    name: { type: "varchar" },
    description: { type: "text" },
    price: { type: "decimal" },
    imageUrl: { type: "varchar"},
  },
  relations: {
    variants: {
      type: "one-to-many",
      target: "ProductVariant",
      cascade: true,
      inverseSide: "product",
    },
    category: {
      type: "many-to-one",
      target: "Category",
      eager: true,
      nullable: false,
    },
  },
});
