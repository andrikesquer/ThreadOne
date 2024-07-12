const { response } = require("express");

function handleSubmit() {
    let nombre_usuario = document.getElementById("first-name").value.toString();
    let apellido_usuario = document.getElementById("last-name").value.toString();
    let fecha_nacimiento_usuario = document.getElementById("birth-date").value.toString();
    let fk_genero=0;
    switch (document.getElementById("gender").value.toString()) {
        case "femenino":
        fk_genero=1;
            break;
        case "masculino":
        fk_genero=2;
            break;
        case "no_binario":
        fk_genero=3;
            break;
        case "otro":
        fk_genero=4;
            break;
    };
    let email_usuario = document.getElementById("email").value.toString();
    let telefono_usuario = document.getElementById("number").value.toString();
    let contrasena_usuario = document.getElementById("password").value.toString();

    const userData = {
        nombre_usuario,
        apellido_usuario,
        fecha_nacimiento_usuario,
        fk_genero,
        email_usuario,
        telefono_usuario,
        contrasena_usuario
    };

    // Send POST request to the server
    fetch('http://localhost:3000/registro', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
        window.location.href = "http://localhost:5500/LOGIN/Login.html";
    })
    .catch((error) => {
        console.error('Error:', error);
        const errorMessageElement = document.getElementById("error-message");
        errorMessageElement.textContent = "Datos Invalidos";
        errorMessageElement.style.display = "block"; // Mostrar el mensaje de error en la página

        setTimeout(() => {
            errorMessageElement.style.opacity = "0";
            setTimeout(() => {
                errorMessageElement.style.display = "none";
                errorMessageElement.style.opacity = "1"; 
            }, 0);
        }, 2000); 
    });
    
};
