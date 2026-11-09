import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.productId || !body.name || body.price === undefined) {
      return NextResponse.json({ error: "productId, name and price are required" }, { status: 400 });
    }
    const plan = db.createPlan({
      productId: body.productId,
      name: body.name,
      description: body.description || "",
      price: Number(body.price),
      interval: body.interval || "MONTHLY",
      features: body.features || [],
      isActive: true,
    });
    return NextResponse.json(plan, { status: 201 });
  } catch (error) {
    console.error("Create plan error:", error);
    return NextResponse.json({ error: "Failed to create plan" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.id) {
      return NextResponse.json({ error: "Plan ID is required" }, { status: 400 });
    }
    const updated = db.togglePlanStatus(body.id);
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Toggle plan error:", error);
    return NextResponse.json({ error: "Failed to toggle plan" }, { status: 500 });
  }
}

