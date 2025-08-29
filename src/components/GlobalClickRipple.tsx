import { useEffect } from "react";

export default function GlobalClickRipple() {
  useEffect(() => {
    // Inject CSS 1 lần
    console.log("[GCR] mounted (new)");
    const style = document.createElement("style");
    style.innerHTML = `
      .gcr-ripple { position: fixed; border-radius: 9999px; pointer-events: none; will-change: transform, opacity; }
      @keyframes gcr-pop  { 0% { transform: scale(0.2); opacity:.55 } 70%{opacity:.25} 100%{ transform: scale(1); opacity:0 } }
      @keyframes gcr-wave { 0% { transform: scale(0.8); opacity:.35 } 100%{ transform: scale(2.2); opacity:0 } }
      .gcr-core { background: radial-gradient(circle, rgba(255,255,255,.55), rgba(255,255,255,0) 60%); filter: blur(.5px); animation: gcr-pop 700ms ease-out forwards; }
      .gcr-ring { border: 1px solid rgba(250,149,40,.55); box-shadow: 0 0 30px rgba(249,130,24,.40); animation: gcr-wave 1100ms ease-out forwards; }
      .gcr-glow { background: radial-gradient(circle, rgba(250,149,40,.22), rgba(250,149,40,0) 60%); filter: blur(6px); animation: gcr-wave 1200ms ease-out forwards; mix-blend-mode: screen; }
    `;
    document.head.appendChild(style);

    const onClick = (e: MouseEvent) => {
      const minDim = Math.min(window.innerWidth, window.innerHeight);
      // nhỏ hơn trước: ~110–180px
      const size = Math.round(Math.max(110, Math.min(minDim * 0.22, 180)));

      // wrapper chứa 3 lớp ripple
      const wrap = document.createElement("span");
      wrap.className = "gcr-ripple";
      wrap.style.width = wrap.style.height = `${size}px`;
      wrap.style.left = `${e.clientX - size / 2}px`;
      wrap.style.top = `${e.clientY - size / 2}px`;
      wrap.style.zIndex = "80"; // nổi hơn nền nhưng không che overlay cao

      // core trắng
      const core = document.createElement("span");
      core.className = "gcr-core gcr-ripple";
      core.style.inset = "0";

      // viền cam + glow brand
      const ring = document.createElement("span");
      ring.className = "gcr-ring gcr-ripple";
      ring.style.inset = "-6px";

      const glow = document.createElement("span");
      glow.className = "gcr-glow gcr-ripple";
      glow.style.inset = "-12px";

      wrap.append(core, ring, glow);
      document.body.appendChild(wrap);

      // remove sau khi hiệu ứng kết thúc (1.25s)
      window.setTimeout(() => wrap.remove(), 1250);
    };

    document.addEventListener("click", onClick, true);
    return () => {
      document.removeEventListener("click", onClick, true);
      style.remove();
    };
  }, []);

  return null;
}
