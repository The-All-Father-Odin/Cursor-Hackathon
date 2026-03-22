export default function ShortlistDetailSkeleton() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="h-5 w-36 rounded bg-slate-200 animate-pulse mb-6" />

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6">
        <div className="h-9 w-64 rounded bg-slate-200 animate-pulse mb-3" />
        <div className="h-4 w-32 rounded bg-slate-100 animate-pulse" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex items-start justify-between gap-4"
          >
            <div className="flex items-start gap-3 min-w-0 flex-1">
              <div className="w-10 h-10 rounded-full bg-slate-200 animate-pulse shrink-0" />
              <div className="min-w-0 flex-1 space-y-2">
                <div className="h-5 w-40 rounded bg-slate-200 animate-pulse" />
                <div className="h-4 w-28 rounded bg-slate-100 animate-pulse" />
                <div className="h-4 w-full rounded bg-slate-100 animate-pulse" />
              </div>
            </div>
            <div className="h-8 w-20 rounded-lg bg-slate-100 animate-pulse shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
}
