// ARPHA DIAGNOSIS - MEDICAL TEST CATALOG & REFERENCE INTERVALS

export const INITIAL_TESTS = [
  {
    id: "test-cbc",
    code: "CBC",
    name: "Complete Blood Count (CBC with ESR)",
    category: "Hematology",
    department: "Clinical Hematology",
    sampleType: "EDTA Whole Blood (Lavender Top)",
    vialColor: "Lavender",
    tatHours: 4,
    price: 350,
    costPrice: 80,
    isActive: true,
    description: "Evaluates overall health and detects a wide range of disorders, including anemia, infection and leukemia.",
    parameters: [
      { name: "Hemoglobin (Hb)", unit: "g/dL", minMale: 13.0, maxMale: 17.0, minFemale: 12.0, maxFemale: 15.0, minChild: 11.5, maxChild: 14.5, defaultVal: 14.2 },
      { name: "Total Leucocyte Count (TLC / WBC)", unit: "/cumm", minMale: 4000, maxMale: 11000, minFemale: 4000, maxFemale: 11000, defaultVal: 7200 },
      { name: "RBC Count", unit: "mil/cumm", minMale: 4.5, maxMale: 5.9, minFemale: 4.0, maxFemale: 5.2, defaultVal: 4.8 },
      { name: "Packed Cell Volume (PCV / Hematocrit)", unit: "%", minMale: 40, maxMale: 50, minFemale: 36, maxFemale: 46, defaultVal: 42.5 },
      { name: "Mean Corpuscular Volume (MCV)", unit: "fL", minMale: 80, maxMale: 100, minFemale: 80, maxFemale: 100, defaultVal: 88.5 },
      { name: "Mean Corpuscular Hemoglobin (MCH)", unit: "pg", minMale: 27, maxMale: 32, minFemale: 27, maxFemale: 32, defaultVal: 29.6 },
      { name: "MCHC", unit: "g/dL", minMale: 32, maxMale: 36, minFemale: 32, maxFemale: 36, defaultVal: 33.4 },
      { name: "Platelet Count", unit: "lakhs/cumm", minMale: 1.5, maxMale: 4.5, minFemale: 1.5, maxFemale: 4.5, defaultVal: 2.8 },
      { name: "Neutrophils", unit: "%", minMale: 40, maxMale: 75, minFemale: 40, maxFemale: 75, defaultVal: 62 },
      { name: "Lymphocytes", unit: "%", minMale: 20, maxMale: 45, minFemale: 20, maxFemale: 45, defaultVal: 28 },
      { name: "Eosinophils", unit: "%", minMale: 1, maxMale: 6, minFemale: 1, maxFemale: 6, defaultVal: 4 },
      { name: "Monocytes", unit: "%", minMale: 2, maxMale: 8, minFemale: 2, maxFemale: 8, defaultVal: 5 },
      { name: "Basophils", unit: "%", minMale: 0, maxMale: 1, minFemale: 0, maxFemale: 1, defaultVal: 1 },
      { name: "ESR (Westergren Method)", unit: "mm/1st hr", minMale: 0, maxMale: 15, minFemale: 0, maxFemale: 20, defaultVal: 8 }
    ]
  },
  {
    id: "test-lft",
    code: "LFT",
    name: "Liver Function Test (LFT Profile)",
    category: "Biochemistry",
    department: "Clinical Biochemistry",
    sampleType: "Plain Serum (Red / Gold Gel Top)",
    vialColor: "Red",
    tatHours: 6,
    price: 650,
    costPrice: 150,
    isActive: true,
    description: "Evaluates liver enzymes, bilirubin and protein synthesis to diagnose hepatitis, jaundice and liver health.",
    parameters: [
      { name: "Bilirubin Total", unit: "mg/dL", minMale: 0.2, maxMale: 1.2, minFemale: 0.2, maxFemale: 1.2, defaultVal: 0.8 },
      { name: "Bilirubin Direct (Conjugated)", unit: "mg/dL", minMale: 0.0, maxMale: 0.3, minFemale: 0.0, maxFemale: 0.3, defaultVal: 0.15 },
      { name: "Bilirubin Indirect (Unconjugated)", unit: "mg/dL", minMale: 0.1, maxMale: 0.9, minFemale: 0.1, maxFemale: 0.9, defaultVal: 0.65 },
      { name: "SGOT / AST (Aspartate Aminotransferase)", unit: "U/L", minMale: 5, maxMale: 40, minFemale: 5, maxFemale: 35, defaultVal: 24 },
      { name: "SGPT / ALT (Alanine Aminotransferase)", unit: "U/L", minMale: 7, maxMale: 56, minFemale: 7, maxFemale: 45, defaultVal: 28 },
      { name: "Alkaline Phosphatase (ALP)", unit: "U/L", minMale: 44, maxMale: 147, minFemale: 44, maxFemale: 147, defaultVal: 88 },
      { name: "Total Protein", unit: "g/dL", minMale: 6.4, maxMale: 8.3, minFemale: 6.4, maxFemale: 8.3, defaultVal: 7.2 },
      { name: "Serum Albumin", unit: "g/dL", minMale: 3.5, maxMale: 5.2, minFemale: 3.5, maxFemale: 5.2, defaultVal: 4.4 },
      { name: "Serum Globulin", unit: "g/dL", minMale: 2.0, maxMale: 3.5, minFemale: 2.0, maxFemale: 3.5, defaultVal: 2.8 },
      { name: "A : G Ratio", unit: "Ratio", minMale: 1.2, maxMale: 2.2, minFemale: 1.2, maxFemale: 2.2, defaultVal: 1.57 }
    ]
  },
  {
    id: "test-kft",
    code: "KFT",
    name: "Kidney Function Test (KFT / Renal Profile)",
    category: "Biochemistry",
    department: "Clinical Biochemistry",
    sampleType: "Plain Serum (Red / Gold Gel Top)",
    vialColor: "Red",
    tatHours: 6,
    price: 600,
    costPrice: 140,
    isActive: true,
    description: "Evaluates renal clearance, filtration, blood urea, serum creatinine and serum electrolytes.",
    parameters: [
      { name: "Blood Urea", unit: "mg/dL", minMale: 15, maxMale: 45, minFemale: 15, maxFemale: 45, defaultVal: 26 },
      { name: "Serum Creatinine", unit: "mg/dL", minMale: 0.7, maxMale: 1.3, minFemale: 0.5, maxFemale: 1.1, defaultVal: 0.95 },
      { name: "Serum Uric Acid", unit: "mg/dL", minMale: 3.5, maxMale: 7.2, minFemale: 2.6, maxFemale: 6.0, defaultVal: 4.8 },
      { name: "Blood Urea Nitrogen (BUN)", unit: "mg/dL", minMale: 7, maxMale: 20, minFemale: 7, maxFemale: 20, defaultVal: 12.1 },
      { name: "Sodium (Na+)", unit: "mEq/L", minMale: 136, maxMale: 145, minFemale: 136, maxFemale: 145, defaultVal: 140 },
      { name: "Potassium (K+)", unit: "mEq/L", minMale: 3.5, maxMale: 5.1, minFemale: 3.5, maxFemale: 5.1, defaultVal: 4.2 },
      { name: "Chloride (Cl-)", unit: "mEq/L", minMale: 98, maxMale: 107, minFemale: 98, maxFemale: 107, defaultVal: 102 }
    ]
  },
  {
    id: "test-lipid",
    code: "LIPID",
    name: "Lipid Profile (Cardiovascular Risk Panel)",
    category: "Biochemistry",
    department: "Clinical Biochemistry",
    sampleType: "Plain Serum - 12h Fasting (Red Top)",
    vialColor: "Red",
    tatHours: 6,
    price: 550,
    costPrice: 130,
    isActive: true,
    description: "Comprehensive assessment of cardiovascular risk, good and bad cholesterol and triglycerides.",
    parameters: [
      { name: "Total Cholesterol", unit: "mg/dL", minMale: 125, maxMale: 200, minFemale: 125, maxFemale: 200, defaultVal: 172 },
      { name: "HDL Cholesterol (Good Cholesterol)", unit: "mg/dL", minMale: 40, maxMale: 60, minFemale: 50, maxFemale: 70, defaultVal: 48 },
      { name: "LDL Cholesterol (Bad Cholesterol)", unit: "mg/dL", minMale: 60, maxMale: 130, minFemale: 60, maxFemale: 130, defaultVal: 98 },
      { name: "VLDL Cholesterol", unit: "mg/dL", minMale: 10, maxMale: 30, minFemale: 10, maxFemale: 30, defaultVal: 22 },
      { name: "Triglycerides", unit: "mg/dL", minMale: 50, maxMale: 150, minFemale: 50, maxFemale: 150, defaultVal: 110 },
      { name: "Cholesterol / HDL Ratio", unit: "Ratio", minMale: 3.0, maxMale: 5.0, minFemale: 3.0, maxFemale: 4.5, defaultVal: 3.58 }
    ]
  },
  {
    id: "test-thyroid",
    code: "THYROID",
    name: "Thyroid Profile (Total T3, Total T4 & Ultra TSH)",
    category: "Endocrinology",
    department: "Immunoassay / CLIA",
    sampleType: "Plain Serum (Red Top)",
    vialColor: "Red",
    tatHours: 8,
    price: 450,
    costPrice: 120,
    isActive: true,
    description: "Screens and monitors thyroid disorders like Hypothyroidism and Hyperthyroidism.",
    parameters: [
      { name: "Total Triiodothyronine (T3)", unit: "ng/dL", minMale: 70, maxMale: 200, minFemale: 70, maxFemale: 200, defaultVal: 122 },
      { name: "Total Thyroxine (T4)", unit: "µg/dL", minMale: 5.0, maxMale: 12.0, minFemale: 5.0, maxFemale: 12.0, defaultVal: 8.4 },
      { name: "Thyroid Stimulating Hormone (TSH)", unit: "µIU/mL", minMale: 0.35, maxMale: 4.94, minFemale: 0.35, maxFemale: 4.94, defaultVal: 2.15 }
    ]
  },
  {
    id: "test-fbs",
    code: "FBS",
    name: "Blood Glucose - Fasting (FBS)",
    category: "Biochemistry",
    department: "Clinical Biochemistry",
    sampleType: "Fluoride Plasma (Grey Top)",
    vialColor: "Grey",
    tatHours: 2,
    price: 80,
    costPrice: 20,
    isActive: true,
    description: "Evaluates blood sugar after 8-10 hours of overnight fasting to detect diabetes and pre-diabetes.",
    parameters: [
      { name: "Fasting Blood Sugar", unit: "mg/dL", minMale: 70, maxMale: 99, minFemale: 70, maxFemale: 99, defaultVal: 88 }
    ]
  },
  {
    id: "test-ppbs",
    code: "PPBS",
    name: "Blood Glucose - Post Prandial (PPBS)",
    category: "Biochemistry",
    department: "Clinical Biochemistry",
    sampleType: "Fluoride Plasma - 2h Post Meal (Grey Top)",
    vialColor: "Grey",
    tatHours: 2,
    price: 80,
    costPrice: 20,
    isActive: true,
    description: "Measures blood sugar 2 hours after a meal to assess glucose tolerance and insulin response.",
    parameters: [
      { name: "Post Prandial Blood Sugar", unit: "mg/dL", minMale: 70, maxMale: 140, minFemale: 70, maxFemale: 140, defaultVal: 124 }
    ]
  },
  {
    id: "test-hba1c",
    code: "HBA1C",
    name: "HbA1c (Glycated Hemoglobin / 3-Month Glucose)",
    category: "Biochemistry",
    department: "HPLC / Glycohemoglobin",
    sampleType: "EDTA Whole Blood (Lavender Top)",
    vialColor: "Lavender",
    tatHours: 4,
    price: 450,
    costPrice: 110,
    isActive: true,
    description: "Gold standard test measuring 3-month average blood sugar control without need for fasting.",
    parameters: [
      { name: "HbA1c (Glycated Hemoglobin)", unit: "%", minMale: 4.0, maxMale: 5.6, minFemale: 4.0, maxFemale: 5.6, defaultVal: 5.4 },
      { name: "Estimated Average Glucose (eAG)", unit: "mg/dL", minMale: 68, maxMale: 115, minFemale: 68, maxFemale: 115, defaultVal: 108 }
    ]
  },
  {
    id: "test-urine",
    code: "URINE-RE",
    name: "Urine Complete Routine & Microscopic Examination",
    category: "Clinical Pathology",
    department: "Clinical Pathology",
    sampleType: "First Morning Clean Catch Urine Container",
    vialColor: "Yellow Container",
    tatHours: 3,
    price: 150,
    costPrice: 30,
    isActive: true,
    description: "Detects urinary tract infections (UTI), kidney disease and metabolic disorders.",
    parameters: [
      { name: "Color", unit: "", textRange: "Pale Yellow to Straw", defaultVal: "Pale Yellow", isText: true },
      { name: "Appearance / Clarity", unit: "", textRange: "Clear", defaultVal: "Clear", isText: true },
      { name: "Specific Gravity", unit: "", minMale: 1.005, maxMale: 1.030, minFemale: 1.005, maxFemale: 1.030, defaultVal: 1.018 },
      { name: "pH Reaction", unit: "", minMale: 4.5, maxMale: 8.0, minFemale: 4.5, maxFemale: 8.0, defaultVal: 6.0 },
      { name: "Protein / Albumin", unit: "", textRange: "Nil / Negative", defaultVal: "Nil", isText: true },
      { name: "Urine Sugar / Glucose", unit: "", textRange: "Nil / Negative", defaultVal: "Nil", isText: true },
      { name: "Ketone Bodies", unit: "", textRange: "Negative", defaultVal: "Negative", isText: true },
      { name: "Bile Salts & Pigments", unit: "", textRange: "Negative", defaultVal: "Negative", isText: true },
      { name: "Pus Cells (Leukocytes)", unit: "/hpf", minMale: 0, maxMale: 5, minFemale: 0, maxFemale: 5, defaultVal: 2 },
      { name: "Red Blood Cells (RBCs)", unit: "/hpf", minMale: 0, maxMale: 2, minFemale: 0, maxFemale: 2, defaultVal: 0 },
      { name: "Epithelial Cells", unit: "/hpf", textRange: "Few (1-3/hpf)", defaultVal: "1-2 / hpf", isText: true },
      { name: "Casts & Crystals", unit: "", textRange: "Not Seen", defaultVal: "Not Seen", isText: true }
    ]
  },
  {
    id: "test-vit-d",
    code: "VIT-D",
    name: "Vitamin D - 25 Hydroxy (25-OH Cholecalciferol)",
    category: "Biochemistry",
    department: "Chemiluminescence (CLIA)",
    sampleType: "Plain Serum (Red Top)",
    vialColor: "Red",
    tatHours: 12,
    price: 1100,
    costPrice: 280,
    isActive: true,
    description: "Evaluates bone health, calcium absorption and immune system functioning.",
    parameters: [
      { name: "25-OH Vitamin D Total", unit: "ng/mL", minMale: 30, maxMale: 100, minFemale: 30, maxFemale: 100, defaultVal: 38.5 }
    ]
  },
  {
    id: "test-vit-b12",
    code: "VIT-B12",
    name: "Vitamin B12 (Cyanocobalamin)",
    category: "Biochemistry",
    department: "Chemiluminescence (CLIA)",
    sampleType: "Plain Serum (Red Top)",
    vialColor: "Red",
    tatHours: 12,
    price: 900,
    costPrice: 240,
    isActive: true,
    description: "Essential for nerve function, brain health and red blood cell production.",
    parameters: [
      { name: "Vitamin B12", unit: "pg/mL", minMale: 211, maxMale: 911, minFemale: 211, maxFemale: 911, defaultVal: 480 }
    ]
  }
];

