-- Supabase Schema Migration: 001_initial_schema.sql
-- AgriPulse AI: AI-Powered Agriculture Crop Advisory Assistant

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create Farms Table
CREATE TABLE IF NOT EXISTS public.farms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    location TEXT NOT NULL,
    soil_type TEXT NOT NULL,
    size_acres NUMERIC(10,2),
    irrigation_system TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create Advisories Table
CREATE TABLE IF NOT EXISTS public.advisories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    farm_id UUID REFERENCES public.farms(id) ON DELETE CASCADE NOT NULL,
    crop_name TEXT NOT NULL,
    growth_stage TEXT NOT NULL,
    symptom_description TEXT NOT NULL,
    image_url TEXT,
    diagnosis_title TEXT NOT NULL,
    confidence_score NUMERIC(5,2) NOT NULL,
    severity_level TEXT CHECK (severity_level IN ('Low', 'Moderate', 'High', 'Critical')),
    immediate_actions TEXT[] NOT NULL,
    treatment_plan JSONB NOT NULL,
    preventative_measures TEXT[] NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.farms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.advisories ENABLE ROW LEVEL SECURITY;

-- 5. Drop existing policies if re-running
DROP POLICY IF EXISTS "Users can view their own farms" ON public.farms;
DROP POLICY IF EXISTS "Users can insert their own farms" ON public.farms;
DROP POLICY IF EXISTS "Users can update their own farms" ON public.farms;
DROP POLICY IF EXISTS "Users can delete their own farms" ON public.farms;

DROP POLICY IF EXISTS "Users can view their own advisories" ON public.advisories;
DROP POLICY IF EXISTS "Users can insert their own advisories" ON public.advisories;
DROP POLICY IF EXISTS "Users can update their own advisories" ON public.advisories;
DROP POLICY IF EXISTS "Users can delete their own advisories" ON public.advisories;

-- 6. Farms RLS Policies
CREATE POLICY "Users can view their own farms" ON public.farms
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own farms" ON public.farms
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own farms" ON public.farms
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own farms" ON public.farms
    FOR DELETE USING (auth.uid() = user_id);

-- 7. Advisories RLS Policies
CREATE POLICY "Users can view their own advisories" ON public.advisories
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own advisories" ON public.advisories
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own advisories" ON public.advisories
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own advisories" ON public.advisories
    FOR DELETE USING (auth.uid() = user_id);

-- 8. Indexes for performance
CREATE INDEX IF NOT EXISTS idx_farms_user_id ON public.farms(user_id);
CREATE INDEX IF NOT EXISTS idx_advisories_user_id ON public.advisories(user_id);
CREATE INDEX IF NOT EXISTS idx_advisories_farm_id ON public.advisories(farm_id);
CREATE INDEX IF NOT EXISTS idx_advisories_created_at ON public.advisories(created_at DESC);

-- 9. Storage Bucket setup (Optional/Recommended for image uploads)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('crop-images', 'crop-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for crop-images bucket
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'objects' AND policyname = 'Public Access to crop-images'
    ) THEN
        CREATE POLICY "Public Access to crop-images" ON storage.objects
            FOR SELECT USING (bucket_id = 'crop-images');
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'objects' AND policyname = 'Authenticated users can upload crop-images'
    ) THEN
        CREATE POLICY "Authenticated users can upload crop-images" ON storage.objects
            FOR INSERT WITH CHECK (bucket_id = 'crop-images' AND auth.role() = 'authenticated');
    END IF;
END $$;

