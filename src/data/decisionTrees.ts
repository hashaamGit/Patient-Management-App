import type { DecisionTree } from '../types';

export const DECISION_TREES: Record<string, DecisionTree> = {
  "Fever": {
    trigger: "Fever",
    steps: {
      1: {
        question: "What is the duration of the fever?",
        options: [
          { label: "Acute (< 7 days)", nextStep: 2 },
          { label: "Chronic (> 14 days)", nextStep: 3 }
        ]
      },
      2: {
        question: "Are there any specific associated symptoms?",
        options: [
          { label: "High grade with chills/rigors", nextStep: 4 },
          { label: "Burning micturition / frequency", nextStep: 97 },
          { label: "Associated with rash or bleeding", nextStep: 5 },
          { label: "Cough and shortness of breath", nextStep: 96 }
        ]
      },
      3: {
        question: "What is the fever pattern in the chronic phase?",
        options: [
          { label: "Stepladder pattern, abdominal pain", nextStep: 99 },
          { label: "Evening rise, night sweats, weight loss", nextStep: 98 }
        ]
      },
      4: {
        question: "What is the pattern of the chills?",
        options: [
          { label: "Alternate day pattern", nextStep: 95 },
          { label: "Continuous high grade", nextStep: 94 }
        ]
      },
      5: {
        question: "What type of rash/bleeding is present?",
        options: [
          { label: "Petechial rash, bleeding gums, retro-orbital pain", nextStep: 93 },
          { label: "Maculopapular rash, runny nose", nextStep: 92 }
        ]
      }
    },
    terminal: {
      99: {
        diagnosis: "Typhoid Fever",
        confidence: "85% - Likely",
        guidelines: "WHO Typhoid Guidelines 2023",
        redFlags: ["Intestinal perforation", "Altered sensorium"],
        medications: [
          { genericName: "Ceftriaxone", brandName: "Rocephin", strength: "1g", form: "Injection", dosage: "1g IV OD", duration: "7-10 days", instructions: "Administer IV over 30 mins" },
          { genericName: "Paracetamol", brandName: "Panadol", strength: "500mg", form: "Tablet", dosage: "1-2 tabs SOS", duration: "As needed", instructions: "Maximum 4g/day" }
        ],
        investigations: ["Blood Culture", "Typhidot/Widal Test", "CBC", "LFTs"],
        advice: "Ensure strict hygiene and sanitation. Consume only boiled/filtered water. Soft diet recommended."
      },
      98: {
        diagnosis: "Tuberculosis (Pulmonary/Extra-pulmonary)",
        confidence: "80% - Probable",
        guidelines: "National TB Control Program Pakistan",
        medications: [
          { genericName: "Rifampicin+Isoniazid+Pyrazinamide+Ethambutol", brandName: "Myrin-P", strength: "FDC", form: "Tablet", dosage: "Weight-based", duration: "2 months (Intensive)", instructions: "Empty stomach early morning" }
        ],
        investigations: ["Sputum AFB", "GeneXpert MTB/RIF", "Chest X-ray", "ESR"],
        advice: "Strict adherence to ATT is crucial. Screen close contacts. Report visual changes or jaundice."
      },
      97: {
        diagnosis: "Urinary Tract Infection (UTI)",
        confidence: "90% - Likely",
        medications: [
          { genericName: "Ciprofloxacin", brandName: "Novidat", strength: "500mg", form: "Tablet", dosage: "1 tab BD", duration: "5-7 days", instructions: "Avoid with dairy" },
          { genericName: "Flavoxate", brandName: "Urispas", strength: "200mg", form: "Tablet", dosage: "1 tab TDS", duration: "3-5 days", instructions: "For urinary spasms" }
        ],
        investigations: ["Urinalysis (R/E)", "Urine Culture and Sensitivity", "Ultrasound KUB"],
        advice: "Increase fluid intake. Maintain perineal hygiene."
      },
      96: {
        diagnosis: "Pneumonia",
        confidence: "85% - Probable",
        redFlags: ["Respiratory rate > 30", "Confusion", "Cyanosis"],
        medications: [
          { genericName: "Amoxicillin+Clavulanate", brandName: "Augmentin", strength: "1g", form: "Tablet", dosage: "1 tab BD", duration: "7 days", instructions: "Take with meals" },
          { genericName: "Azithromycin", brandName: "Azomax", strength: "500mg", form: "Tablet", dosage: "1 tab OD", duration: "3-5 days", instructions: "Take empty stomach" }
        ],
        investigations: ["Chest X-ray (PA view)", "CBC", "Sputum Culture"],
        advice: "Rest, hydrate, and monitor breathing. Return if shortness of breath worsens."
      },
      95: {
        diagnosis: "Malaria",
        confidence: "90% - Likely",
        medications: [
          { genericName: "Artemether+Lumefantrine", brandName: "Coartem", strength: "20/120mg", form: "Tablet", dosage: "4 tabs stat, 4 tabs after 8hrs, then 4 tabs BD", duration: "3 days", instructions: "Take with fatty food" },
          { genericName: "Paracetamol", brandName: "Panadol", strength: "500mg", form: "Tablet", dosage: "2 tabs TDS", duration: "As needed", instructions: "For fever control" }
        ],
        investigations: ["Malarial Parasite (MP) smear", "ICT Malaria", "CBC"],
        advice: "Use mosquito nets and repellants. Complete full course even if feeling better."
      },
      94: {
        diagnosis: "Viral Sepsis / Undifferentiated Viral Fever",
        confidence: "70% - Possible",
        medications: [
          { genericName: "Paracetamol", brandName: "Panadol", strength: "500mg", form: "Tablet", dosage: "1-2 tabs SOS", duration: "As needed", instructions: "Max 4g/day" }
        ],
        investigations: ["CBC", "CRP", "Blood Culture if indicated"],
        advice: "Ensure adequate rest and hydration. Monitor for any localizing signs."
      },
      93: {
        diagnosis: "Dengue Fever",
        confidence: "95% - Very Likely",
        redFlags: ["Mucosal bleeding", "Persistent vomiting", "Severe abdominal pain", "Lethargy"],
        medications: [
          { genericName: "Paracetamol", brandName: "Panadol", strength: "500mg", form: "Tablet", dosage: "1-2 tabs QDS", duration: "As needed", instructions: "Avoid NSAIDs/Aspirin completely" }
        ],
        investigations: ["CBC (Monitor Plt/Hct)", "Dengue NS1 Antigen", "Dengue IgM/IgG"],
        advice: "Hydrate aggressively with ORS/juices. Strict bed rest. Monitor platelets daily."
      },
      92: {
        diagnosis: "Viral Exanthem / URI",
        confidence: "80% - Probable",
        medications: [
          { genericName: "Paracetamol", brandName: "Panadol", strength: "500mg", form: "Tablet", dosage: "1 tab SOS", duration: "As needed", instructions: "" },
          { genericName: "Loratadine", brandName: "Softin", strength: "10mg", form: "Tablet", dosage: "1 tab OD", duration: "5 days", instructions: "For symptomatic relief of rash" }
        ],
        investigations: ["CBC"],
        advice: "Self-limiting condition. Isolate to prevent spread. Keep well hydrated."
      }
    }
  },

  "Chest Pain": {
    trigger: "Chest Pain",
    steps: {
      1: {
        question: "What is the character of the chest pain?",
        options: [
          { label: "Crushing / Squeezing / Heavy", nextStep: 2 },
          { label: "Sharp / Stabbing / Pleuritic", nextStep: 3 },
          { label: "Burning / Retrosternal", nextStep: 99 }
        ]
      },
      2: {
        question: "What is the onset and radiation?",
        options: [
          { label: "Sudden, severe, radiates to jaw/left arm, sweating", nextStep: 98 },
          { label: "Exertional, relieved quickly by rest/nitrates", nextStep: 97 }
        ]
      },
      3: {
        question: "Are there any specific associations or relieving factors?",
        options: [
          { label: "Associated with dyspnea/hemoptysis, calf swelling", nextStep: 96 },
          { label: "Positional, better when leaning forward", nextStep: 95 },
          { label: "Tender to touch locally on chest wall", nextStep: 94 }
        ]
      }
    },
    terminal: {
      99: {
        diagnosis: "Gastroesophageal Reflux Disease (GERD)",
        confidence: "90% - Likely",
        medications: [
          { genericName: "Omeprazole", brandName: "Risek", strength: "40mg", form: "Capsule", dosage: "1 cap OD", duration: "14 days", instructions: "Take 30 mins before breakfast" },
          { genericName: "Domperidone", brandName: "Motilium", strength: "10mg", form: "Tablet", dosage: "1 tab TDS", duration: "5 days", instructions: "Before meals" }
        ],
        investigations: ["ECG (Rule out cardiac)", "H. Pylori Antigen (Stool)"],
        advice: "Avoid spicy/oily food, caffeine, late night meals. Elevate head of bed."
      },
      98: {
        diagnosis: "Acute Coronary Syndrome (ACS) / STEMI",
        confidence: "95% - Critical",
        redFlags: ["Hemodynamic instability", "Ongoing ischemia"],
        guidelines: "AHA/ACC 2024",
        medications: [
          { genericName: "Aspirin", brandName: "Disprin", strength: "300mg", form: "Tablet", dosage: "300mg stat", duration: "Stat", instructions: "Chew immediately" },
          { genericName: "Clopidogrel", brandName: "Plavix", strength: "75mg", form: "Tablet", dosage: "300mg stat", duration: "Stat", instructions: "Swallow whole" },
          { genericName: "Nitroglycerin", brandName: "Angised", strength: "0.5mg", form: "Sublingual", dosage: "1 tab under tongue", duration: "Stat", instructions: "Repeat if pain persists up to 3 doses" }
        ],
        investigations: ["ECG (Stat)", "Troponin I/T", "Echocardiogram", "Lipid Profile"],
        advice: "IMMEDIATE ER TRANSFER. Do not walk/exert. Reassure the patient."
      },
      97: {
        diagnosis: "Stable Angina",
        confidence: "85% - Probable",
        medications: [
          { genericName: "Bisoprolol", brandName: "Concor", strength: "5mg", form: "Tablet", dosage: "1 tab OD", duration: "Ongoing", instructions: "Monitor pulse" },
          { genericName: "Nitroglycerin", brandName: "Angised", strength: "0.5mg", form: "Sublingual", dosage: "1 tab SOS", duration: "As needed", instructions: "For acute pain episodes" }
        ],
        investigations: ["ECG", "Exercise Tolerance Test (ETT)", "Echocardiogram", "Lipid Profile"],
        advice: "Avoid heavy exertion in cold weather. Optimize cardiac risk factors."
      },
      96: {
        diagnosis: "Pulmonary Embolism (PE)",
        confidence: "80% - Critical",
        redFlags: ["Hypoxia", "Tachycardia", "Hypotension"],
        medications: [
          { genericName: "Enoxaparin", brandName: "Clexane", strength: "60mg", form: "Injection", dosage: "1mg/kg SC BD", duration: "Bridge to oral", instructions: "Administer subcutaneously" }
        ],
        investigations: ["D-Dimer", "CT Pulmonary Angiography (CTPA)", "ECG (S1Q3T3)", "Doppler US Legs"],
        advice: "Admit immediately for anticoagulation and monitoring."
      },
      95: {
        diagnosis: "Acute Pericarditis",
        confidence: "75% - Probable",
        medications: [
          { genericName: "Ibuprofen", brandName: "Brufen", strength: "600mg", form: "Tablet", dosage: "1 tab TDS", duration: "1-2 weeks", instructions: "With food" },
          { genericName: "Colchicine", brandName: "Colchicine", strength: "0.5mg", form: "Tablet", dosage: "1 tab OD", duration: "3 months", instructions: "To prevent recurrence" }
        ],
        investigations: ["ECG (PR depression, diffuse ST elevation)", "Echocardiogram", "ESR/CRP"],
        advice: "Rest. Avoid strenuous activity until symptom resolution."
      },
      94: {
        diagnosis: "Costochondritis (Musculoskeletal)",
        confidence: "90% - Likely",
        medications: [
          { genericName: "Ibuprofen", brandName: "Brufen", strength: "400mg", form: "Tablet", dosage: "1 tab TDS", duration: "5-7 days", instructions: "After meals" },
          { genericName: "Diclofenac Gel", brandName: "Voltral Emulgel", strength: "1%", form: "Topical", dosage: "Apply locally BD", duration: "7 days", instructions: "Rub gently" }
        ],
        investigations: ["ECG (to rule out cardiac causes)", "Chest X-ray"],
        advice: "Apply warm compresses. Avoid heavy lifting. Usually resolves spontaneously."
      }
    }
  },

  "Headache": {
    trigger: "Headache",
    steps: {
      1: {
        question: "What is the onset of the headache?",
        options: [
          { label: "Thunderclap (Sudden & Maximal severity)", nextStep: 99 },
          { label: "Gradual or recurrent pattern", nextStep: 2 }
        ]
      },
      2: {
        question: "What is the location of the headache?",
        options: [
          { label: "Unilateral, throbbing", nextStep: 3 },
          { label: "Bilateral, band-like, pressing", nextStep: 98 },
          { label: "Unilateral, strictly around eye/orbit", nextStep: 97 },
          { label: "Frontal/Face pain, worse leaning forward", nextStep: 96 }
        ]
      },
      3: {
        question: "What are the associated features?",
        options: [
          { label: "Nausea, photophobia, aura", nextStep: 95 },
          { label: "High fever, neck stiffness, altered mental state", nextStep: 94 }
        ]
      }
    },
    terminal: {
      99: {
        diagnosis: "Subarachnoid Hemorrhage (SAH)",
        confidence: "High - Critical Red Flag",
        redFlags: ["Worst headache of life", "Neurological deficit", "Vomiting"],
        medications: [
          { genericName: "Nimodipine", brandName: "Nimotop", strength: "60mg", form: "Tablet", dosage: "60mg 4-hourly", duration: "21 days", instructions: "To prevent vasospasm (initiate in ER)" }
        ],
        investigations: ["CT Brain (Non-contrast) stat", "Lumbar Puncture (if CT negative)", "CT Angiography"],
        advice: "Emergency admission to ICU/Neurosurgery. Absolute bed rest."
      },
      98: {
        diagnosis: "Tension-Type Headache",
        confidence: "95% - Likely",
        medications: [
          { genericName: "Paracetamol+Caffeine", brandName: "Panadol Extra", strength: "500/65mg", form: "Tablet", dosage: "2 tabs SOS", duration: "As needed", instructions: "Maximum 8 tabs/day" },
          { genericName: "Naproxen", brandName: "Synflex", strength: "550mg", form: "Tablet", dosage: "1 tab BD", duration: "3-5 days", instructions: "With food" }
        ],
        investigations: ["Usually clinical diagnosis"],
        advice: "Manage stress. Ensure adequate sleep and hydration. Avoid overuse of painkillers."
      },
      97: {
        diagnosis: "Cluster Headache",
        confidence: "80% - Probable",
        medications: [
          { genericName: "Sumatriptan", brandName: "Imigran", strength: "6mg", form: "Injection", dosage: "6mg SC stat", duration: "For acute attack", instructions: "Max 2 doses/24hrs" },
          { genericName: "Verapamil", brandName: "Calan", strength: "80mg", form: "Tablet", dosage: "1 tab TDS", duration: "Prophylaxis", instructions: "Monitor BP/ECG" }
        ],
        investigations: ["MRI Brain (to rule out secondary causes if atypical)"],
        advice: "100% Oxygen therapy (12-15 L/min) is highly effective for acute attacks. Avoid alcohol during cluster periods."
      },
      96: {
        diagnosis: "Acute Sinusitis",
        confidence: "85% - Likely",
        medications: [
          { genericName: "Amoxicillin+Clavulanate", brandName: "Augmentin", strength: "1g", form: "Tablet", dosage: "1 tab BD", duration: "7 days", instructions: "Take with food" },
          { genericName: "Xylometazoline", brandName: "Otrivin", strength: "0.1%", form: "Nasal Drops", dosage: "2-3 drops per nostril TDS", duration: "Max 5 days", instructions: "Avoid prolonged use" }
        ],
        investigations: ["X-ray PNS", "CBC"],
        advice: "Steam inhalation twice daily. Stay hydrated."
      },
      95: {
        diagnosis: "Migraine",
        confidence: "90% - Likely",
        medications: [
          { genericName: "Sumatriptan", brandName: "Imigran", strength: "50mg", form: "Tablet", dosage: "1 tab at onset", duration: "Stat", instructions: "May repeat once after 2hrs" },
          { genericName: "Propranolol", brandName: "Inderal", strength: "40mg", form: "Tablet", dosage: "1 tab OD/BD", duration: "Prophylaxis", instructions: "Avoid in asthma" }
        ],
        investigations: ["Clinical diagnosis"],
        advice: "Rest in a quiet, dark room. Keep a headache diary to identify triggers (e.g., specific foods, stress)."
      },
      94: {
        diagnosis: "Meningitis / Encephalitis",
        confidence: "High - Critical",
        redFlags: ["Neck rigidity", "Photophobia", "Rash", "Seizures"],
        medications: [
          { genericName: "Ceftriaxone", brandName: "Rocephin", strength: "2g", form: "Injection", dosage: "2g IV BD", duration: "Empiric", instructions: "Administer stat" },
          { genericName: "Dexamethasone", brandName: "Decadron", strength: "10mg", form: "Injection", dosage: "10mg IV QID", duration: "4 days", instructions: "Give before/with first antibiotic dose" }
        ],
        investigations: ["Lumbar Puncture (CSF Analysis)", "Blood Cultures", "CT Brain (if signs of raised ICP)", "CBC"],
        advice: "Emergency admission required. Isolate if meningococcal suspected."
      }
    }
  },

  "Abdominal Pain": {
    trigger: "Abdominal Pain",
    steps: {
      1: {
        question: "Where is the pain predominantly located?",
        options: [
          { label: "Right Upper Quadrant (RUQ)", nextStep: 2 },
          { label: "Right Iliac Fossa (RIF)", nextStep: 3 },
          { label: "Epigastric", nextStep: 4 },
          { label: "Diffuse / Generalized", nextStep: 5 }
        ]
      },
      2: {
        question: "What are the RUQ pain associations?",
        options: [
          { label: "Fever, jaundice, positive Murphy's sign", nextStep: 99 }
        ]
      },
      3: {
        question: "What are the RIF pain associations?",
        options: [
          { label: "Nausea, vomiting, rebound tenderness", nextStep: 98 }
        ]
      },
      4: {
        question: "What is the character of the Epigastric pain?",
        options: [
          { label: "Burning, related to meals", nextStep: 97 },
          { label: "Severe, radiating to back, with vomiting", nextStep: 96 }
        ]
      },
      5: {
        question: "What are the Diffuse pain associations?",
        options: [
          { label: "Diarrhea, vomiting, crampy", nextStep: 95 },
          { label: "Distension, obstipation (no flatus)", nextStep: 94 }
        ]
      }
    },
    terminal: {
      99: {
        diagnosis: "Acute Cholecystitis / Cholangitis",
        confidence: "90% - Probable",
        redFlags: ["Charcot's triad (Fever, RUQ pain, Jaundice)", "Hypotension"],
        medications: [
          { genericName: "Ceftriaxone", brandName: "Rocephin", strength: "1g", form: "Injection", dosage: "1g IV BD", duration: "In-patient", instructions: "Administer IV" },
          { genericName: "Hyoscine Butylbromide", brandName: "Buscopan", strength: "20mg", form: "Injection", dosage: "1 ampoule IV SOS", duration: "For pain", instructions: "Administer slowly" }
        ],
        investigations: ["Ultrasound Abdomen (HBS)", "LFTs", "CBC", "Amylase/Lipase"],
        advice: "NPO (Nothing by mouth). Surgical consult for possible cholecystectomy."
      },
      98: {
        diagnosis: "Acute Appendicitis",
        confidence: "95% - Very Likely",
        redFlags: ["Rigidity", "High Fever (perforation risk)"],
        medications: [
          { genericName: "Metronidazole", brandName: "Flagyl", strength: "500mg", form: "Infusion", dosage: "500mg IV TDS", duration: "Pre-op", instructions: "" },
          { genericName: "Cefuroxime", brandName: "Zinacef", strength: "750mg", form: "Injection", dosage: "1.5g IV stat", duration: "Pre-op", instructions: "" }
        ],
        investigations: ["Ultrasound Abdomen/Pelvis", "CBC (leukocytosis)", "Urine RE (to rule out UTI)"],
        advice: "Urgent surgical referral. Keep NPO. Do not administer strong analgesics until surgical assessment."
      },
      97: {
        diagnosis: "Peptic Ulcer Disease (PUD) / Dyspepsia",
        confidence: "85% - Likely",
        medications: [
          { genericName: "Esomeprazole", brandName: "Nexum", strength: "40mg", form: "Capsule", dosage: "1 cap OD", duration: "4-8 weeks", instructions: "Empty stomach" },
          { genericName: "Sucralfate", brandName: "Ulsanic", strength: "1g/10ml", form: "Suspension", dosage: "2 tsp TDS", duration: "2 weeks", instructions: "1 hour before meals" }
        ],
        investigations: ["H. Pylori Antigen", "Endoscopy (if red flags like weight loss or anemia)"],
        advice: "Avoid NSAIDs, spicy food, and smoking. Small frequent meals."
      },
      96: {
        diagnosis: "Acute Pancreatitis",
        confidence: "90% - Probable",
        redFlags: ["Tachycardia", "Hypotension", "Decreased urine output"],
        medications: [
          { genericName: "Normal Saline/Ringer's Lactate", brandName: "IV Fluid", strength: "1000ml", form: "Infusion", dosage: "Aggressive IV hydration", duration: "24-48 hrs", instructions: "Monitor input/output" },
          { genericName: "Tramadol", brandName: "Tramal", strength: "50mg", form: "Injection", dosage: "50mg IV SOS", duration: "For pain", instructions: "Given slowly" }
        ],
        investigations: ["Serum Amylase/Lipase", "Ultrasound Abdomen", "LFTs", "CRP", "CT Abdomen (after 48h)"],
        advice: "NPO initially. Requires hospitalization and aggressive fluid resuscitation."
      },
      95: {
        diagnosis: "Acute Gastroenteritis",
        confidence: "95% - Likely",
        medications: [
          { genericName: "Oral Rehydration Salts", brandName: "ORS", strength: "Sachet", form: "Powder", dosage: "1 liter mix", duration: "Until diarrhea resolves", instructions: "Drink after every loose stool" },
          { genericName: "Saccharomyces boulardii", brandName: "Floratil", strength: "250mg", form: "Sachet", dosage: "1 sachet BD", duration: "5 days", instructions: "Mix in water" }
        ],
        investigations: ["Stool R/E", "CBC (if severe)"],
        advice: "Maintain hydration. Avoid dairy and high-sugar juices temporarily. Seek help if blood in stool."
      },
      94: {
        diagnosis: "Intestinal Obstruction",
        confidence: "90% - Critical",
        redFlags: ["Bilious/Feculent vomiting", "Tense abdomen"],
        medications: [
          { genericName: "IV Fluids", brandName: "Ringer's Lactate", strength: "1000ml", form: "Infusion", dosage: "Aggressive hydration", duration: "Stat", instructions: "" }
        ],
        investigations: ["X-ray Abdomen (Erect/Supine)", "CT Abdomen", "Electrolytes", "CBC"],
        advice: "NPO. Nasogastric tube insertion for decompression. Urgent surgical consult."
      }
    }
  },

  "Shortness of Breath": {
    trigger: "Shortness of Breath",
    steps: {
      1: {
        question: "What is the onset?",
        options: [
          { label: "Acute (Minutes to hours)", nextStep: 2 },
          { label: "Chronic (Weeks to months)", nextStep: 3 }
        ]
      },
      2: {
        question: "What are the acute associations?",
        options: [
          { label: "Sudden pleuritic chest pain, absent breath sounds", nextStep: 99 },
          { label: "Pleuritic pain, history of prolonged immobility/DVT", nextStep: 98 },
          { label: "Wheezing, history of allergies/asthma", nextStep: 97 },
          { label: "Fever, purulent sputum, productive cough", nextStep: 96 }
        ]
      },
      3: {
        question: "What is the chronic pattern?",
        options: [
          { label: "Exertional, chronic productive cough, heavy smoker", nextStep: 95 },
          { label: "Orthopnea, PND, bilateral pedal edema", nextStep: 94 },
          { label: "Fatigue, pallor, pica", nextStep: 93 }
        ]
      }
    },
    terminal: {
      99: {
        diagnosis: "Pneumothorax",
        confidence: "90% - Critical",
        medications: [
          { genericName: "Oxygen", brandName: "O2", strength: "100%", form: "Gas", dosage: "15 L/min NRBM", duration: "Stat", instructions: "Immediate supportive care" }
        ],
        investigations: ["Chest X-ray (PA erect) stat", "Arterial Blood Gas (ABG)"],
        advice: "Requires urgent needle decompression or chest tube if tension pneumothorax suspected."
      },
      98: {
        diagnosis: "Pulmonary Embolism (PE)",
        confidence: "85% - Critical",
        medications: [
          { genericName: "Rivaroxaban", brandName: "Xarelto", strength: "15mg", form: "Tablet", dosage: "15mg BD", duration: "21 days", instructions: "Then 20mg OD (if stable)" }
        ],
        investigations: ["CTPA", "D-Dimer", "ECG", "Echocardiogram"],
        advice: "Admit for monitoring and anticoagulation."
      },
      97: {
        diagnosis: "Acute Asthma Exacerbation",
        confidence: "95% - Likely",
        medications: [
          { genericName: "Salbutamol", brandName: "Ventolin", strength: "2.5mg/2.5ml", form: "Nebulizer Sol.", dosage: "Nebulize stat", duration: "Repeat every 20 mins x 3", instructions: "" },
          { genericName: "Prednisolone", brandName: "Deltacortril", strength: "5mg", form: "Tablet", dosage: "40-50mg stat", duration: "5-7 days", instructions: "Oral burst" }
        ],
        investigations: ["Peak Expiratory Flow Rate (PEFR)", "SpO2 Monitoring", "Chest X-ray (if infection suspected)"],
        advice: "Avoid known triggers. Ensure proper inhaler technique for maintenance therapy."
      },
      96: {
        diagnosis: "Community Acquired Pneumonia (CAP)",
        confidence: "90% - Likely",
        medications: [
          { genericName: "Moxifloxacin", brandName: "Avelox", strength: "400mg", form: "Tablet", dosage: "1 tab OD", duration: "7 days", instructions: "Take with plenty of water" },
          { genericName: "Paracetamol", brandName: "Panadol", strength: "500mg", form: "Tablet", dosage: "2 tabs SOS", duration: "As needed", instructions: "" }
        ],
        investigations: ["Chest X-ray", "CBC", "CRP", "Sputum C/S"],
        advice: "Rest and hydration. Deep breathing exercises."
      },
      95: {
        diagnosis: "Chronic Obstructive Pulmonary Disease (COPD)",
        confidence: "90% - Likely",
        medications: [
          { genericName: "Tiotropium", brandName: "Spiriva", strength: "18mcg", form: "Capsule/Inhaler", dosage: "1 puff OD", duration: "Chronic", instructions: "Use with Rotahaler" },
          { genericName: "Formoterol+Budesonide", brandName: "Symbicort", strength: "160/4.5mcg", form: "Inhaler", dosage: "2 puffs BD", duration: "Chronic", instructions: "Rinse mouth after use" }
        ],
        investigations: ["Spirometry", "Chest X-ray", "ABG (in exacerbation)"],
        advice: "Strict smoking cessation. Annual flu and pneumococcal vaccines."
      },
      94: {
        diagnosis: "Congestive Heart Failure (CHF)",
        confidence: "90% - Likely",
        medications: [
          { genericName: "Furosemide", brandName: "Lasix", strength: "40mg", form: "Tablet", dosage: "1 tab OD/BD", duration: "Chronic", instructions: "Take in the morning" },
          { genericName: "Spironolactone", brandName: "Aldactone", strength: "25mg", form: "Tablet", dosage: "1 tab OD", duration: "Chronic", instructions: "Monitor potassium" }
        ],
        investigations: ["Echocardiogram", "NT-proBNP", "Chest X-ray", "ECG", "Urea/Creatinine"],
        advice: "Fluid and salt restriction. Daily weight monitoring."
      },
      93: {
        diagnosis: "Severe Anemia",
        confidence: "95% - Likely",
        medications: [
          { genericName: "Iron Polymaltose", brandName: "Iberet Folic", strength: "Combination", form: "Tablet", dosage: "1 tab OD", duration: "3-6 months", instructions: "With vitamin C source" }
        ],
        investigations: ["CBC with Peripheral Smear", "Iron Studies", "Ferritin", "Stool for Occult Blood"],
        advice: "Increase intake of iron-rich foods (spinach, meat). Address underlying cause of blood loss."
      }
    }
  },

  "Cough": {
    trigger: "Cough",
    steps: {
      1: {
        question: "What is the duration of the cough?",
        options: [
          { label: "Acute (< 3 weeks)", nextStep: 2 },
          { label: "Chronic (> 3 weeks)", nextStep: 3 }
        ]
      },
      2: {
        question: "What is the nature of the sputum/associations?",
        options: [
          { label: "Clear/Dry, sore throat, coryza", nextStep: 99 },
          { label: "Purulent/yellow, high fever, dyspnea", nextStep: 98 }
        ]
      },
      3: {
        question: "What is the nature of the chronic sputum?",
        options: [
          { label: "Hemoptysis (blood), weight loss, night sweats", nextStep: 97 },
          { label: "Dry, worse at night/post-meal, acidic taste", nextStep: 96 },
          { label: "Productive, chronic smoker, exertional dyspnea", nextStep: 95 }
        ]
      }
    },
    terminal: {
      99: {
        diagnosis: "Upper Respiratory Tract Infection (URI)",
        confidence: "95% - Very Likely",
        medications: [
          { genericName: "Dextromethorphan", brandName: "Hydryllin", strength: "Syrup", form: "Liquid", dosage: "2 tsp TDS", duration: "5 days", instructions: "For dry cough" },
          { genericName: "Cetirizine", brandName: "Rigix", strength: "10mg", form: "Tablet", dosage: "1 tab HS", duration: "5 days", instructions: "May cause drowsiness" }
        ],
        investigations: ["Usually none needed"],
        advice: "Warm fluids, honey, and throat lozenges. Steam inhalation."
      },
      98: {
        diagnosis: "Lower Respiratory Tract Infection (Pneumonia/Bronchitis)",
        confidence: "85% - Probable",
        medications: [
          { genericName: "Azithromycin", brandName: "Azomax", strength: "500mg", form: "Tablet", dosage: "1 tab OD", duration: "3-5 days", instructions: "Take empty stomach" },
          { genericName: "Bromhexine", brandName: "Bisolvon", strength: "8mg", form: "Tablet", dosage: "1 tab TDS", duration: "5 days", instructions: "Mucolytic" }
        ],
        investigations: ["Chest X-ray", "CBC"],
        advice: "Stay hydrated to thin secretions."
      },
      97: {
        diagnosis: "Pulmonary Tuberculosis (TB)",
        confidence: "85% - Probable",
        redFlags: ["Massive hemoptysis", "Severe wasting"],
        medications: [
          { genericName: "ATT Regimen", brandName: "Myrin-P", strength: "FDC", form: "Tablet", dosage: "Weight based", duration: "6 months total", instructions: "DOTS protocol" }
        ],
        investigations: ["Sputum AFB x2", "GeneXpert MTB/RIF", "Chest X-ray", "ESR"],
        advice: "Strict isolation in early phase. Full compliance with DOTS is essential."
      },
      96: {
        diagnosis: "GERD-induced Cough",
        confidence: "80% - Probable",
        medications: [
          { genericName: "Pantoprazole", brandName: "Zopent", strength: "40mg", form: "Tablet", dosage: "1 tab OD", duration: "4 weeks", instructions: "Before breakfast" }
        ],
        investigations: ["Clinical trial of PPIs usually diagnostic"],
        advice: "Avoid eating 3 hours before bedtime. Elevate head of bed."
      },
      95: {
        diagnosis: "Chronic Bronchitis / COPD",
        confidence: "90% - Likely",
        medications: [
          { genericName: "Salmeterol+Fluticasone", brandName: "Seretide", strength: "250mcg", form: "Evohaler", dosage: "2 puffs BD", duration: "Chronic", instructions: "Rinse mouth" }
        ],
        investigations: ["Spirometry", "Chest X-ray"],
        advice: "Stop smoking immediately. Pulmonary rehabilitation."
      }
    }
  },

  "Dysuria": {
    trigger: "Burning Urination",
    steps: {
      1: {
        question: "What is the gender and context?",
        options: [
          { label: "Female Patient", nextStep: 2 },
          { label: "Male Patient", nextStep: 3 }
        ]
      },
      2: {
        question: "What are the associations (Female)?",
        options: [
          { label: "Frequency, urgency, suprapubic pain", nextStep: 99 },
          { label: "High fever, chills, flank pain/CVA tenderness", nextStep: 98 }
        ]
      },
      3: {
        question: "What are the associations (Male)?",
        options: [
          { label: "Urethral discharge, sexually active", nextStep: 97 },
          { label: "Perineal pain, fever, weak stream", nextStep: 96 },
          { label: "Colicky severe flank pain radiating to groin, hematuria", nextStep: 95 }
        ]
      }
    },
    terminal: {
      99: {
        diagnosis: "Uncomplicated Cystitis (Lower UTI)",
        confidence: "95% - Very Likely",
        medications: [
          { genericName: "Fosfomycin", brandName: "Monurol", strength: "3g", form: "Sachet", dosage: "1 sachet stat", duration: "Single dose", instructions: "Mix in water at bedtime" },
          { genericName: "Cranberry Extract", brandName: "Cranmax", strength: "Sachet", form: "Powder", dosage: "1 sachet BD", duration: "10 days", instructions: "Mix in glass of water" }
        ],
        investigations: ["Urine Routine Examination"],
        advice: "Drink plenty of water. Wipe front to back. Void after intercourse."
      },
      98: {
        diagnosis: "Acute Pyelonephritis",
        confidence: "90% - Probable",
        redFlags: ["Sepsis", "Vomiting/unable to take oral meds"],
        medications: [
          { genericName: "Ceftriaxone", brandName: "Rocephin", strength: "1g", form: "Injection", dosage: "1g IV BD", duration: "Initial therapy", instructions: "Switch to oral based on C/S" },
          { genericName: "Paracetamol", brandName: "Panadol", strength: "500mg", form: "Tablet", dosage: "2 tabs SOS", duration: "As needed", instructions: "" }
        ],
        investigations: ["Urine Culture", "CBC", "Blood Culture", "Ultrasound KUB"],
        advice: "Hospitalization may be required for IV antibiotics and fluids."
      },
      97: {
        diagnosis: "Urethritis (STI)",
        confidence: "85% - Probable",
        medications: [
          { genericName: "Azithromycin", brandName: "Zithromax", strength: "1g", form: "Tablet", dosage: "1g stat", duration: "Single dose", instructions: "For Chlamydia" },
          { genericName: "Cefixime", brandName: "Cefspan", strength: "400mg", form: "Capsule", dosage: "400mg stat", duration: "Single dose", instructions: "For Gonorrhea" }
        ],
        investigations: ["Urethral swab for gram stain/culture", "STI screening panel"],
        advice: "Treat partner simultaneously. Abstain from sexual activity until treated."
      },
      96: {
        diagnosis: "Acute Prostatitis",
        confidence: "85% - Probable",
        medications: [
          { genericName: "Ciprofloxacin", brandName: "Novidat", strength: "500mg", form: "Tablet", dosage: "1 tab BD", duration: "2-4 weeks", instructions: "Extended course needed" },
          { genericName: "Tamsulosin", brandName: "Harnal", strength: "0.4mg", form: "Capsule", dosage: "1 cap OD", duration: "1 month", instructions: "After meal" }
        ],
        investigations: ["Urine R/E and Culture", "Ultrasound Prostate/KUB", "PSA (delay until acute phase resolves)"],
        advice: "Warm sitz baths. Avoid prolonged sitting or bicycling."
      },
      95: {
        diagnosis: "Urolithiasis (Renal/Ureteric Colic)",
        confidence: "95% - Likely",
        medications: [
          { genericName: "Diclofenac", brandName: "Voltral", strength: "75mg", form: "Injection", dosage: "75mg IM stat", duration: "For acute pain", instructions: "" },
          { genericName: "Tamsulosin", brandName: "Harnal", strength: "0.4mg", form: "Capsule", dosage: "1 cap OD", duration: "2 weeks", instructions: "For medical expulsive therapy" }
        ],
        investigations: ["CT KUB (Non-contrast)", "Urine R/E", "Serum Creatinine"],
        advice: "Increase fluid intake to 2.5-3 Liters/day. Strain urine to catch stone."
      }
    }
  },

  "Joint Pain": {
    trigger: "Joint Pain",
    steps: {
      1: {
        question: "What is the distribution?",
        options: [
          { label: "Monoarticular (Single joint)", nextStep: 2 },
          { label: "Oligo/Polyarticular (Multiple joints)", nextStep: 3 }
        ]
      },
      2: {
        question: "What is the onset and pattern of the single joint?",
        options: [
          { label: "Acute, extremely painful, red, swollen (often big toe)", nextStep: 99 },
          { label: "Acute, fever, restricted range of motion", nextStep: 98 }
        ]
      },
      3: {
        question: "What is the pattern and stiffness of multiple joints?",
        options: [
          { label: "Symmetrical, small joints (hands/wrists), morning stiffness >1hr", nextStep: 97 },
          { label: "Asymmetrical, large weight-bearing joints, worse with activity", nextStep: 96 },
          { label: "Migratory, rash, fever, recent infection", nextStep: 95 }
        ]
      }
    },
    terminal: {
      99: {
        diagnosis: "Acute Gout",
        confidence: "95% - Very Likely",
        medications: [
          { genericName: "Colchicine", brandName: "Colchicine", strength: "0.5mg", form: "Tablet", dosage: "2 tabs stat, then 1 tab after 1hr", duration: "Acute phase", instructions: "Do not exceed max dose" },
          { genericName: "Naproxen", brandName: "Synflex", strength: "500mg", form: "Tablet", dosage: "1 tab BD", duration: "5-7 days", instructions: "With food" }
        ],
        investigations: ["Serum Uric Acid (may be normal in acute attack)", "Joint fluid aspirate (Needle crystals)"],
        advice: "Avoid red meat, seafood, and alcohol. Hydrate well. Do not start Allopurinol during an acute attack."
      },
      98: {
        diagnosis: "Septic Arthritis",
        confidence: "High - Critical",
        redFlags: ["Inability to bear weight", "High fever", "Immunocompromised"],
        medications: [
          { genericName: "Ceftriaxone", brandName: "Rocephin", strength: "2g", form: "Injection", dosage: "2g IV OD", duration: "2-4 weeks", instructions: "After aspiration" }
        ],
        investigations: ["Joint Aspiration (Synovial fluid analysis & culture)", "Blood Culture", "CBC", "CRP/ESR"],
        advice: "Orthopedic emergency. Urgent joint washout required to prevent cartilage destruction."
      },
      97: {
        diagnosis: "Rheumatoid Arthritis (RA)",
        confidence: "85% - Probable",
        guidelines: "ACR/EULAR 2023",
        medications: [
          { genericName: "Methotrexate", brandName: "Methotrexate", strength: "10mg", form: "Tablet", dosage: "10mg ONCE WEEKLY", duration: "Chronic", instructions: "Must co-prescribe Folic Acid" },
          { genericName: "Prednisolone", brandName: "Deltacortril", strength: "5mg", form: "Tablet", dosage: "10mg OD", duration: "Bridging therapy", instructions: "Taper as DMARD works" }
        ],
        investigations: ["Rheumatoid Factor (RF)", "Anti-CCP Antibodies", "X-ray Hands/Wrists", "ESR/CRP"],
        advice: "Refer to Rheumatologist for early aggressive DMARD therapy. Regular physiotherapy."
      },
      96: {
        diagnosis: "Osteoarthritis (OA)",
        confidence: "90% - Likely",
        medications: [
          { genericName: "Paracetamol", brandName: "Panadol", strength: "500mg", form: "Tablet", dosage: "2 tabs TDS", duration: "Ongoing", instructions: "First line" },
          { genericName: "Meloxicam", brandName: "Mobic", strength: "7.5mg", form: "Tablet", dosage: "1 tab OD", duration: "During flare", instructions: "With food" }
        ],
        investigations: ["X-ray of affected joint (Loss of joint space, osteophytes)"],
        advice: "Weight loss is critical. Non-weight-bearing exercises (swimming, cycling). Physiotherapy."
      },
      95: {
        diagnosis: "Systemic Lupus Erythematosus (SLE) / Reactive Arthritis",
        confidence: "75% - Possible",
        medications: [
          { genericName: "Hydroxychloroquine", brandName: "Plaquenil", strength: "200mg", form: "Tablet", dosage: "200mg BD", duration: "Chronic", instructions: "Annual eye exam required" }
        ],
        investigations: ["ANA profile", "Anti-dsDNA", "Urine RE (Proteinuria check)", "CBC"],
        advice: "Strict sun protection. Refer to Rheumatologist. Avoid stress."
      }
    }
  },

  "Dizziness": {
    trigger: "Dizziness",
    steps: {
      1: {
        question: "What type of dizziness is it?",
        options: [
          { label: "True Vertigo (Illusion of room spinning)", nextStep: 2 },
          { label: "Lightheadedness / Presyncope / Unsteadiness", nextStep: 3 }
        ]
      },
      2: {
        question: "What is the duration and trigger of the vertigo?",
        options: [
          { label: "Lasts seconds, triggered by specific head movements/rolling in bed", nextStep: 99 },
          { label: "Lasts hours, accompanied by tinnitus and fluctuating hearing loss", nextStep: 98 },
          { label: "Lasts days, severe, spontaneous, post-viral infection", nextStep: 97 }
        ]
      },
      3: {
        question: "What are the triggers for lightheadedness?",
        options: [
          { label: "Occurs upon standing up quickly", nextStep: 96 },
          { label: "Associated with sudden palpitations or chest pain", nextStep: 95 },
          { label: "Constant, associated with fatigue, pallor, heavy menses", nextStep: 94 }
        ]
      }
    },
    terminal: {
      99: {
        diagnosis: "Benign Paroxysmal Positional Vertigo (BPPV)",
        confidence: "95% - Very Likely",
        medications: [
          { genericName: "Betahistine", brandName: "Serc", strength: "16mg", form: "Tablet", dosage: "1 tab BD", duration: "2 weeks", instructions: "Take with meals" }
        ],
        investigations: ["Dix-Hallpike Maneuver (Clinical test)"],
        advice: "Perform Epley Maneuver for treatment. Avoid sudden head movements. Sleep with head slightly elevated."
      },
      98: {
        diagnosis: "Meniere's Disease",
        confidence: "85% - Probable",
        medications: [
          { genericName: "Betahistine", brandName: "Serc", strength: "24mg", form: "Tablet", dosage: "1 tab BD", duration: "Chronic", instructions: "" },
          { genericName: "Hydrochlorothiazide", brandName: "Dichlotride", strength: "25mg", form: "Tablet", dosage: "1 tab OD", duration: "Chronic", instructions: "Diuretic to reduce endolymph" }
        ],
        investigations: ["Audiometry", "MRI Brain (to rule out acoustic neuroma)"],
        advice: "Low salt diet is crucial. Avoid caffeine, alcohol, and stress."
      },
      97: {
        diagnosis: "Vestibular Neuritis",
        confidence: "90% - Likely",
        medications: [
          { genericName: "Prochlorperazine", brandName: "Stemetil", strength: "5mg", form: "Tablet", dosage: "1 tab TDS", duration: "3-5 days only", instructions: "For acute severe vomiting/vertigo" },
          { genericName: "Prednisolone", brandName: "Deltacortril", strength: "5mg", form: "Tablet", dosage: "10mg TDS", duration: "Taper over 10 days", instructions: "Helps speed recovery" }
        ],
        investigations: ["Head Impulse Test (Clinical)"],
        advice: "Vestibular rehabilitation exercises as soon as acute vomiting settles. Early mobilization is key."
      },
      96: {
        diagnosis: "Orthostatic Hypotension",
        confidence: "90% - Likely",
        medications: [
          { genericName: "Fludrocortisone", brandName: "Florinef", strength: "0.1mg", form: "Tablet", dosage: "1 tab OD", duration: "If non-pharm fails", instructions: "Monitor BP and potassium" }
        ],
        investigations: ["Orthostatic Vitals (Lying and standing BP)", "ECG"],
        advice: "Stand up slowly in stages. Increase fluid and salt intake. Review anti-hypertensive meds."
      },
      95: {
        diagnosis: "Cardiac Arrhythmia",
        confidence: "High - Requires workup",
        redFlags: ["Syncope", "Family history of sudden cardiac death"],
        medications: [
          { genericName: "Amiodarone/Beta-blockers", brandName: "Dependent on rhythm", strength: "Var.", form: "Tablet", dosage: "Cardiology consult", duration: "Ongoing", instructions: "Do not prescribe blindly" }
        ],
        investigations: ["ECG (Stat)", "24-Hour Holter Monitor", "Echocardiogram", "Electrolytes"],
        advice: "Refer to Cardiology immediately. Do not drive until cleared."
      },
      94: {
        diagnosis: "Anemia",
        confidence: "95% - Likely",
        medications: [
          { genericName: "Iron Bisglycinate", brandName: "Feroz", strength: "Capsule", form: "Capsule", dosage: "1 cap OD", duration: "3 months", instructions: "Take with orange juice" }
        ],
        investigations: ["CBC", "Ferritin", "Peripheral Smear"],
        advice: "Dietary optimization. Evaluate cause of blood loss (e.g., menorrhagia, GI bleed)."
      }
    }
  },

  "Rash": {
    trigger: "Rash",
    steps: {
      1: {
        question: "What is the primary morphology of the rash?",
        options: [
          { label: "Maculopapular (flat/raised red spots)", nextStep: 2 },
          { label: "Vesicular (fluid-filled blisters)", nextStep: 3 },
          { label: "Urticarial / Wheals (hives)", nextStep: 99 },
          { label: "Thick scaly plaques", nextStep: 98 }
        ]
      },
      2: {
        question: "What are the associations with the maculopapular rash?",
        options: [
          { label: "High fever, bleeding gums/petechiae, muscle aches", nextStep: 97 },
          { label: "Fever, coryza, cough, conjunctivitis (often in children)", nextStep: 96 },
          { label: "Started after taking a new medication (e.g., antibiotic)", nextStep: 95 }
        ]
      },
      3: {
        question: "What is the distribution of the vesicular rash?",
        options: [
          { label: "Strictly dermatomal (unilateral band), extremely painful", nextStep: 94 },
          { label: "Generalized, severe itching, worse at night, in web spaces", nextStep: 93 },
          { label: "Localized, weeping, crusting, flexural areas (creases)", nextStep: 92 }
        ]
      }
    },
    terminal: {
      99: {
        diagnosis: "Acute Urticaria (Allergic Reaction)",
        confidence: "95% - Likely",
        redFlags: ["Lip/tongue swelling", "Stridor", "Shortness of breath (Anaphylaxis)"],
        medications: [
          { genericName: "Fexofenadine", brandName: "Telfast", strength: "120mg", form: "Tablet", dosage: "1 tab OD", duration: "5-7 days", instructions: "Non-drowsy" },
          { genericName: "Hydrocortisone", brandName: "Solu-Cortef", strength: "100mg", form: "Injection", dosage: "100mg IV stat", duration: "If severe", instructions: "" }
        ],
        investigations: ["None usually needed for acute phase"],
        advice: "Avoid known triggers. Seek immediate emergency care if breathing difficulty occurs."
      },
      98: {
        diagnosis: "Psoriasis",
        confidence: "90% - Likely",
        medications: [
          { genericName: "Betamethasone+Calcipotriol", brandName: "Daivobet", strength: "Ointment", form: "Topical", dosage: "Apply OD", duration: "4 weeks", instructions: "Avoid face and flexures" }
        ],
        investigations: ["Clinical diagnosis", "Skin biopsy (rarely needed)"],
        advice: "Keep skin moisturized. Sun exposure in moderation helps. Refer to Dermatologist."
      },
      97: {
        diagnosis: "Dengue Hemorrhagic Fever",
        confidence: "High - Critical",
        medications: [
          { genericName: "Paracetamol", brandName: "Panadol", strength: "500mg", form: "Tablet", dosage: "1-2 tabs QDS", duration: "As needed", instructions: "Strict avoidance of NSAIDs" },
          { genericName: "IV Fluids", brandName: "Normal Saline", strength: "0.9%", form: "Infusion", dosage: "As per protocol", duration: "During critical phase", instructions: "Monitor hematocrit" }
        ],
        investigations: ["CBC (Serial Plt/Hct)", "Dengue NS1/IgM", "Ultrasound Abdomen (for third spacing)"],
        advice: "Admit for strict fluid management and monitoring."
      },
      96: {
        diagnosis: "Measles (Rubeola)",
        confidence: "90% - Probable",
        medications: [
          { genericName: "Vitamin A", brandName: "Vitamin A", strength: "200,000 IU", form: "Capsule", dosage: "1 cap stat, repeat next day", duration: "2 days", instructions: "Age-dependent dosing" },
          { genericName: "Paracetamol", brandName: "Panadol", strength: "Syrup", form: "Liquid", dosage: "10-15mg/kg", duration: "As needed", instructions: "" }
        ],
        investigations: ["Measles IgM (if confirmation needed)"],
        advice: "Isolate child. Report to local health authorities. Supportive care."
      },
      95: {
        diagnosis: "Drug Eruption (Maculopapular)",
        confidence: "85% - Likely",
        redFlags: ["Mucosal involvement", "Skin peeling (SJS/TEN)"],
        medications: [
          { genericName: "Loratadine", brandName: "Softin", strength: "10mg", form: "Tablet", dosage: "1 tab OD", duration: "Until resolved", instructions: "" },
          { genericName: "Hydrocortisone Cream", brandName: "Hydrocort", strength: "1%", form: "Topical", dosage: "Apply thinly BD", duration: "5 days", instructions: "For symptomatic relief" }
        ],
        investigations: ["CBC (Eosinophilia)"],
        advice: "Immediately STOP the offending drug. Document allergy in medical record."
      },
      94: {
        diagnosis: "Herpes Zoster (Shingles)",
        confidence: "95% - Very Likely",
        medications: [
          { genericName: "Acyclovir", brandName: "Zovirax", strength: "800mg", form: "Tablet", dosage: "800mg 5 times a day", duration: "7 days", instructions: "Start within 72 hrs of rash" },
          { genericName: "Pregabalin", brandName: "Zeegap", strength: "50mg", form: "Capsule", dosage: "1 cap OD/BD", duration: "For neuropathic pain", instructions: "Gradually titrate" }
        ],
        investigations: ["Clinical diagnosis"],
        advice: "Keep rash clean and dry. Avoid contact with pregnant women or unvaccinated infants."
      },
      93: {
        diagnosis: "Scabies",
        confidence: "90% - Likely",
        medications: [
          { genericName: "Permethrin", brandName: "Scabion", strength: "5%", form: "Lotion", dosage: "Apply neck down", duration: "Wash off after 8-12 hrs", instructions: "Repeat after 1 week" },
          { genericName: "Ivermectin", brandName: "Stromectol", strength: "3mg", form: "Tablet", dosage: "200mcg/kg stat", duration: "Single dose", instructions: "Repeat in 1 week if severe" }
        ],
        investigations: ["Clinical diagnosis (burrows, web spaces)"],
        advice: "Treat ALL household contacts simultaneously. Wash all bedding and clothes in hot water."
      },
      92: {
        diagnosis: "Atopic Dermatitis (Eczema)",
        confidence: "90% - Likely",
        medications: [
          { genericName: "Mometasone", brandName: "Metaz", strength: "0.1%", form: "Cream", dosage: "Apply thinly OD", duration: "7-14 days", instructions: "Use only on active flares" },
          { genericName: "Emollient", brandName: "Dermive", strength: "Lotion", form: "Lotion", dosage: "Apply liberally TDS", duration: "Ongoing", instructions: "Apply immediately after bathing" }
        ],
        investigations: ["Clinical diagnosis"],
        advice: "Avoid harsh soaps. Frequent moisturization is key to preventing flares."
      }
    }
  }
};
