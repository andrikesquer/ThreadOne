document.addEventListener("DOMContentLoaded", function () {
  const paymentMethods = document.querySelectorAll(
    'input[name="payment-method"]'
  );

  const paymentDetails = document.querySelectorAll(".payment-details");
  const paymentOptions = document.querySelectorAll(".payment-option");

  paymentMethods.forEach((method) => {
    method.addEventListener("change", function () {
      paymentDetails.forEach((detail) => {
        detail.classList.remove("active");
      });

      paymentOptions.forEach((option) => {
        option.classList.remove("selected");
      });

      const selectedDetail = document.getElementById(this.value);
      if (selectedDetail) {
        selectedDetail.classList.add("active");
      }

      this.parentElement.classList.add("selected");
    });
  });

  document
    .querySelectorAll('.locacion input[type="radio"]')
    .forEach((radio) => {
      radio.addEventListener("click", function () {
        // Si ya está seleccionado, reiniciar el estado
        if (this.parentElement.classList.contains("selected")) {
          this.checked = false; // Desmarcar el radio button
          this.parentElement.classList.remove("selected"); // Quitar la clase 'selected'
          return; // Salir del manejador
        }

        // Quitar la clase 'selected' de todas las locaciones
        document.querySelectorAll(".locacion").forEach((locacion) => {
          locacion.classList.remove("selected");
        });

        // Añadir la clase 'selected' al label del radio button seleccionado
        this.parentElement.classList.add("selected");
      });
    });
});

const buyButton = document.querySelector(".buy-button");
const popup = document.getElementById("popup");
const closePopup = document.getElementById("closePopup");

buyButton.addEventListener("click", function () {
  popup.style.display = "block";
  // Use setTimeout to trigger the transition
  setTimeout(() => {
    popup.classList.add("show");
  }, 10);
});

closePopup.addEventListener("click", function () {
  popup.classList.remove("show");
  // Wait for the transition to finish before hiding the popup
  setTimeout(() => {
    popup.style.display = "none";
    // Redirect to the home page
    window.location.href = "/";
  }, 300);
});

// Close the popup if the user clicks outside of it
window.addEventListener("click", function (event) {
  if (event.target === popup) {
    popup.classList.remove("show");
    setTimeout(() => {
      popup.style.display = "none";
      // Redirect to the home page
      window.location.href = "/";
    }, 300);
  }
});

// Eliminar los productos del carrito de compras
const $ = (el) => document.querySelector(el);

const finalizarCompra = $("#finalizarCompra");

finalizarCompra?.addEventListener("click", (e) => {
  e.preventDefault();

  async function clearCart() {
    try {
      const response = await fetch("/clear-cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Ocurrió un error al limpiar el carrito");
      }

      const result = await response.json();
      console.log(result.message);
    } catch (error) {
      console.error("Ocurrió un error al limpiar el carrito", error);
    }
  }
  clearCart();
});
