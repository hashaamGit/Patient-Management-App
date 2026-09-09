import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  Patient, Prescription, PrescriptionItem, CaseRecord,
  SOAPNote, Order, PatientHistory,
  DoctorProfile, AppView, Allergy
} from '../types';

// ============================================================
// Initial State Defaults
// ============================================================

const initialPatient: Patient = {
  name: '', mrn: '', age: '', gender: '', weight: '', height: '',
  bp: '', pulse: '', spo2: '', temperature: '', respiratoryRate: '',
  painScore: '', bloodGroup: '', pregnancyStatus: '', codeStatus: '',
  allergies: [], comorbidities: [], emergencyContact: '', highRiskFlags: [],
};

const initialPrescription: Prescription = {
  items: [], advice: '', labs: [], followUpDate: '', diagnosis: [],
};

const initialSOAPNote: SOAPNote = {
  subjective: { chiefComplaint: '', hpiNarrative: '', reviewOfSystems: {} },
  objective: { generalAppearance: '', vitalsSummary: '', physicalExam: {} },
  assessment: { diagnoses: [], icdCodes: [], differentials: [] },
  plan: { medications: '', labsOrdered: '', imagingOrdered: '', referrals: '', followUp: '', patientEducation: '' },
};

const initialHistory: PatientHistory = {
  pastMedical: [],
  pastSurgical: [],
  familyHistory: [],
  socialHistory: { smoking: '', alcohol: '', occupation: '', exercise: '' },
};

const defaultDoctor: DoctorProfile = {
  name: 'Dr. Hassan Aqeel',
  credentials: 'MBBS, FCPS (Internal Medicine)',
  registrationNo: '54321-M',
  specialty: 'Internal Medicine / Consultant Physician',
  clinicName: 'Hassan and Co. Healthcare Systems',
  clinicAddress: 'Main Healthcare Boulevard, Suite 400, Lahore',
  phone: '+92 42 3578 9000',
};

export type UserRole = 'Doctor' | 'Nurse' | 'Pharmacist' | 'Admin' | 'Storekeeper';

export interface DoctorRecord {
  id: string;
  name: string;
  specialty: string;
  registrationNo: string;
  email: string;
  phone: string;
  active: boolean;
  department: string;
}

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
  unitPrice: number;     // Purchase / cost price in PKR
  sellingPrice: number;  // Retail / patient price in PKR
  equipmentStatus?: 'Operational' | 'Maintenance Due' | 'Under Repair';
  location?: string;
}

export interface StockLedgerEntry {
  id: string;
  date: string;
  itemId: string;
  itemName: string;
  type: 'Stock In' | 'Dispensed' | 'Damaged' | 'Adjustment';
  quantity: number;
  balanceAfter: number;
  user: string;
  unitPrice?: number;
  notes?: string;
}

export interface PatientRecord {
  id: string;
  mrn: string;
  name: string;
  age: string;
  gender: string;
  phone: string;
  bloodGroup: string;
  lastVisit: string;
  allergies: string[];
  diagnoses: string[];
  vitals?: { bp: string; temp: string; pulse: string; weight: string };
  pastCases?: CaseRecord[];
}

export interface DispensedRecord {
  id: string;
  patientName: string;
  date: string;
  items: Array<{ name: string; dosage: string; frequency: string; duration: string }>;
  dispensedBy: string;
  status: 'Dispensed' | 'Pending' | 'Verified';
}

const initialDoctorsList: DoctorRecord[] = [
  { id: 'doc-1', name: 'Dr. Hassan Aqeel', specialty: 'Internal Medicine', registrationNo: 'PMDC-54321-M', email: 'hassan@hassanco.health', phone: '+92 300 1122334', active: true, department: 'Medicine' },
  { id: 'doc-2', name: 'Dr. Fatima Al-Zahra', specialty: 'Pediatrics & Neonatology', registrationNo: 'PMDC-44912-P', email: 'fatima@hassanco.health', phone: '+92 301 2233445', active: true, department: 'Pediatrics' },
  { id: 'doc-3', name: 'Dr. Bilal Tariq', specialty: 'Cardiology', registrationNo: 'PMDC-89211-C', email: 'bilal@hassanco.health', phone: '+92 302 3344556', active: true, department: 'Cardiology' },
  { id: 'doc-4', name: 'Dr. Zainab Malik', specialty: 'General & Laparoscopic Surgery', registrationNo: 'PMDC-31209-S', email: 'zainab@hassanco.health', phone: '+92 303 4455667', active: true, department: 'Surgery' },
  { id: 'doc-5', name: 'Dr. Omar Farooq', specialty: 'Emergency & Trauma', registrationNo: 'PMDC-71933-E', email: 'omar@hassanco.health', phone: '+92 304 5566778', active: false, department: 'Emergency' },
];

