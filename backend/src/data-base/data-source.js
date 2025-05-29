const { DataSource } = require("typeorm");
const ProductSchema = require("./schemas/ProductSchema.js");
const ProductVariantSchema = require("./schemas/ProductVariantSchema.js");
const UserSchema = require("./schemas/UserSchema.js");
const CategorySchema = require("./schemas/CategorySchema.js");
const CartSchema = require("./schemas/CartSchema.js");
const CartItemSchema = require("./schemas/CartItemSchema.js");
const OrderSchema = require("./schemas/OrderSchema.js");
const OrderItemSchema = require("./schemas/OrderItemSchema.js");
const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",        // Ajusta según tu config
  password: "usuario123",      // Ajusta según tu config
  database: "bd-web",          // Ajusta según tu config
  synchronize: true,
  logging: false,
  entities: [ProductSchema, ProductVariantSchema, UserSchema, CategorySchema, CartItemSchema, CartSchema, OrderSchema, OrderItemSchema],
});

module.exports = { AppDataSource };
