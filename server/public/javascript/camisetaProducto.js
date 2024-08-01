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
            try {
                const response = await fetch('/cart/add', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ color, size, quantity }),
                });

                console.log('Response status:', response.status);
                console.log('Response headers:', response.headers);

                if (response.ok) {
                    const data = await response.json(); // Parse response body as JSON if available
                    console.log('Response data:', data);
                    alert("Added to cart!");
                } else if (response.status === 401) {
                    alert("You are not authenticated. Please log in.");
                } else if (response.status === 404) {
                    alert("Product not found.");
                } else {
                    alert("An error occurred. Please try again.");
                }
            } catch (error) {
                console.error('Error adding to cart:', error);
                alert("Failed to add to cart.");
            }
        } else {
            alert("Invalid color or size selection.");
        }
    });

    document.querySelector(".save-favorite").addEventListener("click", async () => {
    console.log("hola mama");
    });
});
