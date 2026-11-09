"use client";

export const dynamic = "force-dynamic";

import React, { useEffect, useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { MetricCard } from "@/components/MetricCard";
import { RevenueChart } from "@/components/RevenueChart";
import { AIRevenueSummary } from "@/components/AIRevenueSummary";
import { InvoiceDetailModal } from "@/components/InvoiceDetailModal";
import { PaymentModal } from "@/components/PaymentModal";
import { CustomerDetailDrawer } from "@/components/CustomerDetailDrawer";
import {
  TrendingUp,
  DollarSign,
  Repeat,
  AlertTriangle,
  FileText,
  Users,
  CreditCard,
  Plus,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { DashboardMetrics } from "@/types";

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null);
  const [paymentInvoiceId, setPaymentInvoiceId] = useState<string | null>(null);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/dashboard/stats");
      const data = await res.json();
      setMetrics(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0 bg-slate-50">
        <Header
          title="Revenue & Subscription Overview"
          subtitle="Real-time recurring metrics, billing cycles & pipeline monitoring"
          onRefresh={fetchMetrics}
        />

        <div className="p-8 space-y-8 flex-1">
          {/* Top 4 Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <MetricCard
              title="Monthly Recurring (MRR)"
              value={`₹${(metrics?.mrr || 0).toLocaleString("en-IN")}`}
              change="+14.2%"
              isPositive={true}
              description="vs. previous month"
              icon={TrendingUp}
              badge="Predictable"
            />
            <MetricCard
              title="Annual Run-rate (ARR)"
              value={`₹${(metrics?.arr || 0).toLocaleString("en-IN")}`}
              change="+22.8%"
              isPositive={true}
              description="projected 12m run"
              icon={DollarSign}
            />
            <MetricCard
              title="Active Subscriptions"
              value={String(metrics?.activeSubscriptionsCount || 0)}
              change={`${metrics?.pastDueSubscriptionsCount || 0} past due`}
              isPositive={metrics?.pastDueSubscriptionsCount === 0}
              description="monitored accounts"
              icon={Repeat}
            />
            <MetricCard
              title="Overdue Invoices"
              value={`₹${(metrics?.overdueInvoicesAmount || 0).toLocaleString("en-IN")}`}
              description={`${metrics?.overdueInvoicesCount || 0} unpaid notices`}
              change={metrics?.overdueInvoicesCount ? "Requires attention" : "Clean"}
              isPositive={!metrics?.overdueInvoicesCount}
              icon={AlertTriangle}
              badge="Action Required"
            />
          </div>

          {/* AI Natural-Language Revenue Copilot */}
          <AIRevenueSummary metrics={metrics} />

          {/* Revenue Chart + Quick Health Widget */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <RevenueChart data={metrics?.revenueTrend || []} />
            </div>

            {/* Quick Billing Pipeline / Health */}
            <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-slate-900">Billing Health Summary</h3>
                  <span className="text-[11px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                    Simulated SaaS
                  </span>
                </div>
                <div className="space-y-4 text-xs">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100">
                    <span className="text-slate-600 font-medium">Total Paid Volume</span>
                    <span className="font-bold text-slate-900 text-sm">
                      ₹{(metrics?.totalRevenue || 0).toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-amber-50/50 border border-amber-100">
                    <span className="text-amber-800 font-medium">Pending Invoices</span>
                    <span className="font-bold text-amber-900">
                      ₹{(metrics?.pendingInvoicesAmount || 0).toLocaleString("en-IN")} (
                      {metrics?.pendingInvoicesCount})
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100">
                    <span className="text-slate-600 font-medium">Customer Accounts</span>
                    <span className="font-bold text-slate-900">{metrics?.totalCustomers || 0}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 mt-4 text-[11px] text-slate-500 leading-relaxed">
                Tip: Click <strong>"Print / Download PDF"</strong> on any invoice to produce official
                tax-compliant billing receipts with your logo.
              </div>
            </div>
          </div>

          {/* Bottom Grid: Upcoming Renewals & Recent Invoices */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Upcoming Renewals */}
            <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">Upcoming Renewals</h3>
                  <p className="text-xs text-slate-500">Scheduled billing cycles in next 30 days</p>
                </div>
                <Repeat className="w-4 h-4 text-slate-400" />
              </div>

              <div className="divide-y divide-slate-100">
                {!metrics?.upcomingRenewals || metrics.upcomingRenewals.length === 0 ? (
                  <p className="py-6 text-center text-xs text-slate-400">No renewals scheduled.</p>
                ) : (
                  metrics.upcomingRenewals.map((renewal) => (
                    <div key={renewal.id} className="py-3 flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold text-slate-900">{renewal.customerName}</p>
                        <p className="text-[11px] text-slate-500">{renewal.planName}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-bold text-slate-900">
                          ₹{renewal.amount.toLocaleString("en-IN")}
                        </p>
                        <p className="text-[11px] text-indigo-600">
                          {new Date(renewal.renewalDate).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                          })}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Recent Invoices */}
            <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">Recent Invoices</h3>
                  <p className="text-xs text-slate-500">Latest generated B2B tax invoices</p>
                </div>
                <FileText className="w-4 h-4 text-slate-400" />
              </div>

              <div className="divide-y divide-slate-100">
                {!metrics?.recentInvoices || metrics.recentInvoices.length === 0 ? (
                  <p className="py-6 text-center text-xs text-slate-400">No invoices generated.</p>
                ) : (
                  metrics.recentInvoices.map((inv) => {
                    const isPaid = inv.status === "PAID";
                    const isOverdue = inv.status === "OVERDUE";
                    return (
                      <div
                        key={inv.id}
                        onClick={() => setSelectedInvoiceId(inv.id)}
                        className="py-3 flex items-center justify-between hover:bg-slate-50/80 cursor-pointer rounded-lg px-2 -mx-2 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-xs font-bold text-slate-900">
                            {inv.invoiceNumber}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                              isPaid
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : isOverdue
                                ? "bg-rose-50 text-rose-700 border-rose-200"
                                : "bg-amber-50 text-amber-700 border-amber-200"
                            }`}
                          >
                            {inv.status}
                          </span>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-bold text-slate-900">
                            ₹{inv.total.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                          </p>
                          <span className="text-[10px] text-indigo-600 hover:underline">
                            View &rarr;
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Invoice Detail Modal (PDF view) */}
      <InvoiceDetailModal
        invoiceId={selectedInvoiceId}
        onClose={() => setSelectedInvoiceId(null)}
        onRecordPayment={(id) => {
          setSelectedInvoiceId(null);
          setPaymentInvoiceId(id);
        }}
      />

      {/* Payment Simulator Modal */}
      <PaymentModal
        isOpen={!!paymentInvoiceId}
        onClose={() => setPaymentInvoiceId(null)}
        onSuccess={() => {
          fetchMetrics();
        }}
        defaultInvoiceId={paymentInvoiceId || undefined}
      />

      {/* Customer 360 Drawer */}
      <CustomerDetailDrawer
        customerId={selectedCustomerId}
        onClose={() => setSelectedCustomerId(null)}
        onAddSubscription={() => {}}
        onViewInvoice={(id) => setSelectedInvoiceId(id)}
      />
    </div>
  );
}
