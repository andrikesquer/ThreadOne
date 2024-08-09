# Descripción general de la rama

Esta rama es la más actualizada y dónde se han realizado las correcciones necesarias. Es la rama utilizada en Render para subir el proyecto a internet.

Al ingresar a la página se puede navegar entre las diferentes secciones, sin embargo, para realizar acciones concretas es necesario un registro y/o inicio de sesión, por ejemplo, para añadir un producto al carrito de compras.

Es pertinente aclarar que hubo un problema con las imágenes de las camisetas, pues no se cargan. Esto es atribuido al rendimiento de Render, dado que, en local se muestran con normalidad. Para probar el sitio web en local, se debe usar la rama carrito07, ya que, en esta rama no está configurada la conexión mediante pool.

Las funciones básicas de la página trabajan adecuadamente, pudiendo agregar o eliminar productos del carrito de compras y realizar una orden. En términos más técnicos, todo se registra en base de datos, de donde se extrae la información mostrada en el sitio web, esta base de datos está alojada en Hostinger y puede ser manipulada remotamente mediante MySQL Workbench.

# Liga de acceso al sitio web en línea
La liga de acceso es la siguiente: https://threadone.onrender.com

# Guía de directorios

En la carpeta public se encuentran los archivos estáticos como las imágenes, el archivo json con los productos, los archivos JavaScript de cada vista y las hojas de estilos CSS. 

En el directorio views, se encuentran los archivos de cada pestaña del sitio web, tienen la extensión .ejs dado que se emplea el motor de visualización EJS para Express, que es una de las tecnologías empleadas junto con Node.js. Estos archivos cargan el contenido de la página dinámicamente, por ejemplo, mostrando el nombre de usuario en el header o los productos que ese usuario tiene en su carrito.

Fuera de las dos carpetas anteriores se encuentran algunos archivos. El archivo config contiene algunas configuraciones para el servidor, dando mejor organización al proyecto. server.js es el archivo que contiene el corazón del sitio web, donde se crea y configura el servidor así como las rutas que sirven las pestañas y/o datos. threadone.js contiene todo lo referente a la conexión a base de datos y las consultas a la misma mediante diferentes métodos, estos últimos son usados por el servidor para obtener datos y luego mostrarlos o utilizarlos. Finalmente, ThreadOne.sql contiene la estructura de la base de datos, es meramente un archivo informativo y representó una ayuda en el proceso de desarrollo, debería ser eliminado en un contexto más profesional.

# Equipo del proyecto
Jorge Chavira, Santiago Medellín, Oliver Manríquez, Brenda Ramos y Andrik Rivera.