export const INITIAL_STAFF = [
  {
    id: "staff-1",
    name: "MD NEJAM ANSARI",
    role: "super_admin",
    phone: "8434776690",
    email: "admin@arphadiagnosis.com",
    qualification: "M.Sc Biochemistry & Lab Director",
    status: "active",
    avatar: "👨‍⚕️"
  },
  {
    id: "staff-2",
    name: "Dr. Arpha Tabassum",
    role: "pathologist",
    phone: "9876543210",
    email: "pathologist@arphadiagnosis.com",
    qualification: "MBBS, MD Pathology (Gold Medalist)",
    regNumber: "MCI/884219/2018",
    status: "active",
    avatar: "👩‍⚕️"
  },
  {
    id: "staff-3",
    name: "Rahul Kumar",
    role: "technician",
    phone: "9123456780",
    email: "tech@arphadiagnosis.com",
    qualification: "DMLT, B.Sc MLT",
    status: "active",
    avatar: "🔬"
  },
  {
    id: "staff-4",
    name: "Priya Sharma",
    role: "receptionist",
    phone: "9812345671",
    email: "reception@arphadiagnosis.com",
    qualification: "B.Com, Healthcare Administration",
    status: "active",
    avatar: "👩‍💼"
  }
];

export const INITIAL_PATIENTS = [
  {
    id: "pat-1",
    patientId: "ARPHA-2026-0001",
    name: "Mohammad Irfan Ansari",
    age: 38,
    gender: "Male",
    phone: "9934125870",
    email: "irfan.ansari@gmail.com",
    address: "Bariatu Road, Near Medical College",
    bloodGroup: "B+",
    referringDoctor: "Dr. A. K. Verma (MD Medicine)",
    registeredAt: "2026-11-08T09:15:00Z",
    totalVisits: 3,
    status: "active"
  },
  {
    id: "pat-2",
    patientId: "ARPHA-2026-0002",
    name: "Sunita Kumari",
    age: 45,
    gender: "Female",
    phone: "9431187654",
    email: "sunita.k@yahoo.com",
    address: "Kankarbagh Colony, Sector 4",
    bloodGroup: "O+",
    referringDoctor: "Dr. Ritu Sinha (Gynecologist)",
    registeredAt: "2026-11-08T10:30:00Z",
    totalVisits: 1,
    status: "active"
  },
  {
    id: "pat-3",
    patientId: "ARPHA-2026-0003",
    name: "Sheikh Mohammad Dawood",
    age: 58,
    gender: "Male",
    phone: "8928266140",
    email: "dawood786@gmail.com",
    address: "Phulwari Sharif, Station Road",
    bloodGroup: "A+",
    referringDoctor: "Self / Walk-in",
    registeredAt: "2026-11-08T11:00:00Z",
    totalVisits: 2,
    status: "active"
  }
];

