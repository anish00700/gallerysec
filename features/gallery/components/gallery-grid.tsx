import { motion } from "framer-motion";
import { useState } from "react";
import { galleryItems } from "../data/gallery-items";
import type { GalleryItem } from "../types";
import { GalleryCard } from "./gallery-card";
import { GalleryModal } from "./gallery-modal";

const gridVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

export function GalleryGrid() {
  const [activeItem, setActiveItem] = useState<GalleryItem | null>(null);

  return (
    <>
      <motion.div
        className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 px-4 pb-8 pt-2 md:px-8 md:pb-12"
        variants={gridVariants}
      >
        {galleryItems.map((item, index) => {
          const layoutVariant = index === 0 || index === 3 ? "tall" : "wide";

          return (
            <GalleryCard
              key={item.id}
              item={item}
              layoutVariant={layoutVariant}
              onOpen={() => setActiveItem(item)}
            />
          );
        })}
      </motion.div>

      <GalleryModal
        item={activeItem}
        isOpen={!!activeItem}
        onClose={() => setActiveItem(null)}
      />
    </>
  );
}

