const { DataSource } = require("typeorm");
const ProductSchema = require("./schemas/ProductSchema.js");
const ProductVariantSchema = require("./schemas/ProductVariantSchema.js");
const UserSchema = require("./schemas/UserSchema.js");
const CategorySchema = require("./schemas/CategorySchema.js");

const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",        // Ajusta según tu config
  password: "usuario123",      // Ajusta según tu config
  database: "bd-web",          // Ajusta según tu config
  synchronize: true,
  logging: false,
  entities: [ProductSchema, ProductVariantSchema, UserSchema, CategorySchema],
});

module.exports = { AppDataSource };
