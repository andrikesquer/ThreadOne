function addToCart() {
    const product = {
        name: "Sticker diseño original",
        price: 30,
        size: document.getElementById('size').value
    };

    fetch('/add-to-cart', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ product })
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function addToFavorites() {
    const product = {
        name: "Sticker diseño original",
        price: 30,
        size: document.getElementById('size').value
    };

    fetch('/add-to-favorites', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ product })
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}