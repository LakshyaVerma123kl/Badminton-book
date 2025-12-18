import mongoose from "mongoose";
import * as dotenv from "dotenv";
// @ts-ignore
import { Court, Coach, Equipment } from "../lib/models";

dotenv.config({ path: ".env" });

const seedData = async () => {
  try {
    // 1. Connect to DB
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is missing in .env.local");
    }
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // 2. Clear existing data
    await Court.deleteMany({});
    await Coach.deleteMany({});
    await Equipment.deleteMany({});
    console.log("🧹 Cleared old data");

    // 3. Seed Courts
    // We use 'as any' here to bypass strict Mongoose type inference for seeding
    const courts = await Court.create([
      {
        name: "Court A (Premium)",
        type: "indoor",
        basePrice: 800,
        priceModifiers: {
          weekend: 200,
          evening: 100,
        },
        isActive: true,
      },
      {
        name: "Court B (Standard)",
        type: "indoor",
        basePrice: 600,
        priceModifiers: {
          weekend: 100,
          evening: 50,
        },
        isActive: true,
      },
      {
        name: "Court C (Outdoor)",
        type: "outdoor",
        basePrice: 400,
        priceModifiers: {
          weekend: 50,
          evening: 0,
        },
        isActive: true,
      },
    ] as any);
    console.log(`🏟️ Created ${courts.length} Courts`);

    // 4. Seed Coaches
    const coaches = await Coach.create([
      {
        name: "Rahul Dravid",
        specialization: "Batting Technique",
        basePrice: 1500,
        experienceLevel: "Expert",
      },
      {
        name: "P. Gopichand",
        specialization: "Badminton Strategy",
        basePrice: 2000,
        experienceLevel: "Legendary",
      },
      {
        name: "Sania Mirza",
        specialization: "Tennis Doubles",
        basePrice: 1800,
        experienceLevel: "Expert",
      },
    ] as any);
    console.log(`👨‍🏫 Created ${coaches.length} Coaches`);

    // 5. Seed Equipment
    // FIX: Changed 'stock' to 'totalQuantity' to match Schema
    const equipment = await Equipment.create([
      {
        name: "Yonex Muscle Power Racket",
        category: "racket",
        basePrice: 150,
        totalQuantity: 20,
      },
      {
        name: "Nivia Pro Shuttlecock (Pack of 6)",
        category: "shuttlecock",
        basePrice: 300,
        totalQuantity: 50,
      },
      {
        name: "Asics Court Shoes (Size 9)",
        category: "shoes",
        basePrice: 200,
        totalQuantity: 5,
      },
    ] as any);
    console.log(`🏸 Created ${equipment.length} Equipment items`);

    console.log("✨ Seeding Completed Successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding Failed:", error);
    process.exit(1);
  }
};

seedData();
