document.addEventListener("DOMContentLoaded", async () => {
    // Función para manejar el click en "Añadir a favoritos" para camisetas
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
          stickerId: null,
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
            alert('Producto agregado a favoritos');
          } else {
            alert('Error al agregar producto a favoritos');
          }
        } catch (error) {
          console.error('Error en la solicitud:', error);
          alert('Error en la solicitud');
        }
      });
    }
  
    // Función para manejar el click en "Añadir a favoritos" para stickers
    const saveStickerButton = document.querySelector(".save-sticker");
    if (saveStickerButton) {
      saveStickerButton.addEventListener("click", async () => {
        const nombre = document.getElementById("descripcion").value;
        const price = parseFloat(document.getElementById("precio").textContent.replace('$MX', ''));
        const size = document.getElementById("size").value;
        const imageUrl = document.getElementById("sticker-image").src;
        const url = new URL(imageUrl);
        const path = url.pathname;
  
        const favoriteData = {
          shirtId: null,
          stickerId: nombre,
          color: null,
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
            alert('Producto agregado a favoritos');
          } else {
            alert('Error al agregar producto a favoritos');
          }
        } catch (error) {
          console.error('Error en la solicitud:', error);
          alert('Error en la solicitud');
        }
      });
    }
  
    // Obtener y mostrar los productos favoritos
    try {
      const response = await fetch('/favorites');
      if (response.ok) {
        const favorites = await response.json();
        const favoritesContainer = document.getElementById('favorites-container'); // Ajusta el ID según tu HTML
  
        favorites.forEach(favorite => {
          const favoriteItem = document.createElement('div');
          favoriteItem.className = 'favorite-item';
  
          favoriteItem.innerHTML = `
            <img src="${favorite.pathToImg}" alt="Imagen">
            <p>Nombre: ${favorite.shirtId || favorite.stickerId}</p>
            ${favorite.color !== null ? `<p>Color: ${favorite.color}</p>` : ''}
            <p>Tamaño: ${favorite.size}</p>
            <p>Cantidad: ${favorite.quantity}</p>
            <p>Precio: $${favorite.price}</p>
            <button class="remove-favorite" data-id="${favorite.id}">Eliminar</button>
          `;
  
          favoritesContainer.appendChild(favoriteItem);
        });
  
        // Añadir event listener a los botones de eliminar
        document.querySelectorAll('.remove-favorite').forEach(button => {
          button.addEventListener('click', async (event) => {
            const id = event.target.getAttribute('data-id');
            try {
              const deleteResponse = await fetch(`/favorites/delete/${id}`, { method: 'DELETE' });
              if (deleteResponse.ok) {
                event.target.parentElement.remove();
                alert('Producto eliminado de favoritos');
              } else {
                alert('Error al eliminar producto de favoritos');
              }
            } catch (error) {
              console.error('Error en la solicitud:', error);
              alert('Error en la solicitud');
            }
          });
        });
      } else {
        alert('Error al obtener productos favoritos');
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
      alert('Error en la solicitud');
    }
  });
  