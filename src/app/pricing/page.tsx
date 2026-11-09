"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Zap, Check, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { ProductType, PlanType } from "@/types";

export default function PublicPricingPage() {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [billingCycle, setBillingCycle] = useState<"MONTHLY" | "YEARLY">("MONTHLY");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const saasProduct = products[0];
  const plans = saasProduct?.plans || [];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Top Navbar */}
      <header className="border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-md sticky top-0 z-40 px-6 sm:px-12 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white font-bold">
            <Zap className="w-4 h-4 fill-white" />
          </div>
          <span className="font-bold text-lg tracking-tight text-white">SubFlow</span>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="text-xs font-semibold text-slate-300 hover:text-white transition-colors"
          >
            Admin Dashboard
          </Link>
          <Link
            href="/"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-sm shadow-indigo-500/30 transition-all"
          >
            <span>Live Workspace</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-20 pb-12 px-6 text-center max-w-4xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Simple, Transparent Developer Pricing</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
          Scale your recurring subscription billing without friction.
        </h1>
        <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Manage subscribers, issue tax-compliant B2B invoices, simulate payments, and track MRR growth with one unified system.
        </p>

        {/* Billing cycle switch */}
        <div className="pt-6 flex items-center justify-center gap-3 text-xs font-semibold">
          <button
            onClick={() => setBillingCycle("MONTHLY")}
            className={`px-4 py-2 rounded-xl border transition-all ${
              billingCycle === "MONTHLY"
                ? "bg-indigo-600 text-white border-indigo-500 shadow-sm"
                : "bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200"
            }`}
          >
            Monthly Billing
          </button>
          <button
            onClick={() => setBillingCycle("YEARLY")}
            className={`px-4 py-2 rounded-xl border transition-all flex items-center gap-1.5 ${
              billingCycle === "YEARLY"
                ? "bg-indigo-600 text-white border-indigo-500 shadow-sm"
                : "bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200"
            }`}
          >
            <span>Annual Billing</span>
            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              Save 20%
            </span>
          </button>
        </div>
      </section>

      {/* Pricing Cards Grid */}
      <main className="max-w-6xl mx-auto px-6 pb-24 grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
        {loading ? (
          <div className="col-span-3 py-20 text-center text-xs text-slate-500">
            Loading pricing tiers...
          </div>
        ) : (
          plans.map((plan) => {
            const isPopular = plan.name.toLowerCase().includes("pro");
            const price =
              billingCycle === "YEARLY" && plan.interval === "MONTHLY"
                ? Math.round(plan.price * 10)
                : plan.price;

            return (
              <div
                key={plan.id}
                className={`rounded-2xl p-8 border flex flex-col justify-between transition-all duration-200 ${
                  isPopular
                    ? "bg-slate-900/90 border-indigo-500 ring-1 ring-indigo-500/60 shadow-2xl shadow-indigo-500/10 scale-102"
                    : "bg-slate-900/50 border-slate-800 hover:border-slate-700"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-base text-white">{plan.name}</span>
                    {isPopular && (
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                        Most Popular
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mb-6 min-h-[32px]">{plan.description}</p>

                  <div className="flex items-baseline gap-1 mb-6">
                    <span className="text-4xl font-black text-white">
                      ₹{price.toLocaleString("en-IN")}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      {billingCycle === "YEARLY" ? "/ year" : "/ month"}
                    </span>
                  </div>

                  <div className="space-y-3 pt-6 border-t border-slate-800 mb-8">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                      Features included:
                    </span>
                    {plan.features?.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                        <Check className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Link
                  href="/subscriptions"
                  className={`w-full py-2.5 text-xs font-semibold rounded-xl text-center transition-all ${
                    isPopular
                      ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/25"
                      : "bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700"
                  }`}
                >
                  Subscribe in App
                </Link>
              </div>
            );
          })
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-8 text-center text-xs text-slate-500">
        SubFlow Subscription Billing System • Built with Next.js App Router, PostgreSQL & Prisma
      </footer>
    </div>
  );
}

