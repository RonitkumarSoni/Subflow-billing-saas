"use client";

import React, { useEffect, useState } from "react";
import {
  X,
  Building2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Repeat,
  FileText,
  CreditCard,
  Plus,
  AlertCircle,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { CustomerType } from "@/types";

interface CustomerDetailDrawerProps {
  customerId: string | null;
  onClose: () => void;
  onAddSubscription: (customerId: string) => void;
  onViewInvoice: (invoiceId: string) => void;
}

export function CustomerDetailDrawer({
  customerId,
  onClose,
  onAddSubscription,
  onViewInvoice,
}: CustomerDetailDrawerProps) {
  const [customer, setCustomer] = useState<CustomerType | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"subscriptions" | "invoices" | "payments">("subscriptions");

  useEffect(() => {
    if (!customerId) {
      setCustomer(null);
      return;
    }
    const fetchCustomer = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/customers/${customerId}`);
        const data = await res.json();
        setCustomer(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomer();
  }, [customerId]);

  if (!customerId) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl h-full shadow-2xl flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="p-6 border-b border-slate-100 bg-slate-50/70 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white font-bold text-lg flex items-center justify-center shadow-md shadow-indigo-500/20">
              {customer?.name?.substring(0, 2).toUpperCase() || "CU"}
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                {customer?.name || "Loading..."}
                {customer?.company && (
                  <span className="text-xs font-normal text-slate-500">
                    ({customer.company})
                  </span>
                )}
              </h2>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 mt-1">
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  {customer?.email}
                </span>
                {customer?.phone && (
                  <span className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    {customer?.phone}
                  </span>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Address & Meta pill */}
        <div className="px-6 py-3 bg-slate-100/60 border-b border-slate-200/80 flex items-center justify-between text-xs text-slate-600">
          <span className="flex items-center gap-1.5 truncate">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            {[customer?.addressLine1, customer?.city, customer?.state, customer?.country]
              .filter(Boolean)
              .join(", ") || "No address specified"}
          </span>
          <span className="text-slate-400 font-mono text-[11px] shrink-0">
            ID: {customer?.id}
          </span>
        </div>

        {/* Nav Tabs */}
        <div className="flex border-b border-slate-200 px-6 gap-6 text-xs font-semibold">
          <button
            onClick={() => setActiveTab("subscriptions")}
            className={`py-3.5 border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === "subscriptions"
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Repeat className="w-3.5 h-3.5" />
            Subscriptions ({customer?.subscriptions?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab("invoices")}
            className={`py-3.5 border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === "invoices"
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Invoices ({customer?.invoices?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab("payments")}
            className={`py-3.5 border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === "payments"
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            Payments ({customer?.payments?.length || 0})
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {loading ? (
            <div className="py-12 text-center text-xs text-slate-400">Loading details...</div>
          ) : (
            <>
              {/* TAB 1: Subscriptions */}
              {activeTab === "subscriptions" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Active & Past Subscriptions
                    </h4>
                    <button
                      onClick={() => onAddSubscription(customer!.id)}
                      className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors border border-indigo-200/60"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add Subscription
                    </button>
                  </div>

                  {!customer?.subscriptions || customer.subscriptions.length === 0 ? (
                    <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200 text-xs text-slate-500">
                      No subscriptions found for this customer.
                    </div>
                  ) : (
                    customer.subscriptions.map((sub) => {
                      const statusColor =
                        sub.status === "ACTIVE"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : sub.status === "PAST_DUE"
                          ? "bg-amber-50 text-amber-700 border-amber-200"
                          : sub.status === "PAUSED"
                          ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                          : "bg-slate-100 text-slate-600 border-slate-200";

                      return (
                        <div
                          key={sub.id}
                          className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3"
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="flex items-center gap-2">
                                <h5 className="font-bold text-slate-900 text-sm">
                                  {sub.plan?.name || "Subscription Plan"}
                                </h5>
                                <span
                                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusColor}`}
                                >
                                  {sub.status}
                                </span>
                              </div>
                              <p className="text-xs text-slate-500 mt-0.5">
                                ₹{sub.plan?.price.toLocaleString("en-IN")} / {sub.plan?.interval.toLowerCase()}
                              </p>
                            </div>
                            <span className="text-[11px] font-mono text-slate-400">
                              {sub.id}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-lg border border-slate-100">
                            <div>
                              <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                                Started
                              </span>
                              <span className="text-slate-700 font-medium">
                                {new Date(sub.startDate).toLocaleDateString("en-IN", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                })}
                              </span>
                            </div>
                            <div>
                              <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                                Next Billing
                              </span>
                              <span className="text-slate-700 font-medium">
                                {new Date(sub.nextBillingDate).toLocaleDateString("en-IN", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                })}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              )}

              {/* TAB 2: Invoices */}
              {activeTab === "invoices" && (
                <div className="space-y-3">
                  {!customer?.invoices || customer.invoices.length === 0 ? (
                    <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200 text-xs text-slate-500">
                      No invoices recorded.
                    </div>
                  ) : (
                    customer.invoices.map((inv) => {
                      const statusBadge =
                        inv.status === "PAID"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : inv.status === "OVERDUE"
                          ? "bg-rose-50 text-rose-700 border-rose-200"
                          : "bg-amber-50 text-amber-700 border-amber-200";

                      return (
                        <div
                          key={inv.id}
                          onClick={() => onViewInvoice(inv.id)}
                          className="bg-white p-3.5 rounded-xl border border-slate-200 hover:border-indigo-300 hover:shadow-xs transition-all cursor-pointer flex items-center justify-between"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                              <FileText className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-xs text-slate-900 font-mono">
                                  {inv.invoiceNumber}
                                </span>
                                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${statusBadge}`}>
                                  {inv.status}
                                </span>
                              </div>
                              <span className="text-[11px] text-slate-400">
                                Due: {new Date(inv.dueDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="font-bold text-xs text-slate-900">
                              ₹{inv.total.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                            </span>
                            <span className="block text-[10px] text-indigo-600 hover:underline">
                              View PDF &rarr;
                            </span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              )}

              {/* TAB 3: Payments */}
              {activeTab === "payments" && (
                <div className="space-y-3">
                  {!customer?.payments || customer.payments.length === 0 ? (
                    <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200 text-xs text-slate-500">
                      No payments recorded yet.
                    </div>
                  ) : (
                    customer.payments.map((p) => {
                      const isSuccess = p.status === "SUCCESS";
                      return (
                        <div
                          key={p.id}
                          className="bg-white p-3.5 rounded-xl border border-slate-200 flex items-center justify-between"
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                isSuccess ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                              }`}
                            >
                              {isSuccess ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-xs text-slate-900">
                                  {p.paymentMethod.replace("_", " ")}
                                </span>
                                <span
                                  className={`text-[10px] font-semibold px-1.5 py-0.2 rounded border ${
                                    isSuccess
                                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                      : "bg-rose-50 text-rose-700 border-rose-200"
                                  }`}
                                >
                                  {p.status}
                                </span>
                              </div>
                              <span className="text-[11px] text-slate-400 font-mono">
                                {p.transactionId} • {new Date(p.paidAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <span
                            className={`font-bold text-xs ${
                              isSuccess ? "text-slate-900" : "text-slate-400 line-through"
                            }`}
                          >
                            ₹{p.amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

