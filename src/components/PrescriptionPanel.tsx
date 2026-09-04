import React, { useState, useMemo } from 'react';
import { useAppStore } from '../store/useAppStore';
import { QUICK_FAVORITES, DOSAGE_FORMS, ROUTES, FREQUENCIES } from '../data/medications';
import type { PrescriptionItem, Allergy } from '../types';
import { format } from 'date-fns';
import {
  Edit2, Save, Printer, Trash2, Plus, AlertTriangle, ShieldAlert,
  ChevronDown, ChevronUp, Pill, Star, X, Calculator, Info,
  FileText, Clock, CheckCircle2, OctagonAlert
} from 'lucide-react';

export const PrescriptionPanel = () => {
  const {
    patient,
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
    resetPrescription
  } = useAppStore();

  const [showDoseCalc, setShowDoseCalc] = useState(false);
  const [doseMgPerKg, setDoseMgPerKg] = useState('');
  const [dosesPerDay, setDosesPerDay] = useState('');
  
  const [showFavorites, setShowFavorites] = useState(false);
  
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

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="h-full flex flex-col overflow-hidden bg-canvas">
      {/* HEADER */}
      <div className="flex items-center justify-between p-3 border-b border-border bg-surface print:hidden">
        <div className="flex items-center gap-2">
          <Edit2 className="w-5 h-5 text-primary" />
          <h2 className="font-semibold text-text-primary">Live Rx Pad</h2>
        </div>
        <div className="flex gap-2">
          <button onClick={saveCurrentCase} className="flex items-center gap-1 px-3 py-1.5 text-sm bg-primary text-white rounded-md hover:bg-primary/90 transition-colors">
            <Save className="w-4 h-4" /> Save Case
          </button>
          <button onClick={handlePrint} className="flex items-center gap-1 px-3 py-1.5 text-sm bg-surface border border-border text-text-primary rounded-md hover:bg-canvas transition-colors">
            <Printer className="w-4 h-4" /> Print Rx
          </button>
          <button onClick={resetPrescription} className="flex items-center gap-1 px-3 py-1.5 text-sm bg-surface border border-danger text-danger rounded-md hover:bg-danger-bg transition-colors">
            <Trash2 className="w-4 h-4" /> Clear Rx
          </button>
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

                      {(item.instructions || item.indication) && (
                        <div className="mt-2 text-xs text-text-muted flex flex-wrap gap-3">
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

      {/* PRINT TEMPLATE (Hidden from screen) */}
      <div className="hidden print:block p-8 bg-white text-black min-h-screen">
        
        {/* Letterhead */}
        <div className="border-b-2 border-black pb-4 mb-6 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-black font-serif">{doctorProfile.name}</h1>
            <p className="text-sm font-semibold">{doctorProfile.credentials}</p>
            <p className="text-sm text-gray-700">{doctorProfile.specialty}</p>
            <p className="text-sm text-gray-700 mt-1">Reg No: {doctorProfile.registrationNo}</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium">{doctorProfile.clinicName}</p>
            <p className="text-sm text-gray-700 whitespace-pre-line">{doctorProfile.clinicAddress}</p>
            <p className="text-sm text-gray-700">Phone: {doctorProfile.phone || '________________'}</p>
          </div>
        </div>

        {/* Demographics */}
        <div className="flex flex-wrap gap-x-8 gap-y-2 mb-6 border-b border-gray-300 pb-4 text-sm">
          <p><span className="font-semibold">Patient Name:</span> {patient.name}</p>
          <p><span className="font-semibold">Age/Sex:</span> {patient.age} / {patient.gender}</p>
          <p><span className="font-semibold">Date:</span> {format(new Date(), 'dd MMM, yyyy')}</p>
          {patient.weight && <p><span className="font-semibold">Weight:</span> {patient.weight}</p>}
          {patient.bp && <p><span className="font-semibold">BP:</span> {patient.bp}</p>}
        </div>

        {/* Diagnoses */}
        {prescription.diagnosis.length > 0 && (
          <div className="mb-6">
            <h4 className="font-bold text-sm mb-1 underline">Diagnosis:</h4>
            <p className="text-sm">{prescription.diagnosis.join(', ')}</p>
          </div>
        )}

        {/* Rx Symbol */}
        <div className="text-5xl font-serif font-bold italic mb-6">Rx</div>

        {/* Meds */}
        <div className="space-y-6 mb-8 pl-4">
          {prescription.items.map((item, idx) => (
            <div key={item.id} className="flex gap-3">
              <span className="font-bold">{idx + 1}.</span>
              <div className="flex-1">
                <p className="font-bold text-base">
                  {item.brandName || item.genericName} <span className="font-normal text-sm ml-2">({item.strength}) - {item.form}</span>
                </p>
                {item.brandName && <p className="text-sm text-gray-600 mb-1">{item.genericName}</p>}
                
                <p className="text-sm font-medium mt-1">
                  Dosage: {item.dosage} | {item.frequency} | {item.route} | For {item.duration}
                </p>
                {item.instructions && <p className="text-sm italic mt-1">{item.instructions}</p>}
              </div>
            </div>
          ))}
        </div>

        {/* Advice & Labs */}
        <div className="grid grid-cols-2 gap-8 mb-8 mt-12 border-t border-gray-300 pt-6">
          {prescription.advice && (
            <div>
              <h4 className="font-bold text-sm mb-2 underline">Advice:</h4>
              <p className="text-sm whitespace-pre-line">{prescription.advice}</p>
            </div>
          )}
          {prescription.labs.length > 0 && (
            <div>
              <h4 className="font-bold text-sm mb-2 underline">Investigations:</h4>
              <ul className="list-disc list-inside text-sm">
                {prescription.labs.map(lab => <li key={lab}>{lab}</li>)}
              </ul>
            </div>
          )}
        </div>

        {/* Follow up & Sign */}
        <div className="mt-16 flex justify-between items-end">
          {prescription.followUpDate && (
            <div className="text-sm">
              <span className="font-bold">Follow-up:</span> {format(new Date(prescription.followUpDate), 'dd MMM, yyyy')}
            </div>
          )}
          <div className="text-center ml-auto">
            <div className="w-48 border-b border-black mb-2"></div>
            <p className="font-bold text-sm">Signature</p>
            <p className="text-sm mt-1">{doctorProfile.name}</p>
          </div>
        </div>

      </div>

    </div>
  );
};
