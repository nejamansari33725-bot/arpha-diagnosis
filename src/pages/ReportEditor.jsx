import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useLab } from '../context/LabContext';
import { useAuth, ROLES } from '../context/AuthContext';
import {
  ArrowLeft,
  Save,
  CheckCircle2,
  AlertTriangle,
  FileCheck2,
  ShieldCheck,
  ShieldAlert,
  User,
  Stethoscope,
  Info,
  ExternalLink
} from 'lucide-react';

export default function ReportEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { reports, updateReportResults, approveReport } = useLab();
  const { user, canApproveReports } = useAuth();

  const report = reports.find(r => r.id === id);

  const [results, setResults] = useState([]);
  const [clinicalImpression, setClinicalImpression] = useState('');
  const [pathologistNote, setPathologistNote] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (report) {
      setResults(report.results || []);
      setClinicalImpression(report.clinicalImpression || '');
      setPathologistNote(report.pathologistNote || '');
    }
  }, [report]);

  if (!report) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
        <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto" />
        <h2 className="text-lg font-bold text-slate-800">Report Not Found</h2>
        <Link to="/reports" className="inline-flex items-center gap-1.5 text-xs text-brand-600 font-semibold hover:underline">
          <ArrowLeft className="w-4 h-4" /> Back to Laboratory Reports
        </Link>
      </div>
    );
  }

  // Handle single result value change and automatic high/low flag detection
  const handleValueChange = (index, value) => {
    const updated = [...results];
    const item = { ...updated[index] };
    item.value = value;

    const numVal = parseFloat(value);
    if (!isNaN(numVal)) {
      if (item.max != null && numVal > item.max) {
        item.flag = 'HIGH';
      } else if (item.min != null && numVal < item.min) {
        item.flag = 'LOW';
      } else {
        item.flag = 'NORMAL';
      }
    } else {
      item.flag = 'NORMAL';
    }

    updated[index] = item;
    setResults(updated);
  };

  const handleSaveDraft = () => {
    updateReportResults(report.id, results, clinicalImpression, 'draft');
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleSubmitForReview = () => {
    updateReportResults(report.id, results, clinicalImpression, 'under_review');
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      navigate('/reports');
    }, 1000);
  };

  const handlePathologistApproval = () => {
    if (!canApproveReports) return;
    // First save latest results
    updateReportResults(report.id, results, clinicalImpression, 'approved');
    // Final signoff
    approveReport(report.id, pathologistNote);
    navigate(`/reports/${report.id}`);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to="/reports"
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <span>Investigation Entry: {report.testName}</span>
            </h1>
            <p className="text-xs text-slate-500 font-mono">
              Report No: {report.reportNumber} • Patient: {report.patientName} ({report.patientAge}y/{report.patientGender})
            </p>
          </div>
        </div>

        <Link
          to={`/reports/${report.id}`}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-xl"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>Preview Hospital PDF</span>
        </Link>
      </div>

      {saveSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Results saved successfully!</span>
        </div>
      )}

      {/* Patient & Sample Demographics Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
        <div>
          <span className="text-slate-400 block text-[10px] uppercase font-bold">Patient Name</span>
          <span className="font-bold text-slate-800">{report.patientName}</span>
        </div>
        <div>
          <span className="text-slate-400 block text-[10px] uppercase font-bold">Age / Gender</span>
          <span className="font-semibold text-slate-800">{report.patientAge} Years / {report.patientGender}</span>
        </div>
        <div>
          <span className="text-slate-400 block text-[10px] uppercase font-bold">Referring Doctor</span>
          <span className="font-semibold text-slate-800">Dr. {report.referringDoctor || 'Walk-in'}</span>
        </div>
        <div>
          <span className="text-slate-400 block text-[10px] uppercase font-bold">Current Status</span>
          <span className={`inline-block mt-0.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
            report.status === 'approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
          }`}>
            {report.status.replace('_', ' ')}
          </span>
        </div>
      </div>

      {/* Results Parameter Entry Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Observed Parameters vs Biological Reference Intervals
          </h2>
          <span className="text-[11px] text-slate-500">
            Auto-checks High/Low biological flags
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-semibold bg-slate-50/50 text-[11px]">
                <th className="py-2.5 px-4">Parameter Name</th>
                <th className="py-2.5 px-4 w-44">Observed Value *</th>
                <th className="py-2.5 px-4">Unit</th>
                <th className="py-2.5 px-4">Biological Reference Range</th>
                <th className="py-2.5 px-4">Flag / Alert</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {results.map((param, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80">
                  <td className="py-3 px-4 font-semibold text-slate-800">
                    {param.name}
                  </td>
                  <td className="py-3 px-4">
                    <input
                      type="text"
                      value={param.value}
                      onChange={(e) => handleValueChange(idx, e.target.value)}
                      placeholder="Enter value"
                      className={`w-full px-3 py-1.5 border rounded-lg text-xs font-bold outline-none transition-colors ${
                        param.flag === 'HIGH'
                          ? 'border-rose-400 bg-rose-50 text-rose-800 focus:ring-2 focus:ring-rose-500'
                          : param.flag === 'LOW'
                          ? 'border-amber-400 bg-amber-50 text-amber-800 focus:ring-2 focus:ring-amber-500'
                          : 'border-slate-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-500'
                      }`}
                    />
                  </td>
                  <td className="py-3 px-4 text-slate-500 font-mono">
                    {param.unit}
                  </td>
                  <td className="py-3 px-4 text-slate-600 font-mono">
                    {param.refRange}
                  </td>
                  <td className="py-3 px-4">
                    {param.flag === 'HIGH' ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                        HIGH ↑
                      </span>
                    ) : param.flag === 'LOW' ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                        LOW ↓
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        NORMAL
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Clinical Impression & Notes */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-800 mb-1.5">
            Clinical Impression / Pathological Interpretation
          </label>
          <textarea
            rows="3"
            value={clinicalImpression}
            onChange={(e) => setClinicalImpression(e.target.value)}
            placeholder="e.g. Findings indicate mild microcytic hypochromic anemia. Recommend iron profile."
            className="w-full p-3 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none"
          ></textarea>
        </div>

        {/* Pathologist Final Note (only visible to Pathologist / Admin) */}
        {canApproveReports && (
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5 flex items-center gap-1.5 text-emerald-800">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Pathologist Final Verification Sign-off Remarks</span>
            </label>
            <input
              type="text"
              value={pathologistNote}
              onChange={(e) => setPathologistNote(e.target.value)}
              placeholder="e.g. Verified and approved. Findings correlated with clinical history."
              className="w-full px-3 py-2 text-xs border border-emerald-300 rounded-xl bg-emerald-50/30 focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>
        )}
      </div>

      {/* Action Footer Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Left: Role explanation badge */}
        <div className="flex items-center gap-2 text-xs">
          {canApproveReports ? (
            <span className="inline-flex items-center gap-1.5 text-emerald-700 font-bold bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Authorized Pathologist (MD) Sign-off Authority Active
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-amber-800 font-medium bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              Technician Mode: Can draft & submit. Final approval reserved for Pathologist.
            </span>
          )}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleSaveDraft}
            className="px-4 py-2.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center gap-1.5"
          >
            <Save className="w-4 h-4" />
            <span>Save Draft</span>
          </button>

          <button
            type="button"
            onClick={handleSubmitForReview}
            className="px-4 py-2.5 text-xs font-semibold text-amber-900 bg-amber-100 hover:bg-amber-200 rounded-xl transition-colors flex items-center gap-1.5"
          >
            <FileCheck2 className="w-4 h-4" />
            <span>Submit to Pathologist</span>
          </button>

          {/* STRICT PATHOLOGIST APPROVAL BUTTON */}
          {canApproveReports ? (
            <button
              type="button"
              onClick={handlePathologistApproval}
              className="px-5 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md transition-all flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Verify & Officially Approve</span>
            </button>
          ) : (
            <button
              type="button"
              disabled
              className="px-5 py-2.5 text-xs font-semibold text-slate-400 bg-slate-100 rounded-xl cursor-not-allowed flex items-center gap-2"
              title="Only Authorized Pathologist (MD) or Super Admin can sign off"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Approve (MD Only)</span>
            </button>
          )}
        </div>

      </div>

    </div>
  );
}
