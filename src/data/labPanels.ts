import type { LabResult } from '../types';

export const LAB_CATEGORIES: string[] = [
  'Hematology',
  'Biochemistry',
  'Endocrine',
  'Immunology / Serology',
  'Urine',
  'Cardiac Markers',
  'Iron Studies',
  'Vitamins'
];

export const ORDERABLE_LABS = [
  {
    category: 'Hematology',
    tests: [
      'CBC with Differential',
      'ESR',
      'Coagulation Profile',
      'Reticulocyte Count',
      'Peripheral Blood Smear',
      'Blood Grouping & Rh Typing',
      'Direct Coombs Test',
      'G6PD'
    ]
  },
  {
    category: 'Biochemistry',
    tests: [
      'Renal Function Tests',
      'Liver Function Tests',
      'Electrolytes',
      'Blood Glucose (Fasting)',
      'Blood Glucose (Random)',
      'Blood Glucose (PP)',
      'Lipid Profile',
      'Amylase',
      'Lipase',
      'LDH'
    ]
  },
  {
    category: 'Endocrine',
    tests: [
      'Thyroid Panel',
      'HbA1c',
      'Cortisol',
      'Prolactin',
      'Testosterone',
      'FSH',
      'LH',
      'Insulin (Fasting)'
    ]
  },
  {
    category: 'Immunology / Serology',
    tests: [
      'CRP',
      'Rheumatoid Factor',
      'ANA',
      'HBsAg',
      'Anti-HCV',
      'HIV 1 & 2 Antibodies',
      'Dengue NS1/IgM/IgG',
      'Typhidot',
      'Malarial Parasite',
      'Widal Test'
    ]
  },
  {
    category: 'Urine',
    tests: [
      'Urinalysis',
      'Urine Culture',
      '24-Hour Urine Protein',
      'Urine Microalbumin',
      'Urine Drug Screen',
      'Urine Electrolytes'
    ]
  },
  {
    category: 'Cardiac Markers',
    tests: [
      'Troponin I',
      'Troponin T',
      'BNP',
      'NT-proBNP',
      'D-Dimer',
      'CK-MB',
      'Myoglobin'
    ]
  },
  {
    category: 'Iron Studies',
    tests: [
      'Iron Profile (Iron, TIBC, Saturation)',
      'Serum Ferritin',
      'Transferrin',
      'Soluble Transferrin Receptor'
    ]
  },
  {
    category: 'Vitamins',
    tests: [
      'Vitamin D (25-OH)',
      'Vitamin B12',
      'Folate',
      'Vitamin B6'
    ]
  }
];

