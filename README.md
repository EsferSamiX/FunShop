<p align="center">
  <img src="assests/logo-removebg-preview.png" alt="FunShop" width="300" />
</p>

<p align="center"><sub>By <strong>Md Esfer Abdus Sami</strong></sub></p>

<h3 align="center">Full Stack E-Commerce — Browse, Cart, and Checkout</h3>

<p align="center">
  Product browsing with infinite scroll, URL-driven filters, SSG product pages,<br/>
  a persisted cart, and JWT authentication — all backed by a real PostgreSQL database.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js" />
  <img src="https://img.shields.io/badge/Python-3.11+-blue?style=flat-square&logo=python" />
  <img src="https://img.shields.io/badge/FastAPI-latest-green?style=flat-square&logo=fastapi" />
  <img src="https://img.shields.io/badge/PostgreSQL-16-blue?style=flat-square&logo=postgresql" />
  <img src="https://img.shields.io/badge/Zustand-state-orange?style=flat-square" />
  <img src="https://img.shields.io/badge/Docker-compose-2496ED?style=flat-square&logo=docker" />
  <img src="https://img.shields.io/badge/License-MIT-yellow?style=flat-square" />
</p>

---

## What is FunShop?

FunShop is a mini full-stack e-commerce application that demonstrates real-world practices: server-side rendering, static site generation, URL-driven filter state, infinite scrolling, JWT authentication through httpOnly cookies, and a globally persistent cart. Every API call hits a PostgreSQL database — pagination, search, and category filtering all run at the query level, not in memory.

### Key Features

- **SSR Product List** — server-rendered product grid with a sticky filter sidebar; search and category reflected in the URL so every view is shareable and browser-navigable
- **Infinite Scrolling** — `IntersectionObserver` triggers next-page fetches as the user scrolls; initial data is rendered on the server
- **SSG Product Detail** — all product pages statically generated at build time via `generateStaticParams`, revalidated every hour (ISR)
- **Persistent Cart** — Zustand store backed by `localStorage` survives full page reloads and navigation; cart badge count updates globally from any page
- **JWT Auth via httpOnly Cookie** — Next.js API routes proxy auth so the browser never holds the raw token; middleware protects `/cart` and `/checkout`
- **Loading Skeletons** — animated skeleton cards replace blank screens during data fetches
- **SEO Metadata** — `generateMetadata` on product detail pages emits dynamic `<title>` and `<meta description>`
- **29 pytest Tests** — covers auth flows, product pagination, search, filtering, and 404 handling

---

## Architecture

```
╔══════════════════════════════════════════════════════════════════════════╗
║                    BROWSER  —  Next.js 16  (port 3000)                   ║
║                                                                          ║
║  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────────┐    ║
║  │  Product List    │  │  Product Detail  │  │  Cart / Auth Pages   │    ║
║  │                  │  │                  │  │                      │    ║
║  │  SSR             │  │  SSG (ISR 1h)    │  │  Client-side         │    ║
║  │  Infinite scroll │  │  Image gallery   │  │  Zustand + localStorage│  ║
║  │  URL filter state│  │  Add to Cart     │  │  httpOnly JWT cookie │    ║
║  │  Sticky sidebar  │  │  Dynamic meta    │  │  Middleware guard    │    ║
║  └──────────────────┘  └──────────────────┘  └──────────────────────┘    ║
║                                                                          ║
║  React · TypeScript · Tailwind CSS · Zustand · Axios                     ║
╚═══════════════════════╦══════════════════════════════════════════════════╝
                        ║  HTTPS  REST / JSON
╔═══════════════════════╩══════════════════════════════════════════════════╗
║                  BACKEND API  —  FastAPI  (port 8000)                    ║
║                                                                          ║
║  ┌───────────────────┐  ┌──────────────────────┐  ┌──────────────────┐   ║
║  │   /api/auth       │  │   /api/products      │  │  /api/categories │   ║
║  │                   │  │                      │  │                  │   ║
║  │  POST /register   │  │  GET / (paginated)   │  │  GET /           │   ║
║  │  POST /login      │  │  GET /{id}           │  │  slug · name     │   ║
║  │  GET  /me         │  │  ?search · ?category │  │                  │   ║
║  │  JWT HS256        │  │  ?page  · ?limit     │  │                  │   ║
║  └───────────────────┘  └──────────────────────┘  └──────────────────┘   ║
║                                                                          ║
║  SQLAlchemy 2 (async) · Alembic · Pydantic · python-jose · bcrypt        ║
╚═══════════════════════╦══════════════════════════════════════════════════╝
                        ║  asyncpg (SQL)
╔═══════════════════════╩══════════════════════════════════════════════════╗
║                   PostgreSQL 16  (port 5432)                             ║
║                                                                          ║
║  Tables                                                                  ║
║  ├── users        id · name · email · hashed_password                    ║
║  ├── categories   id · slug · name                                       ║
║  └── products     id · title · description · price · stock · rating      ║
║                   thumbnail · images · category_id (FK)                  ║
╚══════════════════════════════════════════════════════════════════════════╝
```

