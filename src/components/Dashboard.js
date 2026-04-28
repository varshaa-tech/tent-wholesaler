import React from 'react';
import './Dashboard.css';

// =====================================================
// DASHBOARD — Overview & Quick Stats
// =====================================================

function StatCard({ label, value, sub, color = 'blue', icon }) {
  return (
    <div className={`stat-card stat-card--${color} fade-in`}>
      <div className="stat-icon">{icon}</div>
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
      {sub && <div className="stat-sub">{sub}</div>}
    </div>
  );
}

export default function Dashboard({
  stats, recentInvoices, recentCustomers, onViewInvoice, onNewInvoice, onManageCustomers
}) {
  const fmtINR = (n) =>
    '₹' + Number(n).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="dashboard fade-in">
      {/* Welcome Banner */}
      <div className="dashboard-banner">
        <div>
          <h1 className="dashboard-heading">Welcome back 👋</h1>
          <p className="dashboard-subheading">TentPro Wholesale · Bareilly, UP — {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
        </div>
        <button className="btn btn-accent" onClick={onNewInvoice}>+ Create Invoice</button>
      </div>

      {/* Stat Cards */}
      <div className="stats-grid">
        <StatCard label="Total Revenue"    value={fmtINR(stats.totalRevenue)}   color="blue"  icon="₹" />
        <StatCard label="Total Invoices"   value={stats.totalInvoices}           color="amber" icon="📄" sub="all time" />
        <StatCard label="Customers"        value={stats.totalCustomers}          color="green" icon="👥" sub="registered" />
        <StatCard label="Pending Invoices" value={stats.pendingInvoices || 0}    color="red"   icon="⏳" sub="awaiting payment" />
      </div>

      <div className="dashboard-cols">
        {/* Recent Invoices */}
        <section>
          <div className="section-header">
            <h2 className="section-title">Recent Invoices</h2>
            <button className="btn btn-outline btn-sm" onClick={onNewInvoice}>+ New</button>
          </div>

          {recentInvoices.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📋</div>
              <h3>No invoices yet</h3>
              <p>Create your first invoice to get started</p>
            </div>
          ) : (
            <div className="list-cards">
              {recentInvoices.map((inv, i) => (
                <div key={inv.id} className="list-card fade-in" style={{ animationDelay: `${i * 0.05}s` }} onClick={() => onViewInvoice(inv)}>
                  <div className="inv-num-badge">
                    <span>{inv.invoiceNo?.split('-')[1]}</span>
                  </div>
                  <div className="list-card-body">
                    <div className="list-card-title">{inv.customer?.name}</div>
                    <div className="list-card-meta">{inv.date} · {inv.payMode}</div>
                  </div>
                  <div className="list-card-amount">{fmtINR(inv.total)}</div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Recent Customers */}
        <section>
          <div className="section-header">
            <h2 className="section-title">Recent Customers</h2>
            <button className="btn btn-outline btn-sm" onClick={onManageCustomers}>Manage</button>
          </div>

          {recentCustomers.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">👥</div>
              <h3>No customers yet</h3>
              <p>Add your first wholesale customer</p>
            </div>
          ) : (
            <div className="list-cards">
              {recentCustomers.map((c, i) => (
                <div key={c.id} className="list-card fade-in" style={{ animationDelay: `${i * 0.05}s` }}>
                  <div className="avatar">{c.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}</div>
                  <div className="list-card-body">
                    <div className="list-card-title">{c.name}</div>
                    <div className="list-card-meta">{c.phone} · {c.state}</div>
                  </div>
                  <span className="badge badge-blue">{c.type}</span>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
