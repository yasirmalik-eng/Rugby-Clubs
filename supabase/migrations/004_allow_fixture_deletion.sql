-- Allow fixtures (and their tickets) to be deleted without breaking order items
-- This allows admins to delete test fixtures or old fixtures.

ALTER TABLE public.order_items DROP CONSTRAINT IF EXISTS order_items_ticket_id_fkey;
ALTER TABLE public.order_items ALTER COLUMN ticket_id DROP NOT NULL;
ALTER TABLE public.order_items ADD CONSTRAINT order_items_ticket_id_fkey FOREIGN KEY (ticket_id) REFERENCES public.tickets(id) ON DELETE SET NULL;
