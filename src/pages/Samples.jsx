import React, { useState } from 'react';
import { useLab } from '../context/LabContext';
import { useAuth, ROLES } from '../context/AuthContext';
import {
  Droplets,
  Search,
  PlusCircle,
  Barcode,
  Printer,
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  Filter,
  Check,
  FlaskConical,
  User
} from 'lucide-react';
import BarcodeRenderer from '../components/BarcodeRenderer';

export default function Samples() {
  const { samples, patients, tests, createSample, updateSampleStatus } = useLab();
  const { user } = useAuth();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isCollectModalOpen, setIsCollectModalOpen] = useState(false);
  const [barcodeModalSample, setBarcodeModalSample] = useState(null);

  // New Sample Collection Form
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [selectedTestId, setSelectedTestId] = useState('');
  const [vialColor, setVialColor] = useState('Lavender');
  const [collectorName, setCollectorName] = useState(user?.name || 'Rahul Kumar (DMLT)');

  const filteredSamples = samples.filter(s => {
    const matchesSearch =
      s.sampleId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.barcode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.sampleType?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'collected':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-blue-100 text-blue-800">Collected</span>;
      case 'processing':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-100 text-amber-800">In Analyzer</span>;
      case 'completed':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">Completed</span>;
      case 'rejected':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-rose-100 text-rose-800">Rejected (Hemolyzed)</span>;
      default:
        return null;
    }
  };

  const getVialBg = (color) => {
    switch (color?.toLowerCase()) {
      case 'lavender':
      case 'purple':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'red':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      case 'grey':
      case 'gray':
        return 'bg-slate-200 text-slate-800 border-slate-400';
      case 'blue':
        return 'bg-cyan-100 text-cyan-800 border-cyan-300';
      case 'yellow':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-300';
    }
  };

  const handleCollectSubmit = (e) => {
    e.preventDefault();
    const patient = patients.find(p => p.id === selectedPatientId);
    const test = tests.find(t => t.id === selectedTestId);
    if (!patient || !test) return;

    createSample({
      patientId: patient.id,
      patientName: patient.name,
      sampleType: test.sampleType,
      vialColor: test.vialColor || vialColor,
      testNames: [test.name],
      collectorName
    });

    setIsCollectModalOpen(false);
    setSelectedPatientId('');
    setSelectedTestId('');
  };

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <Droplets className="w-7 h-7 text-blue-600" />
            <span>Sample Collection & Barcoding</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Specimen intake register, vial labeling, barcode scanning, and analyzer processing status tracking.
          </p>
        </div>

        <button
          onClick={() => setIsCollectModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md transition-all self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Collect Specimen</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by Sample ID, Barcode, or Patient Name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          {['ALL', 'collected', 'processing', 'completed', 'rejected'].map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize whitespace-nowrap transition-all ${
                statusFilter === st
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st === 'ALL' ? 'All Samples' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Samples Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3 px-4">Sample ID & Barcode</th>
                <th className="py-3 px-4">Patient Name</th>
                <th className="py-3 px-4">Specimen Type & Vial</th>
                <th className="py-3 px-4">Associated Tests</th>
                <th className="py-3 px-4">Collected Time</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSamples.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-400">
                    No specimen records match the filter.
                  </td>
                </tr>
              ) : (
                filteredSamples.map((sample) => (
                  <tr key={sample.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono">
                      <div className="font-bold text-slate-900">{sample.sampleId}</div>
                      <button
                        onClick={() => setBarcodeModalSample(sample)}
                        className="text-[11px] text-blue-600 font-bold hover:underline flex items-center gap-1 mt-0.5"
                      >
                        <Barcode className="w-3.5 h-3.5" />
                        <span>{sample.barcode}</span>
                      </button>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-800">{sample.patientName}</div>
                      <div className="text-[10px] text-slate-400">ID: {sample.patientId}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-700">{sample.sampleType}</div>
                      <span className={`inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold border ${getVialBg(sample.vialColor)}`}>
                        {sample.vialColor || 'Standard'} Top
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="text-slate-800 font-medium">
                        {sample.testNames?.join(', ')}
                      </div>
                      <div className="text-[10px] text-slate-400">Phlebotomist: {sample.collectorName}</div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                      {new Date(sample.collectedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}, {' '}
                      {new Date(sample.collectedAt).toLocaleDateString()}
                    </td>

                    <td className="py-3.5 px-4">
                      {getStatusBadge(sample.status)}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {sample.status === 'collected' && (
                          <button
                            onClick={() => updateSampleStatus(sample.id, 'processing')}
                            className="px-2.5 py-1 bg-amber-50 text-amber-700 hover:bg-amber-100 rounded-lg text-[11px] font-bold border border-amber-200"
                            title="Load into Analyzer"
                          >
                            Load to Analyzer
                          </button>
                        )}
                        {sample.status === 'processing' && (
                          <button
                            onClick={() => updateSampleStatus(sample.id, 'completed')}
                            className="px-2.5 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg text-[11px] font-bold border border-emerald-200"
                            title="Mark Completed"
                          >
                            Mark Done
                          </button>
                        )}
                        <button
                          onClick={() => setBarcodeModalSample(sample)}
                          className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg"
                          title="Print Barcode Tube Label"
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

      {/* Barcode Print / View Modal */}
      {barcodeModalSample && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-sm overflow-hidden text-center p-6 space-y-4">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Vial Barcode Tube Label
            </div>
            
            {/* Printable Sticker Box */}
            <div className="p-4 bg-white border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center">
              <span className="text-[11px] font-black tracking-wide text-brand-900">
                ARPHA DIAGNOSIS
              </span>
              <span className="text-xs font-bold text-slate-800 mt-0.5">
                {barcodeModalSample.patientName}
              </span>
              <div className="my-2">
                <BarcodeRenderer value={barcodeModalSample.barcode} height={45} width={1.6} fontSize={11} />
              </div>
              <div className="text-[10px] text-slate-600 font-mono">
                {barcodeModalSample.sampleId} • {barcodeModalSample.sampleType}
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setBarcodeModalSample(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 text-xs font-semibold bg-brand-600 text-white rounded-xl hover:bg-brand-700 flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Sticker</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Collect Specimen Modal */}
      {isCollectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden">
            <div className="bg-blue-700 px-6 py-4 text-white flex items-center justify-between">
              <h3 className="font-bold text-sm">Specimen Collection & Labeling</h3>
              <button onClick={() => setIsCollectModalOpen(false)} className="text-white hover:opacity-75">✕</button>
            </div>
            <form onSubmit={handleCollectSubmit} className="p-6 space-y-4 text-xs">
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

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Select Investigation / Test *</label>
                <select
                  required
                  value={selectedTestId}
                  onChange={(e) => {
                    setSelectedTestId(e.target.value);
                    const t = tests.find(x => x.id === e.target.value);
                    if (t) setVialColor(t.vialColor || 'Lavender');
                  }}
                  className="w-full px-3 py-2 border rounded-xl bg-white"
                >
                  <option value="">-- Choose Test --</option>
                  {tests.map(t => (
                    <option key={t.id} value={t.id}>{t.name} ({t.sampleType})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Vial Color Cap</label>
                <select
                  value={vialColor}
                  onChange={(e) => setVialColor(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl bg-white"
                >
                  <option value="Lavender">Lavender (EDTA Whole Blood)</option>
                  <option value="Red">Red (Plain Clot Activator Serum)</option>
                  <option value="Yellow">Yellow (SST Gel Separator)</option>
                  <option value="Grey">Grey (Sodium Fluoride Glucose)</option>
                  <option value="Blue">Blue (Sodium Citrate Coagulation)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Phlebotomist / Technician Name</label>
                <input
                  type="text"
                  value={collectorName}
                  onChange={(e) => setCollectorName(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div className="pt-3 border-t flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCollectModalOpen(false)}
                  className="px-4 py-2 border rounded-xl text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-xl"
                >
                  Collect & Generate Barcode
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
