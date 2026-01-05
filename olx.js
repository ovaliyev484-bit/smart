// OLX Platform Services Management
class OLXPlatform {
    constructor() {
        this.services = [];
        this.orders = [];
        this.currentUser = null;
        this.init();
    }

    init() {
        this.loadServices();
        this.loadOrders();
        this.renderServices();
        this.attachEventListeners();
    }

    // Service Management
    loadServices() {
        const saved = localStorage.getItem('olx_services');
        this.services = saved ? JSON.parse(saved) : this.getDefaultServices();
    }

    getDefaultServices() {
        return [
            {
                id: 1,
                name: 'Plomba o\'rnatish',
                category: 'repair',
                description: 'Har qanday turdagi plombani o\'rnatamiz',
                price: 50,
                image: '🔧',
                rating: 4.8,
                reviews: 45,
                seller: 'Ali Usta',
                status: 'active'
            },
            {
                id: 2,
                name: 'Devori bo\'yash',
                category: 'construction',
                description: 'Sifatli bo\'yoq va kamusil',
                price: 150,
                image: '🎨',
                rating: 4.9,
                reviews: 62,
                seller: 'Otabek Boyovchi',
                status: 'active'
            },
            {
                id: 3,
                name: 'Uy tozalash',
                category: 'cleaning',
                description: 'Chuqur tozalash xizmati',
                price: 100,
                image: '🧹',
                rating: 4.7,
                reviews: 38,
                seller: 'Zarina',
                status: 'active'
            },
            {
                id: 4,
                name: 'Ko\'chish xizmati',
                category: 'moving',
                description: 'Ehtiyotkorlik bilan ko\'chish',
                price: 200,
                image: '📦',
                rating: 4.6,
                reviews: 29,
                seller: 'Javohir',
                status: 'active'
            },
            {
                id: 5,
                name: 'Ingliz tili darsli',
                category: 'teaching',
                description: 'Beginner dan Advanced gacha',
                price: 80,
                image: '📚',
                rating: 4.9,
                reviews: 71,
                seller: 'Gulnoza',
                status: 'active'
            },
            {
                id: 6,
                name: 'Kompyuter ta\'mirlash',
                category: 'repair',
                description: 'Apparat va dastur ta\'mirlash',
                price: 120,
                image: '💻',
                rating: 4.8,
                reviews: 53,
                seller: 'Sherzod IT',
                status: 'active'
            }
        ];
    }

    saveServices() {
        localStorage.setItem('olx_services', JSON.stringify(this.services));
    }

    renderServices(category = 'all') {
        const grid = document.getElementById('services-grid');
        grid.innerHTML = '';

        let filtered = this.services;
        if (category !== 'all') {
            filtered = this.services.filter(s => s.category === category);
        }

        filtered.forEach(service => {
            if (service.status !== 'active') return;

            const serviceHTML = `
                <div class="product-card" onclick="showServiceDetail(${service.id})">
                    <div class="product-image">${service.image}</div>
                    <div class="product-info">
                        <div class="product-category">${service.category.toUpperCase()}</div>
                        <div class="product-name">${service.name}</div>
                        <div class="product-desc">${service.description}</div>
                        <div class="product-rating">⭐ ${service.rating} (${service.reviews} sharh)</div>
                        <div class="product-price">$${service.price}</div>
                        <small style="color: #A0A0A0;">👤 ${service.seller}</small>
                        <div class="product-buttons">
                            <button class="btn-add-cart" onclick="event.stopPropagation(); quickOrder(${service.id})">
                                Buyurtma Berish
                            </button>
                        </div>
                    </div>
                </div>
            `;
            grid.insertAdjacentHTML('beforeend', serviceHTML);
        });
    }

    addService(service) {
        // Validation
        if (!service.name || !service.price || !service.category) {
            alert('Barcha maydonlarni to\'ldiring!');
            return false;
        }

        if (service.price <= 0) {
            alert('Narx 0 dan katta bo\'lishi kerak!');
            return false;
        }

        service.id = Math.max(...this.services.map(s => s.id), 0) + 1;
        service.status = 'active';
        service.rating = 5;
        service.reviews = 0;
        service.seller = 'Siz';

        this.services.push(service);
        this.saveServices();
        this.renderServices();
        return true;
    }

    // Order Management
    loadOrders() {
        const saved = localStorage.getItem('olx_orders');
        this.orders = saved ? JSON.parse(saved) : [];
    }

    saveOrders() {
        localStorage.setItem('olx_orders', JSON.stringify(this.orders));
    }

