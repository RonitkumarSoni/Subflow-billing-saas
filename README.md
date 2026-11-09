<div align="center">

# ⚡ SubFlow — Enterprise Billing & Subscription Management Platform

**Production-grade, full-stack recurring billing, revenue intelligence, and subscription lifecycle engine.**

[![Next.js](https://img.shields.io/badge/Next.js-16.4-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-6.4-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon_Cloud-336791?style=for-the-badge&logo=postgresql&logoColor=white)](https://neon.tech/)

[Explore Live Demo](#-getting-started) • [Feature Suite](#-features) • [Architecture](#-architecture--design) • [API Reference](#-api-routes)

</div>

---

## 📌 Executive Summary

**SubFlow** is a modern B2B SaaS billing engine built with **Next.js App Router**, inspired by the UX standards of **Stripe Billing**, **Received AI**, and **Linear**. It abstracts away the complexity of recurring revenue management, automated invoice reconciliation, multi-tier pricing plans, subscription upgrades/downgrades, and dunning workflows with an intuitive dark-themed command center.

---

## ✨ Features

### 📊 1. Revenue Command Center & Financial Intelligence
- **Real-Time MRR & ARR Calculations:** Instant recalculation based on active recurring subscriptions and billing cadence (Monthly vs. Annualized).
- **Interactive Financial Visualizations:** Area charts powered by Recharts comparing gross transaction volume with MRR trends.
- **AI Revenue Copilot:** Natural-language financial analyst widget delivering real-time audits on overdue risks, renewal pipelines, and cash health.
- **Renewal Pipeline:** 30-day lookahead for expiring or upcoming subscription billing events.

### 👥 2. Customer Directory & 360° Account View
- **Customer Directory:** Real-time search, status filtering, and inline management.
- **360° Account Drawer:** Slide-over detail pane providing unified access to:
  - Account profile & billing contact details
  - Active & historical subscriptions
  - Complete invoice audit trail with status chips
  - Ledger of payment attempts with failure logs

### 📦 3. Product Catalog & Multi-Tier Pricing
- **Flexible Pricing Models:** Flat-rate recurring tiers (Starter, Growth, Scale) and one-time service fees (Onboarding, Data Migration).
- **Billing Frequencies:** Seamless monthly and yearly interval handling.
- **Live State Management:** Instant activation/deactivation toggles for self-serve plans.

### 🔄 4. Full Subscription Lifecycle Engine
- **Automated Lifecycle Stages:** Handles transitions between `ACTIVE`, `PAST_DUE`, `PAUSED`, and `CANCELLED`.
- **Zero-Friction Upgrades/Downgrades:** In-place plan migration with instant tier switching.
- **Auto-Invoicing:** Generates immediate initial invoice upon new subscription activation.
- **Lifecycle Controls:** Direct pause and resume functionality with automated billing state transitions.

### 🧾 5. Invoicing & PDF Generation
- **Line-Item Invoice Builder:** Dynamic additions/removals with automatic subtotal calculation.
- **Tax & Discount Engine:** Real-time calculations with support for standard tax rates (e.g., 18% GST).
- **Standardized Numbering:** Formatted sequential identifiers (`INV-YYYY-XXXX`).
- **One-Click Tax Invoices:** Dedicated print stylesheet formatted specifically for downloadable A4 PDF tax receipts.

### 💳 6. Payment Simulation & Auto-Reconciliation
- **Multi-Method Gateway Simulator:** Credit/Debit Cards, UPI, Net Banking, and Bank Transfer.
- **Scenario Testing:** Simulate `SUCCESS`, `PENDING`, and `FAILED` states with simulated gateway decline reasons.
- **Automatic Dunning & Reconciliation:** Successful payments instantly reconcile linked invoices to `PAID` and automatically restore `PAST_DUE` subscriptions to `ACTIVE`.

### 🌐 7. Public Pricing Experience (`/pricing`)
- High-converting, responsive public-facing pricing page with interactive Monthly/Yearly billing toggle.

---

## 🛠️ Architecture & Tech Stack

```
SubFlow/
├── src/
│   ├── app/
│   │   ├── api/                 # RESTful Route Handlers (Next.js App Router)
│   │   │   ├── customers/       # Customer CRUD & 360 lookup
│   │   │   ├── dashboard/stats/ # MRR, ARR, revenue metrics & AI summary
│   │   │   ├── invoices/        # Multi-item invoice generation & queries
│   │   │   ├── payments/        # Gateway simulator & auto-reconciliation
│   │   │   ├── plans/           # Plan creation & toggle handlers
│   │   │   ├── products/        # Product catalog routes
│   │   │   ├── seed/            # One-click demo seed & state reset
│   │   │   └── subscriptions/   # Lifecycle actions (pause/resume/change_plan)
│   │   ├── customers/           # Customer management view
│   │   ├── invoices/            # Invoice management & viewer
│   │   ├── payments/            # Transaction records & simulation
│   │   ├── pricing/             # Public pricing marketing page
│   │   ├── products/            # Plans & products dashboard
│   │   ├── subscriptions/       # Subscription lifecycle view
│   │   ├── layout.tsx           # Fixed dashboard shell layout
│   │   └── page.tsx             # Main dashboard
│   ├── components/              # Modular UI components (Modals, Charts, Drawers)
│   ├── lib/                     # Database layer & Prisma client singleton
│   └── types/                   # Unified TypeScript interfaces
├── prisma/
│   ├── schema.prisma            # PostgreSQL schema with full relations & enums
│   └── seed.ts                  # Database seeding script
```

| Layer | Technology |
|---|---|
| **Framework** | [Next.js 16 (App Router)](https://nextjs.org/) |
| **Frontend** | [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/), [Lucide React](https://lucide.dev/) |
| **Data Visualization** | [Recharts](https://recharts.org/) |
| **Database & ORM** | [Prisma 6.4](https://www.prisma.io/), [Neon PostgreSQL](https://neon.tech/) |
| **Data Layer** | Resilient persistent JSON store with in-memory caching for zero-setup local dev |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm** or **pnpm**

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/RonitkumarSoni/Subflow-billing-saas.git
   cd Subflow-billing-saas
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
   *(Optional)* Add your Neon PostgreSQL connection string:
   ```env
   DATABASE_URL="postgresql://user:password@host/neondb?sslmode=require"
   ```

4. **Start the Development Server:**
   ```bash
   npm run dev
   ```

5. **Open the Application:**
   Visit [http://localhost:3000](http://localhost:3000) in your browser.

> **💡 One-Click Demo Reset:** Click the **"Reset / Seed Demo"** button on the top-right header anytime to restore sample customers, subscriptions, invoices, and analytics.

---

## 🔌 API Routes Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/dashboard/stats` | Returns calculated MRR, ARR, active subscriptions, revenue trends, and AI analysis |
| `GET`, `POST` | `/api/customers` | Fetch filtered customers or register a new customer |
| `GET`, `PUT`, `DELETE` | `/api/customers/[id]` | Fetch single customer 360 data, update info, or delete customer |
| `GET`, `POST` | `/api/products` | Retrieve products catalog or create new products |
| `POST`, `PATCH` | `/api/plans` | Create a pricing plan or toggle plan active state |
| `GET`, `POST`, `PATCH` | `/api/subscriptions` | Query subscriptions, create new subscriptions, or trigger lifecycle actions (`pause`, `resume`, `cancel`, `change_plan`) |
| `GET`, `POST` | `/api/invoices` | List invoices or create multi-line item invoices |
| `GET` | `/api/invoices/[id]` | Detailed invoice receipt with line items and customer info |
| `GET`, `POST` | `/api/payments` | Retrieve payment transactions or simulate payment execution |
| `POST` | `/api/seed` | Resets and hydrates database with realistic demo records |

---

## 🔒 Design System & UI Principles

- **Typography & Layout:** Clean geometric hierarchy with fixed zero-scroll navigation layout.
- **Palette Consistency:** Curated enterprise slate & indigo palette (`#4f46e5` / `#6366f1`) ensuring cohesive visual identity across all views.
- **Micro-Interactions:** Subtle border glow effects, status badge chips, responsive hover states, and smooth slide-over modal transitions.

---

## 📄 License

This project is open-source under the [MIT License](LICENSE).
