// Payment and Billing Page Logic
const billingData = {
  invoices: [
    {
      invoiceId: 'INV-00123',
      dateOfService: '2023-11-10',
      description: 'Annual Physical Exam',
      amount: 150.00,
    },
    {
      invoiceId: 'INV-00124',
      dateOfService: '2023-11-10',
      description: 'Lab Work - Complete Blood Count',
      amount: 75.50,
    },
    {
      invoiceId: 'INV-00129',
      dateOfService: '2023-11-18',
      description: 'Follow-up Consultation with Dr. Smith',
      amount: 50.00,
    }
  ],
  history: [
    {
      paymentId: 'PAY-88721',
      paymentDate: '2023-10-15',
      description: 'Payment for INV-00098, INV-00099',
      amountPaid: 225.00,
      paymentMethod: 'Mastercard **** 1234',
    },
    {
      paymentId: 'PAY-88654',
      paymentDate: '2023-09-12',
      description: 'Payment for INV-00081',
      amountPaid: 50.00,
      paymentMethod: 'Visa **** 5678',
    }
  ]
};

document.addEventListener('DOMContentLoaded', function () {
  // Render invoices
  const invoiceTable = document.getElementById('invoiceTableBody');
  billingData.invoices.forEach((inv, idx) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${inv.invoiceId}</td>
      <td>${inv.dateOfService}</td>
      <td>${inv.description}</td>
      <td>$${inv.amount.toFixed(2)}</td>
    `;
    row.style.opacity = 0;
    row.style.transform = 'translateY(12px)';
    setTimeout(() => {
      row.style.transition = 'opacity 0.5s, transform 0.5s';
      row.style.opacity = 1;
      row.style.transform = 'translateY(0)';
    }, 100 + idx * 80);
    invoiceTable.appendChild(row);
  });

  // Render payment history
  const historyTable = document.getElementById('historyTableBody');
  billingData.history.forEach((pay, idx) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${pay.paymentId}</td>
      <td>${pay.paymentDate}</td>
      <td>${pay.description}</td>
      <td>$${pay.amountPaid.toFixed(2)}</td>
      <td>${pay.paymentMethod}</td>
    `;
    row.style.opacity = 0;
    row.style.transform = 'translateY(12px)';
    setTimeout(() => {
      row.style.transition = 'opacity 0.5s, transform 0.5s';
      row.style.opacity = 1;
      row.style.transform = 'translateY(0)';
    }, 100 + idx * 80);
    historyTable.appendChild(row);
  });
});
