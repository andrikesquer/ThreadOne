document.addEventListener('DOMContentLoaded', () => {
    const products = [
        {
            id: 1,
            name: 'Br',
            price: 270,
            available: true,
            quantity: 1,
            image: 'Br/br negra.png',
            colors: ['Negro', 'Gris', 'Blanco', 'Rojo'],
            sizes: ['XS', 'S', 'M', 'L']
        },
        {
            id: 2,
            name: 'Cerebro',
            price: 200,
            available: false,
            quantity: 1,
            image: 'cerebro/cerebro gris.png',
            colors: ['Negro', 'Gris', 'Blanco', 'Rojo'],
            sizes: ['XS', 'S', 'M', 'L']
        },
        {
            id: 3,
            name: 'Contexto',
            price: 200,
            available: false,
            quantity: 1,
            image: 'contexto/contexto blanca.png',
            colors: ['Negro', 'Gris', 'Blanco', 'Rojo'],
            sizes: ['XS', 'S', 'M', 'L']
        }
    ];

    const cartElement = document.getElementById('cart');
    const subtotalElement = document.getElementById('subtotal');
    const ivaElement = document.getElementById('iva');
    const totalElement = document.getElementById('total');

    function getImageUrl(productName, color) {
        const folder = productName.toLowerCase().replace(' ', '');
        const formattedColor = color.toLowerCase();
        return `${folder}/${folder} ${formattedColor}.png`;
    }

    function renderCart() {
        cartElement.innerHTML = '';
        let subtotal = 0;

        products.forEach(product => {
            if (product.quantity > 0) {
                const productElement = document.createElement('div');
                productElement.className = 'product';

                productElement.innerHTML = `
                    <div class="product-info">
                        <img src="${product.image}" alt="Product Image">
                        <div>
                            <h2>${product.name}</h2>
                            <p class="${product.available ? 'available' : 'unavailable'}">${product.available ? 'Disponible' : 'Inaccesible'}</p>
                            <div class="flex items-center space-x-2 mt-2">
                                <input type="number" value="${product.quantity}" min="1" class="quantity-input" onchange="updateQuantity(${product.id}, this.value)">
                                <select class="color-select" onchange="updateColor(${product.id}, this.value)">
                                    ${product.colors.map(color => `<option value="${color}" ${product.color === color ? 'selected' : ''}>${color}</option>`).join('')}
                                </select>
                                <select class="size-select" onchange="updateSize(${product.id}, this.value)">
                                    ${product.sizes.map(size => `<option value="${size}" ${product.size === size ? 'selected' : ''}>${size}</option>`).join('')}
                                </select>
                            </div>
                        </div>
                    </div>
                    <div class="product-actions">
                        <span>$${product.price}</span>
                        <button onclick="removeFromCart(${product.id})">&times;</button>
                    </div>
                `;

                cartElement.appendChild(productElement);

                subtotal += product.price * product.quantity;
            }
        });

        const iva = subtotal * 0.05;
        const total = subtotal + iva;

        subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
        ivaElement.textContent = `$${iva.toFixed(2)}`;
        totalElement.textContent = `$${total.toFixed(2)}`;
    }

    window.updateQuantity = (id, quantity) => {
        const product = products.find(p => p.id === id);
        if (product) {
            product.quantity = parseInt(quantity, 10);
            renderCart();
        }
    };

    window.updateColor = (id, color) => {
        const product = products.find(p => p.id === id);
        if (product) {
            product.color = color;
            product.image = getImageUrl(product.name, color);
            renderCart();
        }
    };

    window.updateSize = (id, size) => {
        const product = products.find(p => p.id === id);
        if (product) {
            product.size = size;
            renderCart();
        }
    };

    window.removeFromCart = (id) => {
        const product = products.find(p => p.id === id);
        if (product) {
            product.quantity = 0;
            renderCart();
        }
    };

    renderCart();
});
