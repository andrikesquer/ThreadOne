// document.addEventListener("DOMContentLoaded", () => {
//   const products = [
//     {
//       id: 1,
//       name: "Br",
//       price: 270,
//       available: true,
//       quantity: 1,
//       image: "/images/CamisetasImagenes/Br/br negra.png",
//       colors: ["Negro", "Gris", "Blanco", "Rojo"],
//       sizes: ["XS", "S", "M", "L"],
//     },
//     {
//       id: 2,
//       name: "Cerebro",
//       price: 200,
//       available: false,
//       quantity: 1,
//       image: "/images/CamisetasImagenes/cerebro/cerebro gris.png",
//       colors: ["Negro", "Gris", "Blanco", "Rojo"],
//       sizes: ["XS", "S", "M", "L"],
//     },
//     {
//       id: 3,
//       name: "Contexto",
//       price: 200,
//       available: false,
//       quantity: 1,
//       image: "/images/CamisetasImagenes/contexto/contexto blanca.png",
//       colors: ["Negro", "Gris", "Blanco", "Rojo"],
//       sizes: ["XS", "S", "M", "L"],
//     },
//   ];

//   const cartElement = document.getElementById("cart");
//   const subtotalElement = document.getElementById("subtotal");
//   const ivaElement = document.getElementById("iva");
//   const totalElement = document.getElementById("total");

//   function getImageUrl(productName, color) {
//     const folder = productName.toLowerCase().replace(" ", "");
//     const formattedColor = color.toLowerCase();
//     return `${folder}/${folder} ${formattedColor}.png`;
//   }

//   function renderCart() {
//     cartElement.innerHTML = "";
//     let subtotal = 0;

//     products.forEach((product) => {
//       if (product.quantity > 0) {
//         const productElement = document.createElement("div");
//         productElement.className = "product";

//         productElement.innerHTML = `
//                     <div class="product-info">
//                         <img src="${product.image}" alt="Product Image">
//                         <div>
//                             <h2>${product.name}</h2>
//                             <p class="${
//                               product.available ? "available" : "unavailable"
//                             }">${
//           product.available ? "Disponible" : "Inaccesible"
//         }</p>
//                             <div class="flex items-center space-x-2 mt-2">
//                                 <input type="number" value="${
//                                   product.quantity
//                                 }" min="1" class="quantity-input" onchange="updateQuantity(${
//           product.id
//         }, this.value)">
//                                 <select class="color-select" onchange="updateColor(${
//                                   product.id
//                                 }, this.value)">
//                                     ${product.colors
//                                       .map(
//                                         (color) =>
//                                           `<option value="${color}" ${
//                                             product.color === color
//                                               ? "selected"
//                                               : ""
//                                           }>${color}</option>`
//                                       )
//                                       .join("")}
//                                 </select>
//                                 <select class="size-select" onchange="updateSize(${
//                                   product.id
//                                 }, this.value)">
//                                     ${product.sizes
//                                       .map(
//                                         (size) =>
//                                           `<option value="${size}" ${
//                                             product.size === size
//                                               ? "selected"
//                                               : ""
//                                           }>${size}</option>`
//                                       )
//                                       .join("")}
//                                 </select>
//                             </div>
//                         </div>
//                     </div>
//                     <div class="product-actions">
//                         <span>$${product.price}</span>
//                         <button onclick="removeFromCart(${
//                           product.id
//                         })">&times;</button>
//                     </div>
//                 `;

//         cartElement.appendChild(productElement);

//         subtotal += product.price * product.quantity;
//       }
//     });

//     const iva = subtotal * 0.05;
//     const total = subtotal + iva;

//     subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
//     ivaElement.textContent = `$${iva.toFixed(2)}`;
//     totalElement.textContent = `$${total.toFixed(2)}`;
//   }

//   window.updateQuantity = (id, quantity) => {
//     const product = products.find((p) => p.id === id);
//     if (product) {
//       product.quantity = parseInt(quantity, 10);
//       renderCart();
//     }
//   };

//   window.updateColor = (id, color) => {
//     const product = products.find((p) => p.id === id);
//     if (product) {
//       product.color = color;
//       product.image = getImageUrl(product.name, color);
//       renderCart();
//     }
//   };

//   window.updateSize = (id, size) => {
//     const product = products.find((p) => p.id === id);
//     if (product) {
//       product.size = size;
//       renderCart();
//     }
//   };

//   window.removeFromCart = (id) => {
//     const product = products.find((p) => p.id === id);
//     if (product) {
//       product.quantity = 0;
//       renderCart();
//     }
//   };

//   renderCart();
// });


document.addEventListener("DOMContentLoaded", async () => {
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
                        <input type="number" value="${product.quantity}" min="1" class="quantity-input" onchange="updateQuantity(${product.id}, this.value)">
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

      // window.removeFromCart = (id) => {
      //   const product = products.find((p) => p.id === id);
      //   if (product) {
      //     product.quantity = 0;
      //     renderCart();
      //   }
      // };

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
});
