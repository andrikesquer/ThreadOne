document.addEventListener("DOMContentLoaded", () => {
  // Función para manejar el click en "Añadir a favoritos"
  const saveFavoriteButton = document.querySelector(".save-favorite");
  if (saveFavoriteButton) {
    saveFavoriteButton.addEventListener("click", async () => {
      const nombre = document.getElementById("descripcion").value;
      const price = parseFloat(
        document.getElementById("precio").textContent.replace("$MX", "")
      );
      const size = document.getElementById("size").value;

      const imageUrl = document.getElementById("sticker-image").src;
      const url = new URL(imageUrl);
      const path = url.pathname;

      const favoriteData = {
        shirtId: null,
        stickerId: nombre, // Asigna null o un valor adecuado
        color: null, // No disponible en este contexto
        size: parseInt(size),
        quantity: 1,
        pathToImg: path,
        price: price,
      };
      // [shirtId, stickerId, color, size, quantity, pathToImg, price]
      try {
        const response = await fetch("/favorites/add", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(favoriteData),
        });

        if (response.ok) {
          alert("Producto agregado a favoritos");
        } else {
          alert("Error al agregar producto a favoritos");
        }
      } catch (error) {
        console.error("Error en la solicitud:", error);
        alert("Error en la solicitud");
      }
    });
  }
});

// Función para manejar el click en "Añadir al carrito"

const $ = (el) => document.querySelector(el);

const carrito = $("#carrito");
const login = $("#login");

const detallesSpan = $("#detalles span");

carrito?.addEventListener("click", async (e) => {
  e.preventDefault();

  const producto = $("#producto").innerText;
  const size = $("#size").value;

  try {
    const res = await fetch("/add-to-cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ producto, size }),
    });

    if (res.ok) {
      detallesSpan.innerText = "Producto agregado al carrito";
      detallesSpan.style.color = "green";
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } else {
      detallesSpan.innerText = "Error al agregar el producto al carrito";
      detallesSpan.style.color = "black";
    }
  } catch (error) {
    console.error("Error al agregar producto al carrito:", error);
  }
});

login?.addEventListener("click", async (e) => {
  e.preventDefault();

  detallesSpan.innerText =
    "Debe iniciar sesión para agregar productos al carrito";
  detallesSpan.style.color = "black";

  setTimeout(() => {
    window.location.href = "/login";
  }, 1000);
});
