export default function ShortlistsPageSkeleton() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8 gap-4">
        <div className="space-y-3">
          <div className="h-9 w-56 rounded bg-slate-200 animate-pulse" />
          <div className="h-4 w-24 rounded bg-slate-100 animate-pulse" />
        </div>
        <div className="h-11 w-36 rounded-lg bg-slate-200 animate-pulse shrink-0" />
      </div>

      <div className="flex flex-col gap-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden"
          >
            <div className="px-6 py-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3 flex-wrap">
                    <div className="h-7 w-48 rounded bg-slate-200 animate-pulse" />
                    <div className="h-6 w-24 rounded-full bg-slate-100 animate-pulse" />
                  </div>
                  <div className="h-4 w-28 rounded bg-slate-100 animate-pulse" />
                </div>
                <div className="h-8 w-8 rounded-lg bg-slate-100 animate-pulse shrink-0" />
              </div>

              <div className="flex items-center gap-2 mt-4 flex-wrap">
                <div className="h-8 w-28 rounded-lg bg-emerald-50 animate-pulse" />
                <div className="h-8 w-24 rounded-lg bg-blue-50 animate-pulse" />
                <div className="h-8 w-24 rounded-lg bg-red-50 animate-pulse" />
              </div>
            </div>

            <div className="border-t border-slate-100 px-6 py-4 bg-slate-50/50">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {Array.from({ length: 3 }).map((__, supplierIndex) => (
                  <div
                    key={supplierIndex}
                    className="bg-white rounded-lg border border-slate-100 px-4 py-3 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="w-9 h-9 rounded-full bg-slate-200 animate-pulse shrink-0" />
                      <div className="min-w-0 flex-1 space-y-2">
                        <div className="h-4 w-32 rounded bg-slate-200 animate-pulse" />
                        <div className="h-3 w-24 rounded bg-slate-100 animate-pulse" />
                      </div>
                    </div>
                    <div className="h-7 w-7 rounded-md bg-slate-100 animate-pulse shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
