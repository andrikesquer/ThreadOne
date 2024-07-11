document.addEventListener('DOMContentLoaded', () => {
    const products = [
        {
            id: 1,
            name: 'Camisa Negra',
            price: 270,
            available: true,
            quantity: 1,
            image: 'path_to_image_1',
            colors: ['Negro', 'Gris', 'Blanco', 'Rojo'],
            sizes: ['XS', 'S', 'M', 'L']
        },
        {
            id: 2,
            name: 'Camisa Gris',
            price: 200,
            available: false,
            quantity: 1,
            image: 'path_to_image_2',
            colors: ['Negro', 'Gris', 'Blanco', 'Rojo'],
            sizes: ['XS', 'S', 'M', 'L']
        }
    ];

    const cartElement = document.getElementById('cart');
    const subtotalElement = document.getElementById('subtotal');
    const ivaElement = document.getElementById('iva');
    const totalElement = document.getElementById('total');

    function renderCart() {
        cartElement.innerHTML = '';
        let subtotal = 0;

        products.forEach(product => {
            if (product.quantity > 0) {
                const productElement = document.createElement('div');
                productElement.className = 'bg-white shadow-md rounded-lg p-4 flex justify-between items-center';

                productElement.innerHTML = `
                    <div class="flex items-center space-x-4">
                        <img src="${product.image}" alt="Product Image" class="w-20 h-20 rounded-lg">
                        <div>
                            <h2 class="font-bold">${product.name}</h2>
                            <p class="${product.available ? 'text-green-500' : 'text-red-500'}">${product.available ? 'Disponible' : 'Inaccesible'}</p>
                            <div class="flex items-center space-x-2 mt-2">
                                <input type="number" value="${product.quantity}" min="1" class="w-12 border rounded-md text-center" onchange="updateQuantity(${product.id}, this.value)">
                                <select class="border rounded-md" onchange="updateColor(${product.id}, this.value)">
                                    ${product.colors.map(color => `<option value="${color}">${color}</option>`).join('')}
                                </select>
                                <select class="border rounded-md" onchange="updateSize(${product.id}, this.value)">
                                    ${product.sizes.map(size => `<option value="${size}">${size}</option>`).join('')}
                                </select>
                            </div>
                        </div>
                    </div>
                    <div class="flex items-center space-x-4">
                        <span class="text-lg font-bold">$${product.price}</span>
                        <button class="text-red-500" onclick="removeFromCart(${product.id})">&times;</button>
                    </div>
                `;

                cartElement.appendChild(productElement);

                subtotal += product.price * product.quantity;
            }
        });

        const iva = subtotal * 0.05;
        const total = subtotal + iva;

        subtotalElement.textContent = `$${subtotal}`;
        ivaElement.textContent = `$${iva}`;
        totalElement.textContent = `$${total}`;
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
