document.addEventListener("DOMContentLoaded", async () => {
    try {
      const response = await fetch('/favorites');
      if (response.ok) {
        const favorites = await response.json();
        const favoritesContainer = document.getElementById('favorites-container'); // Ajusta el ID según tu HTML
  
        favorites.forEach(favorite => {
          const favoriteItem = document.createElement('div');
          favoriteItem.className = 'favorite-item';
  
          favoriteItem.innerHTML = `
            <img src="${favorite.pathToImg}" alt="Imagen de la camiseta">
            <p>Nombre: ${favorite.shirtId}</p>
            <p>Color: ${favorite.color}</p>
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
  