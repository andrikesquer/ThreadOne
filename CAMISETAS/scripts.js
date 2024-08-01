let currentIndex = 0;

function moveCarousel(direction) {
    const items = document.querySelectorAll('.carousel-item');
    const totalItems = items.length;

    items[currentIndex].classList.remove('active');
    currentIndex = (currentIndex + direction + totalItems) % totalItems;
    items[currentIndex].classList.add('active');

    const carouselInner = document.querySelector('.carousel-inner');
    carouselInner.style.transform = `translateX(-${currentIndex * 100}%)`;
}
 /*TEMA*/
 