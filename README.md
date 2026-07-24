# Leather Production Intelligence System

## Project Overview
A modular monolith system for capturing, managing, and analyzing multispectral scan data from physical scanners in leather tanneries.

## Architecture & Technology Stack
- **Frontend**: HTML5, CSS3, Vanilla JS
- **Backend**: Node.js, Express.js
- **Database**: Supabase PostgreSQL

## Folder Structure
- `frontend/` - Static HTML/CSS/JS frontend
- `backend/` - Node/Express backend APIs
- `database/` - Migrations and seed data
- `docs/` - Architectural documentation

## Prerequisites
- Node.js (v18+)
- Supabase project

## Installation & Setup
1. `npm install`
2. Create `.env` based on `.env.example`
3. Run SQL scripts in `database/migrations` on your Supabase instance.
4. Run `database/seed.sql` to populate demo data.
5. Start backend: `npm run dev`
6. Access frontend on `http://localhost:3000`

## First Acceptance Test
1. Login with demo account.
2. Go to Articles -> New Article.
3. Save article and open detail.
4. Click "Scan Master".
5. Run Simulator.
6. Verify payload is sent and saved successfully.
# leather-pen
