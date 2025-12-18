import { Card } from "@/components/ui/Card";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  trend?: string;
  color?: "indigo" | "emerald" | "amber" | "rose";
}

export function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  color = "indigo",
}: StatCardProps) {
  const colorStyles = {
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
          <h3 className="text-2xl font-bold mt-2 text-foreground">{value}</h3>
          {trend && (
            <p className="text-xs mt-2 text-emerald-600 dark:text-emerald-400 flex items-center font-medium">
              → {trend}{" "}
              <span className="text-muted-foreground ml-1">vs last month</span>
            </p>
          )}
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
