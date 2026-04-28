import React, { useRef } from 'react';
import './InvoiceView.css';
import { COMPANY_INFO } from '../data/products';

// =====================================================
// INVOICE VIEW — Printable GST Invoice
// =====================================================

function numberToWords(n) {
  const ones = ['','One','Two','Three','Four','Five','Six','Seven','Eight','Nine','Ten',
    'Eleven','Twelve','Thirteen','Fourteen','Fifteen','Sixteen','Seventeen','Eighteen','Nineteen'];
  const tens = ['','','Twenty','Thirty','Forty','Fifty','Sixty','Seventy','Eighty','Ninety'];

  if (n === 0) return 'Zero';
  if (n < 20)  return ones[n];
  if (n < 100) return tens[Math.floor(n/10)] + (n % 10 ? ' ' + ones[n % 10] : '');
  if (n < 1000) return ones[Math.floor(n/100)] + ' Hundred' + (n % 100 ? ' ' + numberToWords(n % 100) : '');
  if (n < 100000) return numberToWords(Math.floor(n/1000)) + ' Thousand' + (n % 1000 ? ' ' + numberToWords(n % 1000) : '');
  if (n < 10000000) return numberToWords(Math.floor(n/100000)) + ' Lakh' + (n % 100000 ? ' ' + numberToWords(n % 100000) : '');
  return numberToWords(Math.floor(n/10000000)) + ' Crore' + (n % 10000000 ? ' ' + numberToWords(n % 10000000) : '');
}

function amountInWords(amount) {
  const rupees = Math.floor(amount);
  const paise  = Math.round((amount - rupees) * 100);
  let result = numberToWords(rupees) + ' Rupees';
  if (paise > 0) result += ' and ' + numberToWords(paise) + ' Paise';
  return result + ' Only';
}

