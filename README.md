# SubFlow — Modern Subscription & Billing SaaS

A centralized, production-grade billing and subscription management platform built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, and **PostgreSQL / Prisma ORM**.

Designed based on real-world design systems from **Stripe Billing**, **SaaSUI**, **Received AI**, and **Linear**.

---

## 🚀 Key Highlights & Workflows

### 1. Dashboard & Financial Intelligence
- **Real-time MRR & ARR**: Dynamically computed from active subscriptions and billing intervals.
- **Interactive Revenue Chart**: Area chart powered by Recharts comparing gross transaction volume with MRR trends.
- **AI Revenue Copilot**: Natural-language financial summary synthesizing overdue risk, renewal pipelines, and cash health.
- **Upcoming Renewals & Recent Invoices**: Live feeds for the next 30 days.

### 2. Customer Management (360° View)
- Create, search, filter, update, and delete customer profiles.
- **Customer 360° Drawer**: Single-pane access to customer contact info, active plans, invoice history, and payment transactions.

### 3. Products & Pricing Plans
- Multi-tier SaaS products (Starter, Growth Pro, Annual Enterprise, Add-ons).
- Supports **Monthly**, **Yearly**, and **One-time** billing cycles.
- One-click active/disabled toggles.
- Custom feature bullets per tier.

### 4. Subscription Lifecycle Engine
- Automatic first invoice generation upon customer subscription.
- Status management: `ACTIVE`, `PAST_DUE`, `PAUSED`, `CANCELLED`.
- In-place **Upgrade / Downgrade** pricing tier.
- Pause and resume recurring renewals.

### 5. Invoicing & PDF Generation
- Multi-item invoice creator with dynamic line additions/removals.
- Real-time tax (GST 18%) and discount calculations.
- Unique invoice numbering (`INV-YYYY-XXXX`).
- **Print / Download PDF**: Dedicated print stylesheet formatted for official tax invoice receipts.

### 6. Payment Gateway Simulator
- Record simulated payments (Credit/Debit Card, UPI, Bank Transfer, Stripe Simulation, Cash).
- Test **Success**, **Pending**, and **Failed** scenarios with custom decline reasons.
- Auto-reconciles invoice status to `PAID` and reactivates past-due accounts.

### 7. Public Pricing Page (`/pricing`)
- High-converting dark SaaS pricing page with Monthly/Annual discount toggle.

---

## 🛠️ Technology Stack
- **Framework:** Next.js 16 (App Router, Server Actions / Route Handlers)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + Lucide Icons
- **Data Visualization:** Recharts
- **Database Layer:** Prisma ORM with Neon PostgreSQL & resilient Zero-latency Data Store

---

## 🏃 Running Locally
```bash
# 1. Install dependencies
npm install

# 2. Run Next.js Development Server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.
