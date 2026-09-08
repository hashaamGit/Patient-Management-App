import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import type { PatientRecord } from '../store/useAppStore';
import {
  Users, Search, UserPlus, Phone, Calendar, Heart, AlertTriangle,
  Stethoscope, FileText, CheckCircle2, ChevronRight, X, Clock,
  Activity, ShieldAlert, ArrowRight, Filter
} from 'lucide-react';

export const PatientsDirectory = () => {
  const navigate = useNavigate();
  const { patientsList, addPatientRecord, selectActivePatient, patient: activePatient } = useAppStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGender, setSelectedGender] = useState<string>('All');
  const [selectedBlood, setSelectedBlood] = useState<string>('All');

  // Modal states
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [historyModalPatient, setHistoryModalPatient] = useState<PatientRecord | null>(null);
  const [activeToast, setActiveToast] = useState<string | null>(null);

  // New Patient Form state
  const [newPatient, setNewPatient] = useState({
    name: '',
    age: '',
    gender: 'Male',
    phone: '+92 300 ',
    bloodGroup: 'B+',
    allergies: '',
    diagnoses: '',
    bp: '120/80',
    temp: '37.0',
    pulse: '76',
    weight: '68'
  });

  const filteredPatients = useMemo(() => {
    return patientsList.filter(p => {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        p.name.toLowerCase().includes(query) ||
        p.mrn.toLowerCase().includes(query) ||
        p.phone.includes(query) ||
        p.diagnoses.some(d => d.toLowerCase().includes(query)) ||
        p.allergies.some(a => a.toLowerCase().includes(query));

      const matchesGender = selectedGender === 'All' || p.gender === selectedGender;
      const matchesBlood = selectedBlood === 'All' || p.bloodGroup === selectedBlood;

      return matchesSearch && matchesGender && matchesBlood;
    });
  }, [patientsList, searchQuery, selectedGender, selectedBlood]);

  const handleSelectPatient = (p: PatientRecord, redirect: boolean = false) => {
    selectActivePatient(p);
    setActiveToast(`Switched active consultation to ${p.name} (${p.mrn})`);
    setTimeout(() => setActiveToast(null), 4000);
    if (redirect) {
      navigate('/workspace');
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPatient.name.trim() || !newPatient.age.trim()) return;

    const mrn = `HC-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const allergiesList = newPatient.allergies
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);
    const diagnosesList = newPatient.diagnoses
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    const record: Omit<PatientRecord, 'id'> = {
      mrn,
      name: newPatient.name.trim(),
      age: newPatient.age.trim(),
      gender: newPatient.gender,
      phone: newPatient.phone.trim(),
      bloodGroup: newPatient.bloodGroup,
      lastVisit: new Date().toISOString(),
      allergies: allergiesList,
      diagnoses: diagnosesList.length > 0 ? diagnosesList : ['General OPD Consultation'],
      vitals: {
        bp: newPatient.bp,
        temp: newPatient.temp,
        pulse: newPatient.pulse,
        weight: newPatient.weight
      }
    };

    addPatientRecord(record);
    setIsRegisterOpen(false);
    setActiveToast(`Registered new patient: ${newPatient.name} (${mrn})`);
    setTimeout(() => setActiveToast(null), 4000);

    // Reset form
    setNewPatient({
      name: '',
      age: '',
      gender: 'Male',
      phone: '+92 300 ',
      bloodGroup: 'B+',
      allergies: '',
      diagnoses: '',
      bp: '120/80',
      temp: '37.0',
      pulse: '76',
      weight: '68'
    });
  };

  return (
    <div className="h-full flex flex-col overflow-hidden bg-canvas">
      {/* Top Header */}
      <div className="bg-white border-b border-border px-6 py-4 flex flex-col gap-4 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-primary/10 rounded-xl text-primary">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-text-primary">Patients Master Directory</h1>
                <span className="bg-primary/10 text-primary text-xs font-bold px-2.5 py-0.5 rounded-full">
                  {patientsList.length} Registered
                </span>
              </div>
              <p className="text-xs text-text-muted">
                Hospital electronic master patient index, clinical records & visit trajectories
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsRegisterOpen(true)}
              className="bg-primary hover:bg-primary-hover text-white text-sm font-semibold px-4 py-2 rounded-lg shadow-sm flex items-center gap-2 transition-all"
            >
              <UserPlus className="w-4 h-4" />
              <span>Register New Patient</span>
            </button>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="relative flex-1 min-w-[280px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              placeholder="Search by Name, MRN, Contact Phone, or Diagnosis..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-border rounded-lg bg-canvas focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs text-text-muted font-medium">
              <Filter className="w-3.5 h-3.5" /> Filter:
            </div>
            <select
              value={selectedGender}
              onChange={(e) => setSelectedGender(e.target.value)}
              className="text-xs border border-border rounded-lg bg-surface px-3 py-2 text-text-secondary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="All">All Genders</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
            <select
              value={selectedBlood}
              onChange={(e) => setSelectedBlood(e.target.value)}
              className="text-xs border border-border rounded-lg bg-surface px-3 py-2 text-text-secondary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="All">All Blood Groups</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {activeToast && (
        <div className="mx-6 mt-3 px-4 py-2.5 bg-emerald-50 border border-emerald-300 rounded-lg flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2 text-emerald-800 text-sm font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{activeToast}</span>
          </div>
          <button
            onClick={() => navigate('/workspace')}
            className="text-xs text-emerald-700 hover:text-emerald-900 underline font-bold flex items-center gap-1"
          >
            <span>Open Clinical Workspace</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Patient Directory Grid */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-6xl mx-auto space-y-4">
          {filteredPatients.length === 0 ? (
            <div className="bg-surface border border-border rounded-xl p-12 text-center text-text-muted">
              <Users className="w-12 h-12 mx-auto text-slate-300 mb-3" />
              <p className="font-semibold text-text-primary">No patients found matching your search</p>
              <p className="text-xs text-text-muted mt-1">Try refining your search terms or register a new patient.</p>
            </div>
          ) : (
            filteredPatients.map(p => {
              const isActive = activePatient?.mrn === p.mrn;

              return (
                <div
                  key={p.id}
                  className={`bg-surface border rounded-xl p-4 transition-all shadow-xs hover:shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                    isActive ? 'border-primary ring-1 ring-primary/30 bg-primary/2' : 'border-border'
                  }`}
                >
                  {/* Left Column: Avatar & Demographics */}
                  <div className="flex items-start gap-3.5 flex-1 min-w-[280px]">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-base shrink-0 ${
                      p.gender === 'Female' ? 'bg-pink-100 text-pink-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {p.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h2 className="font-bold text-base text-text-primary">{p.name}</h2>
                        <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                          {p.mrn}
                        </span>
                        {isActive && (
                          <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                            Active Consultation
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3 text-xs text-text-secondary flex-wrap">
                        <span>{p.age} • {p.gender}</span>
                        <span>•</span>
                        <span className="font-semibold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded">
                          {p.bloodGroup}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1 text-text-muted">
                          <Phone className="w-3 h-3" /> {p.phone}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1 text-text-muted">
                          <Calendar className="w-3 h-3" /> Last: {new Date(p.lastVisit).toLocaleDateString()}
                        </span>
                      </div>

                      {/* Clinical Diagnoses & Allergies */}
                      <div className="flex items-center gap-2 pt-1 flex-wrap">
                        {p.diagnoses.map((d, i) => (
                          <span key={i} className="text-[11px] font-medium bg-blue-50 text-blue-800 border border-blue-200 px-2 py-0.5 rounded-md">
                            {d}
                          </span>
                        ))}
                        {p.allergies && p.allergies.length > 0 && p.allergies.map((a, i) => (
                          <span key={i} className="text-[11px] font-semibold bg-red-50 text-red-700 border border-red-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" /> {a}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Vitals Summary & Action Buttons */}
                  <div className="flex items-center gap-4 shrink-0 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0 border-border">
                    {p.vitals && (
                      <div className="hidden lg:flex flex-col text-right text-xs text-text-muted bg-canvas px-3 py-1.5 rounded-lg border border-border">
                        <span className="font-bold text-text-primary">BP: {p.vitals.bp}</span>
                        <span className="text-[11px]">HR: {p.vitals.pulse} bpm • {p.vitals.temp}°C</span>
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setHistoryModalPatient(p)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold text-text-secondary bg-canvas hover:bg-border border border-border flex items-center gap-1.5 transition-colors"
                      >
                        <FileText className="w-3.5 h-3.5 text-text-muted" />
                        <span>Past Visits</span>
                      </button>

                      <button
                        onClick={() => handleSelectPatient(p, true)}
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs ${
                          isActive
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                            : 'bg-primary hover:bg-primary-hover text-white'
                        }`}
                      >
                        <Stethoscope className="w-3.5 h-3.5" />
                        <span>{isActive ? 'Continue Session' : 'Load Consultation'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Register New Patient Modal */}
      {isRegisterOpen && (
        <div className="fixed inset-0 bg-nav/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-surface rounded-xl shadow-xl w-full max-w-lg overflow-hidden border border-border">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-primary" />
                <h3 className="font-bold text-base text-text-primary">Register New Patient</h3>
              </div>
              <button onClick={() => setIsRegisterOpen(false)} className="text-text-muted hover:text-text-primary">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRegisterSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-text-secondary mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tariq Mahmood"
                  value={newPatient.name}
                  onChange={(e) => setNewPatient({ ...newPatient, name: e.target.value })}
                  className="w-full text-sm p-2 border border-border rounded-lg bg-surface focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-text-secondary mb-1">Age *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 48y"
                    value={newPatient.age}
                    onChange={(e) => setNewPatient({ ...newPatient, age: e.target.value })}
                    className="w-full text-sm p-2 border border-border rounded-lg bg-surface focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-text-secondary mb-1">Gender</label>
                  <select
                    value={newPatient.gender}
                    onChange={(e) => setNewPatient({ ...newPatient, gender: e.target.value })}
                    className="w-full text-sm p-2 border border-border rounded-lg bg-surface focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-text-secondary mb-1">Blood Group</label>
                  <select
                    value={newPatient.bloodGroup}
                    onChange={(e) => setNewPatient({ ...newPatient, bloodGroup: e.target.value })}
                    className="w-full text-sm p-2 border border-border rounded-lg bg-surface focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-text-secondary mb-1">Phone Number</label>
                <input
                  type="text"
                  placeholder="+92 300 1234567"
                  value={newPatient.phone}
                  onChange={(e) => setNewPatient({ ...newPatient, phone: e.target.value })}
                  className="w-full text-sm p-2 border border-border rounded-lg bg-surface focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-text-secondary mb-1">Known Allergies (comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Penicillin, NSAIDs, Sulfa"
                  value={newPatient.allergies}
                  onChange={(e) => setNewPatient({ ...newPatient, allergies: e.target.value })}
                  className="w-full text-sm p-2 border border-border rounded-lg bg-surface focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-text-secondary mb-1">Known Diagnoses (comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Type 2 Diabetes, Essential Hypertension"
                  value={newPatient.diagnoses}
                  onChange={(e) => setNewPatient({ ...newPatient, diagnoses: e.target.value })}
                  className="w-full text-sm p-2 border border-border rounded-lg bg-surface focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="grid grid-cols-4 gap-2 pt-2 border-t border-border">
                <div>
                  <label className="block text-[11px] font-medium text-text-muted mb-0.5">BP</label>
                  <input
                    type="text"
                    value={newPatient.bp}
                    onChange={(e) => setNewPatient({ ...newPatient, bp: e.target.value })}
                    className="w-full text-xs p-1.5 border border-border rounded bg-canvas"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-text-muted mb-0.5">Temp (°C)</label>
                  <input
                    type="text"
                    value={newPatient.temp}
                    onChange={(e) => setNewPatient({ ...newPatient, temp: e.target.value })}
                    className="w-full text-xs p-1.5 border border-border rounded bg-canvas"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-text-muted mb-0.5">Pulse</label>
                  <input
                    type="text"
                    value={newPatient.pulse}
                    onChange={(e) => setNewPatient({ ...newPatient, pulse: e.target.value })}
                    className="w-full text-xs p-1.5 border border-border rounded bg-canvas"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-text-muted mb-0.5">Weight (kg)</label>
                  <input
                    type="text"
                    value={newPatient.weight}
                    onChange={(e) => setNewPatient({ ...newPatient, weight: e.target.value })}
                    className="w-full text-xs p-1.5 border border-border rounded bg-canvas"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsRegisterOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-text-secondary hover:bg-canvas rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-primary text-white hover:bg-primary-hover rounded-lg shadow-sm"
                >
                  Register &amp; Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Patient Past Visits & Trajectory Modal */}
      {historyModalPatient && (
        <div className="fixed inset-0 bg-nav/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-surface rounded-xl shadow-xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden border border-border">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-text-primary">
                    {historyModalPatient.name} — Medical Record History
                  </h3>
                  <p className="text-xs text-text-muted">
                    MRN: {historyModalPatient.mrn} • {historyModalPatient.age} • {historyModalPatient.gender}
                  </p>
                </div>
              </div>
              <button onClick={() => setHistoryModalPatient(null)} className="text-text-muted hover:text-text-primary">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6">
              {/* Baseline Summary */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-canvas p-3 rounded-lg border border-border">
                <div>
                  <span className="text-[10px] text-text-muted uppercase font-bold">Blood Group</span>
                  <div className="text-sm font-bold text-rose-600">{historyModalPatient.bloodGroup}</div>
                </div>
                <div>
                  <span className="text-[10px] text-text-muted uppercase font-bold">Phone</span>
                  <div className="text-xs font-medium text-text-primary">{historyModalPatient.phone}</div>
                </div>
                <div>
                  <span className="text-[10px] text-text-muted uppercase font-bold">Last Recorded BP</span>
                  <div className="text-xs font-bold text-text-primary">{historyModalPatient.vitals?.bp || '120/80'}</div>
                </div>
                <div>
                  <span className="text-[10px] text-text-muted uppercase font-bold">Pulse Rate</span>
                  <div className="text-xs font-bold text-text-primary">{historyModalPatient.vitals?.pulse || '76'} bpm</div>
                </div>
              </div>

              {/* Past Visits Timeline */}
              <div>
                <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-primary" /> Past Consultation Visits &amp; Diagnoses
                </h4>
                <div className="border-l-2 border-primary/30 pl-4 ml-2 space-y-4">
                  <div className="relative">
                    <span className="w-2.5 h-2.5 rounded-full bg-primary absolute -left-[21px] top-1"></span>
                    <div className="bg-canvas border border-border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-text-primary">
                          {new Date(historyModalPatient.lastVisit).toLocaleDateString()} (Latest OPD Visit)
                        </span>
                        <span className="text-[10px] bg-blue-100 text-blue-800 font-semibold px-2 py-0.5 rounded">
                          Attended
                        </span>
                      </div>
                      <div className="text-xs text-text-secondary">
                        <strong>Clinical Diagnoses:</strong> {historyModalPatient.diagnoses.join(', ')}
                      </div>
                      <div className="text-[11px] text-text-muted mt-1">
                        Physician evaluation completed. Prescribed standard management regimen.
                      </div>
                    </div>
                  </div>

                  <div className="relative">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-300 absolute -left-[21px] top-1"></span>
                    <div className="bg-canvas border border-border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-text-primary">
                          {new Date(new Date(historyModalPatient.lastVisit).getTime() - 86400000 * 28).toLocaleDateString()} (Prior Consultation)
                        </span>
                        <span className="text-[10px] bg-slate-200 text-slate-700 font-semibold px-2 py-0.5 rounded">
                          Follow-up
                        </span>
                      </div>
                      <div className="text-xs text-text-secondary">
                        Routine checkup and clinical symptom review.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-border bg-canvas flex items-center justify-between">
              <button
                onClick={() => setHistoryModalPatient(null)}
                className="text-xs font-semibold text-text-secondary hover:text-text-primary"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleSelectPatient(historyModalPatient, true);
                  setHistoryModalPatient(null);
                }}
                className="px-4 py-2 text-xs font-bold bg-primary text-white hover:bg-primary-hover rounded-lg flex items-center gap-1.5 shadow-sm"
              >
                <Stethoscope className="w-3.5 h-3.5" />
                <span>Load Consultation in Workspace</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
