import mongoose, { Schema, Model, Document } from "mongoose";

export interface IPricingRule extends Document {
  name: string;
  type: "percentage" | "fixed";
  value: number;
  conditions: {
    startTime?: number;
    endTime?: number;
    days?: number[];
    targetType?: "court" | "coach" | "equipment" | "all";
  };
  isActive: boolean;
}

const PricingRuleSchema = new Schema<IPricingRule>({
  name: { type: String, required: true },
  type: { type: String, enum: ["percentage", "fixed"], required: true },
  value: { type: Number, required: true },
  conditions: {
    startTime: Number,
    endTime: Number,
    days: [Number],
    targetType: { type: String, enum: ["court", "coach", "equipment", "all"] },
  },
  isActive: { type: Boolean, default: true },
});

export const PricingRule: Model<IPricingRule> =
  mongoose.models.PricingRule ||
  mongoose.model("PricingRule", PricingRuleSchema);
