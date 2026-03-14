import Image from "next/image";
import Link from "next/link";

interface Photo {
  id: number;
  url: string;
  photographer: string;
  alt: string;
  src: {
    large: string;
  };
}

// Simple base64 shimmer for a dark theme placeholder
const shimmer = (w: number, h: number) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#1e293b" offset="20%" />
      <stop stop-color="#334155" offset="50%" />
      <stop stop-color="#1e293b" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#1e293b" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1.5s" repeatCount="indefinite"  />
</svg>`;

const toBase64 = (str: string) =>
  typeof window === 'undefined'
    ? Buffer.from(str).toString('base64')
    : window.btoa(str);

export default function ImageCard({ photo }: { photo: Photo }) {
  return (
    <Link 
      href={`/photo/${photo.id}`}
      className="group relative overflow-hidden rounded-2xl bg-slate-800/50 aspect-[3/4] shadow-lg hover:shadow-2xl hover:shadow-black/50 transition-all duration-500 transform hover:-translate-y-2 block cursor-pointer ring-1 ring-white/10 hover:ring-white/20 blur-0"
    >
      <Image
        src={photo.src.large}
        alt={photo.alt || `Photo by ${photo.photographer}`}
        fill
        loading="lazy"
        placeholder="blur"
        blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(700, 475))}`}
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
      
      {/* Overlay gradient */}
      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out" />
      
      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out delay-75">
        <p className="text-white font-bold text-lg leading-tight truncate drop-shadow-md">
          {photo.photographer}
        </p>
        <span className="text-sm text-emerald-300 mt-2 font-medium inline-flex items-center gap-1 transition-colors">
          View Details
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </span>
      </div>
    </Link>
  );
}
