"use client";

import { useLocale } from "@/hooks/useLocale";
import { getCapacityTierLabel } from "@/lib/i18n";

interface CapacityBadgeProps {
  tier: "Small" | "Medium" | "Large";
}

export function CapacityBadge({ tier }: CapacityBadgeProps) {
  const { locale } = useLocale();
  const config = {
    Small: { bg: "bg-sky-50", text: "text-sky-700", ring: "ring-sky-200" },
    Medium: { bg: "bg-violet-50", text: "text-violet-700", ring: "ring-violet-200" },
    Large: { bg: "bg-indigo-50", text: "text-indigo-700", ring: "ring-indigo-200" },
  };

  const c = config[tier];

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${c.bg} ${c.text} ring-1 ${c.ring}`}>
      {getCapacityTierLabel(tier, locale)}
    </span>
  );
}
