const $ = (el) => document.querySelector(el);

const loginForm = $("#loginForm");
const loginSpan = $("#loginForm span");

loginForm?.addEventListener("submit", (e) => {
  e.preventDefault();

  const email_usuario = $("#email_usuario").value;
  const contrasena_usuario = $("#contrasena_usuario").value;

  fetch("/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email_usuario, contrasena_usuario }),
  }).then((res) => {
    if (res.ok) {
      loginSpan.innerText = "Sesión iniciada correctamente";
      loginSpan.style.color = "green";
      setTimeout(() => {
        window.location.href = "/";
      }, 1000);
    } else {
      loginSpan.innerText = "Error al iniciar sesión";
      loginSpan.style.color = "black";
    }
  });
});
