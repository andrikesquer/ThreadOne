const $ = (el) => document.querySelector(el);

const carrito = $("#carrito");
const login = $("#login");

const detallesSpan = $("#detalles span");

carrito?.addEventListener("click", async (e) => {
  e.preventDefault();

  const descripcion = $("#descripcion").innerText;
  const size = $("#size").value;

  try {
    const res = await fetch("/add-to-cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ descripcion, size }),
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
