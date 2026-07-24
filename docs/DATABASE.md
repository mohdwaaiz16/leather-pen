# Database

Uses Supabase PostgreSQL.
Key rule: Raw data is immutable. Scans store exact sensor output.

All tables are multi-tenant using `organization_id`.
Indexes are provided on foreign keys and commonly searched fields.
