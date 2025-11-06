// src/js/filters-digital.js - Updated code

// product-grid aur search-input IDs sahi hain, no change:
const productGrid = document.getElementById('product-grid'); 
// 💡 Yahan change karo: 'type-filters-digital' ko 'type-filters' se replace karo
const typeFilters = document.getElementById('type-filters'); // <-- **CORRECTED LINE**
let allDigitalProducts = []; 
let currentFilterType = 'all'; 
let currentSearchTerm = ''; 
// ... rest of the code is fine ...

// Function: Single Product Card ka HTML banana
function createDigitalProductCard(product) {
    const productLink = `/product-detail.html?id=${product.id}`; 
    // Digital products ke liye 'size' selector nahi chahiye, aur button text 'Download Now' hoga
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
                    <button class="btn-secondary" onclick="event.preventDefault(); alert('Added ${product.name} to cart!'); addToCart(${JSON.stringify(product)}, 1, 'N/A')">Add to Cart</button>
                </div>
            </div>
        </a>
    `;
}

// Function: Products ko Grid mein Render karna
function renderDigitalProducts(productsToRender) {
    // Ye check zaroori hai
    if (!productGrid) return; 

    productGrid.innerHTML = '';
    if (productsToRender.length === 0) {
        productGrid.innerHTML = '<p class="no-results">Sorry, no digital products found matching your criteria.</p>';
        return;
    }
    productsToRender.forEach(product => {
        productGrid.innerHTML += createDigitalProductCard(product);
    });
}

// Function: Search aur Filter Logic ko combine karna
function applyDigitalFiltersAndSearch() {
    let filtered = allDigitalProducts;
    
    // 1. Filter by Type (Template, E-book, Utility)
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

    renderDigitalProducts(filtered);
}

// Function: Filters par click handle karna
function handleDigitalFilterClick(event) {
    const button = event.target.closest('button');
    if (!button || !typeFilters) return;

    // Active class update
    typeFilters.querySelectorAll('button').forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');

    // Filter state update
    currentFilterType = button.getAttribute('data-filter');
    
    // Logic apply karo
    applyDigitalFiltersAndSearch();
}

// Function: Search input handle karna
function handleDigitalSearchInput() {
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            currentSearchTerm = e.target.value.trim();
            applyDigitalFiltersAndSearch(); 
        });
    }
}


// Function: API se data fetch karna aur sab initialize karna (Exported function)
export async function initDigitalShop() {
    handleDigitalSearchInput();
    
    try {
        const response = await fetch('/api/products');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        
        // Sirf 'Digital' products filter karo
        allDigitalProducts = data.filter(p => p.category === 'Digital');
        
        // Filters listeners set karo
        if (typeFilters) {
            typeFilters.addEventListener('click', handleDigitalFilterClick);
        }

        // Initially render products
        applyDigitalFiltersAndSearch(); 

    } catch (error) {
        console.error("Error fetching Digital data:", error);
        if (productGrid) {
            productGrid.innerHTML = '<h3 class="error-message">Could not load digital products. Please check server connection.</h3>';
        }
    }
}