# Amazon Clone

## Project Overview
This is a production-grade, full-stack Amazon Clone built as a software engineering assignment. The application replicates core Amazon UX flows, including product browsing, detailed product views, adding to cart, and order placement.

## Tech Stack
- **Frontend**: Next.js 16 (App Router), React, Tailwind CSS 4
- **Backend**: Next.js API Routes (BFF pattern)
- **Database**: PostgreSQL (hosted on Supabase)
- **ORM**: Prisma Client & Prisma Migrate

## Setup Instructions
1. Clone the repository
2. Install dependencies: `npm install`
3. Configure environment variables in `.env.local` (Supabase credentials)
4. Set up the correct PostgreSQL connection in `prisma/schema.prisma` if not done already.
5. Apply database migrations: `npx prisma migrate dev --name init`
6. Seed the database: `npm run prisma seed` or it will run automatically with migration
7. Run the development server: `npm run dev`
8. Open [http://localhost:3000](http://localhost:3000) in your browser.

## API Endpoints
- `GET /api/products` - Supports pagination (`page`, `limit`) and search/filtering (`search`, `category`).
- `GET /api/products/[id]` - Returns a single product by ID.
- `POST /api/orders` - Creates an order from a cart payload.

## Screenshots

*(See walkthrough or artifacts)*

## Deployment Link
Not deployed yet.
