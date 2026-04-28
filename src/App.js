import React, { useState } from 'react';
import './App.css';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import CustomerSection from './components/CustomerSection';
import InvoiceSection from './components/InvoiceSection';

// =====================================================
// ROOT APP — State Management & Navigation
// =====================================================

const INITIAL_CUSTOMERS = [
  {
    id: 1,
    name: 'Rajesh Tent House',
    phone: '9876543210',
    email: 'rajesh@tenthouse.in',
    address: '12 Gandhi Nagar, Civil Lines\nBareilly, UP 243001',
    gst: '09ABCDE1234F1Z5',
    state: 'Uttar Pradesh',
    type: 'Retailer',
    discount: 10,
    createdAt: '2024-01-15',
  },
  {
    id: 2,
    name: 'Sharma Events & Decorators',
    phone: '9123456780',
    email: 'sharma.events@gmail.com',
    address: 'Shop 5, Cantt Market\nLucknow, UP 226001',
    gst: '09XYZEF5678G2H6',
    state: 'Uttar Pradesh',
    type: 'Dealer',
    discount: 15,
    createdAt: '2024-02-10',
  },
];

let invoiceCounter = 1001;

export default function App() {
  const [tab, setTab] = useState('dashboard');
  const [customers, setCustomers] = useState(INITIAL_CUSTOMERS);
  const [invoices, setInvoices] = useState([]);
  const [editCustomer, setEditCustomer] = useState(null);
  const [showInvoiceForm, setShowInvoiceForm] = useState(false);
  const [viewInvoice, setViewInvoice] = useState(null);

  // ---- Customer Handlers ----
  const handleSaveCustomer = (data) => {
    if (editCustomer) {
      setCustomers(cs => cs.map(c => c.id === editCustomer.id ? { ...data, id: c.id, createdAt: c.createdAt } : c));
      setEditCustomer(null);
    } else {
      setCustomers(cs => [...cs, { ...data, id: Date.now(), createdAt: new Date().toISOString().split('T')[0] }]);
    }
  };

  const handleDeleteCustomer = (id) => {
    if (window.confirm('Delete this customer? This cannot be undone.')) {
      setCustomers(cs => cs.filter(c => c.id !== id));
    }
  };

  // ---- Invoice Handlers ----
  const handleSaveInvoice = (invoice) => {
    const inv = { ...invoice, invoiceNo: `INV-${invoiceCounter++}` };
    setInvoices(is => [inv, ...is]);
    setShowInvoiceForm(false);
    setViewInvoice(inv);
  };

  const handleNewInvoice = () => {
    setShowInvoiceForm(true);
    setViewInvoice(null);
    setTab('invoices');
  };

  const handleTabChange = (t) => {
    setTab(t);
    setViewInvoice(null);
    setShowInvoiceForm(false);
    setEditCustomer(null);
  };

  // ---- Stats for dashboard ----
  const stats = {
    totalCustomers: customers.length,
    totalInvoices: invoices.length,
    totalRevenue: invoices.reduce((s, inv) => s + inv.total, 0),
    pendingInvoices: invoices.filter(inv => inv.status === 'pending').length,
  };

  return (
    <div className="app">
      <Header tab={tab} onTabChange={handleTabChange} onNewInvoice={handleNewInvoice} />

      <main className="app-main">
        {tab === 'dashboard' && (
          <Dashboard
            stats={stats}
            recentInvoices={invoices.slice(0, 5)}
            recentCustomers={customers.slice(0, 5)}
            onViewInvoice={(inv) => { setViewInvoice(inv); setTab('invoices'); }}
            onNewInvoice={handleNewInvoice}
            onManageCustomers={() => handleTabChange('customers')}
          />
        )}

        {tab === 'customers' && (
          <CustomerSection
            customers={customers}
            editCustomer={editCustomer}
            onSave={handleSaveCustomer}
            onEdit={setEditCustomer}
            onDelete={handleDeleteCustomer}
            onCancelEdit={() => setEditCustomer(null)}
          />
        )}

        {tab === 'invoices' && (
          <InvoiceSection
            invoices={invoices}
            customers={customers}
            showForm={showInvoiceForm}
            viewInvoice={viewInvoice}
            onSaveInvoice={handleSaveInvoice}
            onViewInvoice={setViewInvoice}
            onNewInvoice={() => { setShowInvoiceForm(true); setViewInvoice(null); }}
            onCancelForm={() => setShowInvoiceForm(false)}
            onBack={() => { setViewInvoice(null); setShowInvoiceForm(false); }}
          />
        )}
      </main>
    </div>
  );
}
