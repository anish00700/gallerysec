## edQuest Gallery – Overview

This repo is a **Next.js App Router** project that powers the edQuest marketing gallery.  
The main experience lives at the **`/gallery`** route and showcases images and videos from events, cohorts, and community moments.

### High-level flow

- **Landing**: user visits `/gallery`.
- **Grid**: sees a masonry-style grid of image/video cards.
- **Card hover**: yellow Instagram strip slides up on hover.
- **Modal**: clicking any card opens a full-screen modal with:
  - Larger media (image or video),
  - Title + caption,
  - “View on Instagram” CTA,
  - Carousel navigation with arrows to browse all posts.

---

## Getting Started

From the repo root:

```bash
npm install
npm run dev
```

Then open `http://localhost:3000/gallery` in your browser.

---

## Tech Stack

- **Framework**: Next.js (App Router, TypeScript)
- **Styling**: Tailwind CSS v4 + custom utility classes in `app/globals.css`
- **Animations**: Framer Motion
- **Carousel**: shadcn/ui carousel (Embla under the hood) in `components/ui/carousel.tsx`
- **Images**: `next/image` with local media under `public/images/gallery`

---

## Project Structure

Only the most relevant pieces for the gallery are listed here.

- `app/`
  - `layout.tsx` – root layout, fonts, background, metadata.
  - `globals.css` – global styles and Tailwind setup.
  - `(marketing)/gallery/page.tsx` – **main gallery page**.
  - `page.tsx` – default Next.js starter home (not central to gallery).
- `features/gallery/`
  - `types.ts` – shared types (e.g. `GalleryItem`).
  - `data/gallery-items.ts` – static list of posts (images + videos).
  - `components/gallery-grid.tsx` – gallery grid + modal orchestration.
  - `components/gallery-card.tsx` – individual grid cards.
  - `components/gallery-modal.tsx` – modal + carousel.
- `components/ui/`
  - `button.tsx` – shared button primitive (shadcn).
  - `carousel.tsx` – shadcn carousel wrapper (Embla).
- `public/images/gallery/`
  - `post*.jpg`, `Video*.MP4` – actual media used by the gallery.

---

## Domain Model

### `GalleryItem` (`features/gallery/types.ts`)

```ts
export type MediaType = "image" | "video";

export type GalleryItem = {
  id: string;
  title: string;
  meta: string;
  thumbnail: string;
  caption: string;
  instagramUrl?: string;
  mediaType?: MediaType;          // "image" | "video" – defaults to image if omitted
  videoUrl?: string;              // required when mediaType === "video"
  layout?: "tall" | "wide";       // layout hint for the grid
};
```

### Data (`features/gallery/data/gallery-items.ts`)

- Exports `galleryItems: GalleryItem[]`.
- Each item describes:
  - **What to render** (thumbnail or video),
  - **Copy** (title, meta, caption),
  - **Instagram link**,
  - **Layout** hint for how it should appear in the grid.
- Images and videos are local files under `public/images/gallery`.

This file is the main place to update when adding/removing posts.

---

## Gallery Rendering Flow

### 1. Page entry – `app/(marketing)/gallery/page.tsx`

- Declared as a **client component**.
- Configures a container animation via Framer Motion (`containerVariants`).
- Renders:
  - Page heading + subtitle.
  - `<GalleryGrid />` – all gallery behavior lives here.

### 2. Grid & state – `features/gallery/components/gallery-grid.tsx`

- Imports `galleryItems` and `GalleryItem`.
- Local React state:

```ts
const [activeIndex, setActiveIndex] = useState<number | null>(null);
```

- Responsibilities:
  - Render a responsive CSS grid of `GalleryCard`s.
  - Decide each card’s **layout variant** (`tall` vs `wide`), either from `item.layout` or index logic.
  - Open the modal by setting `activeIndex` when a card is clicked.
  - Pass props into `GalleryModal`:
    - `items={galleryItems}`
    - `activeIndex={activeIndex}`
    - `isOpen={activeIndex !== null}`
    - `onClose={() => setActiveIndex(null)}`

### 3. Cards – `features/gallery/components/gallery-card.tsx`

- A single gallery item in the grid.
- Uses **Framer Motion** for:
  - Fade/slide-in on initial render (`cardVariants`),
  - Lift + slight scale on hover.
- Media:
  - If `mediaType === "video"` and `videoUrl` exists → renders `<video>` (muted, loop, autoPlay, `playsInline`).
  - Otherwise → `next/image` with `fill` and `object-cover`, plus subtle zoom/brightness on hover.
- Visual details:
  - Rounded card (`rounded-[1.9rem]`), subtle border & shadow.
  - Bottom gradient overlay for text readability.
  - Title over the media in the bottom-left corner.
- **Instagram hover strip** (yellow bar):
  - Hidden below the card by default, slides up on `group-hover`.
  - Text: “View on Instagram” on the left, `@edquest.pro` on the right.
  - Clicking the link:
    - Opens Instagram in a new tab,
    - Uses `e.stopPropagation()` so the modal doesn’t open when the user just wants Instagram.

### 4. Modal + carousel – `features/gallery/components/gallery-modal.tsx`

Core responsibilities:

- **Backdrop & animation**
  - Uses `AnimatePresence` + Framer Motion variants (`backdropVariants`, `dialogVariants`).
  - Backdrop is a `motion.div` filling the viewport with a semi-opaque black overlay.
  - Only clicks on the actual backdrop close the modal (content clicks are stopped).

- **Carousel**
  - Uses shadcn’s `Carousel`, `CarouselContent`, `CarouselItem`, `CarouselPrevious`, `CarouselNext`.
  - `opts` config:
    - `startIndex: activeIndex` – opens the modal on the clicked item.
    - `loop: true` – infinite looping.
    - Optional `duration` for smoother transitions.
  - Arrows:
    - Floating on the **left/right outside the modal box**.
    - Glassmorphism-style: white with `backdrop-blur-md`, hover to a solid background.

- **Modal box layout**
  - Split view on desktop: media left, caption right.
  - Stacked vertically on mobile.
  - Caption side:
    - Title + animated close button row.
    - Caption text.
    - “View on Instagram” CTA aligned to the right.

---

## Extending the Gallery

Common extension points for the team:

- **Add / edit posts**
  - Update `features/gallery/data/gallery-items.ts`.
  - Add new images/videos into `public/images/gallery/`.
  - Keep `mediaType` + `thumbnail` / `videoUrl` consistent.

- **Change layout behavior**
  - Adjust the `layout` field per item (or the logic in `gallery-grid.tsx`) to control which cards are tall vs wide.

- **Tweak motion / styling**
  - Card motion: `gallery-card.tsx` (`cardVariants`, `whileHover` props).
  - Modal motion: `gallery-modal.tsx` (`backdropVariants`, `dialogVariants`).
  - Colors, radii, typography: `app/globals.css` + Tailwind utility classes in components.

This should give anyone on the team enough context to safely modify or extend the gallery feature.
