import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { Booking } from "@/lib/models";

export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date");
    const courtId = searchParams.get("courtId");

    if (!date || !courtId) {
      return NextResponse.json({ error: "Missing params" }, { status: 400 });
    }

    // Fetch all confirmed bookings for this court on this date
    const bookings = await Booking.find({
      court: courtId,
      date: new Date(date),
      status: "confirmed",
    }).select("startTime endTime");

    return NextResponse.json({ bookings });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch availability" },
      { status: 500 }
    );
  }
}
