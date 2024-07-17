# Integradora-Formulario-TID31M
Diseñar e implementar v0.1 de un formulario para proyecto integradora

# Avanze de integradora: Conexion a base de datos
<!-- Aplicado al proyecto integrador, crear una API que contenga al menos dos rutas diferentes, que obtenga sus datos desde una base de datos.
La interfaz debe consultar esta API para cargar elementos de la pagina y/o enviar datos para su persistencia, cada miembro del equipo debe subir un link al repositorio, y dentro del repositorio en el archivo readme describir el funcionamiento actual de su programa, que endpoints tiene la API, como se estan consultando. -->

Este programa es un servidor web desarrollado con Node.js y Express que se conecta a una base de datos MySQL para gestionar usuarios. Permite operaciones de inicio de sesión, registro y consultas de usuarios. Además, sirve archivos estáticos desde un directorio llamado "Home" y una página HTML específica.
    // Servir archivos estáticos desde la carpeta Home
    server.use(express.static(path.join(__dirname, 'Home')));

    // Ruta para servir el archivo dos.html desde la carpeta Home
    server.get('/home', (req, res) => {
        res.sendFile(path.join(__dirname, 'Home', 'dos.html'));
    });


El servidor utiliza express para manejar las solicitudes HTTP, mysql2 para conectarse a la base de datos MySQL, body-parser para analizar los cuerpos de las solicitudes, cors para habilitar CORS y path para gestionar rutas de archivos. Se establece una conexión a la base de datos MySQL llamada ThreadOne.
    const conn = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "Conntraseña",
        port: 3306,
        database: "ThreadOne"
    });

Se han creado dos tipos de API's: GET y POST. Estos se utilizan para pedirle informacion al servidor de la base de datos e ingresar informacion a la misma. Los endpoints de la API se están consultando mediante solicitudes HTTP. Para los endpoints GET, las solicitudes se envían a la URL correspondiente y se espera una respuesta en formato JSON (para datos) o texto (para mensajes simples). 

    * GET /: Responde con un mensaje simple para verificar que el servidor está funcionando.
        *   server.get("/", (req, res) => {
            console.log("Simple request received");
            res.send("Simple response delivered");
            });
        * Solicitud empleada con la aplicacion de postman 

    * GET /usuarios/:id: Recupera los datos de un usuario específico por su id_usuario.
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
        * Solicitud empleada con la aplicacion de postman 

    * GET /usuarios: Recupera los datos de todos los usuarios en la base de datos.
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
        * Solicitud empleada con la aplicacion de postman 

Para los endpoints POST, se envían solicitudes con un cuerpo JSON que contiene los datos necesarios (como credenciales de inicio de sesión o información de registro). 
    * POST /login: Verifica las credenciales del usuario y responde con un mensaje de éxito o de credenciales incorrectas.
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
        * Solicitud
        const response = await fetch("http://localhost:3000/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email_usuario: email, contrasena_usuario: password }),
                });

    * POST /registro: Inserta un nuevo usuario en la base de datos con los datos proporcionados.
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
        * Solicitud
        fetch('http://localhost:3000/registro', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData)
            })

