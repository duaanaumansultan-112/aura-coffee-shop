// --- Data Stores ---

const menuItems = [

    // Artisan Specials
    {
        id: 'a1',
        title: 'Rose & Lavender Infused Mocha',
        category: 'artisan',
        price: 6.25,
        desc: 'Rich dark espresso, steamed milk, red rose extract, and dried organic lavender petals.',
        img: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=500&q=80'
    },
    {
        id: 'a2',
        title: 'Spiced Cardamom Cloud Latte',
        category: 'artisan',
        price: 6.50,
        desc: 'Single-origin espresso layered over cardamom-infused warm milk topped with velvet cream.',
        img: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=500&q=80'
    },
    {
        id: 'a3',
        title: 'Smoked Bourbon Barrel Espresso',
        category: 'artisan',
        price: 5.75,
        desc: 'Aged espresso beans extract conditioned in charred oak bourbon casks for rich smokiness.',
        img: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&w=500&q=80'
    },
    {
        id: 'a4',
        title: 'Pistachio Cream Cold Foam Breve',
        category: 'artisan',
        price: 6.75,
        desc: 'Smooth cold brew poured over ice, crowned with rich roasted pistachio cream foam.',
        img: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=500&q=80'
    },

    // Classic Coffee
    {
        id: 'c1',
        title: 'Signature Velvet Flat White',
        category: 'coffee',
        price: 4.75,
        desc: 'Double shot of rich espresso topped with perfectly textured microfoam layer.',
        img: 'https://images.unsplash.com/photo-1577968897966-3d4325b36b61?auto=format&fit=crop&w=500&q=80'
    },
    {
        id: 'c2',
        title: 'Single-Origin Pour Over',
        category: 'coffee',
        price: 5.00,
        desc: 'Hand-poured Ethiopian Yirgacheffe beans with distinct floral and citrus notes.',
        img: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=500&q=80'
    },

    // Pastries & Bakery
    {
        id: 'p1',
        title: 'Almond Frangipane Danish',
        category: 'pastries',
        price: 4.50,
        desc: 'Flaky golden pastry filled with almond cream and topped with toasted almond slices.',
        img: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=500&q=80'
    },
    {
        id: 'p2',
        title: 'Dark Chocolate Ganache Croissant',
        category: 'pastries',
        price: 4.80,
        desc: 'Butter croissant stuffed with 70% dark Belgian chocolate ganache.',
        img: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=500&q=80'
    },
    {
        id: 'p3',
        title: 'Wild Blueberry Cardamom Scone',
        category: 'pastries',
        price: 4.25,
        desc: 'Freshly baked tender scone loaded with wild blueberries and ground cardamom.',
        img: 'https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?auto=format&fit=crop&w=500&q=80'
    },
    {
        id: 'p4',
        title: 'Pecan Cinnamon Brioche Roll',
        category: 'pastries',
        price: 5.25,
        desc: 'Warm cinnamon roll baked in rich brioche dough and drizzled with vanilla glaze.',
        img: 'https://images.unsplash.com/photo-1509365465985-25d11c17e812?auto=format&fit=crop&w=500&q=80'
    }
];

let cart = [];
let currentGuestbookRating = 5;

// --- DOM Elements ---
const menuGrid = document.getElementById('menu-grid');
const cartBadge = document.getElementById('cart-badge');
const cartDrawer = document.getElementById('cart-drawer');
const cartOverlay = document.getElementById('cart-overlay');
const cartItemsContainer = document.getElementById('cart-items-container');
const cartTotalPrice = document.getElementById('cart-total-price');

// Navigation (Mobile Menu)
const menuOpenButton = document.querySelector("#menu-open-button");
const menuCloseButton = document.querySelector("#menu-close-button");
const navMenu = document.querySelector(".nav-menu");

menuOpenButton.addEventListener("click", () => navMenu.classList.add("show-menu"));
menuCloseButton.addEventListener("click", () => navMenu.classList.remove("show-menu"));

