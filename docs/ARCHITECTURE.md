# Architecture

We use a modular monolith architecture.
Frontend -> REST API -> Express Routers -> Services -> Supabase.

We avoid microservices for V1 to reduce operational complexity, but maintain strict boundaries in our backend `services/` directory.

The application serves static HTML/CSS/VanillaJS from the backend in development for simplicity, though the API routes are completely decoupled from the frontend logic.
