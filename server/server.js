import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { ThreadOne } from "./threadone.js";
import jwt from "jsonwebtoken";
import { PORT, SECRET_KEY } from "./config.js";

const server = express();

server.set("view engine", "ejs"); // Configuración del motor de plantillas
server.use(express.json()); // Middleware para parsear el body de las peticiones
server.use(cookieParser()); // Middleware para parsear las cookies
server.use(cors()); // Middleware para permitir peticiones desde cualquier origen
server.disable("x-powered-by"); // Middleware para ocultar la tecnología que usamos

server.use((req, res, next) => {
  // Middleware para verificar si el usuario está autenticado
  const token = req.cookies.access_token;
  req.session = { usuario: null };

  try {
    const data = jwt.verify(token, SECRET_KEY);
    req.session.usuario = data;
  } catch (error) {}

  next(); // Siguiente ruta o middleware
});

// Endponts

server.get("/", (req, res) => {
  res.render("index");
});

server.get("/home", (req, res) => {
  const { usuario } = req.session.usuario;
  res.render("home", { usuario });
});

server.post("/login", async (req, res) => {
  const { email_usuario, contrasena_usuario } = req.body;
  try {
    const usuario = await ThreadOne.login({
      email_usuario,
      contrasena_usuario,
    });
    const token = jwt.sign(
      { id_usuario: usuario.id_usuario, email_usuario: usuario.email_usuario },
      SECRET_KEY,
      { expiresIn: "1h" }
    );
    res.cookie("access_token", token, {
      httpOnly: true, // La cookie no puede ser leída por JavaScript, solo por el servidor
      secure: process.env.NODE_ENV === "production", // La cookie solo se envía por nttps en producción
      sameSite: "strict", // La cookie no se envía en peticiones de otros dominios
      maxAge: 1000 * 60 * 60, // La cookie expira en 1 hora
    });
    res.send({ usuario, token });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

server.post("/registro", async (req, res) => {
  const {
    nombre_usuario,
    apellido_usuario,
    fecha_nacimiento_usuario,
    fk_genero,
    email_usuario,
    telefono_usuario,
    contrasena_usuario,
  } = req.body;
  console.log({
    nombre_usuario,
    apellido_usuario,
    fecha_nacimiento_usuario,
    fk_genero,
    email_usuario,
    telefono_usuario,
    contrasena_usuario,
  });
  try {
    const id_usuario = await ThreadOne.create({
      nombre_usuario,
      apellido_usuario,
      fecha_nacimiento_usuario,
      fk_genero,
      email_usuario,
      telefono_usuario,
      contrasena_usuario,
    });
    res.send({
      id_usuario,
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

server.post("/logout", (req, res) => {
  res.clearCookie("access_token");
  res.redirect("/home");
});

server.get("/protected", (req, res) => {
  const usuario = req.session.usuario;

  if (!usuario) {
    return res.status(403).send("Acceso no autorizado");
  }

  res.render("protected", usuario);
});

server.use((req, res) => {
  res.status(404).send("Not found");
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
