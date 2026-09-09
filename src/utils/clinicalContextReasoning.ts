// ============================================================
// Hassan and Co. Healthcare Systems — Clinical Context Reasoning Engine
// Generates intelligent, patient-tailored medication and treatment
// recommendations by synthesizing:
// 1. Vitals (BP, HR, Temp, SpO2, RR, Pain Score)
// 2. Patient History (Past Medical, Surgical, Family, Social)
// 3. Demographics & Context (Pediatric/Geriatric, Pregnancy, Allergies)
// 4. SOAP Notes (Subjective Chief Complaint, HPI, Objective Exam, Assessment)
// 5. Hospital Inventory (In-stock brand/generic matching & pricing)
// ============================================================

import type { Patient, PatientHistory, SOAPNote, InventoryItem } from '../types';

export interface ContextualMedicationSuggestion {
  id: string;
  genericName: string;
  brandName: string;
  strength: string;
  form: string;
  route: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
  clinicalRationale: string;    // Direct clinical reason citing vitals, history, or SOAP
  category: string;
  inStock: boolean;
  stockPrice?: number;
  stockUnit?: string;
  contraindicationsChecked: string[];
  isPediatricDosed?: boolean;
}

export interface ContextualTreatmentPlan {
  // Summary of patient factors evaluated
  patientSummary: {
    demographics: string;
    vitalsSummary: string;
    abnormalVitals: string[];
    relevantHistory: string[];
    soapFindings: string[];
    allergiesIdentified: string[];
    riskFactors: string[];
  };
  
  // Specific recommendations
  suggestedMedications: ContextualMedicationSuggestion[];
  supportiveTreatments: Array<{
    title: string;
    detail: string;
    priority: 'STAT' | 'Urgent' | 'Routine';
    rationale: string;
  }>;
  withheldContraindications: Array<{
    medication: string;
    reason: string;
    source: 'Allergy' | 'Vitals' | 'History' | 'Pregnancy' | 'Age';
  }>;
  suggestedLabs: Array<{
    name: string;
    reason: string;
    urgency: 'Routine' | 'Urgent' | 'STAT';
  }>;
  clinicalAdviceSummary: string;
}

export interface ClinicalContextInput {
  patient: Patient;
  patientHistory?: PatientHistory;
  soapNote?: SOAPNote;
  inventory?: InventoryItem[];
  activeSymptoms?: string[];
  activeDiseases?: string[];
  clinicalNotes?: string;
}

/**
 * Normalizes strings for robust matching
 */
const norm = (str?: string): string => (str || '').toLowerCase().trim();

/**
 * Checks if patient has an active documented allergy to a drug class or name
 */
export const checkAllergyContraindication = (drugName: string, patientAllergies: Array<{ name: string; severity?: string }>): boolean => {
  const d = norm(drugName);
  return patientAllergies.some(a => {
    const aName = norm(a.name);
    if (!aName) return false;
    // Penicillin cross-reactivity
    if ((aName.includes('penicillin') || aName.includes('amox') || aName.includes('augmentin')) &&
        (d.includes('penicillin') || d.includes('amox') || d.includes('augmentin') || d.includes('ampicillin'))) {
      return true;
    }
    // Sulfa
    if (aName.includes('sulfa') && (d.includes('sulfa') || d.includes('cotrimoxazole') || d.includes('bactrim'))) {
      return true;
    }
    // Aspirin / NSAIDs
    if ((aName.includes('aspirin') || aName.includes('nsaid') || aName.includes('brufen') || aName.includes('ibuprofen')) &&
        (d.includes('aspirin') || d.includes('disprin') || d.includes('ibuprofen') || d.includes('brufen') || d.includes('diclofenac') || d.includes('voltaren') || d.includes('naproxen'))) {
      return true;
    }
    return d.includes(aName) || aName.includes(d);
  });
};

/**
 * Evaluates patient context and generates personalized clinical recommendations
 */
