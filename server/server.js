import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { ThreadOne } from "./threadone.js";
import jwt from "jsonwebtoken";
import { PORT, SECRET_KEY } from "./config.js";

const server = express();

server.set("view engine", "ejs"); // Configuración del motor de plantillas
server.use(express.static("public")); // Configuración de la carpeta de archivos estáticos
// Midlewares: son funciones que modifican las peticiones o las respuestas antes de que lleguen a su destino
server.use(express.json()); // Parsear el body de las peticiones
server.use(cookieParser()); // Parsear las cookies
server.use(cors()); //Permitir peticiones desde cualquier origen
server.disable("x-powered-by"); // Ocultar la tecnología que usamos

// Middleware para verificar si el usuario está autenticado
server.use((req, res, next) => {
  const token = req.cookies.access_token;
  req.session = { usuario: null };

  try {
    const data = jwt.verify(token, SECRET_KEY);
    req.session.usuario = data;
  } catch {}

  next(); // Siguiente ruta o middleware
});

// Endpoints

// Mostar la pagina de inicio
server.get("/", (req, res) => {
  const usuario = req.session.usuario;
  if (usuario === null) {
    res.render("index");
  } else {
    res.render("index", usuario);
  }
});

// Mostrar la pagina de login
server.get("/login", (req, res) => {
  res.render("login");
});

server.post("/login", async (req, res) => {
  const { email_usuario, contrasena_usuario } = req.body;
  try {
    const usuario = await ThreadOne.login({
      email_usuario,
      contrasena_usuario,
    });
    const token = jwt.sign(
      {
        id_usuario: usuario.id_usuario,
        email_usuario: usuario.email_usuario,
        nombre_usuario: usuario.nombre_usuario,
        apellido_usuario: usuario.apellido_usuario,
        telefono_usuario: usuario.telefono_usuario,
      },
      SECRET_KEY,
      { expiresIn: "1h" }
    );
    res.cookie("access_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 1000 * 60 * 60, // La cookie expira en 1 hora
    });
    res.send({ usuario });
  } catch (error) {
    let errorMessage;
    if (error.message === "Email no encontrado") {
      errorMessage = "wrong_email";
    } else if (error.message === "Contraseña incorrecta") {
      errorMessage = "wrong_password";
    } else {
      errorMessage = "unknown_error";
    }
    res.status(400).json({ error: errorMessage });
  }
});

