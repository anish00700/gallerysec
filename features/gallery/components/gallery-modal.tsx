import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import type { GalleryItem } from "../types";

type GalleryModalProps = {
  item: GalleryItem | null;
  isOpen: boolean;
  onClose: () => void;
};

const backdropVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1 },
  exit: { opacity: 0 },
};

const dialogVariants = {
  hidden: { opacity: 0, scale: 0.96, y: 12 },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.22 },
  },
  exit: { opacity: 0, scale: 0.96, y: 12 },
};

export function GalleryModal({ item, isOpen, onClose }: GalleryModalProps) {
  return (
    <AnimatePresence>
      {isOpen && item && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
          initial="hidden"
          animate="show"
          exit="exit"
          variants={backdropVariants}
          onClick={onClose}
        >
          <motion.div
            className="relative flex w-full max-w-3xl md:h-[520px] flex-col overflow-hidden rounded-[2rem] bg-[#f4f4ff] shadow-2xl md:flex-row"
            variants={dialogVariants}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Media */}
            <div className="relative h-72 w-full md:h-full md:w-1/2">
              {item.mediaType === "video" && item.videoUrl ? (
                <video
                  className="h-full w-full object-cover"
                  src={item.videoUrl}
                  controls
                  autoPlay
                  playsInline
                />
              ) : (
                <Image
                  src={item.thumbnail}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
              )}
            </div>

            {/* Caption */}
            <div className="flex w-full flex-col p-5 md:w-1/2 md:p-7">
              <div className="flex flex-1 flex-col">
                <div className="flex items-start justify-between gap-4">
                  <h2 className="text-lg font-semibold text-slate-900 md:text-xl">
                    {item.title}
                  </h2>
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.08, rotate: 8, backgroundColor: "#ffcc65" }}
                    whileTap={{ scale: 0.92, rotate: -4, backgroundColor: "#ffb843" }}
                    onClick={onClose}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#ffe49b] text-slate-900 text-sm shadow-md border border-amber-200"
                    aria-label="Close"
                  >
                    ×
                  </motion.button>
                </div>

                <p className="mt-4 text-sm leading-relaxed text-slate-700 text-left">
                  {item.caption}
                </p>
              </div>

              {item.instagramUrl && (
                <div className="mt-6 flex justify-end text-xs text-slate-500">
                  <a
                    href={item.instagramUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full bg-[#ffe49b] px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-900 text-center shadow-sm border border-amber-200 transition-colors hover:bg-[#ffcc65]"
                  >
                    View on Instagram
                  </a>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

