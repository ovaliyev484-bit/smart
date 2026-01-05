// Chatbot System
// Chatbot System
class Chatbot {
    constructor() {
        this.isOpen = false;
        this.messages = [];
        this.init();
    }

    init() {
        // Only create UI if it doesn't exist (avoid duplicates)
        if (!document.getElementById('chatbot-container')) {
            this.createChatbotUI();
        }
        this.attachEventListeners();
        this.loadConversationHistory();
        this.startHeartbeat();
    }

    startHeartbeat() {
        // Use localhost:3000 if running locally (file:// or different port), otherwise use relative path
        const API_BASE_URL = (window.location.protocol === 'file:' || window.location.port !== '3000')
            ? 'http://localhost:3000'
            : '';

        // Ping server every 5 minutes
        setInterval(() => {
            fetch(`${API_BASE_URL}/api/health`)
                .then(res => res.json())
                .catch(err => console.log('Heartbeat skipped (offline)'));
        }, 5 * 60 * 1000);
    }

    createChatbotUI() {
        const logoPath = window.location.pathname.includes('/') && (
            window.location.pathname.includes('/ai/') ||
            window.location.pathname.includes('/uzum/') ||
            window.location.pathname.includes('/afford/') ||
            window.location.pathname.includes('/olx/')
        ) ? '../icon.png' : 'icon.png';

        // Chatbot Container & Toggle (Injected separately to body)
        const chatbotHTML = `
            <!-- Chatbot Toggle Button -->
            <div id="chatbot-toggle" title="Chatbot">
                <img src="${logoPath}" alt="Bot">
            </div>

            <!-- Chatbot Window -->
            <div id="chatbot-container">
                <!-- Header -->
                <div class="chatbot-header">
                    <h3>Smart Savdo Bot</h3>
                    <div style="cursor: pointer; font-size: 1.2rem;" id="chatbot-close">✕</div>
                </div>

                <!-- Messages Container -->
                <div id="chatbot-messages">
                    <div class="chatbot-message bot">
                        Assalomu alaykum! 👋 Men Smart Savdo chatbotiman. Sizga qanday yordam bera olaman?
                    </div>
                </div>

                <!-- Input Area -->
                <div class="chatbot-input-area">
                    <input 
                        type="text" 
                        id="chatbot-input" 
                        placeholder="Savol bering..."
                        autocomplete="off"
                    >
                    <button id="chatbot-send" style="background:none; border:none; cursor:pointer; font-size:1.2rem;">📤</button>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', chatbotHTML);
    }

    attachEventListeners() {
        // Re-query elements just in case
        const toggle = document.getElementById('chatbot-toggle');
        const close = document.getElementById('chatbot-close');
        const send = document.getElementById('chatbot-send');
        const input = document.getElementById('chatbot-input');

        if (toggle) toggle.addEventListener('click', () => this.toggleChat());
        if (close) close.addEventListener('click', () => this.closeChat());
        if (send) send.addEventListener('click', () => this.sendMessage());
        if (input) input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });
    }

    toggleChat() {
        const container = document.getElementById('chatbot-container');
        this.isOpen = !this.isOpen;

        if (this.isOpen) {
            container.classList.add('active');
            const input = document.getElementById('chatbot-input');
            if (input) input.focus();
        } else {
            container.classList.remove('active');
        }
    }

    closeChat() {
        this.isOpen = false;
        const container = document.getElementById('chatbot-container');
        if (container) container.classList.remove('active');
    }

    sendMessage() {
        const input = document.getElementById('chatbot-input');
        const text = input.value.trim();

        if (!text) return;

        // Add user message
        this.addMessage(text, 'user');
        input.value = '';

        // Get bot response
        setTimeout(() => {
            const response = this.getBotResponse(text);
            this.addMessage(response, 'bot');
        }, 500);
    }

    addMessage(text, sender) {
        const messagesContainer = document.getElementById('chatbot-messages');
        // styles.css uses .chatbot-message.user and .chatbot-message.bot
        const messageClass = sender === 'user' ? 'user' : 'bot';

        const messageDiv = document.createElement('div');
        messageDiv.classList.add('chatbot-message', messageClass);
        messageDiv.textContent = text; // Safe text insertion

        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        // Save to history
        this.messages.push({ sender, text, time: new Date() });
        this.saveConversationHistory();
    }

    getBotResponse(userMessage) {
        const message = userMessage.toLowerCase();

        // Greeting responses
        if (message.match(/assalom|salom|hi|hello|hey/i)) {
            return "Assalomu alaykum! 👋 Smart Savdo-ga xush kelibsiz!";
        }

        // Product related
        if (message.match(/mahsulot|tovar|narx|qiymat/i)) {
            return "Bizda ko'plab mahsulotlar bor! 🛍️ Uzum Market-da barcha tovarlarni ko'rish uchun 'Ochish' tugmasini bosing.";
        }

        // Shopping cart
        if (message.match(/savat|sotib olish|buy|order/i)) {
            return "Savat-da mahsulotlarni qo'shishingiz mumkin va osonlik bilan checkout qilishingiz mumkin! 🛒";
        }

        // Payment
        if (message.match(/to'lash|payment|pul|pul to'lash/i)) {
            return "Biz turli to'lov usullarini qabul qilamiz! Checkout sahifasida barcha variantlarni ko'rasiz. 💳";
        }

        // Delivery
        if (message.match(/yetkazib berish|delivery|dostavka|kelib turadimi/i)) {
            return "Biz tez yetkazib beramiz! Buyurtma berilgandan keyin 1-3 kun ichida mahsulot kelib tavsadi. 🚚";
        }

        // Worker portal
        if (message.match(/worker|ishchi|afford|dashboard/i)) {
            return "Afford Worker portali orqali o'z profilingizni boshqarishingiz mumkin! 👨‍💼";
        }

        // Help/Support
        if (message.match(/yordam|help|support|muammola/i)) {
            return "Sizga qanday yordam berishim mumkin? Mahsulotlar haqida, savat haqida, yoki boshqa savol bering!";
        }

        // Thank you
        if (message.match(/rahmat|thanks|spasiba|to'g'ri/i)) {
            return "Xush kelib! Bosh suhbat uchun taqdirni 😊";
        }

        // Default response
        const responses = [
            "Qiziq savol! 🤔 Menga mahsulotlar, savat, yetkazib berish yoki boshqa haqida so'rash mumkin.",
            "Diqqat bering! Sizga qanday yordam berishim mumkin? 💪",
            "Bu haqida qo'shimcha ma'lumot bering, iltimos! 🔍",
            "Tushunarli! Bosh savol bor mi? 😊"
        ];

        return responses[Math.floor(Math.random() * responses.length)];
    }

    saveConversationHistory() {
        localStorage.setItem('chatbot_messages', JSON.stringify(this.messages));
    }

    loadConversationHistory() {
        const saved = localStorage.getItem('chatbot_messages');
        if (saved) {
            this.messages = JSON.parse(saved);
        }
    }
}

// Initialize chatbot when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new Chatbot();
});
