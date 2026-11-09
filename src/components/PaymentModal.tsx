"use client";

import React, { useState, useEffect } from "react";
import { X, CreditCard, Check, AlertCircle, RefreshCw } from "lucide-react";
import { InvoiceType, PaymentMethod, PaymentStatus } from "@/types";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  defaultInvoiceId?: string;
}

export function PaymentModal({
  isOpen,
  onClose,
  onSuccess,
  defaultInvoiceId,
}: PaymentModalProps) {
  const [invoices, setInvoices] = useState<InvoiceType[]>([]);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(defaultInvoiceId || "");
  const [method, setMethod] = useState<PaymentMethod>("CREDIT_CARD");
  const [status, setStatus] = useState<PaymentStatus>("SUCCESS");
  const [failureReason, setFailureReason] = useState("Card declined by bank: Insufficient balance");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    if (defaultInvoiceId) setSelectedInvoiceId(defaultInvoiceId);

    const loadInvoices = async () => {
      try {
        const res = await fetch("/api/invoices");
        const data = await res.json();
        const payable = data.filter((i: InvoiceType) => i.status !== "PAID");
        setInvoices(payable);
        if (!selectedInvoiceId && payable.length > 0) {
          setSelectedInvoiceId(payable[0].id);
        }
      } catch (err) {
        console.error(err);
      }
    };
    loadInvoices();
  }, [isOpen, defaultInvoiceId]);

  if (!isOpen) return null;

  const selectedInvoice = invoices.find((i) => i.id === selectedInvoiceId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInvoiceId) {
      setError("Please select an invoice to record payment against.");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invoiceId: selectedInvoiceId,
          paymentMethod: method,
          status,
          failureReason: status === "FAILED" ? failureReason : undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Payment recording failed");

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200/80 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <CreditCard className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">Record / Simulate Payment</h3>
              <p className="text-xs text-slate-500">Simulate incoming transaction against an invoice</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 text-xs rounded-lg bg-rose-50 text-rose-700 border border-rose-200">
              {error}
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Select Unpaid Invoice *</label>
            <select
              value={selectedInvoiceId}
              onChange={(e) => setSelectedInvoiceId(e.target.value)}
              className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">-- Choose Invoice --</option>
              {invoices.map((inv) => (
                <option key={inv.id} value={inv.id}>
                  {inv.invoiceNumber} • {inv.customer?.name} - ₹{inv.total.toLocaleString("en-IN")} ({inv.status})
                </option>
              ))}
            </select>
          </div>

          {selectedInvoice && (
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs flex justify-between items-center">
              <div>
                <span className="text-slate-500 block">Total Payable</span>
                <span className="font-bold text-sm text-slate-900">
                  ₹{selectedInvoice.total.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </span>
              </div>
              <span className="font-semibold text-indigo-600 font-mono text-xs">
                {selectedInvoice.invoiceNumber}
              </span>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Payment Gateway / Method</label>
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value as PaymentMethod)}
              className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 bg-white"
            >
              <option value="CREDIT_CARD">Credit / Debit Card</option>
              <option value="UPI">UPI (GooglePay / PhonePe / Paytm)</option>
              <option value="BANK_TRANSFER">Direct Bank Transfer / NEFT</option>
              <option value="STRIPE_SIMULATION">Stripe Simulation Hook</option>
              <option value="CASH">Offline Cheque / Cash</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Simulated Outcome</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setStatus("SUCCESS")}
                className={`py-2 px-3 text-xs font-bold rounded-lg border transition-all ${
                  status === "SUCCESS"
                    ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                }`}
              >
                Success
              </button>
              <button
                type="button"
                onClick={() => setStatus("PENDING")}
                className={`py-2 px-3 text-xs font-bold rounded-lg border transition-all ${
                  status === "PENDING"
                    ? "bg-amber-500 text-white border-amber-500 shadow-sm"
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                }`}
              >
                Pending
              </button>
              <button
                type="button"
                onClick={() => setStatus("FAILED")}
                className={`py-2 px-3 text-xs font-bold rounded-lg border transition-all ${
                  status === "FAILED"
                    ? "bg-rose-600 text-white border-rose-600 shadow-sm"
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                }`}
              >
                Failed
              </button>
            </div>
          </div>

          {status === "FAILED" && (
            <div className="space-y-1">
              <label className="text-xs font-semibold text-rose-700">Failure Reason</label>
              <input
                type="text"
                value={failureReason}
                onChange={(e) => setFailureReason(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-lg border border-rose-300 bg-rose-50/50 text-rose-900"
              />
            </div>
          )}

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm shadow-indigo-500/30 transition-all disabled:opacity-50"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{loading ? "Recording..." : "Confirm Payment"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

