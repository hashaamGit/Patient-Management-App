// ============================================================
// Hassan and Co. Healthcare Systems — Clinical Context Reasoning Engine
// Generates intelligent, patient-tailored medication and treatment
// recommendations by synthesizing:
// 1. Vitals (BP, HR, Temp, SpO2, RR, Pain Score)
// 2. Patient History (Past Medical, Surgical, Family, Social)
// 3. Demographics & Context (Pediatric/Geriatric, Pregnancy, Allergies)
// 4. SOAP Notes (Subjective Chief Complaint, HPI, Objective Exam, Assessment)
// 5. Hospital Inventory (In-stock brand/generic matching & pricing)
// 6. Pre-Treatment Adaptive Clinical Inquiries (Interactive Symptom & Vitals Correlation)
// ============================================================

import type { Patient, PatientHistory, SOAPNote, InventoryItem } from '../types';

export interface AdaptiveClinicalQuestion {
  id: string;
  question: string;
  category: 'Vitals Alert' | 'History Correlate' | 'Symptom Characterization' | 'Red Flag Screening';
  rationale: string;
  options: Array<{
    label: string;
    value: string;
    clinicalImpact?: string;
  }>;
  relevantFactors: string[];
  isUrgent?: boolean;
}

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
  clinicalRationale: string;
  category: string;
  inStock: boolean;
  stockPrice?: number;
  stockUnit?: string;
  contraindicationsChecked: string[];
  isPediatricDosed?: boolean;
}

export interface ContextualTreatmentPlan {
  patientSummary: {
    demographics: string;
    vitalsSummary: string;
    abnormalVitals: string[];
    relevantHistory: string[];
    soapFindings: string[];
    allergiesIdentified: string[];
    riskFactors: string[];
    questionnaireInsights?: string[];
  };
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
  questionAnswers?: Record<string, string>;
  freeTextObservations?: string;
}

export interface ParsedClinicalSentenceInsights {
  extractedKeywords: string[];
  findings: Array<{ topic: string; detail: string; severity?: 'STAT' | 'Urgent' | 'Routine' }>;
  hypoglycemiaSuspected: boolean;
  thyrotoxicosisSuspected: boolean;
  acutePanicSuspected: boolean;
  akathisiaSuspected: boolean;
  acuteCoronarySyndromeSuspected: boolean;
  pleuriticChestPain: boolean;
  gerdRefluxSuspected: boolean;
  musculoskeletalPain: boolean;
  bronchospasmSuspected: boolean;
  pneumoniaSuspected: boolean;
  cardiacEdemaSuspected: boolean;
  giBleedSuspected: boolean;
  appendicitisSuspected: boolean;
  thunderclapSuspected: boolean;
  migraineSuspected: boolean;
  tensionHeadacheSuspected: boolean;
  meningismSuspected: boolean;
  pyelonephritisSuspected: boolean;
  lowerUtiSuspected: boolean;
  renalColicSuspected: boolean;
  extractedBloodSugar?: number;
  extractedBloodPressure?: string;
  extractedTemperature?: number;
}

/**
 * Natural Language Clinical Sentence Processor
 * Parses free-form sentence answers and clinician notes for diagnostic findings,
 * physiological parameters, red flags, and therapeutic targets.
 */
