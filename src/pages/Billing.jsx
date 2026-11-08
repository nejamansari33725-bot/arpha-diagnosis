import React, { useState } from 'react';
import { useLab } from '../context/LabContext';
import { useAuth, ROLES } from '../context/AuthContext';
import {
  Receipt,
  Search,
  PlusCircle,
  IndianRupee,
  Printer,
  CheckCircle2,
  Clock,
  AlertCircle,
  CreditCard,
  QrCode,
  User,
  Filter,
  Check,
  Download
} from 'lucide-react';
import BarcodeRenderer from '../components/BarcodeRenderer';

export default function Billing() {
  const { invoices, patients, tests, createInvoice, updateInvoicePayment, settings } = useLab();
  const { user } = useAuth();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [printReceiptModal, setPrintReceiptModal] = useState(null);

  // New Invoice State
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [selectedTestIds, setSelectedTestIds] = useState([]);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [paidAmount, setPaidAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('UPI / QR');

  // Quick Pay Modal State
  const [payingInvoice, setPayingInvoice] = useState(null);
  const [payAmountInput, setPayAmountInput] = useState('');

  // Calculations for new invoice modal
  const selectedTestsList = tests.filter(t => selectedTestIds.includes(t.id));
  const subtotal = selectedTestsList.reduce((acc, t) => acc + Number(t.price || 0), 0);
  const netTotal = Math.max(0, subtotal - Number(discountAmount || 0));
  const actualPaid = paidAmount === '' ? netTotal : Math.min(netTotal, Number(paidAmount || 0));
  const dueAmount = Math.max(0, netTotal - actualPaid);

  const filteredInvoices = invoices.filter(inv => {
    const matchesSearch =
      inv.invoiceNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.patientPhone?.includes(searchTerm);
    const matchesStatus = statusFilter === 'ALL' || inv.paymentStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleTestToggle = (testId) => {
    if (selectedTestIds.includes(testId)) {
      setSelectedTestIds(selectedTestIds.filter(id => id !== testId));
    } else {
      setSelectedTestIds([...selectedTestIds, testId]);
    }
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    const patient = patients.find(p => p.id === selectedPatientId);
    if (!patient || selectedTestIds.length === 0) return;

    const newInv = createInvoice({
      patientId: patient.id,
      patientName: patient.name,
      patientPhone: patient.phone,
      testIds: selectedTestIds,
      testNames: selectedTestsList.map(t => t.name),
      subtotal,
      discount: Number(discountAmount || 0),
      tax: 0,
      total: netTotal,
      paid: actualPaid,
      due: dueAmount,
      paymentStatus: dueAmount === 0 ? 'paid' : actualPaid > 0 ? 'partial' : 'unpaid',
      paymentMethod
    });

    setIsCreateModalOpen(false);
    setSelectedPatientId('');
    setSelectedTestIds([]);
    setDiscountAmount(0);
    setPaidAmount('');
    setPrintReceiptModal(newInv);
  };

  const handleQuickPay = (e) => {
    e.preventDefault();
    if (!payingInvoice || !payAmountInput) return;
    updateInvoicePayment(payingInvoice.id, Number(payAmountInput), 'Cash');
    setPayingInvoice(null);
    setPayAmountInput('');
  };

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <Receipt className="w-7 h-7 text-emerald-600" />
            <span>Billing, Invoicing & Financial Collections</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Automated invoice generation, test-wise pricing, discount control, balance dues, and thermal printable receipts.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-md transition-all self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Generate New Invoice</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by invoice number (INV-...), patient or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
          />
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {['ALL', 'paid', 'partial', 'unpaid'].map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
                statusFilter === st
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st === 'ALL' ? 'All Invoices' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3 px-4">Invoice #</th>
                <th className="py-3 px-4">Patient Name & Phone</th>
                <th className="py-3 px-4">Investigation Panels</th>
                <th className="py-3 px-4">Total Amount</th>
                <th className="py-3 px-4">Paid / Due</th>
                <th className="py-3 px-4">Status & Mode</th>
                <th className="py-3 px-4 text-right">Receipt Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-400">
                    No invoices match the selected filter.
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-brand-700">
                      {inv.invoiceNumber}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{inv.patientName}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{inv.patientPhone}</div>
                    </td>

                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="font-medium text-slate-800 truncate" title={inv.testNames?.join(', ')}>
                        {inv.testNames?.join(', ')}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {inv.testNames?.length || 1} test(s) billed
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-black text-slate-900 text-sm">₹{inv.total}</div>
                      {inv.discount > 0 && (
                        <div className="text-[10px] text-emerald-600 font-medium">Disc: ₹{inv.discount}</div>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="text-emerald-700 font-bold">Paid: ₹{inv.paid}</div>
                      {inv.due > 0 ? (
                        <div className="text-rose-600 font-bold text-[11px]">Due: ₹{inv.due}</div>
                      ) : (
                        <div className="text-[10px] text-slate-400">Nil</div>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        inv.paymentStatus === 'paid'
                          ? 'bg-emerald-100 text-emerald-800'
                          : inv.paymentStatus === 'partial'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}>
                        {inv.paymentStatus}
                      </span>
                      <div className="text-[10px] text-slate-400 mt-0.5">{inv.paymentMethod}</div>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {inv.due > 0 && (
                          <button
                            onClick={() => {
                              setPayingInvoice(inv);
                              setPayAmountInput(inv.due);
                            }}
                            className="px-2.5 py-1 text-xs font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg border border-emerald-200"
                          >
                            Collect Due
                          </button>
                        )}
                        <button
                          onClick={() => setPrintReceiptModal(inv)}
                          className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                          title="Print Thermal / A4 Receipt"
                        >
                          <Printer className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Collect Due Payment Modal */}
      {payingInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-sm overflow-hidden p-6 space-y-4">
            <h3 className="font-bold text-sm text-slate-900">
              Collect Balance Payment: {payingInvoice.invoiceNumber}
            </h3>
            <p className="text-xs text-slate-500">
              Patient: <strong className="text-slate-800">{payingInvoice.patientName}</strong> • Due: <strong className="text-rose-600">₹{payingInvoice.due}</strong>
            </p>
            <form onSubmit={handleQuickPay} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Amount Receiving (₹)</label>
                <input
                  type="number"
                  required
                  max={payingInvoice.due}
                  value={payAmountInput}
                  onChange={(e) => setPayAmountInput(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl font-bold text-sm"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setPayingInvoice(null)}
                  className="px-3 py-1.5 border rounded-xl text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-600 text-white font-bold rounded-xl"
                >
                  Record Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Printable Receipt Modal */}
      {printReceiptModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden p-6 space-y-4">
            
            {/* Thermal / Standard Receipt Box */}
            <div className="p-5 border-2 border-slate-200 rounded-xl space-y-3 font-mono text-xs text-slate-800 bg-slate-50/50">
              <div className="text-center border-b pb-2 space-y-0.5">
                <h4 className="font-black text-sm text-slate-900">{settings.labName}</h4>
                <p className="text-[10px] text-slate-500">{settings.address}</p>
                <p className="text-[10px] text-slate-500">Phone: {settings.phone}</p>
                <p className="text-[10px] font-bold text-emerald-700 uppercase mt-1">Cash / UPI Payment Receipt</p>
              </div>

              <div className="flex justify-between text-[11px] pt-1">
                <span>Receipt: <strong>{printReceiptModal.invoiceNumber}</strong></span>
                <span>Date: {new Date(printReceiptModal.createdAt).toLocaleDateString()}</span>
              </div>

              <div className="border-t border-dashed pt-2 space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Patient:</span>
                  <span className="font-bold">{printReceiptModal.patientName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Phone:</span>
                  <span>{printReceiptModal.patientPhone}</span>
                </div>
              </div>

              <div className="border-t border-dashed pt-2 space-y-1">
                <div className="text-[10px] font-bold uppercase text-slate-400">Investigations Billed:</div>
                {printReceiptModal.testNames?.map((name, i) => (
                  <div key={i} className="text-[11px] text-slate-700 flex justify-between">
                    <span>{i + 1}. {name}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-slate-300 pt-2 space-y-1 text-xs">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>₹{printReceiptModal.subtotal || printReceiptModal.total}</span>
                </div>
                {printReceiptModal.discount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Discount:</span>
                    <span>-₹{printReceiptModal.discount}</span>
                  </div>
                )}
                <div className="flex justify-between font-black text-sm border-t pt-1">
                  <span>Net Amount:</span>
                  <span>₹{printReceiptModal.total}</span>
                </div>
                <div className="flex justify-between font-bold text-emerald-800">
                  <span>Paid:</span>
                  <span>₹{printReceiptModal.paid} ({printReceiptModal.paymentMethod})</span>
                </div>
                {printReceiptModal.due > 0 && (
                  <div className="flex justify-between font-bold text-rose-600">
                    <span>Balance Due:</span>
                    <span>₹{printReceiptModal.due}</span>
                  </div>
                )}
              </div>

              <div className="border-t border-dashed pt-3 flex flex-col items-center justify-center text-center">
                <BarcodeRenderer value={printReceiptModal.invoiceNumber} height={25} width={1.2} fontSize={8} />
                <p className="text-[9px] text-slate-400 mt-1">Thank you for trusting Arpha Diagnosis.</p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setPrintReceiptModal(null)}
                className="px-4 py-2 border rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-black flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Receipt</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Generate New Invoice Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="bg-emerald-700 px-6 py-4 text-white flex items-center justify-between shrink-0">
              <h3 className="font-bold text-sm">Generate Patient Invoice</h3>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-white hover:opacity-75">✕</button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-6 space-y-4 text-xs overflow-y-auto">
              
              {/* Select Patient */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Select Patient *</label>
                <select
                  required
                  value={selectedPatientId}
                  onChange={(e) => setSelectedPatientId(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl bg-white"
                >
                  <option value="">-- Choose Patient --</option>
                  {patients.map(p => (
                    <option key={p.id} value={p.id}>{p.name} ({p.patientId}) - {p.phone}</option>
                  ))}
                </select>
              </div>

              {/* Multi-select Tests */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Select Investigations / Tests ({selectedTestIds.length} selected) *
                </label>
                <div className="max-h-44 overflow-y-auto border border-slate-200 rounded-xl p-2 space-y-1 bg-slate-50/50">
                  {tests.map(test => {
                    const isChecked = selectedTestIds.includes(test.id);
                    return (
                      <label
                        key={test.id}
                        className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${
                          isChecked ? 'bg-emerald-50 border border-emerald-300' : 'hover:bg-slate-100'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleTestToggle(test.id)}
                            className="rounded text-emerald-600 focus:ring-emerald-500"
                          />
                          <span className="font-medium text-slate-800">{test.name}</span>
                        </div>
                        <span className="font-bold text-slate-900">₹{test.price}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Discount & Calculations */}
              <div className="grid grid-cols-2 gap-3 pt-2 border-t">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Subtotal (₹)</label>
                  <input
                    type="text"
                    disabled
                    value={`₹${subtotal}`}
                    className="w-full px-3 py-2 border rounded-xl bg-slate-100 font-bold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Discount Amount (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={discountAmount}
                    onChange={(e) => setDiscountAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Final Payable Total (₹)</label>
                  <input
                    type="text"
                    disabled
                    value={`₹${netTotal}`}
                    className="w-full px-3 py-2 border rounded-xl bg-emerald-50 text-emerald-800 font-black text-sm"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Amount Paid Now (₹)</label>
                  <input
                    type="number"
                    min="0"
                    max={netTotal}
                    placeholder={`Full (₹${netTotal})`}
                    value={paidAmount}
                    onChange={(e) => setPaidAmount(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl font-bold"
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Payment Method</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl bg-white"
                >
                  <option value="UPI / QR">UPI / BharatPe QR</option>
                  <option value="Cash">Cash at Reception</option>
                  <option value="Debit / Credit Card">Debit / Credit Card</option>
                  <option value="Net Banking">Net Banking</option>
                </select>
              </div>

              <div className="pt-3 border-t flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 border rounded-xl text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={selectedTestIds.length === 0 || !selectedPatientId}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl disabled:opacity-50"
                >
                  Create Invoice & Print
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