### Service Breakdown

| Service | Stack | Port | Responsibility |
|---|---|---|---|
| **Frontend** | Next.js 16, TypeScript, Tailwind CSS, Zustand | 3000 | SSR/SSG pages, infinite scroll, cart state, auth UI |
| **Backend** | FastAPI, SQLAlchemy 2, Alembic, python-jose | 8000 | REST API, JWT auth, DB-level pagination/filtering |
| **Database** | PostgreSQL 16 | 5432 | Users, categories, products |

### Page Rendering Strategy

```
/products          SSR   ← server reads searchParams, renders filtered grid
      │
      ▼ click product
/products/[id]     SSG   ← statically generated at build; ISR revalidates hourly
      │
      ▼ add to cart
/cart              CSR   ← Zustand (localStorage) — no server round-trip needed
      │
      ▼ checkout
/checkout          CSR   ← form-only, protected by middleware JWT check
```

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/products` | Paginated list — `page`, `limit`, `search`, `category` |
| `GET` | `/api/products/{id}` | Single product; 404 when not found |
| `GET` | `/api/categories` | All categories (slug + name) |
| `POST` | `/api/auth/register` | Create account — returns JWT |
| `POST` | `/api/auth/login` | Login — returns JWT |
| `GET` | `/api/auth/me` | Authenticated user info |

Pagination, search, and category filtering run at the database query level — `ILIKE` for search, `LIMIT`/`OFFSET` for pages, indexed `category_id` for filtering. Full interactive docs at `http://localhost:8000/docs` (Swagger UI) and `/redoc`.

---

## Pages

| Route | Rendering | Key Features |
|---|---|---|
| `/products` | SSR | Infinite scroll, sticky sidebar, URL filter state (`?search=&category=`) |
| `/products/[id]` | SSG (ISR 1h) | Image gallery, Add to Cart, `generateMetadata` |
| `/cart` | Client | Quantity controls, remove items, subtotal / total — JWT protected |
| `/checkout` | Client | Checkout form — JWT protected |
| `/login` | Client | JWT login |
| `/register` | Client | Registration |
| `/profile` | Client | Authenticated user profile |

---

## Requirements

| Dependency | Version |
|---|---|
| Python | 3.11+ |
| Node.js | 18+ |
| PostgreSQL | 14+ |
| uv | latest |

---

## Setup

### 1. Clone the repository

```bash
git clone <repo-url>
cd Funshop
```

### 2. Create the database

```sql
CREATE DATABASE funshope;
```

### 3. Configure the backend

```bash
cd backend
cp .env.example .env
```

Edit `.env`:

```env
# Generate with: python -c "import secrets; print(secrets.token_hex(32))"
SECRET_KEY=your-long-random-secret-key

DATABASE_URL=postgresql://postgres:password@localhost:5432/funshope
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
FRONTEND_URL=http://localhost:3000
```