const initialInventoryList: InventoryItem[] = [
  // Pharmaceuticals
  { id: 'inv-1', name: 'Amoxicillin + Clavulanate 625mg', category: 'Antibiotics', stock: 450, minStock: 100, unit: 'Tablets', batchNo: 'AC-2026-08', expiryDate: '2027-08-15', unitPrice: 28, sellingPrice: 35 },
  { id: 'inv-2', name: 'Paracetamol 500mg', category: 'Analgesics', stock: 1200, minStock: 250, unit: 'Tablets', batchNo: 'PCM-2026-01', expiryDate: '2028-01-30', unitPrice: 2.5, sellingPrice: 4 },
  { id: 'inv-3', name: 'Metformin HCl 500mg', category: 'Antidiabetic', stock: 520, minStock: 150, unit: 'Tablets', batchNo: 'MET-2025-11', expiryDate: '2027-05-20', unitPrice: 6, sellingPrice: 9 },
  { id: 'inv-4', name: 'Amlodipine 5mg', category: 'Cardiovascular', stock: 380, minStock: 100, unit: 'Tablets', batchNo: 'AML-2026-03', expiryDate: '2027-11-10', unitPrice: 8, sellingPrice: 12 },
  { id: 'inv-5', name: 'Salbutamol HFA Inhaler 100mcg', category: 'Respiratory', stock: 35, minStock: 20, unit: 'Inhalers', batchNo: 'SAL-2025-09', expiryDate: '2026-12-01', unitPrice: 280, sellingPrice: 340 },
  { id: 'inv-6', name: 'Ceftriaxone 1g IV Vial', category: 'Antibiotics', stock: 85, minStock: 30, unit: 'Vials', batchNo: 'CEF-2026-04', expiryDate: '2027-04-18', unitPrice: 140, sellingPrice: 185 },
  { id: 'inv-7', name: 'Normal Saline 0.9% 500ml', category: 'IV Fluids', stock: 180, minStock: 50, unit: 'Bags', batchNo: 'NS-2026-02', expiryDate: '2028-02-28', unitPrice: 75, sellingPrice: 95 },
  { id: 'inv-8', name: 'Omeprazole 20mg Capsules', category: 'Pharmaceuticals', stock: 600, minStock: 120, unit: 'Capsules', batchNo: 'OMP-2026-07', expiryDate: '2027-09-15', unitPrice: 14, sellingPrice: 20 },

  // Medical Machinery & Equipment
  { id: 'inv-m1', name: '12-Lead Diagnostic ECG Machine', category: 'Medical Machinery & Equipment', stock: 4, minStock: 2, unit: 'Units', batchNo: 'ECG-M-2025', expiryDate: '2032-12-31', unitPrice: 145000, sellingPrice: 160000, equipmentStatus: 'Operational', location: 'OPD Room 2 & Emergency' },
  { id: 'inv-m2', name: 'Biphasic Defibrillator with Monitor', category: 'Medical Machinery & Equipment', stock: 2, minStock: 1, unit: 'Units', batchNo: 'DEF-2024-B', expiryDate: '2034-01-01', unitPrice: 420000, sellingPrice: 450000, equipmentStatus: 'Operational', location: 'Resuscitation Bay' },
  { id: 'inv-m3', name: 'High-Vacuum Electric Suction Unit', category: 'Medical Machinery & Equipment', stock: 6, minStock: 2, unit: 'Units', batchNo: 'SUC-2025-V', expiryDate: '2030-06-30', unitPrice: 38000, sellingPrice: 45000, equipmentStatus: 'Operational', location: 'Procedure Room & Minor OT' },
  { id: 'inv-m4', name: 'Medical Oxygen Concentrator 10L', category: 'Medical Machinery & Equipment', stock: 5, minStock: 2, unit: 'Units', batchNo: 'O2C-2026-X', expiryDate: '2031-10-15', unitPrice: 110000, sellingPrice: 125000, equipmentStatus: 'Maintenance Due', location: 'High Dependency Unit' },

  // Hospital Electronics & IT
  { id: 'inv-e1', name: 'Multi-Parameter Patient Monitor 12"', category: 'Hospital Electronics & IT', stock: 8, minStock: 3, unit: 'Monitors', batchNo: 'MON-2025-E', expiryDate: '2032-05-20', unitPrice: 85000, sellingPrice: 95000, equipmentStatus: 'Operational', location: 'Triage & Recovery' },
  { id: 'inv-e2', name: 'Fingertip Pulse Oximeter OLED', category: 'Hospital Electronics & IT', stock: 24, minStock: 10, unit: 'Pieces', batchNo: 'POX-2026-F', expiryDate: '2029-03-31', unitPrice: 2200, sellingPrice: 2900, equipmentStatus: 'Operational', location: 'Nursing Stations' },
  { id: 'inv-e3', name: 'Thermal Prescription Barcode Printer', category: 'Hospital Electronics & IT', stock: 5, minStock: 2, unit: 'Printers', batchNo: 'PRN-2025-T', expiryDate: '2030-12-31', unitPrice: 18500, sellingPrice: 22000, equipmentStatus: 'Operational', location: 'Pharmacy Counter' },

  // Cleaning & Sanitization Supplies
  { id: 'inv-c1', name: 'Hospital Grade Surface Disinfectant 5L', category: 'Cleaning & Sanitization Supplies', stock: 45, minStock: 15, unit: 'Canisters', batchNo: 'DIS-2026-H', expiryDate: '2028-06-15', unitPrice: 2400, sellingPrice: 2800 },
  { id: 'inv-c2', name: 'Alcohol Based Hand Rub 70% 500ml', category: 'Cleaning & Sanitization Supplies', stock: 120, minStock: 40, unit: 'Bottles', batchNo: 'ABHR-2026', expiryDate: '2028-11-20', unitPrice: 350, sellingPrice: 420 },
  { id: 'inv-c3', name: 'Biohazard Heavy Duty Waste Bags (Yellow)', category: 'Cleaning & Sanitization Supplies', stock: 600, minStock: 150, unit: 'Pieces', batchNo: 'BIO-2026', expiryDate: '2030-12-31', unitPrice: 35, sellingPrice: 45 },

  // Medical & Surgical Consumables
  { id: 'inv-s1', name: 'IV Cannula 20G with Injection Port', category: 'Medical & Surgical Consumables', stock: 350, minStock: 100, unit: 'Pieces', batchNo: 'CAN-2026-20', expiryDate: '2029-08-31', unitPrice: 65, sellingPrice: 85 },
  { id: 'inv-s2', name: 'Sterile Surgical Latex Gloves (Size 7.5)', category: 'Medical & Surgical Consumables', stock: 480, minStock: 150, unit: 'Pairs', batchNo: 'GLV-2026-S', expiryDate: '2029-04-15', unitPrice: 55, sellingPrice: 75 },
  { id: 'inv-s3', name: 'Sterile Gauze Pads 10x10cm', category: 'Medical & Surgical Consumables', stock: 420, minStock: 100, unit: 'Packs', batchNo: 'GP-2025-12', expiryDate: '2029-12-31', unitPrice: 45, sellingPrice: 60 },
  { id: 'inv-s4', name: 'Disposable Syringes 5ml (Luer Lock)', category: 'Medical & Surgical Consumables', stock: 850, minStock: 200, unit: 'Pieces', batchNo: 'SYR-2026-05', expiryDate: '2030-05-01', unitPrice: 15, sellingPrice: 20 },
  { id: 'inv-s5', name: 'Foley 2-Way Catheter 16Fr Siliconized', category: 'Medical & Surgical Consumables', stock: 75, minStock: 25, unit: 'Pieces', batchNo: 'FOL-2026-16', expiryDate: '2028-09-30', unitPrice: 190, sellingPrice: 240 },
];

