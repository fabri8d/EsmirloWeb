const { registerUser, loginUser } = require("../services/authService");
const { AppDataSource } = require("../data-base/data-source.js");
const authService = require("../services/authService");

async function register(req, res) {
  try {
    const dataSource = req.app.get("dataSource");
    const user = await authService.registerUser(dataSource, req.body);
    res.status(201).json({ message: "Usuario creado", user });
  } catch (error) {
    console.error("Error en registro:", error);
    res.status(400).json({ error: error.message });  
  }
}

async function login(req, res) {
  try {
    const dataSource = req.app.get("dataSource");
    const { user, token } = await authService.loginUser(dataSource, req.body);
    res.json({ message: "Login exitoso", user, token });
  } catch (error) {
    console.error("Error en login:", error);
    res.status(401).json({ error: error.message });  
  }
}

module.exports = { register, login };

