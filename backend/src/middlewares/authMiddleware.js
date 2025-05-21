const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY || "clave_secreta";

// Verifica que el token JWT sea válido
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // "Bearer TOKEN"

  if (!token) return res.status(401).json({ error: "Token requerido" });

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ error: "Token inválido" });
    req.user = user; // Usuario disponible en todas las rutas protegidas
    next();
  });
}

// Middleware para verificar que el usuario sea admin
function authorizeAdmin(req, res, next) {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Acceso solo para administradores" });
  }
  next();
}

module.exports = { authenticateToken, authorizeAdmin };
