function changeImage(product, color) {
    const productImage = document.getElementById(`${product}-img`);
    productImage.src = `CAMISETAS${product}-${color}.png`;
}
function getQueryParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        product: params.get('product'),
        color: params.get('color')
    };
}

function loadProductDetails() {
    const { product, color } = getQueryParams();
    document.getElementById('product-img').src = `images/${product}-${color}.png`;
    document.getElementById('selected-color').innerText = color;
    // Aquí puedes añadir más lógica para cargar el nombre y el precio del producto
    // Ejemplo:
    const productName = product.replace(/-/g, ' ').toUpperCase();
    document.getElementById('product-name').innerText = productName;
    // Supón que todos los productos tienen el mismo precio en este ejemplo
    document.getElementById('product-price').innerText = '$50';
}

function addToCart() {
    const { product, color } = getQueryParams();
    const size = document.getElementById('size').value;
    // Aquí puedes añadir lógica para añadir el producto al carrito
    alert(`Added ${product} (${color}, ${size}) to cart!`);
}