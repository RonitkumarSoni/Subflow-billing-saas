"use client";

import React, { useEffect, useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { PaymentModal } from "@/components/PaymentModal";
import { InvoiceDetailModal } from "@/components/InvoiceDetailModal";
import {
  CreditCard,
  Plus,
  Search,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowDownLeft,
  Filter,
} from "lucide-react";
import { PaymentType } from "@/types";

export default function PaymentsPage() {
  const [payments, setPayments] = useState<PaymentType[]>([]);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/payments");
      const data = await res.json();
      setPayments(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const filtered = payments.filter((p) => {
    const matchesStatus = statusFilter === "ALL" || p.status === statusFilter;
    const matchesSearch =
      !search ||
      p.transactionId.toLowerCase().includes(search.toLowerCase()) ||
      p.customer?.name.toLowerCase().includes(search.toLowerCase()) ||
      p.invoice?.invoiceNumber.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0 bg-slate-50">
        <Header
          title="Payment Records & Gateway Simulation"
          subtitle="Audit transactions, gateway settlement methods and simulated chargebacks"
          onRefresh={fetchPayments}
        >
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm shadow-indigo-500/20 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Record Payment</span>
          </button>
        </Header>

        <div className="p-8 space-y-6 flex-1">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="flex items-center gap-1.5 p-1 bg-slate-200/70 rounded-xl text-xs font-semibold">
              {["ALL", "SUCCESS", "PENDING", "FAILED"].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    statusFilter === st
                      ? "bg-white text-slate-900 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search txn ID or customer..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full text-xs pl-9 pr-4 py-2 rounded-xl border border-slate-200 bg-white shadow-2xs focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Payments Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100/70 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
                  <th className="py-3.5 px-5">Transaction ID</th>
                  <th className="py-3.5 px-5">Billed Account</th>
                  <th className="py-3.5 px-5">Invoice #</th>
                  <th className="py-3.5 px-5">Method</th>
                  <th className="py-3.5 px-5">Amount</th>
                  <th className="py-3.5 px-5">Timestamp</th>
                  <th className="py-3.5 px-5 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400">
                      Loading payment logs...
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400">
                      No transactions recorded.
                    </td>
                  </tr>
                ) : (
                  filtered.map((p) => {
                    const isSuccess = p.status === "SUCCESS";
                    const isFailed = p.status === "FAILED";

                    return (
                      <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-4 px-5">
                          <span className="font-mono font-bold text-slate-900 block">
                            {p.transactionId}
                          </span>
                          {p.failureReason && (
                            <span className="text-[10px] text-rose-600 block mt-0.5">
                              {p.failureReason}
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-5">
                          <span className="font-semibold text-slate-900 block">
                            {p.customer?.name}
                          </span>
                          <span className="text-[11px] text-slate-400">{p.customer?.email}</span>
                        </td>
                        <td className="py-4 px-5">
                          <button
                            onClick={() => setSelectedInvoiceId(p.invoiceId)}
                            className="font-mono font-bold text-indigo-600 hover:underline"
                          >
                            {p.invoice?.invoiceNumber || "View Invoice"}
                          </button>
                        </td>
                        <td className="py-4 px-5">
                          <span className="font-medium text-slate-700 capitalize">
                            {p.paymentMethod.replace("_", " ").toLowerCase()}
                          </span>
                        </td>
                        <td className="py-4 px-5">
                          <span
                            className={`font-bold ${
                              isSuccess
                                ? "text-slate-900"
                                : isFailed
                                ? "text-slate-400 line-through"
                                : "text-amber-800"
                            }`}
                          >
                            ₹{p.amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                          </span>
                        </td>
                        <td className="py-4 px-5 text-slate-600">
                          {new Date(p.paidAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </td>
                        <td className="py-4 px-5 text-right">
                          <span
                            className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                              isSuccess
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : isFailed
                                ? "bg-rose-50 text-rose-700 border-rose-200"
                                : "bg-amber-50 text-amber-700 border-amber-200"
                            }`}
                          >
                            {isSuccess ? (
                              <CheckCircle2 className="w-3 h-3" />
                            ) : (
                              <AlertCircle className="w-3 h-3" />
                            )}
                            {p.status}
                          </span>
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

      {/* Record Payment Modal */}
      <PaymentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchPayments}
      />

      {/* Invoice Detail / PDF Modal */}
      <InvoiceDetailModal
        invoiceId={selectedInvoiceId}
        onClose={() => setSelectedInvoiceId(null)}
        onRecordPayment={() => {}}
      />
    </div>
  );
}

