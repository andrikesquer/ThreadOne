const $ = (el) => document.querySelector(el);

const updateUserForm = $("#updateUserForm");
const updateUserSpan = $("#updateUserForm span");

const logoutButton = $("#close-session");

const deleteUserButton = $("#delete-user");

updateUserForm?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nombre_usuario = $("#first-name").value.trim();
  const apellido_usuario = $("#last-name").value.trim();
  const fecha_nacimiento_usuario = $("#birth-date").value.trim();
  const fk_genero = $("#gender").value.trim();
  const email_usuario = $("#email").value.trim();
  const telefono_usuario = $("#number").value.trim();
  const contrasena_usuario = $("#password").value.trim();

  try {
    const res = await fetch("/usuario", {
      method: "PATCH",
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
    });

    if (res.ok) {
      updateUserSpan.innerText = "Actualización exitosa";
      updateUserSpan.style.color = "green";
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } else {
      updateUserSpan.innerText = "Error al actualizar";
      updateUserSpan.style.color = "black";
    }
  } catch (error) {
    console.log(error);
  }
});

logoutButton?.addEventListener("click", (e) => {
  e.preventDefault();

  fetch("/logout", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((res) => {
    console.log(res);
    window.location.href = "/";
  });
});

deleteUserButton?.addEventListener("click", async (e) => {
  e.preventDefault();

  try {
    const res = await fetch("/usuario", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (res.ok) {
      setTimeout(() => {
        window.location.href = "/logout";
      }, 1000);
    }
  } catch (error) {
    console.log(error);
  }
});
