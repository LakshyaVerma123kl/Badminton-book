import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import dbConnect from "@/lib/db";
import { Booking } from "@/lib/models";

// 🔒 1. DEFINE ADMINS HERE
const ADMIN_EMAILS = ["lakshya123kl@gmail.com"];

export async function GET() {
  try {
    const user = await currentUser();

    // 2. CHECK: Is user logged in?
    if (!user || !user.emailAddresses[0]) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 3. CHECK: Is user an Admin?
    const email = user.emailAddresses[0].emailAddress;
    if (!ADMIN_EMAILS.includes(email)) {
      return NextResponse.json(
        { error: "Forbidden: You are not an admin." },
        { status: 403 }
      );
    }

    await dbConnect();

    // 4. Fetch Data (Only runs if checks pass)
    const [totalBookings, revenueResult, uniqueUsers, todaysBookings] =
      await Promise.all([
        Booking.countDocuments({}),
        Booking.aggregate([
          { $match: { status: { $ne: "cancelled" } } },
          { $group: { _id: null, total: { $sum: "$totalPrice" } } },
        ]),
        Booking.distinct("userEmail"),
        Booking.find({
          date: {
            $gte: new Date(new Date().setHours(0, 0, 0, 0)),
            $lt: new Date(new Date().setHours(23, 59, 59, 999)),
          },
        }).countDocuments(),
      ]);

    const recentActivity = await Booking.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    return NextResponse.json({
      totalBookings,
      totalRevenue: revenueResult[0]?.total || 0,
      totalUsers: uniqueUsers.length,
      activeToday: todaysBookings,
      recentActivity,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
