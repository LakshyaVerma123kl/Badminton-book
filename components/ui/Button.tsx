import React, { ButtonHTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "ghost";
  className?: string;
}

export function Button({
  className,
  variant = "primary",
  ...props
}: ButtonProps) {
  const base =
    "px-4 py-2 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed";

  const variants = {
    primary:
      "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm hover:shadow-md",
    outline:
      "border-2 border-border hover:border-primary hover:text-primary hover:bg-primary/5",
    ghost: "text-muted-foreground hover:bg-muted hover:text-foreground",
  };

  return (
    <button
      className={twMerge(base, variants[variant], className)}
      {...props}
    />
  );
}
