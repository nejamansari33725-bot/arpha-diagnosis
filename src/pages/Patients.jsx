import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLab } from '../context/LabContext';
import { useAuth, ROLES } from '../context/AuthContext';
import {
  Users,
  Search,
  UserPlus,
  Phone,
  FileText,
  Trash2,
  Edit,
  Eye,
  Calendar,
  Filter,
  CheckCircle2,
  Stethoscope,
  Receipt,
  Droplet
} from 'lucide-react';
import NewPatientModal from '../components/NewPatientModal';

export default function Patients() {
  const { patients, updatePatient, deletePatient } = useLab();
  const { user } = useAuth();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [genderFilter, setGenderFilter] = useState('ALL');
  const [isNewPatientModalOpen, setIsNewPatientModalOpen] = useState(false);
  
  // Edit Patient State
  const [editingPatient, setEditingPatient] = useState(null);

  const canEditOrDelete = true;

  const filteredPatients = patients.filter(p => {
    const matchesSearch =
      p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.patientId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.phone?.includes(searchTerm) ||
      p.referringDoctor?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesGender = genderFilter === 'ALL' || p.gender === genderFilter;
    return matchesSearch && matchesGender;
  });

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to delete patient record for ${name}?`)) {
      deletePatient(id);
    }
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!editingPatient) return;
    updatePatient(editingPatient.id, editingPatient);
    setEditingPatient(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <Users className="w-7 h-7 text-brand-600" />
            <span>Patient Management Directory</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Registered patient records, medical histories, doctor referrals, and auto ID generation.
          </p>
        </div>

        <button
          onClick={() => setIsNewPatientModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow-md transition-all self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add New Patient</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by Patient Name, ID (ARPHA-...), Phone or Doctor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Filter className="w-3.5 h-3.5" />
            <span>Gender:</span>
          </div>
          <select
            value={genderFilter}
            onChange={(e) => setGenderFilter(e.target.value)}
            className="text-xs border border-slate-300 rounded-xl px-3 py-2 bg-white focus:ring-2 focus:ring-brand-500 outline-none"
          >
            <option value="ALL">All Genders</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
          <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-2 rounded-xl">
            {filteredPatients.length} Patients
          </span>
        </div>
      </div>

      {/* Patient Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3 px-4">Patient ID</th>
                <th className="py-3 px-4">Patient Name</th>
                <th className="py-3 px-4">Age / Gender</th>
                <th className="py-3 px-4">Mobile & Blood Group</th>
                <th className="py-3 px-4">Referring Doctor</th>
                <th className="py-3 px-4">Registered Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredPatients.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-400">
                    No patients match your search criteria.
                  </td>
                </tr>
              ) : (
                filteredPatients.map((patient) => (
                  <tr key={patient.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="py-3.5 px-4 font-mono font-bold text-brand-700">
                      {patient.patientId}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-800">{patient.name}</div>
                      <div className="text-[11px] text-slate-400 truncate max-w-xs">{patient.address}</div>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-700">
                      {patient.age} Yrs / <span className="text-slate-500">{patient.gender}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 text-slate-700 font-mono">
                        <Phone className="w-3.5 h-3.5 text-brand-600" />
                        <span>{patient.phone}</span>
                      </div>
                      <div className="text-[10px] text-brand-600 font-bold uppercase">
                        Blood: {patient.bloodGroup || 'N/A'}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1 text-slate-700">
                        <Stethoscope className="w-3.5 h-3.5 text-slate-400" />
                        <span className="font-medium">{patient.referringDoctor || 'Walk-in'}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                      {new Date(patient.registeredAt).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          to={`/patients/${patient.id}`}
                          className="p-1.5 text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
                          title="View Complete Medical Profile"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          to="/billing"
                          className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                          title="Generate Invoice / Bill"
                        >
                          <Receipt className="w-4 h-4" />
                        </Link>
                        {canEditOrDelete && (
                          <>
                            <button
                              onClick={() => setEditingPatient(patient)}
                              className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                              title="Edit Patient Details"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(patient.id, patient.name)}
                              className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                              title="Delete Patient Record"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Patient Modal */}
      {editingPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden">
            <div className="bg-brand-700 px-6 py-4 text-white flex items-center justify-between">
              <h3 className="font-bold text-sm">Edit Patient: {editingPatient.patientId}</h3>
              <button onClick={() => setEditingPatient(null)} className="text-white hover:opacity-75">✕</button>
            </div>
            <form onSubmit={handleEditSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={editingPatient.name}
                  onChange={(e) => setEditingPatient({ ...editingPatient, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Age</label>
                  <input
                    type="number"
                    required
                    value={editingPatient.age}
                    onChange={(e) => setEditingPatient({ ...editingPatient, age: Number(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Gender</label>
                  <select
                    value={editingPatient.gender}
                    onChange={(e) => setEditingPatient({ ...editingPatient, gender: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl bg-white"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Mobile Phone</label>
                <input
                  type="tel"
                  required
                  value={editingPatient.phone}
                  onChange={(e) => setEditingPatient({ ...editingPatient, phone: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Referring Doctor</label>
                <input
                  type="text"
                  value={editingPatient.referringDoctor || ''}
                  onChange={(e) => setEditingPatient({ ...editingPatient, referringDoctor: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Address</label>
                <input
                  type="text"
                  value={editingPatient.address || ''}
                  onChange={(e) => setEditingPatient({ ...editingPatient, address: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>
              <div className="pt-3 border-t flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingPatient(null)}
                  className="px-4 py-2 border rounded-xl text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-brand-600 text-white font-semibold rounded-xl"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Patient Registration Modal */}
      <NewPatientModal
        isOpen={isNewPatientModalOpen}
        onClose={() => setIsNewPatientModalOpen(false)}
      />

    </div>
  );
}
