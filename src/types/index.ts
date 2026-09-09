// Hassan and Co. Healthcare Systems — Core Type Definitions

// ---- Patient & Demographics ----

export type Gender = 'Male' | 'Female' | 'Other' | '';
export type PregnancyStatus = 'N/A' | 'Pregnant' | 'Breastfeeding' | '';
export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-' | '';
export type CodeStatus = 'Full Code' | 'DNR' | 'DNR/DNI' | '';
export type AllergySeverity = 'Anaphylaxis' | 'Severe' | 'Moderate' | 'Mild' | 'Intolerance';

export interface Allergy {
  name: string;
  severity: AllergySeverity;
  reaction?: string;
}

export interface Patient {
  id?: string;
  name: string;
  mrn: string;
  age: string;
  gender: Gender;
  weight: string;
  height: string;
  bp: string;
  pulse: string;
  spo2: string;
  temperature: string;
  respiratoryRate: string;
  painScore: string; // 0-10
  bloodGroup: BloodGroup;
  pregnancyStatus: PregnancyStatus;
  codeStatus: CodeStatus;
  allergies: Allergy[];
  comorbidities: string[];
  emergencyContact: string;
  highRiskFlags: string[]; // e.g., 'Fall Risk', 'Renal Impairment'
}

// ---- Prescription & Medications ----

export type DosageForm = 'Tab' | 'Cap' | 'Syp' | 'Inj' | 'Susp' | 'Cream' | 'Ointment' | 'Drops' | 'Inhaler' | 'Nebulization' | 'Suppository' | 'Patch' | 'Gel' | 'Lotion';
export type Route = 'Oral' | 'IV' | 'IM' | 'SC' | 'Topical' | 'Inhaled' | 'PR' | 'SL' | 'Intranasal' | 'Ophthalmic' | 'Otic';
export type Frequency = 'OD' | 'BD' | 'TDS' | 'QDS' | 'PRN' | 'SOS' | 'STAT' | 'HS' | 'Q4H' | 'Q6H' | 'Q8H' | 'Q12H' | 'Weekly' | 'Alternate Days';

export interface PrescriptionItem {
  id: string;
  genericName: string;
  brandName: string;
  strength: string;
  form: DosageForm | string;
  route: Route | string;
  dosage: string;     // e.g., 1+0+1
  frequency: Frequency | string;
  duration: string;   // e.g., 5 days
  instructions: string;
  indication?: string; // e.g., For Fever
}

export interface Prescription {
  items: PrescriptionItem[];
  advice: string;
  labs: string[];
  followUpDate: string;
  diagnosis: string[];
}

// ---- Case Records ----

export interface CaseRecord {
  id: string;
  date: string; // ISO string
  patient: Patient;
  prescription: Prescription;
  soapNote?: SOAPNote;
  orders?: Order[];
}

// ---- SOAP Notes ----

export interface SOAPNote {
  id?: string;
  date?: string;
  subjective: {
    chiefComplaint: string;
    hpiNarrative: string;
    reviewOfSystems: Record<string, boolean>;
  };
  objective: {
    generalAppearance: string;
    vitalsSummary: string;
    physicalExam: Record<string, string>;
  };
  assessment: {
    diagnoses: string[];
    icdCodes: string[];
    differentials: string[];
  };
  plan: {
    medications: string;
    labsOrdered: string;
    imagingOrdered: string;
    referrals: string;
    followUp: string;
    patientEducation: string;
  };
}

// ---- Orders ----

export type OrderType = 'Lab' | 'Imaging' | 'Referral' | 'Nursing';
export type OrderUrgency = 'Routine' | 'Urgent' | 'STAT';
export type OrderStatus = 'Pending' | 'In Progress' | 'Completed' | 'Cancelled';

export interface Order {
  id: string;
  type: OrderType;
  name: string;
  urgency: OrderUrgency;
  status: OrderStatus;
  date: string;
  clinicalIndication?: string;
  notes?: string;
  results?: string;
}

// ---- Vitals & Labs ----

export interface VitalReading {
  timestamp: string;
  systolic: number;
  diastolic: number;
  heartRate: number;
  spo2: number;
  temperature: number;
  respiratoryRate: number;
  weight: number;
  painScore: number;
}

export type LabFlag = 'Normal' | 'Low' | 'High' | 'Critical';

export interface LabParameter {
  name: string;
  value: string;
  unit: string;
  referenceRange: string;
  flag: LabFlag;
}

export interface LabResult {
  id: string;
  panelName: string;
  category: string;
  date: string;
  status: 'normal' | 'abnormal' | 'critical';
  parameters: LabParameter[];
}

// ---- Diagnostic Engine ----

export interface SymptomCategory {
  system: string;
  icon: string;
  symptoms: string[];
}

export interface DiseaseEntry {
  name: string;
  domain: string;
  icdCode?: string;
}

export interface TreeOption {
  label: string;
  nextStep: number;
}

export interface TreeStep {
  question: string;
  options: TreeOption[];
}

export interface TerminalDiagnosis {
  diagnosis: string;
  confidence?: string;
  guidelines?: string;
  redFlags?: string[];
  medications: Array<{
    genericName: string;
    brandName: string;
    strength: string;
    form: string;
    dosage: string;
    duration: string;
    instructions: string;
  }>;
  investigations: string[];
  advice: string;
}

export interface DecisionTree {
  trigger: string;
  steps: Record<number, TreeStep>;
  terminal: Record<number, TerminalDiagnosis>;
}

// ---- Patient History ----

export interface PatientHistory {
  pastMedical: string[];
  pastSurgical: Array<{ procedure: string; date: string }>;
  familyHistory: Array<{ relation: string; condition: string }>;
  socialHistory: {
    smoking: string;
    alcohol: string;
    occupation: string;
    exercise: string;
  };
}

// ---- Doctor Profile ----

export interface DoctorProfile {
  name: string;
  credentials: string;
  registrationNo: string;
  specialty: string;
  clinicName: string;
  clinicAddress: string;
  phone: string;
}

// ---- UI State ----

export type AppView = 'dashboard' | 'workspace' | 'labs' | 'notes' | 'orders' | 'history' | 'settings';

export interface NEWS2Score {
  total: number;
  risk: 'Low' | 'Low-Medium' | 'Medium' | 'High';
  components: Record<string, number>;
}

// ---- Hospital Inventory & Pharmacy ----

export type InventoryCategory =
  | 'Pharmaceuticals'
  | 'Medical Machinery & Equipment'
  | 'Cleaning & Sanitization Supplies'
  | 'Hospital Electronics & IT'
  | 'Medical & Surgical Consumables'
  | 'Antibiotics'
  | 'Analgesics'
  | 'Cardiovascular'
  | 'Antidiabetic'
  | 'Respiratory'
  | 'IV Fluids'
  | 'Other';

export interface InventoryItem {
  id: string;
  name: string;
  category: InventoryCategory;
  stock: number;
  minStock: number;
  unit: string;
  batchNo: string;
  expiryDate: string;
  unitPrice: number;
  sellingPrice: number;
  equipmentStatus?: 'Operational' | 'Maintenance Due' | 'Under Repair';
  location?: string;
}
