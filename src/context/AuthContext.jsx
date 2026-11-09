import React, { createContext, useContext, useState, useEffect } from 'react';
import { storage } from '../services/supabase';

const AuthContext = createContext();

export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  LAB_ADMIN: 'super_admin',
  RECEPTIONIST: 'super_admin',
  TECHNICIAN: 'super_admin',
  PATHOLOGIST: 'super_admin',
  PATIENT: 'patient'
};

export const ROLE_LABELS = {
  super_admin: 'Master Admin (MD NEJAM ANSARI)',
  patient: 'Patient Portal'
};

export const ADMIN_USER = {
  id: 'admin-1',
  name: 'MD NEJAM ANSARI',
  role: 'super_admin',
  title: 'Super Admin & Lab Director',
  phone: '8434776690',
  email: 'admin@arphadiagnosis.com',
  avatar: '👨‍💼',
  status: 'active'
};

export function AuthProvider({ children }) {
  // Single Unified Admin
  const [user, setUser] = useState(() => {
    return storage.get('auth_user', ADMIN_USER);
  });

  const [patientUser, setPatientUser] = useState(() => {
    return storage.get('auth_patient', null);
  });

  useEffect(() => {
    if (user) {
      storage.set('auth_user', user);
    } else {
      storage.remove('auth_user');
    }
  }, [user]);

  useEffect(() => {
    if (patientUser) {
      storage.set('auth_patient', patientUser);
    } else {
      storage.remove('auth_patient');
    }
  }, [patientUser]);

  const loginAdmin = () => {
    setUser(ADMIN_USER);
    setPatientUser(null);
    return ADMIN_USER;
  };

  const loginPatient = (patient) => {
    setPatientUser(patient);
    setUser({
      id: patient.id,
      name: patient.name,
      patientId: patient.patientId,
      phone: patient.phone,
      role: 'patient',
      avatar: '👤'
    });
  };

  const logout = () => {
    setUser(ADMIN_USER);
    setPatientUser(null);
    storage.remove('auth_patient');
  };

  // The Single Admin has FULL ALL-ACCESS permissions across all modules
  const isSuperAdmin = user?.role === 'super_admin' || !user?.role || user?.role !== 'patient';
  const canApproveReports = isSuperAdmin;
  const canEnterResults = isSuperAdmin;
  const canManageBilling = isSuperAdmin;
  const canRegisterPatients = isSuperAdmin;
  const canManageTests = isSuperAdmin;
  const canManageStaff = isSuperAdmin;

  return (
    <AuthContext.Provider value={{
      user: user || ADMIN_USER,
      patientUser,
      loginAdmin,
      loginPatient,
      logout,
      isSuperAdmin,
      canApproveReports,
      canEnterResults,
      canManageBilling,
      canRegisterPatients,
      canManageTests,
      canManageStaff
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
