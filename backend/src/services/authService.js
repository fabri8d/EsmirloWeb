const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY || "clave_secreta";

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
    role: "customer",
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

module.exports = { registerUser, loginUser };