server.get("/registro", (req, res) => {
  res.render("registro");
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
    const usuario = await ThreadOne.create({
      nombre_usuario,
      apellido_usuario,
      fecha_nacimiento_usuario,
      fk_genero,
      email_usuario,
      telefono_usuario,
      contrasena_usuario,
    });
    res.send({ usuario });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

server.get("/usuario", (req, res) => {
  const usuario = req.session.usuario;
  res.render("usuario", usuario);
});

server.patch("/usuario", async (req, res) => {
  const usuario = req.session.usuario;
  const anterior_email_usuario = usuario.email_usuario;

  const {
    id_usuario = await ThreadOne.getUserId(anterior_email_usuario),
    nombre_usuario,
    apellido_usuario,
    fecha_nacimiento_usuario,
    fk_genero,
    email_usuario,
    telefono_usuario,
    contrasena_usuario,
  } = req.body;

  console.log({
    id_usuario,
    nombre_usuario,
    apellido_usuario,
    fecha_nacimiento_usuario,
    fk_genero,
    email_usuario,
    telefono_usuario,
    contrasena_usuario,
  });

  try {
    const usuario = await ThreadOne.update({
      id_usuario,
      nombre_usuario,
      apellido_usuario,
      fecha_nacimiento_usuario,
      fk_genero,
      email_usuario,
      telefono_usuario,
      contrasena_usuario,
    });
    const token = jwt.sign(
      {
        id_usuario: usuario.id_usuario,
        email_usuario: usuario.email_usuario,
        nombre_usuario: usuario.nombre_usuario,
        apellido_usuario: usuario.apellido_usuario,
        telefono_usuario: usuario.telefono_usuario,
      },
      SECRET_KEY,
      { expiresIn: "1h" }
    );
    res.cookie("access_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 1000 * 60 * 60,
    });
    res.send({ usuario });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

server.delete("/usuario", async (req, res) => {
  const usuario = req.session.usuario;
  const email_usuario = usuario.email_usuario;

  try {
    await ThreadOne.delete(email_usuario);
    res.send("Usuario eliminado");
    console.log("Usuario eliminado");
  } catch (error) {
    res.status(400).send(error.message);
    console.log(error);
  }
});

server.post("/logout", (req, res) => {
  res.clearCookie("access_token");
  res.redirect("/");
});

// Stickers

// Mostar todos los stickers
server.get("/stickers", (req, res) => {
  const usuario = req.session.usuario;
  if (usuario === null) {
    res.render("stickers");
  } else {
    res.render("stickers", usuario);
  }
});

// Mostrar un sticker
server.get("/stickers/:producto", async (req, res) => {
  const usuario = req.session?.usuario;
  const { producto } = req.params;
  const precio = req.query.precio;
  const imagen = req.query.imagen;
  console.log(req.params);
  const sticker = {
    producto: producto,
    precio: precio,
    imagen: imagen,
  };
  console.log(sticker);
  res.render("stickerProducto", { sticker, usuario });
});

// Personalizacion

server.get("/custom", (req, res) => {
  const usuario = req.session.usuario;
  res.render("camisetaPersonalizable", usuario);
});

// Camisetas

// Mostrar la pagina de camisetas
server.get("/camisetas", (req, res) => {
  const usuario = req.session.usuario;
  if (usuario === null) {
    res.render("camisetas");
  } else {
    res.render("camisetas", usuario);
  }
});

// Mostrar una camiseta
server.get("/camisetas/:producto", async (req, res) => {
  const usuario = req.session?.usuario;
  const { producto } = req.params;
  const precio = req.query.precio;
  const imagen = req.query.imagen;
  const color = req.query.color;
  console.log(req.params);
  const camiseta = {
    producto: producto,
    precio: precio,
    imagen: imagen,
    color: color,
  };
  console.log(camiseta);
  res.render("camisetaProducto", { camiseta, usuario });
});

// server.get("/camisetaProducto", (req, res) => {
//   const { name, price, status, image1, image2, image3 } = req.query;
//   const usuario = req.session.usuario;

//   const product = {
//     name,
//     price,
//     status,
//     images: [image1, image2, image3],
//   };

//   res.render("camisetaProducto", { usuario, product });
// });

// Carrito

// Ruta para mostrar el carrito
server.get("/carrito", (req, res) => {
  const usuario = req.session.usuario;

  if (usuario === null) {
    res.render("login");
  } else {
    res.render("carrito", usuario);
  }
});

// Ruta para mostrar los productos del carrito
server.get("/cartItems", async (req, res) => {
  const usuario = req.session.usuario;
  const email_usuario = usuario.email_usuario;
  const id_usuario = await ThreadOne.getUserId(email_usuario);

  try {
    const cartItems = await ThreadOne.getCartItems(id_usuario);
    res.json(cartItems);
  } catch (error) {
    console.error("Error retrieving items from the database:", error);
    res.status(500).send("Server error");
  }
});

// Ruta para agregar productos al carrito
server.post("/add-to-cart", async (req, res) => {
  const usuario = req.session.usuario;
  const email_usuario = usuario.email_usuario;

  const { producto, size, quantity, color } = req.body;
  const id_usuario = await ThreadOne.getUserId(email_usuario);

  console.log({ producto, size, quantity, color, id_usuario });

  try {
    await ThreadOne.addToCart({
      producto,
      size,
      quantity,
      color,
      id_usuario,
    });
    res.json({ message: "Producto agregado al carrito" });
    console.log("Producto agregado al carrito");
  } catch (error) {
    res.status(400).send(error.message);
    console.log(error);
  }
});

// Ruta para eliminar productos del carrito
server.post("/remove-from-cart", async (req, res) => {
  const usuario = req.session.usuario;
  const email_usuario = usuario.email_usuario;

  const id_usuario = await ThreadOne.getUserId(email_usuario);
  const { producto, size, color } = req.body;

  console.log({ producto, size, color, id_usuario });

  try {
    await ThreadOne.removeFromCart({
      producto,
      size,
      color,
      id_usuario,
    });
    res.json({ message: "Producto eliminado del carrito" });
    console.log("Producto eliminado del carrito");
  } catch (error) {
    res.status(400).send(error.message);
    console.log(error);
  }
});

server.post("/clear-cart", async (req, res) => {
  const usuario = req.session.usuario;
  const email_usuario = usuario.email_usuario;

  const id_usuario = await ThreadOne.getUserId(email_usuario);
  try {
    await ThreadOne.clearCart(id_usuario);
    res.json({ message: "Productos eliminados del carrito" });
    console.log("Productos eliminados del carrito");
  } catch (error) {
    res.status(400).send(error.message);
    console.log(error);
  }
});

server.get("/compra", (req, res) => {
  const usuario = req.session.usuario;
  const total = req.query.total;

  res.render("compra", { usuario, total });
});

server.use((req, res) => {
  res.status(404).send("Not found");
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
