const express = require('express');
const db = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const utils = require("./utils");

const server = express();

server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());
server.use(cors());

const conn = db.createConnection({
    host: "localhost",
    user: "root",
    password: "HCHHPRa4",
    port: 3306,
    database: "juan"
});

conn.connect((err) => {
    if (err) {
        console.log("Error connecting to database", err);
    } else {
        console.log("Connected to database");
    }
});

server.get("/", (req, res) => {
    console.log("GET /");
    res.send("Hola tontito");
});

server.get("/user/:id", (req, res) => {
    const id = req.params.id;
    conn.query("SELECT * FROM users WHERE id_user=?", [id], (error, results) => {
        if (error) {
            console.log("Error fetching data", error);
            res.status(500).send("Error fetching data");
        } else {
            console.log("Data fetched successfully");
            res.send(results);
        }
    });
});

server.get("/user", (req, res) => {
    conn.query("SELECT * FROM users", (error, results) => {
        if (error) {
            console.log("Error fetching data", error);
            res.status(500).send("Error fetching data");
        } else {
            console.log("Data fetched successfully");
            res.send(results);
        }
    });
});

server.post("/user", (req, res) => {
    const { userName, userLastName, email, userPassword } = req.body;
    conn.query(
        "INSERT INTO users (userName, userLastName, email, userPassword ) VALUES (?, ?, ?, ?)",
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
