import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_TESTS, INITIAL_PATIENTS, INITIAL_STAFF, INITIAL_INVENTORY, INITIAL_EXPENSES } from '../data/initialData';
import { storage } from '../services/supabase';
import { useAuth } from './AuthContext';

const LabContext = createContext();

export function LabProvider({ children }) {
  const { user } = useAuth();

  // 1-time automatic wipe of demo records for clean production state
  if (typeof window !== 'undefined') {
    const isWiped = localStorage.getItem('arpha_clean_slate_2026');
    if (!isWiped) {
      localStorage.removeItem('arpha_patients');
      localStorage.removeItem('arpha_samples');
      localStorage.removeItem('arpha_invoices');
      localStorage.removeItem('arpha_reports');
      localStorage.removeItem('arpha_expenses');
      localStorage.setItem('arpha_clean_slate_2026', 'true');
    }
  }

  // 1. LAB SETTINGS
  const [settings, setSettings] = useState(() => {
    return storage.get('settings', {
      labName: 'ARPHA DIAGNOSIS',
      tagline: 'Advanced Pathology & Diagnostic Laboratory',
      accreditation: 'NABL Accredited & ISO 9001:2015 Certified Lab',
      address: 'Health Plaza, Medical College Road, Bariatu',
      cityState: 'Ranchi, Jharkhand - 834009',
      phone: '+91 84347 76690',
      altPhone: '+91 98765 43210',
      email: 'info@arphadiagnosis.com',
      website: 'https://arphadiagnosis.vercel.app',
      pathologistName: 'Dr. Arpha Tabassum (MBBS, MD Pathology)',
      pathologistReg: 'Reg No: MCI/884219/2018',
      labInchargeName: 'MD NEJAM ANSARI (Senior Biochemist)',
      headerLogoText: 'ARPHA DIAGNOSIS',
      qrVerificationBaseUrl: 'https://arphadiagnosis.vercel.app/verify'
    });
  });

  // 2. PATIENTS (Clean - 0 demo records)
  const [patients, setPatients] = useState(() => {
    return storage.get('patients', []);
  });

  // 3. TEST CATALOG (Standard clinical test profiles intact)
  const [tests, setTests] = useState(() => {
    return storage.get('tests', INITIAL_TESTS);
  });

  // 4. SAMPLES (Clean - 0 demo records)
  const [samples, setSamples] = useState(() => {
    return storage.get('samples', []);
  });

  // 5. INVOICES (Clean - 0 demo records)
  const [invoices, setInvoices] = useState(() => {
    return storage.get('invoices', []);
  });

  // 6. LAB REPORTS (Clean - 0 demo records)
  const [reports, setReports] = useState(() => {
    return storage.get('reports', []);
  });

  // 7. INVENTORY
  const [inventory, setInventory] = useState(() => {
    return storage.get('inventory', INITIAL_INVENTORY);
  });

  // 8. EXPENSES (Clean - 0 demo records)
  const [expenses, setExpenses] = useState(() => {
    return storage.get('expenses', []);
  });

  // 9. STAFF
  const [staff, setStaff] = useState(() => {
    return storage.get('staff', INITIAL_STAFF);
  });

  // 10. AUDIT LOGS
  const [auditLogs, setAuditLogs] = useState(() => {
    return storage.get('audit_logs', [
      { id: 'log-1', action: 'DATABASE_INITIALIZED', details: 'All demo records cleared. Lab is ready for fresh real patient intake.', user: 'MD NEJAM ANSARI', timestamp: new Date().toISOString() }
    ]);
  });

  // Sync to local storage
  useEffect(() => { storage.set('settings', settings); }, [settings]);
  useEffect(() => { storage.set('patients', patients); }, [patients]);
  useEffect(() => { storage.set('tests', tests); }, [tests]);
  useEffect(() => { storage.set('samples', samples); }, [samples]);
  useEffect(() => { storage.set('invoices', invoices); }, [invoices]);
  useEffect(() => { storage.set('reports', reports); }, [reports]);
  useEffect(() => { storage.set('inventory', inventory); }, [inventory]);
  useEffect(() => { storage.set('expenses', expenses); }, [expenses]);
  useEffect(() => { storage.set('staff', staff); }, [staff]);
  useEffect(() => { storage.set('audit_logs', auditLogs); }, [auditLogs]);

  // Log audit action
  const logAudit = (action, details) => {
    const newLog = {
      id: `log-${Date.now()}`,
      action,
      details,
      user: user?.name || 'System / Admin',
      timestamp: new Date().toISOString()
    };
    setAuditLogs(prev => [newLog, ...prev.slice(0, 99)]);
  };

  // PATIENT ACTIONS
  const addPatient = (patientData) => {
    const nextNum = patients.length + 1;
    const patientId = `ARPHA-${new Date().getFullYear()}-${String(nextNum).padStart(4, '0')}`;
    const newPatient = {
      id: `pat-${Date.now()}`,
      patientId,
      ...patientData,
      totalVisits: 1,
      status: 'active',
      registeredAt: new Date().toISOString()
    };
    setPatients(prev => [newPatient, ...prev]);
    logAudit('PATIENT_REGISTERED', `New patient registered: ${newPatient.name} (ID: ${patientId})`);
    return newPatient;
  };

  const updatePatient = (id, updatedData) => {
    setPatients(prev => prev.map(p => p.id === id ? { ...p, ...updatedData } : p));
    logAudit('PATIENT_UPDATED', `Updated patient record: ID ${id}`);
  };

  const deletePatient = (id) => {
    setPatients(prev => prev.filter(p => p.id !== id));
    logAudit('PATIENT_DELETED', `Deleted patient record ID: ${id}`);
  };

  // INVOICE & BILLING ACTIONS
  const createInvoice = (invoiceData) => {
    const nextNum = invoices.length + 1;
    const invoiceNumber = `INV-${new Date().getFullYear()}-${String(nextNum).padStart(4, '0')}`;
    const newInvoice = {
      id: `inv-${Date.now()}`,
      invoiceNumber,
      ...invoiceData,
      createdAt: new Date().toISOString()
    };
    setInvoices(prev => [newInvoice, ...prev]);
    logAudit('INVOICE_GENERATED', `Generated invoice ${invoiceNumber} for ₹${newInvoice.total}`);
    return newInvoice;
  };

  const updateInvoicePayment = (id, paidAmount, paymentMethod = 'Cash') => {
    setInvoices(prev => prev.map(inv => {
      if (inv.id !== id) return inv;
      const newPaid = Number(inv.paid) + Number(paidAmount);
      const newDue = Math.max(0, Number(inv.total) - newPaid);
      const status = newDue === 0 ? 'paid' : 'partial';
      return {
        ...inv,
        paid: newPaid,
        due: newDue,
        paymentStatus: status,
        paymentMethod
      };
    }));
    logAudit('PAYMENT_RECEIVED', `Payment updated for invoice ${id}: ₹${paidAmount}`);
  };

  // SAMPLE ACTIONS
  const createSample = (sampleData) => {
    const nextNum = samples.length + 1;
    const sampleId = `SMP-${new Date().getFullYear()}-${String(nextNum).padStart(4, '0')}`;
    const barcode = `ARPHA${Date.now().toString().slice(-8)}`;
    const newSample = {
      id: `smp-${Date.now()}`,
      sampleId,
      barcode,
      status: 'collected',
      collectedAt: new Date().toISOString(),
      collectorName: user?.name || 'Phlebotomist',
      ...sampleData
    };
    setSamples(prev => [newSample, ...prev]);
    logAudit('SAMPLE_COLLECTED', `Sample collected: ${sampleId} (Barcode: ${barcode})`);
    return newSample;
  };

  const updateSampleStatus = (id, status, rejectionReason = null) => {
    setSamples(prev => prev.map(s => s.id === id ? { ...s, status, rejectionReason } : s));
    logAudit('SAMPLE_STATUS', `Sample ${id} status updated to ${status}`);
  };

  // REPORT ACTIONS
  const createReport = (reportData) => {
    const nextNum = reports.length + 1;
    const reportNumber = `REP-${new Date().getFullYear()}-${String(nextNum).padStart(4, '0')}`;
    const qrToken = `ARPHA-REP-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
    const newReport = {
      id: `rep-${Date.now()}`,
      reportNumber,
      qrToken,
      status: 'draft',
      createdAt: new Date().toISOString(),
      technicianName: user?.name || 'Technician',
      technicianEnteredAt: new Date().toISOString(),
      ...reportData
    };
    setReports(prev => [newReport, ...prev]);
    logAudit('REPORT_DRAFT_CREATED', `Draft created: ${reportNumber} for ${newReport.testName}`);
    return newReport;
  };

  const updateReportResults = (id, results, clinicalImpression = '', status = 'under_review') => {
    // Check if any result is abnormal
    const hasAbnormal = results.some(r => r.flag === 'HIGH' || r.flag === 'LOW' || r.flag === 'ABNORMAL');
    setReports(prev => prev.map(rep => {
      if (rep.id !== id) return rep;
      return {
        ...rep,
        results,
        clinicalImpression,
        status,
        isAbnormal: hasAbnormal,
        updatedAt: new Date().toISOString()
      };
    }));
    logAudit('REPORT_RESULTS_SAVED', `Results entered for report ${id} (Status: ${status})`);
  };

  // Pathologist Verification & Final Approval (STRICT PATHOLOGIST / SUPER ADMIN ROLE)
  const approveReport = (id, pathologistNote = '') => {
    setReports(prev => prev.map(rep => {
      if (rep.id !== id) return rep;
      return {
        ...rep,
        status: 'approved',
        pathologistName: user?.name || settings.pathologistName,
        pathologistApprovedAt: new Date().toISOString(),
        pathologistNote: pathologistNote || rep.pathologistNote
      };
    }));
    logAudit('REPORT_APPROVED', `Report ${id} verified and officially approved by ${user?.name || 'Pathologist'}`);
  };

  // TEST ACTIONS
  const addTest = (newTestData) => {
    const newTest = {
      id: `test-${Date.now()}`,
      isActive: true,
      ...newTestData
    };
    setTests(prev => [...prev, newTest]);
    logAudit('TEST_CATALOG_ADDED', `New test added: ${newTest.name} (₹${newTest.price})`);
  };

  const updateTest = (id, updatedTestData) => {
    setTests(prev => prev.map(t => t.id === id ? { ...t, ...updatedTestData } : t));
    logAudit('TEST_CATALOG_UPDATED', `Updated test ID ${id}`);
  };

  // INVENTORY ACTIONS
  const addInventoryItem = (itemData) => {
    const newItem = { id: `inv-${Date.now()}`, ...itemData };
    setInventory(prev => [...prev, newItem]);
    logAudit('INVENTORY_ADDED', `Added inventory stock: ${newItem.name}`);
  };

  const updateStock = (id, newQuantity) => {
    setInventory(prev => prev.map(item => item.id === id ? { ...item, inStock: Number(newQuantity) } : item));
    logAudit('INVENTORY_UPDATED', `Updated stock for item ${id} to ${newQuantity}`);
  };

  // EXPENSE ACTIONS
  const addExpense = (expenseData) => {
    const newExpense = {
      id: `exp-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      ...expenseData
    };
    setExpenses(prev => [newExpense, ...prev]);
    logAudit('EXPENSE_RECORDED', `Expense logged: ${newExpense.title} (₹${newExpense.amount})`);
  };

  // SETTINGS UPDATE
  const updateSettings = (newSettings) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
    logAudit('SETTINGS_UPDATED', `Laboratory profile settings updated.`);
  };

  // ALL-IN-ONE REGISTRATION (PATIENT + DOCTOR + SELECTED TESTS + INSTANT BILLING & SAMPLES)
  const registerPatientWithBillingAndTests = ({ patientData, selectedTestIds = [], billingData = {} }) => {
    // 1. Add Patient
    const nextNum = patients.length + 1;
    const patientId = `ARPHA-${new Date().getFullYear()}-${String(nextNum).padStart(4, '0')}`;
    const newPatient = {
      id: `pat-${Date.now()}`,
      patientId,
      ...patientData,
      totalVisits: 1,
      status: 'active',
      registeredAt: new Date().toISOString()
    };
    setPatients(prev => [newPatient, ...prev]);
    logAudit('PATIENT_REGISTERED', `New patient registered: ${newPatient.name} (ID: ${patientId})`);

    let createdInvoice = null;
    const selectedTestsList = tests.filter(t => selectedTestIds.includes(t.id));

    if (selectedTestsList.length > 0) {
      // 2. Create Invoice
      const subtotal = selectedTestsList.reduce((acc, t) => acc + Number(t.price || 0), 0);
      const discount = Number(billingData.discount || 0);
      const total = Math.max(0, subtotal - discount);
      const paid = billingData.paid !== undefined ? Number(billingData.paid) : total;
      const due = Math.max(0, total - paid);
      const paymentStatus = due === 0 ? 'paid' : (paid > 0 ? 'partial' : 'unpaid');

      const nextInvNum = invoices.length + 1;
      const invoiceNumber = `INV-${new Date().getFullYear()}-${String(nextInvNum).padStart(4, '0')}`;
      createdInvoice = {
        id: `inv-${Date.now()}`,
        invoiceNumber,
        patientId: newPatient.id,
        patientName: newPatient.name,
        patientPhone: newPatient.phone,
        testIds: selectedTestIds,
        testNames: selectedTestsList.map(t => t.name),
        subtotal,
        discount,
        tax: 0,
        total,
        paid,
        due,
        paymentStatus,
        paymentMethod: billingData.paymentMethod || 'Cash',
        createdAt: new Date().toISOString()
      };
      setInvoices(prev => [createdInvoice, ...prev]);
      logAudit('INVOICE_GENERATED', `Generated invoice ${invoiceNumber} for ₹${total}`);

      // 3. Create Sample Intake Record
      const nextSmpNum = samples.length + 1;
      const sampleId = `SMP-${new Date().getFullYear()}-${String(nextSmpNum).padStart(4, '0')}`;
      const barcode = `ARPHA${Date.now().toString().slice(-8)}`;
      const newSample = {
        id: `smp-${Date.now()}`,
        sampleId,
        barcode,
        patientId: newPatient.id,
        patientName: newPatient.name,
        sampleType: selectedTestsList[0]?.sampleType || 'Whole Blood / Serum',
        vialColor: selectedTestsList[0]?.vialColor || 'Lavender',
        testNames: selectedTestsList.map(t => t.name),
        status: 'collected',
        collectedAt: new Date().toISOString(),
        collectorName: 'Phlebotomy Desk'
      };
      setSamples(prev => [newSample, ...prev]);
      logAudit('SAMPLE_COLLECTED', `Sample collected: ${sampleId} for ${newPatient.name}`);

      // 4. Create Lab Report Worklist Items for each selected test
      const newReportsList = selectedTestsList.map((testItem, tIdx) => {
        const nextRepNum = reports.length + tIdx + 1;
        const reportNumber = `REP-${new Date().getFullYear()}-${String(nextRepNum).padStart(4, '0')}`;
        const qrToken = `ARPHA-REP-${Date.now() + tIdx}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
        
        const initialResults = (testItem.parameters || []).map(param => {
          const isFemale = newPatient.gender === 'Female';
          const refMin = isFemale ? (param.minFemale ?? param.minMale) : param.minMale;
          const refMax = isFemale ? (param.maxFemale ?? param.maxMale) : param.maxMale;
          return {
            name: param.name,
            value: param.defaultVal || '',
            unit: param.unit,
            refRange: refMin != null && refMax != null ? `${refMin} - ${refMax}` : 'Reference Range',
            min: refMin,
            max: refMax,
            flag: 'NORMAL'
          };
        });

        return {
          id: `rep-${Date.now() + tIdx}`,
          reportNumber,
          qrToken,
          patientId: newPatient.id,
          patientName: newPatient.name,
          patientAge: newPatient.age,
          patientGender: newPatient.gender,
          patientPhone: newPatient.phone,
          referringDoctor: newPatient.referringDoctor || 'Self / Walk-in',
          testId: testItem.id,
          testName: testItem.name,
          sampleType: testItem.sampleType,
          results: initialResults,
          clinicalImpression: 'Specimen examined in automated clinical analyzer. Correlate clinically.',
          status: 'draft',
          createdAt: new Date().toISOString()
        };
      });

      setReports(prev => [...newReportsList, ...prev]);
    }

    return { patient: newPatient, invoice: createdInvoice, tests: selectedTestsList };
  };

  // STAFF ACTIONS (ADD / EDIT / DELETE STAFF & PASSWORDS)
  const addStaff = (staffData) => {
    const newMember = {
      id: `staff-${Date.now()}`,
      status: 'active',
      avatar: staffData.role === 'pathologist' ? '👩‍⚕️' : staffData.role === 'technician' ? '🔬' : staffData.role === 'receptionist' ? '👩‍💼' : '👨‍⚕️',
      ...staffData
    };
    setStaff(prev => [...prev, newMember]);
    logAudit('STAFF_ADDED', `New staff member added: ${newMember.name} (${newMember.role})`);
    return newMember;
  };

  const updateStaff = (id, updatedData) => {
    setStaff(prev => prev.map(s => s.id === id ? { ...s, ...updatedData } : s));
    logAudit('STAFF_UPDATED', `Staff credentials/details updated for ID: ${id}`);
  };

  const deleteStaff = (id) => {
    setStaff(prev => prev.filter(s => s.id !== id));
    logAudit('STAFF_DELETED', `Staff record deleted: ID ${id}`);
  };

  // COMPLETE DATABASE WIPE / RESET
  const resetAllData = () => {
    setPatients([]);
    setSamples([]);
    setInvoices([]);
    setReports([]);
    setExpenses([]);
    const resetLog = {
      id: `log-${Date.now()}`,
      action: 'DATABASE_RESET',
      details: 'All patient records, bills, samples, and reports cleared by Admin.',
      user: 'MD NEJAM ANSARI',
      timestamp: new Date().toISOString()
    };
    setAuditLogs([resetLog]);
    storage.set('patients', []);
    storage.set('samples', []);
    storage.set('invoices', []);
    storage.set('reports', []);
    storage.set('expenses', []);
    storage.set('audit_logs', [resetLog]);
  };

  return (
    <LabContext.Provider value={{
      settings,
      updateSettings,
      patients,
      addPatient,
      updatePatient,
      deletePatient,
      registerPatientWithBillingAndTests,
      resetAllData,
      tests,
      addTest,
      updateTest,
      samples,
      createSample,
      updateSampleStatus,
      invoices,
      createInvoice,
      updateInvoicePayment,
      reports,
      createReport,
      updateReportResults,
      approveReport,
      inventory,
      addInventoryItem,
      updateStock,
      expenses,
      addExpense,
      staff,
      addStaff,
      updateStaff,
      deleteStaff,
      auditLogs,
      logAudit
    }}>
      {children}
    </LabContext.Provider>
  );
}

export const useLab = () => useContext(LabContext);
