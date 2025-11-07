// src/js/main.js - FINAL SHOP INITIALIZATION AND PAGE ROUTING

import { addToCart, updateCartDisplay } from './cart.js'; 
import { initMerchShop } from './filters.js'; // Merch page logic
// 🛑 IMPORTANT: Assuming you have a filters-digital.js file in src/js
// Agar aapke paas yeh file nahi hai, toh yeh line error degi!
import { initDigitalShop } from './filters-digital.js'; // Digital page logic 


// src/js/main.js - loadProductDetails function (FIXED)

// Function: Product Detail Page (PDP) ko load karna
async function loadProductDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    const loadingState = document.getElementById('loading-state');
    const productContent = document.getElementById('product-content');
    if (productContent) productContent.style.display = 'none'; 

    if (!productId) {
        if (loadingState) loadingState.innerHTML = '<p class="error-message">Error: Product ID not found in URL.</p>';
        return;
    }

    try {
        const response = await fetch('/api/products');
        const allProducts = await response.json();
        const product = allProducts.find(p => p.id == productId);

        if (!product) {
            if (loadingState) loadingState.innerHTML = `<p class="error-message">Error: Product with ID ${productId} not found.</p>`;
            return;
        }

        // HTML elements ko data se populate karna - **SAFETY CHECKS ADDED**
        document.getElementById('product-title-tag').textContent = `${product.name} | CodeByTushu`;
        document.getElementById('product-name').textContent = product.name;
        
        // --- VITAL FIX --- Line 77 par crash se bachne ke liye
        const productImageElement = document.getElementById('main-product-image');
        if (productImageElement && product.image_url) { // Check kiya ki element exist karta hai aur data mein URL hai
            productImageElement.src = product.image_url;
            productImageElement.alt = product.name;
        }
        // --- END VITAL FIX ---
        
        // document.getElementById('main-product-image').src = product.image_url; // Yeh line abhi delete kar dein
        // document.getElementById('main-product-image').alt = product.name; // Yeh line abhi delete kar dein
        
        document.getElementById('product-price').textContent = `$${(product.price || 0).toFixed(2)}`;
        document.getElementById('product-description').textContent = product.description;

        const featuresList = document.getElementById('product-features');
        if (featuresList) {
             featuresList.innerHTML = ''; 
             // Optional check for 'tags' array
             if (Array.isArray(product.tags)) { 
                 product.tags.forEach(tag => {
                     const li = document.createElement('li');
                     li.textContent = tag.charAt(0).toUpperCase() + tag.slice(1);
                     featuresList.appendChild(li);
                 });
             }
        }
        
        // Loading state hatana aur content dikhana
        if (loadingState) loadingState.style.display = 'none';
        if (productContent) productContent.style.display = 'flex'; 
        
        // Cart listener set karna
        setupCartListeners(product); 

    } catch (error) {
        console.error("Error loading product:", error);
        if (loadingState) loadingState.innerHTML = '<p class="error-message">Error loading data. Check console for details.</p>';
    }
}

// Function: PDP par Add to Cart button ko hook karna
function setupCartListeners(product) {
    const addToCartBtn = document.getElementById('add-to-cart-btn');
    const sizeSelector = document.getElementById('size-selector');
    
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', () => {
            const selectedSize = sizeSelector ? sizeSelector.value : 'N/A'; // N/A for non-merch items
            addToCart(product, 1, selectedSize); 
        });
    }
}


// Sabhi listeners ko DOM load hone par initialize karna
document.addEventListener('DOMContentLoaded', () => {
    const pathname = window.location.pathname;

    // 1. Merch/Digital page logic - Shop initialization
    if (pathname.includes('merch.html')) {
        initMerchShop(); 
    }
    if (pathname.includes('digital.html')) {
        initDigitalShop();
    }
    
    // 2. Product Detail Page (PDP)
    if (pathname.includes('product-detail.html')) {
        loadProductDetails();
    }
    
    // 3. Cart Page
    if (pathname.includes('cart.html')) {
        updateCartDisplay(); 
    }
});

