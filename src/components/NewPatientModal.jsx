import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLab } from '../context/LabContext';
import {
  X,
  UserPlus,
  Phone,
  User,
  MapPin,
  Stethoscope,
  TestTubes,
  Receipt,
  IndianRupee,
  CheckCircle2,
  Search,
  Check,
  CreditCard,
  Printer,
  FileText,
  AlertCircle
} from 'lucide-react';

const DOCTOR_PRESETS = [
  'Self / Walk-in (Direct Patient)',
  'Dr. A. K. Verma (MD Medicine)',
  'Dr. Ritu Sinha (Gynecologist)',
  'Dr. S. K. Roy (General Surgeon)',
  'Dr. Manoj Kumar (Pediatrician)',
  'Dr. Priya Ranjan (Orthopedic)',
  'Dr. N. K. Sharma (Cardiologist)',
  '+ Enter Other Doctor Name...'
];

export default function NewPatientModal({ isOpen, onClose, onSuccess }) {
  const navigate = useNavigate();
  const { registerPatientWithBillingAndTests, tests, patients } = useLab();
  
  const nextNum = patients.length + 1;
  const previewId = `ARPHA-${new Date().getFullYear()}-${String(nextNum).padStart(4, '0')}`;

  // Step 1: Patient details
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('Male');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [bloodGroup, setBloodGroup] = useState('B+');

  // Step 2: Doctor
  const [selectedDoctorOption, setSelectedDoctorOption] = useState(DOCTOR_PRESETS[0]);
  const [customDoctorName, setCustomDoctorName] = useState('');

  // Step 3: Test Selection
  const [selectedTestIds, setSelectedTestIds] = useState([]);
  const [testSearch, setTestSearch] = useState('');
  const [testCategory, setTestCategory] = useState('ALL');

  // Step 4: Payment Details
  const [discount, setDiscount] = useState(0);
  const [paidAmount, setPaidAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash');

  // UI States
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdSummary, setCreatedSummary] = useState(null);

  if (!isOpen) return null;

  // Selected tests details & calculations
  const selectedTestsList = tests.filter(t => selectedTestIds.includes(t.id));
  const subtotal = selectedTestsList.reduce((acc, t) => acc + Number(t.price || 0), 0);
  const netTotal = Math.max(0, subtotal - Number(discount || 0));
  const actualPaid = paidAmount === '' ? netTotal : Math.min(netTotal, Number(paidAmount || 0));
  const dueAmount = Math.max(0, netTotal - actualPaid);

  const toggleTest = (testId) => {
    if (selectedTestIds.includes(testId)) {
      setSelectedTestIds(selectedTestIds.filter(id => id !== testId));
    } else {
      setSelectedTestIds([...selectedTestIds, testId]);
    }
  };

  const filteredTests = tests.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(testSearch.toLowerCase()) ||
                          t.code.toLowerCase().includes(testSearch.toLowerCase());
    const matchesCat = testCategory === 'ALL' || t.category === testCategory;
    return matchesSearch && matchesCat;
  });

  const getDoctorString = () => {
    if (selectedDoctorOption.startsWith('+ Enter')) {
      return customDoctorName.trim() ? `Dr. ${customDoctorName.trim()}` : 'Self / Walk-in';
    }
    return selectedDoctorOption;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please enter patient full name');
      return;
    }
    if (!age || Number(age) <= 0 || Number(age) > 125) {
      setError('Please enter a valid age between 1 and 125');
      return;
    }
    if (!phone || phone.length < 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }

    setIsSubmitting(true);
    try {
      const referringDoctor = getDoctorString();

      const result = registerPatientWithBillingAndTests({
        patientData: {
          name: name.trim(),
          age: Number(age),
          gender,
          phone: phone.trim(),
          address: address.trim() || 'Ranchi',
          bloodGroup,
          referringDoctor
        },
        selectedTestIds,
        billingData: {
          subtotal,
          discount: Number(discount || 0),
          total: netTotal,
          paid: actualPaid,
          due: dueAmount,
          paymentMethod
        }
      });

      setIsSubmitting(false);
      setCreatedSummary(result);
      if (onSuccess) onSuccess(result);
    } catch (err) {
      setIsSubmitting(false);
      setError('Failed to register: ' + err.message);
    }
  };

  const handleResetAndClose = () => {
    setName('');
    setAge('');
    setGender('Male');
    setPhone('');
    setAddress('');
    setSelectedTestIds([]);
    setDiscount(0);
    setPaidAmount('');
    setCreatedSummary(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden my-auto max-h-[92vh] flex flex-col animate-in zoom-in-95">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-brand-800 via-brand-700 to-cyan-700 px-6 py-4 text-white flex items-center justify-between shrink-0 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center shadow-inner">
              <UserPlus className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-extrabold tracking-tight">New Patient Intake & Instant Billing</h2>
              <p className="text-xs text-brand-200">
                Auto Generated Patient ID: <span className="font-mono font-bold text-white bg-black/20 px-2 py-0.5 rounded">{previewId}</span>
              </p>
            </div>
          </div>
          <button
            onClick={handleResetAndClose}
            className="w-8 h-8 rounded-xl hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        {createdSummary ? (
          /* SUCCESS SUMMARY SCREEN */
          <div className="p-8 text-center space-y-6 overflow-y-auto">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900">Patient Registered & Billed Successfully!</h3>
              <p className="text-xs text-slate-500 mt-1">
                Specimen barcodes generated and test worklists have been queued for laboratory analysis.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 max-w-md mx-auto text-left text-xs space-y-3 font-mono">
              <div className="flex justify-between border-b pb-2">
                <span className="text-slate-500">Patient ID:</span>
                <span className="font-bold text-brand-700">{createdSummary.patient.patientId}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-slate-500">Patient Name:</span>
                <span className="font-bold text-slate-900">{createdSummary.patient.name}</span>
              </div>
              {createdSummary.invoice && (
                <>
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-slate-500">Invoice No:</span>
                    <span className="font-bold text-emerald-700">{createdSummary.invoice.invoiceNumber}</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-slate-500">Tests Billed:</span>
                    <span className="font-bold text-slate-800">{createdSummary.tests.length} Panels</span>
                  </div>
                  <div className="flex justify-between text-sm pt-1">
                    <span className="font-bold text-slate-700">Total Billed:</span>
                    <span className="font-black text-slate-900">₹{createdSummary.invoice.total}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-emerald-700 font-bold">Paid:</span>
                    <span className="font-bold text-emerald-800">₹{createdSummary.invoice.paid} ({createdSummary.invoice.paymentMethod})</span>
                  </div>
                  {createdSummary.invoice.due > 0 && (
                    <div className="flex justify-between text-rose-600 font-bold">
                      <span>Balance Due:</span>
                      <span>₹{createdSummary.invoice.due}</span>
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
              <button
                onClick={() => {
                  handleResetAndClose();
                  navigate('/billing');
                }}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2"
              >
                <Printer className="w-4 h-4" />
                <span>Print Bill Receipt</span>
              </button>
              <button
                onClick={() => {
                  handleResetAndClose();
                  navigate('/reports');
                }}
                className="px-5 py-2.5 bg-brand-700 hover:bg-brand-800 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2"
              >
                <FileText className="w-4 h-4" />
                <span>Enter Test Results</span>
              </button>
              <button
                onClick={handleResetAndClose}
                className="px-4 py-2.5 border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold text-xs rounded-xl"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          /* REGISTRATION FORM */
          <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto">
            {error && (
              <div className="p-3.5 text-xs bg-rose-50 text-rose-700 border border-rose-200 rounded-2xl flex items-center gap-2 font-medium">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* SECTION 1: PATIENT INFORMATION */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                <User className="w-4 h-4 text-brand-600" />
                <span>1. Patient Demographics</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mohammad Irfan Ansari"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none font-medium"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Mobile Number *</label>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="tel"
                      required
                      placeholder="10-digit mobile"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Age (Years) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    max="125"
                    placeholder="e.g. 38"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Gender *</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none bg-white font-medium"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Blood Group</label>
                  <select
                    value={bloodGroup}
                    onChange={(e) => setBloodGroup(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none bg-white font-medium"
                  >
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown'].map(bg => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Residential Address</label>
                  <input
                    type="text"
                    placeholder="e.g. Near Bariatu Hospital, Ranchi"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 2: REFERRING DOCTOR */}
            <div className="space-y-3 pt-3 border-t border-slate-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                <Stethoscope className="w-4 h-4 text-emerald-600" />
                <span>2. Referring Doctor</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Select Prescribing Doctor</label>
                  <select
                    value={selectedDoctorOption}
                    onChange={(e) => setSelectedDoctorOption(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none bg-white font-medium"
                  >
                    {DOCTOR_PRESETS.map((doc, idx) => (
                      <option key={idx} value={doc}>{doc}</option>
                    ))}
                  </select>
                </div>

                {selectedDoctorOption.startsWith('+ Enter') && (
                  <div className="animate-in fade-in">
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Type Doctor Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Dr. Ramesh Gupta (MD Medicine)"
                      value={customDoctorName}
                      onChange={(e) => setCustomDoctorName(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-emerald-400 bg-emerald-50/40 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none font-semibold text-emerald-950"
                      autoFocus
                    />
                  </div>
                )}
              </div>
            </div>

            {/* SECTION 3: TEST SELECTION */}
            <div className="space-y-3 pt-3 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                  <TestTubes className="w-4 h-4 text-brand-600" />
                  <span>3. Prescribed Tests ({selectedTestIds.length} Selected)</span>
                </h3>
                {selectedTestIds.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setSelectedTestIds([])}
                    className="text-[11px] text-rose-600 hover:underline font-semibold"
                  >
                    Clear All Tests
                  </button>
                )}
              </div>

              {/* Search & Categories */}
              <div className="flex flex-col sm:flex-row items-center gap-2">
                <div className="relative flex-1 w-full">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search test by name or code (CBC, LFT, Sugar, Lipid)..."
                    value={testSearch}
                    onChange={(e) => setTestSearch(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none"
                  />
                </div>

                <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto">
                  {['ALL', 'Hematology', 'Biochemistry', 'Immunology'].map(cat => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setTestCategory(cat)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold whitespace-nowrap transition-colors ${
                        testCategory === cat
                          ? 'bg-brand-700 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Test Selection Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto p-2 border border-slate-200 rounded-2xl bg-slate-50/60">
                {filteredTests.map((test) => {
                  const isChecked = selectedTestIds.includes(test.id);

                  return (
                    <div
                      key={test.id}
                      onClick={() => toggleTest(test.id)}
                      className={`p-2.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between text-xs select-none ${
                        isChecked
                          ? 'bg-brand-50 border-brand-500 shadow-xs'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={`w-4 h-4 rounded-md border flex items-center justify-center ${
                          isChecked ? 'bg-brand-600 border-brand-600 text-white' : 'border-slate-300 bg-white'
                        }`}>
                          {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 block leading-tight">{test.name}</span>
                          <span className="text-[10px] text-slate-400 font-mono">Code: {test.code}</span>
                        </div>
                      </div>

                      <span className="font-extrabold text-slate-900 font-mono shrink-0 ml-2">
                        ₹{test.price}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* SECTION 4: BILLING & PAYMENT */}
            {selectedTestIds.length > 0 && (
              <div className="space-y-3 pt-3 border-t border-slate-100 animate-in fade-in">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                  <Receipt className="w-4 h-4 text-emerald-600" />
                  <span>4. Billing & Instant Payment Collection</span>
                </h3>

                <div className="bg-emerald-50/50 border border-emerald-200 rounded-2xl p-4 space-y-3">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div>
                      <span className="text-slate-500 text-[10px] uppercase font-bold block">Subtotal</span>
                      <span className="text-sm font-bold text-slate-900">₹{subtotal}</span>
                    </div>

                    <div>
                      <span className="text-slate-500 text-[10px] uppercase font-bold block">Discount (₹)</span>
                      <input
                        type="number"
                        min="0"
                        max={subtotal}
                        value={discount}
                        onChange={(e) => setDiscount(e.target.value)}
                        className="w-24 px-2 py-1 text-xs border border-emerald-300 rounded-lg outline-none font-bold"
                        placeholder="0"
                      />
                    </div>

                    <div>
                      <span className="text-emerald-700 text-[10px] uppercase font-bold block">Net Payable</span>
                      <span className="text-base font-black text-emerald-950 font-mono">₹{netTotal}</span>
                    </div>

                    <div>
                      <span className="text-slate-500 text-[10px] uppercase font-bold block">Amount Paid Now (₹)</span>
                      <input
                        type="number"
                        min="0"
                        max={netTotal}
                        value={paidAmount}
                        onChange={(e) => setPaidAmount(e.target.value)}
                        placeholder={`Full ₹${netTotal}`}
                        className="w-full px-2 py-1 text-xs border border-emerald-400 rounded-lg outline-none font-bold text-slate-900"
                      />
                    </div>
                  </div>

                  {/* Due info & Payment mode */}
                  <div className="pt-2 border-t border-emerald-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-600 font-medium">Balance Due:</span>
                      {dueAmount > 0 ? (
                        <span className="font-black text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                          ₹{dueAmount} Due
                        </span>
                      ) : (
                        <span className="font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                          ✓ Fully Paid
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-slate-600 font-medium">Payment Mode:</span>
                      <select
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="px-2.5 py-1 border border-emerald-300 rounded-lg text-xs font-semibold bg-white outline-none"
                      >
                        <option value="Cash">Cash at Reception</option>
                        <option value="UPI / QR">UPI / BharatPe QR</option>
                        <option value="Card">Debit / Credit Card</option>
                        <option value="Net Banking">Net Banking</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Footer Buttons */}
            <div className="pt-4 border-t border-slate-200 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleResetAndClose}
                className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 text-xs font-bold text-white bg-brand-700 hover:bg-brand-800 rounded-xl shadow-md transition-all flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>
                  {selectedTestIds.length > 0
                    ? `Register Patient & Bill ₹${netTotal}`
                    : 'Register Patient Only'}
                </span>
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
