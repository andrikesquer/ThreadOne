document.addEventListener("DOMContentLoaded", () => {
    const colorMap = {
        "blanco": 1,
        "negro": 2,
        "gris": 3
    };

    const sizeMap = {
        "S": 1,
        "M": 2,
        "L": 3,
        "XL": 4,
        "XXL": 5
    };

    document.querySelector(".add-to-cart").addEventListener("click", async () => {
        const colorName = document.getElementById("color").value;
        const sizeName = document.getElementById("size").value;
        const quantity = 1;

        const color = colorMap[colorName];
        const size = sizeMap[sizeName];

        if (color !== undefined && size !== undefined) {
            const newItem = { color, size, quantity };

            try {
                const response = await fetch('/cart/add', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(newItem)
                });

                if (response.ok) {
                    // If the server responded with "Hola mama"
                    const message = await response.text();
                    alert(message);

                    // Optionally, update the local storage
                    let cart = JSON.parse(localStorage.getItem('cart')) || [];
                    cart.push(newItem);
                    localStorage.setItem('cart', JSON.stringify(cart));
                } else {
                    // Handle server errors
                    alert("Failed to add to cart. Server error.");
                }
            } catch (error) {
                console.error("Error adding to cart:", error);
                alert("Failed to add to cart. Client error.");
            }
        } else {
            alert("Invalid color or size selection.");
        }
    });
});
