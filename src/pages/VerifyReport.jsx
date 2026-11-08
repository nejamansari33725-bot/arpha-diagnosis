import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLab } from '../context/LabContext';
import {
  ShieldCheck,
  CheckCircle2,
  FileText,
  Building2,
  User,
  Calendar,
  Download,
  AlertTriangle,
  Activity
} from 'lucide-react';

export default function VerifyReport() {
  const { token } = useParams();
  const { reports, settings } = useLab();

  // Find report matching qrToken or ID
  const report = reports.find(r => r.qrToken === token || r.id === token || r.reportNumber === token);

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-900 via-slate-900 to-slate-950 flex flex-col items-center justify-center p-4">
      
      {/* Brand Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-cyan-300 text-xs font-semibold mb-2">
          <Activity className="w-4 h-4 text-emerald-400" />
          <span>Official LIS Verification Portal</span>
        </div>
        <h1 className="text-2xl font-black text-white tracking-tight">
          {settings.labName}
        </h1>
        <p className="text-xs text-slate-300">{settings.tagline}</p>
      </div>

      {/* Main Verification Card */}
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in zoom-in-95">
        
        {report ? (
          <>
            {/* Valid Report Banner */}
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 text-white text-center space-y-2">
              <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm mx-auto flex items-center justify-center">
                <ShieldCheck className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-lg font-black tracking-tight uppercase">
                Authentic Medical Report Verified
              </h2>
              <p className="text-xs text-emerald-100 max-w-sm mx-auto">
                This digital diagnostic report is cryptographically registered and signed by the Authorized Medical Pathologist of Arpha Diagnosis.
              </p>
            </div>

            {/* Report Summary Details */}
            <div className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4 pb-4 border-b border-slate-100">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Report Number</span>
                  <span className="font-mono font-bold text-slate-800 text-sm">{report.reportNumber}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Current Status</span>
                  <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Approved & Released
                  </span>
                </div>
              </div>

              <div className="space-y-2.5">
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Patient Name:</span>
                  <span className="font-bold text-slate-900">{report.patientName}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Age / Gender:</span>
                  <span className="font-semibold text-slate-800">{report.patientAge} Years / {report.patientGender}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Investigation Conducted:</span>
                  <span className="font-bold text-brand-800">{report.testName}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Referring Physician:</span>
                  <span className="font-medium text-slate-800">Dr. {report.referringDoctor || 'Walk-in'}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Authorized Pathologist:</span>
                  <span className="font-bold text-emerald-800">{report.pathologistName || settings.pathologistName}</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-slate-500">Verification Token:</span>
                  <span className="font-mono text-[10px] text-slate-400">{token}</span>
                </div>
              </div>

              {/* Action */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                <Link
                  to="/"
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50"
                >
                  Lab Portal
                </Link>
                <Link
                  to={`/reports/${report.id}`}
                  className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold flex items-center gap-2 shadow-md"
                >
                  <Download className="w-4 h-4" />
                  <span>View Full Hospital Report</span>
                </Link>
              </div>
            </div>
          </>
        ) : (
          /* Invalid / Not Found State */
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 mx-auto flex items-center justify-center">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">
              Unverified or Expired Token
            </h2>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              We could not authenticate any clinical record matching the token <span className="font-mono font-bold text-slate-700">{token}</span>. Please verify with Arpha Diagnosis lab reception.
            </p>
            <div className="pt-4">
              <Link
                to="/"
                className="px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-black inline-block"
              >
                Go to Arpha Diagnosis Home
              </Link>
            </div>
          </div>
        )}

      </div>

      {/* Footer Disclaimer */}
      <div className="text-center text-[11px] text-slate-400 mt-6 max-w-md">
        {settings.accreditation} • Arpha Laboratory Information System (LIS). Protected by cryptographic digital signatures.
      </div>

    </div>
  );
}
