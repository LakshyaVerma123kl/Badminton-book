"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Loader2,
  ShieldCheck,
  Users,
  CalendarCheck,
  DollarSign,
  Activity,
} from "lucide-react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";

// Helper to format currency
const formatINR = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

// 🔒 REPLACE THIS WITH YOUR EMAIL (Must match API)
const ADMIN_EMAILS = ["lakshya123kl@gmail.com"];

export default function AdminDashboard() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // 1. Protect the Route
  useEffect(() => {
    if (isLoaded) {
      if (!user) {
        router.push("/sign-in");
        return;
      }

      const email = user.primaryEmailAddress?.emailAddress;
      if (!email || !ADMIN_EMAILS.includes(email)) {
        router.push("/"); // Kick out non-admins
        return;
      }

      // 2. If Admin, Fetch Data
      fetchStats();
    }
  }, [isLoaded, user, router]);

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/admin/stats");
      const data = await res.json();
      setStats(data);
    } catch (error) {
      console.error("Admin fetch error", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background transition-colors duration-300">
        <div className="text-center space-y-4">
          <Loader2 className="animate-spin text-primary mx-auto" size={48} />
          <p className="text-muted-foreground">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-8 pb-20 transition-colors duration-300">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <ShieldCheck className="text-primary" /> Admin Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Overview of your facility performance.
            </p>
          </div>
          <Link
            href="/"
            className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            ← Back to App
          </Link>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Revenue"
            value={stats ? formatINR(stats.totalRevenue) : "..."}
            icon={DollarSign}
            color="indigo"
          />
          <StatCard
            title="Total Bookings"
            value={stats?.totalBookings || 0}
            icon={CalendarCheck}
            color="emerald"
          />
          <StatCard
            title="Unique Users"
            value={stats?.totalUsers || 0}
            icon={Users}
            color="amber"
          />
          <StatCard
            title="Bookings Today"
            value={stats?.activeToday || 0}
            icon={Activity}
            color="rose"
          />
        </div>

        {/* Recent Bookings Table */}
        <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm transition-colors duration-300">
          <div className="p-6 border-b border-border">
            <h3 className="text-lg font-bold flex items-center gap-2 text-foreground">
              <CalendarCheck className="w-5 h-5 text-muted-foreground" /> Recent
              Activity
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/50 text-muted-foreground uppercase tracking-wider">
                <tr>
                  <th className="p-4">User Email</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Time</th>
                  <th className="p-4">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {stats?.recentActivity?.map((b: any) => (
                  <tr
                    key={b._id}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <td className="p-4 font-medium text-foreground">
                      {b.userEmail}
                    </td>
                    <td className="p-4 text-muted-foreground">
                      {new Date(b.date).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-muted-foreground">
                      {b.startTime / 100}:00 - {b.endTime / 100}:00
                    </td>
                    <td className="p-4 font-mono font-bold text-foreground">
                      {formatINR(b.totalPrice)}
                    </td>
                  </tr>
                ))}
                {(!stats?.recentActivity ||
                  stats.recentActivity.length === 0) && (
                  <tr>
                    <td
                      colSpan={4}
                      className="p-8 text-center text-muted-foreground"
                    >
                      No bookings found yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// Simple internal component for the cards
function StatCard({ title, value, icon: Icon, color }: any) {
  const colorStyles: any = {
    indigo:
      "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400",
    emerald:
      "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400",
    amber:
      "bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400",
    rose: "bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400",
  };

  return (
    <Card className="p-6 border-border shadow-sm hover:shadow-md transition-all">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h3 className="text-3xl font-bold mt-2 text-foreground">{value}</h3>
        </div>
        <div
          className={`p-3 rounded-xl ${colorStyles[color]} transition-colors duration-300`}
        >
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </Card>
  );
}
