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

  const products = [
    {
      id: 1,
      name: "Br",
      price: 270,
      available: true,
      quantity: 1,
      image: "/images/CamisetasImagenes/Br/br negra.png",
      colors: ["Negro", "Gris", "Blanco", "Rojo"],
      sizes: ["XS", "S", "M", "L"],
    },
    {
      id: 2,
      name: "Cerebro",
      price: 200,
      available: true,
      quantity: 1,
      image: "/images/CamisetasImagenes/cerebro/cerebro gris.png",
      colors: ["Negro", "Gris", "Blanco", "Rojo"],
      sizes: ["XS", "S", "M", "L"],
    },
  ];

  const cartElement = document.getElementById("cart");
  const subtotalElement = document.getElementById("subtotal");
  const ivaElement = document.getElementById("iva");
  const totalElement = document.getElementById("total");

  function getImageUrl(productName, color) {
    const folder = productName.toLowerCase().replace(" ", "");
    const formattedColor = color.toLowerCase();
    return `${folder}/${folder} ${formattedColor}.png`;
  }

  function renderCart() {
    cartElement.innerHTML = "";
    let subtotal = 0;

    products.forEach((product) => {
      if (product.quantity > 0) {
        const productElement = document.createElement("div");
        productElement.className = "product";

        productElement.innerHTML = `
                    <div class="product-info">
                        <img src="${product.image}" alt="Product Image">
                        <div>
                            <h2>${product.name}</h2>
                            <p class="${
                              product.available ? "available" : "unavailable"
                            }">${
          product.available ? "Disponible" : "Inaccesible"
        }</p>
                            <div class="flex items-center space-x-2 mt-2">
                                <input type="number" value="${
                                  product.quantity
                                }" min="1" class="quantity-input" onchange="updateQuantity(${
          product.id
        }, this.value)">
                                <select class="color-select" onchange="updateColor(${
                                  product.id
                                }, this.value)">
                                    ${product.colors
                                      .map(
                                        (color) =>
                                          `<option value="${color}" ${
                                            product.color === color
                                              ? "selected"
                                              : ""
                                          }>${color}</option>`
                                      )
                                      .join("")}
                                </select>
                                <select class="size-select" onchange="updateSize(${
                                  product.id
                                }, this.value)">
                                    ${product.sizes
                                      .map(
                                        (size) =>
                                          `<option value="${size}" ${
                                            product.size === size
                                              ? "selected"
                                              : ""
                                          }>${size}</option>`
                                      )
                                      .join("")}
                                </select>
                            </div>
                        </div>
                    </div>
                    <div class="product-actions">
                        <span>$${product.price}</span>
                        <button onclick="removeFromCart(${
                          product.id
                        })">&times;</button>
                    </div>
                `;

        cartElement.appendChild(productElement);

        subtotal += product.price * product.quantity;
      }
    });

    const iva = subtotal * 0.05;
    const total = subtotal + iva;

    subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    ivaElement.textContent = `$${iva.toFixed(2)}`;
    totalElement.textContent = `$${total.toFixed(2)}`;
  }

  window.updateQuantity = (id, quantity) => {
    const product = products.find((p) => p.id === id);
    if (product) {
      product.quantity = parseInt(quantity, 10);
      renderCart();
    }
  };

  window.updateColor = (id, color) => {
    const product = products.find((p) => p.id === id);
    if (product) {
      product.color = color;
      product.image = getImageUrl(product.name, color);
      renderCart();
    }
  };

  window.updateSize = (id, size) => {
    const product = products.find((p) => p.id === id);
    if (product) {
      product.size = size;
      renderCart();
    }
  };

  window.removeFromCart = (id) => {
    const product = products.find((p) => p.id === id);
    if (product) {
      product.quantity = 0;
      renderCart();
    }
  };

  const buyButton = document.querySelector('.buy-button');
  const popup = document.getElementById('popup');
  const closePopup = document.getElementById('closePopup');

  buyButton.addEventListener('click', function() {
      popup.style.display = 'block';
      // Use setTimeout to trigger the transition
      setTimeout(() => {
          popup.classList.add('show');
      }, 10);
  });

  closePopup.addEventListener('click', function() {
      popup.classList.remove('show');
      // Wait for the transition to finish before hiding the popup
      setTimeout(() => {
          popup.style.display = 'none';
          // Redirect to the home page
          window.location.href = '/';
      }, 300);
  });

  // Close the popup if the user clicks outside of it
  window.addEventListener('click', function(event) {
      if (event.target === popup) {
          popup.classList.remove('show');
          setTimeout(() => {
              popup.style.display = 'none';
              // Redirect to the home page
              window.location.href = '/';
          }, 300);
      }
  });


  renderCart();
});

