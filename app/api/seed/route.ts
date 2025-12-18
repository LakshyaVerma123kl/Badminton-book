import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { Court, Coach, Equipment, PricingRule } from "@/lib/models";

export async function GET() {
  await dbConnect();

  // 1. Clear existing data
  await Court.deleteMany({});
  await Coach.deleteMany({});
  await Equipment.deleteMany({});
  await PricingRule.deleteMany({});

  // 2. Create Courts
  const courts = await Court.create([
    { name: "Court A (Indoor)", type: "indoor", basePrice: 150 },
    { name: "Court B (Indoor)", type: "indoor", basePrice: 150 },
    { name: "Court C (Outdoor)", type: "outdoor", basePrice: 80 },
    { name: "Court D (Outdoor)", type: "outdoor", basePrice: 80 },
  ]);

  // 3. Create Coaches
  await Coach.create([
    { name: "Coach Mike", basePrice: 50, specialization: "Tactics" },
    { name: "Coach Sarah", basePrice: 60, specialization: "Fitness" },
  ]);

  // 4. Create Equipment
  await Equipment.create([
    { name: "Pro Racket", totalQuantity: 10, basePrice: 20 },
    { name: "Training Shoes", totalQuantity: 15, basePrice: 15 },
  ]);

  // 5. Create Pricing Rules
  await PricingRule.create([
    {
      name: "Peak Hour Surge",
      type: "percentage",
      value: 20, // 20% extra
      conditions: { startTime: 1800, endTime: 2100 }, // 6 PM - 9 PM
      isActive: true,
    },
    {
      name: "Weekend Premium",
      type: "fixed",
      value: 50, // $50 flat fee
      conditions: { days: [0, 6] }, // Sunday, Saturday
      isActive: true,
    },
  ]);

  return NextResponse.json({ message: "Database Seeded Successfully", courts });
}