export const INITIAL_INVENTORY = [
  { id: "inv-1", name: "CBC Reagent Pack (Sysmex 3-Part)", category: "Reagents", lotNo: "LOT-9921B", expiryDate: "2027-04-30", inStock: 8, minAlert: 3, unit: "Kits" },
  { id: "inv-2", name: "Vacutainer EDTA K3 (Purple 3ml)", category: "Vacutainers", lotNo: "VT-2026-A", expiryDate: "2027-10-15", inStock: 350, minAlert: 100, unit: "Tubes" },
  { id: "inv-3", name: "Vacutainer Plain Clot Activator (Red 4ml)", category: "Vacutainers", lotNo: "VT-2026-R", expiryDate: "2027-09-20", inStock: 420, minAlert: 100, unit: "Tubes" },
  { id: "inv-4", name: "LFT Reagent Kit (Erba XL)", category: "Reagents", lotNo: "ERB-883", expiryDate: "2027-02-28", inStock: 4, minAlert: 2, unit: "Kits" },
  { id: "inv-5", name: "HbA1c Cartridges (HPLC Finecare)", category: "Test Strips", lotNo: "HBA-441", expiryDate: "2026-12-15", inStock: 25, minAlert: 15, unit: "Cartridges" },
  { id: "inv-6", name: "Urine 10-Parameter Test Strips", category: "Test Strips", lotNo: "URN-10P", expiryDate: "2027-06-30", inStock: 180, minAlert: 50, unit: "Strips" }
];

export const INITIAL_EXPENSES = [
  { id: "exp-1", title: "Diagnostic Reagents Purchase (Erba Diagnostics)", category: "Reagents & Kits", amount: 14500, date: "2026-11-05", paidTo: "Erba Diagnostics Pvt Ltd", mode: "UPI" },
  { id: "exp-2", title: "Cell Counter Preventive Maintenance & Calibration", category: "Equipment Maintenance", amount: 3500, date: "2026-11-04", paidTo: "Meditech Bio Systems", mode: "Cash" },
  { id: "exp-3", title: "Monthly Laboratory Electricity Bill", category: "Rent & Utilities", amount: 4800, date: "2026-11-02", paidTo: "Electricity Board", mode: "Net Banking" },
  { id: "exp-4", title: "Biomedical Waste Disposal Service", category: "Miscellaneous", amount: 1800, date: "2026-11-01", paidTo: "CleanBio Eco Solutions", mode: "UPI" }
];
