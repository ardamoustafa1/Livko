# Indoor Smart Navigation System – Backend

QR Code Based Web-Driven Indoor Smart Navigation System (2D). Production-ready backend for hospitals, airports, and smart buildings.

## Stack

- **API:** NestJS (Node.js + TypeScript)
- **Route microservice:** Python + FastAPI
- **PostgreSQL** (TypeORM), **Neo4j**, **Redis**
- **Auth:** JWT + RBAC (ADMIN, STAFF)
- **Docs:** Swagger at `/api/docs`

## Quick start

```bash
# Copy env and set JWT_SECRET (min 32 chars)
cp .env.example .env

# Start all services
docker-compose up --build
```

- API: http://localhost:3000  
- Swagger: http://localhost:3000/api/docs  
- Route service: http://localhost:8000  
- Neo4j Browser: http://localhost:7474  

## First-time setup

1. With DB running (e.g. `docker-compose up -d postgres redis neo4j`), run API once so TypeORM creates tables (or run migrations).
2. Create admin user:
   ```bash
   SEED_ADMIN_EMAIL=admin@hospital.com SEED_ADMIN_PASSWORD=YourSecurePass npm run seed
   ```
3. Login at `POST /auth/login` with that email/password to get a JWT.
4. Use the JWT in `Authorization: Bearer <token>` for protected endpoints.

## Project layout

- `src/modules/` – NestJS modules (Auth, User, Institution, Building, Floor, Room, Elevator, Stair, Exit, QRCode, Route, Accessibility, Emergency, Admin)
- `src/shared/` – Guards, decorators, Redis, Neo4j
- `route-service/` – Python FastAPI route computation (Dijkstra / A*, Neo4j)

## Neo4j graph model

- **Nodes:** Room, Elevator, Stair, Exit (with property `id` for external UUID)
- **Relationships:** CONNECTS_TO, ACCESSIBLE_PATH, EMERGENCY_PATH  
- **Properties on relationships:** distance, accessibility_score, time_cost

Populate the graph via your own ETL or admin tools; the route service reads from Neo4j.

## Environment

See `.env.example`. Required: `JWT_SECRET` (≥32 characters). Others have defaults for local Docker.
