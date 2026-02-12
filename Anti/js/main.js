// Main Application Logic
console.log("Techno-Ayurveda System Online");

// Product Data
const products = [
    {
        id: 1,
        name: "Nano-Ashwagandha",
        price: 49.99,
        description: "Stress relief re-engineered at the molecular level. Enhanced bioavailability for instant calm.",
        image: "assets/ashwagandha.png" // Placeholder
    },
    {
        id: 2,
        name: "Quantum Shilajit",
        price: 89.99,
        description: "Pure Himalayan resin activated with quantum field technology. Maximum energy output.",
        image: "assets/shilajit.png"
    },
    {
        id: 3,
        name: "Synaptic Brahmi",
        price: 35.50,
        description: "Cognitive enhancement serum. Sharpen memory and focus with ancient neural boosters.",
        image: "assets/brahmi.png"
    },
    {
        id: 4,
        name: "Triphala OS",
        price: 29.99,
        description: "Digestive system reboot. A three-fruit blend optimized for metabolic harmony.",
        image: "assets/triphala.png"
    },
    {
        id: 5,
        name: "Chyawanprash X",
        price: 65.00,
        description: "Immunity firewall. 40+ herb elixir concentrated for maximum systemic protection.",
        image: "assets/chyawanprash.png"
    },
    {
        id: 6,
        name: "Turmeric Matrix",
        price: 42.00,
        description: "Inflammation control protocol. Curcumin isolated for 500% absorption efficiency.",
        image: "assets/turmeric.png"
    }
];

// State
let cart = JSON.parse(localStorage.getItem('anti-cart')) || [];

// DOM Elements
const productGrid = document.getElementById('product-grid');
const cartBtn = document.getElementById('cart-btn');
const cartSidebar = document.getElementById('cart-sidebar');
const cartOverlay = document.getElementById('cart-overlay');
const closeCartBtn = document.getElementById('close-cart');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotalPrice = document.getElementById('cart-total-price');

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    updateCartUI();

    // Cart Interaction
    cartBtn.addEventListener('click', (e) => {
        e.preventDefault();
        openCart();
    });

    closeCartBtn.addEventListener('click', closeCart);
    cartOverlay.addEventListener('click', closeCart);
});

function openCart() {
    cartSidebar.classList.add('open');
    cartOverlay.classList.add('open');
    renderCartItems();
}

function closeCart() {
    cartSidebar.classList.remove('open');
    cartOverlay.classList.remove('open');
}

// Render Products
function renderProducts() {
    if (!productGrid) return;

    productGrid.innerHTML = products.map(product => `
        <div class="product-card">
            <div class="product-image"></div>
            <h3 class="product-title">${product.name}</h3>
            <p class="product-desc">${product.description}</p>
            <div class="product-price">$${product.price.toFixed(2)}</div>
            <button class="btn" onclick="addToCart(${product.id})">Add to System</button>
        </div>
    `).join('');

    // Re-attach hover effects for new elements (since particles.js runs once)
    // We can dispatch an event or just let the global listener handle bubbling if we set it up right.
    // However, particles.js uses querySelectorAll which is static. 
    // Let's manually add hover effects to new buttons if needed, 
    // but the particle system might need a way to detect new elements.
    // For now, let's just leave it, or we could add a simple mouseover delegation in particles.js later.
}

// Cart Logic
window.addToCart = (id) => {
    const product = products.find(p => p.id === id);
    const existingItem = cart.find(item => item.id === id);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    saveCart();
    updateCartUI();
    openCart(); // Auto-open cart on add
};

window.updateQuantity = (id, change) => {
    const itemIndex = cart.findIndex(item => item.id === id);
    if (itemIndex > -1) {
        cart[itemIndex].quantity += change;
        if (cart[itemIndex].quantity <= 0) {
            cart.splice(itemIndex, 1);
        }
    }
    saveCart();
    updateCartUI();
    renderCartItems();
};

function renderCartItems() {
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p style="text-align: center; opacity: 0.5;">System Empty</p>';
        return;
    }

    cartItemsContainer.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p>$${item.price.toFixed(2)}</p>
            </div>
            <div class="cart-item-actions">
                <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                <span>${item.quantity}</span>
                <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
            </div>
        </div>
    `).join('');
}

function saveCart() {
    localStorage.setItem('anti-cart', JSON.stringify(cart));
}

function updateCartUI() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    if (cartBtn) {
        cartBtn.innerText = `Cart (${totalItems})`;
    }

    if (cartTotalPrice) {
        cartTotalPrice.innerText = `$${totalPrice.toFixed(2)}`;
    }
}

// Checkout Logic
const checkoutBtn = document.querySelector('.checkout-btn');
if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            alert("System Empty. Initialize acquisition sequence first.");
            return;
        }

        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        alert(`Initiating Quantum Transfer...\n\nTotal: $${total.toFixed(2)}\n\nTransaction Complete. Supplies inbound.`);
        cart = [];
        saveCart();
        updateCartUI();
        renderCartItems();
        closeCart();
    });
}
