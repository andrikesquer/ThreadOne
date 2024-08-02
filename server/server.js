import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { ThreadOne } from "./threadone.js";
import jwt from "jsonwebtoken";
import { PORT, SECRET_KEY } from "./config.js";
import mysql from "mysql2/promise";

const connectionConfig = {
  host: "localhost",
  user: "root",
  password: "Santirod205",
  port: 3306,
  database: "ThreadOne",
};

const server = express();

let connection;

const initializeDatabaseConnection = async () => {
  connection = await mysql.createConnection(connectionConfig);
};

initializeDatabaseConnection().catch((err) => {
  console.error("Error initializing database connection:", err);
  process.exit(1);
});

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

server.get("/", (req, res) => {
  const usuario = req.session.usuario;
  res.render("index", usuario);
});

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

server.get("/logout", (req, res) => {
  res.clearCookie("access_token");
  res.redirect("/");
});

server.post("/logout", (req, res) => {
  res.clearCookie("access_token");
  res.redirect("/");
});

server.get("/stickers", (req, res) => {
  const usuario = req.session.usuario;
  res.render("stickers", usuario);
});

server.get("/stickers/:producto", async (req, res) => {
  const usuario = req.session?.usuario;
  const { producto } = req.params;
  const precio = req.query.precio;
  const imagen = req.query.imagen;
  console.log(req.params);
  const sticker = {
    descripcion_sticker: producto,
    precio: precio,
    imagen: imagen,
  };
  console.log(sticker);
  res.render("stickerProducto", { sticker, usuario });
});

server.post("/stickers", async (req, res) => {
  const usuario = req.session?.usuario;

  const { descripcion_sticker, precio, imagen } = req.body;
  console.log({
    descripcion_sticker,
    precio,
    imagen,
  });

  const producto = descripcion_sticker;
  res.json({ producto });
});

server.get("/custom", (req, res) => {
  const usuario = req.session.usuario;
  res.render("camisetaPersonalizable", usuario);
});

server.get("/camisetas", (req, res) => {
  const usuario = req.session.usuario;
  res.render("camisetas", usuario);
});

server.get("/camisetaProducto", (req, res) => {
  const { name, price, status, image1, image2, image3 } = req.query;
  const usuario = req.session.usuario;

  const product = {
    name,
    price,
    status,
    images: [image1, image2, image3],
  };

  res.render("camisetaProducto", { usuario, product });
});

server.get("/carrito", (req, res) => {
  const usuario = req.session.usuario;
  res.render("carrito", usuario);
});

server.get("/cart/items", async (req, res) => {
  try {
    const [rows] = await connection.execute("SELECT * FROM juan");
    res.json(rows);
  } catch (error) {
    console.error("Error retrieving items from the database:", error);
    res.status(500).send("Server error");
  }
});

server.post("/add-to-cart", async (req, res) => {
  const usuario = req.session.usuario;
  const email_usuario = usuario.email_usuario;

  const { descripcion, size } = req.body;
  const id_usuario = await ThreadOne.getUserId(email_usuario);

  console.log({ descripcion, size, id_usuario });

  try {
    await ThreadOne.addToCart({
      descripcion,
      size,
      id_usuario,
    });
    
    console.log("Producto agregado al carrito");
  } catch (error) {
    res.status(400).send(error.message);
    console.log(error);
  }
});

server.get("/favoritos", (req, res) => {
  const usuario = req.session.usuario;
  res.render("favoritos", usuario);
});

// server.get('/favoritos', async (req, res) => {
//   try {
//     const [rows] = await connection.execute('SELECT * FROM pepe');
//     res.json(rows);
//   } catch (error) {
//     console.error('Error obteniendo productos favoritos:', error);
//     res.status(500).send('Error del servidor');
//   }
// });

server.post('/favorites/add', async (req, res) => {
  // const { shirtId, stickerId, color, size, quantity, pathToImg, price } = req.body;

  // try {
  //   await connection.execute(
  //     "INSERT INTO pepe (shirtId, stickerId, color, size, quantity, pathToImg, price) VALUES (?, ?, ?, ?, ?, ?, ?) ",
  //     [shirtId, stickerId, color, size, quantity, pathToImg, price]
  //   );
    

  //   res.status(200).send('Producto agregado a favoritos');
  // } catch (error) {
  //   console.error('Error agregando producto a favoritos:', error);
  //   res.status(500).send('Error del servidor');
  // }
  const { shirtId, stickerId, color, size, quantity, pathToImg, price } = req.body;

  const favoriteData = {
      shirtId: shirtId !== undefined ? shirtId : null,
      stickerId: stickerId !== undefined ? stickerId : null,
      color: color !== undefined ? color : null,
      size: size !== undefined ? size : null,
      quantity: quantity !== undefined ? quantity : null,
      pathToImg: pathToImg !== undefined ? pathToImg : null,
      price: price !== undefined ? price : null
  };

  try {
      await connection.execute(
          "INSERT INTO pepe (shirtId, stickerId, color, size, quantity, pathToImg, price) VALUES (?, ?, ?, ?, ?, ?, ?)",
          [favoriteData.shirtId, favoriteData.stickerId, favoriteData.color, favoriteData.size, favoriteData.quantity, favoriteData.pathToImg, favoriteData.price]
      );
     
  } catch (error) {
      console.error('Error agregando producto a favoritos:', error);
      res.status(500).send('Error al agregar producto a favoritos');
  } 

});

server.delete('/favorites/delete/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await connection.execute('DELETE FROM pepe WHERE id = ?', [id]);
    
  } catch (error) {
    console.error('Error eliminando producto de favoritos:', error);
    res.status(500).send('Error del servidor');
  }
});

server.get('/favorites', async (req, res) => {
  try {
    const [rows] = await connection.execute('SELECT * FROM pepe');
    res.json(rows);
  } catch (error) {
    console.error('Error obteniendo productos favoritos:', error);
    res.status(500).send('Error del servidor');
  }
});


server.get("/compra", (req, res) => {
  const usuario = req.session.usuario;
  res.render("compra", usuario);
});

server.post("/cart/add", async (req, res) => {
  const {name, color, size, quantity, path, price } = req.body;

  try {
    await connection.execute(
      "INSERT INTO juan (shirtId, color, size, quantity, pathToImg, price) VALUES (?, ?, ?, ?, ?, ?)",
      [name, color, size, quantity, path,price]
    );
   
  } catch (error) {
    console.error("Error añadiendo a favoritos:", error);
    res.status(500).send("Server error");
  }
});

server.delete("/cart/delete/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await connection.execute("DELETE FROM juan WHERE id = ?", [id]);
    res.status(200).send("Product deleted");
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).send("Server error");
  }
});

server.use((req, res) => {
  res.status(404).send("Not found");
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
