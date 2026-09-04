export interface SymptomCategoryData {
  system: string;
  icon: string; // lucide-react icon name
  color: string; // tailwind color class
  symptoms: string[];
}

export const SYMPTOM_CATEGORIES: SymptomCategoryData[] = [
  {
    system: 'General',
    icon: 'Thermometer',
    color: 'text-red-500',
    symptoms: ['Fever', 'Fatigue', 'Weight Loss', 'Weight Gain', 'Night Sweats', 'Malaise', 'Anorexia', 'Chills', 'Lethargy']
  },
  {
    system: 'Head & Neuro',
    icon: 'Brain',
    color: 'text-purple-500',
    symptoms: ['Headache', 'Dizziness', 'Vertigo', 'Syncope', 'Seizures', 'Tremor', 'Numbness/Tingling', 'Visual Disturbance', 'Memory Loss', 'Photophobia', 'Neck Stiffness']
  },
  {
    system: 'ENT',
    icon: 'Ear',
    color: 'text-amber-500',
    symptoms: ['Sore Throat', 'Earache', 'Nasal Congestion', 'Epistaxis', 'Dysphagia', 'Hoarseness', 'Tinnitus', 'Snoring', 'Post-nasal Drip']
  },
  {
    system: 'Respiratory',
    icon: 'Wind',
    color: 'text-sky-500',
    symptoms: ['Cough (Dry)', 'Cough (Productive)', 'Shortness of Breath', 'Wheezing', 'Hemoptysis', 'Chest Tightness', 'Pleuritic Pain', 'Stridor']
  },
  {
    system: 'Cardiovascular',
    icon: 'Heart',
    color: 'text-red-600',
    symptoms: ['Chest Pain', 'Palpitations', 'Leg Swelling (Edema)', 'Orthopnea', 'PND (Paroxysmal Nocturnal Dyspnea)', 'Claudication', 'Cyanosis', 'Exertional Dyspnea']
  },
  {
    system: 'GI / Abdomen',
    icon: 'Apple',
    color: 'text-orange-500',
    symptoms: ['Abdominal Pain', 'Nausea', 'Vomiting', 'Diarrhea', 'Constipation', 'Heartburn/GERD', 'Hematemesis', 'Melena', 'Bloating', 'Jaundice', 'Rectal Bleeding', 'Dyspepsia', 'Loss of Appetite']
  },
  {
    system: 'Urological',
    icon: 'Droplets',
    color: 'text-blue-500',
    symptoms: ['Dysuria', 'Hematuria', 'Urinary Frequency', 'Urinary Urgency', 'Flank Pain', 'Incontinence', 'Oliguria', 'Polyuria', 'Nocturia', 'Urinary Retention']
  },
  {
    system: 'MSK (Musculoskeletal)',
    icon: 'Bone',
    color: 'text-stone-500',
    symptoms: ['Joint Pain', 'Back Pain', 'Muscle Pain/Myalgia', 'Joint Swelling', 'Morning Stiffness', 'Limb Weakness', 'Neck Pain', 'Shoulder Pain', 'Knee Pain', 'Hip Pain', 'Gait Abnormality']
  },
  {
    system: 'Dermatological',
    icon: 'Layers',
    color: 'text-pink-500',
    symptoms: ['Rash', 'Itching/Pruritus', 'Skin Lesion/Lump', 'Hair Loss/Alopecia', 'Nail Changes', 'Wound/Ulcer', 'Skin Discoloration', 'Dry Skin', 'Excessive Sweating']
  },
  {
    system: 'Psychiatric',
    icon: 'BrainCircuit',
    color: 'text-indigo-500',
    symptoms: ['Anxiety', 'Depression/Low Mood', 'Insomnia', 'Irritability', 'Confusion', 'Hallucinations', 'Suicidal Ideation', 'Panic Attacks', 'Agitation', 'Cognitive Decline']
  },
  {
    system: 'Endocrine / Metabolic',
    icon: 'Zap',
    color: 'text-yellow-500',
    symptoms: ['Polydipsia', 'Polyuria', 'Heat Intolerance', 'Cold Intolerance', 'Excessive Sweating', 'Menstrual Irregularity', 'Galactorrhea', 'Hirsutism', 'Tremor (fine)', 'Growth Abnormality']
  },
  {
    system: 'Hematologic / Lymph',
    icon: 'Droplet',
    color: 'text-rose-500',
    symptoms: ['Easy Bruising', 'Bleeding Tendency', 'Lymphadenopathy', 'Pallor', 'Petechiae', 'Prolonged Bleeding', 'Splenomegaly']
  }
];

export const ALL_SYMPTOMS: string[] = SYMPTOM_CATEGORIES.flatMap(category => category.symptoms);
