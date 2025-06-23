const { sendResetEmail } = require("./emailService.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY || "clave_secreta";

const crypto = require("crypto");




async function registerUser(dataSource, userData) {
  const UserRepository = dataSource.getRepository("User");
  const existingUser = await UserRepository.findOne({ where: { username: userData.username } });
  if (existingUser) {
    throw new Error("El usuario ya existe");
  }

  const hashedPassword = await bcrypt.hash(userData.password, 10);

  const newUser = UserRepository.create({
    username: userData.username,
    password: hashedPassword,
    firstName: userData.firstName,
    lastName: userData.lastName,
    email: userData.email,
    role: "admin",
    enabled: true,
    subscribedToNotifications: false
  });

  await UserRepository.save(newUser);

  return newUser;
}

async function loginUser(dataSource, { username, password }) {
  const UserRepository = dataSource.getRepository("User");

  const user = await UserRepository.findOne({ where: { username } });
  if (!user) {
    throw new Error("Usuario o contraseña incorrectos");
  }

  const passwordMatches = await bcrypt.compare(password, user.password);
  if (!passwordMatches) {
    throw new Error("Usuario o contraseña incorrectos");
  }
  if(!user.enabled){
    throw new Error("Usuario deshabilitado.");
  }
  const token = jwt.sign(
    {
      id: user.id,
      username: user.username,
      role: user.role,
    },
    SECRET_KEY,
    { expiresIn: "1h" }
  );

  return { user, token };
}

async function requestPasswordResetService(dataSource, email) {
  const userRepo = dataSource.getRepository("User");
  const user = await userRepo.findOne({ where: { email } });

  if (!user) throw new Error("No existe un usuario con ese correo.");

  const code = crypto.randomInt(100000, 999999).toString();
  user.resetCode = code;
  user.resetCodeExpires = new Date(Date.now() + 15 * 60 * 1000); 

  await userRepo.save(user);

  await sendResetEmail(user.email, code); 

  return { message: "Código enviado por email." };
}


async function changePasswordService(dataSource, { email, newPassword, resetCode }) {
  const userRepo = dataSource.getRepository("User");

  const user = await userRepo.findOne({ where: { email } });
  if (!user) {
    throw new Error("Usuario no encontrado");
  }
  if (!user.resetCode || user.resetCode !== resetCode) {
    throw new Error("Código de verificación incorrecto");
  }

  const now = new Date();
  if (!user.resetCodeExpires || user.resetCodeExpires < now) {
    throw new Error("El código ha expirado");
  }

  if (!newPassword || newPassword.length < 6) {
    throw new Error("La nueva contraseña debe tener al menos 6 caracteres");
  }

  const hashedNewPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedNewPassword;

  user.resetCode = null;
  user.resetCodeExpires = null;

  await userRepo.save(user);

  return { message: "Contraseña actualizada correctamente" };
}
module.exports = { registerUser, loginUser, changePasswordService, requestPasswordResetService };
