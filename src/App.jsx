import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LabProvider } from './context/LabContext';

// Components
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import NewPatientModal from './components/NewPatientModal';

// Pages
import Dashboard from './pages/Dashboard';
import Patients from './pages/Patients';
import PatientDetail from './pages/PatientDetail';
import TestsCatalog from './pages/TestsCatalog';
import Samples from './pages/Samples';
import Reports from './pages/Reports';
import ReportEditor from './pages/ReportEditor';
import ReportView from './pages/ReportView';
import VerifyReport from './pages/VerifyReport';
import Billing from './pages/Billing';
import Inventory from './pages/Inventory';
import Expenses from './pages/Expenses';
import Staff from './pages/Staff';
import AuditLogs from './pages/AuditLogs';
import PatientPortal from './pages/PatientPortal';
import Settings from './pages/Settings';
import Login from './pages/Login';

function AppLayout({ children, onOpenNewPatient }) {
  const location = useLocation();
  const isVerifyPage = location.pathname.startsWith('/verify');
  const isLoginPage = location.pathname === '/login';

  if (isVerifyPage || isLoginPage) {
    return <main className="min-h-screen">{children}</main>;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar onOpenNewPatient={onOpenNewPatient} />
      <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-6">
        <Sidebar />
        <main className="flex-1 min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}

function MainRoutes() {
  const [isNewPatientModalOpen, setIsNewPatientModalOpen] = useState(false);

  return (
    <AppLayout onOpenNewPatient={() => setIsNewPatientModalOpen(true)}>
      <Routes>
        <Route path="/" element={<Dashboard onOpenNewPatient={() => setIsNewPatientModalOpen(true)} />} />
        <Route path="/patients" element={<Patients />} />
        <Route path="/patients/:id" element={<PatientDetail />} />
        <Route path="/tests" element={<TestsCatalog />} />
        <Route path="/samples" element={<Samples />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/reports/edit/:id" element={<ReportEditor />} />
        <Route path="/reports/:id" element={<ReportView />} />
        <Route path="/verify/:token" element={<VerifyReport />} />
        <Route path="/billing" element={<Billing />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/expenses" element={<Expenses />} />
        <Route path="/staff" element={<Staff />} />
        <Route path="/audit-logs" element={<AuditLogs />} />
        <Route path="/portal" element={<PatientPortal />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Global New Patient Modal */}
      <NewPatientModal
        isOpen={isNewPatientModalOpen}
        onClose={() => setIsNewPatientModalOpen(false)}
      />
    </AppLayout>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <LabProvider>
          <MainRoutes />
        </LabProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
