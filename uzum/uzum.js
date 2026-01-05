// Mahsulotlar bazasi
const products = [
    {
        id: 1,
        name: "iPhone 15 Pro",
        category: "electronics",
        price: 12999000,
        image: "📱",
        description: "Eng so'nggi iPhone modelı, 256GB xotira",
        rating: 4.8
    },
    {
        id: 2,
        name: "Samsung Galaxy S24",
        category: "electronics",
        price: 11999000,
        image: "📱",
        description: "Kuchli processori bilan yangi Galaxy",
        rating: 4.7
    },
    {
        id: 3,
        name: "Wireless Earbuds Pro",
        category: "electronics",
        price: 1499000,
        image: "🎧",
        description: "Sifatli ovozli noto'g'rilikni kamaytirish",
        rating: 4.5
    },
    {
        id: 4,
        name: "Ko'k Futbolka",
        category: "clothing",
        price: 299000,
        image: "👕",
        description: "100% paxta, rahat kiyim",
        rating: 4.3
    },
    {
        id: 5,
        name: "Qora Shlyapa",
        category: "clothing",
        price: 199000,
        image: "🧢",
        description: "Qishloq va yozda uchun ideal",
        rating: 4.4
    },
    {
        id: 6,
        name: "Jeans Shimlar",
        category: "clothing",
        price: 399000,
        image: "👖",
        description: "Modern dizayn va qulay mahsulot",
        rating: 4.6
    },
    {
        id: 7,
        name: "LED Chiroq",
        category: "home",
        price: 499000,
        image: "💡",
        description: "Energiya samarali LED chiroq",
        rating: 4.5
    },
    {
        id: 8,
        name: "Qohum Soati",
        category: "home",
        price: 799000,
        image: "⏰",
        description: "Duvarga o'rnatiladigan soat",
        rating: 4.7
    },
    {
        id: 9,
        name: "Kitob: O'zbek Tarixi",
        category: "books",
        price: 150000,
        image: "📕",
        description: "Eski O'zbek imperiyasining tarix",
        rating: 4.6
    },
    {
        id: 10,
        name: "Futbol to'pi",
        category: "sports",
        price: 249000,
        image: "⚽",
        description: "Professional sifatli futbol to'pi",
        rating: 4.8
    },
    {
        id: 11,
        name: "Yoga Matasi",
        category: "sports",
        price: 349000,
        image: "🧘",
        description: "Qulay yoga mashqlar uchun",
        rating: 4.5
    },
    {
        id: 12,
        name: "Sug'urta Bag'",
        category: "home",
        price: 899000,
        image: "🌱",
        description: "Qolip va o'simlik uchun ideal",
        rating: 4.4
    }
];

let cart = [];
let currentCategory = 'all';

// DOM elementlari
const productsGrid = document.getElementById('products-grid');
const cartBtn = document.getElementById('cart-btn');
const cartModal = document.getElementById('cart-modal');
const productModal = document.getElementById('product-modal');
const checkoutModal = document.getElementById('checkout-modal');
const categoryBtns = document.querySelectorAll('.category-btn');
const closeButtons = document.querySelectorAll('.close-btn');
const cartItemsContainer = document.getElementById('cart-items');
const totalPriceElement = document.getElementById('total-price');
const cartCountElement = document.getElementById('cart-count');
const checkoutBtn = document.getElementById('checkout-btn');
const checkoutForm = document.getElementById('checkout-form');

// API orqali mahsulotlarni olish
async function fetchProducts() {
    try {
        const response = await fetch('/api/products');
        const data = await response.json();
        if (data && data.length > 0) {
            displayProducts(data);
        } else {
            displayProducts(products); // Fallback
        }
    } catch (e) {
        console.error('API Error:', e);
        displayProducts(products); // Fallback
    }
}

// Buyurtmani API-ga yuborish
async function submitOrder(order) {
    try {
        const response = await fetch('/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(order)
        });
        return await response.json();
    } catch (e) {
        return { success: false, error: e.message };
    }
}

