"use client";

import React, { useState, useEffect } from "react";
import { X, Repeat, Check } from "lucide-react";
import { CustomerType, ProductType, PlanType } from "@/types";

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  defaultCustomerId?: string;
}

export function SubscriptionModal({
  isOpen,
  onClose,
  onSuccess,
  defaultCustomerId,
}: SubscriptionModalProps) {
  const [customers, setCustomers] = useState<CustomerType[]>([]);
  const [products, setProducts] = useState<ProductType[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState(defaultCustomerId || "");
  const [selectedPlanId, setSelectedPlanId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    if (defaultCustomerId) setSelectedCustomerId(defaultCustomerId);

    const loadData = async () => {
      try {
        const [custRes, prodRes] = await Promise.all([
          fetch("/api/customers"),
          fetch("/api/products"),
        ]);
        const custData = await custRes.json();
        const prodData = await prodRes.json();
        setCustomers(custData);
        setProducts(prodData);

        if (!selectedCustomerId && custData.length > 0) {
          setSelectedCustomerId(custData[0].id);
        }

        // Set default plan
        const allPlans: PlanType[] = prodData.flatMap((p: ProductType) => p.plans || []);
        const activePlans = allPlans.filter((p) => p.isActive);
        if (activePlans.length > 0 && !selectedPlanId) {
          setSelectedPlanId(activePlans[0].id);
        }
      } catch (err: any) {
        console.error("Failed to load options:", err);
      }
    };

    loadData();
  }, [isOpen, defaultCustomerId]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomerId || !selectedPlanId) {
      setError("Please select both a customer and a subscription plan.");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/subscriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId: selectedCustomerId,
          planId: selectedPlanId,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create subscription");

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const allPlans: PlanType[] = products.flatMap((p) => p.plans || []).filter((p) => p.isActive);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200/80 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <Repeat className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">New Subscription</h3>
              <p className="text-xs text-slate-500">Subscribe a customer to a recurring billing plan</p>
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
            <label className="text-xs font-semibold text-slate-700">Select Customer *</label>
            <select
              value={selectedCustomerId}
              onChange={(e) => setSelectedCustomerId(e.target.value)}
              className="w-full text-sm px-3 py-2 rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
            >
              <option value="">-- Choose Customer --</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} {c.company ? `(${c.company})` : ""} - {c.email}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700">Select Pricing Plan *</label>
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {allPlans.map((plan) => {
                const isSelected = selectedPlanId === plan.id;
                return (
                  <div
                    key={plan.id}
                    onClick={() => setSelectedPlanId(plan.id)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? "border-indigo-600 bg-indigo-50/50 ring-1 ring-indigo-500"
                        : "border-slate-200 hover:border-slate-300 hover:bg-slate-50/50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            isSelected
                              ? "border-indigo-600 bg-indigo-600 text-white"
                              : "border-slate-300 bg-white"
                          }`}
                        >
                          {isSelected && <span className="w-1.5 h-1.5 bg-white rounded-full"></span>}
                        </div>
                        <span className="font-semibold text-xs text-slate-900">{plan.name}</span>
                        <span className="text-[10px] font-medium px-1.5 py-0.2 rounded bg-slate-100 text-slate-600">
                          {plan.interval}
                        </span>
                      </div>
                      <span className="font-bold text-xs text-indigo-600">
                        ₹{plan.price.toLocaleString("en-IN")}
                      </span>
                    </div>
                    {plan.description && (
                      <p className="text-[11px] text-slate-500 mt-1 pl-6">{plan.description}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200/60 text-amber-800 text-xs">
            <span className="font-semibold block mb-0.5">Automated Invoice Generation</span>
            Subscribing will automatically generate an initial pending invoice for this billing cycle.
          </div>

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
              <span>{loading ? "Activating..." : "Activate Subscription"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

