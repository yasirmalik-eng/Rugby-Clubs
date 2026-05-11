-- Allow tickets (like Season Passes) to be deleted without breaking the season_passes table
-- This allows admins to delete old ticket types even if users have bought them.

ALTER TABLE public.season_passes DROP CONSTRAINT IF EXISTS season_passes_ticket_id_fkey;
ALTER TABLE public.season_passes ALTER COLUMN ticket_id DROP NOT NULL;
ALTER TABLE public.season_passes ADD CONSTRAINT season_passes_ticket_id_fkey FOREIGN KEY (ticket_id) REFERENCES public.tickets(id) ON DELETE SET NULL;
