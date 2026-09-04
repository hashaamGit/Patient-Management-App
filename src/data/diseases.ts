export interface DiseaseDomainData {
  domain: string;
  icon: string;
  color: string;
  diseases: Array<{ name: string; icdCode: string }>;
}

export const DISEASE_DOMAINS: DiseaseDomainData[] = [
  {
    domain: 'Cardiology',
    icon: 'Heart',
    color: 'text-red-600',
    diseases: [
      { name: 'Hypertension', icdCode: 'I10' },
      { name: 'Ischemic Heart Disease', icdCode: 'I25.9' },
      { name: 'Acute MI / STEMI', icdCode: 'I21.3' },
      { name: 'Heart Failure', icdCode: 'I50.9' },
      { name: 'Atrial Fibrillation', icdCode: 'I48.91' },
      { name: 'Valvular Heart Disease', icdCode: 'I08.9' },
      { name: 'Infective Endocarditis', icdCode: 'I33.0' },
      { name: 'Pericarditis', icdCode: 'I30.9' },
      { name: 'Aortic Dissection', icdCode: 'I71.0' },
      { name: 'Deep Vein Thrombosis', icdCode: 'I82.90' },
      { name: 'Pulmonary Embolism', icdCode: 'I26.99' },
      { name: 'Peripheral Arterial Disease', icdCode: 'I73.9' },
      { name: 'SVT', icdCode: 'I47.1' },
      { name: 'Ventricular Tachycardia', icdCode: 'I47.2' },
      { name: 'Cardiac Tamponade', icdCode: 'I31.4' },
      { name: 'Myocarditis', icdCode: 'I40.9' }
    ]
  },
  {
    domain: 'Pulmonology',
    icon: 'Wind',
    color: 'text-sky-500',
    diseases: [
      { name: 'Asthma', icdCode: 'J45.909' },
      { name: 'COPD', icdCode: 'J44.1' },
      { name: 'Community-Acquired Pneumonia', icdCode: 'J18.9' },
      { name: 'Pulmonary Tuberculosis', icdCode: 'A15.0' },
      { name: 'Pleural Effusion', icdCode: 'J90' },
      { name: 'Pneumothorax', icdCode: 'J93.9' },
      { name: 'Lung Abscess', icdCode: 'J85.2' },
      { name: 'Bronchiectasis', icdCode: 'J47.9' },
      { name: 'Interstitial Lung Disease', icdCode: 'J84.9' },
      { name: 'Pulmonary Fibrosis', icdCode: 'J84.10' },
      { name: 'ARDS', icdCode: 'J80' },
      { name: 'Obstructive Sleep Apnea', icdCode: 'G47.33' }
    ]
  },
  {
    domain: 'Gastroenterology',
    icon: 'Apple',
    color: 'text-orange-500',
    diseases: [
      { name: 'GERD', icdCode: 'K21.0' },
      { name: 'Peptic Ulcer Disease', icdCode: 'K27.9' },
      { name: 'Acute Gastritis', icdCode: 'K29.0' },
      { name: 'Acute Pancreatitis', icdCode: 'K85.9' },
      { name: 'Chronic Liver Disease / Cirrhosis', icdCode: 'K74.60' },
      { name: 'Hepatitis B', icdCode: 'B16.9' },
      { name: 'Hepatitis C', icdCode: 'B17.10' },
      { name: 'Cholelithiasis', icdCode: 'K80.20' },
      { name: 'Cholecystitis', icdCode: 'K81.0' },
      { name: 'Appendicitis', icdCode: 'K35.80' },
      { name: "IBD - Crohn's", icdCode: 'K50.90' },
      { name: 'IBD - Ulcerative Colitis', icdCode: 'K51.90' },
      { name: 'IBS', icdCode: 'K58.9' },
      { name: 'Upper GI Bleed', icdCode: 'K92.0' },
      { name: 'Lower GI Bleed', icdCode: 'K92.1' },
      { name: 'Liver Abscess', icdCode: 'K75.0' }
    ]
  },
  {
    domain: 'Nephrology',
    icon: 'Droplets',
    color: 'text-blue-500',
    diseases: [
      { name: 'Acute Kidney Injury', icdCode: 'N17.9' },
      { name: 'Chronic Kidney Disease', icdCode: 'N18.9' },
      { name: 'Nephrotic Syndrome', icdCode: 'N04.9' },
      { name: 'Nephritic Syndrome', icdCode: 'N00.9' },
      { name: 'UTI - Lower', icdCode: 'N39.0' },
      { name: 'Pyelonephritis', icdCode: 'N10' },
      { name: 'Renal Calculi', icdCode: 'N20.0' },
      { name: 'Diabetic Nephropathy', icdCode: 'E11.21' },
      { name: 'Hypertensive Nephropathy', icdCode: 'I12.9' },
      { name: 'Polycystic Kidney Disease', icdCode: 'Q61.3' },
      { name: 'Renal Tubular Acidosis', icdCode: 'N25.89' }
    ]
  },
  {
    domain: 'Endocrinology',
    icon: 'Zap',
    color: 'text-yellow-500',
    diseases: [
      { name: 'DM Type 1', icdCode: 'E10.9' },
      { name: 'DM Type 2', icdCode: 'E11.9' },
      { name: 'Diabetic Ketoacidosis', icdCode: 'E10.10' },
      { name: 'Hypoglycemia', icdCode: 'E16.2' },
      { name: 'Hypothyroidism', icdCode: 'E03.9' },
      { name: 'Hyperthyroidism / Graves', icdCode: 'E05.00' },
      { name: 'Thyroid Nodule', icdCode: 'E04.1' },
      { name: 'Cushing Syndrome', icdCode: 'E24.9' },
      { name: 'Addison Disease', icdCode: 'E27.1' },
      { name: 'Hyperprolactinemia', icdCode: 'E22.1' },
      { name: 'Metabolic Syndrome', icdCode: 'E88.81' },
      { name: 'Pheochromocytoma', icdCode: 'D35.00' }
    ]
  },
  {
    domain: 'Neurology',
    icon: 'Brain',
    color: 'text-purple-500',
    diseases: [
      { name: 'Migraine', icdCode: 'G43.909' },
      { name: 'Tension Headache', icdCode: 'G44.209' },
      { name: 'Cluster Headache', icdCode: 'G44.009' },
      { name: 'Epilepsy', icdCode: 'G40.909' },
      { name: 'Ischemic Stroke', icdCode: 'I63.9' },
      { name: 'Hemorrhagic Stroke', icdCode: 'I61.9' },
      { name: 'TIA', icdCode: 'G45.9' },
      { name: "Bell's Palsy", icdCode: 'G51.0' },
      { name: 'Parkinson Disease', icdCode: 'G20.9' },
      { name: 'Multiple Sclerosis', icdCode: 'G35' },
      { name: 'Guillain-Barré', icdCode: 'G61.0' },
      { name: 'Meningitis', icdCode: 'G03.9' },
      { name: 'Trigeminal Neuralgia', icdCode: 'G50.0' },
      { name: 'Myasthenia Gravis', icdCode: 'G70.00' }
    ]
  },
  {
    domain: 'Infectious Diseases',
    icon: 'Bug',
    color: 'text-lime-600',
    diseases: [
      { name: 'Malaria', icdCode: 'B54' },
      { name: 'Typhoid', icdCode: 'A01.0' },
      { name: 'Dengue Fever', icdCode: 'A90' },
      { name: 'COVID-19', icdCode: 'U07.1' },
      { name: 'Influenza', icdCode: 'J11.1' },
      { name: 'HIV/AIDS', icdCode: 'B20' },
      { name: 'TB - Pulmonary', icdCode: 'A15.0' },
      { name: 'TB - Extra-pulmonary', icdCode: 'A18.9' },
      { name: 'Hepatitis A', icdCode: 'B15.9' },
      { name: 'Cellulitis', icdCode: 'L03.90' },
      { name: 'Sepsis', icdCode: 'A41.9' },
      { name: 'Meningitis - Bacterial', icdCode: 'G00.9' },
      { name: 'Infective Diarrhea', icdCode: 'A09' },
      { name: 'Herpes Simplex', icdCode: 'B00.9' },
      { name: 'Chicken Pox', icdCode: 'B01.9' },
      { name: 'Measles', icdCode: 'B05.9' }
    ]
  },
  {
    domain: 'Hematology',
    icon: 'Droplet',
    color: 'text-rose-500',
    diseases: [
      { name: 'Iron Deficiency Anemia', icdCode: 'D50.9' },
      { name: 'Megaloblastic Anemia', icdCode: 'D51.9' },
      { name: 'Thalassemia', icdCode: 'D56.9' },
      { name: 'Sickle Cell Disease', icdCode: 'D57.1' },
      { name: 'Aplastic Anemia', icdCode: 'D61.9' },
      { name: 'ITP', icdCode: 'D69.3' },
      { name: 'TTP', icdCode: 'M31.1' },
      { name: 'DIC', icdCode: 'D65' },
      { name: 'Hemophilia A', icdCode: 'D66' },
      { name: 'ALL', icdCode: 'C91.0' },
      { name: 'AML', icdCode: 'C92.0' },
      { name: 'CLL', icdCode: 'C91.10' },
      { name: 'CML', icdCode: 'C92.10' },
      { name: 'Hodgkin Lymphoma', icdCode: 'C81.90' },
      { name: 'Non-Hodgkin Lymphoma', icdCode: 'C85.90' },
      { name: 'Polycythemia Vera', icdCode: 'D45' }
    ]
  },
  {
    domain: 'Rheumatology',
    icon: 'Bone',
    color: 'text-stone-500',
    diseases: [
      { name: 'Rheumatoid Arthritis', icdCode: 'M06.9' },
      { name: 'Osteoarthritis', icdCode: 'M19.90' },
      { name: 'Gout', icdCode: 'M10.9' },
      { name: 'SLE', icdCode: 'M32.9' },
      { name: 'Ankylosing Spondylitis', icdCode: 'M45.9' },
      { name: 'Reactive Arthritis', icdCode: 'M02.9' },
      { name: 'Polymyalgia Rheumatica', icdCode: 'M35.3' },
      { name: 'Fibromyalgia', icdCode: 'M79.7' },
      { name: 'Scleroderma', icdCode: 'M34.9' },
      { name: 'Vasculitis', icdCode: 'M31.9' },
      { name: 'Sjogren Syndrome', icdCode: 'M35.00' },
      { name: 'Dermatomyositis', icdCode: 'M33.90' }
    ]
  },
  {
    domain: 'Dermatology',
    icon: 'Layers',
    color: 'text-pink-500',
    diseases: [
      { name: 'Eczema / Atopic Dermatitis', icdCode: 'L20.9' },
      { name: 'Psoriasis', icdCode: 'L40.9' },
      { name: 'Urticaria', icdCode: 'L50.9' },
      { name: 'Scabies', icdCode: 'B86' },
      { name: 'Tinea Corporis', icdCode: 'B35.4' },
      { name: 'Tinea Pedis', icdCode: 'B35.3' },
      { name: 'Acne Vulgaris', icdCode: 'L70.0' },
      { name: 'Contact Dermatitis', icdCode: 'L25.9' },
      { name: 'Herpes Zoster / Shingles', icdCode: 'B02.9' },
      { name: 'Seborrheic Dermatitis', icdCode: 'L21.9' },
      { name: 'Vitiligo', icdCode: 'L80' },
      { name: 'Alopecia Areata', icdCode: 'L63.9' },
      { name: 'Cellulitis', icdCode: 'L03.90' },
      { name: 'Impetigo', icdCode: 'L01.0' }
    ]
  },
  {
    domain: 'Psychiatry',
    icon: 'BrainCircuit',
    color: 'text-indigo-500',
    diseases: [
      { name: 'Major Depressive Disorder', icdCode: 'F32.9' },
      { name: 'Generalized Anxiety Disorder', icdCode: 'F41.1' },
      { name: 'Panic Disorder', icdCode: 'F41.0' },
      { name: 'OCD', icdCode: 'F42.9' },
      { name: 'Bipolar Disorder', icdCode: 'F31.9' },
      { name: 'Schizophrenia', icdCode: 'F20.9' },
      { name: 'PTSD', icdCode: 'F43.10' },
      { name: 'Substance Use Disorder', icdCode: 'F19.10' },
      { name: 'Insomnia Disorder', icdCode: 'G47.00' },
      { name: 'Social Anxiety Disorder', icdCode: 'F40.10' },
      { name: 'ADHD', icdCode: 'F90.9' },
      { name: 'Eating Disorders', icdCode: 'F50.9' }
    ]
  },
  {
    domain: 'ENT (Otolaryngology)',
    icon: 'Ear',
    color: 'text-amber-500',
    diseases: [
      { name: 'Acute Otitis Media', icdCode: 'H66.90' },
      { name: 'Chronic Otitis Media', icdCode: 'H66.3X9' },
      { name: 'Sinusitis', icdCode: 'J32.9' },
      { name: 'Tonsillitis', icdCode: 'J03.90' },
      { name: 'Allergic Rhinitis', icdCode: 'J30.9' },
      { name: 'Epistaxis', icdCode: 'R04.0' },
      { name: 'Laryngitis', icdCode: 'J04.0' },
      { name: 'Pharyngitis', icdCode: 'J02.9' },
      { name: 'BPPV', icdCode: 'H81.10' },
      { name: 'Meniere Disease', icdCode: 'H81.09' },
      { name: 'Otitis Externa', icdCode: 'H60.90' },
      { name: 'Peritonsillar Abscess', icdCode: 'J36' }
    ]
  },
  {
    domain: 'Orthopedics',
    icon: 'Bone',
    color: 'text-stone-600',
    diseases: [
      { name: 'Fracture - General', icdCode: 'T14.8' },
      { name: 'Lumbar Disc Herniation', icdCode: 'M51.16' },
      { name: 'Cervical Spondylosis', icdCode: 'M47.812' },
      { name: 'Frozen Shoulder', icdCode: 'M75.00' },
      { name: 'Carpal Tunnel Syndrome', icdCode: 'G56.00' },
      { name: 'Plantar Fasciitis', icdCode: 'M72.2' },
      { name: 'Rotator Cuff Tear', icdCode: 'M75.10' },
      { name: 'ACL Tear', icdCode: 'S83.50' },
      { name: 'Meniscal Tear', icdCode: 'S83.20' },
      { name: 'Tennis Elbow', icdCode: 'M77.10' },
      { name: 'De Quervain', icdCode: 'M65.4' },
      { name: 'Osteomyelitis', icdCode: 'M86.9' }
    ]
  },
  {
    domain: 'Obstetrics & Gynecology',
    icon: 'Baby',
    color: 'text-fuchsia-500',
    diseases: [
      { name: 'PCOS', icdCode: 'E28.2' },
      { name: 'Endometriosis', icdCode: 'N80.9' },
      { name: 'PID', icdCode: 'N73.0' },
      { name: 'Ectopic Pregnancy', icdCode: 'O00.9' },
      { name: 'Pre-eclampsia', icdCode: 'O14.90' },
      { name: 'Gestational Diabetes', icdCode: 'O24.4' },
      { name: 'Placenta Previa', icdCode: 'O44.0' },
      { name: 'Postpartum Hemorrhage', icdCode: 'O72.1' },
      { name: 'Miscarriage', icdCode: 'O03.9' },
      { name: 'Ovarian Cyst', icdCode: 'N83.20' },
      { name: 'Uterine Fibroids', icdCode: 'D25.9' },
      { name: 'Cervicitis', icdCode: 'N72' }
    ]
  },
  {
    domain: 'Urology',
    icon: 'Droplets',
    color: 'text-cyan-500',
    diseases: [
      { name: 'BPH', icdCode: 'N40.0' },
      { name: 'Prostatitis', icdCode: 'N41.9' },
      { name: 'Erectile Dysfunction', icdCode: 'N52.9' },
      { name: 'Testicular Torsion', icdCode: 'N44.0' },
      { name: 'Hydrocele', icdCode: 'N43.3' },
      { name: 'Varicocele', icdCode: 'I86.1' },
      { name: 'Urethritis', icdCode: 'N34.1' },
      { name: 'Bladder Cancer', icdCode: 'C67.9' },
      { name: 'Renal Cell Carcinoma', icdCode: 'C64.9' },
      { name: 'Phimosis', icdCode: 'N47.1' }
    ]
  },
  {
    domain: 'Emergency Medicine',
    icon: 'Siren',
    color: 'text-red-500',
    diseases: [
      { name: 'Anaphylaxis', icdCode: 'T78.2' },
      { name: 'Status Epilepticus', icdCode: 'G41.9' },
      { name: 'Acute MI / STEMI', icdCode: 'I21.3' },
      { name: 'Tension Pneumothorax', icdCode: 'J93.0' },
      { name: 'Hypertensive Emergency', icdCode: 'I16.1' },
      { name: 'Acute Pulmonary Edema', icdCode: 'J81.0' },
      { name: 'Cardiac Arrest', icdCode: 'I46.9' },
      { name: 'Severe Sepsis', icdCode: 'R65.20' },
      { name: 'DKA', icdCode: 'E10.10' },
      { name: 'Acute Stroke', icdCode: 'I63.9' },
      { name: 'Massive GI Bleed', icdCode: 'K92.2' },
      { name: 'Burns - Major', icdCode: 'T30.0' }
    ]
  },
  {
    domain: 'Ophthalmology',
    icon: 'Eye',
    color: 'text-emerald-500',
    diseases: [
      { name: 'Conjunctivitis', icdCode: 'H10.9' },
      { name: 'Glaucoma', icdCode: 'H40.9' },
      { name: 'Cataract', icdCode: 'H26.9' },
      { name: 'Diabetic Retinopathy', icdCode: 'H36' },
      { name: 'Macular Degeneration', icdCode: 'H35.30' },
      { name: 'Corneal Ulcer', icdCode: 'H16.0' },
      { name: 'Uveitis', icdCode: 'H20.9' },
      { name: 'Retinal Detachment', icdCode: 'H33.0' }
    ]
  },
  {
    domain: 'General Surgery',
    icon: 'Scissors',
    color: 'text-gray-600',
    diseases: [
      { name: 'Appendicitis', icdCode: 'K35.80' },
      { name: 'Inguinal Hernia', icdCode: 'K40.90' },
      { name: 'Umbilical Hernia', icdCode: 'K42.9' },
      { name: 'Hemorrhoids', icdCode: 'K64.9' },
      { name: 'Perianal Abscess', icdCode: 'K61.0' },
      { name: 'Anal Fissure', icdCode: 'K60.2' },
      { name: 'Intestinal Obstruction', icdCode: 'K56.60' },
      { name: 'Cholecystectomy Indication', icdCode: 'K80.00' },
      { name: 'Breast Abscess', icdCode: 'N61.1' }
    ]
  },
  {
    domain: 'Oncology',
    icon: 'Ribbon',
    color: 'text-violet-500',
    diseases: [
      { name: 'Breast Cancer', icdCode: 'C50.9' },
      { name: 'Colorectal Cancer', icdCode: 'C18.9' },
      { name: 'Lung Cancer', icdCode: 'C34.90' },
      { name: 'Prostate Cancer', icdCode: 'C61' },
      { name: 'Hepatocellular Carcinoma', icdCode: 'C22.0' },
      { name: 'Gastric Cancer', icdCode: 'C16.9' },
      { name: 'Cervical Cancer', icdCode: 'C53.9' },
      { name: 'Thyroid Cancer', icdCode: 'C73' },
      { name: 'Pancreatic Cancer', icdCode: 'C25.9' },
      { name: 'Leukemia', icdCode: 'C95.9' }
    ]
  },
  {
    domain: 'Pediatrics',
    icon: 'Baby',
    color: 'text-teal-500',
    diseases: [
      { name: 'Acute Gastroenteritis', icdCode: 'K52.9' },
      { name: 'Febrile Seizure', icdCode: 'R56.00' },
      { name: 'Bronchiolitis', icdCode: 'J21.9' },
      { name: 'Kawasaki Disease', icdCode: 'M30.3' },
      { name: 'Neonatal Jaundice', icdCode: 'P59.9' },
      { name: 'Croup', icdCode: 'J05.0' },
      { name: 'Hand-Foot-Mouth Disease', icdCode: 'B08.4' },
      { name: 'Rickets', icdCode: 'E55.0' },
      { name: 'Failure to Thrive', icdCode: 'R62.51' },
      { name: 'Congenital Heart Disease', icdCode: 'Q24.9' },
      { name: 'Pyloric Stenosis', icdCode: 'Q40.0' },
      { name: 'Intussusception', icdCode: 'K56.1' }
    ]
  }
];

export const ALL_DISEASES: string[] = DISEASE_DOMAINS.flatMap(d => d.diseases.map(disease => disease.name));
export const DOMAIN_LIST: string[] = DISEASE_DOMAINS.map(d => d.domain);
