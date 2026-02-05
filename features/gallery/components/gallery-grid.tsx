import { motion } from "framer-motion";
import { useState } from "react";
import { galleryItems } from "../data/gallery-items";
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
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <>
      <motion.div
        className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 px-4 pb-8 pt-2 md:px-8 md:pb-12"
        variants={gridVariants}
      >
        {galleryItems.map((item, index) => (
          <GalleryCard
            key={item.id}
            item={item}
            layoutVariant={item.layout}
            onOpen={() => setActiveIndex(index)}
          />
        ))}
      </motion.div>

      <GalleryModal
        items={galleryItems}
        activeIndex={activeIndex}
        isOpen={activeIndex !== null}
        onClose={() => setActiveIndex(null)}
      />


    </>
  );
}