// --- Menu ---
function renderMenu(categoryFilter = 'all') {
    menuGrid.innerHTML = '';
    const filtered = categoryFilter === 'all' ? menuItems : menuItems.filter(item => item.category === categoryFilter);

    filtered.forEach(item => {
        const card = document.createElement('div');
        card.className = 'menu-card';
        card.innerHTML = `
            <img src="${item.img}" alt="${item.title}" class="menu-card-img">
            <div class="menu-card-body">
                <h3 class="menu-card-title">${item.title}</h3>
                <p class="menu-card-desc">${item.desc}</p>
                <div class="menu-card-footer">
                    <span class="menu-card-price">$${item.price.toFixed(2)}</span>
                    <button class="add-cart-btn" onclick="addToCart('${item.id}')"><i class="fa-solid fa-plus"></i></button>
                </div>
            </div>
        `;
        menuGrid.appendChild(card);
    });
}

// Menu Category (Filtering)
document.querySelectorAll('.menu-tabs .tab-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        document.querySelectorAll('.menu-tabs .tab-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        renderMenu(e.target.dataset.category);
    });
});

// --- Cart ---
function addToCart(itemId, customItem = null) {
    if (customItem) {
        cart.push(customItem);
    } else {
        const item = menuItems.find(i => i.id === itemId);
        cart.push(item);
    }
    updateCartUI();
    openCart();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartUI();
}

function updateCartUI() {
    cartBadge.textContent = cart.length;
    cartItemsContainer.innerHTML = '';
    
    let total = 0;
    cart.forEach((item, index) => {
        total += item.price;
        const cartItemEl = document.createElement('div');
        cartItemEl.className = 'cart-item';
        cartItemEl.innerHTML = `
            <div>
                <div class="cart-item-title">${item.title}</div>
                <div class="cart-item-price">$${item.price.toFixed(2)}</div>
            </div>
            <button class="cart-item-remove" onclick="removeFromCart(${index})"><i class="fa-solid fa-trash-can"></i></button>
        `;
        cartItemsContainer.appendChild(cartItemEl);
    });
    
    cartTotalPrice.textContent = `$${total.toFixed(2)}`;
}

function openCart() {
    cartDrawer.classList.add('active');
    cartOverlay.classList.add('active');
}

function closeCart() {
    cartDrawer.classList.remove('active');
    cartOverlay.classList.remove('active');
}

document.getElementById('cart-toggle-btn').addEventListener('click', openCart);
document.getElementById('cart-close-btn').addEventListener('click', closeCart);
cartOverlay.addEventListener('click', closeCart);

// --- Brew Studio (Logic) ---
let currentShotPrice = 4.50;
let currentShotName = 'Double Shot';
let currentMilkPrice = 0.75;
let currentMilkName = 'Oat Milk';

const baseShots = document.getElementById('base-shots');
const milkTypes = document.getElementById('milk-types');
const sweetnessSlider = document.getElementById('sweetness-slider');
const sweetnessVal = document.getElementById('sweetness-val');

baseShots.querySelectorAll('.pill').forEach(pill => {
    pill.addEventListener('click', (e) => {
        baseShots.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
        e.target.classList.add('active');
        currentShotPrice = parseFloat(e.target.dataset.price);
        currentShotName = e.target.textContent;
        updateBrewBuilder();
    });
});

milkTypes.querySelectorAll('.pill').forEach(pill => {
    pill.addEventListener('click', (e) => {
        milkTypes.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
        e.target.classList.add('active');
        currentMilkPrice = parseFloat(e.target.dataset.price);
        currentMilkName = e.target.textContent.split(' ')[0];
        updateBrewBuilder();
    });
});

sweetnessSlider.addEventListener('input', (e) => {
    sweetnessVal.textContent = `${e.target.value}%`;
});

