# Shitol ERP (Frontend + Laravel Backend)

This repository now contains:

- `frontend/` - React + Vite ERP UI
- `backend/` - Laravel 12 API backend (Sanctum token auth)

## Backend Setup (`backend/`)

1. Install PHP dependencies:
   - `composer install`
2. Create env and app key:
   - `copy .env.example .env`
   - `php artisan key:generate`
3. Run migrations and seed demo data:
   - `php artisan migrate:fresh --seed`
4. Start API server:
   - `php artisan serve`

Backend runs on `http://127.0.0.1:8000` by default.

### Demo Credentials

- Admin: `admin@erp.com` / `admin123`
- Manager: `manager@erp.com` / `manager123`
- User: `user@erp.com` / `user123`

## Frontend Setup (`frontend/`)

1. Install Node dependencies:
   - `npm install`
2. Create env file:
   - `copy .env.example .env`
3. Start frontend:
   - `npm run dev`

Frontend runs on `http://127.0.0.1:5173` and proxies `/api` requests to `http://127.0.0.1:8000`.

## Vercel Deployment

This repository is configured for separate Vercel projects:

- `frontend/` deploys as a static Vite app using `frontend/vercel.json`
- `backend/` deploys as a PHP app using `backend/vercel.json`

Deploy each project separately from the monorepo root with Vercel CLI, for example:

```bash
cd frontend
vercel --prod

cd ../backend
vercel --prod
```

> Make sure each project is configured in Vercel with the correct root path before deployment.

## Implemented API Modules

- Auth: login, me, logout
- Dashboard summary + charts data
- Inventory CRUD
- Orders CRUD + order items + status updates
- Users CRUD + status toggle (admin protected)
- CRM customers CRUD
- HR employees CRUD
- Finance transactions CRUD
