// Función para manejar el click en "Añadir al carrito"

const $ = (el) => document.querySelector(el);

const carrito = $("#carrito");
const login = $("#login");

const detallesSpan = $("#detalles span");

carrito?.addEventListener("click", async (e) => {
  e.preventDefault();

  const producto = $("#producto").innerText;
  const size = $("#size").value;
  const quantity = $("#quantity").value;

  try {
    const res = await fetch("/add-to-cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        producto,
        size: Number(size),
        quantity: Number(quantity),
      }),
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
    window.location.reload();
  }, 1000);
});
