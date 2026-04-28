import React from 'react';
import './Header.css';

// =====================================================
// HEADER — Navigation & Branding
// =====================================================

const TentIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
    <polygon points="16,3 29,26 3,26" fill="#f6ad55" />
    <rect x="13" y="26" width="6" height="5" rx="1" fill="#f6ad55" opacity="0.65" />
    <line x1="16" y1="3" x2="16" y2="26" stroke="#fff" strokeWidth="1" opacity="0.4" />
  </svg>
);

const NAV_TABS = [
  { id: 'dashboard', label: 'Dashboard',  icon: '⊞' },
  { id: 'customers', label: 'Customers',  icon: '◎' },
  { id: 'invoices',  label: 'Invoices',   icon: '≡' },
];

export default function Header({ tab, onTabChange, onNewInvoice }) {
  return (
    <header className="header no-print">
      <div className="header-inner">
        {/* Brand */}
        <div className="brand">
          <TentIcon />
          <div>
            <div className="brand-name">TentPro Wholesale</div>
            <div className="brand-sub">Bareilly, Uttar Pradesh</div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="header-nav">
          {NAV_TABS.map(t => (
            <button
              key={t.id}
              className={`nav-btn ${tab === t.id ? 'active' : ''}`}
              onClick={() => onTabChange(t.id)}
            >
              <span className="nav-icon">{t.icon}</span>
              {t.label}
            </button>
          ))}
        </nav>

        {/* CTA */}
        <button className="btn btn-accent header-cta" onClick={onNewInvoice}>
          + New Invoice
        </button>
      </div>
    </header>
  );
}
