import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { format } from 'date-fns';
import { History, Plus, X, Trash2, Calendar, User, Users, Briefcase, Heart, Cigarette, Wine, Dumbbell, FileText, ChevronDown, ChevronUp, Search, Clock, Pill, Stethoscope, Eye } from 'lucide-react';

export const PatientHistory = () => {
  const { patientHistory, updatePatientHistory, savedCases, loadCase, deleteCase, patient } = useAppStore();
  
  const [newPmH, setNewPmH] = useState('');
  const [surgProc, setSurgProc] = useState('');
  const [surgDate, setSurgDate] = useState('');
  const [famRel, setFamRel] = useState('Father');
  const [famCond, setFamCond] = useState('');
  
  const [searchTerm, setSearchTerm] = useState('');

  const pmhQuickAdds = ['HTN', 'DM Type 2', 'IHD', 'CKD Stage 3', 'COPD', 'Asthma', 'Hypothyroidism', 'Hyperlipidemia', 'Hepatitis B', 'Hepatitis C', 'Epilepsy', 'Depression'];
  const surgQuickAdds = ['Appendectomy', 'Cholecystectomy', 'C-Section', 'Hernia Repair', 'CABG'];
  const famRelations = ['Father', 'Mother', 'Sibling', 'Grandparent', 'Other'];
  const famCommon = ['HTN', 'DM', 'IHD', 'Stroke', 'Cancer', 'Asthma'];

  const filteredCases = savedCases.filter(c => 
    c.date.includes(searchTerm) || 
    c.prescription.diagnosis.some(d => d.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="h-full overflow-y-auto p-6 bg-canvas">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-border pb-4">
          <div className="p-2 bg-primary/10 rounded-lg text-primary">
            <History className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-text-primary">Patient History</h2>
            <p className="text-sm text-text-secondary">{patient.name ? `Patient: ${patient.name}` : 'No patient selected'}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column (60%) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Past Medical History */}
            <div className="card p-5 rounded-2xl shadow-xs space-y-4">
              <h3 className="flex items-center gap-2 font-bold text-text-primary text-base">
                <Heart className="w-5 h-5 text-danger" /> Past Medical History
              </h3>
              
              <div className="flex flex-wrap gap-2">
                {pmhQuickAdds.map(q => (
                  <button
                    key={q}
                    onClick={() => !patientHistory.pastMedical.includes(q) && updatePatientHistory({ pastMedical: [...patientHistory.pastMedical, q] })}
                    className="px-2.5 py-1 bg-canvas hover:bg-surface border border-border text-xs rounded-lg font-medium text-text-primary transition-colors"
                  >
                    + {q}
                  </button>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newPmH}
                  onChange={e => setNewPmH(e.target.value)}
                  onKeyDown={e => {
                    if(e.key === 'Enter' && newPmH) {
                       updatePatientHistory({ pastMedical: [...patientHistory.pastMedical, newPmH] });
                       setNewPmH('');
                    }
                  }}
                  className="flex-1 p-2.5 text-sm bg-canvas border border-border rounded-xl focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-text-primary"
                  placeholder="Add other medical condition..."
                />
                <button 
                  onClick={() => {
                    if(newPmH) {
                       updatePatientHistory({ pastMedical: [...patientHistory.pastMedical, newPmH] });
                       setNewPmH('');
                    }
                  }}
                  className="px-4 bg-primary text-white hover:bg-primary/90 rounded-xl text-sm font-bold transition-all shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                {patientHistory.pastMedical.map((pmh, i) => (
                  <div key={i} className="flex items-center gap-1.5 px-3 py-1 bg-danger-bg text-danger-text border border-danger-border rounded-lg text-xs font-semibold">
                    {pmh}
                    <button onClick={() => updatePatientHistory({ pastMedical: patientHistory.pastMedical.filter((_, idx) => idx !== i) })} className="hover:opacity-75"><X className="w-3.5 h-3.5" /></button>
                  </div>
                ))}
                {patientHistory.pastMedical.length === 0 && <span className="text-xs text-text-muted italic">No past medical history recorded.</span>}
              </div>
            </div>

            {/* Past Surgical History */}
            <div className="card p-5 rounded-2xl shadow-xs space-y-4">
              <h3 className="flex items-center gap-2 font-bold text-text-primary text-base">
                <Stethoscope className="w-5 h-5 text-blue-600" /> Past Surgical History
              </h3>
              
              <div className="flex flex-wrap gap-2">
                {surgQuickAdds.map(q => (
                  <button
                    key={q}
                    onClick={() => setSurgProc(q)}
                    className="px-2.5 py-1 bg-canvas hover:bg-surface border border-border text-xs rounded-lg font-medium text-text-primary transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>

              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={surgProc}
                  onChange={e => setSurgProc(e.target.value)}
                  className="flex-1 p-2 text-sm border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="Procedure..."
                />
                <input
                  type="text"
                  value={surgDate}
                  onChange={e => setSurgDate(e.target.value)}
                  className="w-32 p-2 text-sm border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="Year/Date"
                />
                <button 
                  onClick={() => {
                    if(surgProc) {
                       updatePatientHistory({ pastSurgical: [...patientHistory.pastSurgical, { procedure: surgProc, date: surgDate }] });
                       setSurgProc(''); setSurgDate('');
                    }
                  }}
                  className="px-3 bg-primary text-white hover:bg-primary/90 rounded-md text-sm font-medium"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2">
                {patientHistory.pastSurgical.map((surg, i) => (
                  <div key={i} className="flex justify-between items-center p-2 bg-gray-50 border border-border rounded-md text-sm">
                    <span className="font-medium">{surg.procedure} <span className="text-text-muted font-normal text-xs ml-2">{surg.date}</span></span>
                    <button onClick={() => updatePatientHistory({ pastSurgical: patientHistory.pastSurgical.filter((_, idx) => idx !== i) })} className="text-gray-400 hover:text-danger"><Trash2 className="w-4 h-4" /></button>
                  </div>
                ))}
                {patientHistory.pastSurgical.length === 0 && <span className="text-sm text-text-muted italic">No past surgical history recorded.</span>}
              </div>
            </div>

            {/* Family History */}
            <div className="card p-4">
              <h3 className="flex items-center gap-2 font-bold text-gray-900 mb-4">
                <Users className="w-4 h-4 text-purple-600" /> Family History
              </h3>

              <div className="flex gap-2 mb-4">
                <select 
                  value={famRel} 
                  onChange={e => setFamRel(e.target.value)}
                  className="w-32 p-2 text-sm border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  {famRelations.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={famCond}
                    onChange={e => setFamCond(e.target.value)}
                    className="w-full p-2 text-sm border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="Condition..."
                  />
                  <div className="absolute right-2 top-2 flex gap-1">
                    {famCommon.map(c => (
                      <button key={c} onClick={() => setFamCond(c)} className="text-[10px] bg-gray-100 px-1 py-0.5 rounded text-gray-500 hover:bg-gray-200">{c}</button>
                    ))}
                  </div>
                </div>
                <button 
                  onClick={() => {
                    if(famCond) {
                       updatePatientHistory({ familyHistory: [...patientHistory.familyHistory, { relation: famRel, condition: famCond }] });
                       setFamCond('');
                    }
                  }}
                  className="px-3 bg-primary text-white hover:bg-primary/90 rounded-md text-sm font-medium"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2">
                {patientHistory.familyHistory.map((fam, i) => (
                  <div key={i} className="flex justify-between items-center p-2 bg-gray-50 border border-border rounded-md text-sm">
                    <span><span className="font-semibold text-gray-700">{fam.relation}:</span> {fam.condition}</span>
                    <button onClick={() => updatePatientHistory({ familyHistory: patientHistory.familyHistory.filter((_, idx) => idx !== i) })} className="text-gray-400 hover:text-danger"><Trash2 className="w-4 h-4" /></button>
                  </div>
                ))}
                {patientHistory.familyHistory.length === 0 && <span className="text-sm text-text-muted italic">No family history recorded.</span>}
              </div>
            </div>

            {/* Social History */}
            <div className="card p-4">
              <h3 className="flex items-center gap-2 font-bold text-gray-900 mb-4">
                <User className="w-4 h-4 text-amber-600" /> Social History
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-1 text-sm font-medium text-text-secondary mb-1"><Cigarette className="w-3 h-3"/> Smoking</label>
                  <select 
                    value={patientHistory.socialHistory.smoking}
                    onChange={e => updatePatientHistory({ socialHistory: { ...patientHistory.socialHistory, smoking: e.target.value } })}
                    className="w-full p-2 text-sm border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    <option value="">Select...</option>
                    <option value="Never">Never</option>
                    <option value="Ex-Smoker">Ex-Smoker</option>
                    <option value="Current (Light)">Current (Light)</option>
                    <option value="Current (Heavy)">Current (Heavy)</option>
                  </select>
                </div>
                <div>
                  <label className="flex items-center gap-1 text-sm font-medium text-text-secondary mb-1"><Wine className="w-3 h-3"/> Alcohol</label>
                  <select 
                    value={patientHistory.socialHistory.alcohol}
                    onChange={e => updatePatientHistory({ socialHistory: { ...patientHistory.socialHistory, alcohol: e.target.value } })}
                    className="w-full p-2 text-sm border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    <option value="">Select...</option>
                    <option value="Never">Never</option>
                    <option value="Social">Social</option>
                    <option value="Regular">Regular</option>
                    <option value="Heavy">Heavy</option>
                  </select>
                </div>
                <div>
                  <label className="flex items-center gap-1 text-sm font-medium text-text-secondary mb-1"><Briefcase className="w-3 h-3"/> Occupation</label>
                  <input 
                    type="text"
                    value={patientHistory.socialHistory.occupation}
                    onChange={e => updatePatientHistory({ socialHistory: { ...patientHistory.socialHistory, occupation: e.target.value } })}
                    className="w-full p-2 text-sm border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="e.g. Teacher, Engineer"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-1 text-sm font-medium text-text-secondary mb-1"><Dumbbell className="w-3 h-3"/> Exercise</label>
                  <select 
                    value={patientHistory.socialHistory.exercise}
                    onChange={e => updatePatientHistory({ socialHistory: { ...patientHistory.socialHistory, exercise: e.target.value } })}
                    className="w-full p-2 text-sm border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    <option value="">Select...</option>
                    <option value="Sedentary">Sedentary</option>
                    <option value="Light">Light</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Active">Active</option>
                  </select>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column (40%) - Encounter Timeline */}
          <div className="lg:col-span-5">
            <div className="card h-full flex flex-col">
              <div className="p-4 border-b border-border bg-gray-50/50">
                <h3 className="flex items-center gap-2 font-bold text-gray-900 mb-3">
                  <Clock className="w-4 h-4 text-primary" /> Encounter Timeline
                </h3>
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Search past encounters..." 
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 bg-white"
                  />
                </div>
              </div>
              
              <div className="p-4 flex-1 overflow-y-auto space-y-4">
                {filteredCases.length === 0 ? (
                  <div className="text-center py-8 text-text-muted">
                    <History className="w-12 h-12 mx-auto text-gray-300 mb-2" />
                    <p className="text-sm">No saved encounters yet.</p>
                  </div>
                ) : (
                  filteredCases.map(c => (
                    <div key={c.id} className="border border-border rounded-lg p-3 hover:border-primary/30 transition-colors bg-white">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <span className="text-xs font-semibold text-primary flex items-center gap-1">
                            <Calendar className="w-3 h-3" /> {format(new Date(c.date), 'MMM d, yyyy h:mm a')}
                          </span>
                          <h4 className="font-bold text-gray-900 text-sm mt-1">{c.patient.name}</h4>
                        </div>
                        <div className="flex gap-1">
                          <button 
                            onClick={() => loadCase(c.id)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                            title="Load Case"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => deleteCase(c.id)}
                            className="p-1.5 text-danger hover:bg-danger-bg rounded"
                            title="Delete Case"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-1 mt-2">
                        {c.prescription.diagnosis.slice(0,3).map((d, i) => (
                          <span key={i} className="px-2 py-0.5 bg-gray-100 text-xs text-text-secondary rounded-full">{d}</span>
                        ))}
                        {c.prescription.diagnosis.length > 3 && <span className="px-2 py-0.5 bg-gray-100 text-xs text-text-secondary rounded-full">+{c.prescription.diagnosis.length - 3}</span>}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};
