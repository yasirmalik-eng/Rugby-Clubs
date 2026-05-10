-- Run this in Supabase SQL Editor to add the donations table

CREATE TABLE public.donations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  stripe_session_id TEXT NOT NULL UNIQUE,
  stripe_payment_intent_id TEXT,
  donor_email TEXT NOT NULL,
  donor_name TEXT,
  amount_gbp INTEGER NOT NULL,  -- stored in pence
  status order_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER donations_updated_at BEFORE UPDATE ON public.donations FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- RLS Policies
CREATE POLICY "Donations: own read" ON public.donations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Donations: admin read" ON public.donations
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'owner')
  );

CREATE POLICY "Donations: service write" ON public.donations
  FOR ALL USING (auth.role() = 'service_role');
