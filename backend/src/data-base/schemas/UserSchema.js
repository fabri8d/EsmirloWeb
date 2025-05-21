const { EntitySchema } = require("typeorm");
const User = require("../../models/users/User.js");

module.exports = new EntitySchema({
  name: "User",
  target: User,
  tableName: "users",
  columns: {
    id: { primary: true, type: "int", generated: true },
    username: { type: "varchar", unique: true },
    firstName: { type: "varchar" },
    lastName: { type: "varchar" },
    email: { type: "varchar", unique: true },
    password: { type: "varchar" },
    role: { type: "enum", enum: ["admin", "customer"], default: "customer" },
  }
});
