import fs from "fs";
import path from "path";
import {
  CustomerType,
  ProductType,
  PlanType,
  SubscriptionType,
  InvoiceType,
  PaymentType,
  DashboardMetrics,
} from "@/types";

interface StorageData {
  customers: CustomerType[];
  products: ProductType[];
  plans: PlanType[];
  subscriptions: SubscriptionType[];
  invoices: InvoiceType[];
  payments: PaymentType[];
}

const DATA_FILE = path.join(process.cwd(), "data", "database.json");

// Initial Seed Data (Stripe & Linear SaaS Style)
function getInitialData(): StorageData {
  const now = new Date();
  const nextMonth = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  const pastMonth = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const nextYear = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000);

  const starterPlan: PlanType = {
    id: "plan-starter",
    productId: "prod-pulse",
    name: "Starter Tier",
    description: "Ideal for indie creators, side projects & early-stage teams.",
    price: 2499,
    interval: "MONTHLY",
    features: ["10,000 API requests/day", "Standard 99.5% Uptime SLA", "Community & Email Support", "1 Admin Seat"],
    isActive: true,
  };

  const proPlan: PlanType = {
    id: "plan-pro",
    productId: "prod-pulse",
    name: "Growth Pro",
    description: "Scale recurring workloads with real-time analytics & priority support.",
    price: 7999,
    interval: "MONTHLY",
    features: ["Unlimited API requests", "99.99% Guaranteed SLA", "24/7 Slack & Phone Priority", "10 Admin Seats", "Custom Webhooks"],
    isActive: true,
  };

  const enterprisePlan: PlanType = {
    id: "plan-ent",
    productId: "prod-pulse",
    name: "Annual Enterprise",
    description: "Dedicated account manager, custom SOC2 compliance & custom rate limits.",
    price: 79999,
    interval: "YEARLY",
    features: ["Custom Rate limits", "Dedicated Technical Account Manager", "SOC2 Type II compliance", "Unlimited seats", "On-premise connector"],
    isActive: true,
  };

  const products: ProductType[] = [
    {
      id: "prod-pulse",
      name: "PulseCloud API Infrastructure",
      description: "Mission-critical API gateway, rate limiting, and real-time observability suite.",
      category: "Developer Tools",
      isActive: true,
      plans: [starterPlan, proPlan, enterprisePlan],
    },
    {
      id: "prod-sec",
      name: "Dedicated IP & Security Pack",
      description: "Dedicated egress IPv4 addresses and advanced WAF DDoS shielding.",
      category: "Security",
      isActive: true,
      plans: [
        {
          id: "plan-addon-ip",
          productId: "prod-sec",
          name: "Dedicated IP Setup",
          description: "One-time provisioning and IP warmup audit.",
          price: 4999,
          interval: "ONE_TIME",
          features: ["Dedicated IPv4 allocation", "PTR record setup", "Spamhaus clean reputation warranty"],
          isActive: true,
        },
      ],
    },
  ];

  const plans: PlanType[] = [...products[0].plans, ...products[1].plans];

  const customers: CustomerType[] = [
    {
      id: "cust-1",
      name: "Aarav Sharma",
      email: "aarav@hypergrowth.tech",
      phone: "+91 98765 43210",
      company: "HyperGrowth Technologies",
      addressLine1: "42 Outer Ring Road, Bellandur",
      city: "Bengaluru",
      state: "Karnataka",
      postalCode: "560103",
      country: "India",
      createdAt: pastMonth.toISOString(),
    },
    {
      id: "cust-2",
      name: "Meera Patel",
      email: "meera@designsync.io",
      phone: "+91 98220 12345",
      company: "DesignSync Studios",
      addressLine1: "Tower B, Cyber City",
      city: "Gurugram",
      state: "Haryana",
      postalCode: "122002",
      country: "India",
      createdAt: pastMonth.toISOString(),
    },
    {
      id: "cust-3",
      name: "Vikram Rathore",
      email: "vikram@vertexlogistics.com",
      phone: "+91 94140 88990",
      company: "Vertex Supply Chain Ltd",
      addressLine1: "C-14 Industrial Area, Phase II",
      city: "Pune",
      state: "Maharashtra",
      postalCode: "411013",
      country: "India",
      createdAt: now.toISOString(),
    },
    {
      id: "cust-4",
      name: "Sarah Jenkins",
      email: "sarah@nordicfin.co",
      phone: "+44 20 7946 0912",
      company: "Nordic Finance Partners",
      addressLine1: "15 Bishopsgate",
      city: "London",
      state: "Greater London",
      postalCode: "EC2N 3AR",
      country: "United Kingdom",
      createdAt: pastMonth.toISOString(),
    },
  ];

  const subscriptions: SubscriptionType[] = [
    {
      id: "sub-1",
      customerId: "cust-1",
      planId: "plan-pro",
      status: "ACTIVE",
      startDate: pastMonth.toISOString(),
      currentPeriodStart: now.toISOString(),
      currentPeriodEnd: nextMonth.toISOString(),
      nextBillingDate: nextMonth.toISOString(),
    },
    {
      id: "sub-2",
      customerId: "cust-2",
      planId: "plan-starter",
      status: "ACTIVE",
      startDate: now.toISOString(),
      currentPeriodStart: now.toISOString(),
      currentPeriodEnd: nextMonth.toISOString(),
      nextBillingDate: nextMonth.toISOString(),
    },
    {
      id: "sub-3",
      customerId: "cust-3",
      planId: "plan-ent",
      status: "ACTIVE",
      startDate: now.toISOString(),
      currentPeriodStart: now.toISOString(),
      currentPeriodEnd: nextYear.toISOString(),
      nextBillingDate: nextYear.toISOString(),
    },
    {
      id: "sub-4",
      customerId: "cust-4",
      planId: "plan-starter",
      status: "PAST_DUE",
      startDate: new Date(now.getTime() - 45 * 24 * 60 * 60 * 1000).toISOString(),
      currentPeriodStart: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      currentPeriodEnd: now.toISOString(),
      nextBillingDate: now.toISOString(),
    },
  ];

  const invoices: InvoiceType[] = [
    {
      id: "inv-1",
      invoiceNumber: "INV-2026-0001",
      customerId: "cust-1",
      subscriptionId: "sub-1",
      status: "PAID",
      issueDate: pastMonth.toISOString(),
      dueDate: new Date(pastMonth.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      subtotal: 7999,
      taxRate: 18,
      taxAmount: 1439.82,
      discountRate: 0,
      discountAmount: 0,
      total: 9438.82,
      currency: "INR",
      notes: "Automatic cycle billing for Growth Pro.",
      paidAt: new Date(pastMonth.getTime() + 1 * 24 * 60 * 60 * 1000).toISOString(),
      items: [
        {
          id: "item-1",
          description: "Growth Pro Subscription (Monthly)",
          quantity: 1,
          unitPrice: 7999,
          amount: 7999,
        },
      ],
    },
    {
      id: "inv-2",
      invoiceNumber: "INV-2026-0002",
      customerId: "cust-3",
      subscriptionId: "sub-3",
      status: "PAID",
      issueDate: now.toISOString(),
      dueDate: new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000).toISOString(),
      subtotal: 79999,
      taxRate: 18,
      taxAmount: 12959.84,
      discountRate: 10,
      discountAmount: 7999.9,
      total: 84958.94,
      currency: "INR",
      notes: "Enterprise annual plan with 10% loyalty discount applied.",
      paidAt: now.toISOString(),
      items: [
        {
          id: "item-2",
          description: "Annual Enterprise Tier (1 Year Contract)",
          quantity: 1,
          unitPrice: 79999,
          amount: 79999,
        },
      ],
    },
    {
      id: "inv-3",
      invoiceNumber: "INV-2026-0003",
      customerId: "cust-4",
      subscriptionId: "sub-4",
      status: "OVERDUE",
      issueDate: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      dueDate: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      subtotal: 2499,
      taxRate: 18,
      taxAmount: 449.82,
      discountRate: 0,
      discountAmount: 0,
      total: 2948.82,
      currency: "INR",
      notes: "Auto-retry failed. Issuing bank returned insufficient funds.",
      items: [
        {
          id: "item-3",
          description: "Starter Tier Monthly Renewal",
          quantity: 1,
          unitPrice: 2499,
          amount: 2499,
        },
      ],
    },
    {
      id: "inv-4",
      invoiceNumber: "INV-2026-0004",
      customerId: "cust-2",
      subscriptionId: "sub-2",
      status: "PENDING",
      issueDate: now.toISOString(),
      dueDate: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      subtotal: 2499,
      taxRate: 18,
      taxAmount: 449.82,
      discountRate: 0,
      discountAmount: 0,
      total: 2948.82,
      currency: "INR",
      notes: "Upcoming cycle invoice.",
      items: [
        {
          id: "item-4",
          description: "Starter Tier Monthly",
          quantity: 1,
          unitPrice: 2499,
          amount: 2499,
        },
      ],
    },
  ];

  const payments: PaymentType[] = [
    {
      id: "pay-1",
      invoiceId: "inv-1",
      customerId: "cust-1",
      amount: 9438.82,
      currency: "INR",
      paymentMethod: "CREDIT_CARD",
      status: "SUCCESS",
      transactionId: "TXN_SIM_CC_849201",
      paidAt: invoices[0].paidAt!,
    },
    {
      id: "pay-2",
      invoiceId: "inv-2",
      customerId: "cust-3",
      amount: 84958.94,
      currency: "INR",
      paymentMethod: "BANK_TRANSFER",
      status: "SUCCESS",
      transactionId: "NEFT_IN_9901842",
      paidAt: now.toISOString(),
    },
    {
      id: "pay-3",
      invoiceId: "inv-3",
      customerId: "cust-4",
      amount: 2948.82,
      currency: "INR",
      paymentMethod: "CREDIT_CARD",
      status: "FAILED",
      failureReason: "Card declined by issuing bank (Insufficient funds)",
      transactionId: "TXN_FAIL_331092",
      paidAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];

  return { customers, products, plans, subscriptions, invoices, payments };
}

