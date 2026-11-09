import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SubFlow | Modern Subscription & Billing SaaS",
  description:
    "Enterprise-grade subscription lifecycle, recurring billing, multi-tier pricing, invoice PDF generation, and revenue analytics platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-slate-50 text-slate-900 selection:bg-indigo-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
