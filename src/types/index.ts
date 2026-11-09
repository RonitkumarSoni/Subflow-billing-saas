export type BillingInterval = "MONTHLY" | "YEARLY" | "ONE_TIME";
export type SubscriptionStatus = "ACTIVE" | "PAUSED" | "CANCELLED" | "PAST_DUE";
export type InvoiceStatus = "DRAFT" | "PENDING" | "PAID" | "OVERDUE" | "CANCELLED";
export type PaymentStatus = "SUCCESS" | "PENDING" | "FAILED";
export type PaymentMethod = "CREDIT_CARD" | "BANK_TRANSFER" | "UPI" | "STRIPE_SIMULATION" | "CASH";

export interface PlanType {
  id: string;
  productId: string;
  name: string;
  description?: string | null;
  price: number;
  interval: BillingInterval;
  features: string[];
  isActive: boolean;
  product?: ProductType;
}

export interface ProductType {
  id: string;
  name: string;
  description?: string | null;
  category?: string | null;
  isActive: boolean;
  plans: PlanType[];
}

export interface CustomerType {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  company?: string | null;
  addressLine1?: string | null;
  city?: string | null;
  state?: string | null;
  postalCode?: string | null;
  country?: string | null;
  createdAt: string;
  subscriptions?: SubscriptionType[];
  invoices?: InvoiceType[];
  payments?: PaymentType[];
  _count?: {
    subscriptions: number;
    invoices: number;
    payments: number;
  };
}

export interface SubscriptionType {
  id: string;
  customerId: string;
  customer?: CustomerType;
  planId: string;
  plan?: PlanType;
  status: SubscriptionStatus;
  startDate: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  nextBillingDate: string;
  cancelledAt?: string | null;
  cancelReason?: string | null;
}

export interface InvoiceItemType {
  id?: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export interface InvoiceType {
  id: string;
  invoiceNumber: string;
  customerId: string;
  customer?: CustomerType;
  subscriptionId?: string | null;
  subscription?: SubscriptionType | null;
  status: InvoiceStatus;
  issueDate: string;
  dueDate: string;
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  discountRate: number;
  discountAmount: number;
  total: number;
  currency: string;
  notes?: string | null;
  paidAt?: string | null;
  items: InvoiceItemType[];
  payments?: PaymentType[];
}

export interface PaymentType {
  id: string;
  invoiceId: string;
  invoice?: InvoiceType;
  customerId: string;
  customer?: CustomerType;
  amount: number;
  currency: string;
  paymentMethod: PaymentMethod;
  status: PaymentStatus;
  transactionId: string;
  failureReason?: string | null;
  paidAt: string;
}

export interface DashboardMetrics {
  mrr: number;
  arr: number;
  totalRevenue: number;
  activeSubscriptionsCount: number;
  pastDueSubscriptionsCount: number;
  pendingInvoicesCount: number;
  pendingInvoicesAmount: number;
  overdueInvoicesCount: number;
  overdueInvoicesAmount: number;
  totalCustomers: number;
  revenueTrend: {
    month: string;
    revenue: number;
    mrr: number;
  }[];
  recentInvoices: InvoiceType[];
  upcomingRenewals: {
    id: string;
    customerName: string;
    customerEmail: string;
    planName: string;
    amount: number;
    renewalDate: string;
    status: SubscriptionStatus;
  }[];
}