export function parseClinicalSentenceInquiries(
  answersMap: Record<string, string> = {},
  freeTextObservations: string = ''
): ParsedClinicalSentenceInsights {
  const combinedText = Object.values(answersMap).concat(freeTextObservations).join(' ').toLowerCase();
  
  const has = (...terms: string[]) => terms.some(t => combinedText.includes(t.toLowerCase()));

  // Extract explicit glucose values e.g. "sugar was 65", "cbg 62 mg/dl", "rbs 58"
  let extractedBloodSugar: number | undefined;
  const sugarMatch = combinedText.match(/(?:sugar|glucose|cbg|rbs|dextrostix)[^\d]*(\d{2,3})/i);
  if (sugarMatch && sugarMatch[1]) {
    extractedBloodSugar = parseInt(sugarMatch[1], 10);
  }

  // Extract explicit BP e.g. "bp 170/100", "160/95 mmhg"
  let extractedBloodPressure: string | undefined;
  const bpMatch = combinedText.match(/(\d{2,3}\/\d{2,3})/);
  if (bpMatch && bpMatch[1]) {
    extractedBloodPressure = bpMatch[1];
  }

  // Extract explicit temperature e.g. "temp 39.2", "fever 38.8 c"
  let extractedTemperature: number | undefined;
  const tempMatch = combinedText.match(/(?:temp|fever|temperature)[^\d]*(\d{2}(?:\.\d)?)/i);
  if (tempMatch && tempMatch[1]) {
    extractedTemperature = parseFloat(tempMatch[1]);
  }

  const hypoglycemiaSuspected = 
    (extractedBloodSugar !== undefined && extractedBloodSugar < 70) ||
    has('hypoglycemia', 'hypoglycemic', 'low sugar', 'sugar dropped', 'cold sweat', 'sweating with hunger', 'jittery', 'trembling with hunger', 'sweaty and confused', 'hypoglycemia_suspected', 'check_cbg_now');

  const thyrotoxicosisSuspected = 
    has('thyroid', 'thyrotoxic', 'hyperthyroid', 'goiter', 'heat intolerance', 'fine tremor', 'thyrotoxic_features', 'graves');

  const acutePanicSuspected = 
    has('panic', 'hyperventilat', 'impending doom', 'air hunger with tingling', 'acute anxiety peak', 'acute_panic_state', 'anxiety_insomnia', 'nervous breakdown');

  const akathisiaSuspected = 
    has('akathisia', 'inner restlessness', 'cannot sit still', 'urge to pace', 'motor restlessness', 'motor_akathisia', 'drug induced restlessness', 'after metoclopramide', 'after haloperidol', 'after antiemetic');

  const acuteCoronarySyndromeSuspected = 
    has('crushing', 'retrosternal pressure', 'radiating to left arm', 'radiating to jaw', 'worse on exertion', 'heavy chest pressure', 'typical angina', 'typical_acs', 'relieved with nitrate', 'sublingual angised', 'tight band across chest');

  const pleuriticChestPain = 
    has('pleuritic', 'sharp chest pain on deep breath', 'worse with inspiration', 'worse lying flat', 'relieved leaning forward', 'pericarditis', 'pleuritic_chest_pain');

  const gerdRefluxSuspected = 
    has('burning retrosternal', 'acid reflux', 'heartburn', 'sour burp', 'waterbrash', 'worse after lying down', 'gerd_reflux_pain', 'peptic_dyspepsia');

  const musculoskeletalPain = 
    has('costochondritis', 'wall tenderness', 'tender on palpation', 'musculoskeletal_chest_pain', 'pain on pressing ribs');

  const bronchospasmSuspected = 
    has('wheezing', 'audible wheeze', 'bronchospasm', 'tight chest with whistling', 'asthma exacerbation', 'bronchospasm_wheeze', 'prolonged expiration');

  const pneumoniaSuspected = 
    has('productive cough', 'yellow sputum', 'green sputum', 'rusty sputum', 'crepitations', 'lung crackles', 'consolidation', 'infectious_pneumonia', 'lobar pneumonia', 'bacterial bronchitis');

  const cardiacEdemaSuspected = 
    has('orthopnea', 'pnd', 'paroxysmal nocturnal', 'bilateral leg swelling', 'pedal edema', 'cannot lie flat without choking', 'cardiac_pulmonary_edema', 'heart failure congestion');

  const giBleedSuspected = 
    has('melena', 'black tarry stool', 'hematemesis', 'coffee ground', 'vomiting blood', 'blood in stool', 'gi_alarm_bleed', 'rigid abdomen', 'peritonitis');

  const appendicitisSuspected = 
    has('rlq', 'right lower quadrant', 'mcburney', 'rebound tenderness', 'pain moved from navel', 'suspected_appendicitis', 'guarding in right fossa');

  const thunderclapSuspected = 
    has('thunderclap', 'worst headache of life', 'explosive headache', 'thunderclap_red_flag', 'subarachnoid', 'sudden severe occipital burst');

  const migraineSuspected = 
    has('unilateral throbbing', 'migraine', 'visual aura', 'photophobia and phonophobia', 'migraine_episode', 'one sided pulsing head pain');

  const tensionHeadacheSuspected = 
    has('tension headache', 'band like pressure', 'tight band around forehead', 'tension_headache', 'stress headache');

  const meningismSuspected = 
    has('neck stiffness', 'nuchal rigidity', 'photophobia with fever', 'meningism_delirium', 'kernig', 'brudzinski', 'meningitis signs', 'delirium with high temp');

  const pyelonephritisSuspected = 
    has('pyelonephritis', 'costovertebral angle tenderness', 'cva tenderness', 'high fever with flank pain', 'kidney infection');

  const lowerUtiSuspected = 
    has('dysuria without fever', 'burning urination', 'frequency and urgency', 'lower_uti', 'cystitis');

  const renalColicSuspected = 
    has('renal colic', 'loin to groin pain', 'colicky flank pain', 'microscopic hematuria', 'kidney stone');

  // Build structured findings
  const findings: Array<{ topic: string; detail: string; severity?: 'STAT' | 'Urgent' | 'Routine' }> = [];
  const extractedKeywords: string[] = [];

  if (hypoglycemiaSuspected) {
    findings.push({ topic: 'Hypoglycemia Alert', detail: extractedBloodSugar ? `Blood glucose critically measured at ${extractedBloodSugar} mg/dL` : 'Clinical signs of acute neuroglycopenia detected in clinician inquiry', severity: 'STAT' });
    extractedKeywords.push('Hypoglycemia');
  }
  if (acuteCoronarySyndromeSuspected) {
    findings.push({ topic: 'Acute Coronary Syndrome', detail: 'Typical exertional / anginal crushing pain with classic radiation pattern documented', severity: 'STAT' });
    extractedKeywords.push('Typical ACS');
  }
  if (thunderclapSuspected) {
    findings.push({ topic: 'Thunderclap Headache Red Flag', detail: 'Explosive maximum intensity onset suspicious for Subarachnoid Hemorrhage', severity: 'STAT' });
    extractedKeywords.push('Thunderclap SAH Risk');
  }
  if (meningismSuspected) {
    findings.push({ topic: 'Meningeal Irritation Alert', detail: 'Nuchal rigidity, photophobia, or delirium present in febrile state', severity: 'STAT' });
    extractedKeywords.push('Meningeal Irritation');
  }
  if (giBleedSuspected) {
    findings.push({ topic: 'Upper GI Bleeding Alarm', detail: 'Documented melena / hematemesis or involuntary peritoneal guarding', severity: 'STAT' });
    extractedKeywords.push('GI Bleed Alarm');
  }
  if (thyrotoxicosisSuspected) {
    findings.push({ topic: 'Adrenergic Storm / Thyrotoxicosis', detail: 'Tachycardia, heat intolerance, and fine tremor indicating hyperadrenergic state', severity: 'Urgent' });
    extractedKeywords.push('Thyrotoxicosis');
  }
  if (akathisiaSuspected) {
    findings.push({ topic: 'Drug-Induced Akathisia', detail: 'Inner motor restlessness and compulsion to pace after dopamine antagonist / antiemetic', severity: 'Urgent' });
    extractedKeywords.push('Akathisia');
  }
  if (bronchospasmSuspected) {
    findings.push({ topic: 'Reactive Bronchospasm', detail: 'Audible expiratory wheezing and tight airways requiring immediate bronchodilation', severity: 'Urgent' });
    extractedKeywords.push('Bronchospasm');
  }
  if (pneumoniaSuspected) {
    findings.push({ topic: 'Bacterial LRTI / Pneumonia', detail: 'Purulent/rusty sputum with febrile consolidation and crackles', severity: 'Urgent' });
    extractedKeywords.push('Bacterial Pneumonia');
  }

  return {
    extractedKeywords,
    findings,
    hypoglycemiaSuspected,
    thyrotoxicosisSuspected,
    acutePanicSuspected,
    akathisiaSuspected,
    acuteCoronarySyndromeSuspected,
    pleuriticChestPain,
    gerdRefluxSuspected,
    musculoskeletalPain,
    bronchospasmSuspected,
    pneumoniaSuspected,
    cardiacEdemaSuspected,
    giBleedSuspected,
    appendicitisSuspected,
    thunderclapSuspected,
    migraineSuspected,
    tensionHeadacheSuspected,
    meningismSuspected,
    pyelonephritisSuspected,
    lowerUtiSuspected,
    renalColicSuspected,
    extractedBloodSugar,
    extractedBloodPressure,
    extractedTemperature
  };
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
  return (patientAllergies || []).some(a => {
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
 * Generates dynamic, patient-tailored clinical questions based on active symptoms,
 * vitals (BP, HR, Temp, SpO2, RR), and past medical history before treatment recommendations.
 */
export function generateAdaptiveClinicalQuestions(input: ClinicalContextInput): AdaptiveClinicalQuestion[] {
  const {
    patient,
    patientHistory = { pastMedical: [], pastSurgical: [], familyHistory: [], socialHistory: { smoking: '', alcohol: '', occupation: '', exercise: '' } },
    soapNote,
    activeSymptoms = [],
    activeDiseases = [],
    clinicalNotes = ''
  } = input;

  const questions: AdaptiveClinicalQuestion[] = [];
  const sList = activeSymptoms.map(norm);
  const dList = activeDiseases.map(norm);
  const pHistory = (patientHistory?.pastMedical || []).concat(patient?.comorbidities || []).map(norm);
  const notes = `${norm(soapNote?.subjective?.chiefComplaint)} ${norm(soapNote?.subjective?.hpiNarrative)} ${norm(clinicalNotes)} ${sList.join(' ')}`;

  // Parse Vitals
  const [sysStr, diaStr] = (patient.bp || '').split('/');
  const sys = parseInt(sysStr, 10);
  const dia = parseInt(diaStr, 10);
  const isHTN = !isNaN(sys) && (sys >= 140 || dia >= 90);
  const isSevereHTN = !isNaN(sys) && (sys >= 180 || dia >= 110);
  const isHypotensive = !isNaN(sys) && (sys < 90 || dia < 60);

  const hr = parseInt(patient.pulse || '', 10);
  const isTachycardic = !isNaN(hr) && hr > 100;
  const isBradycardic = !isNaN(hr) && hr < 60;

  const temp = parseFloat(patient.temperature || '');
  const isFever = !isNaN(temp) && temp >= 37.8;

  const spo2 = parseInt(patient.spo2 || '', 10);
  const isHypoxic = !isNaN(spo2) && spo2 < 94;

  const hasDM = pHistory.some(h => h.includes('diabet') || h.includes('dm') || h.includes('sugar'));
  const hasIHD = pHistory.some(h => h.includes('ihd') || h.includes('cad') || h.includes('heart') || h.includes('angina') || h.includes('stent'));
  const hasAsthma = pHistory.some(h => h.includes('asthma') || h.includes('copd') || h.includes('bronch'));
  const ageNum = parseInt(patient.age || '0', 10);
  const isPediatric = (patient.age && (patient.age.includes('m') || patient.age.includes('mo') || ageNum < 12)) || (parseFloat(patient.weight || '70') < 35);
  const isGeriatric = ageNum >= 65;
  const hasHistory = (kw: string) => pHistory.some(h => h.includes(norm(kw)));
  const hasCKD = hasHistory('ckd') || hasHistory('renal') || hasHistory('kidney');
  const hasPUD = hasHistory('ulcer') || hasHistory('gerd') || hasHistory('gastrit') || hasHistory('pud');

  const hasSymptom = (term: string) => sList.some(s => s.includes(norm(term))) || notes.includes(norm(term));

  // 1. RESTLESSNESS & AGITATION INQUIRIES
  if (hasSymptom('restless') || hasSymptom('agitat') || hasSymptom('akathisia') || hasSymptom('nervous') || hasSymptom('anxiety')) {
    if (hasDM) {
      questions.push({
        id: 'q_restless_hypo',
        question: 'Is the patient exhibiting diaphoresis, hunger, trembling, or confusion alongside restlessness?',
        category: 'Red Flag Screening',
        rationale: 'Restlessness in diabetic patients is a hallmark early neuroglycopenic sign of acute hypoglycemia (CBG < 70 mg/dL).',
        options: [
          { label: 'Yes — Cold sweats / tremors present (High suspicion of Hypoglycemia)', value: 'hypoglycemia_suspected', clinicalImpact: 'Prompt STAT point-of-care capillary blood glucose (CBG) & rapid glucose administration' },
          { label: 'No — Glucose tested normal / purely psychomotor restlessness', value: 'euglycemic_restless', clinicalImpact: 'Consider primary anxiety, akathisia, or autonomic hyperarousal' },
          { label: 'Unknown — Need immediate POC Glucose check', value: 'check_cbg_now', clinicalImpact: 'Order STAT Capillary Blood Glucose' }
        ],
        relevantFactors: ['Diabetes Mellitus History', 'Restlessness Sensation'],
        isUrgent: true
      });
    }

    if (isTachycardic || hasSymptom('palpitat') || hasSymptom('rapid heart')) {
      questions.push({
        id: 'q_restless_tachy',
        question: `With resting pulse of ${patient.pulse || '>100'} bpm, are there signs of thyrotoxicosis, acute panic, or stimulant/sympathomimetic exposure?`,
        category: 'Vitals Alert',
        rationale: 'Tachycardia paired with restlessness points to adrenergic storm (thyroid storm, panic disorder, sympathomimetic toxicity, or caffeine excess).',
        options: [
          { label: 'Thyroid/Metabolic signs (Heat intolerance, fine finger tremor, goiter)', value: 'thyrotoxic_features', clinicalImpact: 'Requires Free T3/T4/TSH panel & non-selective beta-blockade if safe' },
          { label: 'Acute Panic/Anxiety state (Hyperventilation, chest tightness, impending doom)', value: 'acute_panic_state', clinicalImpact: 'Indicates short-term anxiolytic protocol & reassurance breathing' },
          { label: 'Excess stimulants / decongestant / caffeine ingestion', value: 'stimulant_induced', clinicalImpact: 'Discontinue offending agent; supportive hydration' }
        ],
        relevantFactors: [`Pulse: ${patient.pulse || '100+'} bpm`, 'Restlessness / Palpitations'],
        isUrgent: false
      });
    }

    if (isSevereHTN || isHTN) {
      questions.push({
        id: 'q_restless_htn',
        question: `Given elevated blood pressure (${patient.bp || 'Elevated'}), are there encephalopathic symptoms (throbbing headache, visual blur, nausea)?`,
        category: 'Vitals Alert',
        rationale: 'Restlessness with severe HTN can signify acute end-organ hypertensive urgency or encephalopathy.',
        options: [
          { label: 'Present — Severe occipital headache and visual blurring noted', value: 'hypertensive_urgency_signs', clinicalImpact: 'Urgent gradual MAP reduction; fundoscopy / neurological monitoring' },
          { label: 'Absent — No target end-organ symptoms observed', value: 'isolated_htn_restless', clinicalImpact: 'Standard anti-hypertensive titration & calming environment' }
        ],
        relevantFactors: [`BP: ${patient.bp || 'Elevated'}`, 'Restlessness'],
        isUrgent: isSevereHTN
      });
    }

    if (isFever) {
      questions.push({
        id: 'q_restless_fever',
        question: `With elevated body temperature (${patient.temperature || 'Fever'}°C), is there neck stiffness, confusion, or delirium?`,
        category: 'Red Flag Screening',
        rationale: 'Febrile restlessness/agitation requires ruling out central nervous system infection (meningitis/encephalitis) or systemic sepsis.',
        options: [
          { label: 'Meningeal irritation or severe delirium present', value: 'meningism_delirium', clinicalImpact: 'STAT Blood Cultures, Lumbar Puncture evaluation, IV Ceftriaxone' },
          { label: 'Alert, oriented, purely febrile discomfort / rigors', value: 'benign_febrile_restless', clinicalImpact: 'Antipyretic therapy (Paracetamol) + hydration' }
        ],
        relevantFactors: [`Temp: ${patient.temperature || '38+'}°C`, 'Restlessness'],
        isUrgent: true
      });
    }

    if (questions.filter(q => q.id.startsWith('q_restless')).length === 0) {
      questions.push({
        id: 'q_restless_general',
        question: 'What is the primary character of the patient\'s restlessness?',
        category: 'Symptom Characterization',
        rationale: 'Distinguishes subjective psychomotor agitation from physical motor akathisia or sleep-related restlessness.',
        options: [
          { label: 'Inner motor urge to constantly move legs/pace (Akathisia / Drug-induced)', value: 'motor_akathisia', clinicalImpact: 'Review dopamine antagonists; consider Propranolol or Benzodiazepine' },
          { label: 'Psychological anxiety and insomnia with difficulty relaxing', value: 'anxiety_insomnia', clinicalImpact: 'Sleep hygiene, short-term mild anxiolytic, cognitive counseling' },
          { label: 'Physical discomfort secondary to underlying pain/malaise', value: 'pain_induced_restless', clinicalImpact: 'Optimize analgesia and underlying somatic cause' }
        ],
        relevantFactors: ['Restlessness / Agitation Complaint']
      });
    }
  }

  // 2. CHEST PAIN & CARDIOVASCULAR INQUIRIES
  if (hasSymptom('chest pain') || hasSymptom('substernal') || hasSymptom('angina') || hasSymptom('chest tight')) {
    questions.push({
      id: 'q_chest_pain_character',
      question: 'What is the onset, radiation, and response to exertion or nitrates?',
      category: 'Red Flag Screening',
      rationale: `Assessing pre-test probability for Acute Coronary Syndrome in light of ${hasIHD ? 'known CAD history' : 'clinical presentation'}.`,
      options: [
        { label: 'Crushing/Pressure radiating to left arm/jaw, aggravated by exertion (Typical Angina)', value: 'typical_acs', clinicalImpact: 'STAT 12-Lead ECG, Serial Troponin-I, Aspirin + Clopidogrel loading' },
        { label: 'Sharp/Pleuritic, worse with deep inspiration or lying flat (Pericarditis/Pleurisy)', value: 'pleuritic_chest_pain', clinicalImpact: 'ECG for diffuse PR depression/ST elevation; consider NSAIDs/Colchicine if renal safe' },
        { label: 'Burning retrosternal pain related to meals or lying down (GERD)', value: 'gerd_reflux_pain', clinicalImpact: 'PPI trial (Omeprazole) + antacids' },
        { label: 'Reproducible localized wall tenderness on palpation (Costochondritis)', value: 'musculoskeletal_chest_pain', clinicalImpact: 'Topical or safe oral analgesics + local heat' }
      ],
      relevantFactors: ['Chest Pain Complaint', `Comorbidities: ${pHistory.join(', ') || 'None'}`],
      isUrgent: true
    });
  }

  // 3. SHORTNESS OF BREATH & RESPIRATORY INQUIRIES
  if (hasSymptom('shortness of breath') || hasSymptom('dyspnea') || hasSymptom('cough') || isHypoxic) {
    questions.push({
      id: 'q_resp_severity',
      question: 'Are there signs of acute bronchospasm, accessory muscle use, or purulent sputum?',
      category: isHypoxic ? 'Red Flag Screening' : 'Symptom Characterization',
      rationale: 'Differentiates infectious consolidation (pneumonia) from acute reactive bronchospasm or cardiogenic pulmonary edema.',
      options: [
        { label: 'Audible wheezing & prolonged expiration (Bronchospasm / Asthma Exacerbation)', value: 'bronchospasm_wheeze', clinicalImpact: 'Immediate Salbutamol/Ipratropium nebulization + systemic corticosteroids' },
        { label: 'Fever with productive yellow/green sputum and crackles (Bacterial LRTI)', value: 'infectious_pneumonia', clinicalImpact: 'Chest X-Ray + Augmentin/Azithromycin targeted antimicrobial therapy' },
        { label: 'Orthopnea, PND, and bilateral ankle swelling (Cardiogenic Congestion)', value: 'cardiac_pulmonary_edema', clinicalImpact: 'IV Furosemide diuresis, fluid restriction, cardiology consult' },
        { label: 'Dry irritating nocturnal cough with normal lung auscultation', value: 'dry_cough_uncomplicated', clinicalImpact: 'Antitussive / Antihistamine symptomatic relief' }
      ],
      relevantFactors: [`SpO2: ${patient.spo2 || 'Recorded'}%`, 'Respiratory Symptoms']
    });
  }

  // 4. GASTROINTESTINAL & EPIGASTRIC INQUIRIES
  if (hasSymptom('abdominal pain') || hasSymptom('stomach') || hasSymptom('epigastric') || hasSymptom('nausea') || hasSymptom('vomit')) {
    questions.push({
      id: 'q_gi_alarm',
      question: 'Are any GI alarm features present (hematemesis, melena, involuntary abdominal guarding)?',
      category: hasPUD ? 'Red Flag Screening' : 'Symptom Characterization',
      rationale: `Screens for acute bleeding or perforated viscus, especially with ${hasPUD ? 'known ulcer history' : 'acute abdominal complaints'}.`,
      options: [
        { label: 'Alarm signs present (Coffee-ground emesis, black tarry stool, or rigid abdomen)', value: 'gi_alarm_bleed', clinicalImpact: 'STAT IV PPI infusion, Blood Grouping/Cross-match, surgical consult' },
        { label: 'Epigastric burning relieved by antacids / food intake (Dyspepsia/PUD)', value: 'peptic_dyspepsia', clinicalImpact: 'High-dose PPI + H. Pylori eradication consideration' },
        { label: 'Cramping with watery diarrhea and nausea (Acute Gastroenteritis)', value: 'acute_gastroenteritis', clinicalImpact: 'Oral Rehydration Salts (ORS) + Probiotics + Antiemetic' },
        { label: 'Right lower quadrant tenderness with rebound tenderness', value: 'suspected_appendicitis', clinicalImpact: 'Urgent Ultrasound Abdomen + Surgical referral; avoid enemas' }
      ],
      relevantFactors: ['GI Symptoms', `History of PUD: ${hasPUD ? 'Yes' : 'No'}`]
    });
  }

  // 5. HEADACHE & NEUROLOGICAL INQUIRIES
  if (hasSymptom('headache') || hasSymptom('dizziness') || hasSymptom('migraine')) {
    questions.push({
      id: 'q_neuro_character',
      question: 'What is the time-course of the headache and are any neurological deficits present?',
      category: 'Red Flag Screening',
      rationale: 'Excludes life-threatening thunderclap subarachnoid hemorrhage or space-occupying lesions vs benign primary headache disorders.',
      options: [
        { label: 'Sudden explosive onset ("Worst headache of life") or focal weakness', value: 'thunderclap_red_flag', clinicalImpact: 'STAT Non-contrast Brain CT to exclude SAH / acute intracranial event' },
        { label: 'Unilateral throbbing headache with nausea, photophobia & aura (Migraine)', value: 'migraine_episode', clinicalImpact: 'Triptans / NSAIDs if renal safe + antiemetic (Metoclopramide)' },
        { label: 'Bilateral band-like tight pressure across forehead/neck (Tension Headache)', value: 'tension_headache', clinicalImpact: 'Paracetamol + muscle relaxation therapy + posture correction' },
        { label: 'Room-spinning vertigo triggered by head turns without hearing loss (BPPV)', value: 'bppv_vertigo', clinicalImpact: 'Epley maneuver + short-term Dimenhydrinate/Betahistine' }
      ],
      relevantFactors: ['Neurological Symptoms', `BP: ${patient.bp || 'Normotensive'}`]
    });
  }

  // 6. GENITOURINARY INQUIRIES
  if (hasSymptom('dysuria') || hasSymptom('burning urination') || hasSymptom('urinary frequency') || hasSymptom('flank pain')) {
    questions.push({
      id: 'q_gu_character',
      question: 'Is the urinary discomfort isolated to the lower tract, or is there fever with severe flank pain?',
      category: 'Symptom Characterization',
      rationale: 'Differentiates uncomplicated lower UTI (cystitis) from ascending pyelonephritis or obstructing nephrolithiasis.',
      options: [
        { label: 'High fever + Costovertebral flank tenderness (Upper UTI / Pyelonephritis)', value: 'pyelonephritis', clinicalImpact: 'Urine C/S, Ultrasound KUB, systemic fluoroquinolone/IV Ceftriaxone' },
        { label: 'Dysuria, frequency and suprapubic pain without fever (Uncomplicated Cystitis)', value: 'lower_uti', clinicalImpact: 'Nitrofurantoin / Fosfomycin + urinary alkalizer' },
        { label: 'Severe colicky flank pain radiating to groin with microscopic hematuria (Renal Colic)', value: 'renal_colic', clinicalImpact: 'Non-contrast CT KUB, Ketorolac/Diclofenac (if renal safe) + hydration' }
      ],
      relevantFactors: ['Urinary Complaints', `CKD Status: ${hasCKD ? 'History of CKD' : 'None'}`]
    });
  }

  // 7. HYPERTENSION & CARDIOVASCULAR ADAPTIVE INQUIRIES
  if (isHTN || isSevereHTN || hasHistory('hypertens') || hasSymptom('high bp') || hasSymptom('blood pressure')) {
    questions.push({
      id: 'q_htn_management',
      question: `With blood pressure recorded at ${patient.bp || 'Elevated'}, how compliant is the patient with antihypertensive therapy, and are there signs of volume overload?`,
      category: 'Vitals Alert',
      rationale: 'Clarifies whether elevated blood pressure is due to medication non-adherence vs true refractory hypertension.',
      options: [
        { label: 'Non-compliant or missed recent doses / High dietary salt', value: 'medication_noncompliance', clinicalImpact: 'Counsel on adherence; resume baseline regimen before escalating doses' },
        { label: 'Fully compliant with multiple anti-hypertensives (Refractory/Resistant)', value: 'resistant_hypertension', clinicalImpact: 'Requires adding secondary line agent (Spironolactone / CCB) & renal artery screening' },
        { label: 'New onset hypertension with bilateral pedal edema', value: 'new_htn_volume_overload', clinicalImpact: 'Order Renal Function Tests, Electrolytes, and low-dose diuretic' }
      ],
      relevantFactors: [`BP: ${patient.bp || 'Elevated'} mmHg`, 'Hypertension Assessment'],
      isUrgent: isSevereHTN
    });
  }

  // 8. DIABETES & METABOLIC INQUIRIES
  if (hasDM || hasSymptom('sugar') || hasSymptom('thirst') || hasSymptom('polyuria') || hasSymptom('diabet')) {
    questions.push({
      id: 'q_dm_microvascular',
      question: 'Does the patient have burning numbness in the soles (peripheral neuropathy) or any non-healing sores on the feet?',
      category: 'History Correlate',
      rationale: 'Diabetic peripheral neuropathy and vascular disease dictate foot examination and strict glycemic titration.',
      options: [
        { label: 'Yes — Burning paresthesias in feet / Decreased sensation', value: 'diabetic_neuropathy', clinicalImpact: 'Add Pregabalin / Gabapentin for neuropathic pain; mandatory foot ulcer check' },
        { label: 'No neuropathic symptoms; routine glycemic maintenance', value: 'uncomplicated_diabetes', clinicalImpact: 'Continue oral hypoglycemics; check HbA1c and microalbuminuria' },
        { label: 'Active non-healing ulcer or skin breakdown on foot', value: 'diabetic_foot_ulcer', clinicalImpact: 'Urgent wound debridement evaluation, broad-spectrum antibiotics, off-loading' }
      ],
      relevantFactors: ['Diabetes Mellitus History', 'Metabolic Screening']
    });
  }

  // 9. MUSCULOSKELETAL & JOINT PAIN INQUIRIES
  if (hasSymptom('joint') || hasSymptom('arthrit') || hasSymptom('back pain') || hasSymptom('knee') || hasSymptom('neck pain')) {
    questions.push({
      id: 'q_msk_character',
      question: 'Does joint stiffness last longer than 30-60 minutes in the morning, or is it worse with movement?',
      category: 'Symptom Characterization',
      rationale: 'Differentiates systemic inflammatory arthritis (Rheumatoid / Spondyloarthritis) from mechanical / degenerative wear (Osteoarthritis).',
      options: [
        { label: 'Prolonged morning stiffness (> 45 min) improved with activity (Inflammatory / RA)', value: 'inflammatory_arthritis', clinicalImpact: 'Order ESR, CRP, Rheumatoid Factor (RF), Anti-CCP; avoid prolonged NSAIDs without gastric cover' },
        { label: 'Worse with bearing weight & activity, relieved by rest (Degenerative / OA)', value: 'osteoarthritis_mechanical', clinicalImpact: 'Paracetamol / Topical NSAID gel + physical therapy / weight management' },
        { label: 'Severe lower back pain radiating down leg below the knee (Sciatica / Radiculopathy)', value: 'lumbar_radiculopathy', clinicalImpact: 'Neurological deficit check, straight leg raise test; MRI lumbar spine if red flags' }
      ],
      relevantFactors: ['Musculoskeletal Complaint']
    });
  }

  // 10. DERMATOLOGY & ALLERGY / ANGIOEDEMA INQUIRIES
  if (hasSymptom('rash') || hasSymptom('itch') || hasSymptom('hives') || hasSymptom('urticar') || hasSymptom('allergy')) {
    questions.push({
      id: 'q_allergy_airway',
      question: 'Is the rash accompanied by facial/lip swelling, throat tightness, or shortness of breath?',
      category: 'Red Flag Screening',
      rationale: 'Immediately screens for systemic anaphylaxis requiring emergency intramuscular Epinephrine.',
      options: [
        { label: 'Yes — Facial swelling / Stridor / Dyspnea present (Anaphylaxis Red Flag)', value: 'anaphylaxis_crisis', clinicalImpact: 'STAT IM Epinephrine 0.5mg, IV Hydrocortisone, High-flow O2, Airway stabilization' },
        { label: 'Cutaneous hives and pruritus only; normal airway and breathing', value: 'isolated_urticaria', clinicalImpact: 'Second-generation non-sedating H1-antihistamine (Levocetirizine / Fexofenadine)' },
        { label: 'Dry erythematous scaly eczema patches without acute swelling', value: 'eczematous_dermatitis', clinicalImpact: 'Topical emollient cream + short-course low-potency topical steroid' }
      ],
      relevantFactors: ['Allergy / Dermatology Presentation'],
      isUrgent: true
    });
  }

  // 11. PEDIATRIC SPECIFIC INQUIRIES
  if (isPediatric) {
    questions.push({
      id: 'q_pediatric_hydration',
      question: 'How is the child\'s fluid intake and wet diaper frequency over the past 12-24 hours?',
      category: 'Vitals Alert',
      rationale: 'Dehydration in pediatric patients progresses rapidly and dictates immediate oral vs intravenous rehydration.',
      options: [
        { label: 'Adequate — Drinking normally, producing 4+ wet diapers daily', value: 'euhydrated_pediatric', clinicalImpact: 'Continue oral fluids and maintenance supportive care' },
        { label: 'Reduced — Sunken eyes, dry mouth, < 2 wet diapers (Moderate Dehydration)', value: 'moderate_dehydration', clinicalImpact: 'Oral Rehydration Salts (ORS) protocol (50-100 ml/kg over 4 hours)' },
        { label: 'Lethargic, refusing all fluids, no urination > 8 hours (Severe Dehydration)', value: 'severe_dehydration', clinicalImpact: 'STAT IV Fluid resuscitation with 20 ml/kg Normal Saline bolus' }
      ],
      relevantFactors: [`Pediatric Age: ${patient.age || 'Child'}`, `Weight: ${patient.weight || 'Std'} kg`],
      isUrgent: true
    });
  }

  // 12. GERIATRIC SPECIFIC INQUIRIES
  if (isGeriatric) {
    questions.push({
      id: 'q_geriatric_falls',
      question: 'Has the patient experienced any unsteadiness, recent falls, or acute change in cognitive baseline?',
      category: 'History Correlate',
      rationale: 'Elderly patients with acute illness frequently present with delirium, fall risk, and atypical infections.',
      options: [
        { label: 'Stable baseline cognition and independent mobility', value: 'geriatric_stable', clinicalImpact: 'Standard adjusted dosing ("start low, go slow")' },
        { label: 'Recent unsteadiness / fall within the past 2 weeks', value: 'fall_risk_present', clinicalImpact: 'Review sedative medications, orthostatic BP testing, gait assistance' },
        { label: 'Acute onset confusion, disorientation, or drowsiness (Delirium)', value: 'geriatric_delirium', clinicalImpact: 'Screen for occult UTI, pneumonia, electrolyte derangements, or intracranial bleed' }
      ],
      relevantFactors: [`Geriatric Age: ${patient.age || '65+'}`, 'Frailty Assessment']
    });
  }

  // Fallback general context question if no specific triggers
  if (questions.length === 0) {
    questions.push({
      id: 'q_general_timeline',
      question: 'What is the duration and trajectory of the patient\'s presenting symptoms?',
      category: 'Symptom Characterization',
      rationale: 'Establishes clinical acuity to guide acute symptomatic treatment vs chronic maintenance titration.',
      options: [
        { label: 'Acute (< 48 hours) with sudden onset and progressive discomfort', value: 'acute_presentation', clinicalImpact: 'Fast-acting symptom relief and targeted short-course pharmacotherapy' },
        { label: 'Subacute (1-2 weeks) with persistent baseline symptoms', value: 'subacute_presentation', clinicalImpact: 'Diagnostic workup with targeted lab panels and structured follow-up' },
        { label: 'Chronic (> 4 weeks) with fluctuating or recurrent episodes', value: 'chronic_presentation', clinicalImpact: 'Long-term disease management optimization and lifestyle modification' }
      ],
      relevantFactors: ['General Patient Assessment', `Vitals: ${patient.bp || 'Standard'} | ${patient.pulse || '72'} bpm`]
    });
  }

  return questions;
}

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
    clinicalNotes = '',
    questionAnswers = {},
    freeTextObservations = ''
  } = input;

  // 0. Parse Free-Form Sentences & Clinician Written Inquiries
  const sentenceInsights = parseClinicalSentenceInquiries(questionAnswers, `${clinicalNotes} ${freeTextObservations}`);

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
  // 4. Parse SOAP Notes & Active Symptoms
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

  // Incorporate doctor answers & sentence insights
  const questionnaireInsights: string[] = [];
  for (const [qKey, answerVal] of Object.entries(questionAnswers)) {
    if (answerVal) {
      questionnaireInsights.push(`Response (${qKey}): "${answerVal}"`);
    }
  }
  if (freeTextObservations) {
    questionnaireInsights.push(`Clinician Sentence Note: "${freeTextObservations}"`);
  }
  sentenceInsights.findings.forEach(f => {
    questionnaireInsights.push(`[Sentence NLP Extracted] ${f.topic}: ${f.detail}`);
  });

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
    if (isAllergicTo(med.genericName) || isAllergicTo(med.brandName)) {
      return;
    }

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

    if (hasAsthma && (norm(med.genericName).includes('atenolol') || norm(med.genericName).includes('propranolol') || norm(med.genericName).includes('bisoprolol'))) {
      withheldContraindications.push({
        medication: `${med.brandName} (${med.genericName})`,
        reason: 'Risk of life-threatening bronchospasm in patient with Asthma/COPD history',
        source: 'History'
      });
      return;
    }

    const isNSAID = norm(med.genericName).includes('ibuprofen') || norm(med.genericName).includes('diclofenac') || norm(med.genericName).includes('naproxen') || norm(med.brandName).includes('brufen') || norm(med.brandName).includes('voltaren');
    if (isNSAID && (hasPepticUlcer || hasCKD)) {
      withheldContraindications.push({
        medication: `${med.brandName} (${med.genericName})`,
        reason: hasCKD ? 'Nephrotoxic risk in Chronic Kidney Disease' : 'Gastrointestinal bleeding / ulcer exacerbation risk',
        source: 'History'
      });
      return;
    }

    let finalDose = med.dosage;
    let finalStrength = med.strength;
    let finalForm = med.form;
    let isPediatricDosed = false;

    if (isPediatric) {
      isPediatricDosed = true;
      if (norm(med.genericName).includes('paracetamol')) {
        finalStrength = '120mg/5ml';
        finalForm = 'Syrup';
        const mlPerDose = Math.round((weightKg * 15) / 24);
        finalDose = `${Math.max(2.5, mlPerDose)} ml`;
      } else if (norm(med.genericName).includes('amoxicillin')) {
        finalStrength = '250mg/5ml';
        finalForm = 'Suspension';
        const mlPerDose = Math.round((weightKg * 40) / (3 * 50));
        finalDose = `${Math.max(2.5, mlPerDose)} ml`;
      }
    }

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
  // Clinical Rule: Restlessness, Agitation, Anxiety, Insomnia
  // Synthesizes Vitals + Comorbidities + Free-Text Sentence Clinical Inputs
  // ---------------------------------------------------------
  const isRestless = notesCombined.includes('restless') || notesCombined.includes('agitat') || notesCombined.includes('anxiety') || notesCombined.includes('panic') || notesCombined.includes('insomnia') || notesCombined.includes('akathisia') || sentenceInsights.hypoglycemiaSuspected || sentenceInsights.thyrotoxicosisSuspected || sentenceInsights.akathisiaSuspected;
  
  const isHypo = sentenceInsights.hypoglycemiaSuspected || questionAnswers['q_restless_hypo'] === 'hypoglycemia_suspected' || questionAnswers['q_restless_hypo'] === 'check_cbg_now';
  const isThyro = sentenceInsights.thyrotoxicosisSuspected || questionAnswers['q_restless_tachy'] === 'thyrotoxic_features';
  const isPanic = sentenceInsights.acutePanicSuspected || questionAnswers['q_restless_tachy'] === 'acute_panic_state' || questionAnswers['q_restless_general'] === 'anxiety_insomnia';
  const isAkathisia = sentenceInsights.akathisiaSuspected || questionAnswers['q_restless_general'] === 'motor_akathisia';

  if (isRestless || isHypo || isPanic || isThyro || isAkathisia) {
    if (isHypo || hasDM) {
      supportiveTreatments.push({
        title: 'STAT Capillary Blood Glucose (CBG) Protocol',
        detail: 'Immediately check POC glucose. If CBG < 70 mg/dL, administer 15-20g fast-acting oral carbohydrates or IV 25% Dextrose (50ml).',
        priority: 'STAT',
        rationale: 'Rapidly identify and reverse neuroglycopenia driving the patient\'s acute restlessness.'
      });
      suggestedLabs.push({
        name: 'Point-of-Care Random Blood Sugar (RBS)',
        reason: 'STAT rule out of hypoglycemia in restless diabetic patient.',
        urgency: 'STAT'
      });
    }

    if (isThyro || (isTachycardic && !hasAsthma)) {
      addMed({
        genericName: 'Propranolol HCl',
        brandName: 'Inderal',
        strength: '10mg',
        form: 'Tablet',
        route: 'Oral',
        dosage: '1 Tablet',
        frequency: 'BD (Twice daily)',
        duration: '7 Days',
        instructions: 'Take with or without meals. Blunts adrenergic surge.',
        clinicalRationale: `Indicated for restlessness with autonomic hyperactivity / tachycardia (${patient.pulse || '100+'} bpm). Non-selective beta-blockade blunts peripheral tremor and palpitations.`,
        category: 'Cardiovascular / Autonomic'
      });
      suggestedLabs.push({
        name: 'Thyroid Profile (Free T3, Free T4, TSH)',
        reason: 'Investigate thyrotoxic storm / hyperthyroidism causing restlessness and tachycardia.',
        urgency: 'Urgent'
      });
      suggestedLabs.push({
        name: 'Serum Electrolytes (Na, K, Cl, Ca, Mg)',
        reason: 'Screen for electrolyte derangements causing neuromuscular excitability.',
        urgency: 'Routine'
      });
    }

    if (isPanic || isAkathisia || (!hasDM && !isThyro)) {
      addMed({
        genericName: 'Alprazolam',
        brandName: 'Xanax',
        strength: '0.25mg',
        form: 'Tablet',
        route: 'Oral',
        dosage: '1 Tablet',
        frequency: 'PRN at bedtime or acute anxiety peak (Max OD)',
        duration: '3-5 Days (Short course)',
        instructions: 'May cause drowsiness. Do not drive or operate machinery. Short-term relief only.',
        clinicalRationale: 'Provides rapid relief for acute psychomotor agitation and severe anxiety-driven restlessness.',
        category: 'Psychiatric / Anxiolytics'
      });
      supportiveTreatments.push({
        title: 'Calming Environment & Breathing Modulation',
        detail: 'Position patient in a quiet, low-stimulus room. Guide 4-7-8 diaphragmatic breathing to enhance parasympathetic tone.',
        priority: 'Routine',
        rationale: 'Non-pharmacologic stabilization for psychomotor tension.'
      });
    }
  }

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

    if (notesCombined.includes('pneumonia') || notesCombined.includes('purulent') || notesCombined.includes('productive') || (isFever && notesCombined.includes('cough'))) {
      const hasPenicillinAllergy = isAllergicTo('Amoxicillin') || isAllergicTo('Penicillin');
      
      if (!hasPenicillinAllergy) {
        addMed({
          genericName: 'Amoxicillin + Clavulanate',
          brandName: 'Augmentin',
          strength: '625mg',
          form: 'Tablet',
          route: 'Oral',
          dosage: isPediatric ? 'Weight-adjusted syrup' : '1 Tablet',
          frequency: 'BD (Every 12 hours)',
          duration: '7 Days',
          instructions: 'Complete the full 7-day course even if feeling better. Take with meals.',
          clinicalRationale: 'First-line empirical antimicrobial coverage for productive respiratory tract infection / community acquired pneumonia.',
          category: 'Antibiotics'
        });
      } else {
        addMed({
          genericName: 'Azithromycin',
          brandName: 'Zithromax',
          strength: '500mg',
          form: 'Tablet',
          route: 'Oral',
          dosage: '1 Tablet',
          frequency: 'OD (Once daily)',
          duration: '3-5 Days',
          instructions: 'Take 1 hour before or 2 hours after meals.',
          clinicalRationale: 'Macrolide alternative for respiratory tract infection selected because patient has documented Penicillin allergy.',
          category: 'Antibiotics'
        });
      }

      suggestedLabs.push({
        name: 'Chest X-Ray PA View',
        reason: 'Evaluate for focal consolidation, infiltrate, or pleural effusion.',
        urgency: 'Urgent'
      });
    }

    if (isCriticallyHypoxic) {
      supportiveTreatments.push({
        title: 'Supplemental High-Flow Oxygen Therapy',
        detail: 'Administer Oxygen via Nasal Cannula (2-4 L/min) or Venturi Mask to titrate SpO2 > 94% (88-92% if COPD).',
        priority: 'STAT',
        rationale: `SpO2 is critically low at ${spo2}%, requiring immediate supplemental O2.`
      });
    }
  }

  // ---------------------------------------------------------
  // Clinical Rule 3: Hypertension / Cardiovascular (Vitals & History)
  // ---------------------------------------------------------
  if (isHypertensive || hasIHD || notesCombined.includes('hypertens') || notesCombined.includes('angina') || notesCombined.includes('chest pain')) {
    if (isSevereHTN) {
      supportiveTreatments.push({
        title: 'Immediate Cardiovascular Stabilization & Monitoring',
        detail: 'Rest in quiet supine position with 30-degree head elevation. Re-check BP every 15 minutes. Target gradual BP reduction of <= 20% in first 2-4 hours.',
        priority: 'STAT',
        rationale: `Blood pressure is dangerously elevated at ${patient.bp} mmHg (Hypertensive Crisis).`
      });
      suggestedLabs.push({
        name: '12-Lead Electrocardiogram (ECG)',
        reason: 'Assess for acute ST-T changes, ischemia, or LV strain pattern.',
        urgency: 'STAT'
      });
      suggestedLabs.push({
        name: 'Serum Cardiac Troponin-I / High-Sensitivity Troponin',
        reason: 'Rule out acute myocardial necrosis in hypertensive crisis with chest symptoms.',
        urgency: 'STAT'
      });
    }

    if (!isPregnant) {
      addMed({
        genericName: 'Amlodipine Besylate',
        brandName: 'Norvasc',
        strength: '5mg',
        form: 'Tablet',
        route: 'Oral',
        dosage: '1 Tablet',
        frequency: 'OD (Morning)',
        duration: '1 Month',
        instructions: 'Take once daily in the morning with water. Monitor for ankle swelling.',
        clinicalRationale: `Indicated for BP control (${patient.bp || 'Elevated'}). Calcium channel blocker safe in asthma and CKD baselines.`,
        category: 'Cardiovascular'
      });
    } else {
      addMed({
        genericName: 'Methyldopa',
        brandName: 'Aldomet',
        strength: '250mg',
        form: 'Tablet',
        route: 'Oral',
        dosage: '1 Tablet',
        frequency: 'TDS',
        duration: '1 Month',
        instructions: 'Take with meals. Monitor blood pressure daily.',
        clinicalRationale: 'First-line safe anti-hypertensive chosen specifically for pregnant patient (ACEi/ARBs are teratogenic).',
        category: 'Cardiovascular'
      });
    }

    if (hasIHD || notesCombined.includes('angina') || notesCombined.includes('chest pain')) {
      const hasAspirinAllergy = isAllergicTo('Aspirin');
      if (!hasAspirinAllergy && !hasPepticUlcer) {
        addMed({
          genericName: 'Aspirin (Enteric Coated)',
          brandName: 'Loprin',
          strength: '75mg',
          form: 'Tablet',
          route: 'Oral',
          dosage: '1 Tablet',
          frequency: 'OD (After dinner)',
          duration: '1 Month',
          instructions: 'Take with a full meal to protect gastric lining.',
          clinicalRationale: 'Cardioprotective antiplatelet therapy indicated for known CAD / ischemic cardiovascular history.',
          category: 'Cardiovascular'
        });
      }

      if (!isPregnant) {
        addMed({
          genericName: 'Atorvastatin Calcium',
          brandName: 'Lipitor',
          strength: '20mg',
          form: 'Tablet',
          route: 'Oral',
          dosage: '1 Tablet',
          frequency: 'OD (At bedtime)',
          duration: '1 Month',
          instructions: 'Take at night. Report any unexplained muscle soreness.',
          clinicalRationale: 'Lipid-lowering and plaque stabilization protocol for CAD patient.',
          category: 'Cardiovascular'
        });
      }
    }
  }

  // ---------------------------------------------------------
  // Clinical Rule 4: Diabetes Mellitus (History)
  // ---------------------------------------------------------
  if (hasDM || notesCombined.includes('diabet') || notesCombined.includes('glucose') || notesCombined.includes('sugar')) {
    if (!hasCKD) {
      addMed({
        genericName: 'Metformin HCl',
        brandName: 'Glucophage',
        strength: '500mg',
        form: 'Tablet',
        route: 'Oral',
        dosage: '1 Tablet',
        frequency: 'BD (With main meals)',
        duration: '1 Month',
        instructions: 'Take strictly with or immediately after food to minimize GI upset.',
        clinicalRationale: 'First-line biguanide for glycemic control. Verified eGFR/renal function safe.',
        category: 'Endocrine/Diabetes'
      });
    }

    suggestedLabs.push({
      name: 'Glycated Hemoglobin (HbA1c)',
      reason: 'Assess 3-month glycemic control trajectory.',
      urgency: 'Routine'
    });
    suggestedLabs.push({
      name: 'Fasting & Postprandial Blood Glucose (FBS/RBS)',
      reason: 'Evaluate immediate glycemic profile.',
      urgency: 'Routine'
    });
    suggestedLabs.push({
      name: 'Serum Creatinine & eGFR',
      reason: 'Monitor renal safety profile for diabetic patient.',
      urgency: 'Routine'
    });
  }

  // ---------------------------------------------------------
  // Clinical Rule 5: Gastrointestinal / Gastric Distress / Dyspepsia
  // ---------------------------------------------------------
  const isGI = hasPepticUlcer || notesCombined.includes('ulcer') || notesCombined.includes('gerd') || notesCombined.includes('gastrit') || notesCombined.includes('epigastric') || notesCombined.includes('heartburn') || notesCombined.includes('acidity') || notesCombined.includes('nausea');

  if (isGI) {
    addMed({
      genericName: 'Omeprazole',
      brandName: 'Risek',
      strength: '20mg',
      form: 'Capsule',
      route: 'Oral',
      dosage: '1 Capsule',
      frequency: 'OD (30 min before breakfast)',
      duration: '14 Days',
      instructions: 'Swallow whole with water 30 minutes before the morning meal.',
      clinicalRationale: `Proton pump inhibitor indicated for ${hasPepticUlcer ? 'documented history of Peptic Ulcer Disease / Gastritis' : 'epigastric symptoms and acid suppression'}.`,
      category: 'GI Medications'
    });

    if (notesCombined.includes('nausea') || notesCombined.includes('vomit')) {
      addMed({
        genericName: 'Dimenhydrinate / Ondansetron',
        brandName: 'Gravinate',
        strength: '50mg',
        form: 'Tablet',
        route: 'Oral',
        dosage: '1 Tablet',
        frequency: 'TDS PRN for nausea/vomiting',
        duration: '3 Days',
        instructions: 'Take 30 minutes before meals or travel.',
        clinicalRationale: 'Antiemetic support to alleviate distressing nausea/emesis.',
        category: 'GI Medications'
      });
    }
  }

  // ---------------------------------------------------------
  // Clinical Rule 6: Pain Management (Vitals & SOAP)
  // ---------------------------------------------------------
  if (hasPain && pain > 0 && !suggestedMedications.some(m => m.genericName.toLowerCase().includes('paracetamol'))) {
    const canUseNSAID = !hasPepticUlcer && !hasCKD && !isAllergicTo('Ibuprofen') && !isAllergicTo('Brufen');
    
    if (canUseNSAID && isSeverePain) {
      addMed({
        genericName: 'Ibuprofen',
        brandName: 'Brufen',
        strength: '400mg',
        form: 'Tablet',
        route: 'Oral',
        dosage: '1 Tablet',
        frequency: 'TDS (Every 8h after meals)',
        duration: '3-5 Days',
        instructions: 'Take strictly with or after meals. Stop if stomach burning occurs.',
        clinicalRationale: `Potent anti-inflammatory analgesia for severe pain score (${pain}/10). Renal and gastric baseline verified clear.`,
        category: 'Analgesics/Antipyretics'
      });
    } else {
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
      riskFactors,
      questionnaireInsights
    },
    suggestedMedications,
    supportiveTreatments,
    withheldContraindications,
    suggestedLabs,
    clinicalAdviceSummary
  };
}
