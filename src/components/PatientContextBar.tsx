import React, { useState, useMemo, useCallback } from 'react';
import { useAppStore } from '../store/useAppStore';
import type { Patient, Allergy, AllergySeverity, BloodGroup, PregnancyStatus, CodeStatus } from '../types';
import { 
  User, Heart, Activity, Thermometer, Wind, AlertTriangle, 
  ChevronDown, ChevronUp, X, Plus, Shield, ShieldAlert, AlertCircle
} from 'lucide-react';

const COMMON_COMORBIDITIES = ['HTN', 'DM-2', 'DM-1', 'IHD', 'CKD', 'COPD', 'Asthma', 'Hypothyroid', 'Hyperlipidemia', 'Hepatitis B', 'Hepatitis C'];
const HIGH_RISK_FLAGS = ['Fall Risk', 'Renal Impairment', 'Hepatic Impairment', 'Infection Isolation', 'Neutropenic Precautions'];

export const PatientContextBar = () => {
  const patient = useAppStore((state) => state.patient);
  const setPatientField = useAppStore((state) => state.setPatientField);
  const setPatientAllergies = useAppStore((state) => state.setPatientAllergies);

  const [isExpanded, setIsExpanded] = useState(false);
  const [newAllergyName, setNewAllergyName] = useState('');
  const [newAllergySeverity, setNewAllergySeverity] = useState<AllergySeverity>('Mild');
  const [newComorbidity, setNewComorbidity] = useState('');

  const initials = useMemo(() => {
    if (!patient?.name) return 'NP';
    return patient.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  }, [patient?.name]);

  const bmiData = useMemo(() => {
    if (!patient?.weight || !patient?.height) return null;
    const w = parseFloat(patient.weight);
    const h = parseFloat(patient.height) / 100;
    if (isNaN(w) || isNaN(h) || h === 0) return null;
    const bmi = w / (h * h);
    let classification = '';
    let colorClass = '';
    if (bmi < 18.5) { classification = 'Underweight'; colorClass = 'text-warning-text'; }
    else if (bmi < 25) { classification = 'Normal'; colorClass = 'text-success-text'; }
    else if (bmi < 30) { classification = 'Overweight'; colorClass = 'text-warning-text'; }
    else { classification = 'Obese'; colorClass = 'text-danger-text'; }
    return { value: bmi.toFixed(1), classification, colorClass };
  }, [patient?.weight, patient?.height]);

  const news2Score = useMemo(() => {
    if (!patient) return 0;
    const rr = parseFloat(patient.respiratoryRate);
    const spo2 = parseFloat(patient.spo2);
    const [sysStr] = (patient.bp || '').split('/');
    const sbp = parseFloat(sysStr);
    const hr = parseFloat(patient.pulse);
    const temp = parseFloat(patient.temperature);

    let score = 0;
    if (!isNaN(rr)) {
      if (rr <= 8 || rr >= 25) score += 3;
      else if (rr >= 21 && rr <= 24) score += 2;
      else if (rr >= 9 && rr <= 11) score += 1;
    }
    if (!isNaN(spo2)) {
      if (spo2 <= 91) score += 3;
      else if (spo2 === 92 || spo2 === 93) score += 2;
      else if (spo2 === 94 || spo2 === 95) score += 1;
    }
    if (!isNaN(sbp)) {
      if (sbp <= 90 || sbp >= 220) score += 3;
      else if (sbp >= 91 && sbp <= 100) score += 2;
      else if (sbp >= 101 && sbp <= 110) score += 1;
    }
    if (!isNaN(hr)) {
      if (hr <= 40 || hr >= 131) score += 3;
      else if ((hr >= 41 && hr <= 50) || (hr >= 111 && hr <= 130)) score += 2;
      else if (hr >= 91 && hr <= 110) score += 1;
    }
    if (!isNaN(temp)) {
      if (temp <= 35.0) score += 3;
      else if ((temp >= 35.1 && temp <= 36.0) || temp >= 39.1) score += 2;
      else if (temp >= 38.1 && temp <= 39.0) score += 1;
    }
    return score;
  }, [patient]);

  const news2Color = news2Score >= 5 ? 'bg-danger text-white' : news2Score >= 3 ? 'bg-warning text-white' : 'bg-success text-white';

  const bpStatus = useMemo(() => {
    if (!patient?.bp) return 'neutral';
    const [sys, dia] = patient.bp.split('/').map(Number);
    if (!isNaN(sys) && !isNaN(dia)) {
      return (sys > 140 || dia > 90) ? 'danger' : 'success';
    }
    return 'neutral';
  }, [patient?.bp]);

  const hrStatus = useMemo(() => {
    if (!patient?.pulse) return 'neutral';
    const hr = parseFloat(patient.pulse);
    if (!isNaN(hr)) {
      return (hr < 60 || hr > 100) ? 'danger' : 'success';
    }
    return 'neutral';
  }, [patient?.pulse]);

  const spo2Status = useMemo(() => {
    if (!patient?.spo2) return 'neutral';
    const spo2 = parseFloat(patient.spo2);
    if (!isNaN(spo2)) {
      if (spo2 < 94) return 'danger';
      if (spo2 <= 96) return 'warning';
      return 'success';
    }
    return 'neutral';
  }, [patient?.spo2]);

  const tempStatus = useMemo(() => {
    if (!patient?.temperature) return 'neutral';
    const temp = parseFloat(patient.temperature);
    if (!isNaN(temp)) {
      if (temp > 38.5) return 'danger';
      if (temp >= 37.5) return 'warning';
      return 'success';
    }
    return 'neutral';
  }, [patient?.temperature]);

  const handleAddAllergy = () => {
    if (!newAllergyName.trim() || !patient) return;
    const newAllergy: Allergy = { name: newAllergyName.trim(), severity: newAllergySeverity };
    setPatientAllergies([...(patient.allergies || []), newAllergy]);
    setNewAllergyName('');
    setNewAllergySeverity('Mild');
  };

  const handleRemoveAllergy = (index: number) => {
    if (!patient) return;
    const updated = [...(patient.allergies || [])];
    updated.splice(index, 1);
    setPatientAllergies(updated);
  };

  const handleAddComorbidity = (name: string) => {
    if (!name.trim() || !patient) return;
    const current = patient.comorbidities || [];
    if (!current.includes(name.trim())) {
      setPatientField('comorbidities', [...current, name.trim()]);
    }
    setNewComorbidity('');
  };

  const handleRemoveComorbidity = (name: string) => {
    if (!patient) return;
    setPatientField('comorbidities', (patient.comorbidities || []).filter(c => c !== name));
  };

  const handleToggleHighRisk = (flag: string) => {
    if (!patient) return;
    const current = patient.highRiskFlags || [];
    if (current.includes(flag)) {
      setPatientField('highRiskFlags', current.filter(f => f !== flag));
    } else {
      setPatientField('highRiskFlags', [...current, flag]);
    }
  };

  if (!patient) return null;

  return (
    <>
      {/* Sticky Collapsed Bar */}
      <div className="sticky top-0 z-40 bg-[#0F172A] text-white flex items-center px-4 py-2 shadow-md h-12 text-sm justify-between transition-colors">
        <div className="flex items-center space-x-4 overflow-x-auto no-scrollbar whitespace-nowrap">
          {/* Demographics */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center font-bold text-xs shrink-0">
              {initials}
            </div>
            <span className="font-bold">{patient.name || 'New Patient'}</span>
            <span className="text-gray-400 text-xs bg-gray-800 px-1.5 py-0.5 rounded">MRN: {patient.mrn || 'N/A'}</span>
          </div>

          <div className="text-gray-400">|</div>

          <div className="flex items-center space-x-2 text-xs">
            <span>{patient.age || '--'}y {patient.gender?.[0] || '-'}</span>
            {bmiData && (
              <span className={`clinical-num ${bmiData.colorClass}`} title={`BMI: ${bmiData.classification}`}>
                BMI {bmiData.value}
              </span>
            )}
          </div>

          <div className="text-gray-400">|</div>

          {/* Vitals */}
          <div className="flex items-center space-x-3">
            <span className="flex items-center space-x-1" title="Blood Pressure">
              <Heart size={14} className={bpStatus === 'danger' ? 'text-red-500' : bpStatus === 'success' ? 'text-green-500' : 'text-gray-400'} />
              <span className="clinical-num">{patient.bp || '--/--'}</span>
            </span>
            <span className="flex items-center space-x-1" title="Heart Rate">
              <Activity size={14} className={hrStatus === 'danger' ? 'text-red-500' : hrStatus === 'success' ? 'text-green-500' : 'text-gray-400'} />
              <span className="clinical-num">{patient.pulse || '--'}</span>
            </span>
            <span className="flex items-center space-x-1" title="SpO2">
              <Wind size={14} className={spo2Status === 'danger' ? 'text-red-500' : spo2Status === 'warning' ? 'text-yellow-500' : spo2Status === 'success' ? 'text-green-500' : 'text-gray-400'} />
              <span className="clinical-num">{patient.spo2 ? `${patient.spo2}%` : '--%'}</span>
            </span>
            <span className="flex items-center space-x-1" title="Temperature">
              <Thermometer size={14} className={tempStatus === 'danger' ? 'text-red-500' : tempStatus === 'warning' ? 'text-yellow-500' : tempStatus === 'success' ? 'text-green-500' : 'text-gray-400'} />
              <span className="clinical-num">{patient.temperature ? `${patient.temperature}°C` : '--°C'}</span>
            </span>
          </div>

          <div className="text-gray-400">|</div>

          {/* Allergies */}
          {patient.allergies && patient.allergies.length > 0 ? (
            <div className="flex items-center space-x-1">
              {patient.allergies.map((allergy, i) => (
                <span key={i} className={`flex items-center space-x-1 px-1.5 py-0.5 rounded text-xs ${allergy.severity === 'Anaphylaxis' ? 'bg-red-600 animate-pulse text-white font-bold' : allergy.severity === 'Severe' ? 'bg-red-500 text-white' : 'bg-yellow-600 text-white'}`}>
                  <AlertTriangle size={12} />
                  <span>{allergy.name}</span>
                </span>
              ))}
            </div>
          ) : (
            <span className="text-gray-500 text-xs">No Known Allergies</span>
          )}

          <div className="text-gray-400">|</div>

          {/* Comorbidities */}
          {patient.comorbidities && patient.comorbidities.length > 0 && (
            <div className="flex items-center space-x-1">
              <span className="text-xs text-gray-400">Hx:</span>
              {patient.comorbidities.slice(0, 3).map((c, i) => (
                <span key={i} className="bg-gray-700 px-1.5 py-0.5 rounded text-xs text-gray-300">{c}</span>
              ))}
              {patient.comorbidities.length > 3 && <span className="text-xs text-gray-400">+{patient.comorbidities.length - 3}</span>}
            </div>
          )}

          <div className="text-gray-400">|</div>

          {/* NEWS2 */}
          <div className={`px-2 py-0.5 rounded font-bold text-xs clinical-num ${news2Color}`}>
            NEWS2: {news2Score}
          </div>
        </div>

        {/* Toggle Button */}
        <button 
          onClick={() => setIsExpanded(true)}
          className="flex items-center space-x-1 text-gray-300 hover:text-white ml-4 shrink-0 transition-colors"
        >
          <span>Edit</span>
          <ChevronDown size={16} />
        </button>
      </div>

      {/* Expanded Slide-over Drawer */}
      {isExpanded && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" 
            onClick={() => setIsExpanded(false)}
          />
          
          {/* Drawer */}
          <div className="relative w-[420px] bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right">
            <div className="flex items-center justify-between p-4 border-b border-border bg-gray-50">
              <h2 className="text-lg font-bold text-text-primary flex items-center space-x-2">
                <User className="text-primary" size={20} />
                <span>Patient Context</span>
              </h2>
              <button 
                onClick={() => setIsExpanded(false)}
                className="p-1 hover:bg-gray-200 rounded text-gray-500 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6 text-sm">
              {/* Section 1: Demographics */}
              <section className="space-y-3">
                <h3 className="font-semibold text-text-secondary border-b pb-1">Demographics</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <label className="block text-xs text-text-muted mb-1">Full Name</label>
                    <input 
                      type="text" 
                      className="w-full border border-border rounded px-2 py-1.5 focus:border-primary outline-none"
                      value={patient.name} 
                      onChange={(e) => setPatientField('name', e.target.value)} 
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-text-muted mb-1">MRN</label>
                    <input 
                      type="text" 
                      className="w-full border border-border rounded px-2 py-1.5 focus:border-primary outline-none"
                      value={patient.mrn} 
                      onChange={(e) => setPatientField('mrn', e.target.value)} 
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-text-muted mb-1">Age</label>
                    <input 
                      type="text" 
                      className="w-full border border-border rounded px-2 py-1.5 focus:border-primary outline-none"
                      value={patient.age} 
                      onChange={(e) => setPatientField('age', e.target.value)} 
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-text-muted mb-1">Gender</label>
                    <select 
                      className="w-full border border-border rounded px-2 py-1.5 focus:border-primary outline-none"
                      value={patient.gender} 
                      onChange={(e) => setPatientField('gender', e.target.value as any)}
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                      <option value="Unknown">Unknown</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-text-muted mb-1">Blood Group</label>
                    <select 
                      className="w-full border border-border rounded px-2 py-1.5 focus:border-primary outline-none"
                      value={patient.bloodGroup} 
                      onChange={(e) => setPatientField('bloodGroup', e.target.value as BloodGroup)}
                    >
                      <option value="Unknown">Unknown</option>
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
              </section>

              {/* Section 2: Vitals */}
              <section className="space-y-3">
                <h3 className="font-semibold text-text-secondary border-b pb-1 flex justify-between items-center">
                  <span>Vitals & Biometrics</span>
                  <span className={`text-xs px-2 py-0.5 rounded ${news2Color}`}>NEWS2: {news2Score}</span>
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-text-muted mb-1">BP (mmHg)</label>
                    <input 
                      type="text" 
                      placeholder="120/80"
                      className="w-full border border-border rounded px-2 py-1.5 focus:border-primary outline-none clinical-num"
                      value={patient.bp} 
                      onChange={(e) => setPatientField('bp', e.target.value)} 
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-text-muted mb-1">Pulse (bpm)</label>
                    <input 
                      type="text" 
                      placeholder="bpm"
                      className="w-full border border-border rounded px-2 py-1.5 focus:border-primary outline-none clinical-num"
                      value={patient.pulse} 
                      onChange={(e) => setPatientField('pulse', e.target.value)} 
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-text-muted mb-1">SpO₂ (%)</label>
                    <input 
                      type="text" 
                      placeholder="%"
                      className="w-full border border-border rounded px-2 py-1.5 focus:border-primary outline-none clinical-num"
                      value={patient.spo2} 
                      onChange={(e) => setPatientField('spo2', e.target.value)} 
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-text-muted mb-1">Resp Rate (/min)</label>
                    <input 
                      type="text" 
                      placeholder="/min"
                      className="w-full border border-border rounded px-2 py-1.5 focus:border-primary outline-none clinical-num"
                      value={patient.respiratoryRate} 
                      onChange={(e) => setPatientField('respiratoryRate', e.target.value)} 
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-text-muted mb-1">Temp (°C)</label>
                    <input 
                      type="text" 
                      placeholder="°C"
                      className="w-full border border-border rounded px-2 py-1.5 focus:border-primary outline-none clinical-num"
                      value={patient.temperature} 
                      onChange={(e) => setPatientField('temperature', e.target.value)} 
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-text-muted mb-1">Pain Score</label>
                    <select 
                      className="w-full border border-border rounded px-2 py-1.5 focus:border-primary outline-none clinical-num"
                      value={patient.painScore} 
                      onChange={(e) => setPatientField('painScore', e.target.value)}
                    >
                      <option value="">None</option>
                      {[...Array(11)].map((_, i) => (
                        <option key={i} value={i.toString()}>{i}/10</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-text-muted mb-1">Weight (kg)</label>
                    <input 
                      type="text" 
                      placeholder="kg"
                      className="w-full border border-border rounded px-2 py-1.5 focus:border-primary outline-none clinical-num"
                      value={patient.weight} 
                      onChange={(e) => setPatientField('weight', e.target.value)} 
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-text-muted mb-1">Height (cm)</label>
                    <input 
                      type="text" 
                      placeholder="cm"
                      className="w-full border border-border rounded px-2 py-1.5 focus:border-primary outline-none clinical-num"
                      value={patient.height} 
                      onChange={(e) => setPatientField('height', e.target.value)} 
                    />
                  </div>
                </div>
              </section>

              {/* Section 3: Clinical Status */}
              <section className="space-y-3">
                <h3 className="font-semibold text-text-secondary border-b pb-1">Clinical Status</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-text-muted mb-1">Pregnancy Status</label>
                    <select 
                      className="w-full border border-border rounded px-2 py-1.5 focus:border-primary outline-none"
                      value={patient.pregnancyStatus} 
                      onChange={(e) => setPatientField('pregnancyStatus', e.target.value as PregnancyStatus)}
                    >
                      <option value="Not Pregnant">Not Pregnant</option>
                      <option value="Pregnant">Pregnant</option>
                      <option value="Unknown">Unknown</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-text-muted mb-1">Code Status</label>
                    <select 
                      className="w-full border border-border rounded px-2 py-1.5 focus:border-primary outline-none"
                      value={patient.codeStatus} 
                      onChange={(e) => setPatientField('codeStatus', e.target.value as CodeStatus)}
                    >
                      <option value="Full Code">Full Code</option>
                      <option value="DNR">DNR</option>
                      <option value="DNR/DNI">DNR/DNI</option>
                      <option value="Unknown">Unknown</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-text-muted mb-2">High Risk Flags</label>
                  <div className="flex flex-wrap gap-2">
                    {HIGH_RISK_FLAGS.map(flag => {
                      const isActive = patient.highRiskFlags?.includes(flag);
                      return (
                        <button
                          key={flag}
                          onClick={() => handleToggleHighRisk(flag)}
                          className={`text-xs px-2 py-1 rounded border transition-colors ${
                            isActive 
                              ? 'bg-danger-bg text-danger-text border-danger' 
                              : 'bg-canvas text-text-muted border-border hover:bg-gray-100'
                          }`}
                        >
                          {flag}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </section>

              {/* Section 4: Allergies */}
              <section className="space-y-3">
                <h3 className="font-semibold text-text-secondary border-b pb-1">Allergies</h3>
                {patient.allergies && patient.allergies.length > 0 && (
                  <div className="space-y-2 mb-3">
                    {patient.allergies.map((allergy, i) => (
                      <div key={i} className="flex items-center justify-between bg-canvas p-2 rounded border border-border">
                        <div className="flex items-center space-x-2">
                          <AlertTriangle size={14} className={allergy.severity === 'Anaphylaxis' ? 'text-danger' : allergy.severity === 'Severe' ? 'text-red-500' : 'text-warning'} />
                          <span className="font-medium">{allergy.name}</span>
                          <span className="text-xs text-text-muted">({allergy.severity})</span>
                        </div>
                        <button onClick={() => handleRemoveAllergy(i)} className="text-gray-400 hover:text-danger">
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex items-center space-x-2">
                  <input 
                    type="text" 
                    placeholder="Allergen"
                    className="flex-1 border border-border rounded px-2 py-1.5 focus:border-primary outline-none"
                    value={newAllergyName}
                    onChange={(e) => setNewAllergyName(e.target.value)}
                  />
                  <select 
                    className="w-32 border border-border rounded px-2 py-1.5 focus:border-primary outline-none text-sm"
                    value={newAllergySeverity}
                    onChange={(e) => setNewAllergySeverity(e.target.value as AllergySeverity)}
                  >
                    <option value="Anaphylaxis">Anaphylaxis</option>
                    <option value="Severe">Severe</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Mild">Mild</option>
                    <option value="Intolerance">Intolerance</option>
                  </select>
                  <button 
                    onClick={handleAddAllergy}
                    className="bg-primary text-white p-1.5 rounded hover:bg-opacity-90"
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </section>

              {/* Section 5: Comorbidities */}
              <section className="space-y-3">
                <h3 className="font-semibold text-text-secondary border-b pb-1">Comorbidities</h3>
                {patient.comorbidities && patient.comorbidities.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {patient.comorbidities.map((c, i) => (
                      <span key={i} className="bg-canvas border border-border px-2 py-1 rounded text-xs flex items-center space-x-1">
                        <span>{c}</span>
                        <button onClick={() => handleRemoveComorbidity(c)} className="text-gray-400 hover:text-danger">
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex items-center space-x-2 mb-2">
                  <input 
                    type="text" 
                    placeholder="Add comorbidity..."
                    className="flex-1 border border-border rounded px-2 py-1.5 focus:border-primary outline-none"
                    value={newComorbidity}
                    onChange={(e) => setNewComorbidity(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddComorbidity(newComorbidity)}
                  />
                  <button 
                    onClick={() => handleAddComorbidity(newComorbidity)}
                    className="bg-primary text-white p-1.5 rounded hover:bg-opacity-90"
                  >
                    <Plus size={18} />
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {COMMON_COMORBIDITIES.filter(c => !patient.comorbidities?.includes(c)).map(c => (
                    <button 
                      key={c}
                      onClick={() => handleAddComorbidity(c)}
                      className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded hover:bg-gray-200"
                    >
                      + {c}
                    </button>
                  ))}
                </div>
              </section>

              {/* Section 6: Emergency */}
              <section className="space-y-3 pb-8">
                <h3 className="font-semibold text-text-secondary border-b pb-1">Emergency</h3>
                <div>
                  <label className="block text-xs text-text-muted mb-1">Emergency Contact</label>
                  <input 
                    type="text" 
                    className="w-full border border-border rounded px-2 py-1.5 focus:border-primary outline-none"
                    value={patient.emergencyContact} 
                    onChange={(e) => setPatientField('emergencyContact', e.target.value)} 
                  />
                </div>
              </section>

            </div>
          </div>
        </div>
      )}
    </>
  );
};
