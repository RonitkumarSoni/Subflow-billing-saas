import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const payments = db.getPayments();
    return NextResponse.json(payments);
  } catch (error) {
    console.error("Payments error:", error);
    return NextResponse.json({ error: "Failed to fetch payments" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.invoiceId || !body.paymentMethod || !body.status) {
      return NextResponse.json({ error: "invoiceId, paymentMethod, and status are required" }, { status: 400 });
    }
    const result = db.recordPayment(body);
    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    console.error("Record payment error:", error);
    return NextResponse.json({ error: error.message || "Failed to record payment" }, { status: 500 });
  }
}

