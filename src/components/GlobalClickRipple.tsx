import { useEffect } from "react";

export default function GlobalClickRipple() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const d = document;
      const span = d.createElement("span");
      // style: cố định theo viewport, không chặn click
      span.className = "pointer-events-none fixed rounded-full animate-ripple bg-[radial-gradient(circle,rgba(255,255,255,0.5),rgba(255,255,255,0)_60%)]";
      const size = Math.max(window.innerWidth, window.innerHeight) * 0.35; // bán kính đủ lớn
      span.style.width = span.style.height = `${size}px`;
      span.style.left = `${e.clientX - size / 2}px`;
      span.style.top  = `${e.clientY - size / 2}px`;
      span.style.zIndex = "50"; // trên nền nhưng dưới overlay khác nếu có
      d.body.appendChild(span);
      span.addEventListener("animationend", () => span.remove());
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);
  return null;
}
