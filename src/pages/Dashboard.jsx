import React from 'react';
import { Link } from 'react-router-dom';
import { useLab } from '../context/LabContext';
import { useAuth } from '../context/AuthContext';
import {
  Users,
  TestTubes,
  FileCheck2,
  Clock,
  IndianRupee,
  TrendingUp,
  AlertTriangle,
  ArrowUpRight,
  UserPlus,
  PlusCircle,
  FileText,
  Activity,
  CheckCircle2,
  Calendar,
  ShieldCheck,
  Building
} from 'lucide-react';

export default function Dashboard({ onOpenNewPatient }) {
  const { user } = useAuth();
  const { patients, tests, samples, reports, invoices, expenses, auditLogs, settings } = useLab();

  // Metrics Calculations
  const totalPatients = patients.length;
  const today = new Date().toISOString().split('T')[0];
  const todaysPatients = patients.filter(p => p.registeredAt?.startsWith(today)).length;

  const totalTests = samples.reduce((acc, s) => acc + (s.testNames?.length || 1), 0);
  const pendingReports = reports.filter(r => r.status === 'draft' || r.status === 'under_review').length;
  const completedReports = reports.filter(r => r.status === 'approved').length;

  const todaysCollection = invoices
    .filter(inv => inv.createdAt?.startsWith(today))
    .reduce((acc, inv) => acc + Number(inv.paid || 0), 0);

  const monthlyRevenue = invoices.reduce((acc, inv) => acc + Number(inv.paid || 0), 0);
  const totalExpensesAmount = expenses.reduce((acc, exp) => acc + Number(exp.amount || 0), 0);
  const netEarnings = monthlyRevenue - totalExpensesAmount;

  // Abnormal test counts
  const abnormalReports = reports.filter(r => r.isAbnormal).length;

  // Recent 5 activities
  const recentActivities = auditLogs.slice(0, 6);

  // Department distribution
  const deptCounts = tests.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      
      {/* Top Banner / Welcome */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-brand-900 via-brand-800 to-cyan-900 p-6 sm:p-8 text-white shadow-lg">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-cyan-400/20 via-transparent to-transparent pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-cyan-200 border border-white/10 mb-3">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>{settings.accreditation}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {user?.name || 'Administrator'}
            </h1>
            <p className="mt-1 text-sm text-cyan-100 max-w-2xl leading-relaxed">
              Arpha Clinical Laboratory Intelligence System is active. All analyzer interfaces, sample queues, and pathologist sign-off workflows are synchronized.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenNewPatient}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-brand-900 hover:bg-cyan-50 font-semibold text-xs shadow-md hover:shadow transition-all"
            >
              <UserPlus className="w-4 h-4 text-brand-700" />
              <span>Register Patient</span>
            </button>
            <Link
              to="/reports"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs shadow-md transition-all"
            >
              <FileCheck2 className="w-4 h-4" />
              <span>Sign Off Reports</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Primary KPI Grid (8 Cards) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        {/* Total Patients */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-brand-300 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Patients</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">{totalPatients}</div>
          <div className="mt-2 text-xs text-slate-500 flex items-center gap-1">
            <span className="font-semibold text-emerald-600">+{todaysPatients} registered today</span>
          </div>
        </div>

        {/* Today's Collection */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-brand-300 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Today's Collection</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <IndianRupee className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">₹{todaysCollection.toLocaleString('en-IN')}</div>
          <div className="mt-2 text-xs text-slate-500 flex items-center gap-1">
            <span className="text-emerald-600 font-semibold">Live POS Cash + UPI</span>
          </div>
        </div>

        {/* Pending Reports */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-brand-300 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Pending Sign-off</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">{pendingReports}</div>
          <div className="mt-2 text-xs text-slate-500 flex items-center gap-1">
            <span className="text-amber-700 font-medium">Awaiting Pathologist</span>
          </div>
        </div>

        {/* Completed Reports */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-brand-300 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Approved Reports</span>
            <div className="w-9 h-9 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
              <FileCheck2 className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">{completedReports}</div>
          <div className="mt-2 text-xs text-slate-500 flex items-center gap-1">
            <span className="text-cyan-700 font-medium">QR Verified & Downloadable</span>
          </div>
        </div>

        {/* Total Tests Done */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-brand-300 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Tests Processed</span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <TestTubes className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">{totalTests}</div>
          <div className="mt-2 text-xs text-slate-500">
            Across {tests.length} catalog panels
          </div>
        </div>

        {/* Monthly Revenue */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-brand-300 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Revenue</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">₹{monthlyRevenue.toLocaleString('en-IN')}</div>
          <div className="mt-2 text-xs text-slate-500">
            Current billing cycle
          </div>
        </div>

        {/* Total Expenses */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-brand-300 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Expenses</span>
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <IndianRupee className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">₹{totalExpensesAmount.toLocaleString('en-IN')}</div>
          <div className="mt-2 text-xs text-slate-500">
            Reagents, kits & overhead
          </div>
        </div>

        {/* Net Margin */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-brand-300 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Net Lab Profit</span>
            <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <ArrowUpRight className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-700">₹{netEarnings.toLocaleString('en-IN')}</div>
          <div className="mt-2 text-xs text-emerald-600 font-semibold">
            Health margin: {monthlyRevenue > 0 ? `${Math.round((netEarnings / monthlyRevenue) * 100)}%` : 'Active'}
          </div>
        </div>

      </div>

      {/* Database Empty Welcome Callout */}
      {totalPatients === 0 && (
        <div className="p-6 bg-gradient-to-r from-brand-50 to-cyan-50 border-2 border-brand-200 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-sm font-black text-brand-950">Laboratory Database is Clean & Fresh!</h3>
            <p className="text-xs text-brand-700">All demo data has been cleared. You can start adding your own real patients, doctors, and tests now.</p>
          </div>
          <button
            onClick={onOpenNewPatient}
            className="px-5 py-2.5 bg-brand-700 hover:bg-brand-800 text-white font-bold text-xs rounded-xl shadow-md transition-all shrink-0 flex items-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add First Real Patient</span>
          </button>
        </div>
      )}

      {/* Main Section: Chart + Pending Worklist */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Revenue and Department Analytics */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Weekly Diagnostic Volume & Revenue</h2>
              <p className="text-xs text-slate-500">Daily sample intake and patient billed amount</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-700 bg-brand-50 px-2.5 py-1 rounded-lg">
                <span className="w-2 h-2 rounded-full bg-brand-600"></span> Revenue
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-700 bg-cyan-50 px-2.5 py-1 rounded-lg">
                <span className="w-2 h-2 rounded-full bg-cyan-500"></span> Tests
              </span>
            </div>
          </div>

          {/* Clean SVG Trend Chart */}
          <div className="pt-4">
            <div className="grid grid-cols-7 gap-2 items-end h-48 border-b border-slate-200 pb-2">
              {[
                { day: 'Mon', rev: 4200, tests: 18, pct: 45 },
                { day: 'Tue', rev: 6100, tests: 24, pct: 65 },
                { day: 'Wed', rev: 5300, tests: 20, pct: 55 },
                { day: 'Thu', rev: 7800, tests: 32, pct: 82 },
                { day: 'Fri', rev: 8900, tests: 38, pct: 95 },
                { day: 'Sat', rev: 7400, tests: 29, pct: 78 },
                { day: 'Sun (Today)', rev: todaysCollection || 2450, tests: 12, pct: 35 }
              ].map((bar, i) => (
                <div key={i} className="flex flex-col items-center gap-2 group h-full justify-end">
                  <div className="relative w-full flex justify-center gap-1.5 items-end h-full">
                    {/* Revenue Bar */}
                    <div
                      style={{ height: `${bar.pct}%` }}
                      className="w-4 sm:w-6 bg-gradient-to-t from-brand-700 to-brand-500 rounded-t-md transition-all group-hover:brightness-110 shadow-sm"
                      title={`Revenue: ₹${bar.rev}`}
                    ></div>
                    {/* Tests Bar */}
                    <div
                      style={{ height: `${Math.round(bar.pct * 0.75)}%` }}
                      className="w-3 sm:w-4 bg-cyan-400 rounded-t-sm transition-all group-hover:brightness-110"
                      title={`Tests: ${bar.tests}`}
                    ></div>
                  </div>
                  <span className="text-[11px] font-semibold text-slate-500 group-hover:text-brand-700">
                    {bar.day}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
              <span>Avg Turnaround Time (TAT): <strong className="text-slate-800">3.8 Hours</strong></span>
              <span>Sample Rejection Rate: <strong className="text-emerald-700">&lt; 0.5%</strong></span>
            </div>
          </div>

          {/* Test Departments Breakdown */}
          <div className="pt-4 border-t border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Diagnostic Panels By Department</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {Object.entries(deptCounts).map(([dept, count]) => (
                <div key={dept} className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                  <p className="text-[11px] text-slate-500 font-medium">{dept}</p>
                  <p className="text-lg font-bold text-slate-800 mt-0.5">{count} Tests</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Quick Actions & Live Audit Activity */}
        <div className="space-y-6">
          
          {/* Pathologist Verification Alert */}
          {pendingReports > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-xs font-bold text-amber-900">
                    {pendingReports} Reports Awaiting Final Medical Sign-off
                  </h3>
                  <p className="text-[11px] text-amber-800 mt-1 leading-relaxed">
                    Under NABL protocols, raw values entered by technicians require validation by an Authorized Pathologist before issuance to patients.
                  </p>
                  <Link
                    to="/reports"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-900 hover:text-amber-950 mt-2.5 underline"
                  >
                    Open Pathologist Review Desk &rarr;
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Recent Lab Audit Trail */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Live Compliance Audit Feed</h3>
              <Link to="/audit-logs" className="text-xs font-semibold text-brand-600 hover:text-brand-800">
                View All
              </Link>
            </div>

            <div className="space-y-3">
              {recentActivities.map((log) => (
                <div key={log.id} className="text-xs border-l-2 border-brand-500 pl-3 py-1 space-y-0.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">{log.action.replace(/_/g, ' ')}</span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-slate-600 text-[11px] leading-tight">{log.details}</p>
                  <p className="text-[10px] text-slate-400">By: <span className="font-medium text-slate-700">{log.user}</span></p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Direct Links */}
          <div className="bg-gradient-to-br from-brand-50 to-cyan-50 border border-brand-200/60 rounded-2xl p-5 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-brand-900">Fast Workflow Navigation</h3>
            <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
              <Link to="/patients" className="p-2.5 bg-white rounded-xl border border-slate-200 hover:border-brand-400 text-slate-800 text-center shadow-xs">
                Patient Registry
              </Link>
              <Link to="/billing" className="p-2.5 bg-white rounded-xl border border-slate-200 hover:border-brand-400 text-slate-800 text-center shadow-xs">
                Billing Desk
              </Link>
              <Link to="/samples" className="p-2.5 bg-white rounded-xl border border-slate-200 hover:border-brand-400 text-slate-800 text-center shadow-xs">
                Sample Barcoding
              </Link>
              <Link to="/portal" className="p-2.5 bg-brand-600 text-white rounded-xl hover:bg-brand-700 text-center shadow-xs">
                Patient Self-Service
              </Link>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
