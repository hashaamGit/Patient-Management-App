import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { FileText, ChevronDown, ChevronUp, Save, RotateCcw, Clipboard, Stethoscope, Target, ClipboardList, Sparkles, CheckCircle2 } from 'lucide-react';

export const SOAPNotes = () => {
  const { soapNote, updateSOAPSection, resetSOAPNote, patient, prescription } = useAppStore();
  
  const [expanded, setExpanded] = useState({
    S: true,
    O: true,
    A: true,
    P: true
  });

  const [newDiag, setNewDiag] = useState('');
  const [newDiff, setNewDiff] = useState('');

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
            <button className="flex items-center gap-2 px-4 py-1.5 bg-primary text-white hover:bg-primary/90 rounded-md text-sm font-medium transition-colors">
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
          <button 
            onClick={() => toggleSection('P')}
            className="w-full flex items-center justify-between p-4 bg-gray-50/50 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-teal-600" />
              <h3 className="font-bold text-gray-900">Plan</h3>
            </div>
            {expanded.P ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
          </button>
          
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