function updateBrewBuilder() {
    let syrupCost = 0;
    const selectedSyrups = [];
    document.querySelectorAll('.syrup-check:checked').forEach(c => {
        syrupCost += 0.50;
        selectedSyrups.push(c.value);
    });

    const totalPrice = currentShotPrice + currentMilkPrice + syrupCost;
    document.getElementById('builder-price').textContent = totalPrice.toFixed(2);
    
    let syrupText = selectedSyrups.length > 0 ? ` + ${selectedSyrups.join(', ')}` : '';
    document.getElementById('builder-summary-text').textContent = `${currentShotName} + ${currentMilkName}${syrupText}`;
}

document.querySelectorAll('.syrup-check').forEach(c => c.addEventListener('change', updateBrewBuilder));

document.getElementById('add-custom-brew-btn').addEventListener('click', () => {
    const customItem = {
        title: `Custom (${currentShotName})`,
        price: parseFloat(document.getElementById('builder-price').textContent)
    };
    addToCart(null, customItem);
});

// --- Checkout & Ticket Generation ---
document.getElementById('checkout-btn').addEventListener('click', () => {
    if (cart.length === 0) {
        alert('Your order cart is empty!');
        return;
    }

    closeCart();
    
    // Generate Random Ticket #
    document.getElementById('ticket-number').textContent = `#AUR-${Math.floor(1000 + Math.random() * 9000)}`;
    
    const itemList = document.getElementById('ticket-item-list');
    itemList.innerHTML = '';
    let total = 0;
    
    cart.forEach(item => {
        total += item.price;
        const row = document.createElement('div');
        row.className = 'ticket-row';
        row.innerHTML = `<span>${item.title}</span><strong>$${item.price.toFixed(2)}</strong>`;
        itemList.appendChild(row);
    });
    
    document.getElementById('ticket-total').textContent = `$${total.toFixed(2)}`;
    document.getElementById('ticket-modal').classList.add('active');
    
    // Clear Cart
    cart = [];
    updateCartUI();
});

document.getElementById('modal-close-btn').addEventListener('click', () => {
    document.getElementById('ticket-modal').classList.remove('active');
});
document.getElementById('close-modal-btn').addEventListener('click', () => {
    document.getElementById('ticket-modal').classList.remove('active');
});

// --- Guestbook (Logic) ---
const starRatingSelect = document.getElementById('star-rating');
starRatingSelect.querySelectorAll('i').forEach(star => {
    star.addEventListener('click', (e) => {
        currentGuestbookRating = parseInt(e.target.dataset.rating);
        starRatingSelect.querySelectorAll('i').forEach((s, idx) => {
            if (idx < currentGuestbookRating) s.classList.add('active');
            else s.classList.remove('active');
        });
    });
});

const initialReviews = [
    { name: 'Sarah Jenkins', rating: 5, msg: 'The Rose & Lavender Infused Mocha is literally unforgettable! Great booth.' },
    { name: 'David K.', rating: 5, msg: 'Loved testing out the live interactive cup builder.' }
];

function renderGuestbook() {
    const feed = document.getElementById('guestbook-feed');
    feed.innerHTML = '';
    initialReviews.forEach(r => {
        const card = document.createElement('div');
        card.className = 'review-card';
        let starsHtml = '';
        for (let i = 0; i < 5; i++) {
            starsHtml += `<i class="fa-solid fa-star${i < r.rating ? '' : '-o'}"></i>`;
        }
        card.innerHTML = `
            <div class="review-header">
                <span class="review-author">${r.name}</span>
                <span class="review-stars">${starsHtml}</span>
            </div>
            <div class="review-body">${r.msg}</div>
        `;
        feed.prepend(card);
    });
}

document.getElementById('guestbook-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('guest-name').value;
    const msg = document.getElementById('guest-message').value;

    initialReviews.push({ name, rating: currentGuestbookRating, msg });
    renderGuestbook();
    
    document.getElementById('guest-name').value = '';
    document.getElementById('guest-message').value = '';
});

// calls
renderMenu();
renderGuestbook();