// Billing and Payment Page Interactive Logic
document.addEventListener('DOMContentLoaded', function () {
    // Shared State for billing
    let billingState = {
        invoices: [
            {
                id: 'INV-2026-X891',
                date: 'March 15, 2026',
                doctor: 'Dr. Sarah Johnson',
                type: 'Cardiology Consultation',
                total: 245.00,
                items: [
                    { name: 'Office Visit (Level 3)', cost: 120.00 },
                    { name: 'ECG / EKG interpretation', cost: 125.00 }
                ]
            },
            {
                id: 'INV-2026-X812',
                date: 'March 10, 2026',
                doctor: 'Quest Diagnostics',
                type: 'Comprehensive Lab Panel',
                total: 85.50,
                items: [
                    { name: 'Complete Blood Count (CBC)', cost: 35.00 },
                    { name: 'Comprehensive Metabolic Panel', cost: 50.50 }
                ]
            }
        ],
        history: [
            {
                id: 'PAY-88721',
                date: 'January 12, 2026',
                amount: 150.00,
                method: 'Visa •••• 1234',
                desc: 'Annual Physical (Dr. Chen)'
            }
        ],
        selectedInvoiceId: null
    };

    const DOM = {
        dueTabBtn: document.querySelector('.tab[data-tab="due"]'),
        historyTabBtn: document.querySelector('.tab[data-tab="history"]'),
        dueTabContent: document.getElementById('tab-due'),
        historyTabContent: document.getElementById('tab-history'),
        invoiceList: document.querySelector('.invoice-list'),
        receiptList: document.querySelector('.receipt-list'),
        summaryItems: document.querySelector('.summary-items'),
        totalAmountElement: document.querySelector('.total-amount'),
        payButton: document.querySelector('.pay-btn'),
        modal: document.querySelector('.receipt-modal'),
        closeModalBtn: document.querySelector('.close-modal')
    };

    function init() {
        if (!DOM.invoiceList) return; // Prevent errors if running on other pages
        bindTabs();
        renderInvoices();
        renderHistory();
        bindPaymentSimulation();
        updateSummary();
    }

    // ─── Tabs ─────────────────────────────
    function bindTabs() {
        if (!DOM.dueTabBtn) return;
        DOM.dueTabBtn.addEventListener('click', () => {
            DOM.dueTabBtn.classList.add('active');
            DOM.historyTabBtn.classList.remove('active');
            DOM.dueTabContent.style.display = 'block';
            DOM.historyTabContent.style.display = 'none';
        });
        DOM.historyTabBtn.addEventListener('click', () => {
            DOM.historyTabBtn.classList.add('active');
            DOM.dueTabBtn.classList.remove('active');
            DOM.historyTabContent.style.display = 'block';
            DOM.dueTabContent.style.display = 'none';
        });
    }

    // ─── Render Functions ──────────────────
    function renderInvoices() {
        DOM.invoiceList.innerHTML = '';
        if (billingState.invoices.length === 0) {
            DOM.invoiceList.innerHTML = '<div style="padding: 2rem; text-align: center; color: var(--c-gray-500); background: white; border-radius: var(--radius-lg); box-shadow: var(--shadow-sm);">You have no outstanding invoices! 🎉</div>';
            return;
        }

        billingState.invoices.forEach(inv => {
            const card = document.createElement('div');
            card.className = `invoice-card ${billingState.selectedInvoiceId === inv.id ? 'selected' : ''}`;
            // Inline styling fallback for card if not firmly defined in CSS
            card.style.cssText = `
                display: flex; justify-content: space-between; align-items: center; 
                background: white; padding: 1.5rem; border-radius: var(--radius-lg); 
                box-shadow: var(--shadow-sm); cursor: pointer; transition: all 0.3s ease;
                border: 2px solid ${billingState.selectedInvoiceId === inv.id ? 'var(--c-teal-500)' : 'transparent'};
                margin-bottom: 1rem;
            `;
            
            card.innerHTML = `
                <div class="inv-info">
                    <h3 style="margin-bottom: 0.25rem; color: var(--text-dark);">${inv.type}</h3>
                    <p style="font-size: 0.875rem; color: var(--c-gray-600);"><i class="fas fa-calendar-alt"></i> ${inv.date} &nbsp;|&nbsp; <i class="fas fa-user-md"></i> ${inv.doctor}</p>
                    <p style="font-size: 0.75rem; color: var(--c-gray-400); margin-top: 5px;">Invoice #${inv.id}</p>
                </div>
                <div class="inv-amount" style="text-align: right;">
                    <span style="font-size: 1.5rem; font-weight: 700; color: var(--c-primary);">$${inv.total.toFixed(2)}</span>
                </div>
            `;
            
            card.addEventListener('click', () => {
                billingState.selectedInvoiceId = inv.id;
                renderInvoices(); // Re-render to update selected border
                updateSummary();
            });
            
            DOM.invoiceList.appendChild(card);
        });
    }

    function renderHistory() {
        DOM.receiptList.innerHTML = '';
        if (billingState.history.length === 0) {
            DOM.receiptList.innerHTML = '<p>No payment history found.</p>';
            return;
        }

        billingState.history.forEach(pay => {
            const card = document.createElement('div');
            card.style.cssText = `
                display: flex; justify-content: space-between; align-items: center; 
                background: white; padding: 1.5rem; border-radius: var(--radius-lg); 
                border-left: 4px solid var(--c-green-500);
                box-shadow: var(--shadow-sm); margin-bottom: 1rem;
            `;
            card.innerHTML = `
                <div class="pay-info">
                    <h3 style="margin-bottom: 0.25rem; color: var(--c-gray-800); font-size: 1.1rem;">${pay.desc}</h3>
                    <p style="font-size: 0.875rem; color: var(--c-gray-500);"><i class="fas fa-check-circle" style="color: var(--c-green-500);"></i> Paid on ${pay.date}</p>
                    <p style="font-size: 0.75rem; color: var(--c-gray-400); margin-top: 5px;">Ref: #${pay.id} via ${pay.method}</p>
                </div>
                <div class="pay-amount" style="text-align: right;">
                    <span style="font-size: 1.25rem; font-weight: 600; color: var(--c-gray-600);">$${pay.amount.toFixed(2)}</span>
                </div>
            `;
            DOM.receiptList.appendChild(card);
        });
    }

    // ─── Update Summary Sidebar ─────────────
    function updateSummary() {
        if (!billingState.selectedInvoiceId) {
            DOM.summaryItems.innerHTML = '<p class="summary-empty" style="text-align:center; padding: 2rem 0; color: var(--c-gray-400);">Select an invoice on the left to begin.</p>';
            DOM.totalAmountElement.textContent = '$0.00';
            DOM.payButton.disabled = true;
            DOM.payButton.textContent = 'Pay $0.00 Now';
            return;
        }

        const inv = billingState.invoices.find(i => i.id === billingState.selectedInvoiceId);
        
        // Build items
        DOM.summaryItems.innerHTML = inv.items.map(item => `
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem; font-size: 0.9rem;">
                <span style="color: var(--c-gray-600);">${item.name}</span>
                <span style="font-weight: 500;">$${item.cost.toFixed(2)}</span>
            </div>
        `).join('');

        DOM.totalAmountElement.textContent = `$${inv.total.toFixed(2)}`;
        DOM.payButton.disabled = false;
        DOM.payButton.innerHTML = `<i class="fas fa-lock"></i> Pay $${inv.total.toFixed(2)} Securely`;
    }

    // ─── Simulate Payment ───────────────────
    function bindPaymentSimulation() {
        if (!DOM.payButton || !DOM.modal) return;

        DOM.payButton.addEventListener('click', () => {
            const orgBtnText = DOM.payButton.innerHTML;
            DOM.payButton.disabled = true;
            DOM.payButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
            
            // Artificial delay for realism
            setTimeout(() => {
                // Success
                DOM.payButton.innerHTML = orgBtnText;
                const invIndex = billingState.invoices.findIndex(i => i.id === billingState.selectedInvoiceId);
                const inv = billingState.invoices[invIndex];
                
                // Move from Due to History
                billingState.invoices.splice(invIndex, 1);
                billingState.history.unshift({
                    id: 'PAY-' + Math.floor(Math.random() * 90000 + 10000),
                    date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
                    amount: inv.total,
                    method: 'Simulated Card',
                    desc: inv.type
                });

                // Clear selection
                billingState.selectedInvoiceId = null;

                // Re-render
                renderInvoices();
                renderHistory();
                updateSummary();

                // Open Modal
                const txSpan = DOM.modal.querySelector('.modal-txid');
                const amtSpan = document.querySelector('.modal-total span');
                const dateSpan = DOM.modal.querySelector('.modal-date');
                if (txSpan) txSpan.textContent = billingState.history[0].id;
                if (amtSpan) amtSpan.textContent = `$${inv.total.toFixed(2)}`;
                if (dateSpan) dateSpan.textContent = billingState.history[0].date;
                
                DOM.modal.style.display = 'flex';

            }, 1500);
        });

        // Close Modal
        if (DOM.closeModalBtn) {
            DOM.closeModalBtn.addEventListener('click', () => {
                DOM.modal.style.display = 'none';
                DOM.historyTabBtn.click(); // Auto-switch to history tab to show the new receipt
            });
        }
    }

    init();
});
