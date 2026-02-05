import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { GalleryItem } from "../types";
import {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

type GalleryModalProps = {
  items: GalleryItem[];
  activeIndex: number | null;
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

export function GalleryModal({
  items,
  activeIndex,
  isOpen,
  onClose,
}: GalleryModalProps) {
  const hasActiveItem = activeIndex !== null;

  const [carouselApi, setCarouselApi] = useState<CarouselApi | null>(null);
  const [currentIndex, setCurrentIndex] = useState(activeIndex ?? 0);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  // Sync currentIndex with carousel selection
  useEffect(() => {
    if (!carouselApi) return;

    const handleSelect = () => {
      setCurrentIndex(carouselApi.selectedScrollSnap());
    };

    handleSelect();
    carouselApi.on("select", handleSelect);

    return () => {
      carouselApi.off("select", handleSelect);
    };
  }, [carouselApi]);

  // Autoplay only the active video's slide, pause others
  useEffect(() => {
    if (!isOpen || !hasActiveItem) {
      videoRefs.current.forEach((video) => {
        if (!video) return;
        video.pause();
        video.currentTime = 0;
      });
      return;
    }

    videoRefs.current.forEach((video, index) => {
      if (!video) return;

      if (index === currentIndex && items[index]?.mediaType === "video") {
        video.muted = false;
        void video.play().catch(() => {
          // ignore autoplay blocking errors
        });
      } else {
        video.pause();
        video.currentTime = 0;
      }
    });
  }, [currentIndex, isOpen, hasActiveItem, items]);

  return (
    <AnimatePresence>
      {isOpen && hasActiveItem && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
          initial="hidden"
          animate="show"
          exit="exit"
          variants={backdropVariants}
        >
          {/* Clickable backdrop layer */}
          <div
            className="absolute inset-0"
            onClick={onClose}
          />

          {/* Wrapper so arrows can float outside the modal box */}
          <div className="relative z-10 flex items-center justify-center pointer-events-none">
            {/* Floating arrows (siblings of modal box) */}
            <Carousel
              opts={{
                startIndex: activeIndex ?? 0,
                loop: true,
                duration: 40, // slower, smoother slide animation
              }}
              setApi={setCarouselApi}
              className="relative w-full max-w-4xl px-2 sm:px-4 pointer-events-auto"
            >
              <CarouselPrevious
                aria-label="Previous post"
                className="absolute left-2 top-1/2 z-50 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-slate-900 shadow-md backdrop-blur-md hover:bg-white md:-left-16 md:h-12 md:w-12"
              />
              <CarouselNext
                aria-label="Next post"
                className="absolute right-2 top-1/2 z-50 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-slate-900 shadow-md backdrop-blur-md hover:bg-white md:-right-16 md:h-12 md:w-12"
              />

              {/* Modal box (your existing layout) */}
              <motion.div
                className="relative flex w-full max-h-[90vh] overflow-hidden rounded-[1.9rem] bg-[#f4f4ff] shadow-2xl"
                variants={dialogVariants}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Slides */}
                <CarouselContent>
                  {items.map((item, index) => (
                    <CarouselItem key={item.id}>
                      <div className="flex w-full flex-col md:h-[520px] overflow-hidden md:flex-row">
                        {/* Media */}
                        <div className="relative h-72 w-full md:h-full md:w-1/2">
                          {item.mediaType === "video" && item.videoUrl ? (
                            <video
                              ref={(el) => {
                                videoRefs.current[index] = el;
                              }}
                              className="h-full w-full object-cover"
                              src={item.videoUrl}
                              controls
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
                                whileHover={{
                                  scale: 1.08,
                                  rotate: 8,
                                  backgroundColor: "#ffcc65",
                                }}
                                whileTap={{
                                  scale: 0.92,
                                  rotate: -4,
                                  backgroundColor: "#ffb843",
                                }}
                                onClick={onClose}
                                className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-amber-200 bg-[#ffe49b] text-sm text-slate-900 shadow-md"
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
                                className="rounded-full border border-amber-200 bg-[#ffe49b] px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-900 text-center shadow-sm transition-colors hover:bg-[#ffcc65]"
                              >
                                View on Instagram
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </motion.div>
            </Carousel>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

