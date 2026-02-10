# Studiomar Scadenze Management System

Modern React + Node.js migration of the deadline management system.

## Tech Stack

- **Frontend**: React 18 + Vite + Material-UI
- **Backend**: Node.js + Express + Prisma
- **Database**: PostgreSQL
- **Package Manager**: pnpm

## Getting Started

### Prerequisites

- Node.js >= 20.0.0
- pnpm >= 8.0.0
- PostgreSQL 16

### Installation

```bash
# Install dependencies
pnpm install

# Setup database
pnpm db:push

# Seed test data (optional)
pnpm db:seed
```

### Development

```bash
# Start both frontend (5173) and backend (3000)
pnpm dev

# Or run separately:
cd backend && pnpm dev
cd frontend && pnpm dev
```

### Database Management

```bash
# Run migrations
pnpm db:migrate

# Push schema without migrations
pnpm db:push

# Open Prisma Studio
pnpm db:studio
```

## Project Structure

```
.
├── backend/          # Express API
├── frontend/         # React + Vite app
├── shared/           # Shared TypeScript types
└── package.json      # Workspace config
```

## API Documentation

Base URL: `http://localhost:3000/api/v1`

Endpoints coming in Phase 2+

## Development Notes

- Database is PostgreSQL 16 at `postgresql://postgres@localhost:5432/studiomar_scadenze`
- All timestamps are UTC
- Soft deletes via `is_active` flag
- Recurring dates calculated server-side
