import mysql from "mysql2/promise";

const config = {
  host: "localhost",
  user: "root",
  password: "root",
  port: 3306,
  database: "ThreadOne",
};

const connection = await mysql.createConnection(config);

export class ThreadOneModel {
  static async login(emai_usuario, contrasena_usuario) {}
}
