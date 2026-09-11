import React, { useState, useMemo } from 'react';
import { useAppStore } from '../store/useAppStore';
import { QUICK_FAVORITES, DOSAGE_FORMS, ROUTES, FREQUENCIES } from '../data/medications';
import type { PrescriptionItem, Allergy } from '../types';
import { format } from 'date-fns';
import {
  Edit2, Save, Printer, Trash2, Plus, AlertTriangle, ShieldAlert,
  ChevronDown, ChevronUp, Pill, Star, X, Calculator, Info,
  FileText, Clock, CheckCircle2, OctagonAlert, DollarSign, Globe,
  Sparkles, ShieldCheck, Heart, Activity, PanelRightClose
} from 'lucide-react';
import { generateContextualTreatmentRecommendations } from '../utils/clinicalContextReasoning';
import {
  translateDosageToUrdu,
  translateDurationToUrdu,
  translateInstructionsToUrdu,
  translateAdviceToUrdu,
  URDU_FORM_MAP,
  URDU_SLIP_LABELS
} from '../utils/urduTranslations';

export const URDU_FREQUENCY_MAP: Record<string, { en: string; ur: string }> = {
  'OD': { en: 'Once daily', ur: 'دن میں ایک بار' },
  'BD': { en: 'Twice daily (Morning & Night)', ur: 'دن میں دو بار (صبح و شام)' },
  'TDS': { en: 'Thrice daily (Morning, Noon, Night)', ur: 'دن میں تین بار (صبح، دوپہر، شام)' },
  'QDS': { en: 'Four times daily', ur: 'دن میں چار بار (ہر 6 گھنٹے بعد)' },
  'HS': { en: 'At bedtime', ur: 'رات سوتے وقت' },
  'QHS': { en: 'At bedtime', ur: 'رات سوتے وقت' },
  'PRN': { en: 'As needed', ur: 'ضرورت کے وقت' },
  'SOS': { en: 'In emergency / As needed', ur: 'شدید ضرورت پر' },
  'STAT': { en: 'Immediately', ur: 'فوراً (پہلی خوراک)' },
  'Q4H': { en: 'Every 4 hours', ur: 'ہر 4 گھنٹے بعد' },
  'Q6H': { en: 'Every 6 hours', ur: 'ہر 6 گھنٹے بعد' },
  'Q8H': { en: 'Every 8 hours', ur: 'ہر 8 گھنٹے بعد' },
  'Weekly': { en: 'Once a week', ur: 'ہفتے میں ایک بار' }
};

export const getUrduTiming = (instructions?: string, frequency?: string) => {
  const inst = (instructions || '').toLowerCase();
  const parts: string[] = [];

  if (inst.includes('after') || inst.includes('post')) {
    parts.push('کھانے کے بعد');
  } else if (inst.includes('before') || inst.includes('empty') || inst.includes('prior')) {
    parts.push('نہار منہ / کھانے سے پہلے');
  } else if (inst.includes('with food') || inst.includes('with meal')) {
    parts.push('کھانے کے دوران');
  }

  if (frequency && URDU_FREQUENCY_MAP[frequency]) {
    parts.push(URDU_FREQUENCY_MAP[frequency].ur);
  }

  if (inst.includes('water')) parts.push('زیادہ پانی کے ساتھ');
  if (inst.includes('milk')) parts.push('دودھ کے ساتھ');
  if (inst.includes('course')) parts.push('کورس مکمل کریں');

  if (parts.length === 0) {
    return frequency && URDU_FREQUENCY_MAP[frequency] ? URDU_FREQUENCY_MAP[frequency].ur : 'ہدایت کے مطابق استعمال کریں';
  }
  return parts.join(' • ');
};

export interface PrescriptionPanelProps {
  onMinimize?: () => void;
}

