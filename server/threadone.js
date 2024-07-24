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
    Validation.age(fecha_nacimiento_usuario);
    Validation.emailExists(email_usuario);
    Validation.phoneNumberExists(telefono_usuario);
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

  static async update({
    id_usuario,
    nombre_usuario,
    apellido_usuario,
    fecha_nacimiento_usuario,
    fk_genero,
    email_usuario,
    telefono_usuario,
    contrasena_usuario,
  }) {
    Validation.age(fecha_nacimiento_usuario);
    await Validation.emailExistsForUpdate(email_usuario, id_usuario);
    await Validation.phoneNumberExistsForUpdate(telefono_usuario, id_usuario);
    Validation.password(contrasena_usuario);

    const hashedPassword = await bcrypt.hash(contrasena_usuario, SALT_ROUNDS);

    const [result] = await connection.execute(
      "UPDATE usuarios SET nombre_usuario = ?, apellido_usuario = ?, fecha_nacimiento_usuario = ?, fk_genero = ?, email_usuario = ?, telefono_usuario = ?, contrasena_usuario = ? WHERE id_usuario = ?",
      [
        nombre_usuario,
        apellido_usuario,
        fecha_nacimiento_usuario,
        fk_genero,
        email_usuario,
        telefono_usuario,
        hashedPassword,
        id_usuario,
      ]
    );

    return result;
  }
}

class Validation {
  // Validar que el usuario tenga 18 años o más
  static age(fecha_nacimiento_usuario) {
    const fechaNacimiento = new Date(fecha_nacimiento_usuario);
    const fechaActual = new Date();
    let edad = fechaActual.getFullYear() - fechaNacimiento.getFullYear();
    const mes = fechaActual.getMonth() - fechaNacimiento.getMonth();
    if (
      mes < 0 ||
      (mes === 0 && fechaActual.getDate() < fechaNacimiento.getDate())
    ) {
      edad--;
    }
    if (edad < 18) {
      throw new Error("El usuario debe ser mayor de 18 años");
    }
    return edad;
  }

  // validar que el numero no se encuentre registrado
  static async phoneNumberExists(telefono_usuario) {
    const [results] = await connection.execute(
      "SELECT * FROM usuarios WHERE telefono_usuario = ?",
      [telefono_usuario]
    );
    if (results.length > 0) {
      throw new Error("El número de teléfono ya está registrado");
    }
  }

  // validar que el numero no se encuentre registrado por otro usuario
  static async phoneNumberExistsForUpdate(telefono_usuario, id_usuario) {
    const [results] = await connection.execute(
      "SELECT * FROM usuarios WHERE telefono_usuario = ? AND id_usuario != ?",
      [telefono_usuario, id_usuario]
    );
    if (results.length > 0) {
      throw new Error(
        "El número de teléfono ya está registrado por otro usuario"
      );
    }
  }

  // validar que el correo no se encuentre registrado
  static async emailExists(email_usuario) {
    const [results] = await connection.execute(
      "SELECT * FROM usuarios WHERE email_usuario = ?",
      [email_usuario]
    );
    if (results.length > 0) {
      throw new Error("El correo ya está registrado");
    }
  }

  // Validar que el correo no se encuentre registrado por otro usuario
  static async emailExistsForUpdate(email_usuario, id_usuario) {
    const [results] = await connection.execute(
      "SELECT * FROM usuarios WHERE email_usuario = ? AND id_usuario != ?",
      [email_usuario, id_usuario]
    );
    if (results.length > 0) {
      throw new Error("El correo ya está registrado por otro usuario");
    }
  }

  // Validar que la contraseña tenga maximo 8 caracteres
  static password(contrasena_usuario) {
    if (contrasena_usuario.length > 8) {
      throw new Error("La contraseña debe tener maximo 8 caracteres");
    }
  }
}
