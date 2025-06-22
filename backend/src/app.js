const express = require("express");
const cors = require("cors");
const productRoutes = require("./routes/productRoutes.js");
const authRoutes = require("./routes/authRoutes.js");
const categoryRoutes = require("./routes/categoryRoutes.js");
const orderRoutes = require("./routes/orderRoutes.js");
const cartRoutes = require("./routes/cartRoutes.js");
const userRoutes = require("./routes/userRoutes.js");
const suscripcionesRouter = require('./routes/suscripcionesRouters');

require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/products", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/categories", categoryRoutes);
app.use("/orders", orderRoutes);
app.use("/cart", cartRoutes);
app.use("/users", userRoutes);
app.use('/api/suscripciones', suscripcionesRouter);
module.exports = app;