// Memory cache for super-fast responses
let memoryStorage: StorageData | null = null;

function loadStorage(): StorageData {
  if (memoryStorage) return memoryStorage;

  try {
    if (!fs.existsSync(path.dirname(DATA_FILE))) {
      fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
    }

    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, "utf-8");
      memoryStorage = JSON.parse(content);
      return memoryStorage!;
    }
  } catch (e) {
    console.warn("Storage file read error, falling back to memory:", e);
  }

  memoryStorage = getInitialData();
  saveStorage(memoryStorage);
  return memoryStorage;
}

function saveStorage(data: StorageData) {
  memoryStorage = data;
  try {
    if (!fs.existsSync(path.dirname(DATA_FILE))) {
      fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (e) {
    console.warn("Storage save error (running in read-only environment):", e);
  }
}

export const db = {
  resetAndSeed: () => {
    const fresh = getInitialData();
    saveStorage(fresh);
    return fresh;
  },

  // Customers
  getCustomers: (search?: string) => {
    const data = loadStorage();
    let list = data.customers;
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          c.company?.toLowerCase().includes(q) ||
          c.city?.toLowerCase().includes(q)
      );
    }
    return list.map((c) => ({
      ...c,
      _count: {
        subscriptions: data.subscriptions.filter((s) => s.customerId === c.id).length,
        invoices: data.invoices.filter((i) => i.customerId === c.id).length,
        payments: data.payments.filter((p) => p.customerId === c.id).length,
      },
    }));
  },

  getCustomerById: (id: string) => {
    const data = loadStorage();
    const customer = data.customers.find((c) => c.id === id);
    if (!customer) return null;

    const subscriptions = data.subscriptions
      .filter((s) => s.customerId === id)
      .map((s) => ({
        ...s,
        plan: data.plans.find((p) => p.id === s.planId),
      }));

    const invoices = data.invoices
      .filter((i) => i.customerId === id)
      .sort((a, b) => new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime());

    const payments = data.payments
      .filter((p) => p.customerId === id)
      .sort((a, b) => new Date(b.paidAt).getTime() - new Date(a.paidAt).getTime());

    return {
      ...customer,
      subscriptions,
      invoices,
      payments,
    };
  },

  createCustomer: (input: Omit<CustomerType, "id" | "createdAt">) => {
    const data = loadStorage();
    const newCustomer: CustomerType = {
      ...input,
      id: "cust-" + Date.now().toString(36) + Math.random().toString(36).substring(2, 5),
      createdAt: new Date().toISOString(),
    };
    data.customers.unshift(newCustomer);
    saveStorage(data);
    return newCustomer;
  },

  updateCustomer: (id: string, updates: Partial<CustomerType>) => {
    const data = loadStorage();
    const idx = data.customers.findIndex((c) => c.id === id);
    if (idx === -1) return null;
    data.customers[idx] = { ...data.customers[idx], ...updates };
    saveStorage(data);
    return data.customers[idx];
  },

  deleteCustomer: (id: string) => {
    const data = loadStorage();
    data.customers = data.customers.filter((c) => c.id !== id);
    data.subscriptions = data.subscriptions.filter((s) => s.customerId !== id);
    data.invoices = data.invoices.filter((i) => i.customerId !== id);
    data.payments = data.payments.filter((p) => p.customerId !== id);
    saveStorage(data);
    return true;
  },

  // Products & Plans
  getProducts: () => {
    const data = loadStorage();
    return data.products.map((prod) => ({
      ...prod,
      plans: data.plans.filter((p) => p.productId === prod.id),
    }));
  },

  createProduct: (input: { name: string; description?: string; category?: string }) => {
    const data = loadStorage();
    const newProd: ProductType = {
      id: "prod-" + Date.now().toString(36),
      name: input.name,
      description: input.description,
      category: input.category || "General",
      isActive: true,
      plans: [],
    };
    data.products.push(newProd);
    saveStorage(data);
    return newProd;
  },

  createPlan: (input: Omit<PlanType, "id">) => {
    const data = loadStorage();
    const newPlan: PlanType = {
      ...input,
      id: "plan-" + Date.now().toString(36),
    };
    data.plans.push(newPlan);
    saveStorage(data);
    return newPlan;
  },

  togglePlanStatus: (planId: string) => {
    const data = loadStorage();
    const plan = data.plans.find((p) => p.id === planId);
    if (!plan) return null;
    plan.isActive = !plan.isActive;
    saveStorage(data);
    return plan;
  },

  // Subscriptions
  getSubscriptions: () => {
    const data = loadStorage();
    return data.subscriptions
      .map((s) => ({
        ...s,
        customer: data.customers.find((c) => c.id === s.customerId),
        plan: data.plans.find((p) => p.id === s.planId),
      }))
      .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
  },

  createSubscription: (customerId: string, planId: string) => {
    const data = loadStorage();
    const customer = data.customers.find((c) => c.id === customerId);
    const plan = data.plans.find((p) => p.id === planId);
    if (!customer || !plan) throw new Error("Customer or Plan not found");

    const now = new Date();
    const daysToAdd = plan.interval === "YEARLY" ? 365 : plan.interval === "MONTHLY" ? 30 : 9999;
    const periodEnd = new Date(now.getTime() + daysToAdd * 24 * 60 * 60 * 1000);

    const subId = "sub-" + Date.now().toString(36);
    const newSub: SubscriptionType = {
      id: subId,
      customerId,
      planId,
      status: "ACTIVE",
      startDate: now.toISOString(),
      currentPeriodStart: now.toISOString(),
      currentPeriodEnd: periodEnd.toISOString(),
      nextBillingDate: periodEnd.toISOString(),
    };
    data.subscriptions.unshift(newSub);

    // Auto-generate initial invoice
    const invNumber = `INV-${now.getFullYear()}-${String(data.invoices.length + 1).padStart(4, "0")}`;
    const subtotal = plan.price;
    const taxRate = 18.0;
    const taxAmount = (subtotal * taxRate) / 100;
    const total = subtotal + taxAmount;

    const newInvoice: InvoiceType = {
      id: "inv-" + Date.now().toString(36),
      invoiceNumber: invNumber,
      customerId,
      subscriptionId: subId,
      status: "PENDING",
      issueDate: now.toISOString(),
      dueDate: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      subtotal,
      taxRate,
      taxAmount,
      discountRate: 0,
      discountAmount: 0,
      total,
      currency: "INR",
      notes: `Automated subscription setup invoice for ${plan.name}`,
      items: [
        {
          id: "item-" + Date.now().toString(36),
          description: `${plan.name} (${plan.interval})`,
          quantity: 1,
          unitPrice: plan.price,
          amount: plan.price,
        },
      ],
    };
    data.invoices.unshift(newInvoice);

    saveStorage(data);
    return { subscription: newSub, invoice: newInvoice };
  },

  updateSubscription: (
    id: string,
    action: "PAUSE" | "RESUME" | "CANCEL" | "CHANGE_PLAN",
    newPlanId?: string,
    cancelReason?: string
  ) => {
    const data = loadStorage();
    const sub = data.subscriptions.find((s) => s.id === id);
    if (!sub) return null;

    if (action === "PAUSE") sub.status = "PAUSED";
    if (action === "RESUME") sub.status = "ACTIVE";
    if (action === "CANCEL") {
      sub.status = "CANCELLED";
      sub.cancelledAt = new Date().toISOString();
      sub.cancelReason = cancelReason || "Cancelled by administrator";
    }
    if (action === "CHANGE_PLAN" && newPlanId) {
      const plan = data.plans.find((p) => p.id === newPlanId);
      if (plan) {
        sub.planId = newPlanId;
      }
    }

    saveStorage(data);
    return sub;
  },

  // Invoices
  getInvoices: () => {
    const data = loadStorage();
    return data.invoices
      .map((inv) => ({
        ...inv,
        customer: data.customers.find((c) => c.id === inv.customerId),
        subscription: data.subscriptions.find((s) => s.id === inv.subscriptionId),
        payments: data.payments.filter((p) => p.invoiceId === inv.id),
      }))
      .sort((a, b) => new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime());
  },

  getInvoiceById: (id: string) => {
    const data = loadStorage();
    const inv = data.invoices.find((i) => i.id === id);
    if (!inv) return null;
    return {
      ...inv,
      customer: data.customers.find((c) => c.id === inv.customerId),
      subscription: data.subscriptions.find((s) => s.id === inv.subscriptionId),
      payments: data.payments.filter((p) => p.invoiceId === inv.id),
    };
  },

  createInvoice: (input: {
    customerId: string;
    dueDate: string;
    items: { description: string; quantity: number; unitPrice: number }[];
    taxRate?: number;
    discountRate?: number;
    notes?: string;
  }) => {
    const data = loadStorage();
    const now = new Date();
    const invNumber = `INV-${now.getFullYear()}-${String(data.invoices.length + 1).padStart(4, "0")}`;

    const items = input.items.map((it) => ({
      id: "item-" + Math.random().toString(36).substring(2, 7),
      description: it.description,
      quantity: it.quantity,
      unitPrice: it.unitPrice,
      amount: it.quantity * it.unitPrice,
    }));

    const subtotal = items.reduce((acc, curr) => acc + curr.amount, 0);
    const discountRate = input.discountRate || 0;
    const discountAmount = (subtotal * discountRate) / 100;
    const taxableAmount = subtotal - discountAmount;
    const taxRate = input.taxRate !== undefined ? input.taxRate : 18.0;
    const taxAmount = (taxableAmount * taxRate) / 100;
    const total = taxableAmount + taxAmount;

    const newInvoice: InvoiceType = {
      id: "inv-" + Date.now().toString(36),
      invoiceNumber: invNumber,
      customerId: input.customerId,
      status: "PENDING",
      issueDate: now.toISOString(),
      dueDate: input.dueDate || new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      subtotal,
      taxRate,
      taxAmount,
      discountRate,
      discountAmount,
      total,
      currency: "INR",
      notes: input.notes || "Standard B2B invoice.",
      items,
    };

    data.invoices.unshift(newInvoice);
    saveStorage(data);
    return newInvoice;
  },

  // Payments
  getPayments: () => {
    const data = loadStorage();
    return data.payments
      .map((p) => ({
        ...p,
        customer: data.customers.find((c) => c.id === p.customerId),
        invoice: data.invoices.find((i) => i.id === p.invoiceId),
      }))
      .sort((a, b) => new Date(b.paidAt).getTime() - new Date(a.paidAt).getTime());
  },

  recordPayment: (input: {
    invoiceId: string;
    amount?: number;
    paymentMethod: PaymentType["paymentMethod"];
    status: PaymentType["status"];
    failureReason?: string;
  }) => {
    const data = loadStorage();
    const invoice = data.invoices.find((i) => i.id === input.invoiceId);
    if (!invoice) throw new Error("Invoice not found");

    const amount = input.amount !== undefined ? input.amount : invoice.total;
    const now = new Date();

    const payment: PaymentType = {
      id: "pay-" + Date.now().toString(36),
      invoiceId: invoice.id,
      customerId: invoice.customerId,
      amount,
      currency: invoice.currency,
      paymentMethod: input.paymentMethod,
      status: input.status,
      transactionId: "TXN_" + Math.random().toString(36).substring(2, 9).toUpperCase(),
      failureReason: input.failureReason,
      paidAt: now.toISOString(),
    };

    data.payments.unshift(payment);

    if (input.status === "SUCCESS") {
      invoice.status = "PAID";
      invoice.paidAt = now.toISOString();

      // If associated with a past-due subscription, reactivate it!
      if (invoice.subscriptionId) {
        const sub = data.subscriptions.find((s) => s.id === invoice.subscriptionId);
        if (sub && sub.status === "PAST_DUE") {
          sub.status = "ACTIVE";
        }
      }
    }

    saveStorage(data);
    return { payment, invoice };
  },

  // Dashboard Metrics & Calculations
  getDashboardMetrics: (): DashboardMetrics => {
    const data = loadStorage();

    // 1. Calculate MRR
    let mrr = 0;
    data.subscriptions.forEach((sub) => {
      if (sub.status === "ACTIVE") {
        const plan = data.plans.find((p) => p.id === sub.planId);
        if (plan) {
          if (plan.interval === "MONTHLY") mrr += plan.price;
          else if (plan.interval === "YEARLY") mrr += plan.price / 12;
        }
      }
    });

    const arr = mrr * 12;

    // 2. Total Recorded Revenue (from successful payments)
    const totalRevenue = data.payments
      .filter((p) => p.status === "SUCCESS")
      .reduce((sum, p) => sum + p.amount, 0);

    // 3. Subscriptions & Invoices Count
    const activeSubscriptionsCount = data.subscriptions.filter((s) => s.status === "ACTIVE").length;
    const pastDueSubscriptionsCount = data.subscriptions.filter((s) => s.status === "PAST_DUE").length;

    const pendingInvoices = data.invoices.filter((i) => i.status === "PENDING");
    const pendingInvoicesCount = pendingInvoices.length;
    const pendingInvoicesAmount = pendingInvoices.reduce((sum, i) => sum + i.total, 0);

    const overdueInvoices = data.invoices.filter((i) => i.status === "OVERDUE");
    const overdueInvoicesCount = overdueInvoices.length;
    const overdueInvoicesAmount = overdueInvoices.reduce((sum, i) => sum + i.total, 0);

    // 4. Monthly Revenue Trend (Mocked realistic 6-month historical curve + live current)
    const months = ["May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov"];
    const baseRevenue = [32000, 48000, 61000, 74000, 89000, 102000, Math.round(totalRevenue)];
    const revenueTrend = months.map((m, idx) => ({
      month: m,
      revenue: baseRevenue[idx],
      mrr: Math.round(baseRevenue[idx] * 0.72),
    }));

    // 5. Upcoming Renewals
    const upcomingRenewals = data.subscriptions
      .filter((s) => s.status === "ACTIVE" || s.status === "PAST_DUE")
      .map((s) => {
        const cust = data.customers.find((c) => c.id === s.customerId);
        const plan = data.plans.find((p) => p.id === s.planId);
        return {
          id: s.id,
          customerName: cust?.name || "Unknown Customer",
          customerEmail: cust?.email || "",
          planName: plan?.name || "Plan",
          amount: plan?.price || 0,
          renewalDate: s.nextBillingDate,
          status: s.status,
        };
      })
      .sort((a, b) => new Date(a.renewalDate).getTime() - new Date(b.renewalDate).getTime());

    return {
      mrr,
      arr,
      totalRevenue,
      activeSubscriptionsCount,
      pastDueSubscriptionsCount,
      pendingInvoicesCount,
      pendingInvoicesAmount,
      overdueInvoicesCount,
      overdueInvoicesAmount,
      totalCustomers: data.customers.length,
      revenueTrend,
      recentInvoices: data.invoices.slice(0, 5),
      upcomingRenewals,
    };
  },
};

