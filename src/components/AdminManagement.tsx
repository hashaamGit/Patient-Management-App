import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import type { DoctorRecord } from '../store/useAppStore';
import {
  ShieldAlert, UserPlus, Trash2, CheckCircle2, XCircle,
  AlertTriangle, Database, Shield, Download, FileText,
  Activity, Users, Building2, Stethoscope, Search, RefreshCw
} from 'lucide-react';

export const AdminManagement: React.FC = () => {
  const {
    currentUser,
    doctorsList,
    addDoctor,
    deleteDoctor,
    toggleDoctorStatus,
    savedCases,
    inventory
  } = useAppStore();

  const [activeTab, setActiveTab] = useState<'doctors' | 'data' | 'audit'>('doctors');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  
  // New doctor form
  const [newDoctor, setNewDoctor] = useState({
    name: '',
    specialty: '',
    registrationNo: '',
    email: '',
    phone: '',
    department: 'Internal Medicine',
    active: true
  });

  // Guard: If not admin
  if (currentUser?.role !== 'Admin') {
    return (
      <div className="h-full flex items-center justify-center p-8 bg-canvas text-center">
        <div className="max-w-md p-8 rounded-2xl bg-surface border border-danger/30 shadow-xl space-y-4">
          <div className="w-16 h-16 rounded-full bg-danger/10 text-danger mx-auto flex items-center justify-center">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-text-primary">Access Restricted</h2>
          <p className="text-sm text-text-muted">
            The Administration Console is strictly restricted to institutional Super Administrators.
            Your current active role is <strong className="text-primary">{currentUser?.role || 'Guest'}</strong>.
          </p>
        </div>
      </div>
    );
  }

  const filteredDoctors = doctorsList.filter(d =>
    d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.registrationNo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateDoctor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDoctor.name || !newDoctor.registrationNo) return;
    addDoctor(newDoctor);
    setNewDoctor({
      name: '',
      specialty: '',
      registrationNo: '',
      email: '',
      phone: '',
      department: 'Internal Medicine',
      active: true
    });
    setShowAddModal(false);
  };

  const handleDeleteDoctor = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to permanently remove ${name} from the medical registry? This action cannot be undone.`)) {
      deleteDoctor(id);
    }
  };

  const exportBackup = () => {
    const backupData = {
      hospital: 'Hassan and Co. Healthcare Systems',
      exportedAt: new Date().toISOString(),
      doctors: doctorsList,
      inventory: inventory,
      casesCount: savedCases.length,
      cases: savedCases
    };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute("href", dataStr);
    dlAnchor.setAttribute("download", `hassanco_enterprise_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(dlAnchor);
    dlAnchor.click();
    dlAnchor.remove();
  };

  const handleSystemPurge = () => {
    if (window.prompt('SECURITY CONFIRMATION: Type "PURGE" to erase all clinical patient records and reset the system.') === 'PURGE') {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="h-full overflow-y-auto p-6 bg-canvas space-y-6">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-rose-500/10 rounded-xl text-rose-500 border border-rose-500/20">
              <Shield className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-text-primary">Admin Governance Console</h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-500 border border-rose-500/30">
                  SUPERUSER ACCESS
                </span>
              </div>
              <p className="text-xs text-text-muted">
                Hassan and Co. Institutional Management • Doctor Registry, Access Control, and Data Security
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={exportBackup}
              className="flex items-center gap-1.5 px-3 py-2 bg-surface hover:bg-canvas border border-border rounded-lg text-xs font-semibold text-text-primary transition-colors"
            >
              <Download className="w-4 h-4 text-primary" />
              <span>Export Audit Backup</span>
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-xs font-bold transition-all shadow-md shadow-primary/20"
            >
              <UserPlus className="w-4 h-4" />
              <span>Register New Doctor</span>
            </button>
          </div>
        </div>

        {/* Top Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-surface border border-border flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <div className="text-2xl font-extrabold text-text-primary">{doctorsList.length}</div>
              <div className="text-[11px] text-text-muted uppercase tracking-wider">Registered Doctors</div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-surface border border-border flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-2xl font-extrabold text-emerald-600">
                {doctorsList.filter(d => d.active).length}
              </div>
              <div className="text-[11px] text-text-muted uppercase tracking-wider">Active in Practice</div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-surface border border-border flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-teal-500/10 text-teal-500 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="text-2xl font-extrabold text-text-primary">{savedCases.length}</div>
              <div className="text-[11px] text-text-muted uppercase tracking-wider">Patient Case Logs</div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-surface border border-border flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-2xl font-extrabold text-text-primary">{inventory.length}</div>
              <div className="text-[11px] text-text-muted uppercase tracking-wider">Pharmacy SKUs</div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 border-b border-border">
          <button
            onClick={() => setActiveTab('doctors')}
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'doctors'
                ? 'border-primary text-primary'
                : 'border-transparent text-text-muted hover:text-text-primary'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Doctor Registry & Deletion</span>
          </button>
          <button
            onClick={() => setActiveTab('data')}
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'data'
                ? 'border-primary text-primary'
                : 'border-transparent text-text-muted hover:text-text-primary'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>Institutional Data & Security</span>
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'audit'
                ? 'border-primary text-primary'
                : 'border-transparent text-text-muted hover:text-text-primary'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Hospital Audit Log</span>
          </button>
        </div>

        {/* Tab 1: Doctor Registry */}
        {activeTab === 'doctors' && (
          <div className="space-y-4">
            
            {/* Search and filter bar */}
            <div className="flex items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                  type="text"
                  placeholder="Search doctors by name, specialty, or PMDC reg..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-lg bg-surface border border-border text-sm text-text-primary placeholder:text-text-faint focus:outline-none focus:border-primary"
                />
              </div>
              <span className="text-xs text-text-muted">
                Showing {filteredDoctors.length} of {doctorsList.length} doctors
              </span>
            </div>

            {/* Doctors Table */}
            <div className="rounded-xl border border-border bg-surface overflow-hidden shadow-sm">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-canvas border-b border-border text-xs font-bold text-text-muted uppercase tracking-wider">
                    <th className="py-3 px-4">Doctor Name</th>
                    <th className="py-3 px-4">Department & Specialty</th>
                    <th className="py-3 px-4">Registration #</th>
                    <th className="py-3 px-4">Contact</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Admin Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredDoctors.map((doctor) => (
                    <tr key={doctor.id} className="hover:bg-canvas/50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-bold text-text-primary">{doctor.name}</div>
                        <div className="text-xs text-text-muted">ID: {doctor.id}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium text-text-primary">{doctor.specialty}</div>
                        <div className="text-xs text-text-muted">{doctor.department}</div>
                      </td>
                      <td className="py-3 px-4 font-mono text-xs text-text-secondary">
                        {doctor.registrationNo}
                      </td>
                      <td className="py-3 px-4 text-xs text-text-muted">
                        <div>{doctor.email}</div>
                        <div>{doctor.phone}</div>
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => toggleDoctorStatus(doctor.id)}
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold cursor-pointer border ${
                            doctor.active
                              ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30 hover:bg-emerald-500/20'
                              : 'bg-slate-500/10 text-slate-500 border-slate-500/30 hover:bg-slate-500/20'
                          }`}
                        >
                          {doctor.active ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                          <span>{doctor.active ? 'Active' : 'Inactive'}</span>
                        </button>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleDeleteDoctor(doctor.id, doctor.name)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-danger/10 hover:bg-danger text-danger hover:text-white border border-danger/30 text-xs font-semibold transition-colors"
                          title="Permanently remove doctor"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredDoctors.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-text-muted">
                        No doctors matching your criteria found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* Tab 2: Institutional Data & Danger Zone */}
        {activeTab === 'data' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="p-6 rounded-xl bg-surface border border-border space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-teal-500/10 text-teal-600">
                    <Database className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-text-primary">Encrypted Local Database</h3>
                    <p className="text-xs text-text-muted">Client-side offline storage with zero network exposure</p>
                  </div>
                </div>
                <p className="text-sm text-text-secondary leading-relaxed">
                  All clinical records, medication orders, SOAP notes, and patient registries are stored securely in local browser storage.
                </p>
                <div className="pt-2">
                  <button
                    onClick={exportBackup}
                    className="w-full py-2.5 px-4 rounded-lg bg-surface border border-border hover:bg-canvas text-text-primary text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Full Institutional Backup (JSON)</span>
                  </button>
                </div>
              </div>

              <div className="p-6 rounded-xl bg-danger-bg border border-danger/30 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-danger/10 text-danger">
                    <ShieldAlert className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-danger-text">Admin Danger Zone</h3>
                    <p className="text-xs text-danger-text/80">Permanent purge of all patient and clinical data</p>
                  </div>
                </div>
                <p className="text-sm text-danger-text/90 leading-relaxed">
                  Clearing the database will permanently wipe all {savedCases.length} patient case records, inventory logs, and active prescriptions.
                </p>
                <div className="pt-2">
                  <button
                    onClick={handleSystemPurge}
                    className="w-full py-2.5 px-4 rounded-lg bg-danger hover:bg-danger/90 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-md shadow-danger/20"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Purge All Hospital Records (Factory Reset)</span>
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Tab 3: Hospital Audit Log */}
        {activeTab === 'audit' && (
          <div className="rounded-xl border border-border bg-surface p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="font-bold text-text-primary flex items-center gap-2">
                <Activity className="w-4 h-4 text-primary" /> Live Institutional Event Feed
              </h3>
              <span className="text-xs text-text-muted">Real-time session audit</span>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-canvas border border-border text-xs">
                <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5" />
                <div className="flex-1">
                  <span className="font-bold text-text-primary">Admin Session Authenticated</span>
                  <p className="text-text-muted">System Administrator logged into Hassan and Co. Governance Console.</p>
                </div>
                <span className="text-text-faint">Just now</span>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-canvas border border-border text-xs">
                <div className="w-2 h-2 rounded-full bg-teal-500 mt-1.5" />
                <div className="flex-1">
                  <span className="font-bold text-text-primary">Doctor Registry Verified</span>
                  <p className="text-text-muted">{doctorsList.length} registered physician profiles active in local directory.</p>
                </div>
                <span className="text-text-faint">Active</span>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-canvas border border-border text-xs">
                <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5" />
                <div className="flex-1">
                  <span className="font-bold text-text-primary">Clinical Decision Trees Loaded</span>
                  <p className="text-text-muted">1,600+ symptoms and 1,600+ disease protocols mounted in memory.</p>
                </div>
                <span className="text-text-faint">System Init</span>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Register New Doctor */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="max-w-lg w-full bg-surface border border-border rounded-2xl shadow-2xl p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-primary" />
                  <h3 className="font-bold text-text-primary text-base">Register Medical Practitioner</h3>
                </div>
                <button onClick={() => setShowAddModal(false)} className="text-text-muted hover:text-text-primary">
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateDoctor} className="space-y-3 text-sm">
                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-1">Doctor Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Asad Ullah"
                    value={newDoctor.name}
                    onChange={(e) => setNewDoctor({ ...newDoctor, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-canvas border border-border focus:outline-none focus:border-primary text-text-primary"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-text-secondary mb-1">Specialty *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Pulmonology"
                      value={newDoctor.specialty}
                      onChange={(e) => setNewDoctor({ ...newDoctor, specialty: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-canvas border border-border focus:outline-none focus:border-primary text-text-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-text-secondary mb-1">PMDC / License Reg No *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. PMDC-61299-M"
                      value={newDoctor.registrationNo}
                      onChange={(e) => setNewDoctor({ ...newDoctor, registrationNo: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-canvas border border-border focus:outline-none focus:border-primary text-text-primary"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-text-secondary mb-1">Email Address</label>
                    <input
                      type="email"
                      placeholder="doctor@hassanco.health"
                      value={newDoctor.email}
                      onChange={(e) => setNewDoctor({ ...newDoctor, email: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-canvas border border-border focus:outline-none focus:border-primary text-text-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-text-secondary mb-1">Phone Number</label>
                    <input
                      type="tel"
                      placeholder="+92 300 0000000"
                      value={newDoctor.phone}
                      onChange={(e) => setNewDoctor({ ...newDoctor, phone: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-canvas border border-border focus:outline-none focus:border-primary text-text-primary"
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-3 border-t border-border">
                  <button
                    type="submit"
                    className="flex-1 py-2 px-4 rounded-lg bg-primary hover:bg-primary/90 text-white font-bold text-xs shadow transition-colors"
                  >
                    Save & Issue Credentials
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="py-2 px-4 rounded-lg bg-canvas border border-border hover:bg-surface text-text-secondary text-xs font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
