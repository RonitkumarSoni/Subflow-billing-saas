import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const invoices = db.getInvoices();
    return NextResponse.json(invoices);
  } catch (error) {
    console.error("Invoices error:", error);
    return NextResponse.json({ error: "Failed to fetch invoices" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.customerId || !body.items || body.items.length === 0) {
      return NextResponse.json({ error: "customerId and at least 1 item are required" }, { status: 400 });
    }
    const invoice = db.createInvoice(body);
    return NextResponse.json(invoice, { status: 201 });
  } catch (error) {
    console.error("Create invoice error:", error);
    return NextResponse.json({ error: "Failed to create invoice" }, { status: 500 });
  }
}

