// src/js/filters-digital.js - Sirf Digital products load karega

// ZAROORI: Cart logic ko use karne ke liye import zaroori hai
import { addToCart } from './cart.js'; 

const productGrid = document.getElementById('product-grid');
const typeFilters = document.getElementById('type-filters');

let allProducts = []; 

// Function: Single Product Card ka HTML banana
function createProductCard(product) {
    // ✅ CHANGE 1: Ab 'Digital' category check ho rahi hai
    if (product.category !== 'Digital') return ''; 

    const productLink = `/product-detail.html?id=${product.id}`; 

    return `
        <a href="${productLink}" class="product-card-link">
            <div class="product-card" data-type="${product.type}">
                <img src="${product.image_url}" alt="${product.name}">
                <div class="card-info">
                    <h3>${product.name}</h3>
                    <p class="product-price">$${product.price.toFixed(2)}</p>
                    <p class="product-type">${product.type}</p>
                </div>
                <div class="card-actions">
                    <button class="btn-primary" 
                        onclick="event.preventDefault(); handleAddToCartClick(${product.id});">
                        Download Now / Add to Cart
                    </button>
                    <button class="btn-secondary" onclick="event.preventDefault(); window.location.href='${productLink}'">Details</button>
                </div>
            </div>
        </a>
    `;
}

// Function: Products ko Grid mein Render karna (Same)
function renderProducts(productsToRender) {
    productGrid.innerHTML = '';
    // ... (rest of the renderProducts function) ...
    if (productsToRender.length === 0) {
        productGrid.innerHTML = '<p class="no-results">Sorry, no digital items found for this filter.</p>';
        return;
    }
    productsToRender.forEach(product => {
        productGrid.innerHTML += createProductCard(product);
    });
}

// Function: API se data fetch karna
async function fetchProducts() {
    try {
        const response = await fetch('/api/products');
        const data = await response.json();
        
        // ✅ FILTER: Yahaan sirf 'Digital' products filter ho rahe hain
        allProducts = data.filter(p => p.category === 'Digital');
        
        renderProducts(allProducts); 

    } catch (error) {
        console.error("Error fetching data:", error);
        productGrid.innerHTML = '<h3 class="error-message">Could not load digital products. Please check server connection.</h3>';
    }
}

// Cart Functionality for Digital Products (No size needed, size 'N/A' bhej rahe hain)
window.handleAddToCartClick = (productId) => {
    const product = allProducts.find(p => p.id === productId);
    if (product) {
        addToCart(product, 1, 'N/A'); 
    }
};

// Function: Filters par click handle karna (Same)
function handleFilterClick(event) {
    const button = event.target.closest('button');
    if (!button) return;

    typeFilters.querySelectorAll('button').forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');

    const filterType = button.getAttribute('data-filter');
    
    let filteredList = [];
    if (filterType === 'all') {
        filteredList = allProducts;
    } else {
        // Filter by 'type' (e.g., Template, E-book)
        filteredList = allProducts.filter(p => p.type === filterType); 
    }

    renderProducts(filteredList);
}

// Event Listeners and Initialization
typeFilters.addEventListener('click', handleFilterClick);
fetchProducts();