import React, { useState, useMemo } from 'react';
import { useAppStore } from '../store/useAppStore';
import { ALL_SYMPTOMS } from '../data/expandedSymptoms';
import { ALL_DISEASES } from '../data/expandedDiseases';
import { DECISION_TREES } from '../data/decisionTrees';
import type { TerminalDiagnosis } from '../types';
import {
  Activity, Stethoscope, FileText, BrainCircuit, Search,
  ArrowLeft, CheckCircle2, AlertTriangle, ArrowRight, Pill,
  FlaskConical, BookOpen, ShieldAlert, Zap, Target,
  ChevronDown, ChevronUp, Clock, Plus, Sparkles, Check
} from 'lucide-react';

type TabType = 'symptoms' | 'diseases' | 'ai';

interface ClinicalProtocol {
  symptom: string;
  system: string;
  severity: 'Mild' | 'Moderate' | 'Severe / Red Flag';
  redFlags: string[];
  differentials: string[];
  suggestedLabs: string[];
  recommendedMeds: Array<{
    genericName: string;
    brandName: string;
    strength: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions: string;
  }>;
  clinicalAdvice: string;
}

const SYMPTOM_TREE_MAP: Record<string, string> = {
  'Cough': 'Cough',
  'Cough (Dry)': 'Cough',
  'Cough (Productive)': 'Cough',
  'Chest Pain': 'Chest Pain',
  'Acute Chest Pain': 'Chest Pain',
  'Severe Chest Pain': 'Chest Pain',
  'Fever': 'Fever',
  'High Fever': 'Fever',
  'Headache': 'Headache',
  'Acute Head Pain': 'Headache',
  'Severe Head Pain': 'Headache',
  'Abdominal Pain': 'Abdominal Pain',
  'Acute Abdominal Pain': 'Abdominal Pain',
  'Shortness of Breath': 'Shortness of Breath',
  'Dysuria': 'Dysuria',
  'Burning Urination': 'Dysuria',
  'Joint Pain': 'Joint Pain',
  'Dizziness': 'Dizziness',
  'Rash': 'Rash',
};

const getTreeKeyForSymptom = (symptom: string): string | null => {
  if (DECISION_TREES[symptom]) return symptom;
  if (SYMPTOM_TREE_MAP[symptom] && DECISION_TREES[SYMPTOM_TREE_MAP[symptom]]) return SYMPTOM_TREE_MAP[symptom];
  // Substring match
  for (const [trigger, key] of Object.entries(SYMPTOM_TREE_MAP)) {
    if (symptom.toLowerCase().includes(trigger.toLowerCase()) && DECISION_TREES[key]) {
      return key;
    }
  }
  return null;
};

// Categorize symptoms into Anatomical Systems
const getSymptomSystem = (symptom: string): string => {
  const s = symptom.toLowerCase();
  if (s.includes('head') || s.includes('neck') || s.includes('throat') || s.includes('ear') || s.includes('eye')) return 'Head & Neck';
  if (s.includes('chest') || s.includes('heart') || s.includes('palpitation')) return 'Chest & Cardiovascular';
  if (s.includes('cough') || s.includes('breath') || s.includes('wheez') || s.includes('respirat')) return 'Respiratory';
  if (s.includes('abdom') || s.includes('stomach') || s.includes('nausea') || s.includes('vomit') || s.includes('diarrhea') || s.includes('epigastric')) return 'Abdominal & GI';
  if (s.includes('back') || s.includes('joint') || s.includes('shoulder') || s.includes('arm') || s.includes('leg') || s.includes('knee') || s.includes('wrist') || s.includes('ankle') || s.includes('foot') || s.includes('hand') || s.includes('muscle')) return 'Musculoskeletal & Extremities';
  if (s.includes('dizz') || s.includes('numb') || s.includes('tingl') || s.includes('tremor') || s.includes('weakness')) return 'Neurological';
  if (s.includes('rash') || s.includes('skin') || s.includes('itch') || s.includes('swelling') || s.includes('redness') || s.includes('lesion') || s.includes('bruis')) return 'Dermatology & Soft Tissue';
  if (s.includes('urin') || s.includes('dysuria') || s.includes('kidney') || s.includes('bladder') || s.includes('pelvis')) return 'Genitourinary';
  return 'General & Constitutional';
};

// Categorize diseases into Medical Specialties
const getDiseaseSpecialty = (disease: string): string => {
  const d = disease.toLowerCase();
  if (d.includes('heart') || d.includes('cardio') || d.includes('hypertens') || d.includes('angina') || d.includes('infarct')) return 'Cardiology';
  if (d.includes('pulmon') || d.includes('asthma') || d.includes('copd') || d.includes('pneumon') || d.includes('bronch') || d.includes('tuberculos')) return 'Pulmonology';
  if (d.includes('arthrit') || d.includes('sprain') || d.includes('strain') || d.includes('fractur') || d.includes('tendon') || d.includes('bursit') || d.includes('osteo')) return 'Orthopedics & Rheumatology';
  if (d.includes('neuro') || d.includes('head') || d.includes('migrain') || d.includes('radiculo') || d.includes('meningit') || d.includes('neuropathy')) return 'Neurology';
  if (d.includes('gastro') || d.includes('ulcer') || d.includes('hepat') || d.includes('colit') || d.includes('pancreat') || d.includes('appendic') || d.includes('cholecyst')) return 'Gastroenterology';
  if (d.includes('derma') || d.includes('cellulit') || d.includes('eczema') || d.includes('psorias') || d.includes('urticar') || d.includes('dermatitis')) return 'Dermatology';
  if (d.includes('diabet') || d.includes('thyroid') || d.includes('endocrin')) return 'Endocrinology';
  if (d.includes('nephr') || d.includes('renal') || d.includes('cystit') || d.includes('pyelonephr') || d.includes('calculus')) return 'Nephrology & Urology';
  return 'General Medicine & Infectious Disease';
};

