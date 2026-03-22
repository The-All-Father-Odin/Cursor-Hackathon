"use client";

import Link from "next/link";
import { AlertTriangle, ArrowLeft, RefreshCw } from "lucide-react";

type RouteErrorPageProps = {
  title: string;
  body: string;
  retryLabel: string;
  backHref: string;
  backLabel: string;
  onRetry: () => void;
};

export default function RouteErrorPage({
  title,
  body,
  retryLabel,
  backHref,
  backLabel,
  onRetry,
}: RouteErrorPageProps) {
  return (
    <div className="max-w-5xl mx-auto px-4 py-16 text-center">
      <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
      <h1 className="text-2xl font-bold text-slate-900 mb-2">{title}</h1>
      <p className="text-slate-500 mb-6">{body}</p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 bg-maple text-white rounded-xl hover:bg-maple-dark transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          {retryLabel}
        </button>
        <Link
          href={backHref}
          className="inline-flex items-center gap-2 px-4 py-2 border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {backLabel}
        </Link>
      </div>
    </div>
  );
}
