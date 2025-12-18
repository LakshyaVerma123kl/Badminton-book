"use client";

import { useState, useTransition } from "react";
import { submitBooking } from "@/app/actions/book";

export default function BookingPage() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      const result = await submitBooking(formData);
      if (result?.error) setError(result.error);
    });
  };

  return (
    <div className="container-padded grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Left: Calendar & Slots */}
      <div className="md:col-span-2 space-y-6">
        <h1 className="text-2xl font-bold text-primary">Select a Slot</h1>
        {/* Interactive Slot Grid Component goes here */}
      </div>

      {/* Right: Summary & Form */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-fit">
        <h2 className="text-xl font-semibold mb-4">Booking Summary</h2>

        <form action={handleSubmit} className="space-y-4">
          {/* Hidden inputs for state managed by React */}
          <input type="hidden" name="courtId" value="123..." />

          <div className="flex justify-between font-medium">
            <span>Total</span>
            <span>$45.00</span>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full py-3 bg-accent text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
          >
            {isPending ? "Processing..." : "Confirm Booking"}
          </button>

          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </form>
      </div>
    </div>
  );
}
