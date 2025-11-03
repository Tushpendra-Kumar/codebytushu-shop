// src/js/checkout.js

import { getCart } from './cart.js'; // Cart data ko import karo

document.addEventListener('DOMContentLoaded', () => {
    loadCheckoutSummary();
});

function loadCheckoutSummary() {
    const cart = getCart();
    const itemsList = document.getElementById('checkout-items-list');
    const subtotalElement = document.getElementById('checkout-subtotal');
    const grandTotalElement = document.getElementById('checkout-grand-total');

    itemsList.innerHTML = '';
    let subtotal = 0;
    const shipping = 5.00; // Example fixed shipping charge

    if (cart.length === 0) {
        itemsList.innerHTML = '<p class="error-message">Your cart is empty. Please add items before checking out.</p>';
        return;
    }

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;

        const itemHTML = `
            <div class="checkout-item">
                <span>${item.name} (Size: ${item.size}) x ${item.quantity}</span>
                <span>$${itemTotal.toFixed(2)}</span>
            </div>
        `;
        itemsList.innerHTML += itemHTML;
    });
    
    const grandTotal = subtotal + shipping;

    subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('checkout-shipping').textContent = `$${shipping.toFixed(2)}`;
    grandTotalElement.textContent = `$${grandTotal.toFixed(2)}`;
}