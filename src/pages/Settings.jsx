import React, { useState } from 'react';
import { useLab } from '../context/LabContext';
import {
  Settings as SettingsIcon,
  Building2,
  Database,
  ShieldCheck,
  Check,
  Save,
  Copy,
  ExternalLink,
  Phone,
  Mail,
  MapPin,
  Stethoscope
} from 'lucide-react';

export default function Settings() {
  const { settings, updateSettings } = useLab();
  const [formData, setFormData] = useState({ ...settings });
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateSettings(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleCopySqlNotice = () => {
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
          <SettingsIcon className="w-7 h-7 text-brand-600" />
          <span>Laboratory Information & System Settings</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Configure diagnostic laboratory letterhead, medical accreditation details, pathologist credentials, and database synchronization.
        </p>
      </div>

      {saveSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>Laboratory profile settings successfully updated and saved!</span>
        </div>
      )}

      {/* Main Settings Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-4">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-brand-600" />
            <span>Diagnostic Clinic Letterhead & Public Profile</span>
          </h2>
        </div>

        <div className="p-6 space-y-4 text-xs">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Laboratory Brand Name</label>
              <input
                type="text"
                required
                value={formData.labName}
                onChange={(e) => setFormData({ ...formData, labName: e.target.value })}
                className="w-full px-3 py-2 border rounded-xl font-bold text-brand-900"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Tagline / Subheading</label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                className="w-full px-3 py-2 border rounded-xl"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Medical Accreditation Header Text</label>
            <input
              type="text"
              value={formData.accreditation}
              onChange={(e) => setFormData({ ...formData, accreditation: e.target.value })}
              className="w-full px-3 py-2 border rounded-xl font-medium"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Primary Reception Helpline</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 border rounded-xl"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Official Email Address</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border rounded-xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Physical Street Address</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-3 py-2 border rounded-xl"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">City, State & Pin Code</label>
              <input
                type="text"
                value={formData.cityState}
                onChange={(e) => setFormData({ ...formData, cityState: e.target.value })}
                className="w-full px-3 py-2 border rounded-xl"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm mb-3 flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-emerald-600" />
              <span>Chief Pathologist Sign-off Signature Profile</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Pathologist Full Name & Degrees</label>
                <input
                  type="text"
                  value={formData.pathologistName}
                  onChange={(e) => setFormData({ ...formData, pathologistName: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl font-bold"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Medical Council Registration #</label>
                <input
                  type="text"
                  value={formData.pathologistReg}
                  onChange={(e) => setFormData({ ...formData, pathologistReg: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl font-mono"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl shadow-md transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Save Lab Settings</span>
            </button>
          </div>

        </div>

      </form>

      {/* Supabase Database Cloud Sync Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4 text-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Supabase Cloud Database & RLS</h3>
              <p className="text-slate-500">Dual-layer architecture: Embedded high-speed state + Supabase PostgreSQL schema</p>
            </div>
          </div>
          <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full font-bold text-[11px] flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
            Ready to Connect
          </span>
        </div>

        <p className="text-slate-600 leading-relaxed">
          The complete database schema with Row Level Security (RLS), tables (<code className="bg-slate-100 px-1 py-0.5 rounded text-brand-700 font-mono">patients</code>, <code className="bg-slate-100 px-1 py-0.5 rounded text-brand-700 font-mono">test_catalog</code>, <code className="bg-slate-100 px-1 py-0.5 rounded text-brand-700 font-mono">samples</code>, <code className="bg-slate-100 px-1 py-0.5 rounded text-brand-700 font-mono">invoices</code>, <code className="bg-slate-100 px-1 py-0.5 rounded text-brand-700 font-mono">lab_reports</code>, <code className="bg-slate-100 px-1 py-0.5 rounded text-brand-700 font-mono">audit_logs</code>), and seed data is ready in <code className="font-mono bg-slate-100 px-1 py-0.5 rounded text-slate-800">supabase_schema.sql</code>.
        </p>

        <div className="bg-slate-900 text-emerald-400 p-4 rounded-xl font-mono text-[11px] overflow-x-auto space-y-1">
          <p className="text-slate-400">// Supabase Environment Variables (Optional in .env):</p>
          <p>VITE_SUPABASE_URL=https://your-project.supabase.co</p>
          <p>VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...</p>
        </div>
      </div>

    </div>
  );
}
