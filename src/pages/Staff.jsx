import React, { useState } from 'react';
import { useLab } from '../context/LabContext';
import { useAuth } from '../context/AuthContext';
import {
  UserCheck,
  Search,
  PlusCircle,
  Phone,
  Mail,
  ShieldCheck,
  Award,
  Edit2,
  Trash2,
  KeyRound,
  Eye,
  EyeOff,
  CheckCircle2,
  Lock,
  User,
  X
} from 'lucide-react';

export default function Staff() {
  const { staff, addStaff, updateStaff, deleteStaff } = useLab();
  const { user } = useAuth();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [showPasswordId, setShowPasswordId] = useState({});
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // New staff form state
  const [newStaffData, setNewStaffData] = useState({
    name: '',
    role: 'technician',
    phone: '',
    email: '',
    password: '',
    qualification: '',
    regNumber: ''
  });

  const togglePasswordVisibility = (id) => {
    setShowPasswordId(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredStaff = staff.filter(s =>
    s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.role?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.qualification?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!editingStaff) return;
    updateStaff(editingStaff.id, editingStaff);
    setEditingStaff(null);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!newStaffData.name || !newStaffData.email) return;
    addStaff({
      ...newStaffData,
      password: newStaffData.password || 'staff123'
    });
    setIsAddModalOpen(false);
    setNewStaffData({
      name: '',
      role: 'technician',
      phone: '',
      email: '',
      password: '',
      qualification: '',
      regNumber: ''
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleDeleteStaff = (id, name) => {
    if (window.confirm(`Kya aap sach me ${name} ka record aur login access delete karna chahte hain?`)) {
      deleteStaff(id);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <UserCheck className="w-7 h-7 text-brand-600" />
            <span>Staff Management & Login Credentials</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Pathologists, biochemists, technicians and receptionists ke Gmail address aur Passwords yahan se change ya add karein.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-700 hover:bg-brand-800 text-white font-semibold text-xs shadow-md transition-all self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>+ Add New Staff</span>
        </button>
      </div>

      {saveSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Staff details, Gmail aur Password successfully update ho gaya hai!</span>
        </div>
      )}

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by name, Gmail/email or role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none"
          />
        </div>
        <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-xl">
          {staff.length} Active Staff
        </span>
      </div>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredStaff.map((member) => {
          const isPassVisible = showPasswordId[member.id];

          return (
            <div
              key={member.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:border-brand-300 transition-all flex flex-col justify-between gap-4"
            >
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-brand-50 border border-brand-200 text-brand-700 flex items-center justify-center text-2xl shrink-0 shadow-xs">
                  {member.avatar || '👨‍⚕️'}
                </div>

                <div className="space-y-1 flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-slate-900">{member.name}</h3>
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
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
                    <span>{member.qualification || 'Staff Member'}</span>
                  </p>

                  {member.regNumber && (
                    <p className="text-[11px] font-mono text-slate-500">
                      Reg / License: <strong className="text-slate-700">{member.regNumber}</strong>
                    </p>
                  )}

                  <div className="pt-2 text-xs text-slate-600 space-y-1">
                    <div className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-brand-600" />
                      <span className="font-mono text-slate-800 font-semibold">{member.email}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>{member.phone}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Password & Credentials Box */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-amber-600" />
                  <span className="text-slate-500 text-[11px]">Login Password:</span>
                  <span className="font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                    {isPassVisible ? (member.password || 'Not Set') : '••••••••'}
                  </span>
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility(member.id)}
                    className="p-1 text-slate-400 hover:text-slate-700 rounded"
                    title={isPassVisible ? "Hide Password" : "Show Password"}
                  >
                    {isPassVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setEditingStaff(member)}
                    className="px-2.5 py-1 text-xs font-semibold bg-white hover:bg-brand-50 text-brand-700 border border-slate-200 rounded-lg shadow-xs flex items-center gap-1"
                  >
                    <Edit2 className="w-3 h-3" />
                    <span>Change Gmail/Pass</span>
                  </button>
                  {member.role !== 'super_admin' && (
                    <button
                      onClick={() => handleDeleteStaff(member.id, member.name)}
                      className="p-1 text-rose-600 hover:bg-rose-50 rounded-lg"
                      title="Delete Staff"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Staff & Password Modal */}
      {editingStaff && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in zoom-in-95">
            <div className="bg-brand-700 px-6 py-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-brand-200" />
                <h3 className="font-bold text-sm">Update Staff Gmail & Login Password</h3>
              </div>
              <button onClick={() => setEditingStaff(null)} className="text-white hover:opacity-75">✕</button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Staff Full Name *</label>
                <input
                  type="text"
                  required
                  value={editingStaff.name}
                  onChange={(e) => setEditingStaff({ ...editingStaff, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Role / Designation</label>
                  <select
                    value={editingStaff.role}
                    onChange={(e) => setEditingStaff({ ...editingStaff, role: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl bg-white"
                  >
                    <option value="pathologist">Authorized Pathologist (MD)</option>
                    <option value="technician">Lab Technician (DMLT)</option>
                    <option value="receptionist">Reception & Billing Desk</option>
                    <option value="phlebotomist">Phlebotomist (Sample Collector)</option>
                    <option value="super_admin">Super Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Mobile Number</label>
                  <input
                    type="tel"
                    required
                    value={editingStaff.phone}
                    onChange={(e) => setEditingStaff({ ...editingStaff, phone: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl font-mono"
                  />
                </div>
              </div>

              {/* Gmail / Email */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Login Gmail / Email Address *</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    placeholder="e.g. staff.arpha@gmail.com"
                    value={editingStaff.email}
                    onChange={(e) => setEditingStaff({ ...editingStaff, email: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 border rounded-xl font-mono text-slate-900 font-semibold"
                  />
                </div>
              </div>

              {/* Login Password */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Change Login Password *</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    placeholder="Enter new password"
                    value={editingStaff.password || ''}
                    onChange={(e) => setEditingStaff({ ...editingStaff, password: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 border border-brand-400 rounded-xl font-mono text-brand-900 font-bold bg-brand-50/30"
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">Staff member can use this password to log in.</p>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Qualification / Degrees</label>
                <input
                  type="text"
                  placeholder="e.g. DMLT, B.Sc MLT"
                  value={editingStaff.qualification || ''}
                  onChange={(e) => setEditingStaff({ ...editingStaff, qualification: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div className="pt-3 border-t flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingStaff(null)}
                  className="px-4 py-2 border rounded-xl text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-700 hover:bg-brand-800 text-white font-bold rounded-xl shadow-md"
                >
                  Save Gmail & Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add New Staff Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in zoom-in-95">
            <div className="bg-brand-700 px-6 py-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-brand-200" />
                <h3 className="font-bold text-sm">Add New Staff Member</h3>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="text-white hover:opacity-75">✕</button>
            </div>

            <form onSubmit={handleAddSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Salman Khan"
                  value={newStaffData.name}
                  onChange={(e) => setNewStaffData({ ...newStaffData, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Role / Designation</label>
                  <select
                    value={newStaffData.role}
                    onChange={(e) => setNewStaffData({ ...newStaffData, role: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl bg-white"
                  >
                    <option value="technician">Lab Technician (DMLT)</option>
                    <option value="pathologist">Authorized Pathologist (MD)</option>
                    <option value="receptionist">Reception & Billing Desk</option>
                    <option value="phlebotomist">Phlebotomist (Sample Collector)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Mobile Phone *</label>
                  <input
                    type="tel"
                    required
                    placeholder="10-digit number"
                    value={newStaffData.phone}
                    onChange={(e) => setNewStaffData({ ...newStaffData, phone: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Staff Gmail / Email *</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    placeholder="e.g. staffname@gmail.com"
                    value={newStaffData.email}
                    onChange={(e) => setNewStaffData({ ...newStaffData, email: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 border rounded-xl font-mono text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Login Password *</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    placeholder="Enter password (e.g. staff123)"
                    value={newStaffData.password}
                    onChange={(e) => setNewStaffData({ ...newStaffData, password: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 border rounded-xl font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Qualification</label>
                <input
                  type="text"
                  placeholder="e.g. DMLT, B.Sc MLT"
                  value={newStaffData.qualification}
                  onChange={(e) => setNewStaffData({ ...newStaffData, qualification: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div className="pt-3 border-t flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border rounded-xl text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-700 hover:bg-brand-800 text-white font-bold rounded-xl shadow-md"
                >
                  Add Staff Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
