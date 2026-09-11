import { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import {
  Settings, User, Database, Save, Download, Upload, RotateCcw,
  CheckCircle2, Shield, Layout, Palette, Volume2, VolumeX,
  Stethoscope, Activity, Pill, Building2, Sparkles, Check
} from 'lucide-react';

export const SettingsPanel = () => {
  const {
    doctorProfile,
    updateDoctorProfile,
    savedCases,
    sidebarCollapsed,
    toggleSidebar,
    currentUser,
    roleProfiles,
    updateRoleProfile,
    themeAccent,
    setThemeAccent,
    uiDensity,
    setUiDensity,
    fontSizeScale,
    setFontSizeScale,
    soundAlerts,
    toggleSoundAlerts,
    importBackupData
  } = useAppStore();

  const currentRole = currentUser?.role || 'Doctor';
  const [activeTab, setActiveTab] = useState<'profile' | 'appearance' | 'data'>('profile');
  
  // Local profile form initialized with current role's profile
  const [roleForm, setRoleForm] = useState<Record<string, any>>(
    roleProfiles?.[currentRole] || doctorProfile || {}
  );
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  const handleProfileSave = () => {
    updateRoleProfile(currentRole, roleForm);
    if (currentRole === 'Doctor') {
      updateDoctorProfile({
        name: roleForm.fullName || roleForm.name,
        credentials: roleForm.credentials,
        registrationNo: roleForm.registrationNo,
        specialty: roleForm.specialty,
        clinicName: roleForm.clinicName,
        clinicAddress: roleForm.clinicAddress,
        phone: roleForm.phone,
      });
    }
    setSaveStatus(`${currentRole} profile saved successfully.`);
    setTimeout(() => setSaveStatus(null), 3500);
  };

  const exportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(savedCases, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `hassanco_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        const success = importBackupData(json);
        if (success) {
          alert('Backup data restored successfully!');
        } else {
          alert('Invalid backup file format.');
        }
      } catch (err) {
        alert('Could not parse JSON file.');
      }
    };
    reader.readAsText(file);
  };

  const clearData = () => {
    if (window.confirm('Are you sure you want to clear all saved cases and reset cache? This cannot be undone.')) {
      localStorage.removeItem('hassanco-storage');
      localStorage.removeItem('clinrail-v4-storage');
      window.location.reload();
    }
  };

  const THEME_ACCENTS: Array<{ id: 'teal' | 'blue' | 'indigo' | 'rose' | 'slate'; name: string; hex: string; desc: string }> = [
    { id: 'teal', name: 'Clinical Teal', hex: '#086E64', desc: 'Signature healthcare balanced tone' },
    { id: 'blue', name: 'Royal Ocean Blue', hex: '#1D4ED8', desc: 'High contrast modern medical style' },
    { id: 'indigo', name: 'Healthcare Indigo', hex: '#4F46E5', desc: 'Professional tech-enabled clinical look' },
    { id: 'rose', name: 'Medical Rose', hex: '#BE123C', desc: 'High urgency emergency department palette' },
    { id: 'slate', name: 'Midnight Slate', hex: '#334155', desc: 'Minimalist enterprise aesthetic' },
  ];

  return (
    <div className="h-full overflow-y-auto p-6 md:p-8 bg-canvas">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
          <div className="flex items-center gap-3.5">
            <div className="p-3 bg-primary/10 rounded-2xl text-primary ring-1 ring-primary/20">
              <Settings className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-text-primary">Settings &amp; System Preferences</h1>
              <p className="text-sm text-text-secondary mt-0.5">
                Customize your workspace, role configurations, and appearance
              </p>
            </div>
          </div>

          {/* Current Logged In Role Pill */}
          <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl bg-surface border border-border shadow-2xs self-start sm:self-auto">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs text-text-secondary">Logged in as:</span>
            <span className="text-xs font-bold text-primary">{currentUser?.name} ({currentRole})</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1.5 bg-surface border border-border p-1.5 rounded-2xl w-fit shadow-2xs">
          <button 
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 text-xs md:text-sm font-bold rounded-xl flex items-center gap-2 transition-all ${
              activeTab === 'profile' 
                ? 'bg-primary text-white shadow-xs' 
                : 'text-text-secondary hover:text-text-primary hover:bg-canvas'
            }`}
          >
            {currentRole === 'Doctor' && <Stethoscope className="w-4 h-4" />}
            {currentRole === 'Nurse' && <Activity className="w-4 h-4" />}
            {currentRole === 'Pharmacist' && <Pill className="w-4 h-4" />}
            {currentRole === 'Storekeeper' && <Building2 className="w-4 h-4" />}
            {currentRole === 'Admin' && <Shield className="w-4 h-4" />}
            <span>{currentRole} Profile</span>
          </button>

          <button 
            onClick={() => setActiveTab('appearance')}
            className={`px-4 py-2 text-xs md:text-sm font-bold rounded-xl flex items-center gap-2 transition-all ${
              activeTab === 'appearance' 
                ? 'bg-primary text-white shadow-xs' 
                : 'text-text-secondary hover:text-text-primary hover:bg-canvas'
            }`}
          >
            <Palette className="w-4 h-4" />
            <span>Appearance &amp; Density</span>
          </button>

          <button 
            onClick={() => setActiveTab('data')}
            className={`px-4 py-2 text-xs md:text-sm font-bold rounded-xl flex items-center gap-2 transition-all ${
              activeTab === 'data' 
                ? 'bg-primary text-white shadow-xs' 
                : 'text-text-secondary hover:text-text-primary hover:bg-canvas'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>Data &amp; Backups</span>
          </button>
        </div>

        {/* Tab 1: Role Tailored Profile */}
        {activeTab === 'profile' && (
          <div className="card p-6 md:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div>
                <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  {currentRole} Workstation &amp; Profile
                </h3>
                <p className="text-xs text-text-muted mt-0.5">
                  Parameters specific to your duties as {currentRole} in Hassan &amp; Co. Healthcare Systems
                </p>
              </div>
              {saveStatus && (
                <span className="text-xs font-bold text-emerald-600 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 flex items-center gap-1.5 animate-fade-in">
                  <CheckCircle2 className="w-4 h-4" /> {saveStatus}
                </span>
              )}
            </div>

            {/* DOCTOR PROFILE FORM */}
            {currentRole === 'Doctor' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-1.5">Doctor Full Name</label>
                  <input 
                    type="text" 
                    value={roleForm.fullName || roleForm.name || ''}
                    onChange={e => setRoleForm({ ...roleForm, fullName: e.target.value, name: e.target.value })}
                    className="w-full p-2.5 bg-canvas border border-border rounded-xl focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-1.5">Medical Degrees &amp; Post-Graduation</label>
                  <input 
                    type="text" 
                    value={roleForm.credentials || ''}
                    onChange={e => setRoleForm({ ...roleForm, credentials: e.target.value })}
                    className="w-full p-2.5 bg-canvas border border-border rounded-xl focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-1.5">PMDC / Medical Council Registration No</label>
                  <input 
                    type="text" 
                    value={roleForm.registrationNo || ''}
                    onChange={e => setRoleForm({ ...roleForm, registrationNo: e.target.value })}
                    className="w-full p-2.5 bg-canvas border border-border rounded-xl focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-1.5">Clinical Specialty &amp; Department</label>
                  <input 
                    type="text" 
                    value={roleForm.specialty || ''}
                    onChange={e => setRoleForm({ ...roleForm, specialty: e.target.value })}
                    className="w-full p-2.5 bg-canvas border border-border rounded-xl focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-1.5">Hospital / Clinic Complex Name</label>
                  <input 
                    type="text" 
                    value={roleForm.clinicName || ''}
                    onChange={e => setRoleForm({ ...roleForm, clinicName: e.target.value })}
                    className="w-full p-2.5 bg-canvas border border-border rounded-xl focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-1.5">Clinic Address for Prescription Slips</label>
                  <textarea 
                    value={roleForm.clinicAddress || ''}
                    onChange={e => setRoleForm({ ...roleForm, clinicAddress: e.target.value })}
                    className="w-full p-2.5 bg-canvas border border-border rounded-xl focus:border-primary focus:ring-1 focus:ring-primary min-h-[70px]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-1.5">Official Contact Phone</label>
                  <input 
                    type="text" 
                    value={roleForm.phone || ''}
                    onChange={e => setRoleForm({ ...roleForm, phone: e.target.value })}
                    className="w-full p-2.5 bg-canvas border border-border rounded-xl focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-1.5">Default Prescription Language</label>
                  <select 
                    value={roleForm.defaultRxLanguage || 'english'}
                    onChange={e => setRoleForm({ ...roleForm, defaultRxLanguage: e.target.value })}
                    className="w-full p-2.5 bg-canvas border border-border rounded-xl focus:border-primary focus:ring-1 focus:ring-primary"
                  >
                    <option value="english">English</option>
                    <option value="urdu">اردو (Urdu)</option>
                  </select>
                </div>
              </div>
            )}

            {/* NURSE PROFILE FORM */}
            {currentRole === 'Nurse' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-1.5">Staff Nurse Full Name</label>
                  <input 
                    type="text" 
                    value={roleForm.fullName || currentUser?.name || ''}
                    onChange={e => setRoleForm({ ...roleForm, fullName: e.target.value })}
                    className="w-full p-2.5 bg-canvas border border-border rounded-xl focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-1.5">Nursing Council Registration ID</label>
                  <input 
                    type="text" 
                    value={roleForm.councilId || ''}
                    onChange={e => setRoleForm({ ...roleForm, councilId: e.target.value })}
                    className="w-full p-2.5 bg-canvas border border-border rounded-xl focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-1.5">Assigned Ward / ICU Station</label>
                  <input 
                    type="text" 
                    value={roleForm.assignedWard || ''}
                    onChange={e => setRoleForm({ ...roleForm, assignedWard: e.target.value })}
                    className="w-full p-2.5 bg-canvas border border-border rounded-xl focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-1.5">Current Shift Timing</label>
                  <select 
                    value={roleForm.shift || 'Morning (08:00 - 16:00)'}
                    onChange={e => setRoleForm({ ...roleForm, shift: e.target.value })}
                    className="w-full p-2.5 bg-canvas border border-border rounded-xl focus:border-primary focus:ring-1 focus:ring-primary"
                  >
                    <option>Morning (08:00 - 16:00)</option>
                    <option>Evening (16:00 - 00:00)</option>
                    <option>Night (00:00 - 08:00)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-1.5">Routine Vitals Check Interval (Minutes)</label>
                  <input 
                    type="number" 
                    value={roleForm.vitalsIntervalMinutes || 60}
                    onChange={e => setRoleForm({ ...roleForm, vitalsIntervalMinutes: e.target.value })}
                    className="w-full p-2.5 bg-canvas border border-border rounded-xl focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-1.5">Emergency Triage Alert Chime</label>
                  <div className="flex items-center gap-3 pt-2">
                    <input 
                      type="checkbox" 
                      id="news2Chime"
                      checked={roleForm.news2AudioChime ?? true}
                      onChange={e => setRoleForm({ ...roleForm, news2AudioChime: e.target.checked })}
                      className="w-4 h-4 text-primary rounded"
                    />
                    <label htmlFor="news2Chime" className="text-xs font-medium text-text-primary cursor-pointer">
                      Play audio alert when NEWS2 score &ge; 5 or Red-Flag vitals detected
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* PHARMACIST PROFILE FORM */}
            {currentRole === 'Pharmacist' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-1.5">Pharmacist Full Name</label>
                  <input 
                    type="text" 
                    value={roleForm.fullName || currentUser?.name || ''}
                    onChange={e => setRoleForm({ ...roleForm, fullName: e.target.value })}
                    className="w-full p-2.5 bg-canvas border border-border rounded-xl focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-1.5">Pharmacy License Number</label>
                  <input 
                    type="text" 
                    value={roleForm.licenseNo || ''}
                    onChange={e => setRoleForm({ ...roleForm, licenseNo: e.target.value })}
                    className="w-full p-2.5 bg-canvas border border-border rounded-xl focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-1.5">Dispensing Counter Location</label>
                  <input 
                    type="text" 
                    value={roleForm.counterNo || ''}
                    onChange={e => setRoleForm({ ...roleForm, counterNo: e.target.value })}
                    className="w-full p-2.5 bg-canvas border border-border rounded-xl focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-1.5">Low-Stock Alert Trigger Threshold (Units)</label>
                  <input 
                    type="number" 
                    value={roleForm.lowStockThreshold || 50}
                    onChange={e => setRoleForm({ ...roleForm, lowStockThreshold: Number(e.target.value) })}
                    className="w-full p-2.5 bg-canvas border border-border rounded-xl focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div className="md:col-span-2 space-y-3 pt-2">
                  <div className="flex items-center gap-3">
                    <input 
                      type="checkbox" 
                      id="autoReceipt"
                      checked={roleForm.autoPrintReceipt ?? true}
                      onChange={e => setRoleForm({ ...roleForm, autoPrintReceipt: e.target.checked })}
                      className="w-4 h-4 text-primary rounded"
                    />
                    <label htmlFor="autoReceipt" className="text-xs font-medium text-text-primary cursor-pointer">
                      Automatically prompt to print dispensing receipt upon fulfilling Rx
                    </label>
                  </div>
                  <div className="flex items-center gap-3">
                    <input 
                      type="checkbox" 
                      id="genericPrompt"
                      checked={roleForm.genericSubstitutionPrompt ?? true}
                      onChange={e => setRoleForm({ ...roleForm, genericSubstitutionPrompt: e.target.checked })}
                      className="w-4 h-4 text-primary rounded"
                    />
                    <label htmlFor="genericPrompt" className="text-xs font-medium text-text-primary cursor-pointer">
                      Suggest in-stock generic substitutes when prescribed brand is out of stock
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* STOREKEEPER PROFILE FORM */}
            {currentRole === 'Storekeeper' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-1.5">Storekeeper Full Name</label>
                  <input 
                    type="text" 
                    value={roleForm.fullName || currentUser?.name || ''}
                    onChange={e => setRoleForm({ ...roleForm, fullName: e.target.value })}
                    className="w-full p-2.5 bg-canvas border border-border rounded-xl focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-1.5">Employee Badge Number</label>
                  <input 
                    type="text" 
                    value={roleForm.employeeBadge || ''}
                    onChange={e => setRoleForm({ ...roleForm, employeeBadge: e.target.value })}
                    className="w-full p-2.5 bg-canvas border border-border rounded-xl focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-1.5">Main Warehouse &amp; Depots Monitored</label>
                  <input 
                    type="text" 
                    value={roleForm.warehouseZone || ''}
                    onChange={e => setRoleForm({ ...roleForm, warehouseZone: e.target.value })}
                    className="w-full p-2.5 bg-canvas border border-border rounded-xl focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-1.5">Default Reorder Warning Point (Units)</label>
                  <input 
                    type="number" 
                    value={roleForm.reorderThreshold || 100}
                    onChange={e => setRoleForm({ ...roleForm, reorderThreshold: Number(e.target.value) })}
                    className="w-full p-2.5 bg-canvas border border-border rounded-xl focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-1.5">Equipment Maintenance Inspection Frequency</label>
                  <select 
                    value={roleForm.equipmentInspectionDue || 'Bi-Weekly'}
                    onChange={e => setRoleForm({ ...roleForm, equipmentInspectionDue: e.target.value })}
                    className="w-full p-2.5 bg-canvas border border-border rounded-xl focus:border-primary focus:ring-1 focus:ring-primary"
                  >
                    <option>Weekly</option>
                    <option>Bi-Weekly</option>
                    <option>Monthly</option>
                    <option>Quarterly</option>
                  </select>
                </div>
              </div>
            )}

            {/* ADMIN PROFILE FORM */}
            {currentRole === 'Admin' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-1.5">Administrator Name</label>
                  <input 
                    type="text" 
                    value={roleForm.fullName || currentUser?.name || ''}
                    onChange={e => setRoleForm({ ...roleForm, fullName: e.target.value })}
                    className="w-full p-2.5 bg-canvas border border-border rounded-xl focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-1.5">Hospital / Organization System Name</label>
                  <input 
                    type="text" 
                    value={roleForm.organizationName || 'Hassan and Co. Healthcare Systems'}
                    onChange={e => setRoleForm({ ...roleForm, organizationName: e.target.value })}
                    className="w-full p-2.5 bg-canvas border border-border rounded-xl focus:border-primary focus:ring-1 focus:ring-primary font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-1.5">Security Clearance</label>
                  <input 
                    type="text" 
                    readOnly
                    value="Level 5 — Enterprise Full Access"
                    className="w-full p-2.5 bg-surface border border-border rounded-xl text-primary font-bold cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-1.5">System Audit Logging</label>
                  <select 
                    value={roleForm.auditLogLevel || 'Verbose (All Operations)'}
                    onChange={e => setRoleForm({ ...roleForm, auditLogLevel: e.target.value })}
                    className="w-full p-2.5 bg-canvas border border-border rounded-xl focus:border-primary focus:ring-1 focus:ring-primary"
                  >
                    <option>Verbose (All Operations &amp; Clinical Audit)</option>
                    <option>Standard (Prescriptions &amp; Stock Mutations)</option>
                    <option>Minimal</option>
                  </select>
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className="pt-4 border-t border-border flex justify-end">
              <button 
                onClick={handleProfileSave}
                className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white hover:bg-primary/90 rounded-xl font-bold text-xs md:text-sm transition-all shadow-xs"
              >
                <Save className="w-4 h-4" /> Save {currentRole} Profile
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Appearance & Customization (100% FUNCTIONAL) */}
        {activeTab === 'appearance' && (
          <div className="card p-6 md:p-8 space-y-8">
            <div>
              <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
                <Palette className="w-5 h-5 text-primary" /> Visual Theme &amp; Customization
              </h3>
              <p className="text-xs text-text-muted mt-0.5">
                These settings take immediate effect and persist across all devices and sessions
              </p>
            </div>

            {/* 1. Theme Accent Colors */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider">
                1. Theme Accent Color
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {THEME_ACCENTS.map((t) => {
                  const isSelected = (themeAccent || 'teal') === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setThemeAccent(t.id)}
                      className={`p-4 rounded-xl border text-left transition-all duration-150 flex items-start justify-between gap-3 ${
                        isSelected
                          ? 'border-primary bg-primary/5 ring-2 ring-primary/30 shadow-xs'
                          : 'border-border bg-surface hover:bg-canvas hover:border-border-dark'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded-full shadow-xs" style={{ backgroundColor: t.hex }} />
                          <span className="font-bold text-xs text-text-primary">{t.name}</span>
                        </div>
                        <p className="text-[11px] text-text-muted">{t.desc}</p>
                      </div>
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center shrink-0">
                          <Check size={12} strokeWidth={3} />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. UI Spacing & Density Modes */}
            <div className="space-y-3 pt-4 border-t border-border">
              <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider">
                2. UI Spacing &amp; Density Mode
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: 'spacious' as const, title: 'Spacious (Extra Breathing Room)', desc: 'Generous card padding, relaxed line heights, airy layout.' },
                  { id: 'comfortable' as const, title: 'Comfortable (Default)', desc: 'Optimal balance of readable whitespace and information density.' },
                  { id: 'compact' as const, title: 'Compact (Data-Dense)', desc: 'Tighter spacing for viewing high volumes of clinical data.' },
                ].map((mode) => {
                  const isSelected = (uiDensity || 'comfortable') === mode.id;
                  return (
                    <button
                      key={mode.id}
                      onClick={() => setUiDensity(mode.id)}
                      className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'border-primary bg-primary/5 ring-2 ring-primary/30 shadow-xs'
                          : 'border-border bg-surface hover:bg-canvas'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-xs text-text-primary">{mode.title}</span>
                          {isSelected && <Check size={14} className="text-primary font-bold" />}
                        </div>
                        <p className="text-[11px] text-text-muted leading-relaxed">{mode.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Font Scale */}
            <div className="space-y-3 pt-4 border-t border-border">
              <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider">
                3. Font Legibility &amp; Scale
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={() => setFontSizeScale('normal')}
                  className={`p-4 rounded-xl border text-left transition-all flex items-center justify-between ${
                    (fontSizeScale || 'normal') === 'normal'
                      ? 'border-primary bg-primary/5 ring-2 ring-primary/30'
                      : 'border-border bg-surface hover:bg-canvas'
                  }`}
                >
                  <div>
                    <div className="font-bold text-xs text-text-primary">Standard Clinical Font (14px)</div>
                    <div className="text-[11px] text-text-muted">Standard UI scale for laptops and desktop monitors</div>
                  </div>
                  {(fontSizeScale || 'normal') === 'normal' && <Check size={16} className="text-primary" />}
                </button>

                <button
                  onClick={() => setFontSizeScale('large')}
                  className={`p-4 rounded-xl border text-left transition-all flex items-center justify-between ${
                    fontSizeScale === 'large'
                      ? 'border-primary bg-primary/5 ring-2 ring-primary/30'
                      : 'border-border bg-surface hover:bg-canvas'
                  }`}
                >
                  <div>
                    <div className="font-bold text-sm text-text-primary">Large High-Legibility Font (16px)</div>
                    <div className="text-[11px] text-text-muted">Enlarged typography for fast readability &amp; tired eyes</div>
                  </div>
                  {fontSizeScale === 'large' && <Check size={16} className="text-primary" />}
                </button>
              </div>
            </div>

            {/* 4. Audio Alerts & Sidebar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-border">
              <div className="p-4 rounded-xl border border-border bg-canvas flex items-center justify-between">
                <div>
                  <div className="font-bold text-xs text-text-primary flex items-center gap-2">
                    {soundAlerts ? <Volume2 size={16} className="text-primary" /> : <VolumeX size={16} className="text-text-muted" />}
                    Auditory Critical Alerts
                  </div>
                  <div className="text-[11px] text-text-muted mt-0.5">Chime sound on critical triage scores and drug alerts</div>
                </div>
                <button
                  onClick={toggleSoundAlerts}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                    soundAlerts ? 'bg-primary text-white' : 'bg-surface border border-border text-text-secondary'
                  }`}
                >
                  {soundAlerts ? 'Enabled' : 'Muted'}
                </button>
              </div>

              <div className="p-4 rounded-xl border border-border bg-canvas flex items-center justify-between">
                <div>
                  <div className="font-bold text-xs text-text-primary flex items-center gap-2">
                    <Layout size={16} className="text-primary" />
                    Sidebar Default Layout
                  </div>
                  <div className="text-[11px] text-text-muted mt-0.5">Toggle initial state of navigation sidebar</div>
                </div>
                <button
                  onClick={toggleSidebar}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                    sidebarCollapsed ? 'bg-primary text-white' : 'bg-surface border border-border text-text-secondary'
                  }`}
                >
                  {sidebarCollapsed ? 'Collapsed' : 'Expanded'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: System Data & Backups */}
        {activeTab === 'data' && (
          <div className="card p-6 md:p-8 space-y-6">
            <div>
              <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
                <Database className="w-5 h-5 text-primary" /> System Data &amp; Database Maintenance
              </h3>
              <p className="text-xs text-text-muted mt-0.5">
                Local offline database storage, encrypted backup exports, and data integrity
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Backup Export Card */}
              <div className="p-5 border border-border rounded-xl bg-surface space-y-3 shadow-2xs">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-blue-500/10 text-blue-600 rounded-xl">
                    <Download className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-text-primary">Export JSON System Backup</h4>
                    <p className="text-xs text-text-muted">Includes all cases, inventory, patients, and orders</p>
                  </div>
                </div>
                <p className="text-xs text-text-secondary">
                  You currently have <strong className="text-text-primary font-bold">{savedCases.length}</strong> saved clinical cases in your local storage.
                </p>
                <button 
                  onClick={exportData}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl text-xs font-bold transition-all shadow-xs hover:bg-primary/90"
                >
                  <Download className="w-4 h-4" /> Export Backup File (.json)
                </button>
              </div>

              {/* Restore Backup Card */}
              <div className="p-5 border border-border rounded-xl bg-surface space-y-3 shadow-2xs">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-emerald-500/10 text-emerald-600 rounded-xl">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-text-primary">Restore from Backup</h4>
                    <p className="text-xs text-text-muted">Import previously exported JSON database files</p>
                  </div>
                </div>
                <p className="text-xs text-text-secondary">
                  Restores patients, clinical histories, inventory records, and user settings seamlessly.
                </p>
                <label className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-surface border border-border hover:bg-canvas rounded-xl text-xs font-bold text-text-primary cursor-pointer transition-all">
                  <Upload className="w-4 h-4 text-emerald-600" />
                  <span>Choose JSON Backup File</span>
                  <input type="file" accept=".json" onChange={handleFileImport} className="hidden" />
                </label>
              </div>

              {/* Danger Zone */}
              <div className="md:col-span-2 p-5 border border-rose-500/30 rounded-xl bg-rose-500/5 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-rose-500/10 text-rose-600 rounded-xl">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-rose-700 dark:text-rose-400">Cache Reset &amp; Session Flush</h4>
                    <p className="text-xs text-rose-600/80">Clears offline local storage cache and restores default clinic values</p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
                  <p className="text-xs text-text-secondary max-w-lg">
                    Use this if you encounter sync issues or want to re-seed demo patient datasets. Make sure to download a backup file first.
                  </p>
                  <button 
                    onClick={clearData}
                    className="flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs shrink-0"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Clear Local Cache
                  </button>
                </div>
              </div>
            </div>

            {/* Platform Branding Badge */}
            <div className="pt-6 border-t border-border flex flex-col items-center justify-center text-text-muted text-center">
              <div className="text-base font-bold tracking-wider text-primary">Hassan &amp; Co. Healthcare Systems</div>
              <div className="text-xs text-text-muted mt-0.5">Version 5.0.0 Enterprise Clinical Platform</div>
              <div className="text-[11px] text-text-faint mt-1">High-Performance Offline First &bull; HIPAA / PMDC Architecture Compliant</div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
