import mongoose, { Schema, Model, Document } from "mongoose";

export interface ICoach extends Document {
  name: string;
  basePrice: number;
  specialization?: string;
}

const CoachSchema = new Schema<ICoach>({
  name: { type: String, required: true },
  basePrice: { type: Number, required: true },
  specialization: String,
});

export const Coach: Model<ICoach> =
  mongoose.models.Coach || mongoose.model("Coach", CoachSchema);
