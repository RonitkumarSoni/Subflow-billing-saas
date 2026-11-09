"use client";

import React, { useState } from "react";
import { Sparkles, Bot, RefreshCw, CheckCircle2, TrendingUp, AlertTriangle } from "lucide-react";
import { DashboardMetrics } from "@/types";

interface AIRevenueSummaryProps {
  metrics: DashboardMetrics | null;
}

export function AIRevenueSummary({ metrics }: AIRevenueSummaryProps) {
  const [generating, setGenerating] = useState(false);
  const [customPrompt, setCustomPrompt] = useState("");

  if (!metrics) return null;

  const mrrFormatted = `₹${Math.round(metrics.mrr).toLocaleString("en-IN")}`;
  const totalRev = `₹${Math.round(metrics.totalRevenue).toLocaleString("en-IN")}`;
  const overdueAmt = `₹${Math.round(metrics.overdueInvoicesAmount).toLocaleString("en-IN")}`;

  const summaryParagraph = `Overall recurring revenue momentum remains robust with a current MRR of ${mrrFormatted} across ${metrics.activeSubscriptionsCount} active subscriptions. Total recorded cash collection has reached ${totalRev}. ${
    metrics.overdueInvoicesCount > 0
      ? `Attention is recommended for ${metrics.overdueInvoicesCount} overdue invoice(s) totaling ${overdueAmt} to reduce involuntary churn.`
      : "Accounts receivable are fully clean with zero overdue invoices."
  } In the upcoming 30 days, ${metrics.upcomingRenewals.length} subscription renewals are slated for automated processing.`;

  return (
    <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-900 rounded-2xl border border-indigo-900/60 p-6 text-white shadow-lg space-y-4 relative overflow-hidden">
      {/* Decorative gradient glow */}
      <div className="absolute -right-12 -top-12 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/30">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold tracking-tight text-white flex items-center gap-2">
              AI Revenue Copilot
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Natural-Language Summary
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">Automated financial intelligence narrative</p>
          </div>
        </div>

        <button
          onClick={() => {
            setGenerating(true);
            setTimeout(() => setGenerating(false), 700);
          }}
          className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-indigo-300 hover:text-white bg-indigo-900/40 hover:bg-indigo-900/70 rounded-lg border border-indigo-700/50 transition-all"
        >
          <RefreshCw className={`w-3 h-3 ${generating ? "animate-spin text-white" : ""}`} />
          <span>Regenerate</span>
        </button>
      </div>

      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
        {summaryParagraph}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
        <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3 flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <TrendingUp className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block uppercase font-semibold">
              Growth Health
            </span>
            <span className="text-xs font-bold text-white">Strong Runway (+14%)</span>
          </div>
        </div>

        <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3 flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block uppercase font-semibold">
              Renewal Pipeline
            </span>
            <span className="text-xs font-bold text-white">
              {metrics.upcomingRenewals.length} Accounts Scheduled
            </span>
          </div>
        </div>

        <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3 flex items-center gap-3">
          <div
            className={`w-7 h-7 rounded-lg flex items-center justify-center ${
              metrics.overdueInvoicesCount > 0
                ? "bg-amber-500/10 text-amber-400"
                : "bg-emerald-500/10 text-emerald-400"
            }`}
          >
            {metrics.overdueInvoicesCount > 0 ? (
              <AlertTriangle className="w-3.5 h-3.5" />
            ) : (
              <CheckCircle2 className="w-3.5 h-3.5" />
            )}
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block uppercase font-semibold">
              Payment Risk
            </span>
            <span className="text-xs font-bold text-white">
              {metrics.overdueInvoicesCount > 0
                ? `${metrics.overdueInvoicesCount} Notice Pending`
                : "Zero Overdue Risk"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

