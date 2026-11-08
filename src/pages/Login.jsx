import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, ROLES } from '../context/AuthContext';
import { useLab } from '../context/LabContext';
import {
  Activity,
  ShieldCheck,
  Lock,
  Mail,
  UserCheck,
  ArrowRight,
  Stethoscope,
  Microscope,
  Receipt,
  User
} from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const { loginStaff } = useAuth();
  const { settings } = useLab();

  const [email, setEmail] = useState('admin@arphadiagnosis.com');
  const [password, setPassword] = useState('••••••••');

  const handleRoleSelect = (role) => {
    loginStaff(role);
    if (role === ROLES.PATIENT) {
      navigate('/portal');
    } else {
      navigate('/');
    }
  };

  const handleCustomLogin = (e) => {
    e.preventDefault();
    loginStaff(ROLES.SUPER_ADMIN);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-brand-600/20 blur-[140px] pointer-events-none rounded-full"></div>
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center relative z-10 space-y-2">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-600 via-brand-500 to-cyan-400 text-white mx-auto flex items-center justify-center shadow-lg shadow-brand-500/30">
          <Activity className="w-9 h-9 stroke-[2.3]" />
        </div>
        <h1 className="text-3xl font-black text-white tracking-tight">
          {settings.labName}
        </h1>
        <p className="text-xs text-brand-300 font-semibold tracking-wide uppercase">
          Advanced Pathology Laboratory Management System
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl relative z-10 px-4">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-2xl rounded-3xl border border-slate-200 space-y-6">
          
          {/* 1-Click Role Login Selector (Instant access for testing) */}
          <div className="space-y-3">
            <div className="text-center">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Quick Role-Based Direct Access
              </span>
              <p className="text-xs text-slate-600 mt-0.5">Click any role to test its specific access and permissions:</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              
              {/* Super Admin */}
              <button
                type="button"
                onClick={() => handleRoleSelect(ROLES.SUPER_ADMIN)}
                className="p-3 text-left rounded-xl border border-purple-200 bg-purple-50/50 hover:bg-purple-100/80 transition-all flex items-center gap-3 group"
              >
                <div className="w-9 h-9 rounded-lg bg-purple-600 text-white flex items-center justify-center text-sm font-bold shrink-0">
                  👨‍💼
                </div>
                <div>
                  <div className="text-xs font-bold text-purple-950 flex items-center gap-1">
                    <span>Super Admin</span>
                    <span className="text-[9px] bg-purple-200 text-purple-800 px-1 py-0.2 rounded">Master</span>
                  </div>
                  <div className="text-[11px] text-purple-800">MD NEJAM ANSARI</div>
                </div>
              </button>

              {/* Pathologist */}
              <button
                type="button"
                onClick={() => handleRoleSelect(ROLES.PATHOLOGIST)}
                className="p-3 text-left rounded-xl border border-emerald-200 bg-emerald-50/50 hover:bg-emerald-100/80 transition-all flex items-center gap-3 group"
              >
                <div className="w-9 h-9 rounded-lg bg-emerald-600 text-white flex items-center justify-center text-sm font-bold shrink-0">
                  👩‍⚕️
                </div>
                <div>
                  <div className="text-xs font-bold text-emerald-950 flex items-center gap-1">
                    <span>Pathologist (MD)</span>
                    <span className="text-[9px] bg-emerald-200 text-emerald-800 px-1 py-0.2 rounded">Approver</span>
                  </div>
                  <div className="text-[11px] text-emerald-800">Dr. Arpha Tabassum</div>
                </div>
              </button>

              {/* Lab Technician */}
              <button
                type="button"
                onClick={() => handleRoleSelect(ROLES.TECHNICIAN)}
                className="p-3 text-left rounded-xl border border-amber-200 bg-amber-50/50 hover:bg-amber-100/80 transition-all flex items-center gap-3 group"
              >
                <div className="w-9 h-9 rounded-lg bg-amber-600 text-white flex items-center justify-center text-sm font-bold shrink-0">
                  🔬
                </div>
                <div>
                  <div className="text-xs font-bold text-amber-950 flex items-center gap-1">
                    <span>Lab Tech (DMLT)</span>
                    <span className="text-[9px] bg-amber-200 text-amber-800 px-1 py-0.2 rounded">Drafts</span>
                  </div>
                  <div className="text-[11px] text-amber-800">Rahul Kumar</div>
                </div>
              </button>

              {/* Receptionist */}
              <button
                type="button"
                onClick={() => handleRoleSelect(ROLES.RECEPTIONIST)}
                className="p-3 text-left rounded-xl border border-blue-200 bg-blue-50/50 hover:bg-blue-100/80 transition-all flex items-center gap-3 group"
              >
                <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center text-sm font-bold shrink-0">
                  👩‍💼
                </div>
                <div>
                  <div className="text-xs font-bold text-blue-950 flex items-center gap-1">
                    <span>Billing & Reception</span>
                    <span className="text-[9px] bg-blue-200 text-blue-800 px-1 py-0.2 rounded">Frontdesk</span>
                  </div>
                  <div className="text-[11px] text-blue-800">Priya Sharma</div>
                </div>
              </button>

            </div>

            {/* Patient Portal Option */}
            <button
              type="button"
              onClick={() => handleRoleSelect(ROLES.PATIENT)}
              className="w-full p-3 rounded-xl border border-indigo-200 bg-indigo-50/60 hover:bg-indigo-100 transition-all flex items-center justify-between text-indigo-900"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-sm font-bold">
                  👤
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold">Patient Self-Service Portal</div>
                  <div className="text-[11px] text-indigo-700">Lookup tests, download reports & verify QR codes</div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-indigo-600" />
            </button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-3 bg-white text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                Or Custom Staff Credentials
              </span>
            </div>
          </div>

          {/* Standard Form */}
          <form onSubmit={handleCustomLogin} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Staff Email ID</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border rounded-xl"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Access Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border rounded-xl"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-brand-700 hover:bg-brand-800 text-white font-bold rounded-xl shadow-md transition-all text-xs"
            >
              Authenticate & Enter Lab System
            </button>
          </form>

        </div>
      </div>

    </div>
  );
}
