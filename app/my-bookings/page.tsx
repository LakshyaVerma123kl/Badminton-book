import { currentUser } from "@clerk/nextjs/server";
import { Booking, Court } from "@/lib/models";
import { redirect } from "next/navigation";
import { formatCurrency } from "@/lib/utils";
import { Calendar, Clock, MapPin, Package, User } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default async function MyBookingsPage() {
  const user = await currentUser();
  if (!user) return redirect("/");

  const email = user.emailAddresses[0].emailAddress;

  // Fetch bookings for this user
  // We populate 'court' to get the real name (e.g., "Court A")
  const rawBookings = await Booking.find({ userEmail: email })
    .populate("court")
    .sort({ date: -1 }) // Newest first
    .lean();

  const bookings = JSON.parse(JSON.stringify(rawBookings));

  // Separate Upcoming vs Past
  const now = new Date();
  const upcoming = bookings.filter(
    (b: any) =>
      new Date(b.date) >= now ||
      (new Date(b.date).toDateString() === now.toDateString() &&
        b.endTime > now.getHours() * 100)
  );
  const past = bookings.filter((b: any) => !upcoming.includes(b));

  return (
    <div className="min-h-screen bg-background py-12 px-4 transition-colors duration-300">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold text-foreground">My Bookings</h1>
            <p className="text-muted-foreground mt-1">
              Manage your schedule and history.
            </p>
          </div>
          <Link href="/book">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
              + New Booking
            </Button>
          </Link>
        </div>

        {/* UPCOMING SECTION */}
        <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary" /> Upcoming
        </h2>

        {upcoming.length === 0 ? (
          <div className="bg-card rounded-2xl p-8 text-center border border-border mb-10">
            <p className="text-muted-foreground">
              No upcoming games. Time to hit the court!
            </p>
          </div>
        ) : (
          <div className="grid gap-4 mb-12">
            {upcoming.map((booking: any) => (
              <BookingCard
                key={booking._id}
                booking={booking}
                isUpcoming={true}
              />
            ))}
          </div>
        )}

        {/* PAST SECTION */}
        <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-muted-foreground" /> History
        </h2>

        <div className="grid gap-4 opacity-75 hover:opacity-100 transition-opacity">
          {past.map((booking: any) => (
            <BookingCard
              key={booking._id}
              booking={booking}
              isUpcoming={false}
            />
          ))}
          {past.length === 0 && (
            <p className="text-muted-foreground text-sm">
              No booking history yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// Reusable Card Component
function BookingCard({
  booking,
  isUpcoming,
}: {
  booking: any;
  isUpcoming: boolean;
}) {
  const statusColor = {
    confirmed:
      "text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 dark:text-emerald-400",
    cancelled:
      "text-rose-600 bg-rose-50 dark:bg-rose-500/10 dark:text-rose-400",
    waitlist:
      "text-amber-600 bg-amber-50 dark:bg-amber-500/10 dark:text-amber-400",
  };

  return (
    <div
      className={`
      bg-card p-6 rounded-2xl border transition-all duration-300
      ${
        isUpcoming
          ? "border-primary/30 shadow-lg shadow-primary/10"
          : "border-border"
      }
      flex flex-col md:flex-row md:items-center justify-between gap-4
    `}
    >
      {/* Date & Time Box */}
      <div className="flex items-center gap-4">
        <div
          className={`
          flex flex-col items-center justify-center w-16 h-16 rounded-xl font-bold transition-colors duration-300
          ${
            isUpcoming
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground"
          }
        `}
        >
          <span className="text-xs uppercase">
            {new Date(booking.date).toLocaleDateString("en-US", {
              month: "short",
            })}
          </span>
          <span className="text-2xl">{new Date(booking.date).getDate()}</span>
        </div>

        <div>
          <h3 className="font-bold text-foreground text-lg">
            {booking.court?.name || "Court"}
          </h3>
          <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {booking.startTime / 100}:00 - {booking.endTime / 100}:00
            </span>
          </div>
        </div>
      </div>

      {/* Extras & Price */}
      <div className="flex flex-col md:items-end gap-2">
        {/* Badges for extras */}
        <div className="flex gap-2">
          {booking.coach && (
            <span className="text-xs px-2 py-1 rounded bg-muted text-muted-foreground flex items-center gap-1">
              <User className="w-3 h-3" /> Coach
            </span>
          )}
          {booking.equipment?.length > 0 && (
            <span className="text-xs px-2 py-1 rounded bg-muted text-muted-foreground flex items-center gap-1">
              <Package className="w-3 h-3" /> {booking.equipment.length} Items
            </span>
          )}
        </div>

        <div className="flex items-center gap-3 mt-1">
          <span
            className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${
              statusColor[booking.status as keyof typeof statusColor]
            }`}
          >
            {booking.status}
          </span>
          <span className="font-bold text-foreground">
            {formatCurrency(booking.totalPrice)}
          </span>
        </div>
      </div>
    </div>
  );
}
