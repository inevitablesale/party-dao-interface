
import React from "react";
import { cn } from "@/lib/utils";

export interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  color?: "default" | "primary" | "secondary" | "white";
}

export function Spinner({
  size = "md",
  className,
  color = "default",
}: SpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4 border-2",
    md: "h-6 w-6 border-2",
    lg: "h-8 w-8 border-3",
  };

  const colorClasses = {
    default: "border-gray-300 border-t-gray-600",
    primary: "border-blue-300 border-t-blue-600",
    secondary: "border-purple-300 border-t-purple-600",
    white: "border-white/30 border-t-white",
  };

  return (
    <div
      className={cn(
        "animate-spin rounded-full",
        sizeClasses[size],
        colorClasses[color],
        className
      )}
    ></div>
  );
}
