import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth, ROLES, ROLE_LABELS } from '../context/AuthContext';
import { useLab } from '../context/LabContext';
import { 
  Activity, 
  User, 
  ShieldCheck, 
  LogOut, 
  ChevronDown, 
  PhoneCall, 
  UserPlus, 
  Search,
  Bell,
  Stethoscope,
  Microscope,
  FileCheck2,
  Building2
} from 'lucide-react';

export default function Navbar({ onOpenNewPatient }) {
  const { user, loginStaff, logout } = useAuth();
  const { settings, reports, samples } = useLab();
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const pendingReportsCount = reports.filter(r => r.status === 'under_review' || r.status === 'draft').length;
  const processingSamplesCount = samples.filter(s => s.status === 'processing').length;

  const handleRoleChange = (role) => {
    loginStaff(role);
    setRoleDropdownOpen(false);
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case ROLES.SUPER_ADMIN:
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case ROLES.PATHOLOGIST:
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case ROLES.TECHNICIAN:
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case ROLES.RECEPTIONIST:
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case ROLES.PATIENT:
        return 'bg-indigo-100 text-indigo-800 border-indigo-300';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  return (
    <header className="no-print bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Left: Brand Identity */}
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-700 via-brand-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
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

          {/* Center: Quick Switch Role Pill (Special UX Feature for testing) */}
          <div className="hidden lg:flex items-center gap-2">
            <div className="relative">
              <button
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${getRoleBadgeColor(user?.role)} hover:shadow`}
                title="Switch role to test different access permissions"
              >
                <span className="w-2 h-2 rounded-full bg-current animate-pulse"></span>
                <span>Active Role: {ROLE_LABELS[user?.role] || user?.role || 'Guest'}</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-70" />
              </button>

              {roleDropdownOpen && (
                <div className="absolute top-full mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in slide-in-from-top-1">
                  <div className="px-3 py-2 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-800">Switch Testing Role</p>
                    <p className="text-[11px] text-slate-500">Test UI & permissions for different lab staff</p>
                  </div>
                  <div className="py-1 space-y-0.5">
                    <button
                      onClick={() => handleRoleChange(ROLES.SUPER_ADMIN)}
                      className="w-full text-left px-3 py-2 text-xs rounded-lg hover:bg-purple-50 flex items-center justify-between text-purple-950"
                    >
                      <span className="font-medium">Super Admin (MD Nejam Ansari)</span>
                      <span className="text-[10px] bg-purple-200 text-purple-800 px-1.5 py-0.5 rounded">All Access</span>
                    </button>
                    <button
                      onClick={() => handleRoleChange(ROLES.PATHOLOGIST)}
                      className="w-full text-left px-3 py-2 text-xs rounded-lg hover:bg-emerald-50 flex items-center justify-between text-emerald-950"
                    >
                      <span className="font-medium">Pathologist (Dr. Arpha Tabassum)</span>
                      <span className="text-[10px] bg-emerald-200 text-emerald-800 px-1.5 py-0.5 rounded">Approve Reports</span>
                    </button>
                    <button
                      onClick={() => handleRoleChange(ROLES.TECHNICIAN)}
                      className="w-full text-left px-3 py-2 text-xs rounded-lg hover:bg-amber-50 flex items-center justify-between text-amber-950"
                    >
                      <span className="font-medium">Lab Technician (Rahul Kumar)</span>
                      <span className="text-[10px] bg-amber-200 text-amber-800 px-1.5 py-0.5 rounded">Drafts Only</span>
                    </button>
                    <button
                      onClick={() => handleRoleChange(ROLES.RECEPTIONIST)}
                      className="w-full text-left px-3 py-2 text-xs rounded-lg hover:bg-blue-50 flex items-center justify-between text-blue-950"
                    >
                      <span className="font-medium">Receptionist (Priya Sharma)</span>
                      <span className="text-[10px] bg-blue-200 text-blue-800 px-1.5 py-0.5 rounded">Billing & Reg</span>
                    </button>
                    <button
                      onClick={() => handleRoleChange(ROLES.PATIENT)}
                      className="w-full text-left px-3 py-2 text-xs rounded-lg hover:bg-indigo-50 flex items-center justify-between text-indigo-950"
                    >
                      <span className="font-medium">Patient Portal</span>
                      <span className="text-[10px] bg-indigo-200 text-indigo-800 px-1.5 py-0.5 rounded">Reports Only</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Helpline indicator */}
            <div className="flex items-center gap-1.5 text-xs text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
              <PhoneCall className="w-3.5 h-3.5 text-brand-600" />
              <span>{settings.phone}</span>
            </div>
          </div>

          {/* Right: Actions, Notifications & Profile */}
          <div className="flex items-center gap-3">
            {/* Quick Register Patient Button */}
            {onOpenNewPatient && (
              <button
                onClick={onOpenNewPatient}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-lg shadow-sm transition-colors"
              >
                <UserPlus className="w-4 h-4" />
                <span className="hidden sm:inline">Add Patient</span>
              </button>
            )}

            {/* Alerts pill */}
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
                  {user?.avatar || user?.name?.charAt(0) || 'U'}
                </div>
                <div className="hidden md:flex flex-col text-left">
                  <span className="text-xs font-semibold text-slate-800 leading-tight">
                    {user?.name || 'Authorized User'}
                  </span>
                  <span className="text-[10px] text-slate-500 capitalize">
                    {user?.role?.replace('_', ' ') || 'Staff'}
                  </span>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in">
                  <div className="px-3 py-2 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-800">{user?.name}</p>
                    <p className="text-[11px] text-slate-500">{user?.email || 'Logged in'}</p>
                    <p className="text-[10px] text-brand-600 font-medium mt-1">{ROLE_LABELS[user?.role]}</p>
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
