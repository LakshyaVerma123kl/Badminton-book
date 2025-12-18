import { cn, formatCurrency } from "@/lib/utils";

interface Booking {
  _id: string;
  userEmail: string;
  date: string;
  startTime: number;
  endTime: number;
  totalPrice: number;
  status: string;
}

export function BookingsTable({ bookings }: { bookings: Booking[] }) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
      <div className="p-6 border-b border-slate-100 dark:border-slate-800">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
          Recent Bookings
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 dark:bg-slate-950/50 text-slate-500 dark:text-slate-400">
            <tr>
              <th className="px-6 py-4 font-semibold">User</th>
              <th className="px-6 py-4 font-semibold">Date & Time</th>
              <th className="px-6 py-4 font-semibold">Amount</th>
              <th className="px-6 py-4 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {bookings.map((booking) => (
              <tr
                key={booking._id}
                className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-200">
                  {booking.userEmail}
                </td>
                <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                  <div>{new Date(booking.date).toLocaleDateString()}</div>
                  <div className="text-xs text-slate-400">
                    {booking.startTime / 100}:00 - {booking.endTime / 100}:00
                  </div>
                </td>
                <td className="px-6 py-4 font-mono text-slate-700 dark:text-slate-300">
                  {formatCurrency(booking.totalPrice)}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={cn(
                      "px-2.5 py-1 rounded-full text-xs font-semibold capitalize",
                      booking.status === "confirmed" &&
                        "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
                      booking.status === "cancelled" &&
                        "bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400",
                      booking.status === "waitlist" &&
                        "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400"
                    )}
                  >
                    {booking.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