export default function InvoiceView({ invoice, onBack }) {
  const printRef = useRef();

  const { invoiceNo, date, dueDate, customer, items, subtotal, cgst, sgst, total, notes, payMode } = invoice;

  const fmtINR = (n) => '₹' + Number(n).toLocaleString('en-IN', { minimumFractionDigits: 2 });

  const handlePrint = () => window.print();

  return (
    <div className="invoice-view-page">
      {/* Action Bar — hidden when printing */}
      <div className="invoice-actions no-print">
        <button className="btn btn-outline" onClick={onBack}>← Back to Invoices</button>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-primary" onClick={handlePrint}>🖨 Print / Save PDF</button>
        </div>
      </div>

      {/* ── PRINTABLE INVOICE ── */}
      <div className="invoice-paper card invoice-print-area" ref={printRef}>

        {/* Header */}
        <div className="inv-header">
          <div className="inv-company">
            <div className="inv-logo">
              <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
                <polygon points="22,4 40,38 4,38" fill="#f6ad55"/>
                <rect x="17" y="38" width="10" height="6" rx="1.5" fill="#f6ad55" opacity="0.6"/>
                <line x1="22" y1="4" x2="22" y2="38" stroke="#fff" strokeWidth="1.5" opacity="0.4"/>
              </svg>
            </div>
            <div>
              <h1 className="inv-company-name">{COMPANY_INFO.name}</h1>
              <p className="inv-company-addr" style={{ whiteSpace: 'pre-line' }}>{COMPANY_INFO.address}</p>
              <p className="inv-company-contact">Ph: {COMPANY_INFO.phone} · {COMPANY_INFO.email}</p>
              <p className="inv-company-gst">GSTIN: <strong>{COMPANY_INFO.gstin}</strong></p>
            </div>
          </div>

          <div className="inv-title-block">
            <div className="inv-title">TAX INVOICE</div>
            <div className="inv-no-display">{invoiceNo}</div>
            <table className="inv-meta-table">
              <tbody>
                <tr>
                  <td>Date</td>
                  <td>{new Date(date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                </tr>
                {dueDate && (
                  <tr>
                    <td>Due Date</td>
                    <td className="due-date">{new Date(dueDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                  </tr>
                )}
                <tr>
                  <td>Payment</td>
                  <td>{payMode}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="inv-divider" />

        {/* Bill To */}
        <div className="inv-parties">
          <div className="inv-bill-to">
            <div className="inv-section-label">BILL TO</div>
            <div className="inv-party-name">{customer.name}</div>
            <div className="inv-party-addr" style={{ whiteSpace: 'pre-line' }}>{customer.address}</div>
            {customer.gst   && <div className="inv-party-gst">GSTIN: {customer.gst}</div>}
            {customer.phone && <div className="inv-party-contact">Ph: {customer.phone}</div>}
            {customer.email && <div className="inv-party-contact">{customer.email}</div>}
          </div>

          <div className="inv-ship-to">
            <div className="inv-section-label">SHIP TO</div>
            <div className="inv-party-name">{customer.name}</div>
            <div className="inv-party-addr" style={{ whiteSpace: 'pre-line' }}>{customer.address}</div>
            <div className="inv-party-contact">Same as billing address</div>
          </div>
        </div>

        {/* Items Table */}
        <table className="inv-items-table">
          <thead>
            <tr>
              <th className="th-sl">#</th>
              <th className="th-desc">Description of Goods</th>
              <th className="th-sku">SKU</th>
              <th className="th-hsn">HSN</th>
              <th className="th-qty">Qty</th>
              <th className="th-rate">Rate (₹)</th>
              <th className="th-disc">Disc%</th>
              <th className="th-amt">Amount (₹)</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => (
              <tr key={idx} className={idx % 2 === 0 ? 'row-even' : 'row-odd'}>
                <td className="td-sl">{idx + 1}</td>
                <td className="td-desc">{item.product?.name}</td>
                <td className="td-sku">{item.product?.sku}</td>
                <td className="td-hsn">6306</td>
                <td className="td-qty">{item.qty} {item.product?.unit}</td>
                <td className="td-rate">{fmtINR(item.price)}</td>
                <td className="td-disc">{item.discount}%</td>
                <td className="td-amt">{fmtINR(item.amount)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals & Amount in Words */}
        <div className="inv-footer-grid">
          <div className="inv-words">
            <div className="inv-section-label">Amount in Words</div>
            <div className="inv-amount-words">{amountInWords(total)}</div>

            {notes && (
              <div className="inv-notes">
                <div className="inv-section-label" style={{ marginTop: 16 }}>Notes / Terms</div>
                <p>{notes}</p>
              </div>
            )}

            <div className="inv-bank-details">
              <div className="inv-section-label" style={{ marginTop: 16 }}>Bank Details</div>
              <table className="bank-table">
                <tbody>
                  <tr><td>Bank</td><td>{COMPANY_INFO.bank}</td></tr>
                  <tr><td>A/C No.</td><td>{COMPANY_INFO.account}</td></tr>
                  <tr><td>IFSC</td><td>{COMPANY_INFO.ifsc}</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="inv-totals">
            <div className="inv-total-row"><span>Subtotal</span>       <span>{fmtINR(subtotal)}</span></div>
            <div className="inv-total-row"><span>CGST @9%</span>       <span>{fmtINR(cgst)}</span></div>
            <div className="inv-total-row"><span>SGST @9%</span>       <span>{fmtINR(sgst)}</span></div>
            <div className="inv-total-row inv-total-grand">
              <span>Total Amount</span>
              <span>{fmtINR(total)}</span>
            </div>
          </div>
        </div>

        {/* Signature */}
        <div className="inv-signature-row">
          <div className="inv-declaration">
            <p>We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct.</p>
          </div>
          <div className="inv-sign-box">
            <div className="inv-sign-company">{COMPANY_INFO.name}</div>
            <div className="inv-sign-line" />
            <div className="inv-sign-label">Authorised Signatory</div>
          </div>
        </div>

        <div className="inv-footer-note">
          This is a computer-generated invoice. No signature required. · Subject to Bareilly jurisdiction.
        </div>
      </div>
    </div>
  );
}
