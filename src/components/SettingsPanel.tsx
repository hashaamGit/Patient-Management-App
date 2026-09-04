import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { Settings, User, FileText, Palette, Database, Save, Download, Upload, RotateCcw, CheckCircle2, Shield, Layout } from 'lucide-react';

export const SettingsPanel = () => {
  const { doctorProfile, updateDoctorProfile, savedCases, sidebarCollapsed, toggleSidebar } = useAppStore();
  
  const [activeTab, setActiveTab] = useState<'profile' | 'preferences' | 'data'>('profile');
  
  const [profileForm, setProfileForm] = useState(doctorProfile);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  const handleProfileSave = () => {
    updateDoctorProfile(profileForm);
    setSaveStatus('Profile updated successfully.');
    setTimeout(() => setSaveStatus(null), 3000);
  };

  const exportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(savedCases, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", `clinrail_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const clearData = () => {
    if(window.confirm('Are you sure you want to clear all saved cases? This cannot be undone.')) {
      localStorage.removeItem('clinrail-v4-storage');
      window.location.reload();
    }
  };

  return (
    <div className="h-full overflow-y-auto p-6 bg-canvas">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-border pb-4">
          <div className="p-2 bg-primary/10 rounded-lg text-primary">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-text-primary">Settings</h2>
            <p className="text-sm text-text-secondary">Manage application preferences and doctor profile</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
          <button 
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 text-sm font-medium rounded-md flex items-center gap-2 transition-colors ${activeTab === 'profile' ? 'bg-white shadow text-primary' : 'text-text-secondary hover:bg-gray-200'}`}
          >
            <User className="w-4 h-4" /> Profile
          </button>
          <button 
            onClick={() => setActiveTab('preferences')}
            className={`px-4 py-2 text-sm font-medium rounded-md flex items-center gap-2 transition-colors ${activeTab === 'preferences' ? 'bg-white shadow text-primary' : 'text-text-secondary hover:bg-gray-200'}`}
          >
            <Layout className="w-4 h-4" /> Preferences
          </button>
          <button 
            onClick={() => setActiveTab('data')}
            className={`px-4 py-2 text-sm font-medium rounded-md flex items-center gap-2 transition-colors ${activeTab === 'data' ? 'bg-white shadow text-primary' : 'text-text-secondary hover:bg-gray-200'}`}
          >
            <Database className="w-4 h-4" /> Data
          </button>
        </div>

        {/* Tab Content */}
        <div className="card p-6 min-h-[500px]">
          
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" /> Doctor Profile
                </h3>
                {saveStatus && <span className="text-sm text-success-text flex items-center gap-1"><CheckCircle2 className="w-4 h-4"/> {saveStatus}</span>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">Full Name</label>
                  <input 
                    type="text" 
                    value={profileForm.name}
                    onChange={e => setProfileForm({ ...profileForm, name: e.target.value })}
                    className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">Credentials / Degrees</label>
                  <input 
                    type="text" 
                    value={profileForm.credentials}
                    onChange={e => setProfileForm({ ...profileForm, credentials: e.target.value })}
                    className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">Registration Number (PMDC/GMC)</label>
                  <input 
                    type="text" 
                    value={profileForm.registrationNo}
                    onChange={e => setProfileForm({ ...profileForm, registrationNo: e.target.value })}
                    className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">Specialty</label>
                  <input 
                    type="text" 
                    value={profileForm.specialty}
                    onChange={e => setProfileForm({ ...profileForm, specialty: e.target.value })}
                    className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-text-secondary mb-1">Clinic / Hospital Name</label>
                  <input 
                    type="text" 
                    value={profileForm.clinicName}
                    onChange={e => setProfileForm({ ...profileForm, clinicName: e.target.value })}
                    className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-text-secondary mb-1">Clinic Address</label>
                  <textarea 
                    value={profileForm.clinicAddress}
                    onChange={e => setProfileForm({ ...profileForm, clinicAddress: e.target.value })}
                    className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[60px]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">Contact Phone</label>
                  <input 
                    type="text" 
                    value={profileForm.phone}
                    onChange={e => setProfileForm({ ...profileForm, phone: e.target.value })}
                    className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-border flex justify-end">
                <button 
                  onClick={handleProfileSave}
                  className="flex items-center gap-2 px-6 py-2 bg-primary text-white hover:bg-primary/90 rounded-md font-medium transition-colors"
                >
                  <Save className="w-4 h-4" /> Save Changes
                </button>
              </div>

              {/* Letterhead Preview */}
              <div className="mt-8 bg-gray-50 border border-border rounded-lg p-6">
                <h4 className="text-sm font-semibold text-text-muted mb-4 uppercase tracking-wider">Prescription Letterhead Preview</h4>
                <div className="bg-white p-6 border-t-8 border-primary shadow-sm rounded">
                  <div className="text-center">
                    <h1 className="text-2xl font-black text-gray-900 tracking-tight">{profileForm.name}</h1>
                    <p className="text-sm font-bold text-gray-600 mt-1">{profileForm.credentials}</p>
                    <p className="text-xs text-gray-500 mt-1">{profileForm.specialty} | Reg: {profileForm.registrationNo}</p>
                    <div className="mt-4 pt-4 border-t border-dashed border-gray-300">
                      <p className="text-sm font-medium text-gray-800">{profileForm.clinicName}</p>
                      <p className="text-xs text-gray-500 mt-1 whitespace-pre-line">{profileForm.clinicAddress}</p>
                      <p className="text-xs text-gray-500 mt-1">{profileForm.phone}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'preferences' && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-6">
                <Layout className="w-5 h-5 text-primary" /> Application Preferences
              </h3>

              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-border">
                  <div>
                    <h4 className="font-medium text-gray-900">Sidebar Default State</h4>
                    <p className="text-sm text-text-secondary">Choose whether the sidebar starts expanded or collapsed.</p>
                  </div>
                  <button 
                    onClick={toggleSidebar}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${sidebarCollapsed ? 'bg-primary text-white' : 'bg-white border border-border text-gray-700'}`}
                  >
                    {sidebarCollapsed ? 'Collapsed' : 'Expanded'}
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-border">
                  <div>
                    <h4 className="font-medium text-gray-900">Display Density</h4>
                    <p className="text-sm text-text-secondary">Adjust the spacing and size of UI elements. (Coming Soon)</p>
                  </div>
                  <select className="p-2 border border-border rounded-md text-sm bg-white" disabled>
                    <option>Comfortable</option>
                    <option>Compact</option>
                  </select>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg border border-border">
                  <h4 className="font-medium text-gray-900 mb-2">Theme Colors</h4>
                  <p className="text-sm text-text-secondary mb-4">Current clinical design system palette.</p>
                  <div className="flex gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#086E64]" title="Primary"></div>
                    <div className="w-8 h-8 rounded-full bg-[#DC2626]" title="Danger"></div>
                    <div className="w-8 h-8 rounded-full bg-[#D97706]" title="Warning"></div>
                    <div className="w-8 h-8 rounded-full bg-[#16A34A]" title="Success"></div>
                    <div className="w-8 h-8 rounded-full bg-[#0284C7]" title="Info"></div>
                    <div className="w-8 h-8 rounded-full bg-[#0F172A]" title="Nav"></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'data' && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-6">
                <Database className="w-5 h-5 text-primary" /> Data Management
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <div className="p-5 border border-border rounded-lg bg-gray-50">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-blue-100 text-blue-700 rounded-md">
                      <FileText className="w-5 h-5" />
                    </div>
                    <h4 className="font-bold text-gray-900">Local Storage</h4>
                  </div>
                  <p className="text-sm text-text-secondary mb-4">You have <strong className="text-gray-900">{savedCases.length}</strong> saved cases stored locally on this device.</p>
                  <button 
                    onClick={exportData}
                    disabled={savedCases.length === 0}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white border border-border hover:bg-gray-50 text-gray-700 rounded-md text-sm font-medium transition-colors disabled:opacity-50"
                  >
                    <Download className="w-4 h-4" /> Export All Data (JSON)
                  </button>
                </div>

                <div className="p-5 border border-danger/30 rounded-lg bg-danger-bg">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-danger/10 text-danger rounded-md">
                      <Shield className="w-5 h-5" />
                    </div>
                    <h4 className="font-bold text-danger-text">Danger Zone</h4>
                  </div>
                  <p className="text-sm text-danger-text/80 mb-4">Permanently delete all patient data, cases, and settings from this device.</p>
                  <button 
                    onClick={clearData}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-danger text-white hover:bg-danger/90 rounded-md text-sm font-medium transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" /> Clear All Data
                  </button>
                </div>

              </div>

              <div className="mt-8 pt-6 border-t border-border flex flex-col items-center justify-center text-text-muted">
                <div className="text-lg font-bold tracking-widest mb-1 text-gray-400">CLIN/RAIL</div>
                <div className="text-xs">Version 4.0.0</div>
                <div className="text-xs mt-1">Local Mode Active</div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
