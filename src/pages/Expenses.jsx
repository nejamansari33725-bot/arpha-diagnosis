import React, { useState } from 'react';
import { useLab } from '../context/LabContext';
import { useAuth, ROLES } from '../context/AuthContext';
import {
  IndianRupee,
  Search,
  PlusCircle,
  Filter,
  Calendar,
  CreditCard,
  Building,
  TrendingDown,
  PieChart
} from 'lucide-react';

export default function Expenses() {
  const { expenses, addExpense } = useLab();
  const { user } = useAuth();

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [newExpenseData, setNewExpenseData] = useState({
    title: '',
    category: 'Reagents & Kits',
    amount: '',
    paidTo: '',
    mode: 'UPI'
  });

  const categories = [
    'ALL',
    'Reagents & Kits',
    'Equipment Maintenance',
    'Rent & Utilities',
    'Staff & Overtime',
    'Miscellaneous'
  ];

  const filteredExpenses = expenses.filter(exp => {
    const matchesSearch =
      exp.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exp.paidTo?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = categoryFilter === 'ALL' || exp.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  const totalExpenseSum = expenses.reduce((acc, exp) => acc + Number(exp.amount || 0), 0);

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!newExpenseData.title || !newExpenseData.amount) return;
    addExpense({
      ...newExpenseData,
      amount: Number(newExpenseData.amount)
    });
    setIsAddModalOpen(false);
    setNewExpenseData({
      title: '',
      category: 'Reagents & Kits',
      amount: '',
      paidTo: '',
      mode: 'UPI'
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <IndianRupee className="w-7 h-7 text-rose-600" />
            <span>Laboratory Operational Expenses</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Reagents purchasing, equipment calibration & maintenance, biomedical waste fees, and clinic utilities.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs shadow-md transition-all self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Record New Expense</span>
        </button>
      </div>

      {/* Summary KPI Banner */}
      <div className="bg-gradient-to-r from-rose-900 to-slate-900 text-white rounded-2xl p-6 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-rose-200 uppercase tracking-wider block">Total Recorded Lab Expenses</span>
          <div className="text-3xl font-black mt-1">₹{totalExpenseSum.toLocaleString('en-IN')}</div>
          <span className="text-xs text-rose-200 mt-1 block">Account period: November 2026</span>
        </div>
        <div className="bg-white/10 px-4 py-3 rounded-xl border border-white/10 text-xs space-y-1">
          <p className="font-semibold text-rose-100">Top Cost Factor: Reagents & Diagnostic Kits</p>
          <p className="text-[11px] text-slate-300">Monitored for NABL expense-to-test cost tracking.</p>
        </div>
      </div>

      {/* Search & Categories */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by expense title or vendor paid to..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                categoryFilter === cat
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Expenses Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3 px-4">Expense Title</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Paid To (Vendor)</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Payment Mode</th>
                <th className="py-3 px-4 text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredExpenses.map((exp) => (
                <tr key={exp.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    {exp.title}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 font-medium">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {exp.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-700 font-medium">
                    {exp.paidTo || 'Local Vendor'}
                  </td>
                  <td className="py-3.5 px-4 font-black text-rose-700 font-mono text-sm">
                    ₹{exp.amount?.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3.5 px-4 text-slate-500">
                    {exp.mode}
                  </td>
                  <td className="py-3.5 px-4 text-slate-500 text-right font-mono">
                    {exp.date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Expense Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden">
            <div className="bg-rose-700 px-6 py-4 text-white flex items-center justify-between">
              <h3 className="font-bold text-sm">Record Laboratory Expense</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-white hover:opacity-75">✕</button>
            </div>
            <form onSubmit={handleAddSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Expense Description *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sysmex Lysing Reagent Pack (2x5L)"
                  value={newExpenseData.title}
                  onChange={(e) => setNewExpenseData({ ...newExpenseData, title: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={newExpenseData.category}
                    onChange={(e) => setNewExpenseData({ ...newExpenseData, category: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl bg-white"
                  >
                    <option value="Reagents & Kits">Reagents & Kits</option>
                    <option value="Equipment Maintenance">Equipment Maintenance</option>
                    <option value="Rent & Utilities">Rent & Utilities</option>
                    <option value="Staff & Overtime">Staff & Overtime</option>
                    <option value="Miscellaneous">Miscellaneous</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Amount (₹) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="e.g. 5400"
                    value={newExpenseData.amount}
                    onChange={(e) => setNewExpenseData({ ...newExpenseData, amount: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Paid To (Vendor / Agency)</label>
                  <input
                    type="text"
                    placeholder="e.g. Erba Diagnostics"
                    value={newExpenseData.paidTo}
                    onChange={(e) => setNewExpenseData({ ...newExpenseData, paidTo: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Payment Mode</label>
                  <select
                    value={newExpenseData.mode}
                    onChange={(e) => setNewExpenseData({ ...newExpenseData, mode: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl bg-white"
                  >
                    <option value="UPI">UPI</option>
                    <option value="Cash">Cash</option>
                    <option value="Net Banking">Net Banking</option>
                    <option value="Cheque">Cheque</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border rounded-xl text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-600 text-white font-semibold rounded-xl"
                >
                  Record Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
