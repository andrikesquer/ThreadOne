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