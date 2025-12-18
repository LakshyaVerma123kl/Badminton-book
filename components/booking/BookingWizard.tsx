"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import { submitBooking } from "@/app/actions/book";
import {
  Calendar,
  Clock,
  Trophy,
  CheckCircle,
  ShoppingBag,
} from "lucide-react";

// Currency Helper
const formatINR = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

type WizardProps = {
  courts: any[];
  coaches: any[];
  equipmentList: any[];
};

export default function BookingWizard({
  courts,
  coaches,
  equipmentList,
}: WizardProps) {
  const router = useRouter();

  // --- STATE ---
  const [selectedCourt, setSelectedCourt] = useState(courts[0]?._id);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [selectedTime, setSelectedTime] = useState<number | null>(null);

  const [selectedCoach, setSelectedCoach] = useState<string | null>(null);
  const [cartEquipment, setCartEquipment] = useState<Record<string, number>>(
    {}
  );

  const [price, setPrice] = useState<number>(0);
  const [takenSlots, setTakenSlots] = useState<number[]>([]);
  const [isCalculating, setIsCalculating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const timeSlots = Array.from({ length: 13 }, (_, i) => 900 + i * 100);

  // --- LOGIC ---
  useEffect(() => {
    async function fetchAvailability() {
      setTakenSlots([]);
      setSelectedTime(null);
      if (!selectedCourt) return;
      const res = await fetch(
        `/api/availability?courtId=${selectedCourt}&date=${date}`
      );
      const data = await res.json();
      if (data.bookings)
        setTakenSlots(data.bookings.map((b: any) => b.startTime));
    }
    fetchAvailability();
  }, [selectedCourt, date]);

  useEffect(() => {
    if (!selectedCourt || !selectedTime || !date) return;
    const fetchPrice = async () => {
      setIsCalculating(true);
      const equipmentArray = Object.entries(cartEquipment)
        .filter(([_, qty]) => qty > 0)
        .map(([id, qty]) => ({ id, quantity: qty }));

      try {
        const res = await fetch("/api/price-preview", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            courtId: selectedCourt,
            date,
            startTime: selectedTime,
            endTime: selectedTime + 100,
            coachId: selectedCoach,
            equipment: equipmentArray,
          }),
        });
        const data = await res.json();
        if (data.price !== undefined) setPrice(data.price);
      } finally {
        setIsCalculating(false);
      }
    };
    const timer = setTimeout(fetchPrice, 300);
    return () => clearTimeout(timer);
  }, [selectedCourt, selectedTime, date, selectedCoach, cartEquipment]);

  const handleBooking = async () => {
    if (!selectedTime) return;
    setIsSubmitting(true);
    const equipmentArray = Object.entries(cartEquipment)
      .filter(([_, qty]) => qty > 0)
      .map(([id, qty]) => ({ id, quantity: qty }));

    const formData = new FormData();
    formData.append("courtId", selectedCourt);
    formData.append("date", date);
    formData.append("startTime", selectedTime.toString());
    formData.append("endTime", (selectedTime + 100).toString());
    if (selectedCoach) formData.append("coachId", selectedCoach);
    formData.append("equipment", JSON.stringify(equipmentArray));

    const result = await submitBooking(formData);
    if (result?.error) {
      alert(result.error);
      setIsSubmitting(false);
    } else {
      alert("Booking Confirmed!");
      router.refresh();
      setSelectedTime(null);
      setCartEquipment({});
      setSelectedCoach(null);
      setIsSubmitting(false);
    }
  };

  const updateEquipment = (id: string, delta: number) => {
    setCartEquipment((prev) => {
      const next = Math.max(0, (prev[id] || 0) + delta);
      return { ...prev, [id]: next };
    });
  };

  const currentCourtName = courts.find((c) => c._id === selectedCourt)?.name;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* LEFT COLUMN (Inputs) */}
      <div className="lg:col-span-8 space-y-8">
        {/* 1. COURT SELECTION */}
        <section className="bg-card border border-border rounded-2xl p-6 shadow-sm transition-colors duration-300">
          <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-primary" /> Select Court
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {courts.map((court) => (
              <div
                key={court._id}
                onClick={() => setSelectedCourt(court._id)}
                className={`
                  cursor-pointer p-5 rounded-xl border transition-all duration-300 relative overflow-hidden group
                  ${
                    selectedCourt === court._id
                      ? "border-primary bg-primary/10 shadow-md ring-1 ring-primary"
                      : "border-border hover:border-primary/50 hover:bg-muted"
                  }
                `}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-bold text-foreground text-lg">
                      {court.name}
                    </div>
                    <div className="text-sm text-muted-foreground capitalize mt-1 flex items-center gap-2">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          court.type === "indoor"
                            ? "bg-indigo-500"
                            : "bg-emerald-500"
                        }`}
                      ></span>
                      {court.type}
                    </div>
                  </div>
                  <div className="text-sm font-semibold text-foreground bg-background px-3 py-1 rounded-md border border-border">
                    {formatINR(court.basePrice)}/hr
                  </div>
                </div>
                {/* Checkmark Indicator */}
                {selectedCourt === court._id && (
                  <div className="absolute bottom-2 right-2 text-primary opacity-100 transition-opacity">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* 2. TIME SELECTION */}
        <section className="bg-card border border-border rounded-2xl p-6 shadow-sm transition-colors duration-300">
          <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" /> Date & Time
          </h3>

          <div className="mb-6">
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Select Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            />
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
            {timeSlots.map((time) => {
              const isTaken = takenSlots.includes(time);
              const isSelected = selectedTime === time;
              return (
                <button
                  key={time}
                  type="button"
                  disabled={isTaken}
                  onClick={() => setSelectedTime(time)}
                  className={`
                    py-3 rounded-lg text-sm font-medium border transition-all relative
                    ${
                      isTaken
                        ? "bg-muted text-muted-foreground border-transparent cursor-not-allowed opacity-50"
                        : isSelected
                        ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/25 scale-105"
                        : "bg-background text-foreground border-border hover:border-primary/50 hover:bg-primary/5"
                    }
                  `}
                >
                  {Math.floor(time / 100)}:00
                  {isTaken && (
                    <span className="block text-[9px] uppercase font-bold mt-1">
                      Booked
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </section>

        {/* 3. EXTRAS */}
        <section className="bg-card border border-border rounded-2xl p-6 shadow-sm transition-colors duration-300">
          <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-primary" /> Extras
          </h3>

          <div className="space-y-8">
            {/* Coaches */}
            <div>
              <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Coaches
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {coaches.map((coach) => (
                  <div
                    key={coach._id}
                    onClick={() =>
                      setSelectedCoach(
                        selectedCoach === coach._id ? null : coach._id
                      )
                    }
                    className={`
                      p-4 rounded-xl border cursor-pointer transition-all flex items-center gap-3
                      ${
                        selectedCoach === coach._id
                          ? "border-primary bg-primary/10 ring-1 ring-primary"
                          : "border-border bg-background hover:border-primary/50"
                      }
                    `}
                  >
                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-foreground font-bold text-lg">
                      {coach.name[0]}
                    </div>
                    <div>
                      <div className="font-bold text-foreground text-sm">
                        {coach.name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatINR(coach.basePrice)}/hr
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Equipment */}
            <div>
              <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Equipment
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {equipmentList.map((item) => (
                  <div
                    key={item._id}
                    className="flex items-center justify-between p-4 border border-border rounded-xl bg-muted/30 transition-colors duration-300"
                  >
                    <div>
                      <div className="font-bold text-foreground">
                        {item.name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatINR(item.basePrice)} each
                      </div>
                    </div>
                    <div className="flex items-center gap-3 bg-background px-2 py-1 rounded-lg border border-border">
                      <button
                        onClick={() => updateEquipment(item._id, -1)}
                        className="w-7 h-7 flex items-center justify-center rounded hover:bg-muted text-foreground font-bold transition-colors"
                      >
                        -
                      </button>
                      <span className="w-4 text-center font-bold text-primary">
                        {cartEquipment[item._id] || 0}
                      </span>
                      <button
                        onClick={() => updateEquipment(item._id, 1)}
                        className="w-7 h-7 flex items-center justify-center rounded hover:bg-muted text-foreground font-bold transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* RIGHT COLUMN (Summary Sticky) */}
      <div className="lg:col-span-4">
        <div className="sticky top-24">
          <div className="bg-card rounded-2xl shadow-xl border border-border overflow-hidden transition-colors duration-300">
            {/* Header */}
            <div className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground p-6">
              <h2 className="font-bold text-lg flex items-center gap-2">
                <Clock className="w-5 h-5" /> Booking Summary
              </h2>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Court</span>
                <span className="font-semibold text-foreground">
                  {currentCourtName || "-"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Date</span>
                <span className="font-medium text-foreground">{date}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Time</span>
                <span className="font-medium text-foreground">
                  {selectedTime ? `${selectedTime / 100}:00` : "-"}
                </span>
              </div>

              {/* Dynamic Extras */}
              {(selectedCoach ||
                Object.keys(cartEquipment).some(
                  (k) => cartEquipment[k] > 0
                )) && (
                <div className="py-2 border-t border-border mt-2 space-y-2">
                  {selectedCoach && (
                    <div className="flex justify-between text-xs text-primary font-medium">
                      <span>+ Coach</span>
                      <span>Applied</span>
                    </div>
                  )}
                  {Object.keys(cartEquipment).some(
                    (k) => cartEquipment[k] > 0
                  ) && (
                    <div className="flex justify-between text-xs text-primary font-medium">
                      <span>+ Equipment</span>
                      <span>Added</span>
                    </div>
                  )}
                </div>
              )}

              <div className="pt-4 border-t border-border mt-4">
                <div className="flex justify-between items-end">
                  <span className="text-muted-foreground font-medium pb-1">
                    Total Pay
                  </span>
                  <div className="text-right">
                    <span className="block text-3xl font-extrabold text-foreground leading-none">
                      {isCalculating ? "..." : formatINR(price)}
                    </span>
                  </div>
                </div>

                <Button
                  className="w-full mt-6 py-6 text-lg font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 transition-all active:scale-95"
                  disabled={!selectedTime || isSubmitting || isCalculating}
                  onClick={handleBooking}
                >
                  {isSubmitting ? "Processing..." : `Confirm Booking`}
                </Button>
              </div>
            </div>
          </div>

          <p className="mt-6 text-center text-xs text-muted-foreground flex items-center justify-center gap-2">
            <CheckCircle className="w-3 h-3" /> Secure Payment
          </p>
        </div>
      </div>
    </div>
  );
}
