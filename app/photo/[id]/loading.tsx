export default function Loading() {
  return (
    <main className="min-h-screen bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 w-32 h-8 bg-slate-800 animate-pulse rounded-full" />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image skeleton */}
          <div className="w-full aspect-[4/3] bg-slate-800/50 animate-pulse rounded-3xl" />
          
          {/* Info skeleton */}
          <div className="space-y-10">
            <div>
              <div className="w-3/4 h-12 bg-slate-800 animate-pulse rounded-xl mb-4" />
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-800 animate-pulse rounded-full" />
                <div className="space-y-2">
                  <div className="w-32 h-5 bg-slate-800 animate-pulse rounded-md" />
                  <div className="w-40 h-4 bg-slate-800 animate-pulse rounded-md" />
                </div>
              </div>
            </div>
            
            <div className="w-full h-32 bg-slate-800/50 animate-pulse rounded-2xl" />
            
            <div>
              <div className="w-48 h-6 bg-slate-800 animate-pulse rounded-md mb-4" />
              <div className="flex flex-wrap gap-3">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="w-24 h-10 bg-slate-800 animate-pulse rounded-xl" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
