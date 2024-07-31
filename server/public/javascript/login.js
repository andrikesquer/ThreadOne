const $ = (el) => document.querySelector(el);

const loginForm = $("#loginForm");
const loginSpan = $("#loginForm span");

loginForm?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email_usuario = $("#email_usuario").value;
  const contrasena_usuario = $("#contrasena_usuario").value;

  try {
    const response = await fetch("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email_usuario, contrasena_usuario }),
    });

    if (response.ok) {
      loginSpan.innerText = "Sesión iniciada correctamente";
      loginSpan.style.color = "green";
      setTimeout(() => {
        window.location.href = "/";
      }, 1000);
    } else {
      const result = await response.json();
      let errorMessage;
      if (result.error === "wrong_password") {
        errorMessage = "Contraseña incorrecta";
      } else if (result.error === "wrong_email") {
        errorMessage = "Correo incorrecto";
      } else {
        errorMessage = "Error desconocido";
      }
      loginSpan.innerText = errorMessage;
      loginSpan.style.color = "red";

      // Desaparecer el mensaje después de 5 segundos
      setTimeout(() => {
        loginSpan.innerText = "";
      }, 5000);
    }
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    loginSpan.innerText = "Error al iniciar sesión";
    loginSpan.style.color = "black";

    // Desaparecer el mensaje después de 5 segundos
    setTimeout(() => {
      loginSpan.innerText = "";
    }, 5000);
  }
});