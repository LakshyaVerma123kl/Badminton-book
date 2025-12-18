"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { createBookingAtomic } from "@/lib/sevices/bookingService";
import { z } from "zod";
import { revalidatePath } from "next/cache";

// Zod Schema for strict validation
const BookingSchema = z.object({
  courtId: z.string().min(1, "Court ID is required"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid Date Format"),
  startTime: z.coerce.number().min(0).max(2359),
  endTime: z.coerce.number().min(0).max(2359),
  coachId: z.string().optional().nullable(),
  equipment: z.string().optional(), // JSON string
});

export async function submitBooking(formData: FormData) {
  // 1. Authentication Check
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId || !user) {
    return { error: "You must be signed in to book a court." };
  }

  // 2. Parse Form Data
  const rawData = {
    courtId: formData.get("courtId"),
    date: formData.get("date"),
    startTime: formData.get("startTime"),
    endTime: formData.get("endTime"),
    coachId: formData.get("coachId"),
    equipment: formData.get("equipment"),
  };

  // 3. Validate Inputs
  const validated = BookingSchema.safeParse(rawData);

  if (!validated.success) {
    console.error("Validation Error:", validated.error);
    return { error: "Invalid booking data. Please refresh and try again." };
  }

  try {
    // 4. Process Equipment (JSON String -> Object)
    let equipmentList: { id: string; quantity: number }[] = [];
    if (validated.data.equipment) {
      try {
        equipmentList = JSON.parse(validated.data.equipment);
      } catch (e) {
        return { error: "Invalid equipment data format." };
      }
    }

    // 5. Atomic Booking Transaction
    // We pass the REAL user data now
    await createBookingAtomic({
      ...validated.data,
      date: new Date(validated.data.date),
      userEmail: user.emailAddresses[0].emailAddress, // Get primary email
      userId: userId, // Store Clerk ID for reference
      equipment: equipmentList,
      coachId: validated.data.coachId || undefined,
    });

    // 6. Success Handling
    // Revalidate the home page so the slot turns gray immediately
    revalidatePath("/book"); // <--- Update this to the new route

    return { success: true };
  } catch (error: any) {
    console.error("Booking Transaction Failed:", error);

    if (error.message === "SLOT_TAKEN") {
      return {
        error:
          "⚠️ This slot was just booked by someone else! Please choose another time.",
      };
    }

    return {
      error: "System Error: Failed to process booking. Please try again.",
    };
  }
}
