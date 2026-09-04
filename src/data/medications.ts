export interface MedicationFavorite {
  id: string;
  category: string;
  label: string;
  genericName: string;
  brandName: string;
  strength: string;
  form: string;
  route: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

export const QUICK_FAVORITES: MedicationFavorite[] = [
  // Analgesics/Antipyretics
  { id: 'm1', category: 'Analgesics/Antipyretics', label: 'Paracetamol (Panadol) 500mg Tab', genericName: 'Paracetamol', brandName: 'Panadol', strength: '500mg', form: 'Tablet', route: 'PO', dosage: '1 tablet', frequency: 'PRN', duration: '3 days', instructions: 'Take with food' },
  { id: 'm2', category: 'Analgesics/Antipyretics', label: 'Ibuprofen (Brufen) 400mg Tab', genericName: 'Ibuprofen', brandName: 'Brufen', strength: '400mg', form: 'Tablet', route: 'PO', dosage: '1 tablet', frequency: 'TID', duration: '3 days', instructions: 'Take after meals' },
  { id: 'm3', category: 'Analgesics/Antipyretics', label: 'Diclofenac (Voltaren) 50mg Tab', genericName: 'Diclofenac', brandName: 'Voltaren', strength: '50mg', form: 'Tablet', route: 'PO', dosage: '1 tablet', frequency: 'BID', duration: '5 days', instructions: 'Take after meals' },
  { id: 'm4', category: 'Analgesics/Antipyretics', label: 'Tramadol 50mg Cap', genericName: 'Tramadol', brandName: '', strength: '50mg', form: 'Capsule', route: 'PO', dosage: '1 capsule', frequency: 'PRN', duration: '3 days', instructions: 'May cause drowsiness' },
  
  // Antibiotics
  { id: 'm5', category: 'Antibiotics', label: 'Amoxicillin (Amoxil) 500mg Cap', genericName: 'Amoxicillin', brandName: 'Amoxil', strength: '500mg', form: 'Capsule', route: 'PO', dosage: '1 capsule', frequency: 'TID', duration: '5 days', instructions: 'Complete full course' },
  { id: 'm6', category: 'Antibiotics', label: 'Co-Amoxiclav (Augmentin) 625mg Tab', genericName: 'Co-Amoxiclav', brandName: 'Augmentin', strength: '625mg', form: 'Tablet', route: 'PO', dosage: '1 tablet', frequency: 'BID', duration: '5 days', instructions: 'Complete full course' },
  { id: 'm7', category: 'Antibiotics', label: 'Azithromycin (Zithromax) 500mg Tab', genericName: 'Azithromycin', brandName: 'Zithromax', strength: '500mg', form: 'Tablet', route: 'PO', dosage: '1 tablet', frequency: 'OD', duration: '3 days', instructions: 'Complete full course' },
  { id: 'm8', category: 'Antibiotics', label: 'Ciprofloxacin (Ciprobay) 500mg Tab', genericName: 'Ciprofloxacin', brandName: 'Ciprobay', strength: '500mg', form: 'Tablet', route: 'PO', dosage: '1 tablet', frequency: 'BID', duration: '7 days', instructions: 'Take with plenty of water' },
  { id: 'm9', category: 'Antibiotics', label: 'Metronidazole (Flagyl) 400mg Tab', genericName: 'Metronidazole', brandName: 'Flagyl', strength: '400mg', form: 'Tablet', route: 'PO', dosage: '1 tablet', frequency: 'TID', duration: '5 days', instructions: 'Avoid alcohol' },
  { id: 'm10', category: 'Antibiotics', label: 'Cefixime (Cefix) 400mg Tab', genericName: 'Cefixime', brandName: 'Cefix', strength: '400mg', form: 'Tablet', route: 'PO', dosage: '1 tablet', frequency: 'OD', duration: '5 days', instructions: 'Complete full course' },
  { id: 'm11', category: 'Antibiotics', label: 'Doxycycline 100mg Cap', genericName: 'Doxycycline', brandName: '', strength: '100mg', form: 'Capsule', route: 'PO', dosage: '1 capsule', frequency: 'BID', duration: '7 days', instructions: 'Take with food and water' },
  { id: 'm12', category: 'Antibiotics', label: 'Levofloxacin (Levaquin) 500mg Tab', genericName: 'Levofloxacin', brandName: 'Levaquin', strength: '500mg', form: 'Tablet', route: 'PO', dosage: '1 tablet', frequency: 'OD', duration: '7 days', instructions: 'Complete full course' },
  
  // GI Medications
  { id: 'm13', category: 'GI Medications', label: 'Omeprazole (Risek) 20mg Cap', genericName: 'Omeprazole', brandName: 'Risek', strength: '20mg', form: 'Capsule', route: 'PO', dosage: '1 capsule', frequency: 'OD', duration: '14 days', instructions: 'Take before breakfast' },
  { id: 'm14', category: 'GI Medications', label: 'Pantoprazole (Pantozol) 40mg Tab', genericName: 'Pantoprazole', brandName: 'Pantozol', strength: '40mg', form: 'Tablet', route: 'PO', dosage: '1 tablet', frequency: 'OD', duration: '14 days', instructions: 'Take before breakfast' },
  { id: 'm15', category: 'GI Medications', label: 'Domperidone (Motilium) 10mg Tab', genericName: 'Domperidone', brandName: 'Motilium', strength: '10mg', form: 'Tablet', route: 'PO', dosage: '1 tablet', frequency: 'TID', duration: '5 days', instructions: 'Take 15-30 min before meals' },
  { id: 'm16', category: 'GI Medications', label: 'Hyoscine Butylbromide (Buscopan) 10mg Tab', genericName: 'Hyoscine Butylbromide', brandName: 'Buscopan', strength: '10mg', form: 'Tablet', route: 'PO', dosage: '1 tablet', frequency: 'TID', duration: '5 days', instructions: 'Take for cramps' },
  { id: 'm17', category: 'GI Medications', label: 'Ondansetron 4mg Tab', genericName: 'Ondansetron', brandName: '', strength: '4mg', form: 'Tablet', route: 'PO', dosage: '1 tablet', frequency: 'BID', duration: '3 days', instructions: 'Take for nausea' },

  // Cardiovascular
  { id: 'm18', category: 'Cardiovascular', label: 'Amlodipine (Norvasc) 5mg Tab', genericName: 'Amlodipine', brandName: 'Norvasc', strength: '5mg', form: 'Tablet', route: 'PO', dosage: '1 tablet', frequency: 'OD', duration: '30 days', instructions: 'Take at the same time every day' },
  { id: 'm19', category: 'Cardiovascular', label: 'Losartan (Cozaar) 50mg Tab', genericName: 'Losartan', brandName: 'Cozaar', strength: '50mg', form: 'Tablet', route: 'PO', dosage: '1 tablet', frequency: 'OD', duration: '30 days', instructions: 'Take at the same time every day' },
  { id: 'm20', category: 'Cardiovascular', label: 'Atenolol (Tenormin) 50mg Tab', genericName: 'Atenolol', brandName: 'Tenormin', strength: '50mg', form: 'Tablet', route: 'PO', dosage: '1 tablet', frequency: 'OD', duration: '30 days', instructions: 'Do not stop abruptly' },
  { id: 'm21', category: 'Cardiovascular', label: 'Aspirin 75mg Tab', genericName: 'Aspirin', brandName: '', strength: '75mg', form: 'Tablet', route: 'PO', dosage: '1 tablet', frequency: 'OD', duration: '30 days', instructions: 'Take after meals' },

  // Antidiabetics
  { id: 'm22', category: 'Antidiabetics', label: 'Metformin (Glucophage) 500mg Tab', genericName: 'Metformin', brandName: 'Glucophage', strength: '500mg', form: 'Tablet', route: 'PO', dosage: '1 tablet', frequency: 'BID', duration: '30 days', instructions: 'Take with or after meals' },
  { id: 'm23', category: 'Antidiabetics', label: 'Glimepiride (Amaryl) 2mg Tab', genericName: 'Glimepiride', brandName: 'Amaryl', strength: '2mg', form: 'Tablet', route: 'PO', dosage: '1 tablet', frequency: 'OD', duration: '30 days', instructions: 'Take with breakfast' },

  // Respiratory
  { id: 'm24', category: 'Respiratory', label: 'Salbutamol Inhaler 100mcg', genericName: 'Salbutamol', brandName: '', strength: '100mcg', form: 'Inhaler', route: 'Inhaled', dosage: '2 puffs', frequency: 'PRN', duration: '1 month', instructions: 'Use for shortness of breath' },
  { id: 'm25', category: 'Respiratory', label: 'Montelukast (Singulair) 10mg Tab', genericName: 'Montelukast', brandName: 'Singulair', strength: '10mg', form: 'Tablet', route: 'PO', dosage: '1 tablet', frequency: 'OD', duration: '30 days', instructions: 'Take in the evening' },

  // Antihistamines
  { id: 'm26', category: 'Antihistamines', label: 'Cetirizine 10mg Tab', genericName: 'Cetirizine', brandName: '', strength: '10mg', form: 'Tablet', route: 'PO', dosage: '1 tablet', frequency: 'OD', duration: '5 days', instructions: 'May cause drowsiness' },
  { id: 'm27', category: 'Antihistamines', label: 'Loratadine (Claritin) 10mg Tab', genericName: 'Loratadine', brandName: 'Claritin', strength: '10mg', form: 'Tablet', route: 'PO', dosage: '1 tablet', frequency: 'OD', duration: '5 days', instructions: 'Take once daily' },

  // Steroids
  { id: 'm28', category: 'Steroids', label: 'Prednisolone 5mg Tab', genericName: 'Prednisolone', brandName: '', strength: '5mg', form: 'Tablet', route: 'PO', dosage: '1 tablet', frequency: 'OD', duration: '5 days', instructions: 'Take with food' },
  { id: 'm29', category: 'Steroids', label: 'Dexamethasone 4mg Tab', genericName: 'Dexamethasone', brandName: '', strength: '4mg', form: 'Tablet', route: 'PO', dosage: '1 tablet', frequency: 'OD', duration: '5 days', instructions: 'Take with food' },

  // Vitamins/Supplements
  { id: 'm30', category: 'Vitamins/Supplements', label: 'Iron + Folic Acid Tab', genericName: 'Iron + Folic Acid', brandName: '', strength: 'Standard', form: 'Tablet', route: 'PO', dosage: '1 tablet', frequency: 'OD', duration: '30 days', instructions: 'Take with meals' },
  { id: 'm31', category: 'Vitamins/Supplements', label: 'Vitamin D3 1000IU Tab', genericName: 'Cholecalciferol', brandName: '', strength: '1000IU', form: 'Tablet', route: 'PO', dosage: '1 tablet', frequency: 'OD', duration: '30 days', instructions: 'Take with meals' },
  { id: 'm32', category: 'Vitamins/Supplements', label: 'Calcium + Vitamin D Tab', genericName: 'Calcium + Vitamin D', brandName: '', strength: 'Standard', form: 'Tablet', route: 'PO', dosage: '1 tablet', frequency: 'OD', duration: '30 days', instructions: 'Take with meals' },
  { id: 'm33', category: 'Vitamins/Supplements', label: 'Vitamin B12 1mg Tab', genericName: 'Cyanocobalamin', brandName: '', strength: '1mg', form: 'Tablet', route: 'PO', dosage: '1 tablet', frequency: 'OD', duration: '30 days', instructions: 'Take once daily' }
];

export const DOSAGE_FORMS = [
  'Tablet', 'Capsule', 'Syrup', 'Suspension', 'Injection', 'Inhaler', 'Cream', 'Ointment', 'Drops', 'Suppository', 'Patch'
];

export const ROUTES = [
  'PO (Oral)', 'IV (Intravenous)', 'IM (Intramuscular)', 'SC (Subcutaneous)', 'Topical', 'Inhaled', 'Sublingual', 'Rectal', 'Otic', 'Ophthalmic'
];

export const FREQUENCIES = [
  'OD (Once daily)', 'BID (Twice daily)', 'TID (Three times daily)', 'QID (Four times daily)', 'PRN (As needed)', 'Q4H (Every 4 hours)', 'Q6H (Every 6 hours)', 'Q8H (Every 8 hours)', 'Stat (Immediately)', 'At bedtime'
];
