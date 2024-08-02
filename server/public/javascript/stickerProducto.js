document.addEventListener("DOMContentLoaded", () => {
    // Función para manejar el click en "Añadir a favoritos"
    const saveFavoriteButton = document.querySelector(".save-favorite");
    if (saveFavoriteButton) {
        saveFavoriteButton.addEventListener("click", async () => {
            const nombre = document.getElementById("descripcion").value;
            const price = parseFloat(document.getElementById("precio").textContent.replace('$MX', ''));
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
                price: price
            };
            // [shirtId, stickerId, color, size, quantity, pathToImg, price]
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
