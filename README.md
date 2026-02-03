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
3. (Optional) Load Zemin Kat floor plan + Neo4j graph + QR codes:
   ```bash
   npm run seed:floor-plan    # Institution, building, floor, rooms, elevators, stairs, exits
   npm run seed:neo4j-graph   # Neo4j nodes and CONNECTS_TO / EMERGENCY_PATH edges
   npm run seed:qr-codes      # QR codes for each room/exit (code = room number, graphNodeId = UUID)
   # Or all at once:
   npm run seed:all
   ```
4. Login at `POST /auth/login` with that email/password to get a JWT.
5. Use the JWT in `Authorization: Bearer <token>` for protected endpoints.

## Project layout

- `src/modules/` – NestJS modules (Auth, User, Institution, Building, Floor, Room, Elevator, Stair, Exit, QRCode, Route, Accessibility, Emergency, Admin)
- `src/shared/` – Guards, decorators, Redis, Neo4j
- `route-service/` – Python FastAPI route computation (Dijkstra / A*, Neo4j)

## Neo4j graph model

- **Nodes:** Room, Elevator, Stair, Exit (with property `id` for external UUID)
- **Relationships:** CONNECTS_TO, ACCESSIBLE_PATH, EMERGENCY_PATH  
- **Properties on relationships:** distance, accessibility_score, time_cost

Populate the graph with `npm run seed:neo4j-graph` (after `seed:floor-plan`). The script creates Room/Elevator/Stair/Exit nodes with `id` = PostgreSQL UUID and CONNECTS_TO/EMERGENCY_PATH edges so the route service can compute paths.

## Production

- **Rate limiting:** Throttler is enabled globally (10/1s, 50/10s, 200/60s). Health routes are excluded.
- **Logging:** Each HTTP request is logged (method, url, status, duration, IP) via `LoggingInterceptor`.
- **Health:** `GET /health` (simple), `GET /health/live`, `GET /health/ready` (DB + Redis + Neo4j), `GET /health/detailed` (+ memory).
- **Neo4j topology:** Zone-based: rooms connect to zone hub (corridor/hol), zone hubs connect to main hub and to each other. Re-run `npm run seed:neo4j-graph` after changing zone logic in `src/database/floor-plans/zemin-kat-zones.ts`.

## QR labels (fiziksel etiket)

- **QR_BASE_URL:** Set in `.env` (e.g. `https://nav.example.com`). This is the base of the URL encoded in the printed QR.
- **Payload:** `GET /qr-codes/for-code/:code` returns `{ code, suggestedUrl, qrContent, nodeId?, label? }`. Use `qrContent` (or `suggestedUrl`) as the content when generating the QR image for the room/exit.
- **Flow:** User scans QR → opens `https://nav.example.com?code=ZK-001` → frontend calls `GET /qr-codes/resolve?code=ZK-001` to get nodeId → then calls route API with that nodeId as current position.

## Environment

See `.env.example`. Required: `JWT_SECRET` (≥32 characters). Optional: `QR_BASE_URL` for printed QR URLs. Others have defaults for local Docker.
