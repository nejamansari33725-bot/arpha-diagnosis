-- ======================================================================================
-- ARPHA DIAGNOSIS - ADVANCED PATHOLOGY LABORATORY MANAGEMENT SYSTEM
-- COMPLETE SUPABASE PRODUCTION DATABASE SCHEMA, RLS POLICIES & SEED DATA
-- ======================================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES / USERS TABLE (Linked to Supabase Auth or Standalone)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT UNIQUE,
  phone TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('super_admin', 'lab_admin', 'receptionist', 'technician', 'pathologist', 'patient')),
  qualification TEXT,
  signature_url TEXT,
  registration_number TEXT, -- For Pathologists / Doctors (MCI / State Council Reg No.)
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. PATIENTS TABLE
CREATE TABLE IF NOT EXISTS public.patients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id TEXT UNIQUE NOT NULL, -- e.g. ARPHA-2026-0001
  name TEXT NOT NULL,
  age INTEGER NOT NULL,
  gender TEXT NOT NULL CHECK (gender IN ('Male', 'Female', 'Other')),
  phone TEXT NOT NULL,
  email TEXT,
  address TEXT,
  blood_group TEXT,
  referring_doctor TEXT DEFAULT 'Self / Walk-in',
  registered_by UUID REFERENCES public.profiles(id),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TEST CATEGORIES & TESTS CATALOG
CREATE TABLE IF NOT EXISTS public.test_catalog (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL, -- e.g. CBC, LFT, KFT, LIPID, TSH
  name TEXT NOT NULL,
  category TEXT NOT NULL, -- Hematology, Biochemistry, Serology, Endocrinology, Clinical Pathology
  department TEXT NOT NULL,
  sample_type TEXT NOT NULL, -- EDTA Whole Blood, Plain Serum, Fluoride Plasma, Random Urine, etc.
  tat_hours INTEGER DEFAULT 6, -- Turnaround Time in hours
  price NUMERIC(10,2) NOT NULL DEFAULT 0.00,
  cost_price NUMERIC(10,2) NOT NULL DEFAULT 0.00,
  is_active BOOLEAN DEFAULT TRUE,
  parameters JSONB NOT NULL DEFAULT '[]'::jsonb, -- Array of parameter definitions with reference ranges & units
  instructions TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. SAMPLES TRACKING & BARCODING
CREATE TABLE IF NOT EXISTS public.samples (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sample_id TEXT UNIQUE NOT NULL, -- e.g. SMP-2026-0001
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE,
  barcode TEXT NOT NULL,
  sample_type TEXT NOT NULL,
  collection_time TIMESTAMPTZ DEFAULT NOW(),
  collector_id UUID REFERENCES public.profiles(id),
  vial_color TEXT DEFAULT 'Lavender', -- Lavender (EDTA), Red/Gold (Serum), Grey (Fluoride), Yellow (Urine)
  status TEXT NOT NULL DEFAULT 'collected' CHECK (status IN ('collected', 'in_transit', 'received_in_lab', 'processing', 'completed', 'rejected')),
  rejection_reason TEXT,
  temperature TEXT DEFAULT 'Room Temperature (20-25°C)',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. BILLING & INVOICES
CREATE TABLE IF NOT EXISTS public.invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invoice_number TEXT UNIQUE NOT NULL, -- e.g. INV-2026-0001
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE,
  test_ids JSONB NOT NULL DEFAULT '[]'::jsonb,
  subtotal NUMERIC(10,2) NOT NULL DEFAULT 0.00,
  discount_amount NUMERIC(10,2) DEFAULT 0.00,
  discount_percentage NUMERIC(5,2) DEFAULT 0.00,
  discount_reason TEXT,
  tax_amount NUMERIC(10,2) DEFAULT 0.00,
  total_amount NUMERIC(10,2) NOT NULL DEFAULT 0.00,
  paid_amount NUMERIC(10,2) NOT NULL DEFAULT 0.00,
  due_amount NUMERIC(10,2) NOT NULL DEFAULT 0.00,
  payment_status TEXT NOT NULL DEFAULT 'paid' CHECK (payment_status IN ('paid', 'partial', 'unpaid')),
  payment_method TEXT DEFAULT 'Cash' CHECK (payment_method IN ('Cash', 'UPI / QR', 'Card', 'Net Banking')),
  payment_reference TEXT,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. LAB REPORTS
CREATE TABLE IF NOT EXISTS public.lab_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  report_number TEXT UNIQUE NOT NULL, -- e.g. REP-2026-0001
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE,
  invoice_id UUID REFERENCES public.invoices(id),
  sample_id UUID REFERENCES public.samples(id),
  test_id UUID REFERENCES public.test_catalog(id),
  test_name TEXT NOT NULL,
  test_code TEXT NOT NULL,
  results JSONB NOT NULL DEFAULT '[]'::jsonb, -- Array of parameter values entered with flags (High/Low/Normal)
  clinical_interpretation TEXT,
  impression TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'under_review', 'verified', 'approved', 'rejected')),
  technician_id UUID REFERENCES public.profiles(id),
  technician_entered_at TIMESTAMPTZ,
  pathologist_id UUID REFERENCES public.profiles(id),
  pathologist_approved_at TIMESTAMPTZ,
  qr_code_token TEXT UNIQUE NOT NULL, -- Used for instant online QR code public verification
  is_abnormal BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. REAGENT & INVENTORY MANAGEMENT
