// ai/ai.js - AI Expert & Payment Simulator
(function () {
    // --- Configuration ---
    const CLICK_SECRET = 'click_secret_key_123';

    // --- AI Expert Chat Logic ---
    class AIExpert {
        constructor() {
            this.input = document.getElementById('ai-chat-input');
            this.sendBtn = document.getElementById('ai-chat-send');
            this.container = document.getElementById('ai-messages');
            this.init();
        }

        init() {
            if (!this.sendBtn) return;
            this.sendBtn.addEventListener('click', () => this.handleMessage());
            this.input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.handleMessage();
                }
            });

            // Auto-resize input
            this.input.addEventListener('input', () => {
                this.input.style.height = 'auto';
                this.input.style.height = (this.input.scrollHeight) + 'px';
            });
        }

        handleMessage() {
            const text = this.input.value.trim();
            if (!text) return;

            this.addMessage(text, 'user');
            this.input.value = '';
            this.input.style.height = 'auto';

            setTimeout(() => {
                const response = this.generateResponse(text);
                this.addMessage(response, 'bot');
            }, 600);
        }

        addMessage(text, sender) {
            const div = document.createElement('div');
            div.className = `message ${sender}`;
            div.textContent = text;
            this.container.appendChild(div);
            this.container.scrollTop = this.container.scrollHeight;
        }

        generateResponse(text) {
            const msg = text.toLowerCase();
            if (msg.includes('click')) return "Click to'lov tizimi Prepare va Complete zaproslari orqali ishlaydi. MD5 signaturani tekshirish uchun Payment Inspector-dan foydalaning.";
            if (msg.includes('payme')) return "Payme JSON-RPC 2.0 protokolidan foydalanadi. 'receipts.create' va 'receipts.pay' metodlarini tekshirib ko'rishingiz mumkin.";
            if (msg.includes('status')) return "Hozirgi tizim holati: Barcha modullar (Uzum, OLX, Afford) barqaror ishlamoqda. To'lov simulyatori faol.";
            if (msg.includes('salom')) return "Assalomu alaykum! Smart Savdo AI Eksperti xizmatingizda. Savolingiz bo'lsa bering.";

            return "Tushunarli. Sizga to'lov tizimlari yoki kod struktrurasi bo'yicha yana qanday yordam bera olaman?";
        }
    }

    // --- Payment Mock Server Logic ---
    class PaymentMockServer {
        constructor() {
            this.currentProtocol = 'click_prepare';
            this.logEl = document.getElementById('simulator-log');
            this.payloadEl = document.getElementById('request-payload');
            this.select = document.getElementById('protocol-select');
            this.init();
        }

        init() {
            if (!this.select) return;
            this.select.addEventListener('change', (e) => this.setProtocol(e.target.value));
            const runBtn = document.getElementById('run-simulation');
            if (runBtn) runBtn.addEventListener('click', () => this.process());

            const showBtn = document.getElementById('show-payment-sim');
            if (showBtn) showBtn.addEventListener('click', () => toggleInspector());

            this.setProtocol('click_prepare');
        }

        setProtocol(val) {
            this.currentProtocol = val;
            let mockData = {};

            if (val === 'click_prepare') {
                mockData = {
                    click_trans_id: "12345",
                    service_id: "999",
                    click_paydoc_id: "5555",
                    merchant_trans_id: "order_001",
                    amount: "50000",
                    action: "0",
                    error: "0",
                    error_note: "Success",
                    sign_time: new Date().toISOString().replace('T', ' ').substring(0, 19),
                    sign_string: "md5_hash_here"
                };
            } else if (val === 'click_complete') {
                mockData = {
                    click_trans_id: "12345",
                    service_id: "999",
                    click_paydoc_id: "5555",
                    merchant_trans_id: "order_001",
                    merchant_prepare_id: "prepare_99",
                    amount: "50000",
                    action: "1",
                    error: "0",
                    error_note: "Success",
                    sign_time: new Date().toISOString().replace('T', ' ').substring(0, 19),
                    sign_string: "md5_hash_here"
                };
            } else if (val === 'payme_jsonrpc') {
                mockData = {
                    method: "CheckTransaction",
                    params: { id: "p001_id" },
                    id: 1,
                    jsonrpc: "2.0"
                };
            }

            this.payloadEl.value = JSON.stringify(mockData, null, 2);
        }

        process() {
            try {
                const req = JSON.parse(this.payloadEl.value);
                this.log(`Incoming ${this.currentProtocol} Request...`);

                let response = {};
                if (this.currentProtocol.startsWith('click')) {
                    response = this.handleClick(req);
                } else if (this.currentProtocol === 'payme_jsonrpc') {
                    response = this.handlePayme(req);
                }

                this.log(`Response:\n${JSON.stringify(response, null, 2)}`);
            } catch (e) {
                this.log(`Error: Invalid JSON format - ${e.message}`);
            }
        }

        handleClick(req) {
            this.log(`[Click] Action: ${req.action === "0" ? 'Prepare' : 'Complete'}`);
            this.log(`[Click] Verifying MD5 signature...`);
            // Click pattern logic simulation
            return {
                click_trans_id: req.click_trans_id,
                merchant_trans_id: req.merchant_trans_id,
                merchant_prepare_id: req.action === "0" ? Math.floor(Math.random() * 10000) : req.merchant_prepare_id,
                error: 0,
                error_note: "Success"
            };
        }

        handlePayme(req) {
            this.log(`[Payme] Method: ${req.method}`);
            if (req.method === 'CheckTransaction') {
                return {
                    jsonrpc: "2.0",
                    id: req.id,
                    result: {
                        state: 2,
                        create_time: Date.now(),
                        perform_time: Date.now() + 1000,
                        cancel_time: 0,
                        transaction: "t-123",
                        reason: null
                    }
                };
            }
            return { jsonrpc: "2.0", id: req.id, error: { code: -32601, message: "Method not found" } };
        }

        log(msg) {
            if (!this.logEl) return;
            this.logEl.textContent += `\n[${new Date().toLocaleTimeString()}] ${msg}`;
            this.logEl.scrollTop = this.logEl.scrollHeight;
        }
    }

    // --- Global Helpers ---
    window.toggleInspector = function () {
        const el = document.getElementById('payment-inspector');
        if (el) el.classList.toggle('hidden');
    };

    document.addEventListener('DOMContentLoaded', () => {
        new AIExpert();
        new PaymentMockServer();
    });

})();
