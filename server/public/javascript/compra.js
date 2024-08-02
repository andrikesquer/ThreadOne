document.addEventListener("DOMContentLoaded", function () {
  const paymentMethods = document.querySelectorAll('input[name="payment-method"]');
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

  document.querySelectorAll('.locacion input[type="radio"]').forEach((radio) => {
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

  async function fetchAndRenderCart() {
    try {
      const response = await fetch('/cart/items');
      if (response.ok) {
        const products = await response.json();

        const cartElement = document.getElementById("cart");
        const subtotalElement = document.getElementById("subtotal");
        const ivaElement = document.getElementById("iva");
        const totalElement = document.getElementById("total");

        const colorMap = {
          "blanco": 1,
          "negro": 2,
          "gris": 3
        };

        const sizeMap = {
          "S": 1,
          "M": 2,
          "L": 3,
          "XL": 4,
          "XXL": 5
        };

        // Create reverse maps
        const reverseColorMap = Object.fromEntries(Object.entries(colorMap).map(([key, value]) => [value, key]));
        const reverseSizeMap = Object.fromEntries(Object.entries(sizeMap).map(([key, value]) => [value, key]));

        function getImageUrl(pathToImg) {
          return pathToImg;
        }

        function renderCart() {
          cartElement.innerHTML = "";
          let subtotal = 0;

          products.forEach((product) => {
            if (product.quantity > 0) {
              const productElement = document.createElement("div");
              productElement.className = "product";

              const colorName = reverseColorMap[product.color];
              const sizeName = reverseSizeMap[product.size];

              productElement.innerHTML = `
                <div class="product-info">
                  <img src="${getImageUrl(product.pathToImg)}" alt="Product Image">
                  <div>
                    <h2>${product.shirtId}</h2>
                    <div class="flex items-center space-x-2 mt-2">
                      <div class="quantity-display">
                        Quantity: ${product.quantity}
                      </div>
                      <div class="color-display">
                        Color: ${colorName ? colorName : 'No color selected'}
                      </div>
                      <div class="size-display">
                        Size: ${sizeName ? sizeName : 'No size selected'}
                      </div>
                    </div>
                  </div>
                </div>
                <div class="product-actions">
                  <span>$${product.price}</span>
                  <button onclick="removeFromCart(${product.id})">&times;</button>
                </div>
              `;

              cartElement.appendChild(productElement);

              subtotal += product.price * product.quantity;
            }
          });

          // Add the extra 370 to the subtotal
          subtotal += 370;

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
            product.image = getImageUrl(product.pathToImg);
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

        window.removeFromCart = async (id) => {
          const product = products.find((p) => p.id === id);
          if (product) {
            try {
              const response = await fetch(`/cart/delete/${id}`, {
                method: 'DELETE',
              });
              if (response.ok) {
                products.splice(products.indexOf(product), 1); // Remove the product from the array
                renderCart(); // Re-render the cart
              } else {
                console.error('Failed to delete product from cart');
              }
            } catch (error) {
              console.error('Error deleting product from cart:', error);
            }
          }
        };

        renderCart();
      } else {
        console.error('Failed to fetch cart items.');
      }
    } catch (error) {
      console.error('Error fetching cart items:', error);
    }
  }

  fetchAndRenderCart();
});
