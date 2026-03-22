"use client";

interface CertBadgeProps {
  name: string;
}

export function CertBadge({ name }: CertBadgeProps) {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-600 ring-1 ring-slate-200/60">
      {name}
    </span>
  );
}