const initialLedger: StockLedgerEntry[] = [
  { id: 'led-1', date: '2026-09-08T09:30:00.000Z', itemId: 'inv-1', itemName: 'Amoxicillin + Clavulanate 625mg', type: 'Stock In', quantity: 500, balanceAfter: 500, user: 'Zahid Khan (Storekeeper)', notes: 'PO-2026-88 Received from Central Depot' },
  { id: 'led-2', date: '2026-09-08T11:15:00.000Z', itemId: 'inv-1', itemName: 'Amoxicillin + Clavulanate 625mg', type: 'Dispensed', quantity: -30, balanceAfter: 470, user: 'Pharm. Ahmed', notes: 'Dispensed to OPD-91204' },
  { id: 'led-3', date: '2026-09-08T14:45:00.000Z', itemId: 'inv-1', itemName: 'Amoxicillin + Clavulanate 625mg', type: 'Dispensed', quantity: -20, balanceAfter: 450, user: 'Pharm. Ahmed', notes: 'Dispensed to OPD-91208' },
  { id: 'led-4', date: '2026-09-08T10:00:00.000Z', itemId: 'inv-m1', itemName: '12-Lead Diagnostic ECG Machine', type: 'Stock In', quantity: 4, balanceAfter: 4, user: 'Zahid Khan (Storekeeper)', notes: 'Capital asset installation verified' },
];