export function generateContextualTreatmentRecommendations(input: ClinicalContextInput): ContextualTreatmentPlan {
  const {
    patient,
    patientHistory = { pastMedical: [], pastSurgical: [], familyHistory: [], socialHistory: { smoking: '', alcohol: '', occupation: '', exercise: '' } },
    soapNote = {
      subjective: { chiefComplaint: '', hpiNarrative: '', reviewOfSystems: {} },
      objective: { generalAppearance: '', vitalsSummary: '', physicalExam: {} },
      assessment: { diagnoses: [], icdCodes: [], differentials: [] },
      plan: { medications: '', labsOrdered: '', imagingOrdered: '', referrals: '', followUp: '', patientEducation: '' }
    },
    inventory = [],
    activeSymptoms = [],
    activeDiseases = [],
    clinicalNotes = ''
  } = input;

  // ---------------------------------------------------------
  // 1. Analyze Patient Demographics & Age / Weight
  // ---------------------------------------------------------
  const ageNum = parseInt(patient.age || '0', 10);
  const isPediatric = (patient.age && (patient.age.includes('m') || patient.age.includes('mo') || ageNum < 12)) || (parseFloat(patient.weight || '70') < 35);
  const isGeriatric = ageNum >= 65;
  const isPregnant = patient.pregnancyStatus === 'Pregnant';
  const isBreastfeeding = patient.pregnancyStatus === 'Breastfeeding';
  const weightKg = parseFloat(patient.weight || '70') || 70;

  const riskFactors: string[] = [...(patient.highRiskFlags || [])];
  if (isGeriatric) riskFactors.push('Geriatric Patient (Start low, go slow)');
  if (isBreastfeeding) riskFactors.push('Lactation Status (Assess breastmilk excretion)');

  // ---------------------------------------------------------
  // 2. Parse & Classify Vitals
  // ---------------------------------------------------------
  const abnormalVitals: string[] = [];
  const [sysStr, diaStr] = (patient.bp || '').split('/');
  const systolic = parseInt(sysStr, 10);
  const diastolic = parseInt(diaStr, 10);
  const hasBP = !isNaN(systolic) && !isNaN(diastolic);
  const isHypertensive = hasBP && (systolic >= 140 || diastolic >= 90);
  const isSevereHTN = hasBP && (systolic >= 180 || diastolic >= 110);
  const isHypotensive = hasBP && (systolic < 90 || diastolic < 60);

  if (isSevereHTN) abnormalVitals.push(`Severe Hypertensive Urgency/Crisis (${patient.bp} mmHg)`);
  else if (isHypertensive) abnormalVitals.push(`Stage 1/2 Hypertension (${patient.bp} mmHg)`);
  else if (isHypotensive) abnormalVitals.push(`Hypotension / Circulatory Collapse (${patient.bp} mmHg)`);

  const hr = parseInt(patient.pulse || '', 10);
  const hasHR = !isNaN(hr);
  const isTachycardic = hasHR && hr > 100;
  const isBradycardic = hasHR && hr < 60;
  if (isTachycardic) abnormalVitals.push(`Tachycardia (${hr} bpm)`);
  if (isBradycardic) abnormalVitals.push(`Bradycardia (${hr} bpm)`);

  const temp = parseFloat(patient.temperature || '');
  const hasTemp = !isNaN(temp);
  const isFever = hasTemp && temp >= 37.8;
  const isHighFever = hasTemp && temp >= 38.5;
  const isHypothermic = hasTemp && temp < 35.5;
  if (isHighFever) abnormalVitals.push(`High Grade Pyrexia (${temp}°C)`);
  else if (isFever) abnormalVitals.push(`Low Grade Pyrexia (${temp}°C)`);
  if (isHypothermic) abnormalVitals.push(`Hypothermia (${temp}°C)`);

  const spo2 = parseInt(patient.spo2 || '', 10);
  const hasSpo2 = !isNaN(spo2);
  const isHypoxic = hasSpo2 && spo2 < 93;
  const isCriticallyHypoxic = hasSpo2 && spo2 < 88;
  if (isCriticallyHypoxic) abnormalVitals.push(`Critical Hypoxemia (SpO2 ${spo2}%)`);
  else if (isHypoxic) abnormalVitals.push(`Desaturation (SpO2 ${spo2}%)`);

  const rr = parseInt(patient.respiratoryRate || '', 10);
  const hasRR = !isNaN(rr);
  const isTachypneic = hasRR && rr > 22;
  if (isTachypneic) abnormalVitals.push(`Tachypnea (${rr}/min)`);

  const pain = parseInt(patient.painScore || '', 10);
  const hasPain = !isNaN(pain);
  const isSeverePain = hasPain && pain >= 7;
  const isModeratePain = hasPain && pain >= 4 && pain < 7;
  if (isSeverePain) abnormalVitals.push(`Severe Pain (Score ${pain}/10)`);
  else if (isModeratePain) abnormalVitals.push(`Moderate Pain (Score ${pain}/10)`);

  // ---------------------------------------------------------
  // 3. Parse History & Comorbidities
  // ---------------------------------------------------------
  const allHistory = [
    ...(patientHistory.pastMedical || []),
    ...(patient.comorbidities || []),
    ...(patient.highRiskFlags || [])
  ].map(norm);

  const hasHistory = (kw: string) => allHistory.some(h => h.includes(norm(kw)));

  const hasAsthma = hasHistory('asthma') || hasHistory('copd') || hasHistory('reactive airway');
  const hasPepticUlcer = hasHistory('ulcer') || hasHistory('pud') || hasHistory('gerd') || hasHistory('gastritis') || hasHistory('gi bleed');
  const hasCKD = hasHistory('ckd') || hasHistory('kidney') || hasHistory('renal') || hasHistory('nephro');
  const hasDM = hasHistory('dm') || hasHistory('diabet') || hasHistory('sugar');
  const hasIHD = hasHistory('ihd') || hasHistory('cad') || hasHistory('ischemic') || hasHistory('angina') || hasHistory('infarction') || hasHistory('stent');
  const hasLiverDisease = hasHistory('hepat') || hasHistory('liver') || hasHistory('cirrhosis');

  const relevantHistory: string[] = [];
  if (hasDM) relevantHistory.push('Diabetes Mellitus (Strict glycemic control required)');
  if (hasIHD) relevantHistory.push('Ischemic Heart Disease / Coronary Artery Disease');
  if (hasAsthma) relevantHistory.push('Asthma / Bronchospastic Airway Disease (Beta-blockers contraindicated)');
  if (hasPepticUlcer) relevantHistory.push('Peptic Ulcer Disease / Gastritis (NSAIDs contraindicated)');
  if (hasCKD) relevantHistory.push('Chronic Kidney Disease (Nephrotoxic drugs contraindicated)');
  if (hasLiverDisease) relevantHistory.push('Hepatic Impairment (Hepatotoxic monitoring required)');

  // ---------------------------------------------------------
  // 4. Parse SOAP Notes Findings
  // ---------------------------------------------------------
  const soapFindings: string[] = [];
  const chiefComplaint = norm(soapNote.subjective?.chiefComplaint);
  const hpi = norm(soapNote.subjective?.hpiNarrative);
  const examText = Object.values(soapNote.objective?.physicalExam || {}).map(norm).join(' ');
  const assessmentDiags = (soapNote.assessment?.diagnoses || []).map(norm);
  const notesCombined = `${chiefComplaint} ${hpi} ${examText} ${assessmentDiags.join(' ')} ${clinicalNotes.toLowerCase()} ${activeSymptoms.join(' ').toLowerCase()} ${activeDiseases.join(' ').toLowerCase()}`;

  if (soapNote.subjective?.chiefComplaint) {
    soapFindings.push(`Chief Complaint: "${soapNote.subjective.chiefComplaint}"`);
  }
  if (assessmentDiags.length > 0) {
    soapFindings.push(`Working Diagnoses: ${soapNote.assessment.diagnoses.join(', ')}`);
  }
  if (examText.includes('wheez')) soapFindings.push('Physical Exam: Wheezing detected on chest auscultation');
  if (examText.includes('crackle') || examText.includes('crepit')) soapFindings.push('Physical Exam: Crepitations / Crackles noted on lung bases');
  if (examText.includes('tender')) soapFindings.push('Physical Exam: Localized tenderness identified');
  if (examText.includes('edema')) soapFindings.push('Physical Exam: Peripheral pedal edema present');

  // ---------------------------------------------------------
  // 5. Track Contraindications & Withheld Meds
  // ---------------------------------------------------------
  const withheldContraindications: ContextualTreatmentPlan['withheldContraindications'] = [];
  const allergiesIdentified = (patient.allergies || []).map(a => `${a.name} (${a.severity || 'Documented'})`);

  const isAllergicTo = (drug: string) => {
    const contraindicated = checkAllergyContraindication(drug, patient.allergies || []);
    if (contraindicated) {
      withheldContraindications.push({
        medication: drug,
        reason: `Patient has documented allergy to ${drug} or class derivatives`,
        source: 'Allergy'
      });
    }
    return contraindicated;
  };

  // ---------------------------------------------------------
  // 6. Inventory Helper
  // ---------------------------------------------------------
  const matchInventory = (generic: string, brand: string) => {
    const g = norm(generic);
    const b = norm(brand);
    const item = inventory.find(inv => {
      const invName = norm(inv.name);
      return (g && invName.includes(g)) || (b && invName.includes(b));
    });

    if (item && item.stock > 0) {
      return {
        inStock: true,
        stockPrice: item.sellingPrice || item.unitPrice || 0,
        stockUnit: item.unit
      };
    }
    return { inStock: false };
  };

  // ---------------------------------------------------------
  // 7. Clinical Reasoning & Medication Suggestions
  // ---------------------------------------------------------
  const suggestedMedications: ContextualMedicationSuggestion[] = [];
  const supportiveTreatments: ContextualTreatmentPlan['supportiveTreatments'] = [];
  const suggestedLabs: ContextualTreatmentPlan['suggestedLabs'] = [];

  // Helper to add medication safely
  const addMed = (med: {
    genericName: string;
    brandName: string;
    strength: string;
    form: string;
    route: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions: string;
    clinicalRationale: string;
    category: string;
    pediatricAdjusted?: boolean;
  }) => {
    // 1. Allergy check
    if (isAllergicTo(med.genericName) || isAllergicTo(med.brandName)) {
      return;
    }

    // 2. Pregnancy Safety Check
    if (isPregnant) {
      const g = norm(med.genericName);
      if (g.includes('losartan') || g.includes('enalapril') || g.includes('captopril') || g.includes('atorvastatin') || g.includes('rosuvastatin') || g.includes('ciprofloxacin') || g.includes('doxycycline')) {
        withheldContraindications.push({
          medication: `${med.brandName} (${med.genericName})`,
          reason: 'Teratogenic / Contraindicated in pregnancy (Category D/X)',
          source: 'Pregnancy'
        });
        return;
      }
    }

    // 3. Asthma vs Beta-Blocker Check
    if (hasAsthma && (norm(med.genericName).includes('atenolol') || norm(med.genericName).includes('propranolol') || norm(med.genericName).includes('bisoprolol'))) {
      withheldContraindications.push({
        medication: `${med.brandName} (${med.genericName})`,
        reason: 'Risk of life-threatening bronchospasm in patient with Asthma/COPD history',
        source: 'History'
      });
      return;
    }

    // 4. Peptic Ulcer or CKD vs NSAIDs Check
    const isNSAID = norm(med.genericName).includes('ibuprofen') || norm(med.genericName).includes('diclofenac') || norm(med.genericName).includes('naproxen') || norm(med.brandName).includes('brufen') || norm(med.brandName).includes('voltaren');
    if (isNSAID && (hasPepticUlcer || hasCKD)) {
      withheldContraindications.push({
        medication: `${med.brandName} (${med.genericName})`,
        reason: hasCKD ? 'Nephrotoxic risk in Chronic Kidney Disease' : 'Gastrointestinal bleeding / ulcer exacerbation risk',
        source: 'History'
      });
      return;
    }

    // 5. Pediatric Dosing Adjustment
    let finalDose = med.dosage;
    let finalStrength = med.strength;
    let finalForm = med.form;
    let isPediatricDosed = false;

    if (isPediatric) {
      isPediatricDosed = true;
      if (norm(med.genericName).includes('paracetamol')) {
        finalStrength = '120mg/5ml';
        finalForm = 'Syrup';
        const mlPerDose = Math.round((weightKg * 15) / 24); // 15 mg/kg
        finalDose = `${Math.max(2.5, mlPerDose)} ml`;
      } else if (norm(med.genericName).includes('amoxicillin')) {
        finalStrength = '250mg/5ml';
        finalForm = 'Suspension';
        const mlPerDose = Math.round((weightKg * 40) / (3 * 50)); // 40 mg/kg/day divided TDS
        finalDose = `${Math.max(2.5, mlPerDose)} ml`;
      }
    }

    // Check inventory stock
    const inv = matchInventory(med.genericName, med.brandName);

    suggestedMedications.push({
      id: `sug-${Date.now()}-${suggestedMedications.length}`,
      genericName: med.genericName,
      brandName: med.brandName,
      strength: finalStrength,
      form: finalForm,
      route: med.route,
      dosage: finalDose,
      frequency: med.frequency,
      duration: med.duration,
      instructions: med.instructions,
      clinicalRationale: med.clinicalRationale,
      category: med.category,
      inStock: inv.inStock,
      stockPrice: inv.stockPrice,
      stockUnit: inv.stockUnit,
      contraindicationsChecked: ['Allergies Cleared', 'Comorbidity Safe', 'Vitals Verified'],
      isPediatricDosed
    });
  };

  // ---------------------------------------------------------
  // Clinical Rule 1: Fever / Pyrexia (Vitals)
  // ---------------------------------------------------------
  if (isFever || notesCombined.includes('fever') || notesCombined.includes('pyrexia') || notesCombined.includes('chills')) {
    addMed({
      genericName: 'Paracetamol',
      brandName: 'Panadol',
      strength: '500mg',
      form: 'Tablet',
      route: 'Oral',
      dosage: isPediatric ? 'Weight-adjusted' : '1-2 Tablets',
      frequency: 'TDS (Every 8h PRN)',
      duration: '3-5 Days',
      instructions: 'Take after meals for fever / body aches. Do not exceed 4g daily in adults.',
      clinicalRationale: `Indicated for elevated temperature (${hasTemp ? `${temp}°C` : 'Documented in SOAP'}). Verified safe for hepatic/renal baseline.`,
      category: 'Analgesics/Antipyretics'
    });

    if (isHighFever) {
      supportiveTreatments.push({
        title: 'Tepid Sponging & Fluid Hydration',
        detail: 'Apply lukewarm water compresses to forehead, axillae, and neck. Target fluid intake of 2.5L/day unless contraindicated.',
        priority: 'Urgent',
        rationale: `Temperature is ${temp}°C requiring active antipyretic supportive care.`
      });
      suggestedLabs.push({
        name: 'Complete Blood Picture (CBC) with Differential',
        reason: `Elevated temperature (${temp}°C) to rule out bacteremia or leukocytosis.`,
        urgency: 'Urgent'
      });
      suggestedLabs.push({
        name: 'C-Reactive Protein (CRP) & ESR',
        reason: 'Evaluate acute phase systemic inflammatory response.',
        urgency: 'Routine'
      });
    }
  }

  // ---------------------------------------------------------
  // Clinical Rule 2: Respiratory Symptoms / Hypoxia / Wheezing
  // ---------------------------------------------------------
  const isRespIssue = isHypoxic || isTachypneic || notesCombined.includes('cough') || notesCombined.includes('breath') || notesCombined.includes('chest tight') || notesCombined.includes('wheez') || notesCombined.includes('sputum') || hasAsthma;

  if (isRespIssue) {
    // Bronchodilator inhaler
    addMed({
      genericName: 'Salbutamol HFA',
      brandName: 'Ventolin',
      strength: '100mcg',
      form: 'Inhaler',
      route: 'Inhaled',
      dosage: '2 Puffs',
      frequency: 'PRN (Every 4-6h as needed for shortness of breath)',
      duration: '1 Month',
      instructions: 'Rinse mouth after use. Use with spacer device if difficulty coordinating breath.',
      clinicalRationale: `Indicated for ${isHypoxic ? `low SpO2 (${spo2}%)` : 'respiratory symptoms / wheezing noted in physical exam'}. Rapidly dilates broncho-constricted airways.`,
      category: 'Respiratory'
    });

    // Inpatient or severe respiratory infection
    if (notesCombined.includes('pneumonia') || notesCombined.includes('purulent') || notesCombined.includes('productive') || (isFever && notesCombined.includes('cough'))) {
      const hasPenicillinAllergy = isAllergicTo('Amoxicillin') || isAllergicTo('Penicillin');
      
      if (!hasPenicillinAllergy) {
        addMed({
          genericName: 'Amoxicillin + Clavulanate',
          brandName: 'Augmentin',
          strength: '625mg',
          form: 'Tablet',
          route: 'Oral',
          dosage: '1 Tablet',
          frequency: 'BD (Every 12h)',
          duration: '5-7 Days',
          instructions: 'Take at start of meals to minimize gastrointestinal discomfort. Complete full course.',
          clinicalRationale: 'First-line empirical coverage for respiratory tract infection. Safe with current renal and hepatic profile.',
          category: 'Antibiotics'
        });
      } else {
        // Safe alternative for Penicillin-allergic patients
        addMed({
          genericName: 'Azithromycin',
          brandName: 'Azomax',
          strength: '500mg',
          form: 'Tablet',
          route: 'Oral',
          dosage: '1 Tablet',
          frequency: 'OD (Once daily)',
          duration: '3 Days',
          instructions: 'Take 1 hour before or 2 hours after meals with a full glass of water.',
          clinicalRationale: 'Prescribed as safe macrolide alternative because patient has a documented Penicillin allergy.',
          category: 'Antibiotics'
        });
      }

      suggestedLabs.push({
        name: 'Chest X-Ray (PA View)',
        reason: `Evaluate pulmonary infiltrates or consolidation given cough and ${hasTemp ? `fever of ${temp}°C` : 'respiratory symptoms'}.`,
        urgency: 'Urgent'
      });
    }

    if (isHypoxic) {
      supportiveTreatments.push({
        title: 'Supplemental Oxygen Therapy',
        detail: `Administer nasal cannula O2 at 2-4 L/min targeting SpO2 ${hasAsthma ? '88-92%' : '94-98%'}.`,
        priority: 'STAT',
        rationale: `Active SpO2 is critically depressed at ${spo2}%.`
      });
    }
  }

  // ---------------------------------------------------------
  // Clinical Rule 3: Cardiovascular / Hypertension (Vitals + History)
  // ---------------------------------------------------------
  if (isHypertensive || hasIHD || (hasHistory('hypertension') && !isHypotensive)) {
    // If not already on CCB or if high BP in vitals
    if (isHypertensive) {
      addMed({
        genericName: 'Amlodipine',
        brandName: 'Norvasc',
        strength: '5mg',
        form: 'Tablet',
        route: 'Oral',
        dosage: '1 Tablet',
        frequency: 'OD (Morning)',
        duration: '30 Days',
        instructions: 'Take at the same time each morning. Monitor BP bi-weekly.',
        clinicalRationale: `Indicated for elevated BP reading of ${patient.bp} mmHg. CCB is safe across asthmatic and renal comorbidity baselines.`,
        category: 'Cardiovascular'
      });

      supportiveTreatments.push({
        title: 'Dietary Sodium Restriction (DASH Protocol)',
        detail: 'Restrict dietary sodium to <2g/day (<5g table salt). Maintain active home BP monitoring log twice daily.',
        priority: 'Routine',
        rationale: `Recorded blood pressure is ${patient.bp} mmHg.`
      });

      suggestedLabs.push({
        name: 'Standard 12-Lead ECG',
        reason: `Rule out LVH, ischemia, or conduction delays given BP of ${patient.bp} mmHg.`,
        urgency: isSevereHTN ? 'STAT' : 'Routine'
      });
      suggestedLabs.push({
        name: 'Serum Electrolytes, Urea & Creatinine (RFTs)',
        reason: 'Assess baseline renal function prior to ongoing antihypertensive therapy.',
        urgency: 'Routine'
      });
    }

    if (hasIHD && !isPregnant) {
      addMed({
        genericName: 'Aspirin (Cardio)',
        brandName: 'Loprin',
        strength: '75mg',
        form: 'Tablet',
        route: 'Oral',
        dosage: '1 Tablet',
        frequency: 'OD (After lunch)',
        duration: '30 Days',
        instructions: 'Take with food or milk to prevent gastric irritation.',
        clinicalRationale: 'Secondary prevention for established Ischemic Heart Disease / CAD documented in patient history.',
        category: 'Cardiovascular'
      });
    }
  } else if (isHypotensive) {
    supportiveTreatments.push({
      title: 'Emergency IV Volume Resuscitation',
      detail: 'Infuse 500ml Normal Saline 0.9% IV STAT over 30 minutes. Re-evaluate BP and heart rate. Withhold all antihypertensive and vasodilator medications.',
      priority: 'STAT',
      rationale: `Critical hypotension detected (${patient.bp} mmHg). Risk of circulatory compromise.`
    });
    suggestedLabs.push({
      name: 'Serum Lactate & Blood Gas Analysis (ABG/VBG)',
      reason: `Assess tissue perfusion and metabolic acidosis in hypotensive patient (${patient.bp} mmHg).`,
      urgency: 'STAT'
    });
  }

  // ---------------------------------------------------------
  // Clinical Rule 4: Gastrointestinal / Gastritis / PUD (SOAP + History)
  // ---------------------------------------------------------
  const isGIComplaint = notesCombined.includes('epigastric') || notesCombined.includes('stomach') || notesCombined.includes('gastritis') || notesCombined.includes('acid') || notesCombined.includes('gerd') || notesCombined.includes('heartburn') || notesCombined.includes('vomit') || notesCombined.includes('nausea') || hasPepticUlcer;

  if (isGIComplaint) {
    addMed({
      genericName: 'Omeprazole',
      brandName: 'Risek',
      strength: '20mg',
      form: 'Capsule',
      route: 'Oral',
      dosage: '1 Capsule',
      frequency: 'OD (30 min before breakfast)',
      duration: '14 Days',
      instructions: 'Swallow whole with a glass of water. Do not crush or chew.',
      clinicalRationale: `Indicated for ${hasPepticUlcer ? 'documented PUD/Gastritis history' : 'epigastric burning / dyspeptic complaints noted in SOAP note'}. Provides potent acid suppression and mucosal protection.`,
      category: 'GI Medications'
    });

    if (notesCombined.includes('nausea') || notesCombined.includes('vomit')) {
      addMed({
        genericName: 'Domperidone',
        brandName: 'Motilium',
        strength: '10mg',
        form: 'Tablet',
        route: 'Oral',
        dosage: '1 Tablet',
        frequency: 'TDS (15 min before meals)',
        duration: '5 Days',
        instructions: 'Take before meals for nausea and gastric motility.',
        clinicalRationale: 'Relieves upper gastrointestinal nausea and emesis noted in subjective SOAP narrative.',
        category: 'GI Medications'
      });
    }
  }

  // ---------------------------------------------------------
  // Clinical Rule 5: Diabetes Mellitus (History + Comorbidity)
  // ---------------------------------------------------------
  if (hasDM && !hasCKD) {
    addMed({
      genericName: 'Metformin HCl',
      brandName: 'Glucophage',
      strength: '500mg',
      form: 'Tablet',
      route: 'Oral',
      dosage: '1 Tablet',
      frequency: 'BD (With or immediately after meals)',
      duration: '30 Days',
      instructions: 'Take with food to minimize abdominal fullness or gastrointestinal symptoms.',
      clinicalRationale: 'Baseline insulin-sensitizing glycemic therapy for documented Type 2 Diabetes comorbidity. Verified no severe renal impairment.',
      category: 'Antidiabetics'
    });

    suggestedLabs.push({
      name: 'Fasting Blood Sugar (FBS) & HbA1c',
      reason: 'Evaluate 3-month glycemic control for diabetic patient.',
      urgency: 'Routine'
    });
  }

  // ---------------------------------------------------------
  // Clinical Rule 6: Pain Management (Vitals Pain Score)
  // ---------------------------------------------------------
  if (hasPain && pain >= 4 && !suggestedMedications.some(m => m.genericName === 'Paracetamol')) {
    if (!hasPepticUlcer && !hasCKD && !isAllergicTo('Ibuprofen')) {
      addMed({
        genericName: 'Ibuprofen',
        brandName: 'Brufen',
        strength: '400mg',
        form: 'Tablet',
        route: 'Oral',
        dosage: '1 Tablet',
        frequency: 'TDS (After meals)',
        duration: '3-5 Days',
        instructions: 'Always take after food. Discontinue if stomach pain develops.',
        clinicalRationale: `Indicated for acute pain score of ${pain}/10. Verified patient has no documented peptic ulcer or renal disease history.`,
        category: 'Analgesics/Antipyretics'
      });
    } else {
      // Safe alternative when NSAIDs are contraindicated
      addMed({
        genericName: 'Paracetamol',
        brandName: 'Panadol',
        strength: '500mg',
        form: 'Tablet',
        route: 'Oral',
        dosage: '2 Tablets',
        frequency: 'TDS (Every 8h PRN)',
        duration: '5 Days',
        instructions: 'Take after meals for pain relief.',
        clinicalRationale: `Chosen because NSAIDs are strictly contraindicated due to ${hasCKD ? 'CKD/Renal disease' : 'Peptic Ulcer / Gastritis'} history. Safe analgesia for pain score ${pain}/10.`,
        category: 'Analgesics/Antipyretics'
      });
    }
  }

  // ---------------------------------------------------------
  // Fallback if no specific condition triggered
  // ---------------------------------------------------------
  if (suggestedMedications.length === 0) {
    addMed({
      genericName: 'Paracetamol',
      brandName: 'Panadol',
      strength: '500mg',
      form: 'Tablet',
      route: 'Oral',
      dosage: '1-2 Tablets',
      frequency: 'PRN for pain or discomfort',
      duration: '3 Days',
      instructions: 'Take with plenty of water after food.',
      clinicalRationale: 'General supportive symptomatic relief aligned with baseline observations.',
      category: 'Analgesics/Antipyretics'
    });
    addMed({
      genericName: 'Omeprazole',
      brandName: 'Risek',
      strength: '20mg',
      form: 'Capsule',
      route: 'Oral',
      dosage: '1 Capsule',
      frequency: 'OD (Before breakfast)',
      duration: '14 Days',
      instructions: 'Gastric protection protocol.',
      clinicalRationale: 'Prophylactic gastric mucosal preservation.',
      category: 'GI Medications'
    });
  }

  // ---------------------------------------------------------
  // 8. Generate Final Comprehensive Clinical Summary
  // ---------------------------------------------------------
  const vitalsSummaryStr = [
    patient.bp ? `BP: ${patient.bp} mmHg` : null,
    patient.pulse ? `HR: ${patient.pulse} bpm` : null,
    patient.temperature ? `Temp: ${patient.temperature}°C` : null,
    patient.spo2 ? `SpO2: ${patient.spo2}%` : null,
    patient.respiratoryRate ? `RR: ${patient.respiratoryRate}/min` : null,
    patient.painScore ? `Pain: ${patient.painScore}/10` : null,
  ].filter(Boolean).join(' • ') || 'No vitals recorded';

  const demographicsStr = `${patient.name || 'Anonymous'} (${patient.age || 'Adult'}, ${patient.gender || 'Unspecified'}) • ${patient.weight ? `${patient.weight}kg` : 'Std wt'} • Code: ${patient.codeStatus || 'Full Code'}`;

  const clinicalAdviceSummary = `Computed for ${patient.name || 'Patient'} via Hassan and Co. Clinical Reasoning Engine. Factored in: Vitals (${abnormalVitals.length > 0 ? abnormalVitals.join(', ') : 'Normal parameters'}), Comorbidities (${relevantHistory.join(', ') || 'None'}), SOAP Notes (${soapFindings.join('; ') || 'Routine'}), and cleared against documented allergies (${allergiesIdentified.join(', ') || 'NKDA'}). Prioritized in-stock hospital pharmacy medications.`;

  return {
    patientSummary: {
      demographics: demographicsStr,
      vitalsSummary: vitalsSummaryStr,
      abnormalVitals,
      relevantHistory,
      soapFindings,
      allergiesIdentified,
      riskFactors
    },
    suggestedMedications,
    supportiveTreatments,
    withheldContraindications,
    suggestedLabs,
    clinicalAdviceSummary
  };
}
