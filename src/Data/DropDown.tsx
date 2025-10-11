const symptoms = [
  "Fever",
  "Cough",
  "Fatigue",
  "Headache",
  "Sore throat",
  "Runny nose",
  "Body ache",
  "Shortness of breath",
  "Chest pain",
  "Dizziness",
  "Nausea",
  "Vomiting",
  "Diarrhea",
  "Loss of taste",
  "Loss of smell",
  "Skin rash",
  "Chills",
  "Sweating",
  "Joint pain",
  "Stomach pain",
  "Weakness",
  "Blurred vision",
  "Insomnia",
  "Anxiety",
  "Weight loss",
  "Weight gain",
  "Swelling",
  "Ear pain",
  "Back pain"
].map((item) => ({ value: item, label: item }));


const tests = [
  "Blood Test",
  "Urine Test",
  "X-Ray",
  "CT Scan",
  "MRI",
  "Ultrasound",
  "ECG (Electrocardiogram)",
  "EEG (Electroencephalogram)",
  "Liver Function Test",
  "Kidney Function Test",
  "Thyroid Test",
  "Blood Sugar Test",
  "Cholesterol Test",
  "CBC (Complete Blood Count)",
  "COVID-19 Test",
  "Allergy Test",
  "Bone Density Test",
  "Pap Smear",
  "Mammogram",
  "Endoscopy"
].map((item) => ({ value: item, label: item }));


const frequencyOptions = [
  { label: "1-0-0 (Morning Only)", value: "1-0-0" },
  { label: "0-1-0 (Afternoon Only)", value: "0-1-0" },
  { label: "0-0-1 (Night Only)", value: "0-0-1" },
  { label: "1-1-0 (Morning & Afternoon)", value: "1-1-0" },
  { label: "1-0-1 (Morning & Night)", value: "1-0-1" },
  { label: "0-1-1 (Afternoon & Night)", value: "0-1-1" },
  { label: "1-1-1 (Morning, Afternoon & Night)", value: "1-1-1" }
];

export default { symptoms, tests, frequencyOptions };