    addOrder(service, quantity = 1) {
        // Check if service exists and is available
        const existingService = this.services.find(s => s.id === service.id);
        if (!existingService || existingService.status !== 'active') {
            alert('❌ Bu xizmat mavjud emas yoki faol emas!');
            return false;
        }

        const existingOrder = this.orders.find(o => o.serviceId === service.id);

        if (existingOrder) {
            existingOrder.quantity += quantity;
        } else {
            this.orders.push({
                id: Math.max(...this.orders.map(o => o.id || 0), 0) + 1,
                serviceId: service.id,
                serviceName: service.name,
                price: service.price,
                quantity: quantity,
                totalPrice: service.price * quantity,
                status: 'pending',
                createdAt: new Date().toISOString()
            });
        }

        this.saveOrders();
        this.updateOrderCount();
        alert('✅ Buyurtma qo\'shildi!');
        return true;
    }

    removeOrder(orderId) {
        this.orders = this.orders.filter(o => o.id !== orderId);
        this.saveOrders();
        this.updateOrderCount();
    }

    updateOrderCount() {
        document.getElementById('order-count').textContent = this.orders.length;
    }

    getOrderTotal() {
        return this.orders.reduce((sum, order) => sum + order.totalPrice, 0);
    }

    // Validation & Request System
    createValidationRequest(serviceId, quantity) {
        const service = this.services.find(s => s.id === serviceId);
        if (!service) {
            return { success: false, message: 'Xizmat topilmadi' };
        }

        if (service.status !== 'active') {
            return { success: false, message: 'Xizmat faol emas' };
        }

        return {
            success: true,
            data: {
                serviceId,
                quantity,
                serviceName: service.name,
                price: service.price,
                totalPrice: service.price * quantity,
                timestamp: new Date().toISOString()
            }
        };
    }

    // Payment Processing (Now via API)
    async processPayment(paymentData) {
        try {
            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items: this.orders,
                    payment: paymentData,
                    total: this.getOrderTotal(),
                    platform: 'OLX'
                })
            });
            const result = await response.json();
            return result;
        } catch (e) {
            return { success: false, message: 'Server bilan bog\'lanishda xato: ' + e.message };
        }
    }

    async completeCheckout(paymentData) {
        const paymentResult = await this.processPayment(paymentData);

        if (!paymentResult.success) {
            alert('❌ ' + paymentResult.message);
            return false;
        }

        alert('✅ Buyurtma qabul qilindi!\nID: ' + paymentResult.orderId);
        this.orders = [];
        this.saveOrders();
        this.updateOrderCount();
        return true;
    }
}

// Initialize OLX Platform
let olxPlatform = new OLXPlatform();

// Global Functions
function filterCategory(category) {
    document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    olxPlatform.renderServices(category);
}

function searchServices() {
    const query = document.getElementById('search-input').value.toLowerCase();
    const grid = document.getElementById('services-grid');
    grid.innerHTML = '';

    const filtered = olxPlatform.services.filter(s =>
        (s.name.toLowerCase().includes(query) ||
            s.description.toLowerCase().includes(query)) &&
        s.status === 'active'
    );

    if (filtered.length === 0) {
        grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: #A0A0A0;">Xizmat topilmadi</div>';
        return;
    }

    filtered.forEach(service => {
        const serviceHTML = `
            <div class="product-card" onclick="showServiceDetail(${service.id})">
                <div class="product-image">${service.image}</div>
                <div class="product-info">
                    <div class="product-category">${service.category.toUpperCase()}</div>
                    <div class="product-name">${service.name}</div>
                    <div class="product-desc">${service.description}</div>
                    <div class="product-rating">⭐ ${service.rating} (${service.reviews} sharh)</div>
                    <div class="product-price">$${service.price}</div>
                    <small style="color: #A0A0A0;">👤 ${service.seller}</small>
                    <div class="product-buttons">
                        <button class="btn-add-cart" onclick="event.stopPropagation(); quickOrder(${service.id})">
                            Buyurtma Berish
                        </button>
                    </div>
                </div>
            </div>
        `;
        grid.insertAdjacentHTML('beforeend', serviceHTML);
    });
}

function showServiceDetail(serviceId) {
    const service = olxPlatform.services.find(s => s.id === serviceId);
    if (!service) return;

    document.getElementById('detail-title').textContent = service.name;
    document.getElementById('detail-name').textContent = service.name;
    document.getElementById('detail-description').textContent = service.description;
    document.getElementById('detail-price').textContent = '$' + service.price;
    document.getElementById('detail-rating').textContent = `⭐ ${service.rating} (${service.reviews} reyting)`;
    document.getElementById('detail-image').textContent = service.image;
    document.getElementById('detail-quantity').value = 1;

    // Store current service ID for ordering
    window.currentServiceId = serviceId;

    showModal('service-detail-modal');
}

