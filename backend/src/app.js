const express = require("express");
const cors = require("cors");
const productRoutes = require("./routes/productRoutes.js");
const authRoutes = require("./routes/authRoutes.js");
const categoryRoutes = require("./routes/categoryRoutes.js");
const orderRoutes = require("./routes/orderRoutes.js");
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/products", productRoutes);
app.use("/api/auth", authRoutes);
<<<<<<< HEAD
app.use("/categories", categoryRoutes);
app.use("/orders", orderRoutes);
=======
app.use("/categories", categoryRoutes)
app.use("/cart", require("./routes/cartRoutes.js"));

>>>>>>> ff2e2ee564be84be6a67ecf75ce47eed6825006b
module.exports = app;