### 4. Install backend dependencies

```bash
uv sync
```

### 5. Run migrations

```bash
uv run alembic upgrade head
```

### 6. Seed the database

```bash
uv run python scripts/seed.py
```

Fetches 100+ products from DummyJSON as a one-time import and persists them to PostgreSQL. All runtime requests hit your own API — DummyJSON is never contacted again.

### 7. Start the backend

```bash
uv run uvicorn app.main:app --reload
# → http://localhost:8000
# → http://localhost:8000/docs
```

### 8. Configure and start the frontend

```bash
cd ../frontend
```

Create `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

```bash
npm install
npm run dev
# → http://localhost:3000
```

Open **http://localhost:3000**, register an account, and start browsing.

---

## Docker

Spins up PostgreSQL + FastAPI + Next.js with a single command. Migrations and seeding run automatically on first start.

```bash
cd Funshop
docker compose up --build
```

| Service | URL |
|---|---|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8000 |
| Swagger docs | http://localhost:8000/docs |

Stop and remove volumes:

```bash
docker compose down -v
```

> **Note:** `NEXT_PUBLIC_API_URL` is baked into the frontend bundle at build time. If you change the API port, rebuild the frontend image with `docker compose build frontend`.

---

## Running Tests

```bash
cd backend
uv run pytest
```

29 tests covering auth (register, login, JWT), products (pagination, search, filtering, 404), and categories.

---

## Project Structure

```
Funshop/
├── backend/
│   ├── app/
│   │   ├── api/          # Route handlers (products, categories, auth)
│   │   ├── core/         # Config, database, security
│   │   ├── models/       # SQLAlchemy models
│   │   ├── schemas/      # Pydantic request/response schemas
│   │   └── services/     # Business logic
│   ├── migrations/       # Alembic migration files
│   ├── scripts/
│   │   └── seed.py       # Seeds 100+ products from DummyJSON
│   └── tests/            # pytest test suite (29 tests)
├── frontend/
│   └── src/
│       ├── app/          # Next.js pages (App Router)
│       ├── components/   # Reusable UI components
│       ├── hooks/        # Custom hooks (infinite scroll, filters)
│       ├── lib/          # Axios client
│       ├── store/        # Zustand cart store
│       └── types/        # TypeScript types
├── assests/              # Logo and screenshots
├── docker-compose.yml
└── README.md
```

---

## Environment Variables Reference

| Variable | Required | Default | Description |
|---|---|---|---|
| `SECRET_KEY` | Yes | — | JWT signing secret |
| `DATABASE_URL` | Yes | — | PostgreSQL connection string |
| `ALGORITHM` | No | `HS256` | JWT signing algorithm |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | No | `30` | JWT token lifetime |
| `FRONTEND_URL` | No | `http://localhost:3000` | Allowed CORS origin |
| `NEXT_PUBLIC_API_URL` | Yes (frontend) | — | Backend base URL for the frontend bundle |

---

## Architecture Notes

- The frontend proxies auth calls through Next.js API routes (`/api/auth/*`) so the JWT access token is stored in an httpOnly cookie — the browser never holds the raw token directly.
- A second readable cookie (`auth_user`) holds only the display name for the header — no sensitive data.
- The backend CORS origin is configured via `FRONTEND_URL` in `.env`, not hardcoded.
- Product images are served from DummyJSON CDN URLs stored in the database at seed time. The Next.js image domain allowlist in `next.config.ts` covers these origins.

---

## Assumptions & Limitations

- Checkout is UI-only — there is no payment processing or order persistence.
- The seed script is idempotent (safe to run multiple times) but requires an internet connection on first run to fetch from DummyJSON.
- JWT tokens expire in 30 minutes. There is no refresh token flow; users are redirected to login on expiry.
- Stock levels are seeded from DummyJSON and are not decremented on cart actions.

---

## License

MIT
