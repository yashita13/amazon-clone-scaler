# Amazon Clone - High-Fidelity E-commerce Prototype

[Live Demo Experience] | [RBAC Management] | [Next.js 15+ App Router]

An industry-grade demonstration of a modern e-commerce platform built with **Next.js 15+**, **Tailwind CSS 4**, and **Prisma/Supabase**. This project showcases advanced UI/UX patterns, robust authentication, and a production-ready Role-Based Access Control (RBAC) system.

---

## 🔐 Advanced Role-Based Access Control (RBAC)

The platform features a **fully functional RBAC system** protecting sensitive dashboards and API operations.

> [!TIP]
> **Evaluation Mode Active**: For demo purposes, we have integrated a **Live Persona Switcher** in the sub-navbar and a horizontal **Evaluation Panel** above the footer. You can instantly swap between `USER`, `ADMIN`, and `DELIVERY` personas to test route protection and UI state transitions live.

### Personnel Personas:
- 👤 **USER**: Standard customer access (Shopping, Cart, Checkout, Profile Tracking).
- ⚙️ **ADMIN**: Full administrative oversight (Inventory control, Analytics, User management).
- 🚚 **DELIVERY**: Specialized logistics view (Order tracking, delivery status updates, partner hub).

---

## ⚡ Key Highlights & Innovations

### 1. Parallel Meta-Search Engine
- Fetches data from **DummyJSON** and **FakeStoreAPI** in parallel.
- Provides a diverse, high-density catalog for evaluators without requiring a pre-seeded database.
- Implements intelligent mapping for cross-provider product IDs.

### 2. Standardized Commercial Logic
- **Centralized Pricing**: All calculations (GST 18%, Delivery ₹40) are handled by a core utility shared across UI, API, and Email.
- **Persistence**: Every order captures a financial snapshot (Items Total, Tax, Shipping) to ensure 100% consistency throughout the order lifecycle.

### 3. Persistent Guest Experience
- **Guest Orders**: Non-logged-in users generate a persistent `guestId` in localStorage.
- **History Parity**: Guests can view their order history and track fulfillment status just like registered users.

### 4. High-Conversion Checkout
- **Payment Ecosystem**: Integrated mock flows for **UPI (Paytm, GPay, PhonePe)**, **Credit Cards (Axis, SBI)**, and **Net Banking**.
- **Intelligent UI**: Features "Mostly Used" and "Recently Used" tags for high-fidelity simulation.

---

## 🛠️ Performance & Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | Next.js 15.2+ (App Router, Turbopack, Middleware) |
| **Styling** | Tailwind CSS 4.0 (Custom Amazon Design Tokens) |
| **Database** | Prisma ORM + PostgreSQL on Supabase |
| **Security** | Secure Cookies + JWT (JOSE) + Next.js Middleware |
| **Mailer** | NodeMailer (Low-latency background processing) |

---

## 📂 Sitemap & Dashboards

| Route | Accessibility | Features |
| :--- | :--- | :--- |
| `/` | Public | Parallel Search, Categories, Trending |
| `/admin` | **ADMIN ONLY** | Stock Overviews, Admin Notifications |
| `/delivery` | **PARTNER ONLY** | Logistics Hub, Status Updates |
| `/profile` | Registered | Multi-Address Management, Map Pinpointing |
| `/orders/[id]` | Public/Registered | Detailed Tracking & Post-Purchase Review |

---

## 🏗️ Getting Started

1. **Environmental configuration**:
   Rename `.env.example` to `.env` and configure:
   - `DATABASE_URL` (Supabase Connection String)
   - `JWT_SECRET` (For secure session tokens)
   - `EMAIL_USER`/`EMAIL_PASS` (For notifications)

2. **Schema Synchronization**:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

3. **Development Cycle**:
   ```bash
   npm run dev
   ```

---

Built with ❤️ by **Yashita Bahrani** for High-Scale Personalization.
