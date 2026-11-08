import React, { useState } from 'react';
import { useLab } from '../context/LabContext';
import { useAuth, ROLES, ROLE_LABELS } from '../context/AuthContext';
import {
  UserCheck,
  Search,
  PlusCircle,
  Phone,
  Mail,
  ShieldCheck,
  Award,
  Stethoscope,
  Microscope,
  Briefcase
} from 'lucide-react';

export default function Staff() {
  const { staff } = useLab();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredStaff = staff.filter(s =>
    s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.role?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.qualification?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <UserCheck className="w-7 h-7 text-brand-600" />
            <span>Staff Directory & Access Authorization</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Pathologists, biochemists, medical laboratory technologists (DMLT), and billing front desk staff.
          </p>
        </div>
      </div>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredStaff.map((member) => (
          <div
            key={member.id}
            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:border-brand-300 transition-all flex items-start gap-4"
          >
            <div className="w-14 h-14 rounded-2xl bg-brand-50 border border-brand-200 text-brand-700 flex items-center justify-center text-2xl shrink-0">
              {member.avatar || '👨‍⚕️'}
            </div>

            <div className="space-y-1 flex-1">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900">{member.name}</h3>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                  member.role === 'super_admin'
                    ? 'bg-purple-100 text-purple-800'
                    : member.role === 'pathologist'
                    ? 'bg-emerald-100 text-emerald-800'
                    : member.role === 'technician'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {member.role?.replace('_', ' ')}
                </span>
              </div>

              <p className="text-xs font-semibold text-brand-700 flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-brand-600" />
                <span>{member.qualification}</span>
              </p>

              {member.regNumber && (
                <p className="text-[11px] font-mono text-slate-500">
                  License: <strong className="text-slate-700">{member.regNumber}</strong>
                </p>
              )}

              <div className="pt-2 mt-2 border-t border-slate-100 flex flex-wrap items-center gap-3 text-xs text-slate-600">
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  {member.phone}
                </span>
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  {member.email}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
