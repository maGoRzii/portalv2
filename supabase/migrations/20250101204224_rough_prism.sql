-- Create storage bucket for attachments
INSERT INTO storage.buckets (id, name, public)
VALUES ('attachments', 'attachments', false);

-- Enable RLS for the bucket
CREATE POLICY "Public access for attachments"
ON storage.objects FOR ALL
TO public
USING (bucket_id = 'attachments')
WITH CHECK (bucket_id = 'attachments');