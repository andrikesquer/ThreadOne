const $ = (el) => document.querySelector(el);

const registerForm = $("#form");
const registerSpan = $("#form span");

registerForm?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nombre_usuario = $("#first-name").value;
  const apellido_usuario = $("#last-name").value;
  const fecha_nacimiento_usuario = $("#birth-date").value;
  const fk_genero = $("#gender").value;
  const email_usuario = $("#email").value;
  const telefono_usuario = $("#number").value;
  const contrasena_usuario = $("#password").value;

  fetch("/registro", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      nombre_usuario,
      apellido_usuario,
      fecha_nacimiento_usuario,
      fk_genero: Number(fk_genero),
      email_usuario,
      telefono_usuario: Number(telefono_usuario),
      contrasena_usuario,
    }),
  }).then((res) => {
    if (res.ok) {
      registerSpan.innerText = "Usuario registrado correctamente";
      registerSpan.style.color = "green";
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    } else {
      registerSpan.innerText = "Error al registrar usuario";
      registerSpan.style.color = "black";
    }
  });
});