export const PrescriptionPanel: React.FC<PrescriptionPanelProps> = ({ onMinimize }) => {
  const {
    patient,
    patientHistory,
    soapNote,
    clinicalNotes,
    prescription,
    doctorProfile,
    addPrescriptionItem,
    removePrescriptionItem,
    updatePrescriptionItem,
    setAdvice,
    addLab,
    removeLab,
    addDiagnosis,
    removeDiagnosis,
    setFollowUpDate,
    saveCurrentCase,
    resetPrescription,
    customTemplates,
    inventory,
    prescriptionLanguage,
    setPrescriptionLanguage
  } = useAppStore();

  const [showDoseCalc, setShowDoseCalc] = useState(false);
  const [doseMgPerKg, setDoseMgPerKg] = useState('');
  const [dosesPerDay, setDosesPerDay] = useState('');
  
  const [showFavorites, setShowFavorites] = useState(false);
  const [showSmartSuggestions, setShowSmartSuggestions] = useState(false);

  // Compute patient-context aware clinical treatment plan
  const contextualPlan = useMemo(() => {
    return generateContextualTreatmentRecommendations({
      patient,
      patientHistory,
      soapNote,
      inventory,
      clinicalNotes
    });
  }, [patient, patientHistory, soapNote, inventory, clinicalNotes]);
  
  // Manual entry form
  const [manualEntry, setManualEntry] = useState({
    brandName: '',
    genericName: '',
    strength: '',
    form: DOSAGE_FORMS[0] || 'Tab',
    route: ROUTES[0] || 'Oral',
    dosage: '',
    frequency: FREQUENCIES[0] || 'OD',
    duration: '',
    instructions: '',
    indication: ''
  });

  const [newDiagnosis, setNewDiagnosis] = useState('');
  const [newLab, setNewLab] = useState('');
  const [showPrintModal, setShowPrintModal] = useState(false);

  // Tier 1 alert modal
  const [alertModal, setAlertModal] = useState<{ open: boolean; message: string; pendingItem: any } | null>(null);

  // Group quick favorites
  const favoritesByCategory = useMemo(() => {
    const groups: Record<string, typeof QUICK_FAVORITES> = {};
    QUICK_FAVORITES.forEach(item => {
      const cat = (item as any).category || 'Other';
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(item);
    });
    return groups;
  }, []);

  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

  const toggleCategory = (cat: string) => {
    setExpandedCategories(prev => ({ ...prev, [cat]: !prev[cat] }));
  };

  const checkInteractions = (item: any) => {
    const nameToMatch = (`${item.genericName} ${item.brandName}`).toLowerCase();
    let highestAlert: { tier: number; message: string } | null = null;

    for (const allergy of (patient.allergies || [])) {
      const aName = allergy.name.toLowerCase();
      
      // Tier 1 hard stop: Penicillin anaphylaxis
      const isPenicillinAllergy = aName.includes('penicillin') || aName.includes('amox') || aName.includes('augmentin');
      const isDrugPenicillin = nameToMatch.includes('amox') || nameToMatch.includes('augmentin') || nameToMatch.includes('penicillin') || nameToMatch.includes('ampicillin');
      
      if (allergy.severity === 'Anaphylaxis' && isPenicillinAllergy && isDrugPenicillin) {
        return { tier: 1, message: `CRITICAL ALLERGY: ${patient.name} has a recorded ANAPHYLACTIC reaction to ${allergy.name}. Prescribing ${item.genericName} is contraindicated and potentially FATAL.` };
      }
      
      // Tier 2: Moderate/Severe
      if ((allergy.severity === 'Severe' || allergy.severity === 'Moderate') && nameToMatch.includes(aName)) {
        if (!highestAlert || highestAlert.tier > 2) {
          highestAlert = { tier: 2, message: `Warning: Patient has a ${allergy.severity} allergy to ${allergy.name}.` };
        }
      }
      
      // Tier 3: General Match
      if (nameToMatch.includes(aName)) {
        if (!highestAlert || highestAlert.tier > 3) {
          highestAlert = { tier: 3, message: `Note: Patient has a recorded allergy to ${allergy.name}.` };
        }
      }
    }
    return highestAlert;
  };

  const handleAddItem = (item: any) => {
    const interaction = checkInteractions(item);
    if (interaction && interaction.tier === 1) {
      setAlertModal({ open: true, message: interaction.message, pendingItem: item });
      return;
    }
    addPrescriptionItem(item);
  };

  const handleAddTemplate = (template: any) => {
    template.items.forEach((item: any) => {
      handleAddItem(item);
    });
  };

  const confirmOverride = () => {
    if (alertModal?.pendingItem) {
      addPrescriptionItem(alertModal.pendingItem);
    }
    setAlertModal(null);
  };

  const handleManualAdd = () => {
    if (!manualEntry.genericName && !manualEntry.brandName) return;
    handleAddItem({ ...manualEntry });
    // Reset basic fields but keep forms/routes
    setManualEntry(prev => ({
      ...prev,
      brandName: '', genericName: '', strength: '', dosage: '', duration: '', instructions: '', indication: ''
    }));
  };

  const getWeightInKg = () => {
    const match = patient.weight?.match(/([\d.]+)/);
    return match ? parseFloat(match[1]) : 0;
  };

  const calcDose = () => {
    const w = getWeightInKg();
    const mg = parseFloat(doseMgPerKg);
    const doses = parseInt(dosesPerDay);
    if (w && mg && doses) {
      const total = w * mg;
      const perDose = total / doses;
      return { total: total.toFixed(1), perDose: perDose.toFixed(1) };
    }
    return null;
  };
  const doseResult = calcDose();

  const getItemPrice = (item: any) => {
    const searchBrand = (item.brandName || '').toLowerCase().trim();
    const searchGeneric = (item.genericName || '').toLowerCase().trim();
    const match = inventory.find(inv => {
      const name = inv.name.toLowerCase();
      return (searchBrand && name.includes(searchBrand)) || (searchGeneric && name.includes(searchGeneric));
    });
    return match ? (match.sellingPrice || match.unitPrice || 0) : null;
  };

  const totalEstimatedPrice = useMemo(() => {
    return prescription.items.reduce((acc, item) => {
      const p = getItemPrice(item);
      return acc + (p || 0);
    }, 0);
  }, [prescription.items, inventory]);

  const handleSaveCustomTemplate = () => {
    if (prescription.items.length === 0) {
      alert("No medications to save in template.");
      return;
    }
    const templateName = prompt("Enter a name for this custom template:");
    if (!templateName) return;
    
    useAppStore.setState(s => ({
      customTemplates: [
        ...s.customTemplates,
        {
          id: crypto.randomUUID(),
          name: templateName,
          items: prescription.items.map(i => ({ ...i, id: crypto.randomUUID() }))
        }
      ]
    }));
    alert("Template saved successfully!");
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="h-full flex flex-col overflow-hidden bg-canvas">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 gap-2 border-b border-border bg-surface print:hidden">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Edit2 className="w-5 h-5 text-primary" />
            <h2 className="font-semibold text-text-primary">Live Rx Pad</h2>
          </div>

          {/* Prescription Language Switcher: English or Urdu */}
          <div className="flex items-center bg-canvas p-0.5 rounded-lg border border-border text-[11px] font-semibold">
            <button
              onClick={() => setPrescriptionLanguage('english')}
              className={`px-2.5 py-1 rounded transition-colors ${prescriptionLanguage === 'english' ? 'bg-primary text-white font-bold shadow-xs' : 'text-text-muted hover:text-text-primary'}`}
              title="Standard English Prescription"
            >
              English
            </button>
            <button
              onClick={() => setPrescriptionLanguage('urdu')}
              className={`px-2.5 py-1 rounded transition-colors flex items-center gap-1 ${prescriptionLanguage === 'urdu' ? 'bg-emerald-600 text-white font-bold shadow-xs' : 'text-text-muted hover:text-text-primary'}`}
              title="مکمل اردو نسخہ مع ہدایات و پرہیز"
            >
              <span>اردو (Urdu)</span>
            </button>
          </div>

          {/* Estimated Rx Cost Pill */}
          {totalEstimatedPrice > 0 && (
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 text-xs font-bold">
              <DollarSign className="w-3.5 h-3.5" />
              <span>Est. Cost: ₨ {totalEstimatedPrice.toLocaleString()}</span>
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button onClick={saveCurrentCase} className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors shadow-sm">
            <Save className="w-3.5 h-3.5" /> Save Case
          </button>
          <button onClick={handleSaveCustomTemplate} className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-surface border border-border text-text-primary rounded-lg hover:bg-canvas transition-colors">
            <Star className="w-3.5 h-3.5" /> Template
          </button>
          <button onClick={() => setShowPrintModal(true)} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-sm transition-colors">
            <Printer className="w-3.5 h-3.5" /> Print / PDF Slip
          </button>
          <button onClick={resetPrescription} className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium bg-surface border border-danger text-danger rounded-lg hover:bg-danger-bg transition-colors">
            <Trash2 className="w-3.5 h-3.5" /> Clear
          </button>
          {onMinimize && (
            <button
              onClick={onMinimize}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold bg-surface border border-border text-text-secondary hover:text-text-primary rounded-lg hover:bg-canvas transition-colors shadow-2xs"
              title="Minimize Rx Pad (Expand Clinical View)"
            >
              <PanelRightClose className="w-3.5 h-3.5 text-text-muted" />
              <span className="hidden xl:inline">Minimize</span>
            </button>
          )}
        </div>
      </div>

      {/* TIER 1 ALERT MODAL */}
      {alertModal && alertModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 print:hidden">
          <div className="bg-surface rounded-lg w-full max-w-md overflow-hidden shadow-2xl border border-danger">
            <div className="bg-danger text-white p-4 flex items-center gap-3">
              <OctagonAlert className="w-8 h-8" />
              <h3 className="font-bold text-lg">CRITICAL SAFETY ALERT</h3>
            </div>
            <div className="p-4">
              <p className="text-text-primary font-medium">{alertModal.message}</p>
              <div className="mt-6 flex justify-end gap-3">
                <button onClick={() => setAlertModal(null)} className="px-4 py-2 bg-canvas border border-border rounded-md text-text-primary hover:bg-border transition-colors">
                  Cancel Order
                </button>
                <button onClick={confirmOverride} className="px-4 py-2 bg-danger text-white rounded-md hover:bg-danger/90 transition-colors">
                  Override (Document Reason)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MAIN CONTENT */}
      <div className="flex-1 overflow-y-auto print:hidden p-3 space-y-4">
        
        {/* AI CONTEXTUAL SMART SUGGESTIONS */}
        <div className="card overflow-hidden border border-teal-500/30 bg-surface shadow-xs">
          <div 
            onClick={() => setShowSmartSuggestions(!showSmartSuggestions)}
            className="flex items-center justify-between p-3 bg-teal-500/10 hover:bg-teal-500/15 cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <div>
                <span className="font-bold text-xs text-text-primary">
                  AI Contextual Treatment Suggestions
                </span>
                <span className="text-[11px] text-text-muted ml-2">
                  (Vitals, History, SOAP &amp; In-Stock Inventory)
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-500/20 text-teal-700 dark:text-teal-300">
                {contextualPlan.suggestedMedications.length} Tailored Meds
              </span>
              {contextualPlan.patientSummary.abnormalVitals.length > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-700 dark:text-amber-300">
                  {contextualPlan.patientSummary.abnormalVitals.length} Vital Flags
                </span>
              )}
              {showSmartSuggestions ? <ChevronUp className="w-4 h-4 text-text-muted" /> : <ChevronDown className="w-4 h-4 text-text-muted" />}
            </div>
          </div>

          {showSmartSuggestions && (
            <div className="p-3 space-y-3 border-t border-border bg-canvas/50 text-xs">
              {/* Context Summary Header */}
              <div className="p-2.5 rounded-lg bg-surface border border-border space-y-1.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-text-primary flex items-center gap-1">
                    <ShieldCheck size={13} className="text-teal-600" />
                    Patient Factors Evaluated:
                  </span>
                  <span className="text-[10px] text-text-muted">{contextualPlan.patientSummary.demographics}</span>
                </div>
                <div className="text-[11px] text-text-secondary">
                  <strong>Vitals: </strong>{contextualPlan.patientSummary.vitalsSummary}
                </div>
                {contextualPlan.patientSummary.relevantHistory.length > 0 && (
                  <div className="text-[11px] text-text-secondary">
                    <strong>History: </strong>{contextualPlan.patientSummary.relevantHistory.join(' • ')}
                  </div>
                )}
                {contextualPlan.patientSummary.soapFindings.length > 0 && (
                  <div className="text-[11px] text-text-secondary">
                    <strong>SOAP: </strong>{contextualPlan.patientSummary.soapFindings.join('; ')}
                  </div>
                )}
              </div>

              {/* Withheld Contraindications Alert */}
              {contextualPlan.withheldContraindications.length > 0 && (
                <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 space-y-1 text-[11px]">
                  <div className="font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1">
                    <AlertTriangle size={12} /> Contraindicated Medications Withheld:
                  </div>
                  {contextualPlan.withheldContraindications.map((c, i) => (
                    <div key={i} className="text-amber-800 dark:text-amber-300">
                      • <strong>{c.medication}:</strong> {c.reason}
                    </div>
                  ))}
                </div>
              )}

              {/* Suggested Meds List */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-text-muted uppercase text-[10px]">
                    Tailored Medication Recommendations
                  </span>
                  <button
                    onClick={() => {
                      contextualPlan.suggestedMedications.forEach(m => {
                        handleAddItem({
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
                    }}
                    className="text-[10px] font-bold text-teal-600 hover:text-teal-700 underline"
                  >
                    + Add All ({contextualPlan.suggestedMedications.length}) to Rx Pad
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-2">
                  {contextualPlan.suggestedMedications.map((med) => (
                    <div key={med.id} className="p-2.5 rounded-lg bg-surface border border-border flex items-start justify-between gap-2">
                      <div className="space-y-1 flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-text-primary text-xs">{med.brandName || med.genericName}</span>
                          {med.brandName && med.genericName && (
                            <span className="text-[10px] text-text-muted">({med.genericName})</span>
                          )}
                          {med.isPediatricDosed && (
                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-blue-500/10 text-blue-600 border border-blue-500/20">
                              Pediatric Dosed
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-text-secondary">
                          {med.strength} • {med.dosage} • {med.frequency} x {med.duration}
                        </div>
                        <div className="text-[10px] text-teal-600 dark:text-teal-400 bg-canvas p-1 rounded border border-border leading-tight">
                          <strong>Why recommended: </strong>{med.clinicalRationale}
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-1.5 shrink-0">
                        {med.inStock ? (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                            ✓ In Stock (₨ {med.stockPrice})
                          </span>
                        ) : (
                          <span className="text-[9px] font-medium px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600 border border-amber-500/20">
                            ⚠️ Out of Stock
                          </span>
                        )}
                        <button
                          onClick={() => {
                            handleAddItem({
                              genericName: med.genericName,
                              brandName: med.brandName,
                              strength: med.strength,
                              form: med.form,
                              route: med.route,
                              dosage: med.dosage,
                              frequency: med.frequency,
                              duration: med.duration,
                              instructions: med.instructions || med.clinicalRationale
                            });
                          }}
                          className="px-2.5 py-1 rounded bg-primary text-white text-[10px] font-bold hover:bg-primary/90 transition-colors flex items-center gap-1 shadow-2xs"
                        >
                          <Plus size={11} /> Add to Rx
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}
        </div>

        {/* DIAGNOSES */}
        <div className="card p-3">
          <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Diagnoses</h3>
          <div className="flex flex-wrap gap-2 mb-2">
            {prescription.diagnosis.map(d => (
              <span key={d} className="badge bg-primary/10 text-primary flex items-center gap-1">
                {d}
                <X className="w-3 h-3 cursor-pointer hover:text-danger" onClick={() => removeDiagnosis(d)} />
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input 
              type="text" 
              value={newDiagnosis} 
              onChange={e => setNewDiagnosis(e.target.value)} 
              onKeyDown={e => { if (e.key === 'Enter' && newDiagnosis) { addDiagnosis(newDiagnosis); setNewDiagnosis(''); } }}
              placeholder="Add diagnosis..." 
              className="flex-1 border border-border rounded-md px-2 py-1.5 text-sm focus:outline-none focus:border-primary"
            />
            <button 
              onClick={() => { if (newDiagnosis) { addDiagnosis(newDiagnosis); setNewDiagnosis(''); } }}
              className="bg-primary text-white p-1.5 rounded-md hover:bg-primary/90"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* PRESCRIPTION ITEMS LIST */}
        <div className="card p-3">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider">Medications</h3>
            <button onClick={() => setShowDoseCalc(!showDoseCalc)} className="flex items-center gap-1 text-xs text-primary bg-primary/10 px-2 py-1 rounded-md hover:bg-primary/20">
              <Calculator className="w-3.5 h-3.5" /> Dose Calc
            </button>
          </div>

          {showDoseCalc && (
            <div className="bg-canvas border border-border rounded-md p-3 mb-3 text-sm">
              <div className="flex items-center gap-4 mb-2">
                <div>
                  <span className="text-text-muted">Weight:</span> <span className="font-semibold clinical-num">{getWeightInKg() || '--'} kg</span>
                </div>
                <div className="flex-1 flex gap-2">
                  <input type="number" placeholder="mg/kg/day" value={doseMgPerKg} onChange={e => setDoseMgPerKg(e.target.value)} className="w-24 border border-border rounded px-2 py-1 focus:outline-none focus:border-primary" />
                  <input type="number" placeholder="Doses/day" value={dosesPerDay} onChange={e => setDosesPerDay(e.target.value)} className="w-24 border border-border rounded px-2 py-1 focus:outline-none focus:border-primary" />
                </div>
              </div>
              {doseResult && (
                <div className="bg-success-bg border border-success/30 text-success-text p-2 rounded flex justify-between font-medium">
                  <span>Total Daily: {doseResult.total} mg</span>
                  <span>Per Dose: {doseResult.perDose} mg</span>
                </div>
              )}
            </div>
          )}

          <div className="space-y-3">
            {prescription.items.length === 0 && <p className="text-sm text-text-muted italic">No medications added.</p>}
            
            {prescription.items.map((item, idx) => {
              const interaction = checkInteractions(item);
              
              return (
                <div key={item.id} className="relative group border border-border rounded-md p-3 hover:border-primary/50 transition-colors">
                  {interaction && interaction.tier > 1 && (
                    <div className={`mb-2 px-2 py-1 rounded text-xs flex items-start gap-1.5 ${interaction.tier === 2 ? 'alert-warning' : 'alert-info'}`}>
                      {interaction.tier === 2 ? <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" /> : <Info className="w-4 h-4 shrink-0 mt-0.5" />}
                      <span>{interaction.message}</span>
                    </div>
                  )}

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 shrink-0 bg-canvas text-text-muted rounded-full flex items-center justify-center text-xs font-medium clinical-num">
                      {idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="badge bg-nav text-white text-[10px]">{item.form}</span>
                        <span className="font-semibold text-text-primary text-sm truncate">{item.brandName || item.genericName}</span>
                        {item.brandName && <span className="text-xs text-text-muted truncate">{item.genericName}</span>}
                        <span className="text-sm font-medium clinical-num ml-auto">{item.strength}</span>
                        {getItemPrice(item) && (
                          <span className="text-[11px] font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                            ₨ {getItemPrice(item)}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm mt-1.5">
                        <div className="flex items-center gap-1.5 relative group/dose">
                          <span className="text-text-muted text-xs">Dose:</span>
                          <span className="font-medium clinical-num cursor-pointer hover:text-primary">{item.dosage}</span>
                          <div className="absolute hidden group-hover/dose:flex top-full left-0 mt-1 bg-surface border border-border rounded-md shadow-lg p-1 gap-1 z-10 w-max">
                            {['1+0+1', '1+1+1', '1+0+0', '0+0+1', 'SOS'].map(d => (
                              <button key={d} onClick={() => updatePrescriptionItem(item.id, { dosage: d })} className="text-xs px-2 py-1 hover:bg-canvas rounded">{d}</button>
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-text-muted text-xs">Route:</span>
                          <span className="badge bg-canvas border border-border text-text-secondary">{item.route}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-text-muted text-xs">Freq:</span>
                          <span className="badge bg-primary/10 text-primary">{item.frequency}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-text-muted text-xs">Dur:</span>
                          <span className="font-medium clinical-num">{item.duration}</span>
                        </div>
                      </div>

                      {/* Urdu Mode Translated Instructions */}
                      {prescriptionLanguage === 'urdu' && (
                        <div className="mt-1.5 p-2 rounded bg-emerald-500/10 border border-emerald-500/20 flex flex-col gap-1 text-xs" dir="rtl">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-emerald-800">طریقہ استعمال و خوراک:</span>
                            <span className="text-[11px] font-extrabold text-emerald-900">
                              {translateDosageToUrdu(item.dosage, item.form)} • {URDU_FREQUENCY_MAP[item.frequency]?.ur || item.frequency}
                            </span>
                          </div>
                          <div className="text-emerald-950 font-medium text-[11px]">
                            {translateInstructionsToUrdu(item.instructions, item.frequency)}
                          </div>
                          <div className="text-[10px] text-emerald-700 font-semibold">
                            مدت: {translateDurationToUrdu(item.duration)}
                          </div>
                        </div>
                      )}

                      {(item.instructions || item.indication) && (
                        <div className="mt-1 text-xs text-text-muted flex flex-wrap gap-3">
                          {item.instructions && <span className="italic">"{item.instructions}"</span>}
                          {item.indication && <span className="badge bg-canvas border border-border">For: {item.indication}</span>}
                        </div>
                      )}
                    </div>
                    
                    <button 
                      onClick={() => removePrescriptionItem(item.id)}
                      className="opacity-0 group-hover:opacity-100 p-1.5 text-danger hover:bg-danger-bg rounded-md transition-all shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* QUICK FAVORITES */}
        <div className="card border border-border">
          <button 
            className="w-full flex items-center justify-between p-3 text-sm font-medium text-text-primary hover:bg-canvas"
            onClick={() => setShowFavorites(!showFavorites)}
          >
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-warning" /> Quick Rx Templates
            </div>
            {showFavorites ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          
          {showFavorites && (
            <div className="p-3 border-t border-border space-y-3">
              {customTemplates && customTemplates.length > 0 && (
                <div>
                  <div className="flex items-center justify-between w-full text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5">
                    Custom Templates
                  </div>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {customTemplates.map((template: any) => (
                      <button 
                        key={template.id}
                        onClick={() => handleAddTemplate(template)}
                        className="text-xs px-2.5 py-1.5 bg-primary/10 border border-primary/30 text-primary rounded-full hover:bg-primary/20 transition-colors text-left flex items-center gap-1"
                      >
                        <Star className="w-3 h-3" /> <span className="font-medium">{template.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {Object.entries(favoritesByCategory).map(([cat, items]) => (
                <div key={cat}>
                  <button 
                    className="flex items-center justify-between w-full text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5 hover:text-text-primary"
                    onClick={() => toggleCategory(cat)}
                  >
                    {cat}
                    {expandedCategories[cat] ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  </button>
                  {expandedCategories[cat] && (
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {items.map((fav: any) => (
                        <button 
                          key={fav.id}
                          onClick={() => handleAddItem(fav)}
                          className="text-xs px-2.5 py-1.5 bg-canvas border border-border rounded-full hover:bg-primary/10 hover:border-primary hover:text-primary transition-colors text-left"
                        >
                          <span className="font-medium">{fav.brandName || fav.genericName}</span> <span className="text-text-muted">{fav.strength}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* MANUAL ENTRY FORM */}
        <div className="card p-3">
          <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Manual Entry</h3>
          <div className="grid grid-cols-12 gap-2 text-sm">
            <div className="col-span-12 sm:col-span-4">
              <input type="text" placeholder="Generic Name" value={manualEntry.genericName} onChange={e => setManualEntry(prev => ({ ...prev, genericName: e.target.value }))} className="w-full border border-border rounded-md px-2 py-1.5 focus:outline-none focus:border-primary" />
            </div>
            <div className="col-span-12 sm:col-span-4">
              <input type="text" placeholder="Brand Name" value={manualEntry.brandName} onChange={e => setManualEntry(prev => ({ ...prev, brandName: e.target.value }))} className="w-full border border-border rounded-md px-2 py-1.5 focus:outline-none focus:border-primary" />
            </div>
            <div className="col-span-6 sm:col-span-2">
              <input type="text" placeholder="Strength" value={manualEntry.strength} onChange={e => setManualEntry(prev => ({ ...prev, strength: e.target.value }))} className="w-full border border-border rounded-md px-2 py-1.5 focus:outline-none focus:border-primary" />
            </div>
            <div className="col-span-6 sm:col-span-2">
              <select value={manualEntry.form} onChange={e => setManualEntry(prev => ({ ...prev, form: e.target.value }))} className="w-full border border-border rounded-md px-2 py-1.5 focus:outline-none focus:border-primary bg-surface">
                {DOSAGE_FORMS.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
            
            <div className="col-span-6 sm:col-span-3">
              <select value={manualEntry.route} onChange={e => setManualEntry(prev => ({ ...prev, route: e.target.value }))} className="w-full border border-border rounded-md px-2 py-1.5 focus:outline-none focus:border-primary bg-surface">
                {ROUTES.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div className="col-span-6 sm:col-span-3">
              <div className="relative group">
                <input type="text" placeholder="Dosage (e.g. 1+0+1)" value={manualEntry.dosage} onChange={e => setManualEntry(prev => ({ ...prev, dosage: e.target.value }))} className="w-full border border-border rounded-md px-2 py-1.5 focus:outline-none focus:border-primary" />
                <div className="absolute hidden group-hover:flex top-full left-0 mt-1 bg-surface border border-border rounded-md shadow-lg p-1 gap-1 z-10 w-max">
                  {['1+0+1', '1+1+1', '1+0+0', '0+0+1', 'SOS'].map(d => (
                    <button key={d} onClick={() => setManualEntry(prev => ({ ...prev, dosage: d }))} className="text-xs px-2 py-1 hover:bg-canvas rounded">{d}</button>
                  ))}
                </div>
              </div>
            </div>
            <div className="col-span-6 sm:col-span-3">
              <select value={manualEntry.frequency} onChange={e => setManualEntry(prev => ({ ...prev, frequency: e.target.value }))} className="w-full border border-border rounded-md px-2 py-1.5 focus:outline-none focus:border-primary bg-surface">
                {FREQUENCIES.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
            <div className="col-span-6 sm:col-span-3">
              <input type="text" placeholder="Duration" value={manualEntry.duration} onChange={e => setManualEntry(prev => ({ ...prev, duration: e.target.value }))} className="w-full border border-border rounded-md px-2 py-1.5 focus:outline-none focus:border-primary" />
            </div>

            <div className="col-span-12">
              <input type="text" placeholder="Instructions (Optional)" value={manualEntry.instructions} onChange={e => setManualEntry(prev => ({ ...prev, instructions: e.target.value }))} className="w-full border border-border rounded-md px-2 py-1.5 focus:outline-none focus:border-primary" />
            </div>

            <div className="col-span-12">
              <button 
                onClick={handleManualAdd}
                disabled={!manualEntry.genericName && !manualEntry.brandName}
                className="w-full flex items-center justify-center gap-2 py-2 bg-primary text-white rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Plus className="w-4 h-4" /> Add to Prescription
              </button>
            </div>
          </div>
        </div>

        {/* ADVICE & LABS */}
        <div className="card p-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Advice & Instructions</h3>
              <textarea 
                value={prescription.advice} 
                onChange={e => setAdvice(e.target.value)}
                placeholder="Patient lifestyle advice, precautions..."
                className="w-full border border-border rounded-md p-2 text-sm min-h-[80px] focus:outline-none focus:border-primary resize-none"
              />
            </div>
            <div className="space-y-3">
              <div>
                <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Investigations</h3>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {prescription.labs.map(lab => (
                    <span key={lab} className="badge bg-canvas border border-border flex items-center gap-1">
                      {lab} <X className="w-3 h-3 cursor-pointer hover:text-danger" onClick={() => removeLab(lab)} />
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={newLab} 
                    onChange={e => setNewLab(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter' && newLab) { addLab(newLab); setNewLab(''); } }}
                    placeholder="Add lab..." 
                    className="flex-1 border border-border rounded-md px-2 py-1.5 text-sm focus:outline-none focus:border-primary"
                  />
                  <button onClick={() => { if (newLab) { addLab(newLab); setNewLab(''); } }} className="bg-canvas border border-border p-1.5 rounded-md hover:bg-border text-text-primary">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div>
                <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2 flex items-center gap-1"><Clock className="w-3 h-3" /> Follow-up</h3>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  <button
                    type="button"
                    onClick={() => {
                      const d = new Date();
                      d.setDate(d.getDate() + 3);
                      setFollowUpDate(d.toISOString().split('T')[0]);
                    }}
                    className="px-2 py-0.5 text-[11px] font-semibold rounded bg-canvas hover:bg-border border border-border text-text-secondary"
                  >
                    3 Days
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const d = new Date();
                      d.setDate(d.getDate() + 7);
                      setFollowUpDate(d.toISOString().split('T')[0]);
                    }}
                    className="px-2 py-0.5 text-[11px] font-semibold rounded bg-canvas hover:bg-border border border-border text-text-secondary"
                  >
                    1 Week
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const d = new Date();
                      d.setDate(d.getDate() + 14);
                      setFollowUpDate(d.toISOString().split('T')[0]);
                    }}
                    className="px-2 py-0.5 text-[11px] font-semibold rounded bg-canvas hover:bg-border border border-border text-text-secondary"
                  >
                    2 Weeks
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const d = new Date();
                      d.setDate(d.getDate() + 30);
                      setFollowUpDate(d.toISOString().split('T')[0]);
                    }}
                    className="px-2 py-0.5 text-[11px] font-semibold rounded bg-canvas hover:bg-border border border-border text-text-secondary"
                  >
                    1 Month
                  </button>
                </div>
                <input 
                  type="date" 
                  value={prescription.followUpDate} 
                  onChange={e => setFollowUpDate(e.target.value)}
                  className="w-full border border-border rounded-md px-2 py-1.5 text-sm focus:outline-none focus:border-primary bg-surface"
                />
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* ============ PRINT PREVIEW MODAL ============ */}
      {showPrintModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm print:hidden">
          <div className="max-w-3xl w-full bg-surface border border-border rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
            
            {/* Modal Header */}
            <div className="p-4 border-b border-border flex items-center justify-between bg-canvas">
              <div className="flex items-center gap-2">
                <Printer className="w-5 h-5 text-primary" />
                <h3 className="font-bold text-text-primary text-base">Hassan and Co. Official Bilingual Prescription Slip</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                  {prescriptionLanguage === 'urdu' ? 'آفیشل اردو نسخہ (Urdu Slip)' : 'Official English Prescription'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-lg bg-primary hover:bg-primary/90 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-primary/20 transition-all"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print to Paper / PDF</span>
                </button>
                <button
                  onClick={() => setShowPrintModal(false)}
                  className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-border transition-colors text-sm font-bold"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Modal Body: Render exact slip representation on screen */}
            <div className="flex-1 overflow-y-auto p-6 bg-slate-100 text-black font-sans">
              <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow border border-slate-300 space-y-6">
                
                {/* Letterhead */}
                <div className="border-b-2 border-slate-900 pb-4 flex justify-between items-start">
                  <div>
                    <div className="text-[10px] uppercase tracking-widest font-extrabold text-teal-800 mb-0.5">
                      Hassan and Co. Healthcare Systems
                    </div>
                    <h2 className="text-xl font-bold font-serif text-black">{doctorProfile.name}</h2>
                    <p className="text-xs font-semibold text-slate-700">{doctorProfile.credentials}</p>
                    <p className="text-xs text-slate-600">{doctorProfile.specialty}</p>
                    <p className="text-[11px] text-slate-600 mt-1 font-mono">PMDC: {doctorProfile.registrationNo}</p>
                  </div>
                  <div className="text-right text-xs">
                    <p className="font-bold text-slate-900">{doctorProfile.clinicName || 'Hassan and Co. Hospital'}</p>
                    <p className="text-slate-600">{doctorProfile.clinicAddress || 'Main Healthcare Blvd, Lahore'}</p>
                    <p className="text-slate-600 font-mono mt-0.5">{doctorProfile.phone || '+92 42 3578 9000'}</p>
                  </div>
                </div>

                {/* Patient Demographics */}
                <div className="flex flex-wrap gap-4 border-b border-slate-200 pb-3 text-xs">
                  <div><span className="text-slate-500">Patient:</span> <strong className="text-black">{patient.name || 'Walk-in'}</strong></div>
                  <div><span className="text-slate-500">Age/Sex:</span> {patient.age || '--'} / {patient.gender || '--'}</div>
                  <div><span className="text-slate-500">MRN:</span> {patient.mrn || 'OPD-AUTO'}</div>
                  <div><span className="text-slate-500">Date:</span> {format(new Date(), 'dd MMM yyyy')}</div>
                  {patient.bp && <div><span className="text-slate-500">BP:</span> {patient.bp} mmHg</div>}
                  {patient.temperature && <div><span className="text-slate-500">Temp:</span> {patient.temperature} °C</div>}
                  {patient.weight && <div><span className="text-slate-500">Weight:</span> {patient.weight} kg</div>}
                </div>

                {/* Diagnosis */}
                {prescription.diagnosis.length > 0 && (
                  <div className="bg-slate-50 p-2.5 rounded border border-slate-200 text-xs">
                    <span className="font-bold text-slate-700 uppercase">Diagnosis / تشخیص: </span>
                    <strong className="text-black">{prescription.diagnosis.join(', ')}</strong>
                  </div>
                )}

                {/* Rx Symbol */}
                <div className="text-3xl font-serif font-bold italic text-slate-900">℞</div>

                {/* Medications Table (Fully translated in Urdu mode) */}
                <table className="w-full text-left text-xs border-collapse" dir={prescriptionLanguage === 'urdu' ? 'rtl' : 'ltr'}>
                  <thead>
                    <tr className="border-b-2 border-slate-900 font-bold uppercase text-slate-800">
                      <th className="py-2 pr-2 w-6">#</th>
                      <th className="py-2 px-2">{prescriptionLanguage === 'urdu' ? 'دوا کا نام و طاقت' : 'Medicine & Strength'}</th>
                      <th className="py-2 px-2">{prescriptionLanguage === 'urdu' ? 'مقدار و اوقات' : 'Dosage & Frequency'}</th>
                      <th className="py-2 px-2">{prescriptionLanguage === 'urdu' ? 'طریقہ استعمال و ضروری ہدایات' : 'Instructions'}</th>
                      <th className="py-2 px-2">{prescriptionLanguage === 'urdu' ? 'مدت' : 'Duration'}</th>
                      <th className="py-2 pl-2 text-right">{prescriptionLanguage === 'urdu' ? 'قیمت' : 'Est. Price'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {prescription.items.map((item, idx) => {
                      const itemPrice = getItemPrice(item);
                      return (
                        <tr key={item.id || idx}>
                          <td className="py-2.5 pr-2 font-bold text-slate-500">{idx + 1}</td>
                          <td className="py-2.5 px-2">
                            <div className="font-bold text-black">{item.brandName || item.genericName}</div>
                            <div className="text-[10px] text-teal-800 font-semibold">
                              {item.strength} • {prescriptionLanguage === 'urdu' ? (URDU_FORM_MAP[item.form] || item.form) : item.form}
                            </div>
                          </td>
                          <td className="py-2.5 px-2">
                            <span className="font-bold text-black">
                              {prescriptionLanguage === 'urdu' ? translateDosageToUrdu(item.dosage, item.form) : item.dosage}
                            </span>
                            <div className="text-[10px] text-slate-600">
                              {prescriptionLanguage === 'urdu' ? (URDU_FREQUENCY_MAP[item.frequency]?.ur || item.frequency) : `${item.frequency} • ${item.route}`}
                            </div>
                          </td>
                          <td className="py-2.5 px-2 font-medium text-emerald-950">
                            {prescriptionLanguage === 'urdu' 
                              ? translateInstructionsToUrdu(item.instructions, item.frequency)
                              : (item.instructions || 'As directed')}
                          </td>
                          <td className="py-2.5 px-2 text-slate-800 font-medium">
                            {prescriptionLanguage === 'urdu' ? translateDurationToUrdu(item.duration) : item.duration}
                          </td>
                          <td className="py-2.5 pl-2 text-right font-semibold text-slate-800">
                            {itemPrice ? `₨ ${itemPrice}` : '—'}
                          </td>
                        </tr>
                      );
                    })}
                    {prescription.items.length === 0 && (
                      <tr>
                        <td colSpan={6} className="py-4 text-center text-slate-400 italic">
                          {prescriptionLanguage === 'urdu' ? 'کوئی دوا درج نہیں کی گئی۔' : 'No medications recorded.'}
                        </td>
                      </tr>
                    )}
                  </tbody>
                  {totalEstimatedPrice > 0 && (
                    <tfoot>
                      <tr className="border-t-2 border-slate-900 text-xs font-bold">
                        <td colSpan={5} className="py-2 text-right text-slate-700 uppercase">
                          {prescriptionLanguage === 'urdu' ? 'کل متوقع میڈیکل اسٹور بل:' : 'Estimated Total Pharmacy Cost:'}
                        </td>
                        <td className="py-2 pl-2 text-right text-emerald-700 text-sm font-bold">
                          ₨ {totalEstimatedPrice.toLocaleString()}
                        </td>
                      </tr>
                    </tfoot>
                  )}
                </table>

                {/* Advice & Labs */}
                <div className="grid grid-cols-2 gap-4 border-t border-slate-200 pt-3 text-xs">
                  <div>
                    <h5 className="font-bold text-slate-700 uppercase mb-1">Diet & Lifestyle Advice / پرہیز و ہدایات:</h5>
                    <p className="text-slate-800 whitespace-pre-line leading-relaxed">
                      {prescription.advice || 'Standard balanced diet, hydration, and rest.'}
                    </p>
                    <p className="text-emerald-900 mt-1 font-medium text-[11px]" dir="rtl">
                      مناسب آرام، پانی کا کثرت سے استعمال اور غذائی پرہیز کا خاص خیال رکھیں۔
                    </p>
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-700 uppercase mb-1">Investigations / ٹیسٹ:</h5>
                    {prescription.labs.length > 0 ? (
                      <ul className="list-disc list-inside text-slate-700 space-y-0.5">
                        {prescription.labs.map((l, i) => <li key={i}>{l}</li>)}
                      </ul>
                    ) : (
                      <p className="text-slate-400 italic">None ordered.</p>
                    )}
                  </div>
                </div>

                {/* Footer Signature */}
                <div className="border-t border-slate-200 pt-4 flex justify-between items-end text-xs">
                  <div>
                    <div className="text-slate-700 font-semibold">
                      {prescription.followUpDate ? (
                        <span>Follow-up Date / اگلی تاریخ: {format(new Date(prescription.followUpDate), 'dd MMM yyyy')}</span>
                      ) : (
                        'Review as needed / ضرورت پڑنے پر رابطہ کریں۔'
                      )}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1 font-mono">
                      Hassan and Co. EMR • Valid Electronic Prescription Slip
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="w-44 border-b-2 border-slate-900 mb-1"></div>
                    <span className="font-bold text-black text-[11px]">Doctor Signature &amp; Stamp</span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      )}

      {/* ============ PRINT TEMPLATE (Activated in Print Mode & PDF Export) ============ */}
      <div className="print-prescription-slip p-8 bg-white text-black min-h-screen font-sans">
        
        {/* Hospital & Doctor Letterhead */}
        <div className="border-b-2 border-slate-900 pb-4 mb-6 flex justify-between items-start">
          <div>
            <div className="text-xs uppercase tracking-widest font-extrabold text-teal-800 mb-1">
              Hassan and Co. Healthcare Systems
            </div>
            <h1 className="text-2xl font-bold text-black font-serif">{doctorProfile.name}</h1>
            <p className="text-xs font-semibold text-slate-700">{doctorProfile.credentials}</p>
            <p className="text-xs text-slate-600">{doctorProfile.specialty}</p>
            <p className="text-xs text-slate-600 mt-1 font-mono">License / PMDC Reg: {doctorProfile.registrationNo}</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold text-slate-900">{doctorProfile.clinicName || 'Hassan and Co. Hospital'}</p>
            <p className="text-xs text-slate-600 whitespace-pre-line">{doctorProfile.clinicAddress || 'Main Healthcare Blvd, Lahore'}</p>
            <p className="text-xs text-slate-600 font-mono mt-1">UAN: {doctorProfile.phone || '+92 42 3578 9000'}</p>
          </div>
        </div>

        {/* Patient Demographics & Vitals */}
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 mb-6 border-b border-slate-300 pb-4 text-xs">
          <div><span className="font-bold text-slate-700">Patient Name:</span> <span className="font-bold text-sm text-black">{patient.name || 'Walk-in Patient'}</span></div>
          <div><span className="font-bold text-slate-700">Age / Sex:</span> {patient.age || '--'} / {patient.gender || '--'}</div>
          <div><span className="font-bold text-slate-700">MRN:</span> {patient.mrn || 'OPD-' + Date.now().toString().slice(-6)}</div>
          <div><span className="font-bold text-slate-700">Date:</span> {format(new Date(), 'dd MMM, yyyy')}</div>
          {patient.weight && <div><span className="font-bold text-slate-700">Weight:</span> {patient.weight} kg</div>}
          {patient.bp && <div><span className="font-bold text-slate-700">BP:</span> {patient.bp} mmHg</div>}
          {patient.temperature && <div><span className="font-bold text-slate-700">Temp:</span> {patient.temperature} °C</div>}
        </div>

        {/* Diagnoses */}
        {prescription.diagnosis.length > 0 && (
          <div className="mb-5 bg-slate-50 p-3 rounded border border-slate-200">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700 mb-1">Clinical Assessment / Diagnosis (تشخیص):</h4>
            <p className="text-sm font-semibold text-slate-900">{prescription.diagnosis.join(' • ')}</p>
          </div>
        )}

        {/* Rx Symbol */}
        <div className="text-4xl font-serif font-bold italic text-slate-900 mb-3">℞</div>

        {/* Medications Table (Fully translated in Urdu mode when printing) */}
        <div className="mb-6">
          <table className="w-full text-left border-collapse" dir={prescriptionLanguage === 'urdu' ? 'rtl' : 'ltr'}>
            <thead>
              <tr className="border-b-2 border-slate-900 text-xs font-bold uppercase text-slate-800">
                <th className="py-2 pr-2 w-8">#</th>
                <th className="py-2 px-2">{prescriptionLanguage === 'urdu' ? 'دوا کا نام و طاقت' : 'Medication & Strength'}</th>
                <th className="py-2 px-2">{prescriptionLanguage === 'urdu' ? 'مقدار و اوقات' : 'Dosage & Timing'}</th>
                <th className="py-2 px-2">{prescriptionLanguage === 'urdu' ? 'طریقہ استعمال و ضروری ہدایات' : 'Instructions'}</th>
                <th className="py-2 px-2">{prescriptionLanguage === 'urdu' ? 'مدت استعمال' : 'Duration'}</th>
                <th className="py-2 pl-2 text-right">{prescriptionLanguage === 'urdu' ? 'قیمت' : 'Est. Price'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-xs">
              {prescription.items.map((item, idx) => {
                const itemPrice = getItemPrice(item);
                return (
                  <tr key={item.id || idx} className="align-top">
                    <td className="py-2.5 pr-2 font-bold text-slate-600">{idx + 1}</td>
                    <td className="py-2.5 px-2">
                      <div className="font-bold text-sm text-black">{item.brandName || item.genericName}</div>
                      {item.brandName && <div className="text-[10px] text-slate-500">{item.genericName}</div>}
                      <div className="text-[11px] font-semibold text-teal-900">
                        {item.strength} • {prescriptionLanguage === 'urdu' ? (URDU_FORM_MAP[item.form] || item.form) : item.form}
                      </div>
                    </td>
                    <td className="py-2.5 px-2 whitespace-nowrap">
                      <span className="font-bold text-black">
                        {prescriptionLanguage === 'urdu' ? translateDosageToUrdu(item.dosage, item.form) : item.dosage}
                      </span>
                      <div className="text-[11px] text-slate-600">
                        {prescriptionLanguage === 'urdu' ? (URDU_FREQUENCY_MAP[item.frequency]?.ur || item.frequency) : `${item.frequency} • ${item.route}`}
                      </div>
                    </td>
                    <td className="py-2.5 px-2 font-medium text-emerald-950">
                      {prescriptionLanguage === 'urdu'
                        ? translateInstructionsToUrdu(item.instructions, item.frequency)
                        : (item.instructions || 'As directed')}
                    </td>
                    <td className="py-2.5 px-2 font-medium text-slate-800">
                      {prescriptionLanguage === 'urdu' ? translateDurationToUrdu(item.duration) : item.duration}
                    </td>
                    <td className="py-2.5 pl-2 text-right font-semibold text-slate-800">
                      {itemPrice ? `₨ ${itemPrice}` : '—'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            {totalEstimatedPrice > 0 && (
              <tfoot>
                <tr className="border-t-2 border-slate-900 text-xs font-bold">
                  <td colSpan={5} className="py-2.5 text-right text-slate-700 uppercase">
                    {prescriptionLanguage === 'urdu' ? 'کل متوقع میڈیکل اسٹور بل:' : 'Estimated Total Pharmacy Bill:'}
                  </td>
                  <td className="py-2.5 pl-2 text-right text-emerald-700 text-sm font-bold">
                    ₨ {totalEstimatedPrice.toLocaleString()}
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
          {prescription.items.length === 0 && (
            <div className="py-6 text-center text-slate-400 italic text-xs border-b border-slate-200">
              No medications recorded on this prescription slip.
            </div>
          )}
        </div>

        {/* Advice & Labs */}
        <div className="grid grid-cols-2 gap-6 mb-6 border-t border-slate-300 pt-4 text-xs" dir={prescriptionLanguage === 'urdu' ? 'rtl' : 'ltr'}>
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-800 mb-1.5">
              {prescriptionLanguage === 'urdu' ? 'پرہیز و ضروری ہدایات (Diet & Advice):' : 'Diet & Lifestyle Advice:'}
            </h4>
            <p className="text-slate-900 whitespace-pre-line leading-relaxed font-medium">
              {prescriptionLanguage === 'urdu' ? translateAdviceToUrdu(prescription.advice) : (prescription.advice || 'Standard balanced diet, adequate hydration, and rest.')}
            </p>
          </div>
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700 mb-1.5">Diagnostic Labs / Investigations:</h4>
            {prescription.labs.length > 0 ? (
              <ul className="list-disc list-inside text-slate-800 space-y-0.5">
                {prescription.labs.map((lab, i) => <li key={i}>{lab}</li>)}
              </ul>
            ) : (
              <p className="text-slate-500 italic">None ordered.</p>
            )}
          </div>
        </div>

        {/* Follow up & Signatures */}
        <div className="mt-12 pt-4 border-t border-slate-200 flex justify-between items-end text-xs">
          <div>
            {prescription.followUpDate ? (
              <div>
                <span className="font-bold text-slate-700">Follow-up Appointment / اگلی تاریخ:</span>{' '}
                <span className="font-bold text-sm text-teal-800">{format(new Date(prescription.followUpDate), 'dd MMMM, yyyy')}</span>
              </div>
            ) : (
              <div className="text-slate-500 italic">Review as needed or if symptoms persist / ضرورت پڑنے پر رجوع کریں۔</div>
            )}
            <div className="text-[10px] text-slate-400 mt-3 font-mono">
              Hassan and Co. EMR • Valid Electronic Prescription Slip
            </div>
          </div>
          
          <div className="text-center">
            <div className="w-52 border-b-2 border-slate-900 mb-2"></div>
            <p className="font-bold text-xs text-black">Physician Signature &amp; Stamp</p>
            <p className="text-[11px] text-slate-600 mt-0.5">{doctorProfile.name}</p>
          </div>
        </div>

      </div>

    </div>
  );
};
