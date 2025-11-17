const jwt = require("jsonwebtoken");
const User = require("../models/User");

const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "Authorization header missing" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Token missing" });
    }

    // 1. Decodificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // El payload debe contener { id, activeRoleId }
    const { id, activeRoleId } = decoded;

    // 2. Verificar usuario (seguridad básica)
    const user = await User.findById(id);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    if (!user.enabled) {
      return res.status(403).json({ message: "User disabled" });
    }

    // 3. Adjuntar la información clave al request
    req.user = {
      id: user._id,
      activeRoleId: activeRoleId // <-- AÑADIDO: El ID del rol activo
    };

    next();
  } catch (error) {
    // Manejar errores de verificación de token (expiración, firma inválida, etc.)
    res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = auth;