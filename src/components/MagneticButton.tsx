import { useRef } from "react";
import { motion } from "framer-motion";

export default function MagneticButton() {
  const btnRef = useRef<HTMLButtonElement>(null);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const btn = btnRef.current;
    if (!btn) return;

    const ripple = document.createElement("span");
    ripple.className =
      "absolute rounded-full bg-gradient-to-r from-[#FE8600] to-[#FFD86F] opacity-70 animate-ripple";
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    ripple.style.width = ripple.style.height = `${size * 2}px`;
    ripple.style.left = `${e.clientX - rect.left - size}px`;
    ripple.style.top = `${e.clientY - rect.top - size}px`;

    btn.appendChild(ripple);
    ripple.addEventListener("animationend", () => ripple.remove());
  };

  return (
    <motion.button
      ref={btnRef}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleClick}
      className="relative overflow-hidden rounded-xl px-6 py-3 font-semibold text-white 
                 bg-gradient-to-r from-[#FE8600] via-[#FCA82E] to-[#FFD86F]
                 shadow-[0_8px_25px_-8px_rgba(252,136,0,0.6)]
                 transition-colors duration-300 ease-out"
    >
      Mở tài khoản
    </motion.button>
  );
}
