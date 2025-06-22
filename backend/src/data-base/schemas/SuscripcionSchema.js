const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "Suscripcion",
  tableName: "suscripciones",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    email: {
      type: "varchar",
      unique: true,
      nullable: false,
    },
    createdAt: {
      type: "timestamp",
      createDate: true,
    },
  },
});
