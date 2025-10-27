// src/js/filters.js

const productGrid = document.getElementById('product-grid');
const typeFilters = document.getElementById('type-filters');

let allProducts = []; 

// Function: Single Product Card ka HTML banana
function createProductCard(product) {
    if (product.category !== 'Merch') return '';

    // Product ID ko PDP tak le jaane ke liye link banao
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
                    <button class="btn-primary" onclick="event.preventDefault(); alert('Add to Cart for ${product.name}');">Add to Cart</button>
                    <button class="btn-secondary" onclick="event.preventDefault(); window.location.href='${productLink}'">Quick View</button>
                </div>
            </div>
        </a>
    `;
}

// Function: Products ko Grid mein Render karna
function renderProducts(productsToRender) {
    productGrid.innerHTML = '';
    
    if (productsToRender.length === 0) {
        productGrid.innerHTML = '<p class="no-results">Sorry, no products found for this filter.</p>';
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
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        
        allProducts = data.filter(p => p.category === 'Merch');
        
        renderProducts(allProducts); 

    } catch (error) {
        console.error("Error fetching data:", error);
        productGrid.innerHTML = '<h3 class="error-message">Could not load products. Please check server connection.</h3>';
    }
}

// Function: Filters par click handle karna
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
        filteredList = allProducts.filter(p => p.type === filterType);
    }

    renderProducts(filteredList);
}

// Event Listeners
typeFilters.addEventListener('click', handleFilterClick);

// Initialization: Page load hote hi products fetch karna
fetchProducts();