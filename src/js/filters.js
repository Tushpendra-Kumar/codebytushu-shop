// src/js/filters.js - Sirf Merch products load karega

const productGrid = document.getElementById('product-grid');
const typeFilters = document.getElementById('type-filters');

let allProducts = []; 

// Function: Single Product Card ka HTML banana
function createProductCard(product) {
    // 🛑 CHECK: Yahaan 'Merch' category check ho rahi hai
    if (product.category !== 'Merch') return ''; 

    // Add to Cart button mein abhi sirf alert hai, kyuki yeh Merch page hai
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
                    <button class="btn-primary" onclick="event.preventDefault(); window.location.href='${productLink}'">Add to Cart</button>
                    <button class="btn-secondary" onclick="event.preventDefault(); window.location.href='${productLink}'">Quick View</button>
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
        
        // 🛑 FILTER: Yahaan sirf 'Merch' products filter ho rahe hain
        allProducts = data.filter(p => p.category === 'Merch');
        
        renderProducts(allProducts); 

    } catch (error) {
        console.error("Error fetching data:", error);
        productGrid.innerHTML = '<h3 class="error-message">Could not load products. Please check server connection.</h3>';
    }
}

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
        filteredList = allProducts.filter(p => p.type === filterType);
    }

    renderProducts(filteredList);
}

// Event Listeners and Initialization
typeFilters.addEventListener('click', handleFilterClick);
fetchProducts();

// src/js/filters.js

// ... (existing imports, fetchProducts, etc.) ...

// Global search state
let currentSearchTerm = '';

// Function to combine search and filter logic
export function handleSearchAndFilter(allProducts) {
    let filtered = allProducts;
    
    // 1. Filtering (Existing Logic)
    if (currentFilterCategory !== 'All Merch' && currentFilterCategory !== 'All Digital') {
        filtered = filtered.filter(p => p.category === currentFilterCategory);
    }
    
    // 2. Searching (NEW LOGIC)
    if (currentSearchTerm) {
        const lowerCaseSearch = currentSearchTerm.toLowerCase();
        filtered = filtered.filter(p => 
            p.name.toLowerCase().includes(lowerCaseSearch) ||
            p.description.toLowerCase().includes(lowerCaseSearch) ||
            p.category.toLowerCase().includes(lowerCaseSearch)
        );
    }

    renderProducts(filtered);
}

// Function to initialize search input
export function initSearchListener(allProducts) {
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            currentSearchTerm = e.target.value;
            // Search field change hote hi filtering aur rendering shuru karo
            handleSearchAndFilter(allProducts); 
        });
    }
}

// *** UPDATE ***: initFilters function ko update karo
// Ab har filter click par search bhi apply hona chahiye
export function initFilters(allProducts) {
    // ... (existing filter button logic) ...
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // ... (existing filter category update logic) ...
            
            // Filter update hone ke baad Search aur Filter dono apply karo
            handleSearchAndFilter(allProducts); 
        });
    });
    
    // Page load par bhi Search aur Filter apply karo
    handleSearchAndFilter(allProducts);
}

// ** DON'T FORGET **: Yeh function ko products.js ya main.js mein call karna
// (Jahaan tum products fetch karte ho)