// Mahsulotlarni ko'rsatish
function displayProducts(productsToShow = products) {
    productsGrid.innerHTML = '';

    productsToShow.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <div class="product-image">${product.image}</div>
            <div class="product-info">
                <div class="product-category">${product.category}</div>
                <div class="product-name">${product.name}</div>
                <div class="product-desc">${product.description}</div>
                <div class="product-rating">⭐ ${product.rating}</div>
                <div class="product-price">${product.price.toLocaleString()} so'm</div>
                <div class="product-buttons">
                    <button class="btn-add-cart" onclick="addToCart(${product.id})">Savat</button>
                    <button class="btn-favorite">❤️</button>
                </div>
            </div>
        `;

        // Mahsulot tafsilotlarini ko'rsatish
        productCard.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn-add-cart') || e.target.classList.contains('btn-favorite')) {
                return;
            }
            showProductDetail(product);
        });

        productsGrid.appendChild(productCard);
    });
}

// Mahsulot tafsilotlarini ko'rsatish
function showProductDetail(product) {
    document.getElementById('modal-product-img').textContent = product.image;
    document.getElementById('modal-product-name').textContent = product.name;
    document.getElementById('modal-product-desc').textContent = product.description;
    document.getElementById('modal-product-price').textContent = product.price.toLocaleString() + ' so\'m';
    document.getElementById('product-quantity').value = 1;

    document.getElementById('add-to-cart-modal').onclick = () => {
        const quantity = parseInt(document.getElementById('product-quantity').value);
        addToCart(product.id, quantity);
        productModal.classList.remove('active');
    };

    productModal.classList.add('active');
}

// Savatga qo'shish
function addToCart(productId, quantity = 1) {
    const product = products.find(p => p.id === productId);

    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            ...product,
            quantity: quantity
        });
    }

    updateCart();
    showNotification('Savatga qo\'shildi!');
}

// Savatni yangilash
function updateCart() {
    cartCountElement.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<div class="empty-cart">Savat bo\'sh</div>';
    } else {
        cartItemsContainer.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-image">${item.image}</div>
                <div class="cart-item-details">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">${item.price.toLocaleString()} so'm</div>
                    <div class="cart-item-quantity">
                        <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                        <span>${item.quantity}</span>
                        <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                    </div>
                </div>
                <button class="cart-item-remove" onclick="removeFromCart(${item.id})">O'chirish</button>
            </div>
        `).join('');
    }

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    totalPriceElement.textContent = total.toLocaleString() + ' so\'m';
}

// Miqdorni o'zgartirish
function updateQuantity(productId, change) {
    const item = cart.find(i => i.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            updateCart();
        }
    }
}

// Savatdan o'chirish
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
}

// Toifa bo'yicha filterlash
categoryBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        categoryBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        currentCategory = btn.getAttribute('data-category');

        if (currentCategory === 'all') {
            displayProducts(products);
        } else {
            displayProducts(products.filter(p => p.category === currentCategory));
        }
    });
});

// Modal yopish
closeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        cartModal.classList.remove('active');
        productModal.classList.remove('active');
        checkoutModal.classList.remove('active');
    });
});

// Modalni tashqaridan yopish
[cartModal, productModal, checkoutModal].forEach(modal => {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });
});

// Savat modalini ochish
cartBtn.addEventListener('click', () => {
    cartModal.classList.add('active');
});

// Checkout
checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) {
        alert('Savat bo\'sh!');
        return;
    }
    cartModal.classList.remove('active');
    checkoutModal.classList.add('active');
});

// Buyurtma berish
checkoutForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('customer-name').value;
    const phone = document.getElementById('customer-phone').value;
    const address = document.getElementById('customer-address').value;
    const city = document.getElementById('customer-city').value;
    const payment = document.querySelector('input[name="payment"]:checked').value;

    const orderSummary = {
        name,
        phone,
        address,
        city,
        payment,
        items: cart,
        total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        date: new Date().toLocaleString('uz-UZ')
    };

    const result = await submitOrder(orderSummary);

    if (result.success) {
        alert(`Buyurtma qabul qilindi!\nBuyurtma raqami: #${result.orderId}`);
        // Savat va formani tozalash
        cart = [];
        updateCart();
        checkoutForm.reset();
        checkoutModal.classList.remove('active');
    } else {
        alert('Xato yuz berdi: ' + result.error);
    }
});

// Qidiruv
document.getElementById('search-input').addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();

    if (searchTerm === '') {
        displayProducts(products.filter(p => currentCategory === 'all' || p.category === currentCategory));
    } else {
        const filtered = products.filter(p => {
            const matchesCategory = currentCategory === 'all' || p.category === currentCategory;
            const matchesSearch = p.name.toLowerCase().includes(searchTerm) ||
                p.description.toLowerCase().includes(searchTerm);
            return matchesCategory && matchesSearch;
        });
        displayProducts(filtered);
    }
});

// Bildirishnoma ko'rsatish
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--success-color);
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        z-index: 2000;
        animation: slideIn 0.3s ease-out;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 2000);
}

// Dastlabki ko'rsatish
fetchProducts();
