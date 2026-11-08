import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLab } from '../context/LabContext';
import {
  FileText,
  Search,
  Download,
  Phone,
  User,
  ShieldCheck,
  CheckCircle2,
  Clock,
  QrCode,
  Droplet,
  Receipt,
  Activity,
  ArrowRight
} from 'lucide-react';

export default function PatientPortal() {
  const { patients, reports, samples, invoices, settings } = useLab();
  const [searchInput, setSearchInput] = useState('');
  const [searchedPatient, setSearchedPatient] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchInput.trim()) return;

    const query = searchInput.trim().toLowerCase();
    const found = patients.find(p => 
      p.patientId?.toLowerCase() === query || 
      p.phone?.includes(query) ||
      p.name?.toLowerCase().includes(query)
    );

    setSearchedPatient(found || null);
    setHasSearched(true);
  };

  const patientReports = searchedPatient 
    ? reports.filter(r => r.patientId === searchedPatient.id || r.patientName === searchedPatient.name)
    : [];

  const patientSamples = searchedPatient
    ? samples.filter(s => s.patientId === searchedPatient.id || s.patientName === searchedPatient.name)
    : [];

  const patientInvoices = searchedPatient
    ? invoices.filter(inv => inv.patientId === searchedPatient.id || inv.patientName === searchedPatient.name)
    : [];

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      
      {/* Hero Search Card */}
      <div className="bg-gradient-to-r from-brand-900 via-brand-800 to-cyan-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-sm mx-auto flex items-center justify-center">
          <Activity className="w-8 h-8 text-cyan-300" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
          Patient Diagnostic Self-Service Portal
        </h1>
        <p className="text-xs sm:text-sm text-cyan-100 max-w-xl mx-auto leading-relaxed">
          Access your verified pathology laboratory reports, track specimen analysis status, and download authentic hospital-grade PDF reports anytime.
        </p>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="max-w-md mx-auto pt-2 flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            required
            placeholder="Enter Mobile Number or Patient ID (e.g. 9934125870)"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="flex-1 px-4 py-3 text-xs sm:text-sm rounded-xl text-slate-900 bg-white placeholder-slate-400 outline-none shadow-md font-medium"
          />
          <button
            type="submit"
            className="px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
          >
            <Search className="w-4 h-4" />
            <span>Search</span>
          </button>
        </form>

        {/* Demo Quick Taps */}
        <div className="pt-2 text-[11px] text-cyan-200 flex items-center justify-center gap-2 flex-wrap">
          <span>Quick Demo Patients:</span>
          <button
            type="button"
            onClick={() => { setSearchInput('9934125870'); }}
            className="underline hover:text-white font-mono"
          >
            Mohammad Irfan (9934125870)
          </button>
          •
          <button
            type="button"
            onClick={() => { setSearchInput('9431187654'); }}
            className="underline hover:text-white font-mono"
          >
            Sunita Kumari (9431187654)
          </button>
        </div>
      </div>

      {/* Patient Record Search Results */}
      {hasSearched && (
        <>
          {searchedPatient ? (
            <div className="space-y-6 animate-in fade-in">
              
              {/* Patient Profile Card */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-brand-100 text-brand-800 flex items-center justify-center text-xl font-bold">
                    {searchedPatient.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-bold text-slate-900">{searchedPatient.name}</h2>
                      <span className="font-mono text-xs font-bold text-brand-700 bg-brand-50 px-2.5 py-0.5 rounded-full border border-brand-200">
                        {searchedPatient.patientId}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {searchedPatient.age} Yrs • {searchedPatient.gender} • Phone: {searchedPatient.phone}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Address: {searchedPatient.address}
                    </p>
                  </div>
                </div>

                <div className="text-right sm:border-l sm:border-slate-100 sm:pl-6 text-xs">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Registration Date</span>
                  <span className="font-semibold text-slate-700">
                    {new Date(searchedPatient.registeredAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Reports List */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-brand-600" />
                  <span>Your Diagnostic Reports ({patientReports.length})</span>
                </h3>

                {patientReports.length === 0 ? (
                  <p className="text-xs text-slate-400 py-6 text-center">No reports generated yet for this record.</p>
                ) : (
                  <div className="space-y-3">
                    {patientReports.map(report => (
                      <div
                        key={report.id}
                        className="p-4 rounded-xl border border-slate-200 hover:border-brand-300 transition-all bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-brand-800">{report.reportNumber}</span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              report.status === 'approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                            }`}>
                              {report.status === 'approved' ? 'VERIFIED & READY' : 'PROCESSING IN LAB'}
                            </span>
                          </div>
                          <h4 className="text-sm font-bold text-slate-900 mt-1">{report.testName}</h4>
                          <p className="text-xs text-slate-500 mt-0.5">
                            Pathologist: {report.pathologistName || 'Under Verification'}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <Link
                            to={`/verify/${report.qrToken || report.id}`}
                            className="px-3 py-2 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl flex items-center gap-1.5"
                          >
                            <QrCode className="w-3.5 h-3.5" />
                            <span>Verify QR</span>
                          </Link>
                          <Link
                            to={`/reports/${report.id}`}
                            className="px-4 py-2 text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white rounded-xl shadow-xs flex items-center gap-1.5"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Download PDF Report</span>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Sample Status */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Droplet className="w-4 h-4 text-blue-600" />
                  <span>Specimen Collection Tracking</span>
                </h3>

                {patientSamples.length === 0 ? (
                  <p className="text-xs text-slate-400 py-4 text-center">No specimen records found.</p>
                ) : (
                  <div className="space-y-2">
                    {patientSamples.map(sample => (
                      <div key={sample.id} className="p-3 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                        <div>
                          <span className="font-mono font-bold text-slate-800">{sample.sampleId}</span>
                          <span className="ml-2 text-slate-500">({sample.sampleType})</span>
                        </div>
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-blue-100 text-blue-800">
                          {sample.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          ) : (
            /* Not Found */
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-3">
              <p className="text-sm font-bold text-slate-800">No Patient Record Found</p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                No matching record found for "<span className="font-mono font-bold text-slate-700">{searchInput}</span>". Please check your registered mobile number or consult the laboratory reception.
              </p>
            </div>
          )}
        </>
      )}

    </div>
  );
}