const initialPatientsList: PatientRecord[] = [
  {
    id: 'pat-1',
    mrn: 'MRN-2026-1041',
    name: 'Muhammad Aslam',
    age: '58y',
    gender: 'Male',
    phone: '+92 300 5566771',
    bloodGroup: 'B+',
    lastVisit: '2026-09-05',
    allergies: ['Penicillin'],
    diagnoses: ['Essential Hypertension', 'Type 2 Diabetes Mellitus'],
    vitals: { bp: '138/86', temp: '36.8', pulse: '76', weight: '78' }
  },
  {
    id: 'pat-2',
    mrn: 'MRN-2026-1042',
    name: 'Ayesha Bibi',
    age: '34y',
    gender: 'Female',
    phone: '+92 301 6677882',
    bloodGroup: 'O+',
    lastVisit: '2026-09-07',
    allergies: [],
    diagnoses: ['Acute Bronchitis', 'Mild Dehydration'],
    vitals: { bp: '115/75', temp: '37.9', pulse: '88', weight: '62' }
  },
  {
    id: 'pat-3',
    mrn: 'MRN-2026-1043',
    name: 'Tariq Mehmood',
    age: '67y',
    gender: 'Male',
    phone: '+92 302 7788993',
    bloodGroup: 'A+',
    lastVisit: '2026-09-08',
    allergies: ['Aspirin', 'NSAIDs'],
    diagnoses: ['Ischemic Heart Disease', 'Osteoarthritis of Knees'],
    vitals: { bp: '142/90', temp: '36.6', pulse: '70', weight: '84' }
  },
  {
    id: 'pat-4',
    mrn: 'MRN-2026-1044',
    name: 'Fatima Noor',
    age: '8y',
    gender: 'Female',
    phone: '+92 303 8899004',
    bloodGroup: 'AB+',
    lastVisit: '2026-09-06',
    allergies: [],
    diagnoses: ['Upper Respiratory Infection', 'Tonsillitis'],
    vitals: { bp: '100/65', temp: '38.4', pulse: '104', weight: '24' }
  },
  {
    id: 'pat-5',
    mrn: 'MRN-2026-1045',
    name: 'Abdul Rehman',
    age: '45y',
    gender: 'Male',
    phone: '+92 304 9900115',
    bloodGroup: 'O-',
    lastVisit: '2026-09-04',
    allergies: ['Sulfa Drugs'],
    diagnoses: ['Gastroesophageal Reflux Disease (GERD)'],
    vitals: { bp: '122/80', temp: '36.7', pulse: '74', weight: '73' }
  }
];

// ============================================================
// Store Interface
// ============================================================

interface AppState {
  // Navigation
  activeView: AppView;
  sidebarCollapsed: boolean;
  setActiveView: (view: AppView) => void;
  toggleSidebar: () => void;

  // Patient
  patient: Patient;
  setPatientField: (field: keyof Patient, value: any) => void;
  setPatientAllergies: (allergies: Allergy[]) => void;
  resetPatient: () => void;

  // Prescription
  prescription: Prescription;
  addPrescriptionItem: (item: Omit<PrescriptionItem, 'id'>) => void;
  removePrescriptionItem: (id: string) => void;
  updatePrescriptionItem: (id: string, updates: Partial<PrescriptionItem>) => void;
  setAdvice: (advice: string) => void;
  addLab: (lab: string) => void;
  removeLab: (lab: string) => void;
  addDiagnosis: (diagnosis: string) => void;
  removeDiagnosis: (diagnosis: string) => void;
  setFollowUpDate: (date: string) => void;
  resetPrescription: () => void;

  // SOAP Notes
  soapNote: SOAPNote;
  updateSOAPSection: (section: keyof SOAPNote, data: any) => void;
  resetSOAPNote: () => void;

  // Orders
  orders: Order[];
  addOrder: (order: Omit<Order, 'id' | 'date' | 'status'>) => void;
  updateOrderStatus: (id: string, status: Order['status']) => void;
  removeOrder: (id: string) => void;

  // Patient History
  patientHistory: PatientHistory;
  updatePatientHistory: (updates: Partial<PatientHistory>) => void;

  // Cases
  savedCases: CaseRecord[];
  saveCurrentCase: () => void;
  loadCase: (id: string) => void;
  deleteCase: (id: string) => void;

  // Doctor Profile
  doctorProfile: DoctorProfile;
  updateDoctorProfile: (updates: Partial<DoctorProfile>) => void;

  // Session
  clearSession: () => void;

  // Auth & RBAC
  currentUser: { name: string; role: UserRole } | null;
  login: (name: string, role: UserRole) => void;
  logout: () => void;

  // Doctor Management (Admin)
  doctorsList: DoctorRecord[];
  addDoctor: (doctor: Omit<DoctorRecord, 'id'>) => void;
  deleteDoctor: (id: string) => void;
  toggleDoctorStatus: (id: string) => void;

