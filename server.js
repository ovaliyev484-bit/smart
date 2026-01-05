const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, './')));

// Mock Database (Transition from LocalStorage)
const db = {
    products: [
        { id: 1, name: "iPhone 15 Pro", category: "electronics", price: 12999000, image: "📱" },
        { id: 2, name: "Samsung Galaxy S24", category: "electronics", price: 11999000, image: "📱" }
    ],
    orders: [],
    workers: [
        { id: "admin", password: "12345", name: "Administrator" }
    ]
};

// API Endpoints
app.get('/api/products', (req, res) => {
    res.json(db.products);
});

app.post('/api/orders', (req, res) => {
    const order = req.body;
    order.id = db.orders.length + 1;
    order.timestamp = new Date();
    db.orders.push(order);
    res.status(201).json({ success: true, orderId: order.id });
});

app.post('/api/auth/login', (req, res) => {
    const { id, password } = req.body;
    const worker = db.workers.find(w => w.id === id && w.password === password);
    if (worker) {
        res.json({ success: true, worker: { id: worker.id, name: worker.name } });
    } else {
        res.status(401).json({ success: false, message: "Xato ID yoki Parol" });
    }
});

// Keep-Alive Endpoint
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'active', timestamp: new Date() });
});

// Self-Ping Mechanism (Prevent Idling)
const PING_INTERVAL = 14 * 60 * 1000; // 14 minutes
const SERVER_URL = process.env.RENDER_EXTERNAL_URL || `http://localhost:${PORT}`;

setInterval(() => {
    const https = SERVER_URL.startsWith('https') ? require('https') : require('http');

    https.get(`${SERVER_URL}/api/health`, (resp) => {
        if (resp.statusCode === 200) {
            console.log(`[Keep-Alive] Self-ping successful at ${new Date().toISOString()}`);
        } else {
            console.warn(`[Keep-Alive] Self-ping failed with status: ${resp.statusCode}`);
        }
    }).on("error", (err) => {
        console.error("[Keep-Alive] Self-ping error:", err.message);
    });
}, PING_INTERVAL);

// Start Server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log(`[Keep-Alive] Configured for ${SERVER_URL} every 14 minutes`);
});
