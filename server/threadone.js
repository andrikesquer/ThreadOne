import mysql from "mysql2/promise";
import bcrypt from "bcrypt";

import { SALT_ROUNDS } from "./config.js";

const config = {
  host: "localhost",
  user: "root",
  password: "root",
  port: 3306,
  database: "ThreadOne",
};

const connection = await mysql.createConnection(config);

export class ThreadOne {
  static async create({
    nombre_usuario,
    apellido_usuario,
    fecha_nacimiento_usuario,
    fk_genero,
    email_usuario,
    telefono_usuario,
    contrasena_usuario,
  }) {
    Validation.name(nombre_usuario);
    Validation.lastName(apellido_usuario);
    // validacion de fecha de nacimiento mayor de 18 años
    // validacion de correo no repetido
    Validation.phone(telefono_usuario);
    // validacion de telefono no repetido
    Validation.password(contrasena_usuario);

    const hashedPassword = await bcrypt.hash(contrasena_usuario, SALT_ROUNDS);

    const [result] = await connection.execute(
      "INSERT INTO usuarios (nombre_usuario, apellido_usuario, fecha_nacimiento_usuario, fk_genero, email_usuario, telefono_usuario, contrasena_usuario) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        nombre_usuario,
        apellido_usuario,
        fecha_nacimiento_usuario,
        fk_genero,
        email_usuario,
        telefono_usuario,
        hashedPassword,
      ]
    );

    return result;
  }

  static async login({ email_usuario, contrasena_usuario }) {
    Validation.password(contrasena_usuario);

    const [results] = await connection.execute(
      "SELECT * FROM usuarios WHERE email_usuario = ?",
      [email_usuario]
    );
    if (results.length === 0) {
      throw new Error("Email no encontrado");
    }

    // Extraccion del usuario de la base de datos
    const usuario = results[0];

    const isValidPassword = await bcrypt.compare(
      contrasena_usuario,
      usuario.contrasena_usuario
    );
    if (!isValidPassword) {
      throw new Error("Contraseña incorrecta");
    }

    return {
      nombre_usuario: usuario.nombre_usuario,
      apellido_usuario: usuario.apellido_usuario,
      email_usuario: usuario.email_usuario,
      bloqueo_usuario: usuario.bloqueo_usuario,
    };
  }
}

class Validation {
  // Validar que el nombre del usuario sea una cadena de texto
  static name(nombre_usuario) {
    if (typeof nombre_usuario !== "string") {
      throw new Error("El nombre del usuario debe ser una cadena de texto");
    }
  }
  // Validar que el apellido del usuario sea una cadena de texto
  static lastName(apellido_usuario) {
    if (typeof apellido_usuario !== "string") {
      throw new Error("El apellido del usuario debe ser una cadena de texto");
    }
  }

  // Validar fecha de nacimiento

  // Validar que el telefono sea un numero de 10 digitos
  static phone(telefono_usuario) {
    if (typeof telefono_usuario !== "number") {
      throw new Error("El telefono del usuario debe ser un numero");
    }
    if (telefono_usuario.toString().length != 10) {
      throw new Error("El telefono debe tener 10 digitos");
    }
  }

  // validar que el numero no se encuentre registrado

  // Validar que la contraseña tenga maximo 8 caracteres
  static password(contrasena_usuario) {
    if (contrasena_usuario.length > 8) {
      throw new Error("La contraseña debe tener maximo 8 caracteres");
    }
  }
}
