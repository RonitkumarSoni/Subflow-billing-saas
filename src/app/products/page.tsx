"use client";

import React, { useEffect, useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { Plus, Check } from "lucide-react";
import Link from "next/link";
import { ProductType } from "@/types";

interface OneTimeProductItem {
  id: string;
  name: string;
  pricingType: string;
  price: number;
  enabled: boolean;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const [billingCycle, setBillingCycle] = useState<"MONTHLY" | "YEARLY">("MONTHLY");

  // One-time products state
  const [oneTimeProducts, setOneTimeProducts] = useState<OneTimeProductItem[]>([
    {
      id: "ot-1",
      name: "Onboarding setup",
      pricingType: "One-time",
      price: 15000,
      enabled: true,
    },
    {
      id: "ot-2",
      name: "Data migration",
      pricingType: "One-time",
      price: 20000,
      enabled: false,
    },
  ]);

  // Modals state
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [planName, setPlanName] = useState("");
  const [planDesc, setPlanDesc] = useState("");
  const [planPrice, setPlanPrice] = useState(2500);
  const [planInterval, setPlanInterval] = useState<"MONTHLY" | "YEARLY">("MONTHLY");
  const [featuresStr, setFeaturesStr] = useState("25 invoices per month\n1 team member\nEmail support");

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleTogglePlan = async (planId: string) => {
    try {
      await fetch("/api/plans", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: planId }),
      });
      fetchProducts();
    } catch (err) {
      alert("Failed to toggle plan status");
    }
  };

  const toggleOneTimeProduct = (id: string) => {
    setOneTimeProducts((prev) =>
      prev.map((item) => (item.id === id ? { ...item, enabled: !item.enabled } : item))
    );
  };

  const handleCreatePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const features = featuresStr
        .split("\n")
        .map((f) => f.trim())
        .filter(Boolean);

      const targetProductId = products[0]?.id || "prod-pulse";

      const res = await fetch("/api/plans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: targetProductId,
          name: planName,
          description: planDesc,
          price: Number(planPrice),
          interval: planInterval,
          features,
        }),
      });
      if (!res.ok) throw new Error("Failed to create plan");
      setIsPlanModalOpen(false);
      setPlanName("");
      setPlanDesc("");
      fetchProducts();
    } catch (e: any) {
      alert(e.message);
    }
  };

  // Find all recurring plans
  const recurringPlans =
    products.flatMap((p) => p.plans || []).filter((p) => p.interval !== "ONE_TIME") || [];

  const defaultCardConfigs: Record<
    string,
    { subscribers: number; isMostPopular?: boolean }
  > = {
    Starter: { subscribers: 62 },
    Growth: { subscribers: 58, isMostPopular: true },
    Scale: { subscribers: 28 },
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0 bg-slate-50">
        <Header
          title="Products & Plans"
          subtitle="Manage what you sell and how it is billed"
          onRefresh={fetchProducts}
        />

        <div className="p-8 space-y-8 flex-1 max-w-7xl">
          {/* Top Control Bar: Title & Toggle + New Plan Button */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">Plans & pricing</h2>
              <p className="text-xs text-slate-500 mt-0.5">Manage what you sell and how it is billed</p>
            </div>

            <div className="flex items-center gap-3">
              {/* Monthly / Yearly Pill Toggle */}
              <div className="bg-slate-200/80 p-1 rounded-xl flex items-center text-xs font-semibold">
                <button
                  onClick={() => setBillingCycle("MONTHLY")}
                  className={`px-4 py-1.5 rounded-lg transition-all ${
                    billingCycle === "MONTHLY"
                      ? "bg-slate-900 text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setBillingCycle("YEARLY")}
                  className={`px-4 py-1.5 rounded-lg transition-all ${
                    billingCycle === "YEARLY"
                      ? "bg-slate-900 text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Yearly
                </button>
              </div>

              {/* + New plan Button (Indigo Brand Color) */}
              <button
                onClick={() => setIsPlanModalOpen(true)}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>New plan</span>
              </button>
            </div>
          </div>

          {/* 3 Tier Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recurringPlans.slice(0, 3).map((plan, index) => {
              const cardName =
                plan.name.includes("Starter")
                  ? "Starter"
                  : plan.name.includes("Growth") || plan.name.includes("Pro")
                  ? "Growth"
                  : "Scale";

              const isMostPopular =
                cardName === "Growth" || plan.name.toLowerCase().includes("pro");
              const subscribers =
                defaultCardConfigs[cardName]?.subscribers || (index === 0 ? 62 : index === 1 ? 58 : 28);

              const displayPrice =
                billingCycle === "YEARLY" ? Math.round(plan.price * 10) : plan.price;

              return (
                <div
                  key={plan.id}
                  className={`bg-white rounded-2xl p-6 border transition-all duration-200 flex flex-col justify-between shadow-2xs ${
                    isMostPopular
                      ? "border-indigo-600/90 ring-1 ring-indigo-600/90 shadow-sm shadow-indigo-500/10"
                      : "border-slate-200/90 hover:border-slate-300"
                  }`}
                >
                  <div>
                    {/* Header: Title + Badges */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-base text-slate-900">{cardName}</h3>
                        {isMostPopular && (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                            Most popular
                          </span>
                        )}
                      </div>

                      <span
                        onClick={() => handleTogglePlan(plan.id)}
                        className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full cursor-pointer transition-colors ${
                          plan.isActive
                            ? "bg-indigo-50 text-indigo-700 border border-indigo-200/80"
                            : "bg-slate-100 text-slate-500 border border-slate-200"
                        }`}
                        title="Click to toggle status"
                      >
                        {plan.isActive ? "Enabled" : "Disabled"}
                      </span>
                    </div>

                    {/* Price Tag */}
                    <div className="flex items-baseline gap-1 my-3">
                      <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
                        ₹{displayPrice.toLocaleString("en-IN")}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">
                        {billingCycle === "YEARLY" ? "/ year" : "/ month"}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-slate-600 leading-relaxed mb-6 min-h-[36px]">
                      {plan.description || "Designed for scaling recurring operations effortlessly."}
                    </p>

                    {/* Features List with Indigo Checkmarks */}
                    <div className="space-y-3 pt-2 mb-6">
                      {plan.features?.slice(0, 4).map((feat, fIdx) => (
                        <div key={fIdx} className="flex items-center gap-2.5 text-xs text-slate-700">
                          <Check className="w-3.5 h-3.5 text-indigo-600 shrink-0 stroke-[2.5]" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Card Footer: Subscribers count + View link */}
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">{subscribers} subscribers</span>
                    <Link
                      href="/subscriptions"
                      className="font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
                    >
                      View
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Section: One-time products Table */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-900">One-time products</h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="text-slate-500 font-medium border-b border-slate-100 bg-slate-50/50">
                    <th className="py-3 px-6">Product</th>
                    <th className="py-3 px-6">Pricing type</th>
                    <th className="py-3 px-6 text-right">Price</th>
                    <th className="py-3 px-6 text-center">Status</th>
                    <th className="py-3 px-6 text-center">Available</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {oneTimeProducts.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-4 px-6 font-semibold text-slate-900">{item.name}</td>
                      <td className="py-4 px-6 text-slate-600">{item.pricingType}</td>
                      <td className="py-4 px-6 text-right font-bold text-slate-900">
                        ₹{item.price.toLocaleString("en-IN")}
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span
                          className={`inline-block text-[10px] font-semibold px-2.5 py-0.5 rounded-full ${
                            item.enabled
                              ? "bg-indigo-50 text-indigo-700 border border-indigo-200"
                              : "bg-slate-100 text-slate-500 border border-slate-200"
                          }`}
                        >
                          {item.enabled ? "Enabled" : "Disabled"}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <input
                          type="checkbox"
                          checked={item.enabled}
                          onChange={() => toggleOneTimeProduct(item.id)}
                          className="w-4 h-4 rounded text-indigo-600 accent-indigo-600 focus:ring-indigo-500 cursor-pointer"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* Plan Modal */}
      {isPlanModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200/80 w-full max-w-md p-6 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="font-bold text-slate-900 text-base mb-1">Add New Plan</h3>
            <p className="text-xs text-slate-500 mb-4">Define pricing tier, billing frequency, and features</p>

            <form onSubmit={handleCreatePlan} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Plan Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Enterprise Tier"
                  value={planName}
                  onChange={(e) => setPlanName(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Price (₹) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={planPrice}
                    onChange={(e) => setPlanPrice(Number(e.target.value))}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Billing Cycle</label>
                  <select
                    value={planInterval}
                    onChange={(e) => setPlanInterval(e.target.value as any)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 bg-white"
                  >
                    <option value="MONTHLY">Monthly</option>
                    <option value="YEARLY">Yearly</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Description</label>
                <input
                  type="text"
                  placeholder="Short description for this plan"
                  value={planDesc}
                  onChange={(e) => setPlanDesc(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">
                  Feature Bullets (1 per line)
                </label>
                <textarea
                  rows={3}
                  value={featuresStr}
                  onChange={(e) => setFeaturesStr(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsPlanModalOpen(false)}
                  className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs"
                >
                  Save Plan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
