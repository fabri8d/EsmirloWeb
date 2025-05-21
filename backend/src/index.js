const { AppDataSource } = require("./data-base/data-source.js");
const app = require("./app.js");
require('dotenv').config();

async function main() {
  try {
    await AppDataSource.initialize();
    console.log("Conexión inicializada.");

    app.set("dataSource", AppDataSource);

    app.listen(3000, () => {
      console.log("Servidor escuchando en http://localhost:3000");
    });
  } catch (error) {
    console.error("Error al iniciar la app:", error);
  }
}

main();
