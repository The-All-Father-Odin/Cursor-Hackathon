export default function TariffsPageSkeleton() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8 space-y-3">
        <div className="h-10 w-72 rounded bg-slate-200 animate-pulse" />
        <div className="h-4 w-full max-w-3xl rounded bg-slate-100 animate-pulse" />
        <div className="h-4 w-5/6 max-w-2xl rounded bg-slate-100 animate-pulse" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)] gap-6">
        <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-6 space-y-5">
          <div className="h-10 w-full rounded-lg bg-slate-200 animate-pulse" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="space-y-2">
                <div className="h-3 w-24 rounded bg-slate-100 animate-pulse" />
                <div className="h-10 w-full rounded-lg bg-slate-100 animate-pulse" />
              </div>
            ))}
          </div>
          <div className="h-12 w-full rounded-xl bg-slate-200 animate-pulse" />
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-6 space-y-4">
            <div className="h-6 w-40 rounded bg-slate-200 animate-pulse" />
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="flex items-center justify-between gap-3">
                <div className="h-4 w-28 rounded bg-slate-100 animate-pulse" />
                <div className="h-4 w-20 rounded bg-slate-100 animate-pulse" />
              </div>
            ))}
          </div>
          <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-6 space-y-3">
            <div className="h-6 w-32 rounded bg-slate-200 animate-pulse" />
            <div className="h-4 w-full rounded bg-slate-100 animate-pulse" />
            <div className="h-4 w-5/6 rounded bg-slate-100 animate-pulse" />
            <div className="h-10 w-full rounded-xl bg-slate-100 animate-pulse mt-3" />
          </div>
        </div>
      </div>
    </div>
  );
}
