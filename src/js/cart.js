// src/js/cart.js

// 1. Cart ko LocalStorage se load karna
export const getCart = () => {
    const cartJSON = localStorage.getItem('codebytushu_cart');
    // Agar cart nahi hai, toh empty array return karo
    return cartJSON ? JSON.parse(cartJSON) : []; 
};

// 2. Cart ko LocalStorage mein save karna
const saveCart = (cart) => {
    localStorage.setItem('codebytushu_cart', JSON.stringify(cart));
};

// 3. Item ko Cart mein add karna
export const addToCart = (product, quantity = 1, size = 'M') => {
    const cart = getCart();
    
    // Check karte hain ki kya yeh product/size combination pehle se cart mein hai
    const existingItemIndex = cart.findIndex(item => 
        item.id === product.id && item.size === size
    );

    if (existingItemIndex > -1) {
        // Agar hai, toh sirf quantity badha do
        cart[existingItemIndex].quantity += quantity;
    } else {
        // Agar naya item hai, toh add kar do
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image_url: product.image_url,
            quantity: quantity,
            size: size 
        });
    }

    saveCart(cart);
    // Alert sirf confirmation ke liye
    alert(`${product.name} (Size: ${size}) added to cart! Total Items: ${cart.length}`); 
};


// 4. Item ko Cart se remove karna (Index based removal use karte hain for simplicity on cart page)
export function removeItemFromCart(index) {
    let cart = getCart();
    // Index ke hisaab se item ko array se nikalna (splice method)
    if (index >= 0 && index < cart.length) {
        cart.splice(index, 1);
        saveCart(cart);
        updateCartDisplay(); 
    }
}


// 5. Quantity update karna (HTML input onchange event se call hoga)
export function updateQuantity(index, newQuantity) {
    const quantity = parseInt(newQuantity);
    if (quantity < 1 || isNaN(quantity)) return;

    const cart = getCart();
    if (index >= 0 && index < cart.length) {
        cart[index].quantity = quantity;
        saveCart(cart);
        updateCartDisplay();
    }
}


// 6. Cart display update karna (Cart page ke liye)
export const updateCartDisplay = () => {
    const cart = getCart();
    // cart-items-list ID cart.html mein use ho rahi hai (pichle step se)
    const cartItemsDiv = document.getElementById('cart-items-list'); 
    const subtotalElement = document.getElementById('cart-subtotal');
    const totalElement = document.getElementById('cart-total');

    if (!cartItemsDiv) return; // Agar hum cart page par nahi hain, toh stop ho jao

    cartItemsDiv.innerHTML = '';
    let subtotal = 0;
    
    if (cart.length === 0) {
        cartItemsDiv.innerHTML = '<p class="empty-cart-message">Your cart is empty. Go shop some cool code merch!</p>';
        if (subtotalElement) subtotalElement.textContent = '$0.00';
        if (totalElement) totalElement.textContent = '$0.00';
        return;
    }

    // Index (i) ko use karke Remove aur Quantity Update button functional banana
    cart.forEach((item, i) => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;

        const itemHTML = `
            <div class="cart-item">
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-details">Size: ${item.size}</div>
                </div>

                <div class="cart-item-quantity">
                    <input type="number" min="1" value="${item.quantity}" 
                           onchange="window.updateQuantity(${i}, this.value)">
                </div>
                
                <div class="cart-item-price">$${itemTotal.toFixed(2)}</div>
                <div class="cart-item-actions">
                    <button class="remove-btn" onclick="window.removeItemFromCart(${i})">Remove</button>
                </div>
            </div>
        `;
        cartItemsDiv.innerHTML += itemHTML;
    });

    // Subtotal aur Total update karna
    if (subtotalElement) subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    if (totalElement) {
         // Yahaan shipping add nahi kar rahe hain, sirf subtotal dikha rahe hain
         totalElement.textContent = `$${subtotal.toFixed(2)}`; 
    }
};

// Global scope mein functions attach karna taki HTML events use kar saken (zaroori step)
window.removeItemFromCart = removeItemFromCart;
window.updateQuantity = updateQuantity;
window.updateCartDisplay = updateCartDisplay;