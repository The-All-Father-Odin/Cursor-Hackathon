export default function SearchPageSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex flex-col lg:flex-row gap-6">
        <aside className="lg:w-72 shrink-0">
          <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-5 space-y-5">
            <div className="h-10 w-full rounded-lg bg-slate-200 animate-pulse" />
            <div className="space-y-3">
              <div className="h-3 w-20 rounded bg-slate-100 animate-pulse" />
              <div className="h-10 w-full rounded-lg bg-slate-100 animate-pulse" />
            </div>
            <div className="space-y-3">
              <div className="h-3 w-20 rounded bg-slate-100 animate-pulse" />
              <div className="h-10 w-full rounded-lg bg-slate-100 animate-pulse" />
            </div>
            <div className="h-10 w-full rounded-lg bg-slate-100 animate-pulse" />
          </div>
        </aside>

        <div className="flex-1 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div className="h-7 w-48 rounded bg-slate-200 animate-pulse" />
            <div className="h-9 w-32 rounded-lg bg-slate-100 animate-pulse" />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden"
              >
                <div className="p-5 pb-4 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 space-y-2">
                      <div className="h-5 w-3/4 rounded bg-slate-200 animate-pulse" />
                      <div className="h-4 w-1/3 rounded bg-slate-100 animate-pulse" />
                    </div>
                    <div className="w-10 h-10 rounded-full bg-slate-100 animate-pulse shrink-0" />
                  </div>
                  <div className="flex gap-2">
                    <div className="h-6 w-20 rounded-full bg-slate-100 animate-pulse" />
                    <div className="h-6 w-24 rounded-full bg-slate-100 animate-pulse" />
                  </div>
                  <div className="h-4 w-full rounded bg-slate-100 animate-pulse" />
                  <div className="h-4 w-5/6 rounded bg-slate-100 animate-pulse" />
                </div>
                <div className="px-5 py-3 bg-slate-50/60 border-t border-slate-100 flex justify-end gap-2">
                  <div className="h-8 w-24 rounded-lg bg-slate-100 animate-pulse" />
                  <div className="h-8 w-24 rounded-lg bg-slate-100 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
