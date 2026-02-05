"use client";

import { motion } from "framer-motion";
import { GalleryGrid } from "@/features/gallery/components/gallery-grid";

const containerVariants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      when: "beforeChildren",
      staggerChildren: 0.08,
    },
  },
};

export default function GalleryPage() {
  return (
    <div className="min-h-screen bg-[#e0e1e8] text-slate-900 px-4 py-14">
      <motion.section
        className="mx-auto w-full max-w-6xl"
        initial="hidden"
        animate="show"
        variants={containerVariants}
      >
        <header className="flex flex-col items-center gap-3 pb-6 text-center">
          <h1 className="text-3xl md:text-[2.7rem] font-thin tracking-tight text-slate-900 leading-tight">
            Our <span className="font-semibold text-slate-900">Gallery</span>
          </h1>
          <p className="mt-2 mb-6 max-w-2xl text-sm md:text-base text-slate-700">
          Moments from our events, cohorts, and wins — thoughtfully curated to reflect the edQuest journey.
          </p>
        </header>

        <GalleryGrid />
      </motion.section>
    </div>
  );
}

