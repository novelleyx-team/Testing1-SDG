-- Enum for Roles
CREATE TYPE user_role AS ENUM ('STUDENT', 'FACULTY', 'HOD', 'DEAN', 'ADMIN');

-- Users Table (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  role user_role NOT NULL,
  department_id UUID,
  mentor_id UUID REFERENCES public.profiles(id),
  full_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 1. Students can only read and update their own profile
CREATE POLICY "Students manage own profile" ON public.profiles
  FOR ALL USING (auth.uid() = id AND role = 'STUDENT');

-- 2. Faculty can read profiles of students assigned to them
CREATE POLICY "Faculty read assigned students" ON public.profiles
  FOR SELECT USING (auth.uid() = mentor_id AND (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'FACULTY');

-- 3. HODs can read profiles within their department
CREATE POLICY "HODs read department" ON public.profiles
  FOR SELECT USING (department_id = (SELECT department_id FROM public.profiles WHERE id = auth.uid()) AND (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'HOD');

-- 4. Deans can read all academic profiles (Aggregated views)
CREATE POLICY "Deans read all academic" ON public.profiles
  FOR SELECT USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'DEAN');

-- 5. Admin can read all (Technical oversight, but application UI filters out academic data)
CREATE POLICY "Admins read all" ON public.profiles
  FOR SELECT USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'ADMIN');


-- Webhook Trigger for SMTP (Pseudo-code for Edge Function payload)
-- In Supabase dashboard, create a Webhook on INSERT to auth.users 
-- pointing to https://<project>.supabase.co/functions/v1/send-welcome-email
