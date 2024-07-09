function changeImage(product, color) {
    const productImage = document.getElementById(`${product}-img`);
    productImage.src = `${product}-${color}.png`;
}
