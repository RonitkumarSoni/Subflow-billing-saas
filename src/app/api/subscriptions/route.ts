import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const subscriptions = db.getSubscriptions();
    return NextResponse.json(subscriptions);
  } catch (error) {
    console.error("Subscriptions error:", error);
    return NextResponse.json({ error: "Failed to fetch subscriptions" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.customerId || !body.planId) {
      return NextResponse.json({ error: "customerId and planId are required" }, { status: 400 });
    }
    const result = db.createSubscription(body.customerId, body.planId);
    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    console.error("Create subscription error:", error);
    return NextResponse.json({ error: error.message || "Failed to create subscription" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.id || !body.action) {
      return NextResponse.json({ error: "Subscription id and action are required" }, { status: 400 });
    }
    const updated = db.updateSubscription(body.id, body.action, body.newPlanId, body.cancelReason);
    if (!updated) {
      return NextResponse.json({ error: "Subscription not found" }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch (error: any) {
    console.error("Update subscription error:", error);
    return NextResponse.json({ error: error.message || "Failed to update subscription" }, { status: 500 });
  }
}

