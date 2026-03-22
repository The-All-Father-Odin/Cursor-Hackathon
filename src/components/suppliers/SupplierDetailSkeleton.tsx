export default function SupplierDetailSkeleton() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="h-5 w-32 rounded bg-slate-200 mb-6 animate-pulse" />

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6 sm:p-8 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-6">
          <div className="w-16 h-16 rounded-full bg-slate-200 animate-pulse shrink-0" />
          <div className="flex-1 space-y-3">
            <div className="h-8 w-2/3 rounded bg-slate-200 animate-pulse" />
            <div className="h-4 w-1/3 rounded bg-slate-100 animate-pulse" />
            <div className="flex gap-2 flex-wrap">
              <div className="h-6 w-28 rounded-full bg-slate-100 animate-pulse" />
              <div className="h-6 w-24 rounded-full bg-slate-100 animate-pulse" />
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 rounded-xl border border-slate-100 bg-slate-50/70">
          <div className="h-4 w-48 rounded bg-slate-200 animate-pulse mb-2" />
          <div className="h-3 w-3/4 rounded bg-slate-100 animate-pulse" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6"
          >
            <div className="h-6 w-40 rounded bg-slate-200 animate-pulse mb-5" />
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="h-3 w-24 rounded bg-slate-100 animate-pulse" />
                <div className="h-4 w-full rounded bg-slate-100 animate-pulse" />
              </div>
              <div className="space-y-2">
                <div className="h-3 w-20 rounded bg-slate-100 animate-pulse" />
                <div className="h-4 w-5/6 rounded bg-slate-100 animate-pulse" />
              </div>
              <div className="space-y-2">
                <div className="h-3 w-28 rounded bg-slate-100 animate-pulse" />
                <div className="h-4 w-2/3 rounded bg-slate-100 animate-pulse" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex gap-3">
        <div className="h-10 w-32 rounded-xl bg-slate-200 animate-pulse" />
        <div className="h-10 w-28 rounded-xl bg-slate-100 animate-pulse" />
      </div>
    </div>
  );
}
