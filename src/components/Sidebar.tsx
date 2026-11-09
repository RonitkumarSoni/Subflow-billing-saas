"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Package,
  Repeat,
  FileText,
  CreditCard,
  Sparkles,
  Zap,
} from "lucide-react";

const navItems = [
  { name: "Overview", href: "/", icon: LayoutDashboard },
  { name: "Customers", href: "/customers", icon: Users },
  { name: "Products & Plans", href: "/products", icon: Package },
  { name: "Subscriptions", href: "/subscriptions", icon: Repeat },
  { name: "Invoices", href: "/invoices", icon: FileText },
  { name: "Payments", href: "/payments", icon: CreditCard },
  { name: "Public Pricing", href: "/pricing", icon: Sparkles },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="no-print w-64 bg-slate-900 border-r border-slate-800 flex flex-col shrink-0 h-screen sticky top-0 overflow-hidden text-slate-300 select-none">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-6 gap-3 border-b border-slate-800/80 shrink-0">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 via-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white font-bold text-lg">
          <Zap className="w-5 h-5 fill-white text-white" />
        </div>
        <div>
          <span className="font-bold text-base tracking-tight text-white flex items-center gap-1.5">
            SubFlow <span className="text-[10px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">SaaS</span>
          </span>
          <p className="text-[11px] text-slate-400">Billing & Subscriptions</p>
        </div>
      </div>

      {/* Navigation Links (Fits in viewport without scrolling) */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-hidden flex flex-col justify-start">
        <div className="px-3 pb-2 text-[11px] font-medium uppercase tracking-wider text-slate-500">
          Core Workflows
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                isActive
                  ? "bg-indigo-600 text-white shadow-sm shadow-indigo-500/25"
                  : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/60"
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-400"}`} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Simulator / Demo Banner (Compact shrink-0) */}
      <div className="p-3.5 m-3 mb-2 rounded-xl bg-gradient-to-b from-slate-800 to-slate-850 border border-slate-750 shrink-0">
        <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Interactive Showcase</span>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed mb-2">
          Simulate subscription lifecycles, upgrades, PDF invoices & payments.
        </p>
        <div className="text-[10px] text-slate-500 font-mono">
          Engine: Postgres / Prisma
        </div>
      </div>

      {/* User / Org Footer */}
      <div className="p-3.5 px-4 border-t border-slate-800 flex items-center gap-3 shrink-0">
        <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-semibold text-xs text-indigo-400 shrink-0">
          AC
        </div>
        <div className="overflow-hidden">
          <p className="text-xs font-medium text-slate-200 truncate">Acme Cloud Corp</p>
          <p className="text-[11px] text-slate-400 truncate">billing@acmecloud.io</p>
        </div>
      </div>
    </aside>
  );
}
