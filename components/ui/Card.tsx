import React from "react";

export function Card({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`bg-card dark:bg-card text-card-foreground rounded-xl shadow-sm border border-border p-6 transition-colors duration-300 ${
        className || ""
      }`}
    >
      {children}
    </div>
  );
}
