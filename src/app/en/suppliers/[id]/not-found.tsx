import Link from "next/link";
import { AlertTriangle, ArrowLeft } from "lucide-react";

export default function EnSupplierNotFound() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 text-center">
      <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
      <h1 className="text-2xl font-bold text-slate-900 mb-2">Supplier Not Found</h1>
      <p className="text-slate-500 mb-6">
        This Canadian supplier profile could not be found.
      </p>
      <Link
        href="/en/search"
        className="inline-flex items-center gap-2 px-4 py-2 bg-maple text-white rounded-xl hover:bg-maple-dark transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Search
      </Link>
    </div>
  );
}
