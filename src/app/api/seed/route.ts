import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST() {
  try {
    const data = db.resetAndSeed();
    return NextResponse.json({
      success: true,
      message: "Database reset and seeded with realistic demo SaaS records!",
      stats: {
        customers: data.customers.length,
        products: data.products.length,
        subscriptions: data.subscriptions.length,
        invoices: data.invoices.length,
        payments: data.payments.length,
      },
    });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json({ error: "Failed to reset and seed" }, { status: 500 });
  }
}

