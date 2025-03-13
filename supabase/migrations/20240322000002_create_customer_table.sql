-- Create Customer table if it doesn't exist already
CREATE TABLE IF NOT EXISTS public."Customer" (
    id SERIAL PRIMARY KEY,
    username TEXT,
    password TEXT NOT NULL,
    phoneNumber TEXT NOT NULL,
    points INTEGER DEFAULT 0,
    address TEXT,
    gender TEXT,
    dateOfBirth DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    update_at TIMESTAMP WITH TIME ZONE
);

-- Enable row level security
ALTER TABLE public."Customer" ENABLE ROW LEVEL SECURITY;

-- Create policy for public access
DROP POLICY IF EXISTS "Public access" ON public."Customer";
CREATE POLICY "Public access"
ON public."Customer" FOR SELECT
USING (true);

-- Create policy for authenticated users to insert their own data
DROP POLICY IF EXISTS "Users can insert their own data" ON public."Customer";
CREATE POLICY "Users can insert their own data"
ON public."Customer" FOR INSERT
WITH CHECK (true);

-- Create policy for authenticated users to update their own data
DROP POLICY IF EXISTS "Users can update their own data" ON public."Customer";
CREATE POLICY "Users can update their own data"
ON public."Customer" FOR UPDATE
USING (true);

-- Enable realtime
alter publication supabase_realtime add table "Customer";