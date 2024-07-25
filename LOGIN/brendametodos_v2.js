document.getElementById("loginForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    
    const email = document.getElementById("email_usuario").value;
    const password = document.getElementById("contrasena_usuario").value;

    try {
        const response = await fetch("http://localhost:3000/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email_usuario: email, contrasena_usuario: password }),
        });

        if (!response.ok) {
            const result = await response.json();
            let errorMessage;
            if (result.error === "wrong_password") {
                errorMessage = "Contraseña incorrecta";
            } else if (result.error === "wrong_email") {
                errorMessage = "Correo incorrecto";
            } else {
                errorMessage = "Error desconocido";
            }
            throw new Error(errorMessage);
        }

        // Si el inicio de sesión fue exitoso, redirigir al usuario al home
        window.location.href = "../Home/dos.html";
    } catch (error) {
        console.error("Error al iniciar sesión:", error);
        // Mostrar el mensaje de error en la página
        const errorMessageElement = document.getElementById("error-message");
        errorMessageElement.textContent = error.message;
        errorMessageElement.style.display = "block"; // Mostrar el mensaje de error en la página

        // Desaparecer el mensaje después de 3 segundos
        setTimeout(() => {
            errorMessageElement.style.opacity = "0";
            setTimeout(() => {
                errorMessageElement.style.display = "none";
                errorMessageElement.style.opacity = "1"; // Restaurar la opacidad original
            }, 1000); // Tiempo de desvanecimiento: 1 segundo
        }, 3000); // Tiempo de visualización: 3 segundos
    }
});

