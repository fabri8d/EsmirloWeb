const { EntitySchema } = require("typeorm");
const Category = require("../../models/products/Category.js");

module.exports = new EntitySchema({
  name: "Category",
  target: Category,
  tableName: "categories",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    name: {
      type: "varchar",
      unique: true,
      nullable: false,
    },
  },
  relations: {
    products: {
      type: "one-to-many",
      target: "Product",
      inverseSide: "category",
    },
  },
});
