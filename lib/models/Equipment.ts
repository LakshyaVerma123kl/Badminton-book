import mongoose, { Schema, Model, Document } from "mongoose";

export interface IEquipment extends Document {
  name: string;
  totalQuantity: number;
  basePrice: number;
}

const EquipmentSchema = new Schema<IEquipment>({
  name: { type: String, required: true },
  totalQuantity: { type: Number, required: true },
  basePrice: { type: Number, required: true },
});

export const Equipment: Model<IEquipment> =
  mongoose.models.Equipment || mongoose.model("Equipment", EquipmentSchema);
