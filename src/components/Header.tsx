"use client";

import React, { useState } from "react";
import { RefreshCw, Plus, CheckCircle2, AlertCircle } from "lucide-react";

interface HeaderProps {
  title: string;
  subtitle?: string;
  onRefresh?: () => void;
  children?: React.ReactNode;
}

export function Header({ title, subtitle, onRefresh, children }: HeaderProps) {
  const [isSeeding, setIsSeeding] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleResetSeed = async () => {
    if (!confirm("Reset database to fresh realistic demo state?")) return;
    setIsSeeding(true);
    setStatusMessage(null);
    try {
      const res = await fetch("/api/seed", { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        setStatusMessage("Demo data reloaded!");
        setTimeout(() => setStatusMessage(null), 3000);
        if (onRefresh) onRefresh();
        else window.location.reload();
      } else {
        alert("Seed failed: " + data.error);
      }
    } catch (e: any) {
      alert("Error: " + e.message);
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <header className="no-print h-16 border-b border-slate-200/80 bg-white/80 backdrop-blur-md sticky top-0 z-30 px-8 flex items-center justify-between">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-slate-900">{title}</h1>
        {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-3">
        {statusMessage && (
          <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" />
            {statusMessage}
          </span>
        )}

        {/* 1-Click Seed Button */}
        <button
          onClick={handleResetSeed}
          disabled={isSeeding}
          title="Reload realistic demo records"
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors border border-slate-200"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isSeeding ? "animate-spin text-indigo-600" : ""}`} />
          <span>{isSeeding ? "Resetting..." : "Reset / Seed Demo"}</span>
        </button>

        {children}
      </div>
    </header>
  );
}

