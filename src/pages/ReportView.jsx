import React, { useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLab } from '../context/LabContext';
import { QRCodeSVG } from 'qrcode.react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import {
  ArrowLeft,
  Printer,
  Download,
  Share2,
  Edit,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Activity,
  Phone,
  Mail,
  MapPin,
  ExternalLink
} from 'lucide-react';
import BarcodeRenderer from '../components/BarcodeRenderer';

export default function ReportView() {
  const { id } = useParams();
  const { reports, settings } = useLab();
  const reportRef = useRef(null);

  const report = reports.find(r => r.id === id);

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

  const qrUrl = `${settings.qrVerificationBaseUrl || 'https://arphadiagnosis.vercel.app/verify'}/${report.qrToken || report.id}`;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    if (!reportRef.current) return;
    try {
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
        logging: false
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`${report.reportNumber}_${report.patientName.replace(/\s+/g, '_')}.pdf`);
    } catch (err) {
      console.error('PDF generation error:', err);
      window.print();
    }
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `Hello ${report.patientName}, your diagnostic lab test report for ${report.testName} (Report No: ${report.reportNumber}) has been verified and released by ARPHA DIAGNOSIS.\n\nYou can verify and view your authentic report online here: ${qrUrl}`
    );
    window.open(`https://wa.me/91${report.patientPhone}?text=${text}`, '_blank');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      
      {/* Top Action Bar (hidden when printing) */}
      <div className="no-print bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <Link
          to="/reports"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-brand-700"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Reports</span>
        </Link>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            to={`/reports/edit/${report.id}`}
            className="px-3.5 py-2 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors flex items-center gap-1.5"
          >
            <Edit className="w-3.5 h-3.5" />
            <span>Edit Results</span>
          </Link>

          <button
            onClick={handleShareWhatsApp}
            className="px-3.5 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            title="Send ready report to patient on WhatsApp"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Send WhatsApp</span>
          </button>

          <button
            onClick={handleDownloadPDF}
            className="px-3.5 py-2 text-xs font-semibold bg-brand-700 hover:bg-brand-800 text-white rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download PDF</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-4 py-2 text-xs font-bold bg-slate-900 hover:bg-black text-white rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* HOSPITAL-GRADE A4 PRINTABLE REPORT CONTAINER */}
      <div
        ref={reportRef}
        className="print-page bg-white p-8 sm:p-12 rounded-2xl border border-slate-200 shadow-xl space-y-6 text-slate-900"
      >
        
        {/* REPORT HEADER */}
        <div className="border-b-2 border-brand-800 pb-5">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            
            {/* Lab Branding */}
            <div>
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-brand-800 text-white flex items-center justify-center font-bold">
                  <Activity className="w-6 h-6 stroke-[2.5]" />
                </div>
                <div>
                  <h1 className="text-2xl font-black tracking-tight text-brand-900 font-serif">
                    {settings.labName}
                  </h1>
                  <p className="text-[11px] font-semibold text-brand-700 uppercase tracking-widest">
                    {settings.tagline}
                  </p>
                </div>
              </div>

              <div className="mt-2 text-[11px] text-slate-600 space-y-0.5">
                <p>{settings.address}, {settings.cityState}</p>
                <p>Phone: {settings.phone} | Email: {settings.email}</p>
              </div>
            </div>

            {/* Accreditation Badge */}
            <div className="text-right sm:self-center">
              <div className="inline-flex flex-col items-end">
                <span className="px-3 py-1 bg-brand-50 border border-brand-200 text-brand-900 rounded-lg text-[11px] font-bold">
                  {settings.accreditation}
                </span>
                <span className="text-[10px] text-slate-500 mt-1 font-mono">
                  ISO 15189:2022 Medical Lab Standard
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* PATIENT DEMOGRAPHICS & SPECIMEN DETAILS */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 grid grid-cols-2 sm:grid-cols-4 gap-y-3 gap-x-4 text-xs">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Patient Name</span>
            <span className="font-bold text-slate-900 text-sm">{report.patientName}</span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Patient ID / Age / Sex</span>
            <span className="font-semibold text-slate-800">
              <span className="font-mono text-brand-700">{report.patientId || 'ARPHA-2026-0001'}</span> • {report.patientAge}Y / {report.patientGender}
            </span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Referring Doctor</span>
            <span className="font-semibold text-slate-800">Dr. {report.referringDoctor || 'Self'}</span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Report Number</span>
            <span className="font-mono font-bold text-brand-800">{report.reportNumber}</span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Sample ID & Specimen</span>
            <span className="font-medium text-slate-800">{report.sampleType || 'Whole Blood / Serum'}</span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Collection Time</span>
            <span className="text-slate-700">
              {new Date(report.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })} 09:30 AM
            </span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Report Released Time</span>
            <span className="text-slate-700">
              {report.pathologistApprovedAt ? new Date(report.pathologistApprovedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Today'} 12:15 PM
            </span>
          </div>

          <div className="flex items-center justify-start sm:justify-end">
            <BarcodeRenderer value={report.reportNumber} height={25} width={1.2} fontSize={9} />
          </div>
        </div>

        {/* TEST TITLE */}
        <div className="text-center py-1 border-b border-t border-slate-200">
          <h2 className="text-sm font-black uppercase tracking-wider text-slate-900">
            DEPARTMENT OF PATHOLOGY & BIOCHEMISTRY
          </h2>
          <p className="text-xs font-bold text-brand-700 uppercase tracking-wide mt-0.5">
            {report.testName}
          </p>
        </div>

        {/* RESULTS TABLE */}
        <div>
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b-2 border-slate-800 text-[11px] font-bold text-slate-800 uppercase">
                <th className="py-2 px-2">Investigation (Test Parameter)</th>
                <th className="py-2 px-2 text-center">Observed Value</th>
                <th className="py-2 px-2 text-center">Unit</th>
                <th className="py-2 px-2 text-right">Biological Reference Interval</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {report.results?.map((res, i) => (
                <tr key={i} className="hover:bg-slate-50/50">
                  <td className="py-2.5 px-2 font-medium text-slate-800">
                    {res.name}
                  </td>
                  <td className="py-2.5 px-2 text-center font-bold text-sm">
                    <span className={res.flag === 'HIGH' ? 'text-rose-600 underline font-black' : res.flag === 'LOW' ? 'text-amber-700 underline font-black' : 'text-slate-900'}>
                      {res.value} {res.flag === 'HIGH' ? '▲' : res.flag === 'LOW' ? '▼' : ''}
                    </span>
                  </td>
                  <td className="py-2.5 px-2 text-center text-slate-600 font-mono text-[11px]">
                    {res.unit}
                  </td>
                  <td className="py-2.5 px-2 text-right font-mono text-slate-700 text-[11px]">
                    {res.refRange}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* CLINICAL IMPRESSION / REMARKS */}
        {report.clinicalImpression && (
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs space-y-1">
            <span className="font-bold uppercase tracking-wider text-slate-800 text-[10px] block">
              Clinical Impression / Pathological Interpretation:
            </span>
            <p className="text-slate-700 italic leading-relaxed">
              {report.clinicalImpression}
            </p>
          </div>
        )}

        {/* MEDICAL DISCLAIMER */}
        <div className="text-[10px] text-slate-400 space-y-0.5 border-t border-slate-100 pt-3">
          <p>• The reported results relate exclusively to the sample tested. Please correlate clinically with patient history.</p>
          <p>• In case of unexpected or discordant findings, immediate specimen re-collection is recommended free of charge.</p>
        </div>

        {/* FOOTER: DUAL SIGNATURES & TAMPER-PROOF QR CODE */}
        <div className="pt-6 border-t-2 border-slate-800 grid grid-cols-3 items-end gap-4 text-xs">
          
          {/* Technologist */}
          <div className="text-left space-y-1">
            <div className="font-serif italic text-slate-600 text-sm mb-1">
              Rahul Kumar
            </div>
            <div className="h-0.5 w-32 bg-slate-400"></div>
            <div className="font-bold text-slate-900">Rahul Kumar</div>
            <div className="text-[10px] text-slate-500">B.Sc MLT, Senior Technologist</div>
          </div>

          {/* Online QR Verification Stamp */}
          <div className="flex flex-col items-center justify-center text-center">
            <div className="p-1.5 bg-white border border-slate-300 rounded-lg shadow-xs">
              <QRCodeSVG value={qrUrl} size={64} level="M" />
            </div>
            <span className="text-[9px] font-bold text-brand-800 uppercase tracking-wider mt-1">
              Scan to Verify Online
            </span>
            <span className="text-[8px] text-slate-400 font-mono">
              {report.qrToken?.substring(0, 16)}...
            </span>
          </div>

          {/* Authorized Pathologist */}
          <div className="text-right space-y-1">
            <div className="font-serif italic text-emerald-800 font-bold text-sm mb-1">
              Dr. Arpha Tabassum
            </div>
            <div className="h-0.5 w-36 bg-emerald-700 ml-auto"></div>
            <div className="font-bold text-slate-900">
              {report.pathologistName || settings.pathologistName}
            </div>
            <div className="text-[10px] text-slate-500">
              MBBS, MD (Pathology) • {settings.pathologistReg}
            </div>
            <div className="text-[9px] font-bold text-emerald-700 uppercase">
              Authorized Signatory
            </div>
          </div>

        </div>

        {/* End of Report Bar */}
        <div className="text-center text-[10px] text-slate-400 pt-3 border-t border-slate-100">
          *** END OF PATHOLOGICAL REPORT • ARPHA DIAGNOSIS LIS • PAGE 1 OF 1 ***
        </div>

      </div>

    </div>
  );
}
