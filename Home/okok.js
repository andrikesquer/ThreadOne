
const track = document.getElementById("image-track");

// Initialize state
track.dataset.prevPercentage = "0";

window.onmousemove = e => {
    const maxDelta = window.innerWidth / 2;

    // Use clientX directly for tracking
    const mouseDelta = e.clientX - (track.dataset.prevClientX || e.clientX);
    const percentage = (mouseDelta / maxDelta) * -100;
    let nextPercentage = parseFloat(track.dataset.prevPercentage) + percentage;

    // Clamp the percentage to the range [-100, 0]
    nextPercentage = Math.min(Math.max(nextPercentage, -100), 0);

    track.dataset.percentage = nextPercentage;
    track.dataset.prevPercentage = nextPercentage;
    track.dataset.prevClientX = e.clientX;

    track.animate({
        transform: `translate(${nextPercentage}%, -50%)`
    }, { duration: 1000, fill: "forwards" });

    for (const image of track.getElementsByClassName("image")) {
        image.animate({
            objectPosition: `${100 + nextPercentage}% center`
        }, { duration: 1000, fill: "forwards" });
    }
};
