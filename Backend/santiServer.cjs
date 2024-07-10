const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

// const utils = require("./utils");

const server = express();

server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());
server.use(cors());

const conn = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Santirod205",
    port: 3306,
    database: "ThreadOne"
});


conn.connect((err) => {
    if (err) {
        console.log("Error connecting to database", err);
       
    }
    console.log("Connected to database");
});

server.get("/", (req, res) => { // Verificacion de conexion con api
    if (err) {
        throw err;
    }
    console.log("Simple request received");
    res.send("Simple response delivered");
});

server.get("/usuarios/:id", (req, res) => { // Request de usuario especifico
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

server.get("/usuarios", (req, res) => {     // Request de todos los usuarios
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

server.post("/usuarios", (req, res) => { // metodo de insercion de usuario 
    const { nombre_usuario, apellido_usuario, fecha_nacimiento_usuario, fk_genero, email_usuario, telefono_usuario,contrasena_usuario } = req.body;
    conn.query(
        "INSERT INTO users (nombre_usuario, apellido_usuario, fecha_nacimiento_usuario, fk_genero, email_usuario, telefono_usuario,contrasena_usuario) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [userName, userLastName, email, userPassword],
        (error, result) => {
            if (error) {
                res.status(500).send("Error inserting data");
            } else {
                res.send(result);
            }
        }
    );
});



server.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});
