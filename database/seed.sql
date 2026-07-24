-- seed.sql
-- Demo data for Leather Production Intelligence System

-- Insert Organization
INSERT INTO organizations (id, name)
VALUES (
    '11111111-1111-1111-1111-111111111111', 
    'DEMO TANNERY'
) ON CONFLICT (id) DO NOTHING;

-- Insert Profile
INSERT INTO profiles (id, organization_id, full_name, role)
VALUES (
    '22222222-2222-2222-2222-222222222222', -- This should eventually map to an auth user id
    '11111111-1111-1111-1111-111111111111',
    'Demo Operator',
    'OPERATOR'
) ON CONFLICT (id) DO NOTHING;

-- Insert Device
INSERT INTO devices (id, organization_id, device_code, name, status, firmware_version)
VALUES (
    '33333333-3333-3333-3333-333333333333',
    '11111111-1111-1111-1111-111111111111',
    'LAS-DEV-001',
    'Simulator Device Alpha',
    'CONNECTED',
    'simulator-0.1'
) ON CONFLICT (id) DO NOTHING;

-- Insert Device Credentials (using a simple hash for demo purposes, e.g., bcrypt of 'demo-secret')
-- Note: In production, generate securely. Here we just assume a known hash for the simulator.
INSERT INTO device_credentials (device_id, secret_hash)
VALUES (
    '33333333-3333-3333-3333-333333333333',
    'demo-secret-hash' 
);

-- Insert Article
INSERT INTO articles (id, organization_id, article_code, article_name, leather_type, finish_type, grain_type, created_by)
VALUES (
    '44444444-4444-4444-4444-444444444444',
    '11111111-1111-1111-1111-111111111111',
    'ART-001',
    'Classic Brown',
    'Cowhide',
    'Semi-Aniline',
    'Natural Grain',
    '22222222-2222-2222-2222-222222222222'
) ON CONFLICT (id) DO NOTHING;

-- Insert Master Swatch
INSERT INTO master_swatches (id, organization_id, article_id, swatch_code, status, created_by)
VALUES (
    '55555555-5555-5555-5555-555555555555',
    '11111111-1111-1111-1111-111111111111',
    '44444444-4444-4444-4444-444444444444',
    'MS-ART-001-A',
    'ACTIVE',
    '22222222-2222-2222-2222-222222222222'
) ON CONFLICT (id) DO NOTHING;
