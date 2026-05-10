-- ============================================================
-- North Wales Crusaders — Supabase Initial Schema
-- Run in: Supabase Dashboard → SQL Editor
-- ============================================================

-- ENUMS
CREATE TYPE user_role AS ENUM ('owner', 'writer', 'fan');
CREATE TYPE order_status AS ENUM ('pending', 'completed', 'refunded', 'cancelled');
CREATE TYPE ticket_type AS ENUM ('adult', 'concession', 'junior', 'season_pass');

-- ============================================================
-- USERS (extends auth.users)
-- ============================================================
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role user_role NOT NULL DEFAULT 'fan',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Auto-create user row on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.users (id, email, role)
  VALUES (NEW.id, NEW.email, 'fan')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- RLS: Users can read/update their own profile; owner can read all
CREATE POLICY "Users: own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users: update own" ON public.users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Owner: read all users" ON public.users
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'owner')
  );

-- ============================================================
-- FIXTURES
-- ============================================================
CREATE TABLE public.fixtures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  opponent TEXT NOT NULL,
  match_date DATE NOT NULL,
  kick_off_time TIME NOT NULL DEFAULT '15:00',
  venue TEXT NOT NULL DEFAULT 'Eirias Stadium, Colwyn Bay',
  is_home BOOLEAN NOT NULL DEFAULT TRUE,
  competition TEXT NOT NULL DEFAULT 'Betfred Championship',
  result CHAR(1),                -- W / L / D
  home_score INTEGER,
  away_score INTEGER,
  tickets_available BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.fixtures ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Fixtures: public read" ON public.fixtures FOR SELECT USING (TRUE);

CREATE POLICY "Fixtures: admin write" ON public.fixtures
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'owner')
  );

-- ============================================================
-- TICKETS
-- ============================================================
CREATE TABLE public.tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fixture_id UUID REFERENCES public.fixtures(id) ON DELETE CASCADE, -- NULL = season pass
  type ticket_type NOT NULL DEFAULT 'adult',
  label TEXT NOT NULL,
  price_gbp INTEGER NOT NULL,   -- stored in pence, e.g. 1500 = £15.00
  availability INTEGER NOT NULL DEFAULT 100,
  sold_count INTEGER NOT NULL DEFAULT 0,
  on_sale_at TIMESTAMPTZ,
  max_per_order INTEGER NOT NULL DEFAULT 6,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tickets: public read" ON public.tickets FOR SELECT USING (TRUE);

CREATE POLICY "Tickets: admin write" ON public.tickets
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'owner')
  );

-- ============================================================
-- ORDERS
-- ============================================================
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  stripe_session_id TEXT NOT NULL UNIQUE,
  stripe_payment_intent_id TEXT,
  buyer_email TEXT NOT NULL,
  buyer_name TEXT,
  total_amount_gbp INTEGER NOT NULL,  -- in pence
  status order_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Orders: own read" ON public.orders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Orders: admin read" ON public.orders
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'owner')
  );

-- Service role (Edge Functions) can do everything
CREATE POLICY "Orders: service write" ON public.orders
  FOR ALL USING (auth.role() = 'service_role');

-- ============================================================
-- ORDER ITEMS
-- ============================================================
CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  ticket_id UUID NOT NULL REFERENCES public.tickets(id),
  quantity INTEGER NOT NULL,
  unit_price_gbp INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "OrderItems: via order" ON public.order_items
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND o.user_id = auth.uid())
  );

CREATE POLICY "OrderItems: admin" ON public.order_items
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'owner')
  );

CREATE POLICY "OrderItems: service write" ON public.order_items
  FOR ALL USING (auth.role() = 'service_role');

-- ============================================================
-- SEASON PASSES
-- ============================================================
CREATE TABLE public.season_passes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  order_id UUID NOT NULL REFERENCES public.orders(id),
  ticket_id UUID NOT NULL REFERENCES public.tickets(id),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.season_passes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Passes: own read" ON public.season_passes
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Passes: service write" ON public.season_passes
  FOR ALL USING (auth.role() = 'service_role');

-- ============================================================
-- BLOG POSTS
-- ============================================================
CREATE TABLE public.blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT NOT NULL DEFAULT '',
  featured_image_url TEXT,
  author_id UUID NOT NULL REFERENCES auth.users(id),
  is_published BOOLEAN NOT NULL DEFAULT FALSE,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_blog_posts_slug ON public.blog_posts(slug);
CREATE INDEX idx_blog_posts_published ON public.blog_posts(is_published, published_at DESC);

ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Posts: public read published" ON public.blog_posts
  FOR SELECT USING (is_published = TRUE);

CREATE POLICY "Posts: admin read all" ON public.blog_posts
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role IN ('owner', 'writer'))
  );

CREATE POLICY "Posts: admin write" ON public.blog_posts
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role IN ('owner', 'writer'))
  );

-- ============================================================
-- CONTACT SUBMISSIONS
-- ============================================================
CREATE TABLE public.contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- Anon can insert (public form)
CREATE POLICY "Contact: public insert" ON public.contact_submissions
  FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "Contact: admin read" ON public.contact_submissions
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'owner')
  );

-- ============================================================
-- HELPER: update updated_at automatically
-- ============================================================
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER fixtures_updated_at BEFORE UPDATE ON public.fixtures FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER blog_posts_updated_at BEFORE UPDATE ON public.blog_posts FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
