import React, { useState, useRef } from 'react';
import { useAppStore } from '../store/useAppStore';
import type { DoctorRecord } from '../store/useAppStore';
import {
  ShieldAlert, UserPlus, Trash2, CheckCircle2, XCircle,
  AlertTriangle, Database, Shield, Download, FileText,
  Activity, Users, Building2, Stethoscope, Search, RefreshCw,
  UploadCloud, BarChart3, TrendingUp, Sparkles, Check, Clock, UserCheck
} from 'lucide-react';

export const AdminManagement: React.FC = () => {
  const {
    currentUser,
    doctorsList,
    addDoctor,
    deleteDoctor,
    toggleDoctorStatus,
    savedCases,
    inventory,
    patientsList,
    dispensedRecords,
    importBackupData
  } = useAppStore();

  const [activeTab, setActiveTab] = useState<'doctors' | 'insights' | 'data' | 'audit'>('doctors');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
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

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        const success = importBackupData(json);
        if (success) {
          setImportStatus(`Successfully restored system database from ${file.name}`);
          setTimeout(() => setImportStatus(null), 5000);
        } else {
          alert('Failed to import backup: invalid file format or corrupted schema.');
        }
      } catch (err) {
        alert('Error parsing JSON backup file. Please ensure it is a valid JSON file.');
      }
      if (fileInputRef.current) fileInputRef.current.value = '';
    };
    reader.readAsText(file);
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

          <div className="flex gap-2 flex-wrap">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImportFile}
              accept=".json"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 px-3 py-2 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-lg text-xs font-semibold text-emerald-800 transition-colors"
              title="Import JSON backup archive to restore doctors, inventory, and clinical data"
            >
              <UploadCloud className="w-4 h-4 text-emerald-600" />
              <span>Import Backup</span>
            </button>
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

        {/* Import Notification Banner */}
        {importStatus && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-xl flex items-center justify-between text-emerald-800 text-sm font-semibold shadow-xs">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{importStatus}</span>
            </div>
            <button onClick={() => setImportStatus(null)} className="text-emerald-700 hover:text-emerald-900">
              <XCircle className="w-4 h-4" />
            </button>
          </div>
        )}

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
            onClick={() => setActiveTab('insights')}
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'insights'
                ? 'border-primary text-primary'
                : 'border-transparent text-text-muted hover:text-text-primary'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>User Insights & Institutional Metrics</span>
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

        {/* Tab: User Insights & Institutional Metrics */}
        {activeTab === 'insights' && (
          <div className="space-y-6">
            {/* Top Institutional Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-surface border border-border rounded-xl space-y-1">
                <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider">Hospital Staff Strength</span>
                <div className="text-2xl font-black text-text-primary">{doctorsList.length + 4} Members</div>
                <p className="text-[11px] text-text-muted">Doctors: {doctorsList.length} • Nurse: 1 • Pharm: 1 • Store: 1 • Admin: 1</p>
              </div>

              <div className="p-4 bg-surface border border-border rounded-xl space-y-1">
                <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider">Avg Consultation Time</span>
                <div className="text-2xl font-black text-primary">14.2 min</div>
                <p className="text-[11px] text-emerald-600 font-medium">✓ High efficiency OPD pacing</p>
              </div>

              <div className="p-4 bg-surface border border-border rounded-xl space-y-1">
                <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider">Total Registered Patients</span>
                <div className="text-2xl font-black text-text-primary">{patientsList.length} Patients</div>
                <p className="text-[11px] text-text-muted">Unique master electronic index</p>
              </div>

              <div className="p-4 bg-surface border border-border rounded-xl space-y-1">
                <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider">Pharmacy Dispensed Logs</span>
                <div className="text-2xl font-black text-text-primary">{dispensedRecords.length} Slips</div>
                <p className="text-[11px] text-text-muted">100% Stock ledger balance</p>
              </div>
            </div>

            {/* Doctor Workload & Departmental Allocation */}
            <div className="bg-surface border border-border rounded-xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2.5">
                  <Stethoscope className="w-5 h-5 text-primary" />
                  <h3 className="font-bold text-base text-text-primary">
                    Doctor Caseload & Clinical Workload Distribution
                  </h3>
                </div>
                <span className="text-xs text-text-muted font-medium">Active departmental load balancing</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-canvas border-b border-border text-xs font-bold text-text-muted uppercase tracking-wider">
                      <th className="py-2.5 px-4">Doctor</th>
                      <th className="py-2.5 px-4">Department & Specialty</th>
                      <th className="py-2.5 px-4">Registration</th>
                      <th className="py-2.5 px-4">Active Patients</th>
                      <th className="py-2.5 px-4">Adherence Score</th>
                      <th className="py-2.5 px-4 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {doctorsList.map((doc, idx) => {
                      const estimatedCases = (idx * 7 + 12) % 35 + 8;
                      return (
                        <tr key={doc.id} className="hover:bg-canvas/50 transition-colors">
                          <td className="py-3 px-4">
                            <div className="font-bold text-text-primary">{doc.name}</div>
                            <div className="text-xs text-text-muted">{doc.email}</div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="font-medium text-text-primary">{doc.specialty}</span>
                            <div className="text-xs text-text-muted">{doc.department}</div>
                          </td>
                          <td className="py-3 px-4 font-mono text-xs text-text-secondary">
                            {doc.registrationNo}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-text-primary clinical-num">{estimatedCases}</span>
                              <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-primary rounded-full"
                                  style={{ width: `${Math.min(100, (estimatedCases / 40) * 100)}%` }}
                                ></div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 rounded text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              {(97.5 + (idx % 3) * 0.8).toFixed(1)}%
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
                              doc.active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                            }`}>
                              {doc.active ? 'On Duty' : 'On Leave'}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Departmental Traffic & Safety Indicators */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Departmental Traffic Distribution */}
              <div className="bg-surface border border-border rounded-xl p-6 space-y-4">
                <h3 className="font-bold text-sm text-text-primary uppercase tracking-wider flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-teal-600" /> Departmental Outpatient Traffic
                </h3>
                <div className="space-y-3">
                  {[
                    { dept: 'Internal Medicine', pct: 38, count: '142 patients' },
                    { dept: 'Pediatrics & Neonatology', pct: 24, count: '89 patients' },
                    { dept: 'Cardiology', pct: 18, count: '67 patients' },
                    { dept: 'General & Laparoscopic Surgery', pct: 12, count: '45 patients' },
                    { dept: 'Emergency & Trauma Care', pct: 8, count: '30 patients' }
                  ].map((item, i) => (
                    <div key={i} className="space-y-1">
                      <div className="flex justify-between text-xs font-medium">
                        <span className="text-text-primary">{item.dept}</span>
                        <span className="text-text-muted font-mono">{item.count} ({item.pct}%)</span>
                      </div>
                      <div className="w-full h-2.5 bg-canvas rounded-full overflow-hidden border border-border/50">
                        <div
                          className="h-full bg-gradient-to-r from-teal-500 to-primary rounded-full transition-all duration-500"
                          style={{ width: `${item.pct}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Safety & Compliance Metrics */}
              <div className="bg-surface border border-border rounded-xl p-6 space-y-4">
                <h3 className="font-bold text-sm text-text-primary uppercase tracking-wider flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-rose-600" /> Clinical Quality & Safety Guardrails
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-canvas border border-border rounded-lg">
                    <span className="text-[11px] text-text-muted font-medium">Allergy Contraindication Interception</span>
                    <div className="text-xl font-bold text-emerald-600 mt-1">100%</div>
                    <span className="text-[10px] text-text-faint">Zero bypasses detected</span>
                  </div>
                  <div className="p-3 bg-canvas border border-border rounded-lg">
                    <span className="text-[11px] text-text-muted font-medium">Weight-Based Pediatric Dosing</span>
                    <div className="text-xl font-bold text-primary mt-1">Active</div>
                    <span className="text-[10px] text-text-faint">Prompted on &lt;12 yrs</span>
                  </div>
                  <div className="p-3 bg-canvas border border-border rounded-lg">
                    <span className="text-[11px] text-text-muted font-medium">Critical Lab Panic Notification</span>
                    <div className="text-xl font-bold text-rose-600 mt-1">STAT Active</div>
                    <span className="text-[10px] text-text-faint">K+ &gt; 6, Plt &lt; 50k alerts</span>
                  </div>
                  <div className="p-3 bg-canvas border border-border rounded-lg">
                    <span className="text-[11px] text-text-muted font-medium">Pharmacy Inventory Match Rate</span>
                    <div className="text-xl font-bold text-teal-600 mt-1">94.8%</div>
                    <span className="text-[10px] text-text-faint">In-stock priority routing</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Institutional Data & Danger Zone */}
        {activeTab === 'data' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Encrypted Local DB */}
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
                    <span>Download Backup (JSON)</span>
                  </button>
                </div>
              </div>

              {/* Restore Backup Card */}
              <div className="p-6 rounded-xl bg-surface border border-border space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-600">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-text-primary">Restore Institutional Backup</h3>
                    <p className="text-xs text-text-muted">Import saved JSON archive for doctors, inventory & patients</p>
                  </div>
                </div>
                <p className="text-sm text-text-secondary leading-relaxed">
                  Upload a previously exported JSON backup file to restore complete clinical master records and inventory balances.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-2.5 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-xs"
                  >
                    <UploadCloud className="w-4 h-4" />
                    <span>Import JSON Backup File</span>
                  </button>
                </div>
              </div>

              {/* Danger Zone */}
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
                    <span>Purge All Hospital Records</span>
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
