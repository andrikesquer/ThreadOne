// document.addEventListener("DOMContentLoaded", () => {
//     const colorMap = {
//         "blanco": 1,
//         "negro": 2,
//         "gris": 3
//     };

//     const sizeMap = {
//         "S": 1,
//         "M": 2,
//         "L": 3,
//         "XL": 4,
//         "XXL": 5
//     };

//     document.querySelector(".add-to-cart").addEventListener("click", async () => {
//         const colorName = document.getElementById("color").value;
//         const sizeName = document.getElementById("size").value;
//         const price = parseFloat(document.getElementById("price").textContent.replace('$',''));
//         const name = document.getElementById("nombre").textContent;
//         const quantity = 1;

//         const imageUrl = document.getElementById("shirt-image").src;
//         const url = new URL(imageUrl);
//         const path = url.pathname;

//         // const shirtId = 'shirt_' + Date.now() + '_' + Math.floor(Math.random() * 1000);

//         const color = colorMap[colorName];
//         const size = sizeMap[sizeName];
        
//         if (color !== undefined && size !== undefined) {
//             const newItem = { name, color, size, quantity, path, price };

//             try {
//                 const response = await fetch('/cart/add', {
//                     method: 'POST',
//                     headers: {
//                         'Content-Type': 'application/json'
//                     },
//                     body: JSON.stringify(newItem)
//                 });

//                 if (response.ok) {
//                     // If the server responded with "Hola mama"
//                     const message = await response.text();
//                     alert(message);
//                     console.log(imageUrl);
//                     // Optionally, update the local storage
//                     let cart = JSON.parse(localStorage.getItem('cart')) || [];
//                     cart.push(newItem);
//                     localStorage.setItem('cart', JSON.stringify(cart));
//                     window.location.href="/camisetas"
//                 } else {
//                     // Handle server errors
//                     alert("Failed to add to cart. Server error.");
//                 }
//             } catch (error) {
//                 console.error("Error adding to cart:", error);
//                 alert("Failed to add to cart. Client error.");
//             }
//         } else {
//             alert("Invalid color or size selection.");
//         }
//     });
//     document.querySelector(".save-favorite").addEventListener("click", async () => {
//         const nombre = document.getElementById("nombre").textContent;
//         const priceText = document.getElementById("price").textContent;
//         const price = parseInt(priceText.replace('$', '').replace('MX', '').trim());
//         const size = document.getElementById("size").value;
//         const color = document.getElementById("color").value;
//         const imageUrl = document.getElementById("shirt-image").src;
//         const url = new URL(imageUrl);
//         const path = url.pathname;

//         const favoriteData = {
//             shirtId: nombre,
//             stickerId: null, // Asigna null o un valor adecuado
//             color: parseInt(color),
//             size: parseInt(size),
//             quantity: 1,
//             pathToImg: path,
//             price: price
//         };

//         try {
//             const response = await fetch('/favorites/add', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify(favoriteData)
//             });

//             if (response.ok) {
//                 alert('Producto agregado a favoritos');
//             } else {
//                 alert('Error al agregar producto a favoritos');
//             }
//         } catch (error) {
//             console.error('Error en la solicitud:', error);
//             alert('Error en la solicitud');
//         }
//     });
// });

document.addEventListener("DOMContentLoaded", () => {
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

    // Función para manejar el click en "Añadir al carrito"
    const addToCartButton = document.querySelector(".add-to-cart");
    if (addToCartButton) {
        addToCartButton.addEventListener("click", async () => {
            const colorName = document.getElementById("color").value;
            const sizeName = document.getElementById("size").value;
            const price = parseFloat(document.getElementById("price").textContent.replace('$', ''));
            const name = document.getElementById("nombre").textContent;
            const quantity = 1;

            const imageUrl = document.getElementById("shirt-image").src;
            const url = new URL(imageUrl);
            const path = url.pathname;

            const color = colorMap[colorName];
            const size = sizeMap[sizeName];

            if (color !== undefined && size !== undefined) {
                const newItem = { name, color, size, quantity, path, price };

                try {
                    const response = await fetch('/cart/add', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(newItem)
                    });

                    if (response.ok) {
                        const message = await response.text();
                        alert(message);
                        console.log(imageUrl);
                        let cart = JSON.parse(localStorage.getItem('cart')) || [];
                        cart.push(newItem);
                        localStorage.setItem('cart', JSON.stringify(cart));
                        window.location.href = "/camisetas";
                    } else {
                        alert("Failed to add to cart. Server error.");
                    }
                } catch (error) {
                    console.error("Error adding to cart:", error);
                    alert("Failed to add to cart. Client error.");
                }
            } else {
                alert("Invalid color or size selection.");
            }
        });
    }

    // Función para manejar el click en "Añadir a favoritos"
    const saveFavoriteButton = document.querySelector(".save-favorite");
    if (saveFavoriteButton) {
        saveFavoriteButton.addEventListener("click", async () => {
            const nombre = document.getElementById("nombre").textContent;
            const priceText = document.getElementById("price").textContent;
            const price = parseFloat(priceText.replace('$', '').replace('MX', '').trim());
            const size = document.getElementById("size").value;
            const color = document.getElementById("color").value;
            const imageUrl = document.getElementById("shirt-image").src;
            const url = new URL(imageUrl);
            const path = url.pathname;

            const favoriteData = {
                shirtId: nombre,
                stickerId: null, // Asigna null o un valor adecuado
                color: parseInt(color),
                size: parseInt(size),
                quantity: 1,
                pathToImg: path,
                price: price
            };

            try {
                const response = await fetch('/favorites/add', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(favoriteData)
                });

                if (response.ok) {
                    
                } else {
                    alert('Error al agregar producto a favoritos');
                }
            } catch (error) {
                console.error('Error en la solicitud:', error);
                alert('Error en la solicitud');
            }
        });
    }
});
