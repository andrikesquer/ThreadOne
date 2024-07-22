document.addEventListener('DOMContentLoaded', () => {
    const cart = [];
    const cartButton = document.querySelector('.cart-button');
    const cartOverlay = document.createElement('div');
    const cartContent = document.createElement('div');
    const cartList = document.createElement('ul');
    const totalElement = document.createElement('p');

    cartOverlay.id = 'cart-overlay';
    cartContent.id = 'cart-content';
    cartContent.innerHTML = '<h2>Carrito de Compras</h2>';
    totalElement.id = 'total';
    totalElement.innerHTML = 'Total: $0';
    cartContent.appendChild(cartList);
    cartContent.appendChild(totalElement);
    cartOverlay.appendChild(cartContent);
    document.body.appendChild(cartOverlay);

    cartOverlay.style.display = 'none';
    cartOverlay.style.position = 'fixed';
    cartOverlay.style.top = '0';
    cartOverlay.style.left = '0';
    cartOverlay.style.width = '100%';
    cartOverlay.style.height = '100%';
    cartOverlay.style.backgroundColor = 'rgba(0,0,0,0.5)';
    cartOverlay.style.zIndex = '1000';
    cartContent.style.position = 'absolute';
    cartContent.style.top = '50%';
    cartContent.style.left = '50%';
    cartContent.style.transform = 'translate(-50%, -50%)';
    cartContent.style.backgroundColor = 'white';
    cartContent.style.padding = '20px';
    cartContent.style.borderRadius = '10px';
    cartContent.style.width = '300px';

    cartButton.addEventListener('click', () => {
        cartOverlay.style.display = 'block';
    });

    cartOverlay.addEventListener('click', (event) => {
        if (event.target === cartOverlay) {
            cartOverlay.style.display = 'none';
        }
    });

    function updateCart() {
        cartList.innerHTML = '';
        let total = 0;
        cart.forEach(item => {
            const li = document.createElement('li');
            li.textContent = `${item.name} - $${item.price}`;
            cartList.appendChild(li);
            total += item.price;
        });
        totalElement.innerHTML = `Total: $${total}`;
    }

    document.querySelectorAll('.sticker').forEach(sticker => {
        const button = sticker.querySelector('button');
        button.addEventListener('click', (event) => {
            event.preventDefault();
            const name = sticker.querySelector('p:nth-of-type(2)').textContent;
            const price = parseFloat(sticker.querySelector('p:nth-of-type(1)').textContent.replace('$', ''));

            const item = { name, price };
            cart.push(item);
            updateCart();
        });
    });
});
