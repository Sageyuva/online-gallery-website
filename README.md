# AI Image Gallery

A responsive, high-performance image gallery built with **Next.js (App Router)** and **Tailwind CSS**, powered by the **Pexels API**.

## ✨ Features

- **Dynamic Curated & Search Feeds**: Browse curated masterpieces or search for specific inspiration using the Pexels API.
- **Advanced Performance**:
  - **Debounced Search**: Typing automatically fetches results with a 500ms debounce to limit API calls without needing a submit button.
  - **Server Actions & Caching**: Leverages Next.js Data Cache (`revalidate: 3600`) and custom tags (`photo-[id]`) for lightning-fast responses.
  - **Lazy Loading & Shimmer**: Uses `next/image` with custom Base64 animated shimmers for smooth, skeleton-like loading experiences.
- **Beautiful Detail Pages**: Dedicated dynamic routes (`/photo/[id]`) providing image original dimensions, a dynamic color palette swatch, photographer credits, and direct download links for all available sizes.
- **Modern UI**: Crafted with a premium aesthetic using Tailwind CSS—featuring glassmorphism layouts, subtle backdrop blurs, gradients, and micro-animations.

## 🚀 Getting Started

First, make sure you have a Pexels API key. You can get one for free at [Pexels API](https://www.pexels.com/api/).

1. Create a `.env` file in the root of your project and add your API key:
   ```env
   NEXT_APP_PEXELS_API_KEY=your_pexels_api_key_here
   ```

2. Install dependencies:
   ```bash
   npm install
   # or yarn / pnpm / bun install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🛠️ Built With

- **Framework**: [Next.js](https://nextjs.org) (App Router, Server Components)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Data Source**: [Pexels API](https://www.pexels.com/api/)

## 🎨 Design Highlights

The project focuses heavily on **User Experience**:
- Uses the functional `useSearchParams` and `useRouter` to ensure search states are shareable via URL.
- Responsive grids scale perfectly from mobile devices to ultra-wide desktop monitors.
- Skeleton loading screens (`loading.tsx`) prevent UI layout shifts while waiting for Server Components to resolve.
- Error handling includes custom `notFound()` layouts for invalid API queries.

---

*This project was developed focusing on Next.js 15+ best practices including asynchronous params handling and server action colocation.*
