import React, { useState } from 'react';
import './InvoiceList.css';

// =====================================================
// INVOICE LIST — Browse all invoices
// =====================================================

export default function InvoiceList({ invoices, onView, onNew }) {
  const [search, setSearch] = useState('');

  const filtered = invoices.filter(inv =>
    inv.invoiceNo.toLowerCase().includes(search.toLowerCase()) ||
    inv.customer?.name?.toLowerCase().includes(search.toLowerCase())
  );

  const fmtINR = (n) => '₹' + Number(n).toLocaleString('en-IN', { minimumFractionDigits: 2 });

  const totalRevenue = invoices.reduce((s, inv) => s + inv.total, 0);

  return (
    <div>
      <div className="section-header">
        <div>
          <h1 className="section-title">Invoices</h1>
          <p className="section-subtitle">
            {invoices.length} invoice{invoices.length !== 1 ? 's' : ''} · Total: {fmtINR(totalRevenue)}
          </p>
        </div>
        <button className="btn btn-primary no-print" onClick={onNew}>+ New Invoice</button>
      </div>

      {invoices.length > 0 && (
        <div className="no-print" style={{ marginBottom: '1.25rem' }}>
          <input className="form-input" style={{ maxWidth: 360 }}
            placeholder="🔍 Search by invoice no. or customer name..."
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <h3>{search ? 'No invoices match your search' : 'No invoices yet'}</h3>
          <p>{search ? 'Try a different keyword' : 'Click "New Invoice" to create your first GST invoice'}</p>
        </div>
      ) : (
        <div className="invoice-list">
          {/* Table Header */}
          <div className="inv-list-header">
            <span>Invoice No.</span>
            <span>Customer</span>
            <span>Date</span>
            <span>Due</span>
            <span>Payment</span>
            <span style={{ textAlign: 'right' }}>Amount</span>
          </div>

          {filtered.map((inv, i) => (
            <div key={inv.id} className="inv-list-row card fade-in"
              style={{ animationDelay: `${i * 0.04}s` }}
              onClick={() => onView(inv)}>
              <span className="inv-no">{inv.invoiceNo}</span>
              <span className="inv-customer">
                <strong>{inv.customer?.name}</strong>
                <small>{inv.customer?.type}</small>
              </span>
              <span className="inv-date">{inv.date}</span>
              <span className={`inv-due ${inv.dueDate && new Date(inv.dueDate) < new Date() ? 'overdue' : ''}`}>
                {inv.dueDate || '—'}
              </span>
              <span>
                <span className="badge badge-blue">{inv.payMode}</span>
              </span>
              <span className="inv-total">{fmtINR(inv.total)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
