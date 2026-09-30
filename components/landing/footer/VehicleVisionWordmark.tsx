import React from "react";

interface VehicleVisionWordmarkProps {
  className?: string;
}

export function VehicleVisionWordmark({ className = "" }: VehicleVisionWordmarkProps) {
  return (
    <div
      className={className}
      style={{
        fontFamily: "var(--font-display), var(--font-display-fallback)",
        fontSize: "clamp(48px, 6.8vw, 104px)",
        fontWeight: 700,
        letterSpacing: "-0.04em",
        textTransform: "uppercase",
        lineHeight: 0.85,
        color: "#ffffff",
        whiteSpace: "nowrap",
        userSelect: "none",
        textAlign: "right",
      }}
      role="img"
      aria-label="Vehicle Vision"
    >
      VEHICLE VISION
    </div>
  );
}
