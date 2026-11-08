import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth, ROLES } from '../context/AuthContext';
import { useLab } from '../context/LabContext';
import {
  LayoutDashboard,
  Users,
  TestTubes,
  Droplet,
  FileText,
  Receipt,
  Boxes,
  IndianRupee,
  UserCheck,
  History,
  Settings,
  QrCode,
  Sparkles,
  AlertCircle
} from 'lucide-react';

export default function Sidebar() {
  const { user } = useAuth();
  const { reports, samples, invoices, inventory } = useLab();

  const pendingReports = reports.filter(r => r.status === 'under_review' || r.status === 'draft').length;
  const processingSamples = samples.filter(s => s.status === 'processing').length;
  const lowStockItems = inventory.filter(i => i.inStock <= i.minAlert).length;
  const unpaidInvoices = invoices.filter(i => i.paymentStatus !== 'paid').length;

  const isPatient = user?.role === ROLES.PATIENT;

  const navItems = [
    {
      to: '/',
      label: 'Executive Dashboard',
      icon: LayoutDashboard,
      roles: [ROLES.SUPER_ADMIN, ROLES.LAB_ADMIN, ROLES.PATHOLOGIST, ROLES.TECHNICIAN, ROLES.RECEPTIONIST]
    },
    {
      to: '/patients',
      label: 'Patient Management',
      icon: Users,
      badge: null,
      roles: [ROLES.SUPER_ADMIN, ROLES.LAB_ADMIN, ROLES.RECEPTIONIST, ROLES.PATHOLOGIST, ROLES.TECHNICIAN]
    },
    {
      to: '/billing',
      label: 'Billing & Invoices',
      icon: Receipt,
      badge: unpaidInvoices > 0 ? `${unpaidInvoices} due` : null,
      badgeColor: 'bg-amber-100 text-amber-800',
      roles: [ROLES.SUPER_ADMIN, ROLES.LAB_ADMIN, ROLES.RECEPTIONIST]
    },
    {
      to: '/samples',
      label: 'Sample Management',
      icon: Droplet,
      badge: processingSamples > 0 ? `${processingSamples} proc` : null,
      badgeColor: 'bg-blue-100 text-blue-800',
      roles: [ROLES.SUPER_ADMIN, ROLES.LAB_ADMIN, ROLES.TECHNICIAN, ROLES.PATHOLOGIST]
    },
    {
      to: '/reports',
      label: 'Laboratory Reports',
      icon: FileText,
      badge: pendingReports > 0 ? `${pendingReports} rev` : null,
      badgeColor: 'bg-rose-100 text-rose-800 font-bold',
      roles: [ROLES.SUPER_ADMIN, ROLES.LAB_ADMIN, ROLES.PATHOLOGIST, ROLES.TECHNICIAN]
    },
    {
      to: '/tests',
      label: 'Test Catalog & Prices',
      icon: TestTubes,
      roles: [ROLES.SUPER_ADMIN, ROLES.LAB_ADMIN, ROLES.PATHOLOGIST, ROLES.TECHNICIAN, ROLES.RECEPTIONIST]
    },
    {
      to: '/inventory',
      label: 'Reagent Inventory',
      icon: Boxes,
      badge: lowStockItems > 0 ? `${lowStockItems} low` : null,
      badgeColor: 'bg-rose-100 text-rose-800',
      roles: [ROLES.SUPER_ADMIN, ROLES.LAB_ADMIN, ROLES.TECHNICIAN]
    },
    {
      to: '/expenses',
      label: 'Lab Expenses',
      icon: IndianRupee,
      roles: [ROLES.SUPER_ADMIN, ROLES.LAB_ADMIN]
    },
    {
      to: '/staff',
      label: 'Staff Management',
      icon: UserCheck,
      roles: [ROLES.SUPER_ADMIN, ROLES.LAB_ADMIN]
    },
    {
      to: '/audit-logs',
      label: 'Compliance Audit Logs',
      icon: History,
      roles: [ROLES.SUPER_ADMIN, ROLES.LAB_ADMIN, ROLES.PATHOLOGIST]
    },
    {
      to: '/portal',
      label: 'Patient Portal',
      icon: QrCode,
      highlight: true,
      roles: [ROLES.SUPER_ADMIN, ROLES.LAB_ADMIN, ROLES.RECEPTIONIST, ROLES.PATHOLOGIST, ROLES.TECHNICIAN, ROLES.PATIENT]
    },
    {
      to: '/settings',
      label: 'Lab Settings',
      icon: Settings,
      roles: [ROLES.SUPER_ADMIN, ROLES.LAB_ADMIN]
    }
  ];

  // Filter items allowed for user role
  const allowedItems = navItems.filter(item => {
    if (!item.roles) return true;
    return item.roles.includes(user?.role);
  });

  return (
    <aside className="no-print w-64 bg-white border-r border-slate-200 min-h-[calc(100vh-4rem)] flex flex-col justify-between shrink-0">
      <div className="p-4 space-y-6">
        
        {/* Lab Branch Quick Info */}
        <div className="bg-gradient-to-br from-brand-50 to-brand-100/60 border border-brand-200/80 rounded-xl p-3.5">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
            <span className="text-[11px] font-bold uppercase tracking-wider text-brand-900">Main Lab Operational</span>
          </div>
          <p className="text-xs text-brand-700 font-medium">Bariatu Medical Plaza</p>
          <div className="mt-2 pt-2 border-t border-brand-200/60 flex items-center justify-between text-[11px] text-slate-600">
            <span>LIS Status:</span>
            <span className="font-semibold text-emerald-700 flex items-center gap-1">
              ● Online (Live)
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1">
          <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            {isPatient ? 'Patient Services' : 'Diagnostic Operations'}
          </div>

          {allowedItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                    isActive
                      ? 'bg-brand-600 text-white shadow-sm shadow-brand-500/30'
                      : item.highlight
                      ? 'text-brand-700 bg-brand-50/70 hover:bg-brand-100 border border-brand-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-3">
                      <Icon
                        className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                          isActive ? 'text-white' : item.highlight ? 'text-brand-600' : 'text-slate-400 group-hover:text-slate-600'
                        }`}
                      />
                      <span>{item.label}</span>
                    </div>

                    {item.badge && (
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                          isActive ? 'bg-white/20 text-white' : item.badgeColor || 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Footer System Disclaimer */}
      <div className="p-4 border-t border-slate-200 bg-slate-50/70 text-[11px] text-slate-500 space-y-1">
        <div className="flex items-center justify-between font-medium text-slate-700">
          <span>Arpha LIS v2.4</span>
          <span className="text-emerald-600">✓ Supabase Synced</span>
        </div>
        <p className="text-[10px] text-slate-400 leading-tight">
          NABL ISO-15189 Compliant Pathology Workflow.
        </p>
      </div>
    </aside>
  );
}
