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
  specialty: 'GP / Internal Medicine',
  clinicName: 'CLIN/RAIL Medical Centre',
  clinicAddress: 'Lahore, Pakistan',
  phone: '',
};

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
        savedCases: state.savedCases,
        doctorProfile: state.doctorProfile,
        sidebarCollapsed: state.sidebarCollapsed,
        patient: state.patient,
        prescription: state.prescription,
        patientHistory: state.patientHistory,
        darkMode: state.darkMode,
      }),
    }
  )
);
