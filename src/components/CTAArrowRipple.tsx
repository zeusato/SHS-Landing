import React from "react";
import { motion } from "framer-motion";

export default function CTAArrowRipple({
  direction = "down",
  onClick,
}: {
  direction?: "down" | "up";
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="fixed left-1/2 -translate-x-1/2 bottom-6 z-[600] pointer-events-auto
                 h-14 w-14 rounded-full
                 bg-white/15 text-white border border-white/25 shadow-xl
                 backdrop-blur-xl hover:bg-white/20
                 flex items-center justify-center transition
                 overflow-visible"
      aria-label={direction === "down" ? "Xem tiếp" : "Quay về"}
      title={direction === "down" ? "Xem tiếp" : "Quay về"}
    >
      {direction === "down" ? (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M12 5v14M12 19l-6-6M12 19l6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ) : (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M12 19V5M12 5l-6 6M12 5l6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )}

      {/* Ripple 1 */}
      <motion.span
        aria-hidden
        className="pointer-events-none absolute -inset-3 rounded-full border border-[#FA9528]/60"
        initial={{ scale: 1, opacity: 0.55 }}
        animate={{ scale: 2.6, opacity: 0 }}
        transition={{ duration: 1.2, ease: "easeOut", repeat: Infinity, repeatDelay: 1.8 }}
        style={{ mixBlendMode: "screen" }}
      />
      {/* Ripple 2 */}
      <motion.span
        aria-hidden
        className="pointer-events-none absolute -inset-4 rounded-full bg-[#FA9528]/18 blur-md"
        initial={{ scale: 1, opacity: 0.45 }}
        animate={{ scale: 3.0, opacity: 0 }}
        transition={{ duration: 1.2, ease: "easeOut", repeat: Infinity, repeatDelay: 1.8 }}
        style={{ mixBlendMode: "screen" }}
      />
    </button>
  );
}
