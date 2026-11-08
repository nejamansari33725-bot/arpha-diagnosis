import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLab } from '../context/LabContext';
import {
  User,
  Phone,
  MapPin,
  Stethoscope,
  HeartPulse,
  Receipt,
  Droplet,
  FileText,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowLeft,
  Download,
  AlertTriangle
} from 'lucide-react';
import BarcodeRenderer from '../components/BarcodeRenderer';

export default function PatientDetail() {
  const { id } = useParams();
  const { patients, reports, samples, invoices } = useLab();

  const patient = patients.find(p => p.id === id || p.patientId === id);

  if (!patient) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
        <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto" />
        <h2 className="text-lg font-bold text-slate-800">Patient Record Not Found</h2>
        <p className="text-xs text-slate-500">The patient ID does not exist or may have been removed.</p>
        <Link to="/patients" className="inline-flex items-center gap-1.5 text-xs text-brand-600 font-semibold hover:underline">
          <ArrowLeft className="w-4 h-4" /> Back to Patient Directory
        </Link>
      </div>
    );
  }

  const patientReports = reports.filter(r => r.patientId === patient.id || r.patientName === patient.name);
  const patientSamples = samples.filter(s => s.patientId === patient.id || s.patientName === patient.name);
  const patientInvoices = invoices.filter(inv => inv.patientId === patient.id || inv.patientName === patient.name);

  return (
    <div className="space-y-6">
      
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Link to="/patients" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-brand-700">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Patient Directory</span>
        </Link>
        <div className="flex items-center gap-2">
          <Link
            to="/billing"
            className="px-3.5 py-2 text-xs font-semibold bg-emerald-600 text-white rounded-xl shadow-xs hover:bg-emerald-700"
          >
            Create New Bill
          </Link>
          <Link
            to="/samples"
            className="px-3.5 py-2 text-xs font-semibold bg-brand-600 text-white rounded-xl shadow-xs hover:bg-brand-700"
          >
            Collect Specimen
          </Link>
        </div>
      </div>

      {/* Patient Profile Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-700 to-cyan-500 text-white flex items-center justify-center font-bold text-2xl shadow-md">
              {patient.name.charAt(0)}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-black text-slate-900">{patient.name}</h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-brand-100 text-brand-800 font-mono">
                  {patient.patientId}
                </span>
              </div>
              <p className="text-xs text-slate-500 flex items-center gap-3">
                <span>{patient.age} Years</span> • <span>{patient.gender}</span> • <span className="font-semibold text-rose-600">Blood: {patient.bloodGroup || 'N/A'}</span>
              </p>
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 pt-2">
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-brand-600" />
                  {patient.phone}
                </span>
                <span className="flex items-center gap-1">
                  <Stethoscope className="w-3.5 h-3.5 text-brand-600" />
                  Dr. {patient.referringDoctor || 'Self'}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-brand-600" />
                  {patient.address}
                </span>
              </div>
            </div>
          </div>

          {/* Barcode & Registered date */}
          <div className="flex flex-col items-center md:items-end justify-center border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6">
            <BarcodeRenderer value={patient.patientId} height={35} width={1.3} fontSize={10} />
            <span className="text-[11px] text-slate-400 mt-1">
              Registered on {new Date(patient.registeredAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      {/* Grid: Reports + Invoices + Samples */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Reports (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-brand-600" />
                <span>Diagnostic Test Reports ({patientReports.length})</span>
              </h3>
            </div>

            {patientReports.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">No reports generated yet for this patient.</p>
            ) : (
              <div className="space-y-3">
                {patientReports.map(report => (
                  <div key={report.id} className="p-4 rounded-xl border border-slate-200 hover:border-brand-300 transition-all bg-slate-50/50 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-brand-700">{report.reportNumber}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          report.status === 'approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {report.status.toUpperCase()}
                        </span>
                        {report.isAbnormal && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-100 text-rose-700">
                            ABNORMAL
                          </span>
                        )}
                      </div>
                      <h4 className="text-xs font-bold text-slate-800 mt-1">{report.testName}</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Pathologist: {report.pathologistName || 'Under Verification'}
                      </p>
                    </div>

                    <Link
                      to={`/reports/${report.id}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-brand-600 text-white rounded-lg hover:bg-brand-700 shadow-xs"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>View & PDF</span>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Associated Samples */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Droplet className="w-4 h-4 text-blue-600" />
              <span>Specimen Records ({patientSamples.length})</span>
            </h3>

            {patientSamples.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">No specimen samples collected yet.</p>
            ) : (
              <div className="space-y-2">
                {patientSamples.map(sample => (
                  <div key={sample.id} className="p-3 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-mono font-bold text-slate-800">{sample.sampleId}</span>
                      <span className="ml-2 text-slate-500">({sample.sampleType})</span>
                      <div className="text-[11px] text-slate-400">Barcode: {sample.barcode}</div>
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

        {/* Right Col: Invoices & Receipts */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4 h-fit">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Receipt className="w-4 h-4 text-emerald-600" />
            <span>Billing & Invoices ({patientInvoices.length})</span>
          </h3>

          {patientInvoices.length === 0 ? (
            <p className="text-xs text-slate-400 py-4 text-center">No invoices generated yet.</p>
          ) : (
            <div className="space-y-3">
              {patientInvoices.map(inv => (
                <div key={inv.id} className="p-3.5 rounded-xl border border-slate-200 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-brand-700">{inv.invoiceNumber}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      inv.paymentStatus === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {inv.paymentStatus.toUpperCase()}
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-600">
                    {inv.testNames?.join(', ')}
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span>Total: <strong className="text-slate-900">₹{inv.total}</strong></span>
                    {inv.due > 0 ? (
                      <span className="text-rose-600 font-bold">Due: ₹{inv.due}</span>
                    ) : (
                      <span className="text-emerald-700 font-semibold">Fully Settled</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
