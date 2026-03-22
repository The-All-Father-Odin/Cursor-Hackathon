"use client";

interface CanadianContentBadgeProps {
  score: number;
  size?: "sm" | "md" | "lg";
}

export function CanadianContentBadge({ score, size = "md" }: CanadianContentBadgeProps) {
  const getColor = () => {
    if (score >= 80) return { bg: "bg-emerald-50", ring: "ring-emerald-500/20", text: "text-emerald-700", fill: "bg-emerald-500" };
    if (score >= 60) return { bg: "bg-amber-50", ring: "ring-amber-500/20", text: "text-amber-700", fill: "bg-amber-500" };
    if (score >= 40) return { bg: "bg-orange-50", ring: "ring-orange-500/20", text: "text-orange-700", fill: "bg-orange-500" };
    return { bg: "bg-red-50", ring: "ring-red-500/20", text: "text-red-700", fill: "bg-red-400" };
  };

  const sizeClasses = {
    sm: { container: "w-10 h-10", text: "text-xs", label: "text-[10px]" },
    md: { container: "w-14 h-14", text: "text-sm font-bold", label: "text-[10px]" },
    lg: { container: "w-20 h-20", text: "text-lg font-bold", label: "text-xs" },
  };

  const colors = getColor();
  const sizes = sizeClasses[size];

  return (
    <div className={`relative ${sizes.container} flex flex-col items-center justify-center rounded-full ${colors.bg} ring-2 ${colors.ring}`}>
      <span className={`${sizes.text} ${colors.text} leading-none`}>{score}</span>
      {size !== "sm" && (
        <span className={`${sizes.label} ${colors.text} opacity-70 leading-none mt-0.5`}>/ 100</span>
      )}
    </div>
  );
}
