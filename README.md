# 🛒 Amazon Clone - Engineered for Precision & Scale

This isn't just a clone; it's a high-fidelity e-commerce laboratory. I built this platform to push the boundaries of **Next.js 15**, **Tailwind CSS 4**, and **Prisma/PostgreSQL**, creating a system that simulates real-world production challenges—from financial consistency to cross-border logistics.

---

## 🚀 My Vision & Core Architecture

When I started this project, I wanted to move beyond the "Basic CRUD" app. I engineered a **Server-First Architecture** using the Next.js App Router to ensure maximum performance and SEO readiness.

- **The Scaler Objective**: I designed every component to be horizontally scalable. Whether it's the parallel API fetching for products or the session-less guest tracking, the architecture is built to handle high-density traffic.
- **Why I Chose the Tech**:
    - **Next.js 15**: For its cutting-edge streaming and server actions.
    - **Tailwind 4**: For the performance gains and utility-first precision.
    - **Prisma + Supabase**: To provide a robust, relational backbone with real-time capabilities.

---

## 🛡️ Identity & Role-Based Access Control (RBAC)

I implemented a sophisticated **Triple-Persona System** that dynamically changes the entire application's behavior based on the authenticated role.

### 👤 The Personas I Engineered:
1.  **CUSTOMER (USER)**: The standard marketplace experience—discovery, cart management, and secure checkout.
2.  **ADMIN**: A powerful oversight dashboard for inventory management and platform analytics.
3.  **DELIVERY PARTNER**: A specialized logistics hub built for tracking shipments and updating delivery statuses.

### 🔐 How I Secured It:
- **Middleware-Level Protection**: I wrote a custom `middleware.ts` that intercepts every request and validates a JWT session. If an unauthorized user tries to access `/admin`, they are instantly bounced to a 403 page.
- **The Evaluation Suite**: For demo purposes, I built a horizontal **Evaluation Panel** at the footer. This allows anyone to instantly hot-swap between roles to test the route protection live.
- **Intelligent Persona Reset**: I implemented a mandatory reset logic in the `AuthContext` to ensure that whenever you land on the Home page, the site automatically reverts to the `USER` persona, preventing unintended administrative session leaks.

---

## 📦 Guest Order Persistence & "Ghost" Tracking

I realized that forcing a login kills conversion. I engineered a **Persistent Guest Lifecycle** that bridges the gap between anonymous browsing and registered loyalty.

- **`getOrCreateGuestId()`**: I wrote this utility to generate a unique, timestamped `gst_` ID preserved in `localStorage`. 
- **Ghost Tracking**: Even without an account, I allow guests to place orders. I store these orders in the database linked by their `guestId` so their journey isn't lost.
- **History Parity**: I refactored the `/orders` page to search the database for this specific `guestId` if no user session is present. This means a guest can leave the site, come back later, and still see their full order history flawlessly.

---

## 💰 Financial Integrity & Pricing Engine

E-commerce lives and dies by its numbers. I built a **Centralized Pricing Engine** (`src/lib/orderUtils.ts`) to serve as the single source of truth for every rupee on the platform.

### My Golden Rules:
- **Taxation (GST 18%)**: I implemented a hard-coded 18% GST calculation that is recalculated on the backend during order creation to prevent any client-side price manipulation.
- **Dynamic Shipping**: I built a threshold-based logic—₹40 flat delivery for small orders, and **FREE** shipping automatically triggered for orders over ₹500.
- **The Consistency Guarantee**: Whether you are looking at the Catalog, the Checkout summary, the database record, or the Confirmation Email, the numbers are guaranteed to match 100%.

---

## 🔍 Multi-Source Global Search

I wanted the search to feel alive and vast. I implemented a **Parallel Data Aggregator** that fetches from multiple external APIs simultaneously.

- **Hybrid Catalog**: My search engine fires concurrent requests to **DummyJSON** and **FakeStoreAPI** using `Promise.all`.
- **Smart Mapping**: I wrote `upsert` logic to map external IDs (`ext_dj_` and `ext_fs_`) into my local schema on-the-fly. This allows the platform to showcase thousands of products without needing a pre-seeded database.

---

## 🗺️ Location & Address Intelligence

I integrated a **Map-Centric Address System** to ensure delivery accuracy and a premium user experience.

- **Precise Map Pinpointing**: I built a `LocationModal` that allows users to drop a pin on a map to extract their exact delivery coordinates.
- **Manual-to-Auto Sync**: I built the bridge between the interactive map selection and the manual address forms. Users can select a location via map, and the coordinates are automatically transformed into a formatted address string for the checkout flow.

---

## 📧 Smart Notification System (SMTP)

I engineered a high-performance mailing system to handle order confirmations and OTPs with zero delivery lag.

- **Connection Pooling**: I configured the `nodemailer` transporter to use pooling and reusable connections, making email dispatch virtually instant.
- **High-Priority Headers**: To ensure my emails bypass filters and land in the "Primary" tab, I implemented low-level MIME headers: 
    - `X-Priority: 1 (Highest)`
    - `X-MSMail-Priority: High`
    - `Importance: High`
- **Secure OTP Lifecycle**: I built a 6-digit verification system that stores encrypted OTPs with a 10-minute expiration buffer, protecting the registration flow.

---

## 🏗️ Getting Started

I've made the setup process as streamlined as possible:

1.  **Configure `.env`**: Add your `DATABASE_URL`, `JWT_SECRET`, and SMTP credentials.
2.  **Sync Schema**:
    ```bash
    npx prisma generate  # I use this to keep TS types in sync
    npx prisma db push   # Push the latest RBAC & Order schemas
    ```
3.  **Run Development**:
    ```bash
    npm run dev
    ```

---

Built with ❤️ by **Yashita Bahrani** — Engineering the Future of E-commerce.
