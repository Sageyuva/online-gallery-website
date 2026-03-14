"use client";

import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useEffect, useState } from "react";
import { getPhotoById } from "../../actions/pexels";

// Simple base64 shimmer for a dark theme placeholder
const shimmer = (w: number, h: number) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#0f172a" offset="20%" />
      <stop stop-color="#1e293b" offset="50%" />
      <stop stop-color="#0f172a" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#0f172a" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1.5s" repeatCount="indefinite"  />
</svg>`;

const toBase64 = (str: string) =>
  typeof window === 'undefined'
    ? Buffer.from(str).toString('base64')
    : window.btoa(str);

export default function PhotoPage({ params }: { params: Promise<{ id: string }> }) {
  const [photo, setPhoto] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchPhoto = async () => {
      const { id } = await params;
      const data = await getPhotoById(id);
      if (!data) {
        notFound();
      } else {
        setPhoto(data);
      }
      setLoading(false);
    };
    fetchPhoto();
  }, [params]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy URL:", err);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 w-32 h-8 bg-slate-800 animate-pulse rounded-full" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="w-full aspect-[4/3] bg-slate-800/50 animate-pulse rounded-3xl" />
            <div className="space-y-10">
              <div className="w-full h-32 bg-slate-800/50 animate-pulse rounded-2xl" />
              <div className="w-full h-64 bg-slate-800/50 animate-pulse rounded-2xl" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!photo) return null;

  const sizes = [
    { label: "Original", url: photo.src.original, desc: "Highest quality" },
    { label: "Large 2x", url: photo.src.large2x, desc: "Retina display" },
    { label: "Large", url: photo.src.large, desc: "High resolution" },
    { label: "Medium", url: photo.src.medium, desc: "Standard use" },
    { label: "Small", url: photo.src.small, desc: "Web preview" },
    { label: "Portrait", url: photo.src.portrait, desc: "Vertical crop" },
    { label: "Landscape", url: photo.src.landscape, desc: "Horizontal crop" },
    { label: "Tiny", url: photo.src.tiny, desc: "Thumbnail" },
  ];

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 py-12 px-4 sm:px-6 lg:px-8 selection:bg-emerald-500/30">
      <div className="absolute inset-x-0 top-0 h-96 bg-gradient-to-b from-blue-900/10 via-emerald-900/5 to-transparent pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <Link 
          href="/"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-emerald-400 mb-8 transition-colors group px-4 py-2 rounded-full hover:bg-slate-900/50"
        >
          <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Gallery
        </Link>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Image Container (Left Column - larger) */}
          <div className="lg:col-span-7 xl:col-span-8 relative rounded-3xl overflow-hidden bg-slate-900/50 shadow-2xl ring-1 ring-white/10 aspect-auto w-full group backdrop-blur-sm p-2 flex items-center justify-center min-h-[50vh]">
            <Image
              src={photo.src.large2x}
              alt={photo.alt || `Photo by ${photo.photographer}`}
              width={photo.width}
              height={photo.height}
              className="w-full h-auto max-h-[85vh] object-contain rounded-2xl bg-slate-950/50"
              sizes="(max-width: 1024px) 100vw, 66vw"
              priority
              placeholder="blur"
              blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(photo.width, photo.height))}`}
            />
          </div>
          
          {/* Info Container (Right Column) */}
          <div className="lg:col-span-5 xl:col-span-4 space-y-8 lg:sticky lg:top-12">
            
            {/* Header / Title */}
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4 leading-tight">
                {photo.alt || "Untitled Photo"}
              </h1>
              <div className="flex flex-wrap items-center gap-4">
                <button
                  onClick={handleCopy}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800 hover:bg-slate-700 transition-colors text-sm font-medium text-slate-300 hover:text-white ring-1 ring-slate-700"
                >
                  {copied ? (
                    <>
                      <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Copied!
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                      Share Link
                    </>
                  )}
                </button>
              </div>
            </div>
            
            {/* Credit Section */}
            <div className="bg-slate-900/40 backdrop-blur-xl rounded-3xl p-6 ring-1 ring-white/10 shadow-xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Photographer Credit</h3>
                <div className="flex items-center gap-4 text-slate-300">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-emerald-600 rounded-full flex items-center justify-center text-2xl font-bold text-white shadow-lg ring-2 ring-slate-800">
                    {photo.photographer.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-lg text-slate-100 truncate">{photo.photographer}</p>
                    <a 
                      href={photo.photographer_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-emerald-400 hover:text-emerald-300 text-sm transition-colors inline-flex items-center gap-1 group/link mt-1"
                    >
                      Pexels Profile
                      <svg className="w-4 h-4 group-hover/link:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Metadata Badges */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-900/40 backdrop-blur-xl rounded-2xl p-5 ring-1 ring-white/10 shadow-lg">
                <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">Resolution</p>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                  </svg>
                  <p className="text-slate-200 font-semibold">{photo.width} × {photo.height}</p>
                </div>
              </div>

              <div className="bg-slate-900/40 backdrop-blur-xl rounded-2xl p-5 ring-1 ring-white/10 shadow-lg">
                <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">Color Palette</p>
                <div className="flex items-center gap-3">
                  <div 
                    className="w-6 h-6 rounded-full shadow-inner ring-2 ring-white/20" 
                    style={{ backgroundColor: photo.avg_color }}
                  />
                  <span className="text-slate-200 font-mono text-sm font-semibold">{photo.avg_color}</span>
                </div>
              </div>
            </div>
            
            {/* Download Options */}
            <div className="bg-slate-900/40 backdrop-blur-xl rounded-3xl p-6 ring-1 ring-white/10 shadow-xl">
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-5 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Available Downloads
              </h3>
              
              <div className="space-y-3">
                {sizes.map((size) => (
                  <div 
                    key={size.label} 
                    className="flex items-center justify-between p-3 rounded-2xl bg-slate-800/50 hover:bg-slate-800 ring-1 ring-transparent hover:ring-white/10 transition-all group"
                  >
                    <div>
                      <p className="font-semibold text-slate-200">{size.label}</p>
                      <p className="text-xs text-slate-400">{size.desc}</p>
                    </div>
                    <a
                      href={size.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-slate-700/50 hover:bg-emerald-600/20 text-slate-300 hover:text-emerald-400 p-2.5 rounded-xl transition-all hover:scale-105 hover:shadow-lg ring-1 ring-slate-600 hover:ring-emerald-500/50 flex items-center justify-center"
                      title={`Download ${size.label} size`}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    </a>
                  </div>
                ))}
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </main>
  );
}
