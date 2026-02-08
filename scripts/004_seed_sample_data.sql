-- Insert sample vendors
INSERT INTO public.vendors (id, name, tax_id, address, contact_email, category, risk_score, total_transactions, total_amount, first_transaction_date, last_transaction_date) VALUES
  ('a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d', 'TechCorp Solutions', '12-3456789', '123 Tech Street, Silicon Valley, CA', 'contact@techcorp.com', 'IT Services', 25, 45, 1250000.00, '2024-01-15', '2024-12-10'),
  ('b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e', 'Office Supplies Inc', '23-4567890', '456 Supply Ave, New York, NY', 'sales@officesupplies.com', 'Office Supplies', 15, 120, 85000.00, '2024-02-01', '2024-12-15'),
  ('c3d4e5f6-a7b8-4c9d-0e1f-2a3b4c5d6e7f', 'Construction & Co', '34-5678901', '789 Builder Rd, Houston, TX', 'info@construction.com', 'Construction', 65, 28, 3500000.00, '2024-03-10', '2024-11-20'),
  ('d4e5f6a7-b8c9-4d0e-1f2a-3b4c5d6e7f8a', 'Global Consulting Partners', '45-6789012', '321 Consult Blvd, Boston, MA', 'contact@globalconsult.com', 'Consulting', 80, 15, 2200000.00, '2024-01-20', '2024-10-05'),
  ('e5f6a7b8-c9d0-4e1f-2a3b-4c5d6e7f8a9b', 'Green Energy Solutions', '56-7890123', '654 Solar Way, Portland, OR', 'info@greenenergy.com', 'Energy', 35, 32, 980000.00, '2024-04-05', '2024-12-01')
ON CONFLICT (id) DO NOTHING;

-- Insert sample transactions with varying risk levels
INSERT INTO public.transactions (document_id, user_id, transaction_date, amount, vendor_id, department, category, description, payment_method, invoice_number, status, risk_score, is_flagged) VALUES
  (NULL, (SELECT id FROM auth.users LIMIT 1), '2024-12-01', 45000.00, 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d', 'IT Department', 'Software Licenses', 'Annual software subscription renewal', 'Wire Transfer', 'INV-2024-001', 'approved', 15, false),
  (NULL, (SELECT id FROM auth.users LIMIT 1), '2024-12-02', 250000.00, 'd4e5f6a7-b8c9-4d0e-1f2a-3b4c5d6e7f8a', 'Executive', 'Consulting', 'Strategic consulting services', 'Wire Transfer', 'INV-2024-002', 'flagged', 85, true),
  (NULL, (SELECT id FROM auth.users LIMIT 1), '2024-12-03', 3500.00, 'b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e', 'Administration', 'Office Supplies', 'Monthly office supplies order', 'Credit Card', 'INV-2024-003', 'approved', 10, false),
  (NULL, (SELECT id FROM auth.users LIMIT 1), '2024-12-04', 180000.00, 'c3d4e5f6-a7b8-4c9d-0e1f-2a3b4c5d6e7f', 'Facilities', 'Construction', 'Building renovation phase 1', 'Check', 'INV-2024-004', 'approved', 45, false),
  (NULL, (SELECT id FROM auth.users LIMIT 1), '2024-12-05', 95000.00, 'd4e5f6a7-b8c9-4d0e-1f2a-3b4c5d6e7f8a', 'Executive', 'Consulting', 'Emergency consulting engagement', 'Wire Transfer', 'INV-2024-005', 'flagged', 92, true),
  (NULL, (SELECT id FROM auth.users LIMIT 1), '2024-12-06', 12000.00, 'e5f6a7b8-c9d0-4e1f-2a3b-4c5d6e7f8a9b', 'Facilities', 'Utilities', 'Solar panel maintenance', 'ACH', 'INV-2024-006', 'approved', 20, false),
  (NULL, (SELECT id FROM auth.users LIMIT 1), '2024-12-07', 8500.00, 'b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e', 'HR Department', 'Office Supplies', 'New employee setup supplies', 'Credit Card', 'INV-2024-007', 'approved', 12, false),
  (NULL, (SELECT id FROM auth.users LIMIT 1), '2024-12-08', 320000.00, 'c3d4e5f6-a7b8-4c9d-0e1f-2a3b4c5d6e7f', 'Facilities', 'Construction', 'Building renovation phase 2', 'Wire Transfer', 'INV-2024-008', 'pending', 50, false),
  (NULL, (SELECT id FROM auth.users LIMIT 1), '2024-12-09', 67000.00, 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d', 'IT Department', 'Hardware', 'Server infrastructure upgrade', 'Purchase Order', 'INV-2024-009', 'approved', 25, false),
  (NULL, (SELECT id FROM auth.users LIMIT 1), '2024-12-10', 145000.00, 'd4e5f6a7-b8c9-4d0e-1f2a-3b4c5d6e7f8a', 'Executive', 'Consulting', 'Year-end strategic planning', 'Wire Transfer', 'INV-2024-010', 'flagged', 88, true)
ON CONFLICT DO NOTHING;

-- Insert sample fraud cases
INSERT INTO public.fraud_cases (case_number, title, description, severity, status, detected_by, fraud_type, estimated_loss, priority) VALUES
  ('FRD-24-00001', 'Duplicate Vendor Payments', 'Multiple payments detected to same vendor for identical amounts within 24 hours', 'high', 'investigating', 'ai', 'Duplicate Payment', 95000.00, 4),
  ('FRD-24-00002', 'Unusual Consulting Fees', 'Consulting fees 300% above department average with minimal documentation', 'critical', 'open', 'ai', 'Overbilling', 250000.00, 5),
  ('FRD-24-00003', 'Ghost Vendor Activity', 'Payments to vendor with no valid tax ID or physical address', 'high', 'investigating', 'ai', 'Ghost Vendor', 67000.00, 4),
  ('FRD-24-00004', 'Split Invoice Pattern', 'Single project split into multiple invoices just below approval threshold', 'medium', 'open', 'ai', 'Split Transactions', 48000.00, 3)
ON CONFLICT (case_number) DO NOTHING;

-- Insert sample policy violations
INSERT INTO public.policy_violations (transaction_id, policy_name, policy_description, violation_type, severity, status) VALUES
  ((SELECT id FROM public.transactions WHERE invoice_number = 'INV-2024-002'), 'Single Transaction Limit', 'Transactions over ₹2,00,00,000 require board approval', 'Approval Threshold Exceeded', 'high', 'active'),
  ((SELECT id FROM public.transactions WHERE invoice_number = 'INV-2024-005'), 'Competitive Bidding Required', 'Contracts over ₹50,00,000 require 3 competitive bids', 'Missing Documentation', 'high', 'active'),
  ((SELECT id FROM public.transactions WHERE invoice_number = 'INV-2024-008'), 'Budget Allocation', 'Transaction exceeds quarterly departmental budget', 'Budget Violation', 'medium', 'active')
ON CONFLICT DO NOTHING;
