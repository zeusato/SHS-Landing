import { useRef } from "react";
import { motion } from "framer-motion";

export default function MagneticButton({ children = "Mở tài khoản" }: { children?: string }) {
  const btnRef = useRef<HTMLButtonElement>(null);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const btn = btnRef.current;
    if (!btn) return;

    // Ripple gradient thương hiệu (cam)
    const ripple = document.createElement("span");
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);

    ripple.className =
      "pointer-events-none absolute rounded-full " +
      "bg-gradient-to-r from-[#FA9528] to-[#F76F08] opacity-70 animate-ripple";
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
      className="relative overflow-hidden rounded-2xl px-6 py-3 font-semibold text-white
                           backdrop-blur-xl
                           bg-orange-200/10 border border-orange-600/30
                           hover:bg-orange-200/30 hover:shadow-[0_0_35px_rgba(254,215,170,1)]"
    >
      <span className="relative z-20">{children}</span>      
      <span
        className="absolute left-0 top-0 h-full w-2/5
                  bg-gradient-to-r from-transparent via-white/45 to-transparent
                  -skew-x-12 blur-md opacity-80
                  animate-shine pointer-events-none"
      ></span>
      {/* viền + shine */}
      <span className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-orange-200/60" />
      <span
        className="
          pointer-events-none absolute left-0 top-0 h-full w-2/5
          bg-gradient-to-r from-transparent via-white/40 to-transparent
          -skew-x-12 blur-md opacity-80
        "
      />
    </motion.button>
  );
}
