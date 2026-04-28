import React, { useState, useCallback } from 'react';
import './InvoiceForm.css';
import { PRODUCTS, TAX_RATE, PAYMENT_MODES } from '../data/products';

// =====================================================
// INVOICE FORM — Create a new invoice
// =====================================================

const today = new Date().toISOString().split('T')[0];

const EMPTY_ITEM = { productId: '', qty: 1, price: 0, discount: 0 };

function LineItem({ item, index, customerDiscount, onUpdate, onRemove }) {
  const product = PRODUCTS.find(p => p.id === +item.productId);

  const handleProductChange = (productId) => {
    const p = PRODUCTS.find(x => x.id === +productId);
    onUpdate(index, {
      ...item,
      productId,
      price: p ? p.price : 0,
      discount: customerDiscount || 0,
    });
  };

  const base = item.price * item.qty;
  const amount = base - (base * item.discount / 100);

  return (
    <tr className="line-item fade-in">
      <td className="td-product">
        <select className="form-input input-sm"
          value={item.productId}
          onChange={e => handleProductChange(e.target.value)}>
          <option value="">— Select Product —</option>
          {PRODUCTS.map(p => (
            <option key={p.id} value={p.id}>{p.name} ({p.sku})</option>
          ))}
        </select>
        {product && <span className="item-sku">{product.category}</span>}
      </td>

      <td className="td-qty">
        <input type="number" className="form-input input-sm text-right"
          min={1} value={item.qty}
          onChange={e => onUpdate(index, { ...item, qty: Math.max(1, +e.target.value) })} />
        {product && <span className="item-unit">{product.unit}</span>}
      </td>

      <td className="td-price">
        <input type="number" className="form-input input-sm text-right"
          min={0} value={item.price}
          onChange={e => onUpdate(index, { ...item, price: +e.target.value })} />
      </td>

      <td className="td-disc">
        <input type="number" className="form-input input-sm text-right"
          min={0} max={100} value={item.discount}
          onChange={e => onUpdate(index, { ...item, discount: +e.target.value })} />
      </td>

      <td className="td-amount">
        ₹{amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
      </td>

      <td className="td-remove">
        <button type="button" className="remove-btn" onClick={() => onRemove(index)}
          title="Remove row">✕</button>
      </td>
    </tr>
  );
}

export default function InvoiceForm({ customers, onSave, onCancel }) {
  const [customerId, setCustomerId] = useState(customers[0]?.id || '');
  const [date, setDate]             = useState(today);
  const [dueDate, setDueDate]       = useState('');
  const [items, setItems]           = useState([{ ...EMPTY_ITEM }]);
  const [notes, setNotes]           = useState('');
  const [payMode, setPayMode]       = useState(PAYMENT_MODES[0]);

  const customer = customers.find(c => c.id === +customerId) || customers[0];

  const addItem    = ()        => setItems(is => [...is, { ...EMPTY_ITEM }]);
  const removeItem = (i)       => setItems(is => is.filter((_, idx) => idx !== i));
  const updateItem = useCallback((i, updated) => {
    setItems(is => is.map((it, idx) => idx === i ? updated : it));
  }, []);

  const calcAmount = (item) => {
    if (!item.productId) return 0;
    const base = item.price * item.qty;
    return base - (base * item.discount / 100);
  };

  const subtotal = items.reduce((s, it) => s + calcAmount(it), 0);
  const cgst     = subtotal * (TAX_RATE / 2);
  const sgst     = subtotal * (TAX_RATE / 2);
  const total    = subtotal + cgst + sgst;

  const handleSubmit = (e) => {
    e.preventDefault();
    const validItems = items.filter(it => it.productId && it.qty > 0);
    if (!validItems.length) { alert('Please add at least one product.'); return; }
    if (!customer)          { alert('Please select a customer.'); return; }

    const enrichedItems = validItems.map(it => ({
      ...it,
      product: PRODUCTS.find(p => p.id === +it.productId),
      amount: calcAmount(it),
    }));

    onSave({
      id: Date.now(),
      date, dueDate, customer,
      items: enrichedItems,
      subtotal, cgst, sgst, total,
      notes, payMode,
      status: 'unpaid',
    });
  };

  const fmtINR = (n) => '₹' + n.toLocaleString('en-IN', { minimumFractionDigits: 2 });

  return (
    <div className="invoice-form-page fade-in">
      <div className="section-header">
        <div>
          <h1 className="section-title">Create Invoice</h1>
          <p className="section-subtitle">Fill in the details below to generate a GST invoice</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-outline" onClick={onCancel}>✕ Cancel</button>
          <button className="btn btn-primary" form="invoice-form" type="submit">✓ Generate Invoice</button>
        </div>
      </div>

      <form id="invoice-form" onSubmit={handleSubmit}>

        {/* ── Section 1: Invoice Meta ── */}
        <div className="card form-section">
          <h2 className="form-section-title">Invoice Details</h2>
          <div className="form-grid form-grid-3">
            <div>
              <label className="form-label">Customer *</label>
              <select required className="form-input"
                value={customerId} onChange={e => setCustomerId(e.target.value)}>
                {customers.length === 0 && <option value="">No customers — add one first</option>}
                {customers.map(c => (
                  <option key={c.id} value={c.id}>{c.name} ({c.type})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="form-label">Invoice Date *</label>
              <input required type="date" className="form-input"
                value={date} onChange={e => setDate(e.target.value)} />
            </div>

            <div>
              <label className="form-label">Due Date</label>
              <input type="date" className="form-input"
                value={dueDate} onChange={e => setDueDate(e.target.value)} />
            </div>
          </div>

          {/* Customer Preview */}
          {customer && (
            <div className="customer-preview">
              <strong>Bill To:</strong> {customer.name} · {customer.phone}
              {customer.gst && <> · GST: <code>{customer.gst}</code></>}
              {customer.discount > 0 && (
                <span className="badge badge-green" style={{ marginLeft: 8 }}>{customer.discount}% wholesale discount</span>
              )}
            </div>
          )}
        </div>

        {/* ── Section 2: Line Items ── */}
        <div className="card form-section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 className="form-section-title" style={{ margin: 0 }}>Products / Items</h2>
            <button type="button" className="btn btn-outline btn-sm" onClick={addItem}>+ Add Row</button>
          </div>

          <div className="items-table-wrap">
            <table className="items-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Qty</th>
                  <th>Unit Price (₹)</th>
                  <th>Disc %</th>
                  <th>Amount (₹)</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, idx) => (
                  <LineItem
                    key={idx}
                    item={item}
                    index={idx}
                    customerDiscount={customer?.discount || 0}
                    onUpdate={updateItem}
                    onRemove={removeItem}
                  />
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="totals-panel">
            <div className="totals-row"><span>Subtotal</span>       <span>{fmtINR(subtotal)}</span></div>
            <div className="totals-row"><span>CGST (9%)</span>      <span>{fmtINR(cgst)}</span></div>
            <div className="totals-row"><span>SGST (9%)</span>      <span>{fmtINR(sgst)}</span></div>
            <div className="totals-row totals-grand">
              <span>Grand Total</span>
              <span>{fmtINR(total)}</span>
            </div>
          </div>
        </div>

        {/* ── Section 3: Payment & Notes ── */}
        <div className="card form-section">
          <h2 className="form-section-title">Payment & Notes</h2>
          <div className="form-grid form-grid-2">
            <div>
              <label className="form-label">Payment Mode</label>
              <select className="form-input" value={payMode} onChange={e => setPayMode(e.target.value)}>
                {PAYMENT_MODES.map(m => <option key={m}>{m}</option>)}
              </select>
            </div>
            <div>
              <label className="form-label">Notes / Terms</label>
              <textarea className="form-input" rows={2}
                placeholder="e.g. Goods to be dispatched within 3 days. Payment due on delivery."
                value={notes} onChange={e => setNotes(e.target.value)}
                style={{ resize: 'vertical' }} />
            </div>
          </div>
        </div>

        <div className="form-submit-bar">
          <button type="button" className="btn btn-outline" onClick={onCancel}>✕ Cancel</button>
          <button type="submit" className="btn btn-primary">✓ Generate Invoice →</button>
        </div>

      </form>
    </div>
  );
}
