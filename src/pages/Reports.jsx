import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLab } from '../context/LabContext';
import { useAuth, ROLES } from '../context/AuthContext';
import {
  FileText,
  Search,
  PlusCircle,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Eye,
  Edit3,
  Download,
  QrCode,
  ShieldAlert,
  ShieldCheck,
  Filter
} from 'lucide-react';

export default function Reports() {
  const { reports, patients, tests, createReport } = useLab();
  const { user, canApproveReports, canEnterResults } = useAuth();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // New Report Generation Modal
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [selectedTestId, setSelectedTestId] = useState('');

  const filteredReports = reports.filter(r => {
    const matchesSearch =
      r.reportNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.testName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.referringDoctor?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateReport = (e) => {
    e.preventDefault();
    const patient = patients.find(p => p.id === selectedPatientId);
    const test = tests.find(t => t.id === selectedTestId);
    if (!patient || !test) return;

    // Build initial results array from test parameters
    const initialResults = (test.parameters || []).map(param => {
      const isFemale = patient.gender === 'Female';
      const refMin = isFemale ? (param.minFemale ?? param.minMale) : param.minMale;
      const refMax = isFemale ? (param.maxFemale ?? param.maxMale) : param.maxMale;
      return {
        name: param.name,
        value: param.defaultVal || '',
        unit: param.unit,
        refRange: refMin != null && refMax != null ? `${refMin} - ${refMax}` : 'Reference Range',
        min: refMin,
        max: refMax,
        flag: 'NORMAL'
      };
    });

    const newRep = createReport({
      patientId: patient.id,
      patientName: patient.name,
      patientAge: patient.age,
      patientGender: patient.gender,
      patientPhone: patient.phone,
      referringDoctor: patient.referringDoctor || 'Self / Walk-in',
      testId: test.id,
      testName: test.name,
      sampleType: test.sampleType,
      results: initialResults,
      clinicalImpression: 'Specimen examined in automated clinical analyzer. Correlate clinically.',
      status: 'draft'
    });

    setIsCreateModalOpen(false);
    setSelectedPatientId('');
    setSelectedTestId('');
  };

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <FileText className="w-7 h-7 text-brand-600" />
            <span>Laboratory Report Management</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Raw test result entry, automatic abnormal indicators, authorized pathologist verification, and hospital-grade PDF generation.
          </p>
        </div>

        {canEnterResults && (
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow-md transition-all self-start sm:self-auto"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Initiate Test Report</span>
          </button>
        )}
      </div>

      {/* Pathologist Security Notice */}
      <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-blue-50 border border-emerald-200/80 rounded-2xl p-4 flex items-start gap-3.5">
        <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div className="text-xs space-y-0.5">
          <p className="font-bold text-slate-900">
            NABL & Medical Council Compliance Enforced:
          </p>
          <p className="text-slate-600 leading-relaxed">
            Technicians can only enter analyzer values and save drafts. Only an Authorized Pathologist (MD) or Super Admin can sign off and approve final diagnostic reports for release.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search report number (REP-...), patient, or test..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
          />
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          {[
            { id: 'ALL', label: 'All Reports' },
            { id: 'draft', label: 'Drafts' },
            { id: 'under_review', label: 'Under Review' },
            { id: 'approved', label: 'Pathologist Approved' }
          ].map(st => (
            <button
              key={st.id}
              onClick={() => setStatusFilter(st.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                statusFilter === st.id
                  ? 'bg-brand-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* Reports Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3 px-4">Report Number</th>
                <th className="py-3 px-4">Patient Name & Details</th>
                <th className="py-3 px-4">Diagnostic Test</th>
                <th className="py-3 px-4">Status & Flags</th>
                <th className="py-3 px-4">Verification</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredReports.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-400">
                    No reports match the filter.
                  </td>
                </tr>
              ) : (
                filteredReports.map((report) => (
                  <tr key={report.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-brand-700">
                      {report.reportNumber}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-800">{report.patientName}</div>
                      <div className="text-[11px] text-slate-400">
                        {report.patientAge} Yrs • {report.patientGender} • Dr. {report.referringDoctor || 'Self'}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-800">{report.testName}</div>
                      <div className="text-[10px] text-slate-400">{report.sampleType}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {report.status === 'approved' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            <CheckCircle2 className="w-3 h-3" />
                            Approved
                          </span>
                        ) : report.status === 'under_review' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                            <Clock className="w-3 h-3" />
                            Awaiting Pathologist
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                            Draft (Raw)
                          </span>
                        )}

                        {report.isAbnormal && (
                          <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-700">
                            <AlertTriangle className="w-3 h-3" /> Abnormal
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-[11px]">
                      {report.status === 'approved' ? (
                        <div>
                          <div className="font-semibold text-slate-800">{report.pathologistName}</div>
                          <div className="text-[10px] text-slate-400">
                            {new Date(report.pathologistApprovedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">Pending MD Sign-off</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* If not approved or user has edit rights, edit/enter values */}
                        <Link
                          to={`/reports/edit/${report.id}`}
                          className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center gap-1"
                          title="Enter Analyzer Values"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>{report.status === 'approved' ? 'Review' : 'Enter Values'}</span>
                        </Link>

                        {/* View Hospital Report */}
                        <Link
                          to={`/reports/${report.id}`}
                          className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-brand-600 hover:bg-brand-700 text-white flex items-center gap-1 shadow-xs"
                          title="View / Print Final Hospital Report"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Report</span>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Initiate New Test Report Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden">
            <div className="bg-brand-700 px-6 py-4 text-white flex items-center justify-between">
              <h3 className="font-bold text-sm">Initiate Test Report</h3>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-white hover:opacity-75">✕</button>
            </div>
            <form onSubmit={handleCreateReport} className="p-6 space-y-4 text-xs">
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
                <label className="block font-semibold text-slate-700 mb-1">Select Test / Panel *</label>
                <select
                  required
                  value={selectedTestId}
                  onChange={(e) => setSelectedTestId(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl bg-white"
                >
                  <option value="">-- Choose Test Catalog --</option>
                  {tests.map(t => (
                    <option key={t.id} value={t.id}>{t.name} ({t.code})</option>
                  ))}
                </select>
              </div>

              <div className="p-3 bg-brand-50 border border-brand-200 rounded-xl text-slate-700">
                <p className="font-bold text-brand-900">Next Step:</p>
                <p className="text-[11px] text-brand-700 mt-0.5">
                  After initiating, the technician will enter observed parameters. Final medical approval requires Pathologist sign-off.
                </p>
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
                  className="px-4 py-2 bg-brand-600 text-white font-semibold rounded-xl"
                >
                  Create Report Draft
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
