import mongoose, { Schema, Model } from "mongoose";

export interface IBooking {
  userEmail: string;
  date: Date; // stored as ISO midnight
  startTime: number; // 1800 (18:00)
  endTime: number; // 1900 (19:00)
  court: mongoose.Types.ObjectId;
  coach?: mongoose.Types.ObjectId;
  equipment: { item: mongoose.Types.ObjectId; quantity: number }[];
  totalPrice: number;
  currency: string;
  status: "confirmed" | "cancelled" | "waitlist";
}

const BookingSchema = new Schema<IBooking>(
  {
    userEmail: { type: String, required: true },
    date: { type: Date, required: true },
    startTime: { type: Number, required: true },
    endTime: { type: Number, required: true },
    court: { type: Schema.Types.ObjectId, ref: "Court", required: true },
    coach: { type: Schema.Types.ObjectId, ref: "Coach" },
    equipment: [
      {
        item: { type: Schema.Types.ObjectId, ref: "Equipment" },
        quantity: { type: Number, default: 1 },
      },
    ],
    totalPrice: { type: Number, required: true },
    status: {
      type: String,
      enum: ["confirmed", "cancelled", "waitlist"],
      default: "confirmed",
    },
  },
  { timestamps: true }
);

// COMPOUND INDEX: The secret to fast availability checks
// Ensures looking up a specific court at a specific time is O(log n)
BookingSchema.index({ court: 1, date: 1, startTime: 1, status: 1 });

export const Booking =
  mongoose.models.Booking || mongoose.model("Booking", BookingSchema);
