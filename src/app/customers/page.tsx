"use client";

export const dynamic = "force-dynamic";

import React, { useEffect, useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { CustomerModal } from "@/components/CustomerModal";
import { CustomerDetailDrawer } from "@/components/CustomerDetailDrawer";
import { SubscriptionModal } from "@/components/SubscriptionModal";
import { InvoiceDetailModal } from "@/components/InvoiceDetailModal";
import {
  Users,
  Search,
  Plus,
  Mail,
  Phone,
  Building2,
  MapPin,
  ExternalLink,
  Edit2,
  Trash2,
  Repeat,
  FileText,
} from "lucide-react";
import { CustomerType } from "@/types";

export default function CustomersPage() {
  const [customers, setCustomers] = useState<CustomerType[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Modals state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<CustomerType | null>(null);
  const [activeCustomerId, setActiveCustomerId] = useState<string | null>(null);
  const [subCustomerId, setSubCustomerId] = useState<string | null>(null);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const url = search ? `/api/customers?search=${encodeURIComponent(search)}` : "/api/customers";
      const res = await fetch(url);
      const data = await res.json();
      setCustomers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [search]);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete customer "${name}" and all associated records?`)) {
      return;
    }
    try {
      await fetch(`/api/customers/${id}`, { method: "DELETE" });
      fetchCustomers();
    } catch (e) {
      alert("Delete failed");
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0 bg-slate-50">
        <Header
          title="Customer Management"
          subtitle="Directory of subscriber accounts, billing addresses and 360° records"
          onRefresh={fetchCustomers}
        >
          <button
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm shadow-indigo-500/20 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Customer</span>
          </button>
        </Header>

        <div className="p-8 space-y-6 flex-1">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by name, email, company, or city..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full text-xs pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white shadow-2xs focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="text-xs text-slate-500 font-medium">
              Showing <strong>{customers.length}</strong> registered customer profiles
            </div>
          </div>

          {/* Customer Cards Grid */}
          {loading ? (
            <div className="py-20 text-center text-xs text-slate-400">Loading customers...</div>
          ) : customers.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-slate-200 text-xs text-slate-500">
              <Users className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="font-semibold text-slate-700">No customers found</p>
              <p className="text-slate-400 mt-1">Try adjusting your search or add a new customer.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {customers.map((c) => (
                <div
                  key={c.id}
                  className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-indigo-600 text-white font-bold text-sm flex items-center justify-center shadow-xs">
                          {c.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm leading-snug">{c.name}</h4>
                          {c.company && (
                            <p className="text-xs text-slate-500 font-medium">{c.company}</p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setEditingCustomer(c)}
                          title="Edit Customer"
                          className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(c.id, c.name)}
                          title="Delete Customer"
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-600 mb-4">
                      <div className="flex items-center gap-2 truncate">
                        <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{c.email}</span>
                      </div>
                      {c.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{c.phone}</span>
                        </div>
                      )}
                      {(c.city || c.country) && (
                        <div className="flex items-center gap-2 truncate text-slate-500">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">
                            {[c.city, c.state, c.country].filter(Boolean).join(", ")}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Footer Counts & 360 Action */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3 text-slate-500">
                      <span className="flex items-center gap-1" title="Subscriptions">
                        <Repeat className="w-3 h-3 text-indigo-500" />
                        <strong>{c._count?.subscriptions || 0}</strong>
                      </span>
                      <span className="flex items-center gap-1" title="Invoices">
                        <FileText className="w-3 h-3 text-slate-400" />
                        <strong>{c._count?.invoices || 0}</strong>
                      </span>
                    </div>

                    <button
                      onClick={() => setActiveCustomerId(c.id)}
                      className="font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors"
                    >
                      <span>360° Profile</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Modals */}
      <CustomerModal
        isOpen={isCreateOpen || !!editingCustomer}
        onClose={() => {
          setIsCreateOpen(false);
          setEditingCustomer(null);
        }}
        onSuccess={fetchCustomers}
        customer={editingCustomer}
      />

      <CustomerDetailDrawer
        customerId={activeCustomerId}
        onClose={() => setActiveCustomerId(null)}
        onAddSubscription={(custKey) => setSubCustomerId(custKey)}
        onViewInvoice={(invId) => setSelectedInvoiceId(invId)}
      />

      <SubscriptionModal
        isOpen={!!subCustomerId}
        onClose={() => setSubCustomerId(null)}
        onSuccess={fetchCustomers}
        defaultCustomerId={subCustomerId || undefined}
      />

      <InvoiceDetailModal
        invoiceId={selectedInvoiceId}
        onClose={() => setSelectedInvoiceId(null)}
        onRecordPayment={() => {}}
      />
    </div>
  );
}

