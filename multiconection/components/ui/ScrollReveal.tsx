"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ReactNode } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    setIsMobile(window.matchMedia("(max-width: 1023px)").matches);
  }, []);
  return isMobile;
}

export function ScrollReveal({
  children,
  delay = 0,
  className = "",
}: ScrollRevealProps) {
  const isMobile = useIsMobile();

  return (
    <motion.div
      initial={{ opacity: 0, y: isMobile ? 14 : 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: isMobile ? "-20px" : "-60px" }}
      transition={{
        duration: isMobile ? 0.4 : 0.7,
        delay: isMobile ? delay * 0.6 : delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
