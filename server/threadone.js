import mysql from "mysql2/promise";
// import bcrypt from "bcrypt";

// import { SALT_ROUNDS } from "./config.js";

const config = {
  host: "localhost",
  user: "root",
  password: "HCHHPRa4",
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

    // const hashedPassword = await bcrypt.hash(contrasena_usuario, SALT_ROUNDS);

    const [result] = await connection.execute(
      "INSERT INTO usuarios (nombre_usuario, apellido_usuario, fecha_nacimiento_usuario, fk_genero, email_usuario, telefono_usuario, contrasena_usuario) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        nombre_usuario,
        apellido_usuario,
        fecha_nacimiento_usuario,
        fk_genero,
        email_usuario,
        telefono_usuario,
        // hashedPassword,
        contrasena_usuario,
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

    // const isValidPassword = await bcrypt.compare(
    //   contrasena_usuario,
    //   usuario.contrasena_usuario
    // );
    const isValidPassword = contrasena_usuario === usuario.contrasena_usuario;
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

  static async getUserId(email_usuario) {
    const [results] = await connection.execute(
      "SELECT id_usuario FROM usuarios WHERE email_usuario = ?",
      [email_usuario]
    );
    return results[0].id_usuario;
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

    // const hashedPassword = await bcrypt.hash(contrasena_usuario, SALT_ROUNDS);

    await connection.execute(
      "UPDATE usuarios SET nombre_usuario = ?, apellido_usuario = ?, fecha_nacimiento_usuario = ?, fk_genero = ?, email_usuario = ?, telefono_usuario = ?, contrasena_usuario = ? WHERE id_usuario = ?",
      [
        nombre_usuario,
        apellido_usuario,
        fecha_nacimiento_usuario,
        fk_genero,
        email_usuario,
        telefono_usuario,
        // hashedPassword,
        contrasena_usuario,
        id_usuario,
      ]
    );

    app.post("/login", async (req, res) => {
      const { email_usuario, contrasena_usuario } = req.body;

      try {
        const result = await ThreadOne.login({
          email_usuario,
          contrasena_usuario,
        });

        if (result.error) {
          return res.status(400).json({ error: result.error });
        }

        // Si el login es exitoso, devolver los datos del usuario
        res.status(200).json(result);
      } catch (error) {
        res.status(500).json({ error: "Error desconocido" });
      }
    });

    const [consulta] = await connection.execute(
      "SELECT bloqueo FROM usuarios WHERE id_usuario = ?",
      [id_usuario]
    );

    const bloqueo = consulta[0];

    return {
      nombre_usuario,
      apellido_usuario,
      email_usuario,
      bloqueo_usuario: bloqueo,
    };
  }

  static async delete(email_usuario) {
    await connection.execute("DELETE FROM usuarios WHERE email_usuario = ?", [
      email_usuario,
    ]);
  }

  static async addToCart({ descripcion, size, id_usuario }) {
    const [results] = await connection.execute(
      `SELECT productos.*
       FROM productos
       JOIN stickers ON productos.fk_sticker = stickers.id_sticker
       WHERE stickers.descripcion_sticker = ? AND stickers.fk_tamano_sticker = ?`,
      [descripcion, size]
    );

    if (results.length === 0) {
      throw new Error("Producto no encontrado");
    }

    const id_producto = results[0].id_producto;

    const [results2] = await connection.execute(
      "SELECT * FROM carrito_compras WHERE fk_usuario = ?",
      [id_usuario]
    );

    if (results2.length === 0) {
      await connection.execute(
        "INSERT INTO carrito_compras (fk_usuario) VALUES (?)",
        [id_usuario]
      );
    }

    const [results3] = await connection.execute(
      "SELECT id_carrito FROM carrito_compras WHERE fk_usuario = ?",
      [id_usuario]
    );

    const id_carrito = results3[0].id_carrito;

    await connection.execute(
      "INSERT INTO carrito_compra_detalles (fk_carrito, fk_producto, cantidad) VALUES (?, ?, ?)",
      [id_carrito, id_producto, 1]
    );
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