function quickOrder(serviceId) {
    const service = olxPlatform.services.find(s => s.id === serviceId);
    if (!service) return;

    const validation = olxPlatform.createValidationRequest(serviceId, 1);
    if (!validation.success) {
        alert('❌ ' + validation.message);
        return;
    }

    olxPlatform.addOrder(service, 1);
}

function orderService() {
    const quantity = parseInt(document.getElementById('detail-quantity').value) || 1;
    const service = olxPlatform.services.find(s => s.id === window.currentServiceId);

    if (!service) return;

    const validation = olxPlatform.createValidationRequest(window.currentServiceId, quantity);
    if (!validation.success) {
        alert('❌ ' + validation.message);
        return;
    }

    olxPlatform.addOrder(service, quantity);
    closeModal('service-detail-modal');
}

function viewOrders() {
    showModal('orders-modal');
    renderOrdersList();
}

function renderOrdersList() {
    const ordersList = document.getElementById('orders-list');
    ordersList.innerHTML = '';

    if (olxPlatform.orders.length === 0) {
        ordersList.innerHTML = '<div class="empty-cart">Buyurtmalar yo\'q</div>';
        document.getElementById('total-price').textContent = '$0';
        return;
    }

    olxPlatform.orders.forEach(order => {
        const orderHTML = `
            <div class="cart-item">
                <div class="cart-item-image">🛠️</div>
                <div class="cart-item-details">
                    <div class="cart-item-name">${order.serviceName}</div>
                    <div class="cart-item-price">$${order.price}</div>
                    <div class="cart-item-quantity">
                        Soni: <span>${order.quantity}</span>
                    </div>
                </div>
                <button class="cart-item-remove" onclick="olxPlatform.removeOrder(${order.id}); renderOrdersList()">
                    O'chirish
                </button>
            </div>
        `;
        ordersList.insertAdjacentHTML('beforeend', orderHTML);
    });

    document.getElementById('total-price').textContent = '$' + olxPlatform.getOrderTotal();
}

function checkout() {
    if (olxPlatform.orders.length === 0) {
        alert('Buyurtma yo\'q!');
        return;
    }

    closeModal('orders-modal');
    showModal('payment-modal');
    setupPaymentMethods();
}

function setupPaymentMethods() {
    const form = document.getElementById('payment-form');
    const radios = form.querySelectorAll('input[name="payment_method"]');

    radios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            document.querySelectorAll('.payment-details').forEach(el => el.classList.add('hidden'));
            const methodId = e.target.value + '-payment';
            const methodEl = document.getElementById(methodId);
            if (methodEl) methodEl.classList.remove('hidden');
        });
    });
}

async function processPayment(e) {
    e.preventDefault();

    const method = document.querySelector('input[name="payment_method"]:checked').value;
    let paymentData = { method };

    if (method === 'usd') {
        paymentData.wallet = document.querySelector('#usd-payment input').value;
    } else if (method === 'sberbank') {
        paymentData.cardNumber = document.querySelector('#sberbank-payment input').value;
    } else if (method === 'click' || method === 'payme') {
        paymentData.phone = document.querySelector(`#${method}-payment input`).value;
    }

    if (await olxPlatform.completeCheckout(paymentData)) {
        closeModal('payment-modal');
    }
}

function showAddServiceModal() {
    showModal('add-service-modal');
}

function addService(e) {
    e.preventDefault();

    const service = {
        name: document.getElementById('service-name').value,
        category: document.getElementById('service-category').value.split(' ')[1].toLowerCase(),
        description: document.getElementById('service-description').value,
        price: parseFloat(document.getElementById('service-price').value),
        image: document.getElementById('service-image').value || '🛠️'
    };

    if (olxPlatform.addService(service)) {
        alert('✅ Xizmat qo\'shildi!');
        document.getElementById('add-service-form').reset();
        closeModal('add-service-modal');
    }
}

function viewProfile() {
    alert('👤 Profil\n\nLogin: Foydalanuvchi\nReyting: 4.8 ⭐\nBuyurtmalar: ' + olxPlatform.orders.length);
}

// Modal Functions
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.add('active');
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.remove('active');
}

// Initialize order count on load
olxPlatform.updateOrderCount();
