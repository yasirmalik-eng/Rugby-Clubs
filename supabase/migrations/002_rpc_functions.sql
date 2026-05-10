-- Add this to Supabase SQL Editor AFTER running 001_initial_schema.sql
-- This RPC function is called from the stripe-webhook Edge Function

CREATE OR REPLACE FUNCTION public.increment_sold_count(ticket_id UUID, amount INTEGER)
RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  UPDATE public.tickets
  SET sold_count = sold_count + amount
  WHERE id = ticket_id;
END;
$$;

-- Grant execution to service role
GRANT EXECUTE ON FUNCTION public.increment_sold_count TO service_role;
