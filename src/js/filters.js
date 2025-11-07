// src/js/filters.js - Merch Products ko handle karega

// 🛑 IMPORTANT: Yeh line Merch shop ke liye zaroori hai agar aap Add to Cart button add karna chahte hain
// import { addToCart } from './cart.js'; 

const productGrid = document.getElementById('product-grid');
const typeFilters = document.getElementById('type-filters');
const searchInput = document.getElementById('search-input'); // Search input ko yahan define karo

let allMerchProducts = [];
let currentFilterType = 'all'; 
let currentSearchTerm = ''; 

// Function: Single Product Card ka HTML banana
function createProductCard(product) {
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
                    <button class="btn-primary" onclick="event.preventDefault(); window.location.href='${productLink}'">Details</button>
                    <button class="btn-secondary" onclick="event.preventDefault(); alert('Product ${product.name} added to cart!');">Add to Cart</button>
                </div>
            </div>
        </a>
    `;
}

// ... (renderProducts, applyFiltersAndSearch, handleFilterClick functions are fine) ...
function renderProducts(productsToRender) {
    productGrid.innerHTML = '';
    if (productsToRender.length === 0) {
        productGrid.innerHTML = '<p class="no-results">Sorry, no products found matching your criteria.</p>';
        return;
    }
    productsToRender.forEach(product => {
        productGrid.innerHTML += createProductCard(product);
    });
}

function applyFiltersAndSearch() {
    let filtered = allMerchProducts;
    
    // 1. Filter by Type
    if (currentFilterType !== 'all') {
        filtered = filtered.filter(p => p.type === currentFilterType);
    }
    
    // 2. Search by Term
    if (currentSearchTerm) {
        const lowerCaseSearch = currentSearchTerm.toLowerCase();
        filtered = filtered.filter(p => 
            p.name.toLowerCase().includes(lowerCaseSearch) ||
            p.description.toLowerCase().includes(lowerCaseSearch) ||
            p.type.toLowerCase().includes(lowerCaseSearch)
        );
    }

    renderProducts(filtered);
}

function handleFilterClick(event) {
    const button = event.target.closest('button');
    if (!button) return;

    typeFilters.querySelectorAll('button').forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');

    currentFilterType = button.getAttribute('data-filter');
    
    applyFiltersAndSearch();
}
// ... (handleSearchInput function ko initMerchShop mein hi call karte hain) ...


// Function: API se data fetch karna aur sab initialize karna (Exported function)
export async function initMerchShop() {
    // Search listener ko pehle set karo
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            currentSearchTerm = e.target.value.trim();
            applyFiltersAndSearch(); 
        });
    }

    try {
        const response = await fetch('/api/products');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        
        // Sirf 'Merch' products filter karo
        allMerchProducts = data.filter(p => p.category === 'Merch');
        
        // Filters listeners set karo
        if (typeFilters) {
            typeFilters.addEventListener('click', handleFilterClick);
        }

        // Initially render products
        applyFiltersAndSearch(); 

    } catch (error) {
        console.error("Error fetching data:", error);
        if (productGrid) {
            productGrid.innerHTML = '<h3 class="error-message">Could not load products. Please check server connection and products.json data.</h3>';
        }
    }
}