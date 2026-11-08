import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_STAFF } from '../data/initialData';
import { storage } from '../services/supabase';

const AuthContext = createContext();

export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  LAB_ADMIN: 'lab_admin',
  RECEPTIONIST: 'receptionist',
  TECHNICIAN: 'technician',
  PATHOLOGIST: 'pathologist',
  PATIENT: 'patient'
};

export const ROLE_LABELS = {
  super_admin: 'Super Admin (MD Nejam Ansari)',
  lab_admin: 'Lab Administrator',
  receptionist: 'Receptionist / Billing Desk',
  technician: 'Laboratory Technician (DMLT)',
  pathologist: 'Authorized Pathologist (MD)',
  patient: 'Patient Portal'
};

export function AuthProvider({ children }) {
  // Default to Super Admin for immediate testing
  const [user, setUser] = useState(() => {
    return storage.get('auth_user', INITIAL_STAFF[0]);
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

  const loginStaff = (roleOrId, customName = null) => {
    const foundStaff = INITIAL_STAFF.find(s => s.role === roleOrId || s.id === roleOrId);
    if (foundStaff) {
      setUser(foundStaff);
      setPatientUser(null);
      return foundStaff;
    }
    // Generic fallback
    const genericUser = {
      id: `usr-${Date.now()}`,
      name: customName || `Staff (${ROLE_LABELS[roleOrId] || roleOrId})`,
      role: roleOrId,
      phone: '8434776690',
      status: 'active',
      avatar: '👨‍⚕️'
    };
    setUser(genericUser);
    setPatientUser(null);
    return genericUser;
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
    setUser(null);
    setPatientUser(null);
    storage.remove('auth_user');
    storage.remove('auth_patient');
  };

  // Permission helpers
  const canApproveReports = user?.role === ROLES.SUPER_ADMIN || user?.role === ROLES.PATHOLOGIST;
  const canEnterResults = user?.role === ROLES.SUPER_ADMIN || user?.role === ROLES.TECHNICIAN || user?.role === ROLES.PATHOLOGIST;
  const canManageBilling = user?.role === ROLES.SUPER_ADMIN || user?.role === ROLES.LAB_ADMIN || user?.role === ROLES.RECEPTIONIST;
  const canRegisterPatients = user?.role === ROLES.SUPER_ADMIN || user?.role === ROLES.LAB_ADMIN || user?.role === ROLES.RECEPTIONIST;
  const canManageTests = user?.role === ROLES.SUPER_ADMIN || user?.role === ROLES.LAB_ADMIN;
  const canManageStaff = user?.role === ROLES.SUPER_ADMIN;

  return (
    <AuthContext.Provider value={{
      user,
      patientUser,
      loginStaff,
      loginPatient,
      logout,
      canApproveReports,
      canEnterResults,
      canManageBilling,
      canRegisterPatients,
      canManageTests,
      canManageStaff,
      isSuperAdmin: user?.role === ROLES.SUPER_ADMIN,
      isPathologist: user?.role === ROLES.PATHOLOGIST,
      isTechnician: user?.role === ROLES.TECHNICIAN,
      isReceptionist: user?.role === ROLES.RECEPTIONIST,
      isPatient: user?.role === ROLES.PATIENT
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
