document.addEventListener("DOMContentLoaded", async () => {

  const style = document.createElement('style');
    style.textContent = `
        body {
            background-color: #eeeeee;
            margin: 0;
            overflow-x: hidden;
            font-family: 'Inter', sans-serif;
        }

        .cart-button, .account-button {
            margin-left: 20px;
            display: flex;
            align-items: center;
            text-decoration: none;
            color: inherit;
            font-size: 16px;
            color: #ffffff;
        }
        .cart-button svg {
            margin-left: 8px;
        }
        main {
          display: flex;
          position: relative;
          top: 8vh;
          margin: 15%;
          margin-bottom: 0px;
          margin-top: 7vh;
          flex-wrap: wrap;
          justify-content: space-evenly;
          font-family: "Cormorant", serif;
        }
        .main-container {
            display: flex;
            justify-content: center;
            align-items: flex-start;
            min-height: calc(100vh - 70px);
            padding: 20px;
        }
        .information {
            background-color: white;
            padding: 2%;
            border-radius: 30px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            width: 100%;
            max-width: 1200px;
            margin-bottom: 20px;
        }
        h1 {
            font-family: "Cormorant", serif;
            font-size: 70px;
            font-weight: 700;
            margin-top: 0;
            margin-bottom: 20px;
            text-align: center;
        }
        .subtitle {
            margin-bottom: 20px;
            margin-top: 0;
            font-size: 30px;
            font-family: "Cormorant", serif;
            text-align: center;
        }
        .favorites {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            padding: 20px;
            justify-items: center;
        }
        .favorite-item {
            background-color: #fff;
            border: 1px solid #ddd;
            border-radius: 20px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            overflow: hidden;
            width: 100%;
            max-width: 300px;
            text-align: center;
            position: relative;
            transition: transform 0.2s;
            padding: 4%;
        }
        .favorite-item img {
            width: 100%;
            height: auto;
            object-fit: cover;
        }
        .favorite-item h2 {
            font-size: 1.2em;
            margin: 15px 0;
            color: #333;
        }
        .price {
            font-size: 1.1em;
            color: #000000;
            margin: 10px 0;
        }
        .availability {
            font-size: 0.9em;
            color: green;
            text-align: center;
        }
        .remove-favorite {
            background-color: transparent;
            border: none;
            position: absolute;
            top: 10px;
            right: 10px;
            cursor: pointer;
        }
        .remove-icon {
            width: 24px;
            height: 24px;
            border-radius: 5px;
            transition: transform .5s ease-in-out;
        }
        .remove-favorite:hover .remove-icon {
            transform: scale(1.5);
        }
        @media (max-width: 768px) {
            .favorites {
                grid-template-columns: 1fr;
            }
        }
    `;
    document.head.appendChild(style);
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
  