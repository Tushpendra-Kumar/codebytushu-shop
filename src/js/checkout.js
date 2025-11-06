// src/js/checkout.js

import { getCart } from './cart.js'; // getCart function import karo

const SHIPPING_FEE = 10.00; // Example fixed shipping fee

// Function: Checkout summary ko update karna
const updateCheckoutSummary = () => {
    const cart = getCart();
    
    // IDs jo checkout.html mein honi chahiye
    const itemsList = document.getElementById('checkout-items-list');
    const subtotalElement = document.getElementById('checkout-subtotal');
    const shippingElement = document.getElementById('checkout-shipping');
    const grandTotalElement = document.getElementById('checkout-grand-total');

    if (!itemsList) return;

    itemsList.innerHTML = '';
    let subtotal = 0;

    if (cart.length === 0) {
        itemsList.innerHTML = '<p class="empty-cart-message">Your cart is empty! Cannot proceed to checkout.</p>';
        // Checkout button ko disable kar do
        const placeOrderBtn = document.querySelector('.payment-section .btn-primary');
        if (placeOrderBtn) placeOrderBtn.disabled = true; 
        
    } else {
        // Items list populate karna
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;

            const itemHTML = `
                <div class="summary-item">
                    <span class="item-name">${item.name} (x${item.quantity})</span>
                    <span class="item-total">$${itemTotal.toFixed(2)}</span>
                </div>
            `;
            itemsList.innerHTML += itemHTML;
        });

        // Checkout button ko re-enable kar do (agar cart mein items hain)
        const placeOrderBtn = document.querySelector('.payment-section .btn-primary');
        if (placeOrderBtn) placeOrderBtn.disabled = false;
    }

    // Totals calculate aur update karna
    const shipping = (cart.length > 0) ? SHIPPING_FEE : 0.00; // Agar cart empty hai toh shipping 0
    const grandTotal = subtotal + shipping;

    if (subtotalElement) subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    if (shippingElement) shippingElement.textContent = `$${shipping.toFixed(2)}`;
    if (grandTotalElement) grandTotalElement.textContent = `$${grandTotal.toFixed(2)}`;
};

// Checkout page load hote hi summary update karna
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('checkout.html')) {
        updateCheckoutSummary();
    }
});