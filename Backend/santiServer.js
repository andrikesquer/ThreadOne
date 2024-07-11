const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

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

server.post("/usuarios", (req, res) => {
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
                console.log("Data posted to the database");
            }
        }
    );
});

server.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});
