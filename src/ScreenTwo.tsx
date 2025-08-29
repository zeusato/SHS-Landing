import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, ShieldCheck, Zap, Headphones } from "lucide-react";

/* ===== ASSETS (dark only) ===== */
import silkImg from "../source/silk.png";
import qrImg from "../source/qr-app.jpg";

/* ===== Local components ===== */
function AnimatedChart({ className = "" }: { className?: string }) {
  const pts = Array.from({ length: 32 }, (_, i) => {
    const x = (i / 31) * 1200;
    const y = 180 + Math.sin(i / 2) * 40 + Math.cos(i / 3) * 22;
    return [x, y];
  });
  const d = pts.map((p, i) => (i === 0 ? `M ${p[0]},${p[1]}` : `L ${p[0]},${p[1]}`)).join(" ");

  return (
    <svg viewBox="0 0 1200 400" className={`w-full h-full ${className}`} preserveAspectRatio="none">
      <defs>
        <linearGradient id="strokeGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#22d3ee" />
          <stop offset="50%" stopColor="#a78bfa" />
          <stop offset="100%" stopColor="#22c55e" />
        </linearGradient>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {[...Array(10)].map((_, i) => (
        <line key={i} x1="0" x2="1200" y1={(i + 1) * 36} y2={(i + 1) * 36} stroke="#ffffff14" />
      ))}

      <motion.path
        d={d}
        fill="none"
        stroke="url(#strokeGrad)"
        strokeWidth="3"
        filter="url(#glow)"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2.2, ease: "easeInOut" }}
      />
      <motion.path
        d={d}
        fill="none"
        stroke="#ffffff"
        strokeWidth="5"
        strokeDasharray="0.001 9999"
        initial={{ strokeDashoffset: 9999 }}
        animate={{ strokeDashoffset: 0 }}
        transition={{ duration: 2.2, ease: "easeInOut" }}
        opacity={0.7}
      />
    </svg>
  );
}

function GlassPill({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div
      className="group relative overflow-hidden rounded-2xl backdrop-blur-xl p-4 sm:p-5
                    border border-white/15 bg-white/10 text-white
                    shadow-[0_8px_40px_-12px_rgba(0,0,0,0.5)] hover:bg-white/12 transition"
    >
      <div className="flex items-start gap-3 relative z-10">
        <div className="rounded-xl bg-white/10 p-2 border border-white/10">{icon}</div>
        <div>
          <div className="font-semibold tracking-wide">{title}</div>
          <div className="text-white/75 text-sm leading-snug mt-1">{desc}</div>
        </div>
      </div>
      <span
        className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/20 to-transparent
                       opacity-0 pointer-events-none group-hover:animate-hoverSweep"
      />
      <div className="pointer-events-none absolute inset-0 rounded-2xl shadow-[inset_0_1px_0_0_rgba(255,255,255,0.18)]" />
    </div>
  );
}

