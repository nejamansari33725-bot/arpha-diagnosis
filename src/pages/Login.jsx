import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLab } from '../context/LabContext';
import {
  Activity,
  ShieldCheck,
  Lock,
  Mail,
  ArrowRight,
  User,
  AlertCircle
} from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const { loginAdmin, adminCredentials, verifyCredentials } = useAuth();
  const { settings } = useLab();

  const [email, setEmail] = useState(adminCredentials?.email || 'admin@arphadiagnosis.com');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleAdminEnter = () => {
    loginAdmin();
    navigate('/');
  };

  const handleCustomLogin = (e) => {
    e.preventDefault();
    setError('');

    if (verifyCredentials(email, password)) {
      loginAdmin();
      navigate('/');
    } else {
      setError('Galat Email ya Password hai. Kripya apna sahi password dalein ya direct Admin access button use karein.');
    }
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

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg relative z-10 px-4">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-2xl rounded-3xl border border-slate-200 space-y-6">
          
          {/* Quick Direct Admin Entry */}
          <div className="space-y-3">
            <div className="text-center">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Master Administrator Access
              </span>
              <p className="text-xs text-slate-600 mt-0.5">Click below to enter with saved Admin profile:</p>
            </div>

            <button
              type="button"
              onClick={handleAdminEnter}
              className="w-full p-4 text-left rounded-2xl border-2 border-brand-500 bg-brand-50 hover:bg-brand-100 transition-all flex items-center justify-between group shadow-sm"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-brand-700 text-white flex items-center justify-center text-lg font-bold shadow-md">
                  👨‍💼
                </div>
                <div>
                  <div className="text-sm font-black text-brand-950 flex items-center gap-2">
                    <span>{adminCredentials?.name || 'MD NEJAM ANSARI'}</span>
                    <span className="text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded-full font-bold">
                      Master Admin
                    </span>
                  </div>
                  <div className="text-xs text-brand-700 font-mono mt-0.5">
                    {adminCredentials?.email || 'admin@arphadiagnosis.com'}
                  </div>
                </div>
              </div>

              <div className="w-8 h-8 rounded-lg bg-brand-700 text-white flex items-center justify-center group-hover:translate-x-1 transition-transform shrink-0">
                <ArrowRight className="w-4 h-4" />
              </div>
            </button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-3 bg-white text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                Or Sign In With Password
              </span>
            </div>
          </div>

          {/* Standard Form */}
          <form onSubmit={handleCustomLogin} className="space-y-4 text-xs">
            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Admin Email / Gmail</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border rounded-xl font-mono text-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="password"
                  required
                  placeholder="Enter admin password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border rounded-xl font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-slate-900 hover:bg-black text-white font-bold rounded-xl shadow-md transition-all text-xs"
            >
              Sign In to Lab Console
            </button>
          </form>

          {/* Patient Portal Link */}
          <div className="pt-2 border-t border-slate-100 text-center">
            <button
              type="button"
              onClick={() => navigate('/portal')}
              className="text-xs font-semibold text-brand-700 hover:text-brand-900 hover:underline inline-flex items-center gap-1.5"
            >
              <User className="w-3.5 h-3.5" />
              <span>Looking for your medical reports? Go to Patient Portal &rarr;</span>
            </button>
          </div>

        </div>
      </div>

    </div>
  );
}
