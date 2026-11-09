import React, { useState } from 'react';
import { useLab } from '../context/LabContext';
import { useAuth } from '../context/AuthContext';
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
  Stethoscope,
  Trash2,
  AlertTriangle,
  RefreshCw,
  Lock,
  KeyRound,
  Eye,
  EyeOff,
  UserCheck
} from 'lucide-react';

export default function Settings() {
  const { settings, updateSettings, resetAllData, patients, invoices, samples, reports } = useLab();
  const { adminCredentials, updateAdminCredentials } = useAuth();

  // Lab profile state
  const [formData, setFormData] = useState({ ...settings });
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  // Admin credentials state
  const [adminName, setAdminName] = useState(adminCredentials?.name || 'MD NEJAM ANSARI');
  const [adminEmail, setAdminEmail] = useState(adminCredentials?.email || 'admin@arphadiagnosis.com');
  const [adminPhone, setAdminPhone] = useState(adminCredentials?.phone || '8434776690');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminConfirmPassword, setAdminConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [adminSaveSuccess, setAdminSaveSuccess] = useState(false);
  const [adminError, setAdminError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    updateSettings(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleAdminCredentialsSubmit = (e) => {
    e.preventDefault();
    setAdminError('');

    if (adminPassword && adminPassword !== adminConfirmPassword) {
      setAdminError('New Password aur Confirm Password match nahi kar rahe hain!');
      return;
    }

    updateAdminCredentials({
      name: adminName.trim(),
      email: adminEmail.trim(),
      phone: adminPhone.trim(),
      password: adminPassword ? adminPassword.trim() : undefined
    });

    setAdminPassword('');
    setAdminConfirmPassword('');
    setAdminSaveSuccess(true);
    setTimeout(() => setAdminSaveSuccess(false), 4000);
  };

  const handleResetData = () => {
    if (window.confirm("Kripya confirm karein: Kya aap sach me sabhi patients, bills, samples aur reports ka data delete karke bilkul fresh/clean shuru karna chahte hain?")) {
      resetAllData();
      setResetSuccess(true);
      setTimeout(() => setResetSuccess(false), 4000);
    }
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
          Clinic letterhead, doctor credentials, master admin password & Gmail settings, and database management.
        </p>
      </div>

      {saveSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>Laboratory profile settings successfully updated and saved!</span>
        </div>
      )}

      {/* 1. ADMIN LOGIN GMAIL & PASSWORD CARD (SPECIAL REQUEST) */}
      <div className="bg-white rounded-2xl border-2 border-brand-200 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-brand-800 to-brand-700 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <KeyRound className="w-5 h-5 text-brand-200" />
            <div>
              <h2 className="text-sm font-bold">Admin Security: Change Gmail & Password</h2>
              <p className="text-[11px] text-brand-200">Master Admin login email aur password yahan se badlein</p>
            </div>
          </div>
          <span className="text-[10px] font-bold bg-white/20 text-white px-2.5 py-1 rounded-full uppercase tracking-wider">
            Admin Auth
          </span>
        </div>

        <form onSubmit={handleAdminCredentialsSubmit} className="p-6 space-y-4 text-xs">
          {adminError && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl font-medium flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{adminError}</span>
            </div>
          )}

          {adminSaveSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl font-bold flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Admin Gmail aur Password successfully update ho gaya hai!</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Admin Full Name</label>
              <input
                type="text"
                required
                value={adminName}
                onChange={(e) => setAdminName(e.target.value)}
                className="w-full px-3 py-2 border rounded-xl font-bold text-slate-900"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Admin Mobile Phone</label>
              <input
                type="tel"
                required
                value={adminPhone}
                onChange={(e) => setAdminPhone(e.target.value)}
                className="w-full px-3 py-2 border rounded-xl font-mono text-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Admin Login Gmail / Email Address *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="email"
                required
                placeholder="e.g. yourname@gmail.com"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-brand-300 rounded-xl font-mono font-bold text-brand-900 bg-brand-50/20"
              />
            </div>
            <p className="text-[10px] text-slate-400 mt-1">Is Gmail ID se aap login karenge.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-semibold text-slate-700">New Password (Naya Password)</label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[10px] text-brand-700 font-semibold hover:underline flex items-center gap-1"
                >
                  {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  <span>{showPassword ? 'Hide' : 'Show'}</span>
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Leave empty to keep existing password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border rounded-xl font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Confirm New Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Re-enter new password"
                  value={adminConfirmPassword}
                  onChange={(e) => setAdminConfirmPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border rounded-xl font-mono"
                />
              </div>
            </div>
          </div>

          <div className="pt-2 flex justify-between items-center">
            <span className="text-[11px] text-slate-500 font-mono">
              Current Password: <strong>{adminCredentials?.password ? '••••••••' : 'admin'}</strong>
            </span>
            <button
              type="submit"
              className="px-5 py-2.5 bg-brand-700 hover:bg-brand-800 text-white font-bold rounded-xl shadow-md transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Update Admin Gmail & Password</span>
            </button>
          </div>
        </form>
      </div>

      {/* 2. CLINIC LETTERHEAD & PUBLIC PROFILE */}
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

      {/* 3. DANGER ZONE: DATA RESET */}
      <div className="bg-rose-50/70 rounded-2xl border-2 border-rose-200 p-6 space-y-4 text-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black text-rose-950">Database Clean Slate (Data Reset)</h3>
              <p className="text-rose-700 mt-0.5">
                Clear all patients, billing records, samples, and reports to start completely fresh with real patient intake.
              </p>
              <div className="flex items-center gap-3 text-[11px] font-mono text-rose-800 mt-2">
                <span>Patients: {patients.length}</span> •
                <span>Bills: {invoices.length}</span> •
                <span>Samples: {samples.length}</span> •
                <span>Reports: {reports.length}</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleResetData}
            className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 self-start sm:self-auto shrink-0"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reset All Records to 0</span>
          </button>
        </div>

        {resetSuccess && (
          <div className="p-3 bg-emerald-100 border border-emerald-300 text-emerald-900 rounded-xl font-bold flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-700" />
            <span>Sabhi data safalta-purvak reset ho gaya hai! Naye real patients add karne ke liye taiyaar hai.</span>
          </div>
        )}
      </div>

    </div>
  );
}