export default function ScreenTwo() {
  const [showQR, setShowQR] = React.useState(false);

  return (
    <div className="relative h-full">
      {/* blobs & silk */}
      <div className="pointer-events-none absolute -top-40 -left-40 h-96 w-96 rounded-full blur-3xl opacity-25 bg-cyan-500" />
      <div className="pointer-events-none absolute -bottom-48 -right-40 h-[28rem] w-[28rem] rounded-full blur-3xl opacity-20 bg-violet-500" />
      <img
        src={silkImg}
        alt="Silk background"
        className="fixed bottom-[-95px] right-[-40px] object-contain z-0 opacity-80 pointer-events-none"
        style={{ maxWidth: "50vw", maxHeight: "50vh" }}
      />
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg, rgba(255,255,255,.22) 0px, rgba(255,255,255,.22) 1px, transparent 1px, transparent 18px)",
        }}
      />

      {/* grid */}
      <div className="relative z-10 mx-auto max-w-7xl h-full px-5 grid grid-rows-[auto_auto] sm:grid-rows-1 sm:grid-cols-2 gap-6 items-start py-10 pt-24 sm:pt-28">
        {/* chart */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative order-1 sm:order-2"
        >
          <div className="relative isolate rounded-3xl h-[260px] sm:h-[420px]">
            <div aria-hidden className="absolute inset-0 rounded-3xl bg-[#0b1324]/80 pointer-events-none" />
            <div className="relative h-full rounded-3xl border border-white/15 bg-white/10 backdrop-blur-2xl p-4 shadow-[0_30px_80px_-20px_rgba(59,130,246,0.35)]">
              <div className="absolute inset-0 rounded-3xl pointer-events-none shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2)]" />
              <AnimatedChart className="h-full w-full" />
              <div className="absolute top-4 left-4 rounded-xl border border-white/15 bg:black/30 backdrop-blur-xl px-3 py-2 text-sm text-white">
                VNINDEX <span className="text-emerald-300 font-semibold">+1.24%</span>
              </div>
              <div className="absolute bottom-4 right-4 rounded-xl border border-white/15 bg:black/30 backdrop-blur-xl px-3 py-2 text-sm text:white">
                SHS <span className="text-emerald-300 font-semibold">+2.08%</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* copy + CTAs */}
        <div className="max-w-xl order-2 sm:order-1">
          <motion.h1
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative z-10 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-normal leading-[1.2] antialiased text-white"
          >
            Đầu tư thông minh,
            <span className="block bg-clip-text text-transparent pb-[10px] bg-gradient-to-r from-cyan-300 via-violet-300 to-emerald-300">
              {" "}
              tương lai vững chắc
            </span>
          </motion.h1>

          <motion.p
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.05 }}
            className="mt-6 text-white/75 text-base sm:text-lg leading-relaxed"
          >
            Nền tảng giao dịch chứng khoán SHS — nhanh chóng, an toàn, <br /> minh bạch.
            Công nghệ tối tân, phí cạnh tranh, hỗ trợ tận tâm.
          </motion.p>

          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
            className="mt-6 flex flex-wrap gap-3"
          >
            <a href="https://trading.shs.com.vn/" target="_blank" rel="noreferrer">
              <button
                className="relative overflow-hidden rounded-2xl px-6 py-3 font-semibold text-white
                           backdrop-blur-xl
                           bg-orange-200/10 border border-orange-600/30
                           hover:bg-orange-200/30 hover:shadow-[0_0_35px_rgba(254,215,170,1)]"
              >
                <span className="relative z-20">Bắt đầu ngay</span>
                <span className="absolute inset-0 bg-gradient-to-tr from-white/25 via-transparent to-transparent opacity-60 z-0 pointer-events-none" />
                <span className="absolute inset-0 rounded-2xl ring-1 ring-orange-300/40 pointer-events-none" />
                <span className="absolute left-0 top-0 h-full w-2/5 bg-gradient-to-r from-transparent via-white/45 to-transparent -skew-x-12 blur-md opacity-80 animate-shine pointer-events-none" />
              </button>
            </a>

            <button
              onClick={() => setShowQR((v) => !v)}
              aria-expanded={showQR}
              aria-controls="qr-panel"
              className="relative overflow-hidden rounded-2xl px-6 py-3 font-semibold 
                         text-white bg-white/10 border border-white/20
                         hover:bg-white/15 hover:shadow-[0_0_35px_rgba(56,189,248,0.7)]
                         transition duration-500 ease-out"
            >
              Tải ứng dụng
            </button>

            <AnimatePresence initial={false}>
              {showQR && (
                <motion.div
                  id="qr-panel"
                  key="qr"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: "easeInOut" }}
                  className="w-full overflow-hidden"
                >
                  <div className="mt-3 rounded-2xl border border-white/15 bg-white/10 backdrop-blur-xl p-4 flex items-center gap-4">
                    <img src={qrImg} alt="QR tải ứng dụng" className="h-28 w-28 rounded-lg object-contain bg-white" />
                    <div className="text-sm text-white/80">
                      <div className="font-semibold mb-1">Quét QR để tải ứng dụng</div>
                      <div>iOS & Android — tự phát hiện nền tảng.</div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          <div className="mt-7 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <GlassPill icon={<TrendingUp className="h-5 w-5" />} title="Biểu đồ realtime" desc="Khớp lệnh nhanh, dữ liệu thị trường cập nhật tức thì." />
            <GlassPill icon={<ShieldCheck className="h-5 w-5" />} title="An toàn & tuân thủ" desc="Chuẩn bảo mật, đáp ứng quy định thị trường Việt Nam." />
            <GlassPill icon={<Zap className="h-5 w-5" />} title="Hiệu năng tối ưu" desc="Hệ thống ổn định, xử lý lệnh tốc độ cao." />
            <GlassPill icon={<Headphones className="h-5 w-5" />} title="Hỗ trợ 24/7" desc="Đội ngũ tư vấn tận tâm, giải đáp mọi lúc." />
          </div>
        </div>
      </div>
    </div>
  );
}
