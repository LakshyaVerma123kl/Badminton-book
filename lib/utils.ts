import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges Tailwind CSS classes intelligently.
 * Example: cn("bg-red-500", isSelected && "bg-blue-500") -> "bg-blue-500" (correctly overrides)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format currency to INR
export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}
