import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import {
  FileText, ChevronDown, ChevronUp, Save, RotateCcw, Clipboard, Stethoscope,
  Target, ClipboardList, Sparkles, CheckCircle2, Heart, Scissors, Users,
  Briefcase, Plus, X, Clock, Copy, Check, Activity
} from 'lucide-react';
import { generateContextualTreatmentRecommendations } from '../utils/clinicalContextReasoning';

export const SOAPNotes = () => {
  const {
    soapNote, updateSOAPSection, resetSOAPNote, patient, prescription, saveCurrentCase,
    patientHistory, updatePatientHistory, clinicalNotes, updateClinicalNotes,
    inventory, addPrescriptionItem, addLab, setAdvice
  } = useAppStore();
  
  const [expanded, setExpanded] = useState({
    S: true,
    history: true,
    O: true,
    A: true,
    P: true
  });

  const [newDiag, setNewDiag] = useState('');
  const [newDiff, setNewDiff] = useState('');
  const [copiedNotes, setCopiedNotes] = useState(false);

  // History edit state
  const [newPmH, setNewPmH] = useState('');
  const [surgProc, setSurgProc] = useState('');
  const [surgDate, setSurgDate] = useState('');
  const [famRel, setFamRel] = useState('Father');
  const [famCond, setFamCond] = useState('');

  const pmhQuickAdds = ['HTN', 'DM Type 2', 'IHD', 'CKD Stage 3', 'COPD', 'Asthma', 'Hypothyroidism', 'Hyperlipidemia', 'Hepatitis B', 'Hepatitis C', 'Epilepsy'];
  const surgQuickAdds = ['Appendectomy', 'Cholecystectomy', 'C-Section', 'Hernia Repair', 'CABG'];
  const famRelations = ['Father', 'Mother', 'Sibling', 'Grandparent', 'Other'];

  const toggleSection = (section: keyof typeof expanded) => {
    setExpanded(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const systems = ['General', 'HEENT', 'Respiratory', 'Cardiovascular', 'GI', 'GU', 'MSK', 'Neuro', 'Psych', 'Skin', 'Endocrine', 'Heme/Lymph', 'Allergic/Immunologic'];
  
  const templates = [
    { id: 'fever', label: 'Fever Workup' },
    { id: 'htn', label: 'Hypertension F/U' },
    { id: 'dm', label: 'DM Check' },
    { id: 'uri', label: 'URI' },
    { id: 'gastritis', label: 'Gastritis' },
    { id: 'chest_pain', label: 'Chest Pain Evaluation' }
  ];

  const handleCopyNotes = () => {
    navigator.clipboard.writeText(clinicalNotes || '');
    setCopiedNotes(true);
    setTimeout(() => setCopiedNotes(false), 2000);
  };

  const handleInsertTimestamp = () => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const updated = clinicalNotes ? `${clinicalNotes}\n[${timeStr}]: ` : `[${timeStr}]: `;
    updateClinicalNotes(updated);
  };

  const handleInsertVitals = () => {
    const vStr = `\n[Vitals]: BP ${patient.bp || '--'} | PR ${patient.pulse || '--'} bpm | Temp ${patient.temperature || '--'}°C | SpO2 ${patient.spo2 || '--'}% | RR ${patient.respiratoryRate || '--'}/min`;
    updateClinicalNotes(clinicalNotes ? `${clinicalNotes}${vStr}` : vStr.trim());
  };

  const handleAutoFillRx = () => {
    const meds = prescription.items.map(i => `${i.genericName} ${i.strength} ${i.form} ${i.dosage} ${i.frequency} x ${i.duration}`).join('\n');
    const labs = prescription.labs.join(', ');
    
    updateSOAPSection('plan', {
      ...soapNote.plan,
      medications: soapNote.plan.medications ? `${soapNote.plan.medications}\n${meds}` : meds,
      labsOrdered: soapNote.plan.labsOrdered ? `${soapNote.plan.labsOrdered}\n${labs}` : labs,
      patientEducation: soapNote.plan.patientEducation ? `${soapNote.plan.patientEducation}\n${prescription.advice}` : prescription.advice
    });

    if (prescription.diagnosis.length > 0) {
      updateSOAPSection('assessment', {
        ...soapNote.assessment,
        diagnoses: Array.from(new Set([...soapNote.assessment.diagnoses, ...prescription.diagnosis]))
      });
    }
  };

  const handleSuggestTreatment = () => {
    const plan = generateContextualTreatmentRecommendations({
      patient,
      patientHistory,
      soapNote,
      inventory,
      clinicalNotes
    });

    const medsStr = plan.suggestedMedications.map(m => 
      `${m.brandName ? `${m.brandName} (${m.genericName})` : m.genericName} ${m.strength} - ${m.dosage} ${m.frequency} x ${m.duration}\n  [Rationale: ${m.clinicalRationale}]`
    ).join('\n\n');

    const labsStr = plan.suggestedLabs.map(l => `• ${l.name} (${l.reason})`).join('\n');
    
    const supportiveStr = [
      ...plan.supportiveTreatments.map(s => `• ${s.title}: ${s.detail}`),
      plan.clinicalAdviceSummary
    ].join('\n\n');

    updateSOAPSection('plan', {
      ...soapNote.plan,
      medications: soapNote.plan.medications ? `${soapNote.plan.medications}\n\n${medsStr}` : medsStr,
      labsOrdered: soapNote.plan.labsOrdered ? `${soapNote.plan.labsOrdered}\n\n${labsStr}` : labsStr,
      patientEducation: soapNote.plan.patientEducation ? `${soapNote.plan.patientEducation}\n\n${supportiveStr}` : supportiveStr,
    });

    // Also sync to prescription pad
    plan.suggestedMedications.forEach(m => {
      addPrescriptionItem({
        genericName: m.genericName,
        brandName: m.brandName,
        strength: m.strength,
        form: m.form,
        route: m.route,
        dosage: m.dosage,
        frequency: m.frequency,
        duration: m.duration,
        instructions: m.instructions || m.clinicalRationale
      });
    });

    plan.suggestedLabs.forEach(l => addLab(l.name));
    if (plan.clinicalAdviceSummary) setAdvice(plan.clinicalAdviceSummary);

    alert(`✓ Contextual plan synthesized!\n• ${plan.suggestedMedications.length} tailored medications added\n• Labs and patient advice populated based on vitals & history.`);
  };

  const applyTemplate = (templateId: string) => {
    if (templateId === 'fever') {
      updateSOAPSection('subjective', { ...soapNote.subjective, chiefComplaint: 'Fever x 3 days', hpiNarrative: 'Patient presents with high grade fever, associated with chills and rigors. No localizing symptoms.' });
    } else if (templateId === 'htn') {
       updateSOAPSection('subjective', { ...soapNote.subjective, chiefComplaint: 'Hypertension Follow up', hpiNarrative: 'Patient presents for routine BP check. Compliant with medications. Denies headache or visual changes.' });
    } else if (templateId === 'uri') {
       updateSOAPSection('subjective', { ...soapNote.subjective, chiefComplaint: 'Sore throat and cough', hpiNarrative: 'Patient presents with sore throat, rhinorrhea, and dry cough for the last 2 days. No high grade fever.' });
    } else if (templateId === 'gastritis') {
       updateSOAPSection('subjective', { ...soapNote.subjective, chiefComplaint: 'Epigastric pain', hpiNarrative: 'Patient complains of burning epigastric pain, worse after meals. Associated with occasional nausea.' });
    }
  };

  const handleSystemToggle = (system: string) => {
    const current = { ...soapNote.subjective.reviewOfSystems };
    current[system] = !current[system];
    updateSOAPSection('subjective', { ...soapNote.subjective, reviewOfSystems: current });
  };

  const handlePhysicalExamChange = (system: string, value: string) => {
    const current = { ...soapNote.objective.physicalExam };
    current[system] = value;
    updateSOAPSection('objective', { ...soapNote.objective, physicalExam: current });
  };

  return (
    <div className="h-full overflow-y-auto p-6 bg-canvas">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-text-primary">SOAP Note Composer</h2>
              <p className="text-sm text-text-secondary">{patient.name ? `Patient: ${patient.name}` : 'No patient selected'}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={handleAutoFillRx}
              className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-md text-sm font-medium transition-colors border border-blue-200"
            >
              <Sparkles className="w-4 h-4" />
              Auto-fill from Rx
            </button>
            <button 
              onClick={resetSOAPNote}
              className="flex items-center gap-2 px-3 py-1.5 text-text-secondary hover:bg-gray-100 rounded-md text-sm font-medium transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
            <button 
              onClick={() => {
                saveCurrentCase();
                alert('SOAP Note saved successfully!');
              }}
              className="flex items-center gap-2 px-4 py-1.5 bg-primary text-white hover:bg-primary/90 rounded-md text-sm font-medium transition-colors"
            >
              <Save className="w-4 h-4" />
              Save Note
            </button>
          </div>
        </div>

        {/* Templates */}
        <div className="card p-4">
          <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">Smart Templates</h3>
          <div className="flex flex-wrap gap-2">
            {templates.map(t => (
              <button
                key={t.id}
                onClick={() => applyTemplate(t.id)}
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-text-secondary text-sm rounded-full transition-colors"
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Clinical Notes & Provider Scratchpad */}
        <div className="card p-4 bg-gradient-to-r from-slate-50 to-indigo-50/30 border border-border rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary" />
              <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider">
                Clinical Notes & Physician Scratchpad
              </h3>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                <Check className="w-2.5 h-2.5" /> Persistent Autosave
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs">
              <button
                onClick={handleInsertTimestamp}
                className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-border rounded-md text-text-secondary font-medium flex items-center gap-1 transition-colors"
                title="Insert current timestamp"
              >
                <Clock className="w-3 h-3 text-slate-500" />
                <span>+ Time</span>
              </button>
              <button
                onClick={handleInsertVitals}
                className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-border rounded-md text-text-secondary font-medium flex items-center gap-1 transition-colors"
                title="Insert active patient vitals"
              >
                <Activity className="w-3 h-3 text-emerald-600" />
                <span>+ Vitals</span>
              </button>
              <button
                onClick={handleCopyNotes}
                className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-border rounded-md text-text-secondary font-medium flex items-center gap-1 transition-colors"
                title="Copy all notes to clipboard"
              >
                {copiedNotes ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-slate-500" />}
                <span>{copiedNotes ? 'Copied' : 'Copy'}</span>
              </button>
              <button
                onClick={() => updateClinicalNotes('')}
                className="px-2 py-1 text-slate-400 hover:text-red-600 rounded transition-colors text-[11px]"
                title="Clear scratchpad"
              >
                Clear
              </button>
            </div>
          </div>
          <textarea
            value={clinicalNotes}
            onChange={(e) => updateClinicalNotes(e.target.value)}
            placeholder="Type quick clinical thoughts, provider impression notes, differential scratchpad, or tele-consult logs here..."
            className="w-full h-24 p-2.5 text-sm bg-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/40 text-text-primary resize-y font-mono text-xs leading-relaxed"
          />
        </div>

        {/* S: Subjective */}
        <div className="card overflow-hidden border-l-4 border-l-blue-500">
          <button 
            onClick={() => toggleSection('S')}
            className="w-full flex items-center justify-between p-4 bg-gray-50/50 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Clipboard className="w-5 h-5 text-blue-600" />
              <h3 className="font-bold text-gray-900">Subjective</h3>
            </div>
            {expanded.S ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
          </button>
          
          {expanded.S && (
            <div className="p-4 space-y-4 border-t border-border">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Chief Complaint</label>
                <input 
                  type="text" 
                  value={soapNote.subjective.chiefComplaint}
                  onChange={e => updateSOAPSection('subjective', { ...soapNote.subjective, chiefComplaint: e.target.value })}
                  className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="e.g. Chest pain for 2 hours"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">History of Present Illness</label>
                <textarea 
                  value={soapNote.subjective.hpiNarrative}
                  onChange={e => updateSOAPSection('subjective', { ...soapNote.subjective, hpiNarrative: e.target.value })}
                  className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[100px]"
                  placeholder="Narrative..."
                />
              </div>

              {/* Embedded Patient History Section under Subjective */}
              <div className="bg-slate-50/80 border border-slate-200 rounded-xl p-4 space-y-4">
                <div 
                  className="flex items-center justify-between cursor-pointer select-none"
                  onClick={() => toggleSection('history')}
                >
                  <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-rose-500" />
                    <h4 className="text-sm font-bold text-slate-900">
                      Patient History (Past Medical, Surgical, Family & Social)
                    </h4>
                    <span className="text-xs bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full font-medium">
                      Integrated Flow
                    </span>
                  </div>
                  {expanded.history ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </div>

                {expanded.history && (
                  <div className="space-y-4 pt-2 border-t border-slate-200">
                    {/* Past Medical History */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                          <Heart className="w-3.5 h-3.5 text-rose-500" /> Past Medical History
                        </label>
                        <span className="text-[11px] text-slate-500">Quick tap to add</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {pmhQuickAdds.map(q => {
                          const hasIt = patientHistory.pastMedical.includes(q);
                          return (
                            <button
                              key={q}
                              type="button"
                              onClick={() => {
                                if (hasIt) {
                                  updatePatientHistory({ pastMedical: patientHistory.pastMedical.filter(m => m !== q) });
                                } else {
                                  updatePatientHistory({ pastMedical: [...patientHistory.pastMedical, q] });
                                }
                              }}
                              className={`px-2 py-0.5 rounded-full text-xs font-medium transition-colors ${
                                hasIt ? 'bg-rose-100 text-rose-800 border border-rose-300 font-bold' : 'bg-white hover:bg-slate-200 text-slate-700 border border-slate-200'
                              }`}
                            >
                              {hasIt ? `✓ ${q}` : `+ ${q}`}
                            </button>
                          );
                        })}
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newPmH}
                          onChange={e => setNewPmH(e.target.value)}
                          onKeyDown={e => {
                            if (e.key === 'Enter' && newPmH.trim()) {
                              updatePatientHistory({ pastMedical: [...patientHistory.pastMedical, newPmH.trim()] });
                              setNewPmH('');
                            }
                          }}
                          placeholder="Add custom medical condition..."
                          className="flex-1 p-2 text-xs border border-slate-200 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (newPmH.trim()) {
                              updatePatientHistory({ pastMedical: [...patientHistory.pastMedical, newPmH.trim()] });
                              setNewPmH('');
                            }
                          }}
                          className="px-3 bg-slate-800 text-white rounded-md text-xs font-semibold hover:bg-slate-700"
                        >
                          Add
                        </button>
                      </div>
                    </div>

                    {/* Surgical & Family History Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Past Surgical History */}
                      <div className="bg-white border border-slate-200 rounded-lg p-3">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                          <Scissors className="w-3.5 h-3.5 text-indigo-600" /> Past Surgical History
                        </label>
                        <div className="flex flex-wrap gap-1 mb-2">
                          {surgQuickAdds.map(s => (
                            <button
                              key={s}
                              type="button"
                              onClick={() => updatePatientHistory({ pastSurgical: [...patientHistory.pastSurgical, { procedure: s, date: 'Prior' }] })}
                              className="px-2 py-0.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded text-[11px]"
                            >
                              + {s}
                            </button>
                          ))}
                        </div>
                        <div className="flex gap-1.5 mb-2">
                          <input
                            type="text"
                            placeholder="Procedure..."
                            value={surgProc}
                            onChange={e => setSurgProc(e.target.value)}
                            className="flex-1 p-1.5 text-xs border border-slate-200 rounded bg-slate-50"
                          />
                          <input
                            type="text"
                            placeholder="Year..."
                            value={surgDate}
                            onChange={e => setSurgDate(e.target.value)}
                            className="w-16 p-1.5 text-xs border border-slate-200 rounded bg-slate-50"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              if (surgProc) {
                                updatePatientHistory({ pastSurgical: [...patientHistory.pastSurgical, { procedure: surgProc, date: surgDate || 'Prior' }] });
                                setSurgProc('');
                                setSurgDate('');
                              }
                            }}
                            className="px-2 bg-indigo-600 text-white rounded text-xs font-bold"
                          >
                            +
                          </button>
                        </div>
                        <div className="space-y-1 max-h-24 overflow-y-auto">
                          {patientHistory.pastSurgical.map((s, idx) => (
                            <div key={idx} className="flex items-center justify-between text-xs bg-slate-50 px-2 py-1 rounded">
                              <span className="font-medium text-slate-800">{s.procedure} <span className="text-slate-500 font-normal">({s.date})</span></span>
                              <button onClick={() => updatePatientHistory({ pastSurgical: patientHistory.pastSurgical.filter((_, i) => i !== idx) })} className="text-slate-400 hover:text-red-600">×</button>
                            </div>
                          ))}
                          {patientHistory.pastSurgical.length === 0 && (
                            <span className="text-[11px] text-slate-400 italic">No past surgeries recorded.</span>
                          )}
                        </div>
                      </div>

                      {/* Family History */}
                      <div className="bg-white border border-slate-200 rounded-lg p-3">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5 text-teal-600" /> Family Medical History
                        </label>
                        <div className="flex gap-1.5 mb-2">
                          <select
                            value={famRel}
                            onChange={e => setFamRel(e.target.value)}
                            className="text-xs border border-slate-200 rounded bg-slate-50 px-2 py-1"
                          >
                            {famRelations.map(r => <option key={r} value={r}>{r}</option>)}
                          </select>
                          <input
                            type="text"
                            placeholder="Condition (e.g. DM, CAD)..."
                            value={famCond}
                            onChange={e => setFamCond(e.target.value)}
                            className="flex-1 p-1.5 text-xs border border-slate-200 rounded bg-slate-50"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              if (famCond) {
                                updatePatientHistory({ familyHistory: [...patientHistory.familyHistory, { relation: famRel, condition: famCond }] });
                                setFamCond('');
                              }
                            }}
                            className="px-2 bg-teal-600 text-white rounded text-xs font-bold"
                          >
                            +
                          </button>
                        </div>
                        <div className="space-y-1 max-h-24 overflow-y-auto">
                          {patientHistory.familyHistory.map((f, idx) => (
                            <div key={idx} className="flex items-center justify-between text-xs bg-slate-50 px-2 py-1 rounded">
                              <span className="font-medium text-slate-800">{f.relation}: <span className="text-teal-700 font-semibold">{f.condition}</span></span>
                              <button onClick={() => updatePatientHistory({ familyHistory: patientHistory.familyHistory.filter((_, i) => i !== idx) })} className="text-slate-400 hover:text-red-600">×</button>
                            </div>
                          ))}
                          {patientHistory.familyHistory.length === 0 && (
                            <span className="text-[11px] text-slate-400 italic">No family history recorded.</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Social History */}
                    <div className="bg-white border border-slate-200 rounded-lg p-3">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <Briefcase className="w-3.5 h-3.5 text-amber-600" /> Social & Habits
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        <div>
                          <label className="text-[10px] font-medium text-slate-500">Smoking</label>
                          <select
                            value={patientHistory.socialHistory.smoking}
                            onChange={e => updatePatientHistory({ socialHistory: { ...patientHistory.socialHistory, smoking: e.target.value } })}
                            className="w-full text-xs p-1.5 border border-slate-200 rounded bg-slate-50"
                          >
                            <option value="Non-smoker">Non-smoker</option>
                            <option value="Current smoker">Current smoker</option>
                            <option value="Former smoker">Former smoker</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-[10px] font-medium text-slate-500">Alcohol</label>
                          <select
                            value={patientHistory.socialHistory.alcohol}
                            onChange={e => updatePatientHistory({ socialHistory: { ...patientHistory.socialHistory, alcohol: e.target.value } })}
                            className="w-full text-xs p-1.5 border border-slate-200 rounded bg-slate-50"
                          >
                            <option value="Never">Never</option>
                            <option value="Occasional">Occasional</option>
                            <option value="Moderate">Moderate</option>
                            <option value="Heavy">Heavy</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-[10px] font-medium text-slate-500">Occupation</label>
                          <input
                            type="text"
                            value={patientHistory.socialHistory.occupation}
                            onChange={e => updatePatientHistory({ socialHistory: { ...patientHistory.socialHistory, occupation: e.target.value } })}
                            placeholder="e.g. Office Worker"
                            className="w-full text-xs p-1.5 border border-slate-200 rounded bg-slate-50"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-medium text-slate-500">Exercise</label>
                          <select
                            value={patientHistory.socialHistory.exercise}
                            onChange={e => updatePatientHistory({ socialHistory: { ...patientHistory.socialHistory, exercise: e.target.value } })}
                            className="w-full text-xs p-1.5 border border-slate-200 rounded bg-slate-50"
                          >
                            <option value="Sedentary">Sedentary</option>
                            <option value="Light">Light</option>
                            <option value="Moderate">Moderate</option>
                            <option value="Active">Active</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">Review of Systems</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {systems.map(sys => (
                    <label key={sys} className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={!!soapNote.subjective.reviewOfSystems[sys]}
                        onChange={() => handleSystemToggle(sys)}
                        className="rounded text-primary focus:ring-primary"
                      />
                      <span className="text-sm text-text-secondary">{sys}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* O: Objective */}
        <div className="card overflow-hidden border-l-4 border-l-green-500">
          <button 
            onClick={() => toggleSection('O')}
            className="w-full flex items-center justify-between p-4 bg-gray-50/50 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-green-600" />
              <h3 className="font-bold text-gray-900">Objective</h3>
            </div>
            {expanded.O ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
          </button>
          
          {expanded.O && (
            <div className="p-4 space-y-4 border-t border-border">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">General Appearance</label>
                <textarea 
                  value={soapNote.objective.generalAppearance}
                  onChange={e => updateSOAPSection('objective', { ...soapNote.objective, generalAppearance: e.target.value })}
                  className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[60px]"
                  placeholder="e.g. Well looking, in no acute distress"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Vitals Summary (from Patient Context)</label>
                <div className="p-3 bg-gray-50 rounded-md text-sm text-text-secondary">
                  BP: {patient.bp || '--'} | PR: {patient.pulse || '--'} | Temp: {patient.temperature || '--'} | SpO2: {patient.spo2 || '--'} | RR: {patient.respiratoryRate || '--'}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">Physical Exam</label>
                <div className="space-y-3">
                  {['Head/Neck', 'Chest/Lungs', 'Heart', 'Abdomen', 'Extremities', 'Neuro', 'Skin'].map(sys => (
                    <div key={sys}>
                      <input 
                        type="text"
                        placeholder={`${sys} Exam...`}
                        value={soapNote.objective.physicalExam[sys] || ''}
                        onChange={e => handlePhysicalExamChange(sys, e.target.value)}
                        className="w-full p-2 text-sm border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* A: Assessment */}
        <div className="card overflow-hidden border-l-4 border-l-amber-500">
          <button 
            onClick={() => toggleSection('A')}
            className="w-full flex items-center justify-between p-4 bg-gray-50/50 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-amber-600" />
              <h3 className="font-bold text-gray-900">Assessment</h3>
            </div>
            {expanded.A ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
          </button>
          
          {expanded.A && (
            <div className="p-4 space-y-4 border-t border-border grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Diagnoses</label>
                <div className="flex gap-2 mb-2">
                  <input 
                    type="text" 
                    value={newDiag}
                    onChange={e => setNewDiag(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter' && newDiag) {
                        updateSOAPSection('assessment', { ...soapNote.assessment, diagnoses: [...soapNote.assessment.diagnoses, newDiag] });
                        setNewDiag('');
                      }
                    }}
                    className="flex-1 p-2 text-sm border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="Add diagnosis..."
                  />
                  <button 
                    onClick={() => {
                      if(newDiag) {
                        updateSOAPSection('assessment', { ...soapNote.assessment, diagnoses: [...soapNote.assessment.diagnoses, newDiag] });
                        setNewDiag('');
                      }
                    }}
                    className="px-3 bg-gray-100 hover:bg-gray-200 rounded-md text-sm font-medium"
                  >
                    Add
                  </button>
                </div>
                <div className="space-y-1">
                  {soapNote.assessment.diagnoses.map((d, i) => (
                    <div key={i} className="flex justify-between items-center bg-amber-50 px-2 py-1 rounded text-sm text-amber-900">
                      <span>{d}</span>
                      <button 
                        onClick={() => updateSOAPSection('assessment', { ...soapNote.assessment, diagnoses: soapNote.assessment.diagnoses.filter((_, idx) => idx !== i) })}
                        className="text-amber-700 hover:text-amber-900"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Differential Diagnoses</label>
                <div className="flex gap-2 mb-2">
                  <input 
                    type="text" 
                    value={newDiff}
                    onChange={e => setNewDiff(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter' && newDiff) {
                        updateSOAPSection('assessment', { ...soapNote.assessment, differentials: [...soapNote.assessment.differentials, newDiff] });
                        setNewDiff('');
                      }
                    }}
                    className="flex-1 p-2 text-sm border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="Add differential..."
                  />
                  <button 
                    onClick={() => {
                      if(newDiff) {
                        updateSOAPSection('assessment', { ...soapNote.assessment, differentials: [...soapNote.assessment.differentials, newDiff] });
                        setNewDiff('');
                      }
                    }}
                    className="px-3 bg-gray-100 hover:bg-gray-200 rounded-md text-sm font-medium"
                  >
                    Add
                  </button>
                </div>
                <div className="space-y-1">
                  {soapNote.assessment.differentials.map((d, i) => (
                    <div key={i} className="flex justify-between items-center bg-gray-50 px-2 py-1 rounded text-sm text-text-secondary">
                      <span>{d}</span>
                      <button 
                        onClick={() => updateSOAPSection('assessment', { ...soapNote.assessment, differentials: soapNote.assessment.differentials.filter((_, idx) => idx !== i) })}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* P: Plan */}
        <div className="card overflow-hidden border-l-4 border-l-teal-500">
          <div className="w-full flex items-center justify-between p-4 bg-gray-50/50 hover:bg-gray-50 transition-colors">
            <button 
              type="button"
              onClick={() => toggleSection('P')}
              className="flex items-center gap-2 flex-1 text-left"
            >
              <ClipboardList className="w-5 h-5 text-teal-600" />
              <h3 className="font-bold text-gray-900">Plan</h3>
            </button>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSuggestTreatment}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-md text-xs font-bold transition-all shadow-xs"
                title="Synthesize and populate plan from patient's vitals, history, and SOAP assessment"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Suggest Plan from Vitals &amp; History</span>
              </button>
              <button
                type="button"
                onClick={() => toggleSection('P')}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                {expanded.P ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
            </div>
          </div>
          
          {expanded.P && (
            <div className="p-4 space-y-4 border-t border-border">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">Medications Ordered</label>
                  <textarea 
                    value={soapNote.plan.medications}
                    onChange={e => updateSOAPSection('plan', { ...soapNote.plan, medications: e.target.value })}
                    className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[80px] text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">Labs / Investigations</label>
                  <textarea 
                    value={soapNote.plan.labsOrdered}
                    onChange={e => updateSOAPSection('plan', { ...soapNote.plan, labsOrdered: e.target.value })}
                    className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[80px] text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">Imaging / Referrals</label>
                  <textarea 
                    value={soapNote.plan.referrals}
                    onChange={e => updateSOAPSection('plan', { ...soapNote.plan, referrals: e.target.value })}
                    className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[60px] text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">Patient Education & Advice</label>
                  <textarea 
                    value={soapNote.plan.patientEducation}
                    onChange={e => updateSOAPSection('plan', { ...soapNote.plan, patientEducation: e.target.value })}
                    className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[60px] text-sm"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-text-secondary mb-1">Follow-up</label>
                  <input 
                    type="text" 
                    value={soapNote.plan.followUp}
                    onChange={e => updateSOAPSection('plan', { ...soapNote.plan, followUp: e.target.value })}
                    className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                    placeholder="e.g. 1 week in OPD"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
