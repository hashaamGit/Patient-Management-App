export interface Patient {
  id?: string;
  name: string;
  mrn: string;
  age: string;
  gender: 'Male' | 'Female' | 'Other' | '';
  weight: string;
  bp: string;
  pulse: string;
  spo2: string;
  pregnancyStatus: 'N/A' | 'Pregnant' | 'Breastfeeding' | '';
  allergies: string;
  comorbidities: string[];
}

export interface PrescriptionItem {
  id: string;
  genericName: string;
  brandName: string;
  strength: string;
  form: string; // e.g., Tab, Cap, Syp
  dosage: string; // e.g., 1+0+1
  duration: string; // e.g., 5 days
  instructions: string;
}

export interface Prescription {
  items: PrescriptionItem[];
  advice: string;
  labs: string[];
  followUpDate: string;
  diagnosis: string[];
}

export interface CaseRecord {
  id: string;
  date: string;
  patient: Patient;
  prescription: Prescription;
}
