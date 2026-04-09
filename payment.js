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
                total: 147000,
                items: [
                    { name: 'Office Visit (Level 3)', cost: 72000 },
                    { name: 'ECG / EKG interpretation', cost: 75000 }
                ]
            },
            {
                id: 'INV-2026-X812',
                date: 'March 10, 2026',
                doctor: 'Quest Diagnostics',
                type: 'Comprehensive Lab Panel',
                total: 51300,
                items: [
                    { name: 'Complete Blood Count (CBC)', cost: 21000 },
                    { name: 'Comprehensive Metabolic Panel', cost: 30300 }
                ]
            }
        ],
        history: [
            {
                id: 'PAY-88721',
                date: 'January 12, 2026',
                amount: 90000,
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
        bindMoMoSelection();
    }

    // ─── Mobile Money Selection ──────────
    function bindMoMoSelection() {
        const momoBtns = document.querySelectorAll('.btn-momo');
        momoBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active from others
                momoBtns.forEach(b => b.classList.remove('active'));
                // Add to clicked
                btn.classList.add('active');
                
                // Update display to show secure MoMo payment
                if (billingState.selectedInvoiceId) {
                    const inv = billingState.invoices.find(i => i.id === billingState.selectedInvoiceId);
                    const method = btn.getAttribute('data-method').toUpperCase();
                    DOM.payButton.innerHTML = `<i class="fas fa-mobile-alt"></i> Pay ${inv.total.toLocaleString()} CFA via ${method}`;
                }
            });
        });
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
            DOM.invoiceList.innerHTML = '<div class="glass" style="padding: 3rem; text-align: center; color: var(--c-mist); border-radius: var(--radius-lg);">You have no outstanding invoices! 🎉</div>';
            return;
        }

        billingState.invoices.forEach(inv => {
            const card = document.createElement('div');
            card.className = `invoice-card ${billingState.selectedInvoiceId === inv.id ? 'selected' : ''}`;
            
            card.innerHTML = `
                <div class="inv-info">
                    <h3 class="inv-type">${inv.type}</h3>
                    <p class="inv-meta"><i class="fas fa-calendar-alt"></i> ${inv.date} &nbsp;|&nbsp; <i class="fas fa-user-md"></i> ${inv.doctor}</p>
                    <p class="inv-id">Invoice #${inv.id}</p>
                </div>
                <div class="inv-amount">
                    <span class="amount-value">${inv.total.toLocaleString()} CFA</span>
                </div>
            `;
            
            card.addEventListener('click', () => {
                billingState.selectedInvoiceId = inv.id;
                renderInvoices(); 
                updateSummary();
            });
            
            DOM.invoiceList.appendChild(card);
        });
    }

    function renderHistory() {
        DOM.receiptList.innerHTML = '';
        if (billingState.history.length === 0) {
            DOM.receiptList.innerHTML = '<p class="text-muted" style="text-align: center; padding: 2rem;">No payment history found.</p>';
            return;
        }

        billingState.history.forEach(pay => {
            const card = document.createElement('div');
            card.className = 'invoice-card history-card';
            card.style.borderLeft = '4px solid var(--c-success)';
            
            card.innerHTML = `
                <div class="pay-info">
                    <h3 class="pay-desc">${pay.desc}</h3>
                    <p class="pay-meta"><i class="fas fa-check-circle" style="color: var(--c-success);"></i> Paid on ${pay.date}</p>
                    <p class="pay-ref">Ref: #${pay.id} via ${pay.method}</p>
                </div>
                <div class="pay-amount">
                    <span class="amount-value" style="color: var(--c-steel);">${pay.amount.toLocaleString()} CFA</span>
                </div>
            `;
            DOM.receiptList.appendChild(card);
        });
    }

    // ─── Update Summary Sidebar ─────────────
    function updateSummary() {
        if (!billingState.selectedInvoiceId) {
            DOM.summaryItems.innerHTML = '<p class="summary-empty" style="text-align:center; padding: 2rem 0; color: var(--c-gray-400);">Select an invoice on the left to begin.</p>';
            DOM.totalAmountElement.textContent = '0 CFA';
            DOM.payButton.disabled = true;
            DOM.payButton.textContent = 'Pay 0 CFA Now';
            return;
        }

        const inv = billingState.invoices.find(i => i.id === billingState.selectedInvoiceId);
        
        // Build items
        DOM.summaryItems.innerHTML = inv.items.map(item => `
            <div class="summary-item" style="display: flex; justify-content: space-between; margin-bottom: 0.75rem;">
                <span class="item-name" style="color: var(--c-mist); font-size: 0.95rem;">${item.name}</span>
                <span class="item-cost" style="font-weight: 600; color: var(--c-obsidian);">${item.cost.toLocaleString()} CFA</span>
            </div>
        `).join('');

        DOM.totalAmountElement.textContent = `${inv.total.toLocaleString()} CFA`;
        DOM.payButton.disabled = false;
        DOM.payButton.innerHTML = `<i class="fas fa-shield-alt"></i> Pay ${inv.total.toLocaleString()} CFA Securely Now`;
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
                const amtSpan = DOM.modal.querySelector('.payment-value');
                const dateSpan = DOM.modal.querySelector('.modal-date');
                const patientSpan = DOM.modal.querySelector('.modal-patient');
                const doctorSpan = DOM.modal.querySelector('.modal-doctor');
                const notesPara = DOM.modal.querySelector('#modal-notes');

                // Mock Patient (usually from session/auth)
                const mockPatient = "John Doe"; 

                if (txSpan) txSpan.textContent = billingState.history[0].id;
                if (amtSpan) amtSpan.textContent = `${inv.total.toLocaleString()} CFA`;
                if (dateSpan) dateSpan.textContent = billingState.history[0].date;
                if (patientSpan) patientSpan.textContent = mockPatient;
                if (doctorSpan) doctorSpan.textContent = inv.doctor;
                
                // Varied Notes based on type
                if (notesPara) {
                    if (inv.type.includes('Cardiology')) {
                        notesPara.textContent = "Patient assessment complete. Rhythm is stable. Recommended daily low-intensity cardio and low-sodium diet. EKG attached to portal.";
                    } else if (inv.type.includes('Lab')) {
                        notesPara.textContent = "Full blood panel processed. All markers within normal range except vitamin D (slight deficiency). Supplement plan provided in patient portal.";
                    } else {
                        notesPara.textContent = "Standard consultation notes: Patient is in good health. No immediate concerns. Continue current wellness regimen.";
                    }
                }
                
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
