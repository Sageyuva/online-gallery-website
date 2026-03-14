"use client";

import { useState, useEffect, Suspense, useCallback } from "react";
import SearchBar from "./components/SearchBar";
import GalleryGrid from "./components/GalleryGrid";
import { fetchPexelsImages } from "./actions/pexels";

// Define the Photo interface based on what's expected
interface Photo {
  id: number;
  url: string;
  photographer: string;
  alt: string;
  src: {
    large: string;
  };
}

export default function Home() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // We rely on SearchBar to call handleSearch even on initial load 
  // with the query from the URL.

  useEffect(() => {
    let isMounted = true;
    const loadInitial = async () => {
      setLoading(true);
      try {
        const initialPhotos = await fetchPexelsImages(query, 1);
        if (isMounted) {
          setPhotos(initialPhotos);
          setPage(1);
          setHasMore(initialPhotos.length === 15);
        }
      } catch (error) {
        console.error("Error loading initial photos", error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    
    loadInitial();
    
    return () => {
      isMounted = false;
    };
  }, [query]);

  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return;
    
    setLoadingMore(true);
    const nextPage = page + 1;
    try {
      const morePhotos = await fetchPexelsImages(query, nextPage);
      setPhotos((prev) => [...prev, ...morePhotos]);
      setPage(nextPage);
      setHasMore(morePhotos.length === 15);
    } catch (error) {
      console.error("Error loading more photos", error);
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, hasMore, page, query]);

  // Wrap handleSearch in useCallback to prevent recreating it every render
  // We use the functional setter for setQuery to avoid holding stale closures or adding it to dependencies.
  // Wait, if it sets the exact same query string, it won't actually trigger a re-render
  const handleSearch = useCallback((newQuery: string) => {
    setQuery((prevQuery) => {
      if (prevQuery !== newQuery) {
        // Safe to set other states since we are setting state
        // React batches these safely even though it's inside a setState function conceptually
        setHasMore(true);
        setPage(1);
        return newQuery;
      }
      return prevQuery;
    });
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 py-16 px-4 sm:px-6 lg:px-8 selection:bg-emerald-500/30">
      <div className="absolute inset-x-0 top-0 h-96 bg-gradient-to-b from-blue-900/20 via-emerald-900/10 to-transparent pointer-events-none" />
      
      <div className="max-w-7xl mx-auto space-y-12 relative z-10">
        <header className="text-center space-y-6">
          <div className="inline-flex items-center justify-center p-3 bg-slate-800/80 rounded-2xl mb-4 border border-slate-700/50 backdrop-blur-sm shadow-xl ring-1 ring-white/10">
            <svg className="w-10 h-10 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-emerald-400 to-teal-400 drop-shadow-sm pb-2">
            AI Image Gallery
          </h1>
          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Discover breathtaking curated photography or find the perfect inspiration with our intelligent search powered by Pexels.
          </p>
        </header>

        <section className="sticky top-6 z-20 transition-all">
          <div className="bg-slate-950/80 backdrop-blur-2xl p-2 rounded-3xl ring-1 ring-white/10 shadow-2xl max-w-3xl mx-auto">
            <Suspense fallback={<div className="h-16 flex items-center justify-center text-slate-400 animate-pulse">Initializing search...</div>}>
              <SearchBar onSearch={handleSearch} />
            </Suspense>
          </div>
        </section>

        <section className="pt-8">
          <GalleryGrid 
            photos={photos} 
            loading={loading} 
            loadingMore={loadingMore}
            onLoadMore={loadMore}
            hasMore={hasMore}
            query={query}
          />
        </section>
      </div>
    </main>
  );
}
