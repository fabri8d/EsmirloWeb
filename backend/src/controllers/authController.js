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

async function requestPasswordReset(req, res) {
  try {
    const dataSource = req.app.get("dataSource");
    const { email } = req.body;

    const result = await authService.requestPasswordResetService(dataSource, email);
    res.json(result);
  } catch (error) {
    console.error("Error al solicitar recuperación de contraseña:", error);
    res.status(400).json({ error: error.message });
  }
}

async function changePassword(req, res) {
  try {
    const dataSource = req.app.get("dataSource");
    const { email, newPassword, resetCode } = req.body;

    const result = await authService.changePasswordService(dataSource, {
      email,
      newPassword,
      resetCode,
    });

    res.json(result);
  } catch (error) {
    console.error("Error al cambiar la contraseña:", error);
    res.status(400).json({ error: error.message });
  }
}

module.exports = {
  register,
  login,
  requestPasswordReset,
  changePassword,
};

