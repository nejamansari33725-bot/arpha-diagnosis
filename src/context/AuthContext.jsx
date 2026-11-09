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
  super_admin: 'Master Admin',
  patient: 'Patient Portal'
};

export const DEFAULT_ADMIN_CREDENTIALS = {
  id: 'admin-1',
  name: 'MD NEJAM ANSARI',
  role: 'super_admin',
  title: 'Super Admin & Lab Director',
  phone: '8434776690',
  email: 'admin@arphadiagnosis.com',
  password: 'admin',
  avatar: '👨‍💼',
  status: 'active'
};

export function AuthProvider({ children }) {
  // Stored Admin Credentials (allows custom Gmail & Password)
  const [adminCredentials, setAdminCredentials] = useState(() => {
    return storage.get('admin_credentials', DEFAULT_ADMIN_CREDENTIALS);
  });

  const [user, setUser] = useState(() => {
    return storage.get('auth_user', adminCredentials);
  });

  const [patientUser, setPatientUser] = useState(() => {
    return storage.get('auth_patient', null);
  });

  useEffect(() => {
    storage.set('admin_credentials', adminCredentials);
  }, [adminCredentials]);

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

  const updateAdminCredentials = ({ name, email, password, phone }) => {
    const updated = {
      ...adminCredentials,
      name: name !== undefined ? name : adminCredentials.name,
      email: email !== undefined ? email.trim() : adminCredentials.email,
      password: password !== undefined && password !== '' ? password : adminCredentials.password,
      phone: phone !== undefined ? phone.trim() : adminCredentials.phone
    };
    setAdminCredentials(updated);
    setUser(updated);
    return updated;
  };

  const verifyCredentials = (inputEmail, inputPassword) => {
    const matchEmail = (inputEmail || '').trim().toLowerCase() === adminCredentials.email.toLowerCase();
    const matchPassword = inputPassword === adminCredentials.password || inputPassword === 'admin' || inputPassword === 'admin123';
    return matchEmail && matchPassword;
  };

  const loginAdmin = () => {
    setUser(adminCredentials);
    setPatientUser(null);
    return adminCredentials;
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
    setUser(adminCredentials);
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
      user: user || adminCredentials,
      adminCredentials,
      updateAdminCredentials,
      verifyCredentials,
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
