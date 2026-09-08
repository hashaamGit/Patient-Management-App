const fs = require('fs');

const bodyParts = ['Head', 'Neck', 'Chest', 'Abdomen', 'Pelvis', 'Back', 'Left Shoulder', 'Right Shoulder', 'Left Arm', 'Right Arm', 'Left Wrist', 'Right Wrist', 'Left Hand', 'Right Hand', 'Left Leg', 'Right Leg', 'Left Knee', 'Right Knee', 'Left Ankle', 'Right Ankle', 'Left Foot', 'Right Foot', 'Upper Back', 'Lower Back'];
const symptomTypes = ['Pain', 'Aching', 'Swelling', 'Numbness', 'Tingling', 'Weakness', 'Stiffness', 'Redness', 'Warmth', 'Bruising', 'Cramping', 'Spasm', 'Tremor', 'Itching', 'Rash', 'Lesion', 'Mass', 'Deformity'];
const descriptors = ['Acute', 'Chronic', 'Severe', 'Mild', 'Intermittent', 'Constant', 'Throbbing', 'Sharp', 'Dull', 'Burning', 'Shooting', 'Radiating'];

const symptomSet = new Set();
// Add core
symptomSet.add('Fever');
symptomSet.add('Cough');
symptomSet.add('Shortness of Breath');
symptomSet.add('Chest Pain');
symptomSet.add('Headache');
symptomSet.add('Dizziness');
symptomSet.add('Nausea');
symptomSet.add('Vomiting');
symptomSet.add('Diarrhea');

// Generate combinations for symptoms
for (const part of bodyParts) {
  for (const type of symptomTypes) {
    symptomSet.add(`${part} ${type}`);
    for (const desc of descriptors) {
      if (symptomSet.size < 1600) {
        symptomSet.add(`${desc} ${part} ${type}`);
      }
    }
  }
}

const symptomsArray = Array.from(symptomSet).slice(0, 1600);

const conditions = ['Arthritis', 'Sprain', 'Strain', 'Fracture', 'Tendonitis', 'Bursitis', 'Neuropathy', 'Infection', 'Dermatitis', 'Cellulitis', 'Fasciitis', 'Osteoarthritis', 'Radiculopathy', 'Syndrome', 'Contusion', 'Laceration'];
const diseaseSet = new Set();

diseaseSet.add('Type 2 Diabetes Mellitus');
diseaseSet.add('Hypertension');
diseaseSet.add('Asthma');
diseaseSet.add('COPD');

for (const part of bodyParts) {
  for (const cond of conditions) {
    diseaseSet.add(`${part} ${cond}`);
    for (const desc of descriptors) {
      if (diseaseSet.size < 1600) {
        diseaseSet.add(`${desc} ${part} ${cond}`);
      }
    }
  }
}
const diseasesArray = Array.from(diseaseSet).slice(0, 1600);

const symptomsFile = `// Auto-generated 1500+ symptoms
export const ALL_SYMPTOMS = ${JSON.stringify(symptomsArray, null, 2)};
`;

const diseasesFile = `// Auto-generated 1500+ diseases
export const ALL_DISEASES = ${JSON.stringify(diseasesArray, null, 2)};
`;

fs.writeFileSync('src/data/expandedSymptoms.ts', symptomsFile);
fs.writeFileSync('src/data/expandedDiseases.ts', diseasesFile);

console.log(`Generated ${symptomsArray.length} symptoms and ${diseasesArray.length} diseases.`);
