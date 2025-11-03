// src/js/homepage.js

const featuredGrid = document.getElementById('featured-products');

// Function: Single Product Card ka HTML banana (Merch/Digital dono ke liye common)
function createProductCard(product) {
    const productLink = `/product-detail.html?id=${product.id}`; 

    return `
        <a href="${productLink}" class="product-card-link">
            <div class="product-card" data-category="${product.category}">
                <img src="${product.image_url}" alt="${product.name}">
                <div class="card-info">
                    <h3>${product.name}</h3>
                    <p class="product-price">$${product.price.toFixed(2)}</p>
                    <p class="product-type">${product.category}</p>
                </div>
                <div class="card-actions">
                    <button class="btn-primary" onclick="event.preventDefault(); window.location.href='${productLink}'">View Details</button>
                </div>
            </div>
        </a>
    `;
}

// Function: Featured Products load karna
async function loadFeaturedProducts() {
    try {
        // API se saare products ka data fetch karo
        const response = await fetch('/api/products');
        const allProducts = await response.json();
        
        // Sirf pehle 4 products ko featured ke liye chuno (ya koi bhi 4 random)
        const featuredProducts = allProducts.slice(0, 4); 
        
        featuredGrid.innerHTML = ''; // Loading message hatana

        if (featuredProducts.length === 0) {
            featuredGrid.innerHTML = '<p>No featured products available.</p>';
            return;
        }

        featuredProducts.forEach(product => {
            featuredGrid.innerHTML += createProductCard(product);
        });

    } catch (error) {
        console.error("Error loading featured products:", error);
        featuredGrid.innerHTML = '<p class="error-message">Could not load featured products.</p>';
    }
}

// Initialization
document.addEventListener('DOMContentLoaded', loadFeaturedProducts);