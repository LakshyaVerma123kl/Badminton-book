import mongoose, { Schema, Model, Document } from "mongoose";

export interface ICourt extends Document {
  name: string;
  type: "indoor" | "outdoor";
  basePrice: number;
  isActive: boolean;
}

const CourtSchema = new Schema<ICourt>({
  name: { type: String, required: true },
  type: { type: String, enum: ["indoor", "outdoor"], required: true },
  basePrice: { type: Number, required: true },
  isActive: { type: Boolean, default: true },
});

export const Court: Model<ICourt> =
  mongoose.models.Court || mongoose.model("Court", CourtSchema);
