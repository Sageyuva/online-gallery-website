"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useDebounce } from "../hooks/useDebounce";

export default function SearchBar({ onSearch }: { onSearch: (query: string) => void }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const initialQuery = searchParams.get("q") || "";
  const [inputValue, setInputValue] = useState(initialQuery);
  const debouncedQuery = useDebounce(inputValue, 500);

  const isSearching = inputValue !== debouncedQuery;
  
  // Keep track of the last emitted query to prevent infinite loops
  const lastEmittedQuery = useRef<string | null>(null);

  useEffect(() => {
    // Only trigger if the actual debounced value changes to something new
    if (debouncedQuery !== lastEmittedQuery.current) {
      lastEmittedQuery.current = debouncedQuery;
      
      const currentQ = searchParams.get("q") || "";
      if (debouncedQuery !== currentQ) {
        const params = new URLSearchParams(searchParams.toString());
        if (debouncedQuery) {
          params.set("q", debouncedQuery);
        } else {
          params.delete("q");
        }
        
        // Use scroll: false to avoid jumping to top on every search update
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
      }
      
      onSearch(debouncedQuery);
    }
  }, [debouncedQuery, pathname, router, searchParams, onSearch]);

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center gap-2">
      <div className="relative w-full group">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Search for amazing photos..."
          className="w-full bg-slate-900 border border-slate-700 text-slate-100 rounded-full py-4 px-6 pr-14 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all shadow-lg group-hover:shadow-emerald-500/10 placeholder:text-slate-500 text-lg"
        />
        <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center">
          {isSearching ? (
            <svg className="animate-spin h-6 w-6 text-emerald-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <svg className="w-6 h-6 text-slate-400 group-hover:text-emerald-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          )}
        </div>
      </div>
      
      <div className="h-6 w-full text-center">
        {isSearching && (
          <p className="text-emerald-400 text-sm animate-pulse font-medium">Searching...</p>
        )}
      </div>
    </div>
  );
}
