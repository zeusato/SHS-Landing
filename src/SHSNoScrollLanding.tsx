import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, ShieldCheck, Zap, Headphones } from "lucide-react";
import logo from "../source/LOGO.png";

// --- Animated line chart background ---
function AnimatedChart({ className = "" }: { className?: string }) {
  // Generate a smooth pseudo-sine path across the width
  const points = Array.from({ length: 32 }, (_, i) => {
    const x = (i / 31) * 1200; // SVG width = 1200
    const y = 180 + Math.sin(i / 2) * 40 + Math.cos(i / 3) * 22; // subtle variation
    return [x, y];
  });
  const d = points
    .map((p, i) => (i === 0 ? `M ${p[0]},${p[1]}` : `L ${p[0]},${p[1]}`))
    .join(" ");

  return (
    <svg
      viewBox="0 0 1200 400"
      xmlns="http://www.w3.org/2000/svg"
      className={`w-full h-full ${className}`}
      preserveAspectRatio="none"
    >
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

      {/* grid lines */}
      {[...Array(10)].map((_, i) => (
        <line key={i} x1="0" x2="1200" y1={(i + 1) * 36} y2={(i + 1) * 36} stroke="#ffffff0F" />
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

      {/* Animated spark moving along the path (fake with dashed offset) */}
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
    <div className="group relative rounded-2xl border border-white/15 bg-white/10 backdrop-blur-xl p-4 sm:p-5 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.5)] hover:bg-white/15 transition">
      <div className="flex items-start gap-3">
        <div className="rounded-xl bg-white/10 p-2 border border-white/10">{icon}</div>
        <div>
          <div className="font-semibold tracking-wide">{title}</div>
          <div className="text-white/70 text-sm leading-snug mt-1">{desc}</div>
        </div>
      </div>
      <div className="pointer-events-none absolute inset-0 rounded-2xl shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2)]" />
    </div>
  );
}

export default function SHSNoScrollLanding() {
  const [showQR, setShowQR] = useState(false);
  return (
    <div className="relative h-screen w-full overflow-hidden bg-slate-950 text-white">
      {/* Subtle background gradient blobs */}
      <div className="pointer-events-none absolute -top-40 -left-40 h-96 w-96 rounded-full blur-3xl opacity-25 bg-cyan-500" />
      <div className="pointer-events-none absolute -bottom-48 -right-40 h-[28rem] w-[28rem] rounded-full blur-3xl opacity-20 bg-violet-500" />

      {/* diagonal mesh */}
      <div
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg, rgba(255,255,255,.25) 0px, rgba(255,255,255,.25) 1px, transparent 1px, transparent 18px)",
        }}
      />

      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-20">
        <div className="mx-auto max-w-7xl px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logo} alt="SHS Logo" className="h-11 w-11 rounded-xl backdrop-blur-xl object-contain" />
            <div className="font-semibold tracking-wider">SHS Securities</div>
          </div>
          <nav className="hidden sm:flex items-center gap-6 text-white/80">
            <a className="hover:text-white transition" href="https://www.shs.com.vn/">Trang chủ</a>
            <a className="hover:text-white transition" href="https://www.shs.com.vn/ServicesProduct.aspx">Sản phẩm</a>
            <a className="hover:text-white transition" href="https://www.shs.com.vn/OpenLetter.aspx">Về SHS</a>
            <a className="hover:text-white transition" href="https://www.shs.com.vn/HowTo.aspx">Hỗ trợ</a>
          </nav>
          <a href="https://motaikhoan.shs.com.vn/vi/ekyc" target="_blank">
          <button className="rounded-xl bg-emerald-500/90 hover:bg-emerald-400 text-slate-950 font-semibold px-4 py-2 shadow-[0_10px_30px_-10px_rgba(16,185,129,.8)] transition">
            Mở tài khoản
          </button> </a>
        </div>
      </div>

      {/* Content Grid (no scroll) */}
      <div className="relative z-10 mx-auto max-w-7xl h-full px-5 grid grid-rows-[1fr_auto] sm:grid-rows-1 sm:grid-cols-2 gap-6 items-center">
        {/* Left: Copy & CTAs */}
        <div className="max-w-xl">
          <motion.h1
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative z-10 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-normal leading-[1.2] antialiased"          >
            Đầu tư thông minh,
            <span className="block bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 via-violet-300 to-emerald-300 pb-[10px]"> tương lai vững chắc</span>
          </motion.h1>          
          <motion.p
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.05 }}
            className="mt-6 text-white/75 text-base sm:text-lg leading-relaxed">           
            Nền tảng giao dịch chứng khoán SHS — nhanh chóng, an toàn, minh bạch. Công nghệ tối tân, phí cạnh tranh, hỗ trợ tận tâm.
          </motion.p>
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
            className="mt-6 flex flex-wrap gap-3">
          <a href="https://trading.shs.com.vn/" target="_blank"> 
            <button className="rounded-2xl px-5 py-3 bg-white text-slate-900 font-semibold shadow-[0_10px_30px_-10px_rgba(255,255,255,.6)] hover:opacity-90 transition">
              Bắt đầu ngay
            </button></a>
            <button
              onClick={() => setShowQR(v => !v)}
              aria-expanded={showQR}
              aria-controls="qr-panel"
              className="rounded-2xl px-5 py-3 border border-white/20 bg-white/10 backdrop-blur-xl font-semibold hover:bg-white/15 transition"
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
                    {/* Đặt ảnh vào public/qr-app.png hoặc thay link trực tiếp */}
                    <img src="source/qr-app.jpg" alt="QR tải ứng dụng" className="h-28 w-28 rounded-lg object-contain bg-white" />
                    <div className="text-sm text-white/80">
                      <div className="font-semibold mb-1">Quét QR để tải ứng dụng</div>
                      <div>iOS & Android — tự phát hiện nền tảng.</div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Feature pills */}
          <div className="mt-7 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <GlassPill
              icon={<TrendingUp className="h-5 w-5" />}
              title="Biểu đồ realtime"
              desc="Khớp lệnh nhanh, dữ liệu thị trường cập nhật tức thì."
            />
            <GlassPill
              icon={<ShieldCheck className="h-5 w-5" />}
              title="An toàn & tuân thủ"
              desc="Chuẩn bảo mật, đáp ứng quy định thị trường Việt Nam."
            />
            <GlassPill
              icon={<Zap className="h-5 w-5" />}
              title="Hiệu năng tối ưu"
              desc="Hệ thống ổn định, xử lý lệnh tốc độ cao."
            />
            <GlassPill
              icon={<Headphones className="h-5 w-5" />}
              title="Hỗ trợ 24/7"
              desc="Đội ngũ tư vấn tận tâm, giải đáp mọi lúc."
            />
          </div>
        </div>

        {/* Right: Glass chart panel */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative hidden sm:block">
          <div className="relative h-[420px] rounded-3xl border border-white/15 bg-white/10 backdrop-blur-2xl p-4 shadow-[0_30px_80px_-20px_rgba(59,130,246,0.35)]">
            <div className="absolute inset-0 rounded-3xl pointer-events-none shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2)]" />
            <AnimatedChart className="h-full w-full" />
            {/* Corner stats */}
            <div className="absolute top-4 left-4 rounded-xl border border-white/15 bg-black/30 backdrop-blur-xl px-3 py-2 text-sm">VNINDEX <span className="text-emerald-300 font-semibold">+1.24%</span></div>
            <div className="absolute bottom-4 right-4 rounded-xl border border-white/15 bg-black/30 backdrop-blur-xl px-3 py-2 text-sm">SHS <span className="text-emerald-300 font-semibold">+2.08%</span></div>
          </div>
        </motion.div>
      </div>

      {/* Bottom subtle footer within viewport */}
      <div className="absolute bottom-3 left-0 right-0 z-20">
        <div className="mx-auto max-w-7xl px-5 flex items-center justify-between text-xs text-white/60">
          <div>© {new Date().getFullYear()} SHS. All rights reserved.</div>
          <div className="hidden sm:flex gap-4">
            <a href="#terms" className="hover:text-white/80">Điều khoản</a>
            <a href="#privacy" className="hover:text-white/80">Bảo mật</a>
          </div>
        </div>
      </div>
    </div>
  );
}
