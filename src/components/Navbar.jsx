import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLab } from '../context/LabContext';
import { 
  Activity, 
  ShieldCheck, 
  LogOut, 
  ChevronDown, 
  PhoneCall, 
  UserPlus, 
  Bell,
  FileCheck2,
  Building2,
  Lock
} from 'lucide-react';

export default function Navbar({ onOpenNewPatient }) {
  const { user, logout } = useAuth();
  const { settings, reports } = useLab();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const pendingReportsCount = reports.filter(r => r.status === 'under_review' || r.status === 'draft').length;

  return (
    <header className="no-print bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Left: Brand Identity */}
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-700 via-brand-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
                <Activity className="w-6 h-6 stroke-[2.2]" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-brand-700 transition-colors">
                  {settings.labName}
                </span>
                <span className="text-[11px] font-medium text-brand-600 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 inline text-emerald-600" />
                  NABL & ISO Certified Diagnostic Lab
                </span>
              </div>
            </Link>
          </div>

          {/* Center: Admin Status & Helpline */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Single Admin Master Access Badge */}
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-brand-50 border border-brand-200 text-brand-900 shadow-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Admin: <strong>{user?.name || 'MD NEJAM ANSARI'}</strong> (Full Control)</span>
            </div>

            {/* Helpline indicator */}
            <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
              <PhoneCall className="w-3.5 h-3.5 text-brand-600" />
              <span>{settings.phone}</span>
            </div>
          </div>

          {/* Right: Quick Actions & Profile */}
          <div className="flex items-center gap-3">
            {/* Quick Register Patient Button */}
            {onOpenNewPatient && (
              <button
                onClick={onOpenNewPatient}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-brand-700 hover:bg-brand-800 rounded-xl shadow-sm transition-all"
              >
                <UserPlus className="w-4 h-4" />
                <span className="hidden sm:inline">+ Add Patient</span>
              </button>
            )}

            {/* Alerts pill for pending reports */}
            <Link
              to="/reports"
              className="relative p-2 text-slate-500 hover:text-brand-600 hover:bg-slate-100 rounded-lg transition-colors"
              title={`${pendingReportsCount} pending reports awaiting review`}
            >
              <Bell className="w-5 h-5" />
              {pendingReportsCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {pendingReportsCount}
                </span>
              )}
            </Link>

            {/* User Dropdown */}
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-brand-100 border border-brand-200 text-brand-800 flex items-center justify-center font-bold text-sm">
                  {user?.avatar || '👨‍💼'}
                </div>
                <div className="hidden md:flex flex-col text-left">
                  <span className="text-xs font-semibold text-slate-800 leading-tight">
                    {user?.name || 'MD NEJAM ANSARI'}
                  </span>
                  <span className="text-[10px] text-emerald-600 font-bold">
                    Super Admin
                  </span>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in">
                  <div className="px-3 py-2 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-800">{user?.name}</p>
                    <p className="text-[11px] text-slate-500">{user?.email || 'admin@arphadiagnosis.com'}</p>
                    <p className="text-[10px] text-brand-600 font-medium mt-0.5">Master Lab Administrator</p>
                  </div>

                  <div className="py-1">
                    <Link
                      to="/settings"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-xs text-slate-700 hover:bg-slate-100 rounded-lg"
                    >
                      <Building2 className="w-4 h-4 text-slate-400" />
                      <span>Lab Settings</span>
                    </Link>
                    <Link
                      to="/portal"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-xs text-slate-700 hover:bg-slate-100 rounded-lg"
                    >
                      <FileCheck2 className="w-4 h-4 text-slate-400" />
                      <span>Patient Portal Access</span>
                    </Link>
                  </div>

                  <div className="border-t border-slate-100 pt-1">
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        logout();
                        navigate('/login');
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 rounded-lg font-medium"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>
      </div>
    </header>
  );
}
