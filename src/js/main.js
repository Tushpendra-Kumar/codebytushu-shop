// src/js/main.js - FINAL CODE (PDP Logic + Cart Integration)

// Zaroori: Cart functions ko import karo (tabhi import/export kaam karega jab HTML mein type="module" ho)
import { addToCart, updateCartDisplay } from './cart.js'; 


document.addEventListener('DOMContentLoaded', () => {
    // 1. Product Detail Page (PDP) ko check aur load karna
    if (window.location.pathname.includes('product-detail.html')) {
        loadProductDetails();
    }
    
    // 2. Cart Page ko check aur load karna
    if (window.location.pathname.includes('cart.html')) {
        updateCartDisplay(); // Cart page load hote hi LocalStorage se items dikhao
    }
});


// PDP par Add to Cart button ko hook karne ka function
function setupCartListeners(product) {
    const addToCartBtn = document.getElementById('add-to-cart-btn');
    const sizeSelector = document.getElementById('size-selector');
    
    addToCartBtn.addEventListener('click', () => {
        // Size selector se value lo, ya default 'M' size select karo
        const selectedSize = sizeSelector ? sizeSelector.value : 'M'; 
        
        // cart.js se imported function ko call karo
        addToCart(product, 1, selectedSize); 
    });
}


// PDP par product details load karne ka function
async function loadProductDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    const loadingState = document.getElementById('loading-state');
    const productContent = document.getElementById('product-content');
    productContent.style.display = 'none'; 

    if (!productId) {
        loadingState.innerHTML = '<p class="error-message">Error: Product ID not found in URL.</p>';
        return;
    }

    try {
        // API se saare products ka data fetch karna
        const response = await fetch('/api/products');
        const allProducts = await response.json();
        
        // Product ko ID ke through find karna
        const product = allProducts.find(p => p.id == productId);

        if (!product) {
            loadingState.innerHTML = `<p class="error-message">Error: Product with ID ${productId} not found.</p>`;
            return;
        }

        // 3. HTML elements ko data se populate karna
        document.getElementById('product-title-tag').textContent = `${product.name} | CodeByTushu`;
        document.getElementById('product-name').textContent = product.name;
        document.getElementById('main-product-image').src = product.image_url;
        document.getElementById('main-product-image').alt = product.name;
        document.getElementById('product-price').textContent = `$${product.price.toFixed(2)}`;
        document.getElementById('product-description').textContent = product.description;

        const featuresList = document.getElementById('product-features');
        // Tags ko Features list mein daalna
        product.tags.forEach(tag => {
            const li = document.createElement('li');
            li.textContent = tag.charAt(0).toUpperCase() + tag.slice(1);
            featuresList.appendChild(li);
        });
        
        // 4. Loading state hatana aur content dikhana
        loadingState.style.display = 'none';
        productContent.style.display = 'flex'; 
        
        // 5. Cart listener set karna (Yeh zaroori hai!)
        setupCartListeners(product); 

    } catch (error) {
        console.error("Error loading product:", error);
        loadingState.innerHTML = '<p class="error-message">Error loading data. Check console for details.</p>';
    }
}

// src/js/main.js

import { loadProducts } from './products.js';
import { updateCartDisplay } from './cart.js';
import { initSearchListener } from './filters.js'; // NEW IMPORT

document.addEventListener('DOMContentLoaded', () => {
    // ... (existing PDP logic) ...
    
    // Merch/Digital page logic
    if (window.location.pathname.includes('merch.html') || window.location.pathname.includes('digital.html')) {
        loadProducts().then(allProducts => {
            // PRODUCTS load hone ke baad search listener initialize karo
            initSearchListener(allProducts); 
        });
    }

    // ... (existing Cart page logic) ...
});