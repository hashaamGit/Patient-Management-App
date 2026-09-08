import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  Patient, Prescription, PrescriptionItem, CaseRecord,
  SOAPNote, Order, OrderType, OrderUrgency, PatientHistory,
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

export interface InventoryItem {
  id: string;
  name: string;
  category: 'Antibiotics' | 'Analgesics' | 'Cardiovascular' | 'Antidiabetic' | 'Respiratory' | 'Consumables' | 'IV Fluids' | 'Other';
  stock: number;
  minStock: number;
  unit: string;
  batchNo: string;
  expiryDate: string;
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
  { id: 'inv-1', name: 'Amoxicillin + Clavulanate 625mg', category: 'Antibiotics', stock: 450, minStock: 100, unit: 'Tablets', batchNo: 'AC-2026-08', expiryDate: '2027-08-15' },
  { id: 'inv-2', name: 'Paracetamol 500mg', category: 'Analgesics', stock: 1200, minStock: 250, unit: 'Tablets', batchNo: 'PCM-2026-01', expiryDate: '2028-01-30' },
  { id: 'inv-3', name: 'Metformin HCl 500mg', category: 'Antidiabetic', stock: 520, minStock: 150, unit: 'Tablets', batchNo: 'MET-2025-11', expiryDate: '2027-05-20' },
  { id: 'inv-4', name: 'Amlodipine 5mg', category: 'Cardiovascular', stock: 380, minStock: 100, unit: 'Tablets', batchNo: 'AML-2026-03', expiryDate: '2027-11-10' },
  { id: 'inv-5', name: 'Salbutamol HFA Inhaler 100mcg', category: 'Respiratory', stock: 35, minStock: 20, unit: 'Inhalers', batchNo: 'SAL-2025-09', expiryDate: '2026-12-01' },
  { id: 'inv-6', name: 'Ceftriaxone 1g IV Vial', category: 'Antibiotics', stock: 85, minStock: 30, unit: 'Vials', batchNo: 'CEF-2026-04', expiryDate: '2027-04-18' },
  { id: 'inv-7', name: 'Normal Saline 0.9% 500ml', category: 'IV Fluids', stock: 180, minStock: 50, unit: 'Bags', batchNo: 'NS-2026-02', expiryDate: '2028-02-28' },
  { id: 'inv-8', name: 'Sterile Gauze Pads 10x10cm', category: 'Consumables', stock: 420, minStock: 100, unit: 'Packs', batchNo: 'GP-2025-12', expiryDate: '2029-12-31' },
  { id: 'inv-9', name: 'Disposable Syringes 5ml (Luer Lock)', category: 'Consumables', stock: 850, minStock: 200, unit: 'Pieces', batchNo: 'SYR-2026-05', expiryDate: '2030-05-01' },
  { id: 'inv-10', name: 'Omeprazole 20mg Capsules', category: 'Other', stock: 600, minStock: 120, unit: 'Capsules', batchNo: 'OMP-2026-07', expiryDate: '2027-09-15' },
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

  // Custom Templates
  customTemplates: any[];

  // Command Palette
  commandPaletteOpen: boolean;
  setCommandPaletteOpen: (open: boolean) => void;

  // Dark Mode
  darkMode: boolean;
  toggleDarkMode: () => void;
}

// ============================================================
// Store Implementation
// ============================================================

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
        set((s) => ({
          inventory: s.inventory.map((item) =>
            item.id === id
              ? { ...item, stock: Math.max(0, item.stock + delta) }
              : item
          ),
        })),
      addInventoryItem: (item) =>
        set((s) => ({
          inventory: [
            ...s.inventory,
            { ...item, id: `inv-${Date.now()}` },
          ],
        })),
      deleteInventoryItem: (id) =>
        set((s) => ({
          inventory: s.inventory.filter((item) => item.id !== id),
        })),

      // ---- Pharmacy Dispensing Queue ----
      dispensedRecords: [],
      dispensePrescription: (record) =>
        set((s) => ({
          dispensedRecords: [
            {
              ...record,
              id: `disp-${Date.now()}`,
              date: new Date().toISOString(),
            },
            ...s.dispensedRecords,
          ],
        })),

      // ---- Custom Templates ----
      customTemplates: [],

      // ---- Command Palette ----
      commandPaletteOpen: false,
      setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),

      // ---- Dark Mode ----
      darkMode: false,
      toggleDarkMode: () => set((s) => ({ darkMode: !s.darkMode })),
    }),
    {
      name: 'clinrail-v4-storage',
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
      }),
    }
  )
);
