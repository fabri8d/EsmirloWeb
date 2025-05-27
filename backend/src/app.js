const express = require("express");
const cors = require("cors");
const productRoutes = require("./routes/productRoutes.js");
const authRoutes = require("./routes/authRoutes.js");
const categoryRoutes = require("./routes/categoryRoutes.js");
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/products", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/categories", categoryRoutes)
app.use("/cart", require("./routes/cartRoutes.js"));

module.exports = app;
