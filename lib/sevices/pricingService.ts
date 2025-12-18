import {
  Court,
  Coach,
  Equipment,
  PricingRule,
  IPricingRule,
} from "@/lib/models";
import dbConnect from "@/lib/db";

type PriceContext = {
  courtId: string;
  coachId?: string;
  equipmentIds?: { id: string; quantity: number }[];
  date: Date;
  startTime: number;
  endTime: number;
};

export async function calculateDynamicPrice(ctx: PriceContext) {
  await dbConnect();

  const durationHours = (ctx.endTime - ctx.startTime) / 100;
  const dayOfWeek = ctx.date.getDay(); // 0=Sun, 1=Mon...

  // 1. Fetch all resources in parallel
  const [court, coach, equipmentList, rules] = await Promise.all([
    Court.findById(ctx.courtId),
    ctx.coachId ? Coach.findById(ctx.coachId) : null,
    ctx.equipmentIds?.length
      ? Equipment.find({ _id: { $in: ctx.equipmentIds.map((e) => e.id) } })
      : [],
    PricingRule.find({ isActive: true }),
  ]);

  if (!court) throw new Error("Court not found");

  // Helper: Apply dynamic rules (Peak hours, Weekend surge)
  const applyRules = (
    basePrice: number,
    type: "court" | "coach" | "equipment"
  ) => {
    let final = basePrice;

    rules.forEach((rule: IPricingRule) => {
      const { conditions } = rule;
      let applies = true;

      // Time Condition (e.g., 6 PM - 9 PM)
      if (
        conditions.startTime !== undefined &&
        conditions.endTime !== undefined
      ) {
        if (
          ctx.startTime < conditions.startTime ||
          ctx.startTime >= conditions.endTime
        )
          applies = false;
      }

      // Day Condition (e.g., Weekends)
      if (conditions.days?.length && !conditions.days.includes(dayOfWeek))
        applies = false;

      // Target Type (e.g., Only applies to Courts)
      if (
        conditions.targetType &&
        conditions.targetType !== "all" &&
        conditions.targetType !== type
      )
        applies = false;

      if (applies) {
        if (rule.type === "percentage") final += basePrice * (rule.value / 100);
        if (rule.type === "fixed") final += rule.value;
      }
    });
    return final;
  };

  let total = 0;

  // 2. Calculate Court Price
  total += applyRules(court.basePrice * durationHours, "court");

  // 3. Calculate Coach Price
  if (coach) {
    total += applyRules(coach.basePrice * durationHours, "coach");
  }

  // 4. Calculate Equipment Price
  if (ctx.equipmentIds && equipmentList.length > 0) {
    ctx.equipmentIds.forEach((reqItem) => {
      const dbItem = equipmentList.find((e) => e._id.toString() === reqItem.id);
      if (dbItem) {
        // Equipment is usually a flat fee per session, but we can apply rules too
        total += applyRules(dbItem.basePrice * reqItem.quantity, "equipment");
      }
    });
  }

  return Math.ceil(total);
}
