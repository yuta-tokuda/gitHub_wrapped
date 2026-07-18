"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

type AnimatedCardSectionProps = {
  children: ReactNode;
};

export function AnimatedCardSection({ children }: AnimatedCardSectionProps) {
  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className="px-4 sm:px-6"
      initial={{ opacity: 0, y: 24 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      viewport={{ amount: 0.35, once: true }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      <div className="mx-auto w-full max-w-5xl">{children}</div>
    </motion.div>
  );
}
