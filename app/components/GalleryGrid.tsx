"use client";

import ImageCard from "./ImageCard";

interface Photo {
  id: number;
  url: string;
  photographer: string;
  alt: string;
  src: {
    large: string;
  };
}

interface GalleryGridProps {
  photos: Photo[];
  loading: boolean;
  loadingMore: boolean;
  onLoadMore: () => void;
  hasMore: boolean;
  query: string;
}

export default function GalleryGrid({ photos, loading, loadingMore, onLoadMore, hasMore, query }: GalleryGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-slate-800/50 animate-pulse rounded-2xl aspect-[3/4] w-full ring-1 ring-white/5" />
        ))}
      </div>
    );
  }

  if (photos.length === 0) {
    return (
      <div className="text-center py-32 px-4 rounded-3xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm shadow-xl">
        <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner ring-1 ring-slate-700">
          <svg className="w-10 h-10 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <p className="text-2xl font-bold tracking-tight text-slate-200">
          {query ? `No images found for "${query}"` : "No images found"}
        </p>
        <p className="text-slate-400 mt-2 max-w-sm mx-auto leading-relaxed">We couldn't find anything matching your search. Try different keywords to explore more amazing photos.</p>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
        {photos.map((photo) => (
          <ImageCard key={photo.id} photo={photo} />
        ))}
      </div>
      
      {hasMore && (
        <div className="flex justify-center pt-8 pb-16">
          <button
            onClick={onLoadMore}
            disabled={loadingMore}
            className="group relative overflow-hidden bg-slate-800 hover:bg-slate-700 text-slate-100 px-10 py-4 rounded-full font-semibold transition-all shadow-xl disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-3 border border-slate-700 hover:border-slate-500"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-emerald-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <span className="relative flex items-center gap-3">
              {loadingMore ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-emerald-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Loading more...
                </>
              ) : (
                <>
                  Load More Masterpieces
                  <svg className="w-5 h-5 text-emerald-400 group-hover:translate-y-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </>
              )}
            </span>
          </button>
        </div>
      )}
    </div>
  );
}
