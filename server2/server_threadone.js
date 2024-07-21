const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const server = express();
const PORT = process.env.PORT ?? 3000;

server.disable("x-powered-by");
server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());
server.use(cors());

const conn = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  port: 3306,
  database: "ThreadOne",
});

conn.connect((err) => {
  if (err) {
    console.log("Error connecting to database", err);
  } else {
    console.log("Connected to database");
  }
});

// Metodo prueba
server.get("/", (req, res) => {
  res.status(200).send("ThreadOne");
});

server.post("/login", (req, res) => {
  const { email_usuario, contrasena_usuario } = req.body;
  conn.query(
    "SELECT * FROM usuarios WHERE email_usuario=? AND contrasena_usuario=?",
    [email_usuario, contrasena_usuario],
    (error, results) => {
      if (error) {
        console.log("Error al consultar la base de datos", error);
        res.status(500).send("Error al consultar la base de datos");
      } else {
        console.log("Data fetched successfully");
        res.send(results);
      }
    }
  );
});

server.post("/registro", (req, res) => {
  const {
    nombre_usuario,
    apellido_usuario,
    fecha_nacimiento_usuario,
    fk_genero,
    email_usuario,
    telefono_usuario,
    contrasena_usuario,
  } = req.body;
  conn.query(
    "INSERT INTO usuarios (nombre_usuario, apellido_usuario, fecha_nacimiento_usuario, fk_genero, email_usuario, telefono_usuario, contrasena_usuario) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [
      nombre_usuario,
      apellido_usuario,
      fecha_nacimiento_usuario,
      fk_genero,
      email_usuario,
      telefono_usuario,
      contrasena_usuario,
    ],
    (error, results) => {
      if (error) {
        console.log("Error al insertar datos", error);
        res.status(500).send("Error al insertar datos");
      } else {
        console.log("Data inserted successfully");
        res.send(results);
      }
    }
  );
});

server.delete("/usuario/borrar", (req, res) => {
  const [email_usuario, contrasena_usuario] = req.body;
  conn.query(
    "DELETE FROM usuarios WHERE id_usuario=? and contrasena_usuario = ? ;",
    [email_usuario, contrasena_usuario],
    (error, results) => {
      if (error) {
        console.log("Error al eliminar datos", error);
        res.status(500).send("Error al eliminar datos");
      } else {
        console.log("Data deleted successfully");
        res.send(results);
      }
    }
  );
});

server.use(express.static(path.join(__dirname, "Home")));

server.get("/home", (req, res) => {
  res.sendFile(path.join(__dirname, "Home", "dos.html"));
});

server.use((req, res) => {
  res.status(404).send("Not found");
});

server.listen(PORT, () => {
  console.log(`Server listening on port http://localhost:${PORT}`);
});
