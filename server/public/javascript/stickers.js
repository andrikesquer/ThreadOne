// function addToCart() {
//   const product = {
//     name: "Sticker diseño original",
//     price: 30,
//     size: document.getElementById("size").value,
//   };

//   fetch("/add-to-cart", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({ product }),
//   })
//     .then((response) => response.json())
//     .then((data) => {
//       alert(data.message);
//     })
//     .catch((error) => {
//       console.error("Error:", error);
//     });
// }

// function addToFavorites() {
//   const product = {
//     name: "Sticker diseño original",
//     price: 30,
//     size: document.getElementById("size").value,
//   };

//   fetch("/add-to-favorites", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({ product }),
//   })
//     .then((response) => response.json())
//     .then((data) => {
//       alert(data.message);
//     })
//     .catch((error) => {
//       console.error("Error:", error);
//     });
// }

// Función para cargar los stickers desde el archivo JSON
function loadStickers() {
  fetch("/json/stickers.json")
    .then((response) => response.json())
    .then((data) => {
      const container = document.getElementById("stickers-container");
      data.forEach((sticker) => {
        const stickerElement = document.createElement("div");
        stickerElement.className = "swiper-slide";
        stickerElement.innerHTML = `
                                    <div class="icons">
                                        <i></i>
                                        <div class="heart-container" title="Like">
                                            <input type="checkbox" class="checkbox" id="Give-It-An-Id">
                                            <div class="svg-container">
                                                <svg viewBox="0 0 24 24" class="svg-outline" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M17.5,1.917a6.4,6.4,0,0,0-5.5,3.3,6.4,6.4,0,0,0-5.5-3.3A6.8,6.8,0,0,0,0,8.967c0,4.547,4.786,9.513,8.8,12.88a4.974,4.974,0,0,0,6.4,0C19.214,18.48,24,13.514,24,8.967A6.8,6.8,0,0,0,17.5,1.917Zm-3.585,18.4a2.973,2.973,0,0,1-3.83,0C4.947,16.006,2,11.87,2,8.967a4.8,4.8,0,0,1,4.5-5.05A4.8,4.8,0,0,1,11,8.967a1,1,0,0,0,2,0,4.8,4.8,0,0,1,4.5-5.05A4.8,4.8,0,0,1,22,8.967C22,11.87,19.053,16.006,13.915,20.313Z">
                                                    </path>
                                                </svg>
                                                <svg viewBox="0 0 24 24" class="svg-filled" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M17.5,1.917a6.4,6.4,0,0,0-5.5,3.3,6.4,6.4,0,0,0-5.5-3.3A6.8,6.8,0,0,0,0,8.967c0,4.547,4.786,9.513,8.8,12.88a4.974,4.974,0,0,0,6.4,0C19.214,18.48,24,13.514,24,8.967A6.8,6.8,0,0,0,17.5,1.917Z">
                                                    </path>
                                                </svg>
                                                <svg class="svg-celebrate" width="100" height="100" xmlns="http://www.w3.org/2000/svg">
                                                    <polygon points="10,10 20,20"></polygon>
                                                    <polygon points="10,50 20,50"></polygon>
                                                    <polygon points="20,80 30,70"></polygon>
                                                    <polygon points="90,10 80,20"></polygon>
                                                    <polygon points="90,50 80,50"></polygon>
                                                    <polygon points="80,80 70,70"></polygon>
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div class="product-content" id="productContent">
                                        <div class="product-txt">
                                            <span id="precio">$${sticker.precio}</span>
                                            <h3 id="descripcion_sticker">${sticker.descripcion_sticker}</h3>
                                            <p>Disponible</p>
                                        </div>
                                        <div class="product-img">
                                            <img src="${sticker.imagen}" alt="${sticker.nombre}" id="imagen">
                                        </div>
                                    </div>
                                    <a href="/stickers/${sticker.descripcion_sticker}?precio=${sticker.precio}&imagen=${sticker.imagen}">
                                        <button id="detalles">Ver más</button>
                                    </a>
                                `;
        container.appendChild(stickerElement);
      });

      // Inicializar Swiper después de cargar los stickers
      var swiper = new Swiper(".mySwiper", {
        effect: "coverflow",
        grabCursor: true,
        centeredSlides: true,
        slidesPerView: "auto",
        loop: true,
        coverflowEffect: {
          depth: 500,
          modifier: 1,
          slideShadows: true,
          rotate: 0,
          stretch: 0,
        },
      });
    })
    .catch((error) => console.error("Error loading stickers:", error));
}
window.onload = loadStickers;