  // Inventory Management (Storekeeper)
  inventory: InventoryItem[];
  updateStock: (id: string, delta: number) => void;
  addInventoryItem: (item: Omit<InventoryItem, 'id'>) => void;
  deleteInventoryItem: (id: string) => void;

  // Pharmacy Dispensing Queue
  dispensedRecords: DispensedRecord[];
  dispensePrescription: (record: Omit<DispensedRecord, 'id' | 'date'>) => void;

  // Stock Ledger
  inventoryLedger: StockLedgerEntry[];
  recordStockTransaction: (entry: Omit<StockLedgerEntry, 'id' | 'date'>) => void;

  // Patients Directory
  patientsList: PatientRecord[];
  addPatientRecord: (patient: Omit<PatientRecord, 'id'>) => void;
  selectActivePatient: (patient: PatientRecord) => void;

  // Clinical Scratchpad
  clinicalNotes: string;
  updateClinicalNotes: (notes: string) => void;

  // Bilingual Prescription Settings
  prescriptionLanguage: 'both' | 'english' | 'urdu';
  setPrescriptionLanguage: (lang: 'both' | 'english' | 'urdu') => void;

  // Backup Import
  importBackupData: (data: any) => boolean;

  // Custom Templates
  customTemplates: any[];

  // Customizations & Layout
  prescriptionCollapsed: boolean;
  togglePrescriptionCollapsed: () => void;
  setPrescriptionCollapsed: (collapsed: boolean) => void;

  uiDensity: 'comfortable' | 'spacious' | 'compact';
  setUiDensity: (density: 'comfortable' | 'spacious' | 'compact') => void;

  themeAccent: 'teal' | 'blue' | 'indigo' | 'rose' | 'slate';
  setThemeAccent: (accent: 'teal' | 'blue' | 'indigo' | 'rose' | 'slate') => void;

  fontSizeScale: 'normal' | 'large';
  setFontSizeScale: (scale: 'normal' | 'large') => void;

  soundAlerts: boolean;
  toggleSoundAlerts: () => void;

  // Role Profiles
  roleProfiles: Record<string, any>;
  updateRoleProfile: (role: string, updates: any) => void;

  // Command Palette
  commandPaletteOpen: boolean;
  setCommandPaletteOpen: (open: boolean) => void;

  // Dark Mode
  darkMode: boolean;
  toggleDarkMode: () => void;
}

// Migrate legacy storage key if needed
if (typeof window !== 'undefined' && !localStorage.getItem('hassanco-storage') && localStorage.getItem('clinrail-v4-storage')) {
  try {
    localStorage.setItem('hassanco-storage', localStorage.getItem('clinrail-v4-storage')!);
  } catch (e) {
    // ignore
  }
}

