import mongoose from "mongoose";
import dbConnect from "@/lib/db";
import { Booking, Equipment } from "@/lib/models";
import { calculateDynamicPrice } from "./pricingService";

export async function createBookingAtomic(data: any) {
  await dbConnect();

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 1. Availability Check (Concurrency Guard)
    // Check if any confirmed booking overlaps with requested time
    const collision = await Booking.findOne({
      court: data.courtId,
      date: data.date,
      status: "confirmed",
      $or: [
        { startTime: { $lt: data.endTime, $gte: data.startTime } },
        { endTime: { $gt: data.startTime, $lte: data.endTime } },
      ],
    }).session(session);

    if (collision) {
      throw new Error("SLOT_TAKEN");
    }

    // 2. Equipment Check (Optional)
    if (data.equipment && data.equipment.length > 0) {
      for (const item of data.equipment) {
        // Logic to check total inventory vs booked inventory would go here
        // For now, we assume infinite stock for simplicity
      }
    }

    // 3. Recalculate Price (Security Step)
    // Never trust the price sent from the frontend
    const finalPrice = await calculateDynamicPrice({
      courtId: data.courtId,
      date: data.date,
      startTime: data.startTime,
      endTime: data.endTime,
      coachId: data.coachId,
      equipmentIds: data.equipment,
    });

    // 4. Create the Booking
    const newBooking = new Booking({
      userEmail: data.userEmail,
      date: data.date,
      startTime: data.startTime,
      endTime: data.endTime,
      court: data.courtId,
      coach: data.coachId,
      equipment: data.equipment,
      totalPrice: finalPrice,
      status: "confirmed",
    });

    await newBooking.save({ session });

    // 5. Commit Transaction
    await session.commitTransaction();
    return newBooking;
  } catch (error) {
    // If anything failed, roll back everything
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
}
