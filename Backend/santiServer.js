const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const server = express();

server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());
server.use(cors());

const conn = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "HCHHPRa4",
    port: 3306,
    database: "ThreadOne"
});

conn.connect((err) => {
    if (err) {
        console.log("Error connecting to database", err);
    } else {
        console.log("Connected to database");
    }
});

server.get("/", (req, res) => {
    console.log("Simple request received");
    res.send("Simple response delivered");
});

server.get("/usuarios/:id", (req, res) => {
    const id = req.params.id;
    conn.query("SELECT * FROM usuarios WHERE id_usuario=?", [id], (error, results) => {
        if (error) {
            console.log("Error fetching data", error);
            res.status(500).send("Error fetching data");
        } else {
            console.log("Data fetched successfully");
            res.send(results);
        }
    });
});

server.get("/usuarios", (req, res) => {
    conn.query("SELECT * FROM usuarios", (error, results) => {
        if (error) {
            console.log("Error fetching data", error);
            res.status(500).send("Error fetching data");
        } else {
            console.log("Data fetched successfully");
            res.send(results);
        }
    });
});

server.post("/login", (req, res) => {
    const { email_usuario, contrasena_usuario } = req.body;
    conn.query(
        "SELECT * FROM usuarios WHERE email_usuario = ? AND contrasena_usuario = ?",
        [email_usuario, contrasena_usuario],
        (error, results) => {
            if (error) {
                console.log("Error al consultar la base de datos", error);
                res.status(500).send("Error al consultar la base de datos");
            } else {
                if (results.length > 0) {
                    // Si se encuentra un usuario con las credenciales proporcionadas
                    res.status(200).json({ message: "Inicio de sesión exitoso" });
                } else {
                    // Si no se encuentra ningún usuario con las credenciales proporcionadas
                    res.status(401).json({ message: "Credenciales incorrectas" });
                }
            }
        }
    );
});

server.post("/registro", (req, res) => {
    const { nombre_usuario, apellido_usuario, fecha_nacimiento_usuario, fk_genero, email_usuario, telefono_usuario, contrasena_usuario } = req.body;
    conn.query(
        "INSERT INTO usuarios (nombre_usuario, apellido_usuario, fecha_nacimiento_usuario, fk_genero, email_usuario, telefono_usuario, contrasena_usuario) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [nombre_usuario, apellido_usuario, fecha_nacimiento_usuario, fk_genero, email_usuario, telefono_usuario, contrasena_usuario],
        (error, result) => {
            if (error) {
                console.log("Error inserting data", error);
                res.status(500).send("Error inserting data");
            } else {
                res.send(result);
            }
        }
    );
});

// Servir archivos estáticos desde la carpeta Home
server.use(express.static(path.join(__dirname, 'Home')));

// Ruta para servir el archivo dos.html desde la carpeta Home
server.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, 'Home', 'dos.html'));
});

server.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});