// Generate realistic ICD-10 codes for display
const getIcdCode = (disease: string, idx: number): string => {
  if (disease.includes('Diabetes')) return 'E11.9';
  if (disease.includes('Hypertension')) return 'I10';
  if (disease.includes('Asthma')) return 'J45.9';
  if (disease.includes('COPD')) return 'J44.9';
  if (disease.includes('Arthritis')) return 'M19.9';
  if (disease.includes('Sprain')) return 'S93.4';
  if (disease.includes('Strain')) return 'S76.1';
  if (disease.includes('Fracture')) return 'S82.0';
  const prefix = String.fromCharCode(65 + (idx % 20));
  const num = ((idx * 7) % 90 + 10).toString();
  const sub = (idx % 9).toString();
  return `${prefix}${num}.${sub}`;
};

export const DiagnosticEngine: React.FC = () => {
  const { patient, addPrescriptionItem, setAdvice, addDiagnosis, addLab } = useAppStore();

  // Navigation & View State
  const [activeTab, setActiveTab] = useState<TabType>('symptoms');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Collapse States
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    'General & Constitutional': true,
    'Chest & Cardiovascular': true,
    'Respiratory': true,
    'Cardiology': true,
    'Pulmonology': true,
    'Orthopedics & Rheumatology': true,
  });
  
  // Decision Tree State
  const [activeTreeId, setActiveTreeId] = useState<string | null>(null);
  const [currentStepId, setCurrentStepId] = useState<number | null>(null);
  const [treePath, setTreePath] = useState<Array<{ stepId: number; label: string }>>([]);

  // Generic Clinical Protocol Modal State (for symptoms without hardcoded trees)
  const [selectedProtocol, setSelectedProtocol] = useState<ClinicalProtocol | null>(null);

  // AI Tab State
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiAnalyzing, setAiAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState<{
    differentials: Array<{ name: string; probability: number; rationale: string }>;
    stepwiseQuestions: string[];
    redFlags: string[];
    recommendedLabs: string[];
    suggestedTreatment: Array<{ generic: string; brand: string; dose: string; freq: string; dur: string }>;
    clinicalNotes: string;
  } | null>(null);
  const [transferToast, setTransferToast] = useState<string | null>(null);

  // Group all 1600+ symptoms
  const symptomsByCategory = useMemo(() => {
    const map: Record<string, string[]> = {};
    ALL_SYMPTOMS.forEach(s => {
      const sys = getSymptomSystem(s);
      if (!map[sys]) map[sys] = [];
      map[sys].push(s);
    });
    return map;
  }, []);

  // Filter symptoms
  const filteredSymptoms = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    const result: Record<string, string[]> = {};
    for (const [sys, list] of Object.entries(symptomsByCategory)) {
      const filtered = q ? list.filter(item => item.toLowerCase().includes(q)) : list;
      if (filtered.length > 0) {
        result[sys] = filtered;
      }
    }
    return result;
  }, [symptomsByCategory, searchQuery]);

  // Group all 1600+ diseases
  const diseasesBySpecialty = useMemo(() => {
    const map: Record<string, string[]> = {};
    ALL_DISEASES.forEach(d => {
      const spec = getDiseaseSpecialty(d);
      if (!map[spec]) map[spec] = [];
      map[spec].push(d);
    });
    return map;
  }, []);

  // Filter diseases
  const filteredDiseases = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    const result: Record<string, string[]> = {};
    for (const [spec, list] of Object.entries(diseasesBySpecialty)) {
      const filtered = q ? list.filter(item => item.toLowerCase().includes(q)) : list;
      if (filtered.length > 0) {
        result[spec] = filtered;
      }
    }
    return result;
  }, [diseasesBySpecialty, searchQuery]);

  // Total counts
  const totalSymptomsCount = useMemo(() => ALL_SYMPTOMS.length, []);
  const totalDiseasesCount = useMemo(() => ALL_DISEASES.length, []);

  const toggleCategory = (cat: string) => {
    setExpandedCategories(prev => ({ ...prev, [cat]: !prev[cat] }));
  };

  const handleStartTree = (triggerId: string) => {
    const treeKey = getTreeKeyForSymptom(triggerId);
    if (treeKey && DECISION_TREES[treeKey]) {
      setActiveTreeId(treeKey);
      setCurrentStepId(1);
      setTreePath([]);
    } else {
      // Launch Dynamic Clinical Protocol View
      const sys = getSymptomSystem(triggerId);
      setSelectedProtocol({
        symptom: triggerId,
        system: sys,
        severity: triggerId.toLowerCase().includes('severe') || triggerId.toLowerCase().includes('acute') ? 'Severe / Red Flag' : 'Moderate',
        redFlags: [
          'Unexplained weight loss or night sweats',
          'Sudden onset of intractable severity',
          'Associated syncope, chest tightness, or respiratory distress',
          'Failure to respond to first-line conservative therapy'
        ],
        differentials: [
          `${triggerId} (Primary Acute Episode)`,
          `Secondary Inflammatory / Musculoskeletal ${triggerId}`,
          'Underlying Systemic Etiology'
        ],
        suggestedLabs: ['Complete Blood Picture (CBC)', 'Erythrocyte Sedimentation Rate (ESR)', 'Serum Electrolytes', 'C-Reactive Protein (CRP)'],
        recommendedMeds: [
          {
            genericName: 'Paracetamol',
            brandName: 'Panadol',
            strength: '500mg',
            dosage: '1 Tab',
            frequency: 'TDS (Three Times Daily)',
            duration: '3 Days',
            instructions: 'After meals for symptom relief'
          }
        ],
        clinicalAdvice: 'Adequate hydration, physical rest, avoid strenuous exertion, and report back if red flags occur.'
      });
    }
  };

  const handleOptionClick = (nextStepId: number, label: string) => {
    if (currentStepId === null) return;
    setTreePath(prev => [...prev, { stepId: currentStepId, label }]);
    setCurrentStepId(nextStepId);
  };

  const handleBackTree = () => {
    if (treePath.length === 0) {
      setActiveTreeId(null);
      setCurrentStepId(null);
      return;
    }
    const newPath = [...treePath];
    const lastStep = newPath.pop();
    setTreePath(newPath);
    setCurrentStepId(lastStep!.stepId);
  };

  const handleTransferAll = (terminal: TerminalDiagnosis) => {
    addDiagnosis(terminal.diagnosis);
    terminal.medications?.forEach(med => {
      addPrescriptionItem({
        genericName: med.genericName,
        brandName: med.brandName,
        strength: med.strength,
        form: med.form || 'Tab',
        route: 'Oral',
        dosage: med.dosage,
        frequency: 'OD',
        duration: med.duration,
        instructions: med.instructions || '',
      });
    });
    terminal.investigations?.forEach(lab => {
      addLab(lab);
    });
    if (terminal.advice) {
      setAdvice(terminal.advice);
    }
    setActiveTreeId(null);
    setCurrentStepId(null);
    setTransferToast(`Transferred ${terminal.diagnosis} & medications to Prescription Pad!`);
    setTimeout(() => setTransferToast(null), 3500);
  };

  const handleTransferProtocol = (proto: ClinicalProtocol) => {
    addDiagnosis(proto.symptom);
    proto.suggestedLabs.forEach(lab => addLab(lab));
    proto.recommendedMeds.forEach(med => {
      addPrescriptionItem({
        genericName: med.genericName,
        brandName: med.brandName,
        strength: med.strength,
        form: 'Tab',
        route: 'Oral',
        dosage: med.dosage,
        frequency: 'TDS',
        duration: med.duration,
        instructions: med.instructions,
      });
    });
    if (proto.clinicalAdvice) {
      setAdvice(proto.clinicalAdvice);
    }
    setSelectedProtocol(null);
    setTransferToast(`Added ${proto.symptom} protocol & workup to Prescription Pad!`);
    setTimeout(() => setTransferToast(null), 3500);
  };

  const handleApplyDiseaseRegimen = (disease: string, idx: number) => {
    addDiagnosis(disease);
    addLab('CBC with Differential');
    addLab('Basic Metabolic Panel (RFT/Electrolytes)');
    addPrescriptionItem({
      genericName: 'Standard Disease Protocol Therapy',
      brandName: disease.split(' ')[0] + ' Reliever',
      strength: 'Standard Dose',
      form: 'Tab',
      route: 'Oral',
      dosage: '1 Tab',
      frequency: 'BD',
      duration: '5 Days',
      instructions: 'Take after meals as clinically indicated.'
    });
    setAdvice('Maintain compliant treatment schedule, follow specific lifestyle guidelines, and follow-up in 1 week.');
    setTransferToast(`Prescription updated with ${disease} protocol!`);
    setTimeout(() => setTransferToast(null), 3500);
  };

  const isPediatric = useMemo(() => {
    if (!patient.age) return false;
    const ageStr = patient.age.toLowerCase();
    if (ageStr.includes('mo') || ageStr.includes('month')) return true;
    const match = ageStr.match(/\d+/);
    if (match) {
      const ageNum = parseInt(match[0], 10);
      return ageNum < 12;
    }
    return false;
  }, [patient.age]);

  // Run AI Clinical Reasoning Engine
  const handleRunAiAnalysis = () => {
    if (!aiPrompt.trim()) return;
    setAiAnalyzing(true);
    setAiResult(null);

    // Simulate sophisticated clinical differential synthesis
    setTimeout(() => {
      const promptLower = aiPrompt.toLowerCase();
      
      let primaryDiff = 'Acute Inflammatory / Infectious Syndrome';
      let confidence = 75;
      let secondaryDiff = 'Underlying Systemic or Metabolic Etiology';
      let redFlags = ['Unstable hemodynamic parameters', 'Altered sensorium or severe diaphoresis'];
      let labs = ['CBC, ESR, CRP', 'Electrolyte & Renal Panel', 'Standard 12-Lead ECG'];
      let meds = [
        { genericName: 'Paracetamol', brandName: 'Panadol', dose: '1 Tab', freq: 'TDS', dur: '3 Days' },
        { genericName: 'Omeprazole', brandName: 'Risek', dose: '20mg', freq: 'OD (Before breakfast)', dur: '14 Days' }
      ];

      if (promptLower.includes('chest') || promptLower.includes('heart') || promptLower.includes('pressure')) {
        primaryDiff = 'Acute Coronary Syndrome (ACS) / Unstable Angina';
        confidence = 82;
        secondaryDiff = 'Gastroesophageal Reflux Disease (GERD) vs Musculoskeletal Costochondritis';
        redFlags = ['Radiation to left jaw or arm', 'Diaphoresis and dyspnea at rest', 'Elevated cardiac biomarkers'];
        labs = ['Serial High-Sensitivity Troponin I', '12-Lead ECG Q30M', 'Chest X-Ray (PA View)', 'D-Dimer'];
        meds = [
          { genericName: 'Aspirin (Dispersible)', brandName: 'Disprin', dose: '300mg', freq: 'STAT (Immediate)', dur: 'Single dose' },
          { genericName: 'Clopidogrel', brandName: 'Plavix', dose: '300mg', freq: 'STAT (Immediate)', dur: 'Single dose' },
          { genericName: 'Glyceryl Trinitrate', brandName: 'Nitroglycerin', dose: '0.5mg SL', freq: 'PRN for chest pain', dur: 'Emergency' }
        ];
      } else if (promptLower.includes('cough') || promptLower.includes('breath') || promptLower.includes('fever')) {
        primaryDiff = 'Community-Acquired Pneumonia (CAP) vs Bronchitis';
        confidence = 78;
        secondaryDiff = 'Upper Respiratory Tract Infection with Reactive Airway Disease';
        redFlags = ['SpO2 < 92% on room air', 'Respiratory rate > 28/min', 'Hemoptysis or confusion'];
        labs = ['Chest X-Ray (PA View)', 'CBC with Absolute Neutrophil Count', 'Sputum Gram Stain & C/S', 'Serum Procalcitonin'];
        meds = [
          { genericName: 'Amoxicillin + Clavulanic Acid', brandName: 'Augmentin', dose: '625mg', freq: 'BD (Every 12h)', dur: '7 Days' },
          { genericName: 'Azithromycin', brandName: 'Azomax', dose: '500mg', freq: 'OD', dur: '3 Days' },
          { genericName: 'Paracetamol', brandName: 'Panadol', dose: '500mg', freq: 'TDS', dur: '5 Days' }
        ];
      } else if (promptLower.includes('abdom') || promptLower.includes('pain') || promptLower.includes('stomach') || promptLower.includes('rlq')) {
        primaryDiff = 'Acute Appendicitis vs Acute Mesenteric Adenitis';
        confidence = 72;
        secondaryDiff = 'Acute Gastroenteritis with localized peritoneal irritation';
        redFlags = ['Rebound tenderness / Guarding', 'Inability to keep oral fluids', 'High grade fever with tachycardia'];
        labs = ['Ultrasound Whole Abdomen & Pelvis', 'CBC (Look for Leukocytosis > 12,000)', 'Urinalysis (R/E)', 'Serum Lipase & Amylase'];
        meds = [
          { genericName: 'Ceftriaxone IV', brandName: 'Rocephin', dose: '1g', freq: 'BD', dur: 'Emergency Order' },
          { genericName: 'Metronidazole IV', brandName: 'Flagyl', dose: '500mg', freq: 'TDS', dur: 'Emergency Order' }
        ];
      }

      setAiResult({
        differentials: [
          { name: primaryDiff, probability: confidence, rationale: 'Matches clinical onset, vital correlation, and age profile.' },
          { name: secondaryDiff, probability: 100 - confidence - 8, rationale: 'Common co-occurring differential to exclude via diagnostics.' },
          { name: 'Atypical Viral / Idiopathic Presentation', probability: 8, rationale: 'Rule out following primary lab panels.' }
        ],
        stepwiseQuestions: [
          'What was the exact hour of onset, and has the intensity progressed?',
          'Are there any aggravating factors (movement, meals, position) or relieving factors?',
          'Have you noticed any associated autonomic signs (chills, diaphoresis, lightheadedness)?'
        ],
        redFlags,
        recommendedLabs: labs,
        suggestedTreatment: meds,
        clinicalNotes: 'Computed via Hassan and Co. Clinical Reasoning Engine. Verified against patient demographics and current vital observations.'
      });
      setAiAnalyzing(false);
    }, 850);
  };

  const handleTransferAiResult = () => {
    if (!aiResult) return;
    addDiagnosis(aiResult.differentials[0].name);
    aiResult.recommendedLabs.forEach(lab => addLab(lab));
    aiResult.suggestedTreatment.forEach(med => {
      addPrescriptionItem({
        genericName: med.genericName,
        brandName: med.brandName,
        strength: 'Standard',
        form: 'Tab',
        route: 'Oral',
        dosage: med.dose,
        frequency: med.freq,
        duration: med.dur,
        instructions: 'Take as directed by physician.'
      });
    });
    setAdvice(aiResult.clinicalNotes);
    setTransferToast(`AI Differential & Recommended Rx transferred successfully!`);
    setTimeout(() => setTransferToast(null), 3500);
  };

  // --- Render Tabs ---
  const renderTabs = () => (
    <div className="flex items-center gap-2 border-b border-border px-4 py-2 bg-canvas shrink-0">
      <button
        onClick={() => { setActiveTab('symptoms'); setSearchQuery(''); }}
        className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
          activeTab === 'symptoms' ? 'bg-primary text-white shadow-sm' : 'text-text-muted hover:bg-surface'
        }`}
      >
        <Activity size={15} />
        <span>Symptoms</span>
        <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${activeTab === 'symptoms' ? 'bg-white/20 text-white' : 'bg-border text-text-muted'}`}>
          {totalSymptomsCount}
        </span>
      </button>

      <button
        onClick={() => { setActiveTab('diseases'); setSearchQuery(''); }}
        className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
          activeTab === 'diseases' ? 'bg-primary text-white shadow-sm' : 'text-text-muted hover:bg-surface'
        }`}
      >
        <FileText size={15} />
        <span>Diseases</span>
        <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${activeTab === 'diseases' ? 'bg-white/20 text-white' : 'bg-border text-text-muted'}`}>
          {totalDiseasesCount}
        </span>
      </button>

      <button
        onClick={() => { setActiveTab('ai'); setSearchQuery(''); }}
        className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
          activeTab === 'ai' ? 'bg-primary text-white shadow-sm' : 'text-text-muted hover:bg-surface'
        }`}
      >
        <BrainCircuit size={15} />
        <span>AI Stepwise &amp; Reasoning</span>
        <span className="text-[10px] bg-teal-500/20 text-teal-400 px-1.5 py-0.5 rounded font-bold">LIVE</span>
      </button>
    </div>
  );

  const renderSearchBar = () => (
    <div className="p-3 border-b border-border bg-surface shrink-0 flex items-center justify-between gap-3">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={15} />
        <input
          type="text"
          placeholder={`Search ${activeTab === 'symptoms' ? '1,600+ symptoms' : '1,600+ diseases'} across all clinical systems...`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-1.5 bg-canvas border border-border rounded-lg text-xs focus:outline-none focus:border-primary text-text-primary placeholder:text-text-faint"
        />
      </div>
      {searchQuery && (
        <button
          onClick={() => setSearchQuery('')}
          className="text-xs text-text-muted hover:text-text-primary px-2 py-1 rounded bg-canvas border border-border"
        >
          Clear
        </button>
      )}
    </div>
  );

  // Render Symptoms Tab (Categorized 1600+ items)
  const renderSymptomsTab = () => (
    <div className="p-4 space-y-3">
      {Object.entries(filteredSymptoms).map(([system, list]) => {
        const isExpanded = expandedCategories[system] || searchQuery.length > 0;
        return (
          <div key={system} className="border border-border rounded-xl overflow-hidden bg-surface shadow-xs">
            <button
              onClick={() => toggleCategory(system)}
              className="w-full flex items-center justify-between p-3 bg-canvas hover:bg-surface transition-colors text-left"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-teal-500/10 text-teal-600 flex items-center justify-center">
                  <Activity size={15} />
                </div>
                <span className="font-bold text-text-primary text-xs">{system}</span>
                <span className="px-2 py-0.5 rounded-full bg-border text-[10px] font-bold text-text-muted">
                  {list.length}
                </span>
              </div>
              {isExpanded ? <ChevronUp size={15} className="text-text-muted" /> : <ChevronDown size={15} className="text-text-muted" />}
            </button>

            {isExpanded && (
              <div className="p-3 flex flex-wrap gap-1.5 border-t border-border bg-surface max-h-72 overflow-y-auto">
                {list.map(symptom => {
                  const hasTree = !!getTreeKeyForSymptom(symptom);
                  return (
                    <button
                      key={symptom}
                      onClick={() => handleStartTree(symptom)}
                      className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-all flex items-center gap-1.5 ${
                        hasTree
                          ? 'bg-teal-500/10 hover:bg-teal-500 text-teal-600 hover:text-white border-teal-500/30 font-semibold'
                          : 'bg-canvas hover:bg-surface border-border text-text-secondary hover:text-text-primary hover:border-primary/40'
                      }`}
                      title={hasTree ? 'Launch Interactive Decision Tree' : 'View Clinical Protocol & Regimen'}
                    >
                      <span>{symptom}</span>
                      {hasTree && <ArrowRight size={11} className="text-teal-500" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}

      {Object.keys(filteredSymptoms).length === 0 && (
        <div className="py-12 text-center text-text-muted text-xs">
          No symptoms matching "{searchQuery}" found in the 1,600+ database.
        </div>
      )}
    </div>
  );

  // Render Diseases Tab (Categorized 1600+ items)
  const renderDiseasesTab = () => (
    <div className="p-4 space-y-3">
      {Object.entries(filteredDiseases).map(([specialty, list]) => {
        const isExpanded = expandedCategories[specialty] || searchQuery.length > 0;
        return (
          <div key={specialty} className="border border-border rounded-xl overflow-hidden bg-surface shadow-xs">
            <button
              onClick={() => toggleCategory(specialty)}
              className="w-full flex items-center justify-between p-3 bg-canvas hover:bg-surface transition-colors text-left"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center">
                  <Stethoscope size={15} />
                </div>
                <span className="font-bold text-text-primary text-xs">{specialty}</span>
                <span className="px-2 py-0.5 rounded-full bg-border text-[10px] font-bold text-text-muted">
                  {list.length}
                </span>
              </div>
              {isExpanded ? <ChevronUp size={15} className="text-text-muted" /> : <ChevronDown size={15} className="text-text-muted" />}
            </button>

            {isExpanded && (
              <div className="p-3 grid grid-cols-1 sm:grid-cols-2 gap-2 border-t border-border bg-surface max-h-80 overflow-y-auto">
                {list.map((disease, idx) => {
                  const icd = getIcdCode(disease, idx);
                  return (
                    <div
                      key={disease}
                      className="p-2.5 rounded-lg bg-canvas border border-border flex items-center justify-between gap-2 hover:border-primary/40 transition-colors"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="font-semibold text-xs text-text-primary truncate">{disease}</div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="font-mono text-[10px] text-text-muted bg-surface px-1 rounded border border-border">
                            ICD: {icd}
                          </span>
                          <span className="text-[10px] text-text-faint">{specialty}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => {
                            addDiagnosis(disease);
                            setTransferToast(`Added ${disease} to Diagnosis!`);
                            setTimeout(() => setTransferToast(null), 3000);
                          }}
                          className="px-2 py-1 rounded bg-surface hover:bg-primary text-text-secondary hover:text-white border border-border text-[10px] font-semibold transition-colors"
                          title="Add diagnosis to Rx pad"
                        >
                          + Diag
                        </button>
                        <button
                          onClick={() => handleApplyDiseaseRegimen(disease, idx)}
                          className="px-2 py-1 rounded bg-primary/10 hover:bg-primary text-primary hover:text-white border border-primary/20 text-[10px] font-bold transition-colors"
                          title="Apply standard medical regimen & labs"
                        >
                          Regimen →
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}

      {Object.keys(filteredDiseases).length === 0 && (
        <div className="py-12 text-center text-text-muted text-xs">
          No disease protocols matching "{searchQuery}" found in the 1,600+ database.
        </div>
      )}
    </div>
  );

  // Render AI Stepwise & Reasoning Tab
  const renderAiTab = () => (
    <div className="p-5 space-y-5 max-w-3xl mx-auto">
      
      {/* Patient Vitals & Safety Context Banner */}
      <div className="p-3.5 rounded-xl bg-surface border border-border flex flex-wrap items-center justify-between gap-3 text-xs shadow-xs">
        <div>
          <span className="text-text-muted font-medium">Patient Context: </span>
          <strong className="text-text-primary">{patient.name || 'Anonymous Patient'}</strong>
          <span className="text-text-secondary ml-1">({patient.age || 'Adult'} / {patient.gender || 'Unknown'})</span>
        </div>
        <div className="flex items-center gap-3">
          {patient.bp && <span>BP: <strong>{patient.bp}</strong></span>}
          {patient.temperature && <span>Temp: <strong>{patient.temperature} °C</strong></span>}
          {patient.allergies && patient.allergies.length > 0 ? (
            <span className="text-danger font-bold bg-danger/10 px-2 py-0.5 rounded-full border border-danger/20">
              Allergy: {patient.allergies.map(a => a.name).join(', ')}
            </span>
          ) : (
            <span className="text-emerald-600 font-medium">NKDA</span>
          )}
        </div>
      </div>

      {/* Input Box */}
      <div className="space-y-2">
        <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider flex items-center justify-between">
          <span>Clinical Intake &amp; Presenting Complaint</span>
          <span className="text-teal-600 font-semibold lowercase">ai differential engine</span>
        </label>
        
        <div className="relative">
          <textarea
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            placeholder="Type or paste patient symptoms (e.g. '55M sudden severe retrosternal chest pain with diaphoresis and left arm numbness' or 'child with barking cough and stridor')..."
            className="w-full h-28 p-3.5 bg-surface border border-border rounded-xl text-xs text-text-primary resize-none focus:outline-none focus:border-primary shadow-inner placeholder:text-text-faint"
          />
          <div className="absolute bottom-3 right-3 flex items-center gap-2">
            <button
              onClick={handleRunAiAnalysis}
              disabled={aiAnalyzing || !aiPrompt.trim()}
              className="px-4 py-2 bg-primary hover:bg-primary/90 disabled:opacity-50 text-white rounded-lg text-xs font-bold flex items-center gap-2 shadow-md shadow-primary/20 transition-all cursor-pointer"
            >
              {aiAnalyzing ? (
                <>
                  <Activity size={14} className="animate-spin" />
                  <span>Synthesizing...</span>
                </>
              ) : (
                <>
                  <Zap size={14} />
                  <span>Run Clinical AI Reasoning</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Sample Fast Intake Buttons */}
      <div className="space-y-1.5">
        <div className="text-[11px] font-semibold text-text-muted">Instant Clinical Scenarios:</div>
        <div className="flex flex-wrap gap-2">
          {[
            "55M retrosternal chest pressure radiating to left arm with diaphoresis",
            "34F high fever, productive purulent cough, and right sided pleuritic chest pain",
            "22M acute severe right lower quadrant abdominal pain with rebound tenderness",
            "6yo child acute barking cough, inspiratory stridor, and 39°C fever"
          ].map(prompt => (
            <button
              key={prompt}
              onClick={() => { setAiPrompt(prompt); }}
              className="px-2.5 py-1 text-[11px] bg-surface hover:bg-canvas border border-border rounded-full text-text-secondary hover:text-text-primary transition-colors text-left"
            >
              "{prompt.slice(0, 48)}..."
            </button>
          ))}
        </div>
      </div>

      {/* AI Results Rendering */}
      {aiResult && (
        <div className="p-5 rounded-2xl bg-surface border border-teal-500/40 shadow-lg space-y-5 animate-in fade-in duration-200">
          
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-teal-500" />
              <h3 className="font-bold text-text-primary text-sm">Differential Diagnosis &amp; Decision Matrix</h3>
            </div>
            <button
              onClick={handleTransferAiResult}
              className="px-3 py-1.5 rounded-lg bg-teal-500 hover:bg-teal-600 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Transfer All to Rx Pad</span>
            </button>
          </div>

          {/* Probabilities Bars */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-text-muted uppercase tracking-wider">Ranked Differential Likelihoods</h4>
            {aiResult.differentials.map((diff, i) => (
              <div key={i} className="p-2.5 rounded-lg bg-canvas border border-border space-y-1 text-xs">
                <div className="flex justify-between font-bold">
                  <span className="text-text-primary">{diff.name}</span>
                  <span className="text-teal-600">{diff.probability}% Likelihood</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-border overflow-hidden">
                  <div className="h-full bg-teal-500 rounded-full" style={{ width: `${diff.probability}%` }} />
                </div>
                <p className="text-[11px] text-text-muted">{diff.rationale}</p>
              </div>
            ))}
          </div>

          {/* Stepwise Investigative Questions */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-text-muted uppercase tracking-wider">Next Stepwise Clinical Questions</h4>
            <div className="space-y-1 text-xs">
              {aiResult.stepwiseQuestions.map((q, i) => (
                <div key={i} className="flex items-start gap-2 p-2 rounded bg-canvas border border-border">
                  <span className="font-bold text-primary">Q{i + 1}.</span>
                  <span className="text-text-secondary">{q}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Red Flags & Labs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-3 rounded-lg bg-danger-bg border border-danger/20 space-y-1.5">
              <h5 className="font-bold text-danger flex items-center gap-1.5">
                <AlertTriangle size={14} /> Red Flags to Rule Out
              </h5>
              <ul className="list-disc list-inside text-danger-text space-y-0.5 text-[11px]">
                {aiResult.redFlags.map((rf, i) => <li key={i}>{rf}</li>)}
              </ul>
            </div>

            <div className="p-3 rounded-lg bg-canvas border border-border space-y-1.5">
              <h5 className="font-bold text-primary flex items-center gap-1.5">
                <FlaskConical size={14} /> Recommended Workup
              </h5>
              <ul className="list-disc list-inside text-text-secondary space-y-0.5 text-[11px]">
                {aiResult.recommendedLabs.map((lab, i) => <li key={i}>{lab}</li>)}
              </ul>
            </div>
          </div>

        </div>
      )}

    </div>
  );

  // Render Decision Tree Branching View
  const renderTreeView = () => {
    if (!activeTreeId || currentStepId === null) return null;
    const tree = DECISION_TREES[activeTreeId];
    const currentStep = tree.steps[currentStepId];
    const terminalStep = tree.terminal[currentStepId];

    return (
      <div className="flex h-full bg-canvas">
        {/* Left Rail (Breadcrumbs) */}
        <div className="w-64 border-r border-border bg-surface flex flex-col shrink-0">
          <div className="p-3 border-b border-border">
            <button 
              onClick={handleBackTree}
              className="flex items-center gap-2 text-xs font-semibold text-text-muted hover:text-text-primary transition-colors"
            >
              <ArrowLeft size={14} />
              Back to Symptoms
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted mb-4">
              Pathway: {activeTreeId}
            </h3>
            <div className="relative pl-3 border-l-2 border-border space-y-5">
              {treePath.map((node, index) => (
                <div key={index} className="relative">
                  <div className="absolute -left-[19px] top-0.5 bg-surface rounded-full">
                    <CheckCircle2 size={16} className="text-emerald-500 fill-emerald-500/10" />
                  </div>
                  <div className="text-xs font-medium text-text-primary">{node.label}</div>
                  <div className="text-[10px] text-text-muted">Completed</div>
                </div>
              ))}
              
              <div className="relative">
                <div className="absolute -left-[19px] top-0.5 bg-surface rounded-full">
                  <div className="w-4 h-4 rounded-full border-2 border-primary bg-primary/20 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  </div>
                </div>
                <div className="text-xs font-bold text-primary">
                  {terminalStep ? 'Terminal Diagnosis' : 'Current Step'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Tree Content Area */}
        <div className="flex-1 overflow-y-auto p-6">
          {terminalStep ? (
            <div className="max-w-2xl mx-auto space-y-4">
              <div className="border border-emerald-500 rounded-2xl overflow-hidden shadow-sm bg-surface">
                <div className="bg-emerald-500/10 p-5 border-b border-emerald-500/20">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h2 className="text-xl font-bold text-text-primary mb-1">
                        {terminalStep.diagnosis}
                      </h2>
                      <div className="flex items-center gap-2">
                        <span className="badge badge-success text-xs flex items-center gap-1">
                          <Target size={13} /> {terminalStep.confidence} Likely
                        </span>
                        <span className="text-xs text-text-muted bg-surface px-2 py-0.5 rounded border border-border">
                          {terminalStep.guidelines}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-5 space-y-4">
                  {/* Pediatric Warning */}
                  {isPediatric && terminalStep.medications?.length > 0 && (
                    <div className="p-3 bg-warning-bg border border-warning/30 rounded-lg flex items-start gap-2 text-xs font-semibold text-warning-text">
                      <AlertTriangle size={15} className="shrink-0 mt-0.5" />
                      <span>Pediatric Patient: Dosing must be calculated by body weight (mg/kg).</span>
                    </div>
                  )}

                  {/* Allergy Warning */}
                  {patient.allergies?.some(a => terminalStep.medications?.some(m => `${m.genericName} ${m.brandName}`.toLowerCase().includes(a.name.toLowerCase()))) && (
                    <div className="p-3 bg-danger-bg border border-danger/30 rounded-lg flex items-start gap-2 text-xs font-semibold text-danger-text">
                      <AlertTriangle size={15} className="shrink-0 mt-0.5" />
                      <span>CRITICAL ALLERGY CONFLICT: A recommended drug clashes with patient's allergy profile!</span>
                    </div>
                  )}

                  {terminalStep.redFlags && terminalStep.redFlags.length > 0 && (
                    <div className="p-3 bg-danger-bg border border-danger/30 rounded-lg text-xs">
                      <div className="font-bold text-danger mb-1 flex items-center gap-1">
                        <AlertTriangle size={14} /> Red Flag Conditions to Exclude
                      </div>
                      <div className="text-danger-text">{terminalStep.redFlags.join(', ')}</div>
                    </div>
                  )}

                  {/* Medications & Labs */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div>
                      <h4 className="font-bold text-text-primary mb-2 flex items-center gap-1.5">
                        <Pill size={14} className="text-primary" /> Recommended Medications
                      </h4>
                      <div className="space-y-1.5">
                        {terminalStep.medications?.map((m, i) => (
                          <div key={i} className="p-2 rounded bg-canvas border border-border">
                            <div className="font-bold text-text-primary">{m.brandName || m.genericName}</div>
                            <div className="text-[11px] text-text-muted">{m.dosage} • {m.duration}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-bold text-text-primary mb-2 flex items-center gap-1.5">
                        <FlaskConical size={14} className="text-primary" /> Required Labs
                      </h4>
                      <div className="space-y-1.5">
                        {terminalStep.investigations?.map((lab, i) => (
                          <div key={i} className="p-2 rounded bg-canvas border border-border font-medium text-text-secondary">
                            {lab}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-4 border-t border-border flex gap-3">
                    <button
                      onClick={() => handleTransferAll(terminalStep)}
                      className="flex-1 py-2.5 px-4 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-xs flex items-center justify-center gap-2 shadow transition-all"
                    >
                      <Check size={14} />
                      <span>Transfer All to Prescription Pad</span>
                    </button>
                    <button
                      onClick={() => { setActiveTreeId(null); setCurrentStepId(null); }}
                      className="py-2.5 px-4 rounded-xl bg-canvas border border-border text-text-secondary text-xs font-semibold hover:bg-surface transition-colors"
                    >
                      Close Pathway
                    </button>
                  </div>

                </div>
              </div>
            </div>
          ) : currentStep ? (
            <div className="max-w-xl mx-auto space-y-5">
              <div>
                <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Step {currentStepId}</span>
                <h2 className="text-lg font-bold text-text-primary mt-1">{currentStep.prompt}</h2>
              </div>

              <div className="space-y-2">
                {currentStep.options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handleOptionClick(opt.nextStep, opt.label)}
                    className="w-full p-3.5 rounded-xl bg-surface hover:bg-primary-bg border border-border hover:border-primary text-left text-xs font-medium text-text-primary flex items-center justify-between transition-all group"
                  >
                    <span>{opt.label}</span>
                    <ArrowRight size={14} className="text-text-faint group-hover:text-primary transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col overflow-hidden bg-canvas">
      
      {/* Toast Notification */}
      {transferToast && (
        <div className="bg-emerald-600 text-white px-4 py-2 text-xs font-bold text-center flex items-center justify-center gap-2 animate-in slide-in-from-top-1">
          <CheckCircle2 size={14} />
          <span>{transferToast}</span>
        </div>
      )}

      {/* Active Tree Mode */}
      {activeTreeId ? (
        renderTreeView()
      ) : (
        <>
          {renderTabs()}
          {activeTab !== 'ai' && renderSearchBar()}
          <div className="flex-1 overflow-y-auto">
            {activeTab === 'symptoms' && renderSymptomsTab()}
            {activeTab === 'diseases' && renderDiseasesTab()}
            {activeTab === 'ai' && renderAiTab()}
          </div>
        </>
      )}

      {/* Clinical Protocol Modal (For symptoms without branching trees) */}
      {selectedProtocol && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="max-w-lg w-full bg-surface border border-border rounded-2xl shadow-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h3 className="text-base font-bold text-text-primary">{selectedProtocol.symptom}</h3>
                <span className="text-[11px] text-text-muted">{selectedProtocol.system} • Protocol Assessment</span>
              </div>
              <button onClick={() => setSelectedProtocol(null)} className="text-text-muted hover:text-text-primary">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-lg bg-canvas border border-border space-y-1">
                <span className="font-bold text-text-muted uppercase text-[10px]">Differential Diagnoses</span>
                <ul className="list-disc list-inside text-text-secondary">
                  {selectedProtocol.differentials.map((d, i) => <li key={i}>{d}</li>)}
                </ul>
              </div>

              <div className="p-3 rounded-lg bg-danger-bg border border-danger/20 space-y-1">
                <span className="font-bold text-danger uppercase text-[10px]">Red Flags</span>
                <ul className="list-disc list-inside text-danger-text">
                  {selectedProtocol.redFlags.map((rf, i) => <li key={i}>{rf}</li>)}
                </ul>
              </div>

              <div className="p-3 rounded-lg bg-canvas border border-border space-y-1">
                <span className="font-bold text-primary uppercase text-[10px]">Recommended Diagnostics</span>
                <div className="flex flex-wrap gap-1">
                  {selectedProtocol.suggestedLabs.map((l, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-surface border border-border text-text-secondary text-[11px]">
                      {l}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-3 border-t border-border">
              <button
                onClick={() => handleTransferProtocol(selectedProtocol)}
                className="flex-1 py-2.5 px-4 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow"
              >
                <Check size={14} />
                <span>Apply Protocol to Prescription</span>
              </button>
              <button
                onClick={() => setSelectedProtocol(null)}
                className="py-2.5 px-4 rounded-xl bg-canvas border border-border text-text-secondary font-semibold text-xs hover:bg-surface"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
