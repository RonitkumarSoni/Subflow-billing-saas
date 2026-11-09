import { PrismaClient, BillingInterval, SubscriptionStatus, InvoiceStatus, PaymentStatus, PaymentMethod } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seeding...");

  // Clean existing data
  await prisma.payment.deleteMany();
  await prisma.invoiceItem.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.subscription.deleteMany();
  await prisma.plan.deleteMany();
  await prisma.product.deleteMany();
  await prisma.customer.deleteMany();

  console.log("🧹 Cleaned old records.");

  // 1. Create Products
  const saasProduct = await prisma.product.create({
    data: {
      name: "PulseCloud API Platform",
      description: "High-performance API infrastructure and real-time monitoring suite.",
      category: "Developer Tools",
      isActive: true,
      plans: {
        create: [
          {
            name: "Starter Tier",
            description: "Perfect for indie hackers, side projects, and early stage startups.",
            price: 2499, // INR
            interval: BillingInterval.MONTHLY,
            features: ["Up to 10,000 API requests/day", "Standard 99.5% Uptime SLA", "Email support within 24h", "1 Team seat"],
            isActive: true,
          },
          {
            name: "Growth Pro",
            description: "Scale your recurring operations with advanced analytics & automation.",
            price: 7999, // INR
            interval: BillingInterval.MONTHLY,
            features: ["Unlimited API requests", "99.99% Guaranteed SLA", "24/7 Priority Discord & Phone", "10 Team seats", "Custom Webhooks"],
            isActive: true,
          },
          {
            name: "Annual Enterprise",
            description: "Custom compliance, dedicated TAM, and on-premise connector.",
            price: 79999, // INR (Annual)
            interval: BillingInterval.YEARLY,
            features: ["Custom Rate limits", "Dedicated Technical Account Manager", "SOC2 Type II compliance", "Unlimited seats", "Custom SLA"],
            isActive: true,
          },
        ],
      },
    },
    include: { plans: true },
  });

  const addonProduct = await prisma.product.create({
    data: {
      name: "Dedicated IP & Security Pack",
      description: "Static egress IP address and advanced WAF DDoS shielding.",
      category: "Add-ons",
      isActive: true,
      plans: {
        create: [
          {
            name: "Dedicated IP Setup",
            description: "One-time provisioning and IP warmup audit.",
            price: 4999,
            interval: BillingInterval.ONE_TIME,
            features: ["Dedicated IPv4 allocation", "PTR record setup", "Spamhaus clean reputation warranty"],
            isActive: true,
          },
        ],
      },
    },
    include: { plans: true },
  });

  console.log("✅ Created Products & Plans.");

  const starterPlan = saasProduct.plans.find((p) => p.name === "Starter Tier")!;
  const proPlan = saasProduct.plans.find((p) => p.name === "Growth Pro")!;
  const enterprisePlan = saasProduct.plans.find((p) => p.name === "Annual Enterprise")!;

  // 2. Create Customers
  const customersData = [
    {
      name: "Aarav Sharma",
      email: "aarav@hypergrowth.tech",
      phone: "+91 98765 43210",
      company: "HyperGrowth Technologies Pvt Ltd",
      addressLine1: "42 Outer Ring Road, Bellandur",
      city: "Bengaluru",
      state: "Karnataka",
      postalCode: "560103",
      country: "India",
    },
    {
      name: "Meera Patel",
      email: "meera@designsync.io",
      phone: "+91 98220 12345",
      company: "DesignSync Studios",
      addressLine1: "Tower B, Cyber City",
      city: "Gurugram",
      state: "Haryana",
      postalCode: "122002",
      country: "India",
    },
    {
      name: "Vikram Rathore",
      email: "vikram@vertexlogistics.com",
      phone: "+91 94140 88990",
      company: "Vertex Supply Chain Solutions",
      addressLine1: "C-14 Industrial Area, Phase II",
      city: "Pune",
      state: "Maharashtra",
      postalCode: "411013",
      country: "India",
    },
    {
      name: "Sarah Jenkins",
      email: "sarah@nordicfin.co",
      phone: "+44 20 7946 0912",
      company: "Nordic Finance Partners",
      addressLine1: "15 Bishopsgate",
      city: "London",
      state: "Greater London",
      postalCode: "EC2N 3AR",
      country: "United Kingdom",
    },
  ];

  const createdCustomers = [];
  for (const c of customersData) {
    const cust = await prisma.customer.create({ data: c });
    createdCustomers.push(cust);
  }

  console.log(`✅ Created ${createdCustomers.length} Customers.`);

  // 3. Create Subscriptions
  const now = new Date();
  const nextMonth = new Date();
  nextMonth.setDate(now.getDate() + 30);

  const pastDate = new Date();
  pastDate.setDate(now.getDate() - 45);

  const sub1 = await prisma.subscription.create({
    data: {
      customerId: createdCustomers[0].id,
      planId: proPlan.id,
      status: SubscriptionStatus.ACTIVE,
      startDate: pastDate,
      currentPeriodStart: now,
      currentPeriodEnd: nextMonth,
      nextBillingDate: nextMonth,
    },
  });

  const sub2 = await prisma.subscription.create({
    data: {
      customerId: createdCustomers[1].id,
      planId: starterPlan.id,
      status: SubscriptionStatus.ACTIVE,
      startDate: now,
      currentPeriodStart: now,
      currentPeriodEnd: nextMonth,
      nextBillingDate: nextMonth,
    },
  });

  const sub3 = await prisma.subscription.create({
    data: {
      customerId: createdCustomers[2].id,
      planId: enterprisePlan.id,
      status: SubscriptionStatus.ACTIVE,
      startDate: now,
      currentPeriodStart: now,
      currentPeriodEnd: new Date(now.getFullYear() + 1, now.getMonth(), now.getDate()),
      nextBillingDate: new Date(now.getFullYear() + 1, now.getMonth(), now.getDate()),
    },
  });

  const sub4 = await prisma.subscription.create({
    data: {
      customerId: createdCustomers[3].id,
      planId: starterPlan.id,
      status: SubscriptionStatus.PAST_DUE,
      startDate: new Date(now.getTime() - 40 * 24 * 60 * 60 * 1000),
      currentPeriodStart: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000),
      currentPeriodEnd: now,
      nextBillingDate: now,
    },
  });

  console.log("✅ Created Active & Past Due Subscriptions.");

  // 4. Create Invoices and Simulated Payments
  // Invoice 1: Paid invoice for Aarav (Growth Pro)
  const inv1Subtotal = proPlan.price;
  const inv1Tax = inv1Subtotal * 0.18;
  const inv1Total = inv1Subtotal + inv1Tax;

  const inv1 = await prisma.invoice.create({
    data: {
      invoiceNumber: "INV-2026-0001",
      customerId: createdCustomers[0].id,
      subscriptionId: sub1.id,
      status: InvoiceStatus.PAID,
      issueDate: pastDate,
      dueDate: new Date(pastDate.getTime() + 7 * 24 * 60 * 60 * 1000),
      subtotal: inv1Subtotal,
      taxRate: 18.0,
      taxAmount: inv1Tax,
      discountRate: 0,
      discountAmount: 0,
      total: inv1Total,
      notes: "Auto-billed on subscription creation.",
      paidAt: new Date(pastDate.getTime() + 1 * 24 * 60 * 60 * 1000),
      items: {
        create: [
          {
            description: "Growth Pro Subscription (Monthly)",
            quantity: 1,
            unitPrice: proPlan.price,
            amount: proPlan.price,
          },
        ],
      },
    },
  });

  await prisma.payment.create({
    data: {
      invoiceId: inv1.id,
      customerId: createdCustomers[0].id,
      amount: inv1Total,
      currency: "INR",
      paymentMethod: PaymentMethod.CREDIT_CARD,
      status: PaymentStatus.SUCCESS,
      transactionId: "TXN_SIM_" + Math.random().toString(36).substring(2, 10).toUpperCase(),
      paidAt: inv1.paidAt!,
    },
  });

  // Invoice 2: Paid Enterprise Invoice
  const inv2Subtotal = enterprisePlan.price;
  const inv2Tax = inv2Subtotal * 0.18;
  const inv2Total = inv2Subtotal + inv2Tax;

  const inv2 = await prisma.invoice.create({
    data: {
      invoiceNumber: "INV-2026-0002",
      customerId: createdCustomers[2].id,
      subscriptionId: sub3.id,
      status: InvoiceStatus.PAID,
      issueDate: now,
      dueDate: new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000),
      subtotal: inv2Subtotal,
      taxRate: 18.0,
      taxAmount: inv2Tax,
      discountRate: 10.0,
      discountAmount: inv2Subtotal * 0.1,
      total: inv2Total - inv2Subtotal * 0.1,
      notes: "Enterprise annual pre-payment with 10% loyalty discount applied.",
      paidAt: now,
      items: {
        create: [
          {
            description: "Annual Enterprise Tier (1 Year Contract)",
            quantity: 1,
            unitPrice: enterprisePlan.price,
            amount: enterprisePlan.price,
          },
        ],
      },
    },
  });

  await prisma.payment.create({
    data: {
      invoiceId: inv2.id,
      customerId: createdCustomers[2].id,
      amount: inv2Total - inv2Subtotal * 0.1,
      currency: "INR",
      paymentMethod: PaymentMethod.BANK_TRANSFER,
      status: PaymentStatus.SUCCESS,
      transactionId: "NEFT_" + Math.random().toString(36).substring(2, 10).toUpperCase(),
      paidAt: now,
    },
  });

  // Invoice 3: Overdue Invoice for Sarah
  const inv3Subtotal = starterPlan.price;
  const inv3Tax = inv3Subtotal * 0.18;
  const inv3Total = inv3Subtotal + inv3Tax;

  const inv3 = await prisma.invoice.create({
    data: {
      invoiceNumber: "INV-2026-0003",
      customerId: createdCustomers[3].id,
      subscriptionId: sub4.id,
      status: InvoiceStatus.OVERDUE,
      issueDate: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000),
      dueDate: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
      subtotal: inv3Subtotal,
      taxRate: 18.0,
      taxAmount: inv3Tax,
      discountRate: 0,
      discountAmount: 0,
      total: inv3Total,
      notes: "Card payment failed on renewal cycle. Retry scheduled.",
      items: {
        create: [
          {
            description: "Starter Tier Monthly Renewal",
            quantity: 1,
            unitPrice: starterPlan.price,
            amount: starterPlan.price,
          },
        ],
      },
    },
  });

  await prisma.payment.create({
    data: {
      invoiceId: inv3.id,
      customerId: createdCustomers[3].id,
      amount: inv3Total,
      currency: "INR",
      paymentMethod: PaymentMethod.CREDIT_CARD,
      status: PaymentStatus.FAILED,
      failureReason: "Card declined by issuing bank (Insufficient funds)",
      transactionId: "TXN_FAIL_" + Math.random().toString(36).substring(2, 10).toUpperCase(),
      paidAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
    },
  });

  // Invoice 4: Pending Invoice for Meera
  const inv4Subtotal = starterPlan.price;
  const inv4Tax = inv4Subtotal * 0.18;
  const inv4Total = inv4Subtotal + inv4Tax;

  await prisma.invoice.create({
    data: {
      invoiceNumber: "INV-2026-0004",
      customerId: createdCustomers[1].id,
      subscriptionId: sub2.id,
      status: InvoiceStatus.PENDING,
      issueDate: now,
      dueDate: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
      subtotal: inv4Subtotal,
      taxRate: 18.0,
      taxAmount: inv4Tax,
      discountRate: 0,
      discountAmount: 0,
      total: inv4Total,
      notes: "Current billing cycle invoice.",
      items: {
        create: [
          {
            description: "Starter Tier Monthly",
            quantity: 1,
            unitPrice: starterPlan.price,
            amount: starterPlan.price,
          },
        ],
      },
    },
  });

  console.log("✅ Created Invoices & Payment audit trail.");
  console.log("🚀 Seeding finished successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

