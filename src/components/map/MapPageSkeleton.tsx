export default function MapPageSkeleton() {
  return (
    <div className="flex flex-col" style={{ height: "calc(100vh - 64px)" }}>
      <div className="flex items-center justify-between px-4 py-2.5 bg-white border-b border-slate-200 shrink-0">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-slate-200 animate-pulse" />
          <div className="h-5 w-32 rounded bg-slate-200 animate-pulse" />
        </div>
        <div className="h-9 w-36 rounded-lg bg-slate-100 animate-pulse" />
      </div>

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-72 bg-white border-r border-slate-200 p-3 shrink-0 hidden md:block">
          <div className="space-y-3">
            <div className="h-10 w-full rounded-lg bg-slate-200 animate-pulse" />
            <div className="h-10 w-full rounded-lg bg-slate-100 animate-pulse" />
            <div className="h-8 w-32 rounded-full bg-slate-100 animate-pulse" />
          </div>
          <div className="mt-4 space-y-2">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="p-3 rounded-lg border border-slate-100">
                <div className="h-4 w-3/4 rounded bg-slate-200 animate-pulse mb-2" />
                <div className="h-3 w-1/2 rounded bg-slate-100 animate-pulse mb-2" />
                <div className="h-3 w-16 rounded bg-slate-100 animate-pulse" />
              </div>
            ))}
          </div>
        </aside>

        <div className="flex-1 bg-slate-100 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(220,38,38,0.08),transparent_25%),radial-gradient(circle_at_80%_30%,rgba(59,130,246,0.08),transparent_25%)]" />
          <div className="absolute inset-6 rounded-2xl border border-slate-200/60 bg-white/70 backdrop-blur-sm" />
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="absolute w-4 h-4 rounded-full bg-maple/70 animate-pulse"
              style={{
                left: `${14 + (index * 11) % 70}%`,
                top: `${18 + (index * 9) % 60}%`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
