document.addEventListener("DOMContentLoaded", () => {
    const languageBtn = document.getElementById("languageBtn");
    const elementsToTranslate = {
        en: {
            cart: "Cart",
            favorites: "Favorites",
            greeting: "Hey, you",
            threadOne: "ThreadOne",
            discover: "DISCOVER EVERYTHING WE HAVE FOR YOU",
            stickers: "STICKERS",
            design: "DESIGN",
            tshirts: "T-SHIRTS",
            createStyle: "Start creating your own style and your own life",
            register: "Sign Up",
            login: "Log In"
        },
        es: {
            cart: "Carrito",
            favorites: "Favoritos",
            greeting: "Hey, tú",
            threadOne: "ThreadOne",
            discover: "DESCUBRE TODO LO QUE TENEMOS PARA TI",
            stickers: "STICKERS",
            design: "DISEÑA",
            tshirts: "PLAYERAS",
            createStyle: "Empieza a crear tu propio estilo y tu propia vida",
            signup: "Registrate",
            login: "Inicia Sesión"
        }
    };

    let currentLanguage = "es";

    languageBtn.addEventListener("click", () => {
        currentLanguage = currentLanguage === "es" ? "en" : "es";
        translatePage(currentLanguage);
    });

    function translatePage(lang) {
        document.getElementById("cart").textContent = elementsToTranslate[lang].cart;
        document.getElementById("favorites").textContent = elementsToTranslate[lang].favorites;
        document.getElementById("greeting").textContent = elementsToTranslate[lang].greeting;
        document.getElementById("threadOne").textContent = elementsToTranslate[lang].threadOne;
        document.getElementById("discover").innerHTML = elementsToTranslate[lang].discover;
        document.getElementById("stickers").textContent = elementsToTranslate[lang].stickers;
        document.getElementById("design").textContent = elementsToTranslate[lang].design;
        document.getElementById("tshirts").textContent = elementsToTranslate[lang].tshirts;
        document.getElementById("createStyle").textContent = elementsToTranslate[lang].createStyle;
        document.getElementById("register").textContent = elementsToTranslate[lang].register;
        document.getElementById("login").textContent = elementsToTranslate[lang].login;
    }

    const track = document.getElementById('image-track');
    const images = Array.from(track.getElementsByClassName('image'));
    const step = 1; // Adjust this value to control the speed of the carousel
    const interval = 20; // Update interval in milliseconds
    let position = 0;

    function updateCarousel() {
        position -= step;
        if (position <= -track.scrollWidth / images.length) {
            position = 0;
            track.appendChild(images.shift());
            images.push(track.firstElementChild);
        }
        track.style.transform = `translateX(${position}px)`;
    }

    setInterval(updateCarousel, interval);
});
