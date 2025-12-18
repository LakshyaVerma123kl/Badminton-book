import { NextResponse } from "next/server";
import { calculateDynamicPrice } from "@/lib/sevices/pricingService";
import dbConnect from "@/lib/db";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();

    // Body contains: { courtId, date, startTime, endTime, coachId, equipment }
    const { courtId, date, startTime, endTime, coachId, equipment } = body;

    // Validate essential fields
    if (!courtId || !date || !startTime || !endTime) {
      return NextResponse.json(
        { error: "Missing booking details" },
        { status: 400 }
      );
    }

    // Call our shared pricing service
    const price = await calculateDynamicPrice({
      courtId,
      date: new Date(date),
      startTime,
      endTime, // Assuming 1 hour slots for now, or passed from frontend
      coachId,
      equipmentIds: equipment, // e.g., [{ id: "...", quantity: 1 }]
    });

    return NextResponse.json({ price });
  } catch (error: any) {
    console.error("Pricing Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to calculate price" },
      { status: 500 }
    );
  }
}
