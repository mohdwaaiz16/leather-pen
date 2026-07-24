-- 01_initial_schema.sql
-- Core database architecture for Leather Production Intelligence System

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Organizations
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Profiles
CREATE TABLE profiles (
    id UUID PRIMARY KEY, -- Maps to auth.users.id
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'OPERATOR',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Devices
CREATE TABLE devices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    device_code VARCHAR(100) NOT NULL,
    name VARCHAR(255) NOT NULL,
    device_type VARCHAR(100) DEFAULT 'SCANNER',
    status VARCHAR(50) DEFAULT 'OFFLINE',
    firmware_version VARCHAR(100),
    last_seen_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(organization_id, device_code)
);

-- Device Credentials
CREATE TABLE device_credentials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    device_id UUID NOT NULL REFERENCES devices(id) ON DELETE CASCADE,
    secret_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    revoked_at TIMESTAMP WITH TIME ZONE
);

-- Articles (Product Configurations)
CREATE TABLE articles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    article_code VARCHAR(100) NOT NULL,
    article_name VARCHAR(255) NOT NULL,
    customer_name VARCHAR(255),
    leather_type VARCHAR(100) NOT NULL,
    thickness_mm NUMERIC(5, 2),
    finish_type VARCHAR(100),
    grain_type VARCHAR(100),
    notes TEXT,
    created_by UUID REFERENCES profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(organization_id, article_code)
);

-- Master Swatches (Approved reference standards)
CREATE TABLE master_swatches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    article_id UUID NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
    swatch_code VARCHAR(100) NOT NULL,
    status VARCHAR(50) DEFAULT 'ACTIVE',
    approved_at TIMESTAMP WITH TIME ZONE,
    created_by UUID REFERENCES profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(organization_id, swatch_code)
);

-- Batches (Production runs)
CREATE TABLE batches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    article_id UUID NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
    master_swatch_id UUID REFERENCES master_swatches(id),
    batch_code VARCHAR(100) NOT NULL,
    area_sqft NUMERIC(10, 2),
    batch_weight_kg NUMERIC(10, 2),
    number_of_hides INTEGER,
    thickness_mm NUMERIC(5, 2),
    process_stage VARCHAR(100),
    status VARCHAR(50) DEFAULT 'PLANNED',
    created_by UUID REFERENCES profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(organization_id, batch_code)
);

-- Calibrations
CREATE TABLE calibrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    device_id UUID NOT NULL REFERENCES devices(id) ON DELETE CASCADE,
    calibration_type VARCHAR(50) NOT NULL,
    reference_data JSONB NOT NULL,
    performed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Scans (Immutable raw multispectral data)
CREATE TABLE scans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    device_id UUID NOT NULL REFERENCES devices(id) ON DELETE CASCADE,
    article_id UUID NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
    master_swatch_id UUID REFERENCES master_swatches(id),
    batch_id UUID REFERENCES batches(id),
    calibration_id UUID REFERENCES calibrations(id),
    scan_type VARCHAR(50) NOT NULL CHECK (scan_type IN ('MASTER', 'PRODUCTION', 'CALIBRATION')),
    raw_spectral_data JSONB NOT NULL,
    image_path VARCHAR(500),
    sensor_temperature NUMERIC(5, 2),
    firmware_version VARCHAR(100),
    captured_at TIMESTAMP WITH TIME ZONE NOT NULL,
    received_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    processing_status VARCHAR(50) DEFAULT 'RECEIVED',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create Indexes for performance
CREATE INDEX idx_profiles_org ON profiles(organization_id);
CREATE INDEX idx_devices_org ON devices(organization_id);
CREATE INDEX idx_articles_org ON articles(organization_id);
CREATE INDEX idx_master_swatches_org_article ON master_swatches(organization_id, article_id);
CREATE INDEX idx_batches_org_article ON batches(organization_id, article_id);
CREATE INDEX idx_scans_org_article ON scans(organization_id, article_id);
CREATE INDEX idx_scans_device ON scans(device_id);
CREATE INDEX idx_scans_swatch ON scans(master_swatch_id);
CREATE INDEX idx_scans_batch ON scans(batch_id);

-- Updated_at triggers
CREATE OR REPLACE FUNCTION update_modified_column()   
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;   
END;
$$ language 'plpgsql';

CREATE TRIGGER update_organizations_modtime BEFORE UPDATE ON organizations FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_profiles_modtime BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_devices_modtime BEFORE UPDATE ON devices FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_articles_modtime BEFORE UPDATE ON articles FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_master_swatches_modtime BEFORE UPDATE ON master_swatches FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_batches_modtime BEFORE UPDATE ON batches FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
