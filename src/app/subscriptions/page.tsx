"use client";

import React, { useEffect, useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { SubscriptionModal } from "@/components/SubscriptionModal";
import { CustomerDetailDrawer } from "@/components/CustomerDetailDrawer";
import { InvoiceDetailModal } from "@/components/InvoiceDetailModal";
import {
  Repeat,
  Plus,
  Play,
  Pause,
  XCircle,
  ArrowUpDown,
  Search,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ChevronRight,
} from "lucide-react";
import { SubscriptionType, SubscriptionStatus, PlanType, ProductType } from "@/types";

export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<SubscriptionType[]>([]);
  const [products, setProducts] = useState<ProductType[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Modals
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [activeCustomerId, setActiveCustomerId] = useState<string | null>(null);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null);

  // Change Plan Modal
  const [upgradeSub, setUpgradeSub] = useState<SubscriptionType | null>(null);
  const [selectedNewPlanId, setSelectedNewPlanId] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      const [subsRes, prodsRes] = await Promise.all([
        fetch("/api/subscriptions"),
        fetch("/api/products"),
      ]);
      const subsData = await subsRes.json();
      const prodsData = await prodsRes.json();
      setSubscriptions(subsData);
      setProducts(prodsData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAction = async (
    id: string,
    action: "PAUSE" | "RESUME" | "CANCEL",
    reason?: string
  ) => {
    if (action === "CANCEL" && !confirm("Cancel this subscription?")) return;
    try {
      const res = await fetch("/api/subscriptions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action, cancelReason: reason }),
      });
      if (!res.ok) throw new Error("Action failed");
      fetchData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handlePlanChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!upgradeSub || !selectedNewPlanId) return;
    try {
      const res = await fetch("/api/subscriptions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: upgradeSub.id,
          action: "CHANGE_PLAN",
          newPlanId: selectedNewPlanId,
        }),
      });
      if (!res.ok) throw new Error("Failed to change plan");
      setUpgradeSub(null);
      fetchData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const allPlans: PlanType[] = products.flatMap((p) => p.plans || []).filter((p) => p.isActive);

  const filtered = subscriptions.filter((s) => {
    const matchesStatus = statusFilter === "ALL" || s.status === statusFilter;
    const matchesSearch =
      !search ||
      s.customer?.name.toLowerCase().includes(search.toLowerCase()) ||
      s.customer?.email.toLowerCase().includes(search.toLowerCase()) ||
      s.plan?.name.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0 bg-slate-50">
        <Header
          title="Subscription Lifecycle Management"
          subtitle="Monitor active tiers, upcoming renewal amounts, pause/resume and upgrade workflows"
          onRefresh={fetchData}
        >
          <button
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm shadow-indigo-500/20 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Subscription</span>
          </button>
        </Header>

        <div className="p-8 space-y-6 flex-1">
          {/* Filter Tabs & Search */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="flex items-center gap-1.5 p-1 bg-slate-200/70 rounded-xl text-xs font-semibold">
              {["ALL", "ACTIVE", "PAST_DUE", "PAUSED", "CANCELLED"].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    statusFilter === st
                      ? "bg-white text-slate-900 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {st.replace("_", " ")}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search subscriber or plan..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full text-xs pl-9 pr-4 py-2 rounded-xl border border-slate-200 bg-white shadow-2xs focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Subscriptions Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100/70 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
                  <th className="py-3.5 px-5">Subscriber</th>
                  <th className="py-3.5 px-5">Plan Tier</th>
                  <th className="py-3.5 px-5">Billing Cycle</th>
                  <th className="py-3.5 px-5">Next Renewal</th>
                  <th className="py-3.5 px-5">Status</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400">
                      Loading subscriptions...
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400">
                      No matching subscriptions found.
                    </td>
                  </tr>
                ) : (
                  filtered.map((sub) => {
                    const statusColor =
                      sub.status === "ACTIVE"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : sub.status === "PAST_DUE"
                        ? "bg-amber-50 text-amber-700 border-amber-200"
                        : sub.status === "PAUSED"
                        ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                        : "bg-slate-100 text-slate-600 border-slate-200";

                    return (
                      <tr key={sub.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-4 px-5">
                          <button
                            onClick={() => setActiveCustomerId(sub.customerId)}
                            className="text-left group"
                          >
                            <span className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors block">
                              {sub.customer?.name}
                            </span>
                            <span className="text-[11px] text-slate-400">{sub.customer?.email}</span>
                          </button>
                        </td>
                        <td className="py-4 px-5">
                          <span className="font-semibold text-slate-900 block">
                            {sub.plan?.name || "N/A"}
                          </span>
                          <span className="text-[11px] text-indigo-600 font-bold">
                            ₹{sub.plan?.price.toLocaleString("en-IN")}
                          </span>
                        </td>
                        <td className="py-4 px-5">
                          <span className="text-slate-700 font-medium capitalize">
                            {sub.plan?.interval.toLowerCase()}
                          </span>
                        </td>
                        <td className="py-4 px-5">
                          <span className="text-slate-900 font-medium block">
                            {new Date(sub.nextBillingDate).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            Started: {new Date(sub.startDate).toLocaleDateString()}
                          </span>
                        </td>
                        <td className="py-4 px-5">
                          <span
                            className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${statusColor}`}
                          >
                            {sub.status}
                          </span>
                        </td>
                        <td className="py-4 px-5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Upgrade / Downgrade Plan */}
                            <button
                              onClick={() => {
                                setUpgradeSub(sub);
                                setSelectedNewPlanId(sub.planId);
                              }}
                              title="Upgrade or Downgrade Plan"
                              className="p-1.5 text-slate-500 hover:text-indigo-600 rounded-lg hover:bg-indigo-50 border border-slate-200 transition-colors"
                            >
                              <ArrowUpDown className="w-3.5 h-3.5" />
                            </button>

                            {/* Pause / Resume */}
                            {sub.status === "ACTIVE" ? (
                              <button
                                onClick={() => handleAction(sub.id, "PAUSE")}
                                title="Pause Subscription"
                                className="p-1.5 text-slate-500 hover:text-amber-600 rounded-lg hover:bg-amber-50 border border-slate-200 transition-colors"
                              >
                                <Pause className="w-3.5 h-3.5" />
                              </button>
                            ) : sub.status === "PAUSED" ? (
                              <button
                                onClick={() => handleAction(sub.id, "RESUME")}
                                title="Resume Subscription"
                                className="p-1.5 text-slate-500 hover:text-emerald-600 rounded-lg hover:bg-emerald-50 border border-slate-200 transition-colors"
                              >
                                <Play className="w-3.5 h-3.5" />
                              </button>
                            ) : null}

                            {/* Cancel */}
                            {sub.status !== "CANCELLED" && (
                              <button
                                onClick={() => handleAction(sub.id, "CANCEL")}
                                title="Cancel Subscription"
                                className="p-1.5 text-slate-500 hover:text-rose-600 rounded-lg hover:bg-rose-50 border border-slate-200 transition-colors"
                              >
                                <XCircle className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Subscription Modal */}
      <SubscriptionModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSuccess={fetchData}
      />

      {/* Upgrade / Downgrade Plan Modal */}
      {upgradeSub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200/80 w-full max-w-md p-6 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="font-bold text-slate-900 text-base mb-1">Upgrade / Downgrade Plan</h3>
            <p className="text-xs text-slate-500 mb-4">
              Switch <strong>{upgradeSub.customer?.name}</strong> to a different pricing tier.
            </p>

            <form onSubmit={handlePlanChange} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Select New Plan Tier</label>
                <select
                  value={selectedNewPlanId}
                  onChange={(e) => setSelectedNewPlanId(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 bg-white"
                >
                  {allPlans.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} - ₹{p.price.toLocaleString("en-IN")} / {p.interval.toLowerCase()}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setUpgradeSub(null)}
                  className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs"
                >
                  Confirm Plan Switch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 360 Customer Drawer */}
      <CustomerDetailDrawer
        customerId={activeCustomerId}
        onClose={() => setActiveCustomerId(null)}
        onAddSubscription={() => setIsCreateOpen(true)}
        onViewInvoice={(invId) => setSelectedInvoiceId(invId)}
      />

      {/* Invoice Modal */}
      <InvoiceDetailModal
        invoiceId={selectedInvoiceId}
        onClose={() => setSelectedInvoiceId(null)}
        onRecordPayment={() => {}}
      />
    </div>
  );
}

