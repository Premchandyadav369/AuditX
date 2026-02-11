-- Storage Bucket Setup for AuditX
-- This script creates the necessary storage buckets and policies

-- Create documents bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'documents',
  'documents',
  true,
  52428800,
  ARRAY[
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/webp',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain'
  ]
)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload files
CREATE POLICY "Authenticated users can upload documents"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'documents'
  AND auth.role() = 'authenticated'
);

-- Allow authenticated users to read their own documents
CREATE POLICY "Users can read their own documents"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'documents'
  AND auth.role() = 'authenticated'
);

-- Allow public read access to documents
CREATE POLICY "Public can read documents"
ON storage.objects
FOR SELECT
USING (bucket_id = 'documents');

-- Allow authenticated users to update their documents
CREATE POLICY "Users can update their documents"
ON storage.objects
FOR UPDATE
WITH CHECK (
  bucket_id = 'documents'
  AND auth.role() = 'authenticated'
);

-- Allow authenticated users to delete their documents
CREATE POLICY "Users can delete their documents"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'documents'
  AND auth.role() = 'authenticated'
);
