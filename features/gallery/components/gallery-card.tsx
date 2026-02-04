import { motion, type Variants } from "framer-motion";
import Image from "next/image";
import type { GalleryItem } from "../types";

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 24, scale: 0.97 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.45 },
  },
};

type GalleryCardProps = {
  item: GalleryItem;
  layoutVariant?: "tall" | "wide";
  onOpen?: () => void;
};

export function GalleryCard({ item, layoutVariant, onOpen }: GalleryCardProps) {
  const isTall = layoutVariant === "tall";

  return (
    <motion.article
      variants={cardVariants}
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className={`group relative flex cursor-pointer flex-col overflow-hidden rounded-[1.9rem] bg-white shadow-[0_14px_32px_rgba(15,23,42,0.10)] border border-slate-200/80 ${
        isTall ? "row-span-2 aspect-[3/5]" : "aspect-[5/4]"
      }`}
      onClick={onOpen}
    >
      <div className="relative h-full w-full overflow-hidden">
        {item.mediaType === "video" && item.videoUrl ? (
          <video
            className="h-full w-full object-cover"
            src={item.videoUrl}
            muted
            loop
            autoPlay
            playsInline
          />
        ) : (
          <Image
            src={item.thumbnail}
            alt={item.title}
            fill
            className="object-cover transition duration-500 group-hover:scale-105 group-hover:brightness-[1.02]"
          />
        )}

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/55 via-black/5 to-transparent" />

        <div className="absolute left-3 right-3 bottom-3 space-y-1 text-white">
          <h2 className="text-sm font-semibold leading-snug drop-shadow-sm">
            {item.title}
          </h2>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 translate-y-full bg-[#ffcc65] px-3.5 py-2 text-[11px] text-slate-900 shadow-[0_-6px_16px_rgba(15,23,42,0.16)] transition-transform duration-300 group-hover:translate-y-0 flex items-center justify-between gap-2">
        {item.instagramUrl ? (
          <a
            href={item.instagramUrl}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="truncate font-medium underline-offset-2 hover:underline"
          >
            View on Instagram
          </a>
        ) : (
          <span className="truncate font-medium">View on Instagram</span>
        )}
        <span className="text-[10px] tracking-[0.14em] text-slate-700">
          @edquest.pro
        </span>
      </div>
    </motion.article>
  );
}

