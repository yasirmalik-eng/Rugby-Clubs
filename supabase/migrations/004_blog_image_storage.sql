INSERT INTO storage.buckets (id, name, public)
VALUES ('blog-images', 'blog-images', true)
ON CONFLICT (id) DO UPDATE
SET public = EXCLUDED.public;

CREATE POLICY "Blog images are publicly readable"
ON storage.objects
FOR SELECT
USING (bucket_id = 'blog-images');

CREATE POLICY "Blog admins can upload images"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'blog-images'
  AND EXISTS (
    SELECT 1
    FROM public.users u
    WHERE u.id = auth.uid()
      AND u.role IN ('owner', 'writer')
  )
);

CREATE POLICY "Blog admins can update images"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'blog-images'
  AND EXISTS (
    SELECT 1
    FROM public.users u
    WHERE u.id = auth.uid()
      AND u.role IN ('owner', 'writer')
  )
)
WITH CHECK (
  bucket_id = 'blog-images'
  AND EXISTS (
    SELECT 1
    FROM public.users u
    WHERE u.id = auth.uid()
      AND u.role IN ('owner', 'writer')
  )
);

CREATE POLICY "Blog admins can delete images"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'blog-images'
  AND EXISTS (
    SELECT 1
    FROM public.users u
    WHERE u.id = auth.uid()
      AND u.role IN ('owner', 'writer')
  )
);
