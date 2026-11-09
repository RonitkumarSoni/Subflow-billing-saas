"use client";

import React, { useEffect, useState } from "react";
import {
  X,
  Printer,
  Download,
  CreditCard,
  Building,
  CheckCircle2,
  Clock,
  AlertCircle,
  Zap,
} from "lucide-react";
import { InvoiceType } from "@/types";

interface InvoiceDetailModalProps {
  invoiceId: string | null;
  onClose: () => void;
  onRecordPayment: (invoiceId: string) => void;
}

export function InvoiceDetailModal({
  invoiceId,
  onClose,
  onRecordPayment,
}: InvoiceDetailModalProps) {
  const [invoice, setInvoice] = useState<InvoiceType | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!invoiceId) {
      setInvoice(null);
      return;
    }

    const fetchInvoice = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/invoices/${invoiceId}`);
        const data = await res.json();
        setInvoice(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchInvoice();
  }, [invoiceId]);

  if (!invoiceId) return null;

  const handlePrint = () => {
    window.print();
  };

  const isPaid = invoice?.status === "PAID";
  const isOverdue = invoice?.status === "OVERDUE";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200/80 w-full max-w-3xl my-8 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Top Control Bar (Hidden when printing) */}
        <div className="no-print flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-3">
            <span className="font-mono text-sm font-bold text-slate-800">
              {invoice?.invoiceNumber || "Loading..."}
            </span>
            {invoice && (
              <span
                className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                  isPaid
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : isOverdue
                    ? "bg-rose-50 text-rose-700 border-rose-200"
                    : "bg-amber-50 text-amber-700 border-amber-200"
                }`}
              >
                {invoice.status}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {!isPaid && invoice && (
              <button
                onClick={() => onRecordPayment(invoice.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs shadow-indigo-500/20 transition-all"
              >
                <CreditCard className="w-3.5 h-3.5" />
                Simulate Payment
              </button>
            )}

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Download PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Document Body */}
        {loading || !invoice ? (
          <div className="p-16 text-center text-xs text-slate-400">Loading invoice document...</div>
        ) : (
          <div className="p-8 sm:p-12 space-y-8 bg-white invoice-printable text-slate-800">
            {/* Header / Brand */}
            <div className="flex justify-between items-start border-b border-slate-200 pb-8">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold">
                    <Zap className="w-4 h-4 fill-white" />
                  </div>
                  <span className="text-xl font-extrabold text-slate-900 tracking-tight">
                    SubFlow Cloud Technologies
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Global Billing & SaaS Infrastructure Suite<br />
                  GSTIN: 29AABCU9603R1ZM<br />
                  support@subflowbilling.io • www.subflowbilling.io
                </p>
              </div>

              <div className="text-right">
                <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase">
                  Tax Invoice
                </h2>
                <p className="font-mono text-sm font-semibold text-indigo-600 mt-1">
                  #{invoice.invoiceNumber}
                </p>
                <div className="mt-3 text-xs text-slate-500 space-y-0.5">
                  <p>
                    <span className="font-medium text-slate-700">Issue Date:</span>{" "}
                    {new Date(invoice.issueDate).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                  <p>
                    <span className="font-medium text-slate-700">Due Date:</span>{" "}
                    {new Date(invoice.dueDate).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* Billed To / Client Meta */}
            <div className="grid grid-cols-2 gap-8 text-xs">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Billed To
                </span>
                <p className="font-bold text-sm text-slate-900">{invoice.customer?.name}</p>
                {invoice.customer?.company && (
                  <p className="font-medium text-slate-700">{invoice.customer.company}</p>
                )}
                <p className="text-slate-500 mt-1 leading-relaxed">
                  {[
                    invoice.customer?.addressLine1,
                    invoice.customer?.city,
                    invoice.customer?.state,
                    invoice.customer?.postalCode,
                    invoice.customer?.country,
                  ]
                    .filter(Boolean)
                    .join(", ")}
                </p>
                <p className="text-slate-500 mt-1">{invoice.customer?.email}</p>
                {invoice.customer?.phone && (
                  <p className="text-slate-500">{invoice.customer?.phone}</p>
                )}
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Payment Status
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full border ${
                        isPaid
                          ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                          : isOverdue
                          ? "bg-rose-100 text-rose-800 border-rose-300"
                          : "bg-amber-100 text-amber-800 border-amber-300"
                      }`}
                    >
                      {invoice.status}
                    </span>
                    {invoice.paidAt && (
                      <span className="text-[11px] text-slate-500">
                        Paid on {new Date(invoice.paidAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200 mt-3 text-[11px] text-slate-500">
                  Currency: <strong className="text-slate-800">{invoice.currency} (INR ₹)</strong>
                </div>
              </div>
            </div>

            {/* Line Items Table */}
            <div className="overflow-hidden rounded-xl border border-slate-200">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200">
                    <th className="py-3 px-4">Item & Description</th>
                    <th className="py-3 px-4 text-center w-20">Qty</th>
                    <th className="py-3 px-4 text-right w-28">Rate</th>
                    <th className="py-3 px-4 text-right w-28">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {invoice.items.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50">
                      <td className="py-3.5 px-4 font-medium text-slate-900">{item.description}</td>
                      <td className="py-3.5 px-4 text-center text-slate-600">{item.quantity}</td>
                      <td className="py-3.5 px-4 text-right text-slate-600">
                        ₹{item.unitPrice.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-3.5 px-4 text-right font-semibold text-slate-900">
                        ₹{item.amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Total Summary */}
            <div className="flex justify-end">
              <div className="w-72 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal:</span>
                  <span className="font-semibold text-slate-900">
                    ₹{invoice.subtotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </span>
                </div>
                {invoice.discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Discount ({invoice.discountRate}%):</span>
                    <span>-₹{invoice.discountAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-600">
                  <span>GST / Tax ({invoice.taxRate}%):</span>
                  <span>+₹{invoice.taxAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-base font-extrabold text-slate-900 pt-3 border-t border-slate-200">
                  <span>Total Due:</span>
                  <span className="text-indigo-600">
                    ₹{invoice.total.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>

            {/* Notes / Footer */}
            {invoice.notes && (
              <div className="pt-6 border-t border-slate-200 text-xs text-slate-500">
                <span className="font-bold text-slate-700 block mb-0.5">Notes & Instructions:</span>
                <p className="leading-relaxed">{invoice.notes}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

