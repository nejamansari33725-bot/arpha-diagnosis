import React, { useState } from 'react';
import { useLab } from '../context/LabContext';
import { useAuth, ROLES } from '../context/AuthContext';
import {
  TestTubes,
  Search,
  PlusCircle,
  Edit2,
  Check,
  ChevronDown,
  ChevronUp,
  Tag,
  Clock,
  FlaskConical,
  Filter,
  IndianRupee,
  Layers
} from 'lucide-react';

export default function TestsCatalog() {
  const { tests, addTest, updateTest } = useLab();
  const { user } = useAuth();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [expandedTestId, setExpandedTestId] = useState(null);
  
  // Quick price editor
  const [editingPriceId, setEditingPriceId] = useState(null);
  const [newPrice, setNewPrice] = useState('');

  // Add Test Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTestData, setNewTestData] = useState({
    code: '',
    name: '',
    category: 'Biochemistry',
    department: 'Clinical Biochemistry',
    sampleType: 'Plain Serum (Red Top)',
    vialColor: 'Red',
    price: '',
    costPrice: '',
    tatHours: 6,
    description: '',
    parameters: [
      { name: 'Primary Parameter', unit: 'mg/dL', minMale: 10, maxMale: 100, minFemale: 10, maxFemale: 90 }
    ]
  });

  const canManageTests = user?.role === ROLES.SUPER_ADMIN || user?.role === ROLES.LAB_ADMIN;

  const departments = ['ALL', 'Hematology', 'Biochemistry', 'Immunology', 'Clinical Pathology'];

  const filteredTests = tests.filter(test => {
    const matchesSearch =
      test.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      test.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      test.category?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = selectedDept === 'ALL' || test.category === selectedDept;
    return matchesSearch && matchesDept;
  });

  const handlePriceSave = (id) => {
    if (!newPrice || isNaN(newPrice)) return;
    updateTest(id, { price: Number(newPrice) });
    setEditingPriceId(null);
    setNewPrice('');
  };

  const handleCreateTest = (e) => {
    e.preventDefault();
    if (!newTestData.name || !newTestData.code || !newTestData.price) return;
    addTest({
      ...newTestData,
      price: Number(newTestData.price),
      costPrice: Number(newTestData.costPrice || 0),
      tatHours: Number(newTestData.tatHours || 4)
    });
    setIsAddModalOpen(false);
    setNewTestData({
      code: '',
      name: '',
      category: 'Biochemistry',
      department: 'Clinical Biochemistry',
      sampleType: 'Plain Serum (Red Top)',
      vialColor: 'Red',
      price: '',
      costPrice: '',
      tatHours: 6,
      description: '',
      parameters: [{ name: 'Primary Parameter', unit: 'mg/dL', minMale: 10, maxMale: 100, minFemale: 10, maxFemale: 90 }]
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <TestTubes className="w-7 h-7 text-brand-600" />
            <span>Test Catalog & Reference Intervals</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Clinical test parameters, biological reference ranges (Male / Female / Child), vial types, and pricing configuration.
          </p>
        </div>

        {canManageTests && (
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow-md transition-all self-start sm:self-auto"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Custom Test</span>
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by test name (CBC, LFT, Lipid, HbA1c, Thyroid)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
          />
        </div>

        {/* Department Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          {departments.map(dept => (
            <button
              key={dept}
              onClick={() => setSelectedDept(dept)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedDept === dept
                  ? 'bg-brand-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {dept}
            </button>
          ))}
        </div>
      </div>

      {/* Tests Grid */}
      <div className="grid grid-cols-1 gap-4">
        {filteredTests.map((test) => {
          const isExpanded = expandedTestId === test.id;
          const isEditingPrice = editingPriceId === test.id;

          return (
            <div
              key={test.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:border-brand-300 transition-all overflow-hidden"
            >
              {/* Test Header Row */}
              <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-brand-50 border border-brand-200 text-brand-700 flex flex-col items-center justify-center shrink-0">
                    <span className="font-mono font-black text-xs leading-none">{test.code}</span>
                    <span className="text-[9px] uppercase font-bold text-slate-400 mt-0.5">Test</span>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-bold text-slate-900">{test.name}</h3>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                        {test.category}
                      </span>
                      <span className="text-[10px] font-semibold text-slate-500">
                        TAT: {test.tatHours}h
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 max-w-2xl line-clamp-1">{test.description}</p>
                    <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-2">
                      <span className="flex items-center gap-1">
                        <FlaskConical className="w-3.5 h-3.5 text-brand-600" />
                        {test.sampleType}
                      </span>
                      <span>•</span>
                      <span>{test.parameters?.length || 0} Clinical Parameters</span>
                    </div>
                  </div>
                </div>

                {/* Right: Pricing & Expand */}
                <div className="flex items-center gap-4 self-end md:self-center">
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Patient Price</span>
                    {isEditingPrice ? (
                      <div className="flex items-center gap-1 mt-1">
                        <span className="text-xs text-slate-500">₹</span>
                        <input
                          type="number"
                          value={newPrice}
                          onChange={(e) => setNewPrice(e.target.value)}
                          className="w-20 px-2 py-1 text-xs border border-brand-400 rounded-lg outline-none font-bold"
                          autoFocus
                        />
                        <button
                          onClick={() => handlePriceSave(test.id)}
                          className="p-1 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 justify-end">
                        <span className="text-lg font-black text-slate-900">₹{test.price}</span>
                        {canManageTests && (
                          <button
                            onClick={() => {
                              setEditingPriceId(test.id);
                              setNewPrice(test.price);
                            }}
                            className="p-1 text-slate-400 hover:text-brand-600 rounded"
                            title="Edit test price"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => setExpandedTestId(isExpanded ? null : test.id)}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                    title={isExpanded ? "Collapse parameters" : "View parameters"}
                  >
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Collapsible Parameter Details */}
              {isExpanded && (
                <div className="border-t border-slate-100 bg-slate-50/70 p-5 animate-in fade-in">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      Reference Intervals & Biological Thresholds
                    </h4>
                    <span className="text-[11px] text-slate-500 font-mono">
                      Vial: {test.vialColor || 'Standard'}
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-slate-200 text-slate-500 font-semibold text-[11px]">
                          <th className="py-2 px-3">Parameter Name</th>
                          <th className="py-2 px-3">Unit</th>
                          <th className="py-2 px-3">Male Range</th>
                          <th className="py-2 px-3">Female Range</th>
                          <th className="py-2 px-3">Child Range</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200/60 bg-white">
                        {test.parameters?.map((param, pIdx) => (
                          <tr key={pIdx} className="hover:bg-slate-50">
                            <td className="py-2 px-3 font-semibold text-slate-800">{param.name}</td>
                            <td className="py-2 px-3 text-slate-500 font-mono">{param.unit}</td>
                            <td className="py-2 px-3 text-slate-700">
                              {param.minMale != null && param.maxMale != null
                                ? `${param.minMale} - ${param.maxMale}`
                                : 'Clinical Correlation'}
                            </td>
                            <td className="py-2 px-3 text-slate-700">
                              {param.minFemale != null && param.maxFemale != null
                                ? `${param.minFemale} - ${param.maxFemale}`
                                : 'Same as Male'}
                            </td>
                            <td className="py-2 px-3 text-slate-700">
                              {param.minChild != null && param.maxChild != null
                                ? `${param.minChild} - ${param.maxChild}`
                                : 'Age Dependent'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Custom Test Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden">
            <div className="bg-brand-700 px-6 py-4 text-white flex items-center justify-between">
              <h3 className="font-bold text-sm">Add New Custom Laboratory Test</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-white hover:opacity-75">✕</button>
            </div>
            <form onSubmit={handleCreateTest} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Test Code (e.g. CRP, D-DIMER)</label>
                  <input
                    type="text"
                    required
                    value={newTestData.code}
                    onChange={(e) => setNewTestData({ ...newTestData, code: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 border rounded-xl uppercase font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Department</label>
                  <select
                    value={newTestData.category}
                    onChange={(e) => setNewTestData({ ...newTestData, category: e.target.value, department: `Clinical ${e.target.value}` })}
                    className="w-full px-3 py-2 border rounded-xl bg-white"
                  >
                    <option value="Hematology">Hematology</option>
                    <option value="Biochemistry">Biochemistry</option>
                    <option value="Immunology">Immunology</option>
                    <option value="Clinical Pathology">Clinical Pathology</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Test Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. C-Reactive Protein (Quantitative CRP)"
                  value={newTestData.name}
                  onChange={(e) => setNewTestData({ ...newTestData, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={newTestData.price}
                    onChange={(e) => setNewTestData({ ...newTestData, price: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl font-bold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Cost Price (₹)</label>
                  <input
                    type="number"
                    value={newTestData.costPrice}
                    onChange={(e) => setNewTestData({ ...newTestData, costPrice: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">TAT (Hours)</label>
                  <input
                    type="number"
                    value={newTestData.tatHours}
                    onChange={(e) => setNewTestData({ ...newTestData, tatHours: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Specimen / Sample Type</label>
                <input
                  type="text"
                  value={newTestData.sampleType}
                  onChange={(e) => setNewTestData({ ...newTestData, sampleType: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl"
                />
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
                  className="px-4 py-2 bg-brand-600 text-white font-semibold rounded-xl"
                >
                  Add Test to Catalog
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