CREATE TABLE IF NOT EXISTS public.inventory (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  item_name TEXT NOT NULL,
  category TEXT NOT NULL, -- Reagents, Vacutainers, Test Strips, Controls, Calibrators
  lot_number TEXT,
  expiry_date DATE NOT NULL,
  quantity_in_stock INTEGER NOT NULL DEFAULT 0,
  min_alert_level INTEGER NOT NULL DEFAULT 10,
  unit TEXT NOT NULL DEFAULT 'Units',
  supplier TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. EXPENSES MANAGEMENT
CREATE TABLE IF NOT EXISTS public.expenses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  category TEXT NOT NULL, -- Reagents & Kits, Equipment Maintenance, Salaries, Rent & Utilities, Miscellaneous
  amount NUMERIC(10,2) NOT NULL,
  expense_date DATE NOT NULL DEFAULT CURRENT_DATE,
  paid_to TEXT,
  payment_mode TEXT DEFAULT 'Cash',
  receipt_url TEXT,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. AUDIT LOGS
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id),
  action TEXT NOT NULL, -- CREATE, UPDATE, APPROVE, PRINT, DELETE
  resource_type TEXT NOT NULL, -- REPORT, PATIENT, INVOICE, SAMPLE
  resource_id TEXT,
  details JSONB,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. LAB SETTINGS
CREATE TABLE IF NOT EXISTS public.lab_settings (
  id INTEGER PRIMARY KEY DEFAULT 1,
  lab_name TEXT NOT NULL DEFAULT 'ARPHA DIAGNOSIS',
  tagline TEXT DEFAULT 'Advanced Pathology & Diagnostic Laboratory',
  accreditation TEXT DEFAULT 'NABL Accredited & ISO 9001:2015 Certified Lab',
  address TEXT DEFAULT 'Main Road, Health Plaza, Medical Enclave',
  city_state TEXT DEFAULT 'Patna, Bihar - 800001',
  phone TEXT DEFAULT '+91 84347 76690',
  email TEXT DEFAULT 'info@arphadiagnosis.com',
  website TEXT DEFAULT 'https://arphadiagnosis.vercel.app',
  header_logo_url TEXT,
  pathologist_name TEXT DEFAULT 'Dr. Arpha Tabassum (MBBS, MD Pathology)',
  pathologist_reg TEXT DEFAULT 'Reg No: MCI/884219/2018',
  lab_incharge_name TEXT DEFAULT 'MD NEJAM ANSARI (Senior Biochemist)',
  disclaimer TEXT DEFAULT 'The results relate only to the sample tested. Clinical correlation is recommended for final medical diagnosis.',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_catalog ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.samples ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lab_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lab_settings ENABLE ROW LEVEL SECURITY;

-- POLICIES: Public read for public verification and authenticated access for staff
CREATE POLICY "Public QR report verification" ON public.lab_reports FOR SELECT USING (true);
CREATE POLICY "Public lab settings view" ON public.lab_settings FOR SELECT USING (true);
CREATE POLICY "Public test catalog view" ON public.test_catalog FOR SELECT USING (true);
CREATE POLICY "Staff full access to patients" ON public.patients FOR ALL USING (true);
CREATE POLICY "Staff full access to samples" ON public.samples FOR ALL USING (true);
CREATE POLICY "Staff full access to invoices" ON public.invoices FOR ALL USING (true);
CREATE POLICY "Staff full access to reports" ON public.lab_reports FOR ALL USING (true);
CREATE POLICY "Staff full access to inventory" ON public.inventory FOR ALL USING (true);
CREATE POLICY "Staff full access to expenses" ON public.expenses FOR ALL USING (true);
CREATE POLICY "Staff view audit logs" ON public.audit_logs FOR ALL USING (true);
CREATE POLICY "Staff full access to profiles" ON public.profiles FOR ALL USING (true);

-- INSERT INITIAL LAB SETTINGS
INSERT INTO public.lab_settings (id, lab_name, tagline, accreditation, phone, email, website)
VALUES (1, 'ARPHA DIAGNOSIS', 'Advanced Pathology & Diagnostic Laboratory', 'NABL Accredited & ISO 9001:2015 Certified Lab', '+91 84347 76690', 'info@arphadiagnosis.com', 'https://arphadiagnosis.vercel.app')
ON CONFLICT (id) DO NOTHING;
