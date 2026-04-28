import React, { useState, useEffect } from 'react';
import './CustomerSection.css';
import { CUSTOMER_TYPES, STATES_IN } from '../data/products';

// =====================================================
// CUSTOMER SECTION — List, Add, Edit, Delete
// =====================================================

const EMPTY_FORM = {
  name: '', phone: '', email: '', address: '',
  gst: '', state: 'Uttar Pradesh', type: 'Retailer', discount: 0,
};

function CustomerForm({ editCustomer, onSave, onCancel }) {
  const [form, setForm] = useState(EMPTY_FORM);

  useEffect(() => {
    setForm(editCustomer ? { ...EMPTY_FORM, ...editCustomer } : EMPTY_FORM);
  }, [editCustomer]);

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
    setForm(EMPTY_FORM);
  };

  return (
    <div className="card customer-form-card fade-in">
      <div className="form-card-header">
        <h3>{editCustomer ? '✏️ Edit Customer' : '➕ Add New Customer'}</h3>
        {editCustomer && <button className="btn btn-outline btn-sm" onClick={onCancel}>Cancel</button>}
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-grid form-grid-2">

          <div>
            <label className="form-label">Business / Customer Name *</label>
            <input required className="form-input" placeholder="e.g. Rajesh Tent House"
              value={form.name} onChange={e => set('name', e.target.value)} />
          </div>

          <div>
            <label className="form-label">Phone Number *</label>
            <input required className="form-input" placeholder="10-digit mobile"
              value={form.phone} onChange={e => set('phone', e.target.value)}
              pattern="[0-9]{10}" title="Enter 10-digit phone number" />
          </div>

          <div>
            <label className="form-label">Email Address</label>
            <input type="email" className="form-input" placeholder="email@example.com"
              value={form.email} onChange={e => set('email', e.target.value)} />
          </div>

          <div>
            <label className="form-label">GST Number</label>
            <input className="form-input" placeholder="e.g. 09ABCDE1234F1Z5"
              value={form.gst} onChange={e => set('gst', e.target.value.toUpperCase())}
              maxLength={15} style={{ fontFamily: 'monospace' }} />
          </div>

          <div className="col-span-2">
            <label className="form-label">Full Address *</label>
            <textarea required className="form-input" rows={2}
              placeholder="Shop/Plot No., Street, City, District, Pincode"
              value={form.address} onChange={e => set('address', e.target.value)}
              style={{ resize: 'vertical' }} />
          </div>

          <div>
            <label className="form-label">State</label>
            <select className="form-input" value={form.state} onChange={e => set('state', e.target.value)}>
              {STATES_IN.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>

          <div>
            <label className="form-label">Customer Type</label>
            <select className="form-input" value={form.type} onChange={e => set('type', e.target.value)}>
              {CUSTOMER_TYPES.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>

          <div>
            <label className="form-label">Wholesale Discount %</label>
            <input type="number" className="form-input" min={0} max={50} step={0.5}
              placeholder="0" value={form.discount} onChange={e => set('discount', +e.target.value)} />
            <span className="form-hint">Applied automatically on new invoices</span>
          </div>

        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            {editCustomer ? '✓ Update Customer' : '✓ Save Customer'}
          </button>
          {editCustomer && (
            <button type="button" className="btn btn-outline" onClick={onCancel}>Cancel</button>
          )}
        </div>
      </form>
    </div>
  );
}

function CustomerCard({ customer, onEdit, onDelete }) {
  const initials = customer.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  const typeColors = {
    'Retailer': 'badge-blue',
    'Dealer': 'badge-amber',
    'Distributor': 'badge-green',
    'Direct / Walk-in': 'badge-red',
  };

  return (
    <div className="customer-card card fade-in">
      <div className="customer-card-left">
        <div className="avatar avatar-lg">{initials}</div>
        <div>
          <div className="customer-name">{customer.name}</div>
          <div className="customer-meta">
            📞 {customer.phone}
            {customer.email && <span> · 📧 {customer.email}</span>}
          </div>
          {customer.gst && <div className="customer-gst">GST: {customer.gst}</div>}
          <div className="customer-address">📍 {customer.address}</div>
        </div>
      </div>

      <div className="customer-card-right">
        <div className="customer-badges">
          <span className={`badge ${typeColors[customer.type] || 'badge-blue'}`}>{customer.type}</span>
          {customer.discount > 0 && (
            <span className="badge badge-green">{customer.discount}% off</span>
          )}
        </div>
        <div className="customer-since">Since {customer.createdAt}</div>
        <div className="customer-actions no-print">
          <button className="btn btn-outline btn-sm" onClick={() => onEdit(customer)}>✏️ Edit</button>
          <button className="btn btn-danger btn-sm"  onClick={() => onDelete(customer.id)}>🗑 Delete</button>
        </div>
      </div>
    </div>
  );
}

export default function CustomerSection({ customers, editCustomer, onSave, onEdit, onDelete, onCancelEdit }) {
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('All');

  useEffect(() => { if (editCustomer) setShowForm(true); }, [editCustomer]);

  const filtered = customers.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search) || (c.gst || '').toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === 'All' || c.type === filterType;
    return matchSearch && matchType;
  });

  const handleSave = (data) => {
    onSave(data);
    setShowForm(false);
  };

  return (
    <div>
      <div className="section-header">
        <div>
          <h1 className="section-title">Customers</h1>
          <p className="section-subtitle">{customers.length} wholesale customer{customers.length !== 1 ? 's' : ''} registered</p>
        </div>
        <button className="btn btn-primary no-print" onClick={() => { setShowForm(s => !s); onCancelEdit(); }}>
          {showForm && !editCustomer ? '✕ Cancel' : '+ Add Customer'}
        </button>
      </div>

      {(showForm || editCustomer) && (
        <CustomerForm
          editCustomer={editCustomer}
          onSave={handleSave}
          onCancel={() => { setShowForm(false); onCancelEdit(); }}
        />
      )}

      {/* Search & Filter */}
      <div className="customer-toolbar no-print">
        <input className="form-input toolbar-search" placeholder="🔍 Search by name, phone, or GST..."
          value={search} onChange={e => setSearch(e.target.value)} />
        <div className="filter-tabs">
          {['All', ...CUSTOMER_TYPES].map(t => (
            <button key={t}
              className={`filter-tab ${filterType === t ? 'active' : ''}`}
              onClick={() => setFilterType(t)}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Customer List */}
      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">👥</div>
          <h3>{search ? 'No customers match your search' : 'No customers yet'}</h3>
          <p>{search ? 'Try a different keyword' : 'Click "Add Customer" to register your first wholesale buyer'}</p>
        </div>
      ) : (
        <div className="customer-list">
          {filtered.map(c => (
            <CustomerCard key={c.id} customer={c} onEdit={onEdit} onDelete={onDelete} />
          ))}
        </div>
      )}
    </div>
  );
}
