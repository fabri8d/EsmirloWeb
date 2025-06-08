const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY || "clave_secreta";

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; 

  if (!token) return res.status(401).json({ error: "Token requerido" });

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ error: "Token inválido" });
    req.user = user; 
    next();
  });
}

function authorizeAdmin(req, res, next) {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Acceso solo para administradores" });
  }
  next();
}

module.exports = { authenticateToken, authorizeAdmin };
