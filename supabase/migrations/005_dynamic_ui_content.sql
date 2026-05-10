-- ============================================================
-- Dynamic UI content support for sponsors and richer ticket cards
-- ============================================================

ALTER TABLE public.tickets
  ADD COLUMN IF NOT EXISTS feature_bullets TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];

-- ============================================================
-- SPONSORS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.sponsors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  tier TEXT NOT NULL,
  logo_url TEXT,
  website_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.sponsors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Sponsors: public read active" ON public.sponsors
  FOR SELECT USING (is_active = TRUE);

CREATE POLICY "Sponsors: admin read all" ON public.sponsors
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role IN ('owner', 'writer'))
  );

CREATE POLICY "Sponsors: owner write" ON public.sponsors
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'owner')
  );

-- ============================================================
-- SPONSORSHIP PACKAGES
-- ============================================================
CREATE TABLE IF NOT EXISTS public.sponsorship_packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  price_label TEXT NOT NULL,
  billing_period TEXT NOT NULL DEFAULT 'per season',
  benefits TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  contact_email TEXT NOT NULL DEFAULT 'admin@northwalesrugby.com',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.sponsorship_packages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "SponsorshipPackages: public read active" ON public.sponsorship_packages
  FOR SELECT USING (is_active = TRUE);

CREATE POLICY "SponsorshipPackages: admin read all" ON public.sponsorship_packages
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role IN ('owner', 'writer'))
  );

CREATE POLICY "SponsorshipPackages: owner write" ON public.sponsorship_packages
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'owner')
  );

CREATE TRIGGER sponsors_updated_at
  BEFORE UPDATE ON public.sponsors
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER sponsorship_packages_updated_at
  BEFORE UPDATE ON public.sponsorship_packages
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
