"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

type AnimatedCardSectionProps = {
  children: ReactNode;
};

export function AnimatedCardSection({ children }: AnimatedCardSectionProps) {
  return (
    <motion.section
      animate={{ opacity: 1, y: 0 }}
      className="snap-start px-4 py-8 sm:px-8"
      initial={{ opacity: 0, y: 24 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      viewport={{ amount: 0.35, once: true }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      <div className="mx-auto min-h-[calc(100vh-4rem)] w-full max-w-5xl">{children}</div>
    </motion.section>
  );
}