export const MOCK_LAB_RESULTS: LabResult[] = [
  // ------------------------------------------
  // HEMATOLOGY
  // ------------------------------------------
  {
    id: 'LAB-1001',
    panelName: 'CBC with Differential',
    category: 'Hematology',
    date: '2026-08-15T08:30:00Z',
    status: 'abnormal',
    parameters: [
      { name: 'Hb', value: '9.2', unit: 'g/dL', referenceRange: '12.0 - 15.5', flag: 'Low' },
      { name: 'Hct', value: '28', unit: '%', referenceRange: '36.0 - 46.0', flag: 'Low' },
      { name: 'MCV', value: '75', unit: 'fL', referenceRange: '80 - 100', flag: 'Low' },
      { name: 'MCH', value: '24', unit: 'pg', referenceRange: '27 - 33', flag: 'Low' },
      { name: 'MCHC', value: '31', unit: 'g/dL', referenceRange: '32 - 36', flag: 'Low' },
      { name: 'RDW', value: '16', unit: '%', referenceRange: '11.5 - 14.5', flag: 'High' },
      { name: 'WBC', value: '6.5', unit: 'x10^3/uL', referenceRange: '4.5 - 11.0', flag: 'Normal' },
      { name: 'Neutrophils', value: '60', unit: '%', referenceRange: '40 - 70', flag: 'Normal' },
      { name: 'Lymphocytes', value: '30', unit: '%', referenceRange: '20 - 40', flag: 'Normal' },
      { name: 'Monocytes', value: '6', unit: '%', referenceRange: '2 - 8', flag: 'Normal' },
      { name: 'Eosinophils', value: '3', unit: '%', referenceRange: '1 - 4', flag: 'Normal' },
      { name: 'Basophils', value: '1', unit: '%', referenceRange: '0 - 1', flag: 'Normal' },
      { name: 'Platelet Count', value: '250', unit: 'x10^3/uL', referenceRange: '150 - 450', flag: 'Normal' }
    ]
  },
  {
    id: 'LAB-1002',
    panelName: 'ESR',
    category: 'Hematology',
    date: '2026-08-15T08:35:00Z',
    status: 'abnormal',
    parameters: [
      { name: 'ESR', value: '42', unit: 'mm/hr', referenceRange: '0 - 20', flag: 'High' }
    ]
  },
  {
    id: 'LAB-1003',
    panelName: 'Coagulation Profile',
    category: 'Hematology',
    date: '2026-07-20T09:15:00Z',
    status: 'normal',
    parameters: [
      { name: 'PT', value: '12', unit: 's', referenceRange: '11.0 - 13.5', flag: 'Normal' },
      { name: 'INR', value: '1.0', unit: '', referenceRange: '0.8 - 1.1', flag: 'Normal' },
      { name: 'aPTT', value: '30', unit: 's', referenceRange: '25 - 35', flag: 'Normal' }
    ]
  },
  {
    id: 'LAB-1004',
    panelName: 'Reticulocyte Count',
    category: 'Hematology',
    date: '2026-08-15T08:35:00Z',
    status: 'abnormal',
    parameters: [
      { name: 'Reticulocyte Count', value: '2.5', unit: '%', referenceRange: '0.5 - 1.5', flag: 'High' }
    ]
  },

  // ------------------------------------------
  // BIOCHEMISTRY
  // ------------------------------------------
  {
    id: 'LAB-2001',
    panelName: 'Renal Function Tests',
    category: 'Biochemistry',
    date: '2026-08-16T07:45:00Z',
    status: 'abnormal',
    parameters: [
      { name: 'BUN', value: '18', unit: 'mg/dL', referenceRange: '7 - 20', flag: 'Normal' },
      { name: 'Creatinine', value: '1.1', unit: 'mg/dL', referenceRange: '0.6 - 1.2', flag: 'Normal' },
      { name: 'eGFR', value: '85', unit: 'mL/min/1.73m2', referenceRange: '>60', flag: 'Normal' },
      { name: 'Uric Acid', value: '7.2', unit: 'mg/dL', referenceRange: '2.4 - 6.0', flag: 'High' }
    ]
  },
  {
    id: 'LAB-2002',
    panelName: 'Liver Function Tests',
    category: 'Biochemistry',
    date: '2026-08-16T07:45:00Z',
    status: 'abnormal',
    parameters: [
      { name: 'Total Bilirubin', value: '0.8', unit: 'mg/dL', referenceRange: '0.1 - 1.2', flag: 'Normal' },
      { name: 'Direct Bilirubin', value: '0.2', unit: 'mg/dL', referenceRange: '0.0 - 0.3', flag: 'Normal' },
      { name: 'ALT/SGPT', value: '55', unit: 'U/L', referenceRange: '7 - 56', flag: 'High' }, // Close to high/borderline, some consider >40 High
      { name: 'AST/SGOT', value: '48', unit: 'U/L', referenceRange: '8 - 40', flag: 'High' },
      { name: 'ALP', value: '95', unit: 'U/L', referenceRange: '44 - 147', flag: 'Normal' },
      { name: 'GGT', value: '65', unit: 'U/L', referenceRange: '9 - 48', flag: 'High' },
      { name: 'Total Protein', value: '7.0', unit: 'g/dL', referenceRange: '6.0 - 8.3', flag: 'Normal' },
      { name: 'Albumin', value: '3.8', unit: 'g/dL', referenceRange: '3.5 - 5.0', flag: 'Normal' }
    ]
  },
  {
    id: 'LAB-2003',
    panelName: 'Electrolytes',
    category: 'Biochemistry',
    date: '2026-08-16T07:45:00Z',
    status: 'normal',
    parameters: [
      { name: 'Sodium', value: '140', unit: 'mEq/L', referenceRange: '135 - 145', flag: 'Normal' },
      { name: 'Potassium', value: '4.2', unit: 'mEq/L', referenceRange: '3.5 - 5.0', flag: 'Normal' },
      { name: 'Chloride', value: '102', unit: 'mEq/L', referenceRange: '96 - 106', flag: 'Normal' },
      { name: 'Bicarbonate', value: '24', unit: 'mEq/L', referenceRange: '22 - 29', flag: 'Normal' },
      { name: 'Calcium', value: '9.5', unit: 'mg/dL', referenceRange: '8.5 - 10.2', flag: 'Normal' },
      { name: 'Magnesium', value: '2.0', unit: 'mg/dL', referenceRange: '1.7 - 2.2', flag: 'Normal' },
      { name: 'Phosphate', value: '3.5', unit: 'mg/dL', referenceRange: '2.5 - 4.5', flag: 'Normal' }
    ]
  },
  {
    id: 'LAB-2004',
    panelName: 'Blood Glucose',
    category: 'Biochemistry',
    date: '2026-09-01T07:30:00Z',
    status: 'abnormal',
    parameters: [
      { name: 'Fasting Glucose', value: '126', unit: 'mg/dL', referenceRange: '70 - 99', flag: 'High' },
      { name: 'Random Glucose', value: '210', unit: 'mg/dL', referenceRange: '< 140', flag: 'High' }
    ]
  },
  {
    id: 'LAB-2005',
    panelName: 'Lipid Profile',
    category: 'Biochemistry',
    date: '2026-09-01T07:30:00Z',
    status: 'abnormal',
    parameters: [
      { name: 'Total Cholesterol', value: '245', unit: 'mg/dL', referenceRange: '< 200', flag: 'High' },
      { name: 'LDL', value: '165', unit: 'mg/dL', referenceRange: '< 100', flag: 'High' },
      { name: 'HDL', value: '38', unit: 'mg/dL', referenceRange: '> 40', flag: 'Low' },
      { name: 'Triglycerides', value: '220', unit: 'mg/dL', referenceRange: '< 150', flag: 'High' },
      { name: 'VLDL', value: '44', unit: 'mg/dL', referenceRange: '2 - 30', flag: 'High' }
    ]
  },

  // ------------------------------------------
  // ENDOCRINE
  // ------------------------------------------
  {
    id: 'LAB-3001',
    panelName: 'Thyroid Panel',
    category: 'Endocrine',
    date: '2026-08-20T10:00:00Z',
    status: 'abnormal',
    parameters: [
      { name: 'TSH', value: '6.8', unit: 'mIU/L', referenceRange: '0.4 - 4.0', flag: 'High' },
      { name: 'FT3', value: '2.2', unit: 'pg/mL', referenceRange: '2.3 - 4.2', flag: 'Low' },
      { name: 'FT4', value: '0.7', unit: 'ng/dL', referenceRange: '0.9 - 1.7', flag: 'Low' }
    ]
  },
  {
    id: 'LAB-3002',
    panelName: 'HbA1c',
    category: 'Endocrine',
    date: '2026-09-01T07:30:00Z',
    status: 'abnormal',
    parameters: [
      { name: 'HbA1c', value: '7.8', unit: '%', referenceRange: '< 5.7', flag: 'High' }
    ]
  },

  // ------------------------------------------
  // IMMUNOLOGY / SEROLOGY
  // ------------------------------------------
  {
    id: 'LAB-4001',
    panelName: 'Infection & Inflammation Markers',
    category: 'Immunology / Serology',
    date: '2026-08-01T11:00:00Z',
    status: 'abnormal',
    parameters: [
      { name: 'CRP', value: '45', unit: 'mg/L', referenceRange: '< 10', flag: 'High' },
      { name: 'Rheumatoid Factor', value: 'Negative', unit: '', referenceRange: 'Negative', flag: 'Normal' },
      { name: 'ANA', value: 'Negative', unit: '', referenceRange: 'Negative', flag: 'Normal' },
      { name: 'HBsAg', value: 'Non-reactive', unit: '', referenceRange: 'Non-reactive', flag: 'Normal' },
      { name: 'Anti-HCV', value: 'Non-reactive', unit: '', referenceRange: 'Non-reactive', flag: 'Normal' }
    ]
  },
  {
    id: 'LAB-4002',
    panelName: 'Febrile Profile',
    category: 'Immunology / Serology',
    date: '2026-08-01T11:00:00Z',
    status: 'abnormal',
    parameters: [
      { name: 'Dengue NS1/IgM', value: 'Negative', unit: '', referenceRange: 'Negative', flag: 'Normal' },
      { name: 'Typhidot IgM', value: 'Positive', unit: '', referenceRange: 'Negative', flag: 'High' },
      { name: 'Malarial Parasite', value: 'Not seen', unit: '', referenceRange: 'Not seen', flag: 'Normal' }
    ]
  },

  // ------------------------------------------
  // URINE
  // ------------------------------------------
  {
    id: 'LAB-5001',
    panelName: 'Urinalysis',
    category: 'Urine',
    date: '2026-09-02T08:00:00Z',
    status: 'abnormal',
    parameters: [
      { name: 'Color', value: 'Amber', unit: '', referenceRange: 'Yellow', flag: 'Normal' },
      { name: 'Appearance', value: 'Clear', unit: '', referenceRange: 'Clear', flag: 'Normal' },
      { name: 'pH', value: '6.0', unit: '', referenceRange: '4.5 - 8.0', flag: 'Normal' },
      { name: 'Specific Gravity', value: '1.020', unit: '', referenceRange: '1.005 - 1.030', flag: 'Normal' },
      { name: 'Protein', value: 'Trace', unit: '', referenceRange: 'Negative', flag: 'High' },
      { name: 'Glucose', value: '2+', unit: '', referenceRange: 'Negative', flag: 'High' },
      { name: 'Ketones', value: 'Negative', unit: '', referenceRange: 'Negative', flag: 'Normal' },
      { name: 'Blood', value: 'Negative', unit: '', referenceRange: 'Negative', flag: 'Normal' },
      { name: 'WBC', value: '2-3', unit: '/HPF', referenceRange: '0 - 5', flag: 'Normal' },
      { name: 'RBC', value: '0-1', unit: '/HPF', referenceRange: '0 - 2', flag: 'Normal' },
      { name: 'Casts', value: 'None', unit: '', referenceRange: 'None', flag: 'Normal' },
      { name: 'Bacteria', value: 'None', unit: '', referenceRange: 'None', flag: 'Normal' }
    ]
  },
  {
    id: 'LAB-5002',
    panelName: 'Urine Culture',
    category: 'Urine',
    date: '2026-09-02T08:00:00Z',
    status: 'normal',
    parameters: [
      { name: 'Growth', value: 'No growth', unit: '', referenceRange: 'No growth', flag: 'Normal' }
    ]
  },

  // ------------------------------------------
  // CARDIAC
  // ------------------------------------------
  {
    id: 'LAB-6001',
    panelName: 'Cardiac Markers',
    category: 'Cardiac Markers',
    date: '2026-05-15T09:30:00Z',
    status: 'normal',
    parameters: [
      { name: 'Troponin I', value: '<0.01', unit: 'ng/mL', referenceRange: '< 0.04', flag: 'Normal' },
      { name: 'BNP', value: '85', unit: 'pg/mL', referenceRange: '< 100', flag: 'Normal' },
      { name: 'D-Dimer', value: '0.3', unit: 'ug/mL', referenceRange: '< 0.5', flag: 'Normal' }
    ]
  },

  // ------------------------------------------
  // IRON STUDIES
  // ------------------------------------------
  {
    id: 'LAB-7001',
    panelName: 'Iron Profile',
    category: 'Iron Studies',
    date: '2026-08-15T08:35:00Z',
    status: 'abnormal',
    parameters: [
      { name: 'Serum Ferritin', value: '12', unit: 'ng/mL', referenceRange: '15 - 150', flag: 'Low' },
      { name: 'Serum Iron', value: '45', unit: 'ug/dL', referenceRange: '60 - 170', flag: 'Low' },
      { name: 'TIBC', value: '450', unit: 'ug/dL', referenceRange: '240 - 450', flag: 'High' }, // technically borderline high, labeling High based on instructions
      { name: 'Transferrin Saturation', value: '10', unit: '%', referenceRange: '20 - 50', flag: 'Low' }
    ]
  },

  // ------------------------------------------
  // VITAMINS
  // ------------------------------------------
  {
    id: 'LAB-8001',
    panelName: 'Vitamin Panel',
    category: 'Vitamins',
    date: '2026-08-15T08:35:00Z',
    status: 'abnormal',
    parameters: [
      { name: 'Vitamin D', value: '15', unit: 'ng/mL', referenceRange: '30 - 100', flag: 'Low' },
      { name: 'Vitamin B12', value: '180', unit: 'pg/mL', referenceRange: '200 - 900', flag: 'Low' },
      { name: 'Folate', value: '8.5', unit: 'ng/mL', referenceRange: '4.0 - 20.0', flag: 'Normal' }
    ]
  }
];
