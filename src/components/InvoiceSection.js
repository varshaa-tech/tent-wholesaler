import React from 'react';
import InvoiceForm from './InvoiceForm';
import InvoiceList from './InvoiceList';
import InvoiceView from './InvoiceView';

// =====================================================
// INVOICE SECTION — Router between list / form / view
// =====================================================

export default function InvoiceSection({
  invoices, customers, showForm, viewInvoice,
  onSaveInvoice, onViewInvoice, onNewInvoice, onCancelForm, onBack
}) {
  if (viewInvoice) {
    return <InvoiceView invoice={viewInvoice} onBack={onBack} />;
  }

  if (showForm) {
    return (
      <InvoiceForm
        customers={customers}
        onSave={onSaveInvoice}
        onCancel={onCancelForm}
      />
    );
  }

  return (
    <InvoiceList
      invoices={invoices}
      onView={onViewInvoice}
      onNew={onNewInvoice}
    />
  );
}