// Role Profiles initial defaults
const initialRoleProfiles: Record<string, any> = {
  Doctor: {
    fullName: 'Dr. Hassan Aqeel',
    credentials: 'MBBS, FCPS (Internal Medicine), MRCP (UK)',
    registrationNo: 'PMDC-54321-M',
    specialty: 'Internal Medicine & Critical Care',
    department: 'General Medicine & ICU',
    clinicName: 'Hassan and Co. Healthcare Medical Complex',
    clinicAddress: 'Executive Medical Wing, Floor 3, Blue Area, Islamabad',
    phone: '+92 51 2233445',
    digitalSignature: 'Dr. Hassan Aqeel (Consultant Physician)',
    defaultRxLanguage: 'both',
  },
  Nurse: {
    fullName: 'Nurse Sarah Jenkins',
    councilId: 'PNC-98765-RN',
    assignedWard: 'Medical Ward A & Step-Down ICU',
    shift: 'Morning (08:00 - 16:00)',
    vitalsIntervalMinutes: '60',
    news2AudioChime: true,
    emergencyContact: '+92 300 7788990',
  },
  Pharmacist: {
    fullName: 'Pharm. Ahmed Raza',
    licenseNo: 'PHARM-88219-R',
    counterNo: 'Dispensary Counter 1 (OPD/Emergency)',
    lowStockThreshold: 50,
    autoPrintReceipt: true,
    genericSubstitutionPrompt: true,
    shift: 'General Daytime',
  },
  Storekeeper: {
    fullName: 'Bilal Khan (Storekeeper)',
    employeeBadge: 'EMP-SK-4412',
    warehouseZone: 'Central Medical Supplies & Equipment Depot, Basement 2',
    reorderThreshold: 100,
    maintenanceAlertInterval: '30 Days',
    equipmentInspectionDue: 'Bi-Weekly',
  },
  Admin: {
    fullName: 'System Administrator',
    organizationName: 'Hassan and Co. Healthcare Systems',
    securityClearance: 'Level 5 (Super Admin)',
    auditLogLevel: 'Verbose (All Clinical & Inventory Operations)',
    autoBackupFrequency: 'Daily at 00:00 UTC',
    dataRetentionDays: 365,
  }
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // ---- Navigation ----
      activeView: 'workspace',
      sidebarCollapsed: false,
      setActiveView: (view) => set({ activeView: view }),
      toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),

      // ---- Patient ----
      patient: initialPatient,
      setPatientField: (field, value) =>
        set((s) => ({ patient: { ...s.patient, [field]: value } })),
      setPatientAllergies: (allergies) =>
        set((s) => ({ patient: { ...s.patient, allergies } })),
      resetPatient: () => set({ patient: initialPatient }),

      // ---- Prescription ----
      prescription: initialPrescription,
      addPrescriptionItem: (item) =>
        set((s) => ({
          prescription: {
            ...s.prescription,
            items: [...s.prescription.items, { ...item, id: crypto.randomUUID() }],
          },
        })),
      removePrescriptionItem: (id) =>
        set((s) => ({
          prescription: {
            ...s.prescription,
            items: s.prescription.items.filter((i) => i.id !== id),
          },
        })),
      updatePrescriptionItem: (id, updates) =>
        set((s) => ({
          prescription: {
            ...s.prescription,
            items: s.prescription.items.map((i) =>
              i.id === id ? { ...i, ...updates } : i
            ),
          },
        })),
      setAdvice: (advice) =>
        set((s) => ({ prescription: { ...s.prescription, advice } })),
      addLab: (lab) =>
        set((s) => ({
          prescription: { ...s.prescription, labs: [...s.prescription.labs, lab] },
        })),
      removeLab: (lab) =>
        set((s) => ({
          prescription: { ...s.prescription, labs: s.prescription.labs.filter((l) => l !== lab) },
        })),
      addDiagnosis: (d) =>
        set((s) => ({
          prescription: { ...s.prescription, diagnosis: [...s.prescription.diagnosis, d] },
        })),
      removeDiagnosis: (d) =>
        set((s) => ({
          prescription: { ...s.prescription, diagnosis: s.prescription.diagnosis.filter((x) => x !== d) },
        })),
      setFollowUpDate: (date) =>
        set((s) => ({ prescription: { ...s.prescription, followUpDate: date } })),
      resetPrescription: () => set({ prescription: initialPrescription }),

      // ---- SOAP Notes ----
      soapNote: initialSOAPNote,
      updateSOAPSection: (section, data) =>
        set((s) => ({
          soapNote: {
            ...s.soapNote,
            [section]: typeof data === 'object' && !Array.isArray(data)
              ? { ...(s.soapNote[section] as any), ...data }
              : data,
          },
        })),
      resetSOAPNote: () => set({ soapNote: initialSOAPNote }),

      // ---- Orders ----
      orders: [],
      addOrder: (order) =>
        set((s) => ({
          orders: [
            ...s.orders,
            { ...order, id: crypto.randomUUID(), date: new Date().toISOString(), status: 'Pending' as const },
          ],
        })),
      updateOrderStatus: (id, status) =>
        set((s) => ({
          orders: s.orders.map((o) => (o.id === id ? { ...o, status } : o)),
        })),
      removeOrder: (id) =>
        set((s) => ({ orders: s.orders.filter((o) => o.id !== id) })),

      // ---- Patient History ----
      patientHistory: initialHistory,
      updatePatientHistory: (updates) =>
        set((s) => ({ patientHistory: { ...s.patientHistory, ...updates } })),

      // ---- Cases ----
      savedCases: [],
      saveCurrentCase: () => {
        const { patient, prescription, soapNote, orders, savedCases } = get();
        if (!patient.name) return;
        const newCase: CaseRecord = {
          id: crypto.randomUUID(),
          date: new Date().toISOString(),
          patient,
          prescription,
          soapNote,
          orders,
        };
        set({ savedCases: [newCase, ...savedCases] });
      },
      loadCase: (id) => {
        const found = get().savedCases.find((c) => c.id === id);
        if (found) {
          set({
            patient: found.patient,
            prescription: found.prescription,
            ...(found.soapNote ? { soapNote: found.soapNote } : {}),
            ...(found.orders ? { orders: found.orders } : {}),
          });
        }
      },
      deleteCase: (id) =>
        set((s) => ({ savedCases: s.savedCases.filter((c) => c.id !== id) })),

      // ---- Doctor Profile ----
      doctorProfile: defaultDoctor,
      updateDoctorProfile: (updates) =>
        set((s) => ({ doctorProfile: { ...s.doctorProfile, ...updates } })),

      // ---- Session ----
      clearSession: () =>
        set({
          patient: initialPatient,
          prescription: initialPrescription,
          soapNote: initialSOAPNote,
          orders: [],
        }),

      // ---- Auth & RBAC ----
      currentUser: null,
      login: (name, role) => set({ currentUser: { name, role } }),
      logout: () => set({ currentUser: null }),

      // ---- Doctor Management (Admin) ----
      doctorsList: initialDoctorsList,
      addDoctor: (doc) =>
        set((s) => ({
          doctorsList: [
            ...s.doctorsList,
            { ...doc, id: `doc-${Date.now()}` },
          ],
        })),
      deleteDoctor: (id) =>
        set((s) => ({
          doctorsList: s.doctorsList.filter((d) => d.id !== id),
        })),
      toggleDoctorStatus: (id) =>
        set((s) => ({
          doctorsList: s.doctorsList.map((d) =>
            d.id === id ? { ...d, active: !d.active } : d
          ),
        })),

      // ---- Inventory Management (Storekeeper) ----
      inventory: initialInventoryList,
      updateStock: (id, delta) =>
        set((s) => {
          const target = s.inventory.find(i => i.id === id);
          const newStock = target ? Math.max(0, target.stock + delta) : 0;
          const ledgerEntry: StockLedgerEntry = {
            id: `led-${Date.now()}`,
            date: new Date().toISOString(),
            itemId: id,
            itemName: target?.name || 'Item',
            type: delta > 0 ? 'Stock In' : 'Adjustment',
            quantity: delta,
            balanceAfter: newStock,
            user: s.currentUser?.name || 'System Operator',
            unitPrice: target?.unitPrice,
            notes: delta > 0 ? `Stock restock (+${delta})` : `Inventory adjustment (${delta})`
          };

          return {
            inventory: s.inventory.map((item) =>
              item.id === id
                ? { ...item, stock: newStock }
                : item
            ),
            inventoryLedger: [ledgerEntry, ...s.inventoryLedger]
          };
        }),
      addInventoryItem: (item) =>
        set((s) => {
          const newItem = { ...item, id: `inv-${Date.now()}` };
          const ledgerEntry: StockLedgerEntry = {
            id: `led-${Date.now()}`,
            date: new Date().toISOString(),
            itemId: newItem.id,
            itemName: newItem.name,
            type: 'Stock In',
            quantity: newItem.stock,
            balanceAfter: newItem.stock,
            user: s.currentUser?.name || 'System Operator',
            unitPrice: newItem.unitPrice,
            notes: 'Initial stock registration'
          };
          return {
            inventory: [...s.inventory, newItem],
            inventoryLedger: [ledgerEntry, ...s.inventoryLedger]
          };
        }),
      deleteInventoryItem: (id) =>
        set((s) => ({
          inventory: s.inventory.filter((item) => item.id !== id),
        })),

      // ---- Stock Ledger ----
      inventoryLedger: initialLedger,
      recordStockTransaction: (entry) =>
        set((s) => ({
          inventoryLedger: [
            {
              ...entry,
              id: `led-${Date.now()}`,
              date: new Date().toISOString(),
            },
            ...s.inventoryLedger,
          ],
        })),

      // ---- Patients Directory ----
      patientsList: initialPatientsList,
      addPatientRecord: (pat) =>
        set((s) => ({
          patientsList: [
            { ...pat, id: `pat-${Date.now()}` },
            ...s.patientsList,
          ],
        })),
      selectActivePatient: (pat) =>
        set((s) => ({
          patient: {
            ...initialPatient,
            name: pat.name,
            mrn: pat.mrn,
            age: pat.age,
            gender: pat.gender as any,
            phone: pat.phone,
            bloodGroup: pat.bloodGroup as any,
            bp: pat.vitals?.bp || '',
            temperature: pat.vitals?.temp || '',
            pulse: pat.vitals?.pulse || '',
            weight: pat.vitals?.weight || '',
            allergies: pat.allergies.map(a => ({ name: a, severity: 'Moderate' as const, reaction: 'Documented Clinical Allergy' })),
            comorbidities: pat.diagnoses || [],
          },
          patientHistory: {
            ...s.patientHistory,
            pastMedical: Array.from(new Set([...(s.patientHistory.pastMedical || []), ...(pat.diagnoses || [])])),
          },
          soapNote: {
            ...s.soapNote,
            subjective: {
              ...s.soapNote.subjective,
              chiefComplaint: s.soapNote.subjective.chiefComplaint || (pat.diagnoses?.[0] ? `Follow-up / Review: ${pat.diagnoses[0]}` : 'Clinical Consultation'),
            },
            objective: {
              ...s.soapNote.objective,
              vitalsSummary: pat.vitals ? `BP: ${pat.vitals.bp || '--'} | PR: ${pat.vitals.pulse || '--'} bpm | Temp: ${pat.vitals.temp || '--'}°C | Wt: ${pat.vitals.weight || '--'} kg` : '',
            },
            assessment: {
              ...s.soapNote.assessment,
              diagnoses: Array.from(new Set([...(s.soapNote.assessment.diagnoses || []), ...(pat.diagnoses || [])])),
            }
          },
          prescription: {
            ...initialPrescription,
            diagnosis: pat.diagnoses || [],
          },
        })),

      // ---- Clinical Scratchpad ----
      clinicalNotes: '',
      updateClinicalNotes: (notes) => set({ clinicalNotes: notes }),

      // ---- Bilingual Prescription Settings ----
      prescriptionLanguage: 'both',
      setPrescriptionLanguage: (lang) => set({ prescriptionLanguage: lang }),

      // ---- Backup Import ----
      importBackupData: (data: any) => {
        try {
          if (!data || typeof data !== 'object') return false;
          set((s) => ({
            doctorsList: Array.isArray(data.doctors) ? data.doctors : s.doctorsList,
            inventory: Array.isArray(data.inventory) ? data.inventory : s.inventory,
            savedCases: Array.isArray(data.cases) ? data.cases : s.savedCases,
            patientsList: Array.isArray(data.patients) ? data.patients : s.patientsList,
          }));
          return true;
        } catch {
          return false;
        }
      },

      // ---- Pharmacy Dispensing Queue ----
      dispensedRecords: [],
      dispensePrescription: (record) =>
        set((s) => {
          const newRec: DispensedRecord = {
            ...record,
            id: `disp-${Date.now()}`,
            date: new Date().toISOString(),
          };
          // Also create ledger entries for dispensed items
          const ledgerEntries: StockLedgerEntry[] = record.items.map((item, idx) => ({
            id: `led-${Date.now()}-${idx}`,
            date: new Date().toISOString(),
            itemId: `disp-${idx}`,
            itemName: item.name,
            type: 'Dispensed',
            quantity: -10,
            balanceAfter: 0,
            user: record.dispensedBy,
            notes: `Dispensed to ${record.patientName}`
          }));

          return {
            dispensedRecords: [newRec, ...s.dispensedRecords],
            inventoryLedger: [...ledgerEntries, ...s.inventoryLedger],
          };
        }),

      // ---- Custom Templates ----
      customTemplates: [],

      // ---- Customizations & Layout ----
      prescriptionCollapsed: false,
      togglePrescriptionCollapsed: () => set((s) => ({ prescriptionCollapsed: !s.prescriptionCollapsed })),
      setPrescriptionCollapsed: (collapsed) => set({ prescriptionCollapsed: collapsed }),

      uiDensity: 'comfortable',
      setUiDensity: (density) => set({ uiDensity: density }),

      themeAccent: 'teal',
      setThemeAccent: (accent) => set({ themeAccent: accent }),

      fontSizeScale: 'normal',
      setFontSizeScale: (scale) => set({ fontSizeScale: scale }),

      soundAlerts: true,
      toggleSoundAlerts: () => set((s) => ({ soundAlerts: !s.soundAlerts })),

      roleProfiles: initialRoleProfiles,
      updateRoleProfile: (role, updates) =>
        set((s) => ({
          roleProfiles: {
            ...s.roleProfiles,
            [role]: { ...(s.roleProfiles[role] || {}), ...updates },
          },
        })),

      // ---- Command Palette ----
      commandPaletteOpen: false,
      setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),

      // ---- Dark Mode ----
      darkMode: false,
      toggleDarkMode: () => set((s) => ({ darkMode: !s.darkMode })),
    }),
    {
      name: 'hassanco-storage',
      partialize: (state) => ({
        currentUser: state.currentUser,
        savedCases: state.savedCases,
        doctorProfile: state.doctorProfile,
        sidebarCollapsed: state.sidebarCollapsed,
        patient: state.patient,
        prescription: state.prescription,
        patientHistory: state.patientHistory,
        darkMode: state.darkMode,
        soapNote: state.soapNote,
        orders: state.orders,
        customTemplates: state.customTemplates,
        doctorsList: state.doctorsList,
        inventory: state.inventory,
        dispensedRecords: state.dispensedRecords,
        inventoryLedger: state.inventoryLedger,
        patientsList: state.patientsList,
        clinicalNotes: state.clinicalNotes,
        prescriptionLanguage: state.prescriptionLanguage,
        prescriptionCollapsed: state.prescriptionCollapsed,
        uiDensity: state.uiDensity,
        themeAccent: state.themeAccent,
        fontSizeScale: state.fontSizeScale,
        soundAlerts: state.soundAlerts,
        roleProfiles: state.roleProfiles,
      }),
    }
  )
);
