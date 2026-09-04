import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Patient, Prescription, PrescriptionItem, CaseRecord } from '../types';

interface AppState {
  // Patient State
  patient: Patient;
  setPatientField: (field: keyof Patient, value: any) => void;
  resetPatient: () => void;

  // Prescription State
  prescription: Prescription;
  addPrescriptionItem: (item: Omit<PrescriptionItem, 'id'>) => void;
  removePrescriptionItem: (id: string) => void;
  setAdvice: (advice: string) => void;
  addLab: (lab: string) => void;
  removeLab: (lab: string) => void;
  addDiagnosis: (diagnosis: string) => void;
  removeDiagnosis: (diagnosis: string) => void;
  setFollowUpDate: (date: string) => void;
  resetPrescription: () => void;

  // Cases State (persisted separately or handled here)
  savedCases: CaseRecord[];
  saveCurrentCase: () => void;
  loadCase: (id: string) => void;
  deleteCase: (id: string) => void;
}

const initialPatient: Patient = {
  name: '',
  mrn: '',
  age: '',
  gender: '',
  weight: '',
  bp: '',
  pulse: '',
  spo2: '',
  pregnancyStatus: '',
  allergies: '',
  comorbidities: [],
};

const initialPrescription: Prescription = {
  items: [],
  advice: '',
  labs: [],
  followUpDate: '',
  diagnosis: [],
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      patient: initialPatient,
      setPatientField: (field, value) =>
        set((state) => ({ patient: { ...state.patient, [field]: value } })),
      resetPatient: () => set({ patient: initialPatient }),

      prescription: initialPrescription,
      addPrescriptionItem: (item) =>
        set((state) => ({
          prescription: {
            ...state.prescription,
            items: [...state.prescription.items, { ...item, id: crypto.randomUUID() }],
          },
        })),
      removePrescriptionItem: (id) =>
        set((state) => ({
          prescription: {
            ...state.prescription,
            items: state.prescription.items.filter((i) => i.id !== id),
          },
        })),
      setAdvice: (advice) =>
        set((state) => ({ prescription: { ...state.prescription, advice } })),
      addLab: (lab) =>
        set((state) => ({
          prescription: {
            ...state.prescription,
            labs: [...state.prescription.labs, lab],
          },
        })),
      removeLab: (lab) =>
        set((state) => ({
          prescription: {
            ...state.prescription,
            labs: state.prescription.labs.filter((l) => l !== lab),
          },
        })),
      addDiagnosis: (diagnosis) =>
        set((state) => ({
          prescription: {
            ...state.prescription,
            diagnosis: [...state.prescription.diagnosis, diagnosis],
          },
        })),
      removeDiagnosis: (diagnosis) =>
        set((state) => ({
          prescription: {
            ...state.prescription,
            diagnosis: state.prescription.diagnosis.filter((d) => d !== diagnosis),
          },
        })),
      setFollowUpDate: (date) =>
        set((state) => ({ prescription: { ...state.prescription, followUpDate: date } })),
      resetPrescription: () => set({ prescription: initialPrescription }),

      savedCases: [],
      saveCurrentCase: () => {
        const { patient, prescription, savedCases } = get();
        if (!patient.name) return; // Basic validation
        
        const newCase: CaseRecord = {
          id: crypto.randomUUID(),
          date: new Date().toISOString(),
          patient,
          prescription,
        };
        set({ savedCases: [newCase, ...savedCases] });
      },
      loadCase: (id) => {
        const { savedCases } = get();
        const caseRecord = savedCases.find((c) => c.id === id);
        if (caseRecord) {
          set({
            patient: caseRecord.patient,
            prescription: caseRecord.prescription,
          });
        }
      },
      deleteCase: (id) =>
        set((state) => ({
          savedCases: state.savedCases.filter((c) => c.id !== id),
        })),
    }),
    {
      name: 'clinrail-storage',
      partialize: (state) => ({ savedCases: state.savedCases }), // Only persist saved cases
    }
  )
);
