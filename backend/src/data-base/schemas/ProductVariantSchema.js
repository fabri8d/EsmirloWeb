const { EntitySchema } = require("typeorm");
const ProductVariant = require("../../models/products/ProductVariant.js");

module.exports = new EntitySchema({
  name: "ProductVariant",
  target: ProductVariant,
  tableName: "product_variants",
  columns: {
    id: { primary: true, type: "int", generated: true },
    size: { type: "varchar" },
    color: { type: "varchar" },
    stock: { type: "int" },
  },
  uniques: [
    {
      columns: ["product", "size", "color"],
    },
  ],
  relations: {
    product: {
      type: "many-to-one",
      target: "Product",
      joinColumn: true,
      onDelete: "CASCADE",
    },
  },
});
