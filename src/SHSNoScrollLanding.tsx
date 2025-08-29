import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, ShieldCheck, Zap, Headphones } from "lucide-react";

/* ===== ASSETS (dark only) ===== */
import logo from "../source/LOGO.png";
import qrImg from "../source/qr-app.jpg";
import silkImg from "../source/silk.png";
import demoImage from "../source/bgIMG.jpg";
import demoVideo from "../source/bgVID.mp4";
import Carouse1 from "../source/IMGx (1).png"
import Carouse2 from "../source/IMGx (2).png"
import Carouse3 from "../source/IMGx (3).png"
import Carouse4 from "../source/IMGx (4).png"

import MagneticButton from "./components/MagneticButton";
import GlobalClickRipple from "./components/GlobalClickRipple";
import CTAArrowRipple from "./components/CTAArrowRipple"
import StackedCarouselFit, { StackedItem } from "./components/StackedCarouselFit";


/* ===== Mega menu data (giữ nguyên dữ liệu hiện có) ===== */
import menuData from "./assets/mega_menu.json";

/* ===== Types ===== */
type ChildItem = { title: string; url?: string | null };
type Section = { title: string; url?: string | null; children: ChildItem[] };
type RootMenu = { title: string; url?: string | null; sections: Section[] };
type MegaMenuData = { mains: RootMenu[] };
type SearchItem = { title: string; url?: string | null; group: string; path: string };

const HEADER_H = 96; // px (≈ pt-24)
const items: StackedItem[] = [
  { id: "1", image: Carouse1, header: "Giao dịch Nhanh", content: "Khớp lệnh ổn định, phí cạnh tranh." },
  { id: "2", image: Carouse2, header: "Bảo mật & Tuân thủ", content: "An toàn, tuân thủ quy định." },
  { id: "3", image: Carouse3, header: "Biểu đồ & Dữ liệu", content: "Realtime, trực quan." },
  { id: "3", image: Carouse4, header: "Tư vấn đầu tư", content: "Nhiệt tình, chuyên nghiệp" },
];

/* ===== V1 chart ===== */
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

      <motion.path d={d} fill="none" stroke="url(#strokeGrad)" strokeWidth="3" filter="url(#glow)"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2.2, ease: "easeInOut" }} />
      <motion.path d={d} fill="none" stroke="#ffffff" strokeWidth="5" strokeDasharray="0.001 9999"
        initial={{ strokeDashoffset: 9999 }} animate={{ strokeDashoffset: 0 }}
        transition={{ duration: 2.2, ease: "easeInOut" }} opacity={0.7} />
    </svg>
  );
}

function GlassPill({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl backdrop-blur-xl p-4 sm:p-5
                    border border-white/15 bg-white/10 text-white
                    shadow-[0_8px_40px_-12px_rgba(0,0,0,0.5)] hover:bg-white/12 transition">
      <div className="flex items-start gap-3 relative z-10">
        <div className="rounded-xl bg-white/10 p-2 border border-white/10">{icon}</div>
        <div>
          <div className="font-semibold tracking-wide">{title}</div>
          <div className="text-white/75 text-sm leading-snug mt-1">{desc}</div>
        </div>
      </div>
      <span className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/20 to-transparent
                       opacity-0 pointer-events-none group-hover:animate-hoverSweep" />
      <div className="pointer-events-none absolute inset-0 rounded-2xl shadow-[inset_0_1px_0_0_rgba(255,255,255,0.18)]" />
    </div>
  );
}

/* ===== V1 content (không header/footer) ===== */
function LegacyV1() {
  const [showQR, setShowQR] = React.useState(false);

  return (
    <div className="relative h-full">
      {/* blobs & silk */}
      <div className="pointer-events-none absolute -top-40 -left-40 h-96 w-96 rounded-full blur-3xl opacity-25 bg-cyan-500" />
      <div className="pointer-events-none absolute -bottom-48 -right-40 h-[28rem] w-[28rem] rounded-full blur-3xl opacity-20 bg-violet-500" />
      <img src={silkImg} alt="Silk background"
           className="fixed bottom-[-95px] right-[-40px] object-contain z-0 opacity-80 pointer-events-none"
           style={{ maxWidth: "50vw", maxHeight: "50vh" }} />
      <div className="absolute inset-0 opacity-[0.06] pointer-events-none"
           style={{ backgroundImage: "repeating-linear-gradient(135deg, rgba(255,255,255,.22) 0px, rgba(255,255,255,.22) 1px, transparent 1px, transparent 18px)" }} />

      {/* grid */}
      <div className="relative z-10 mx-auto max-w-7xl min-h-[calc(100dvh-96px)] px-5 grid grid-rows-[auto_auto] sm:grid-rows-1 sm:grid-cols-2 gap-6 items-start py-10 pt-10 sm:pt-0">
        {/* chart 
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative order-1 sm:order-2">
          <div className="relative isolate rounded-3xl h-[260px] sm:h-[420px]">
            <div aria-hidden className="absolute inset-0 rounded-3xl bg-[#0b1324]/80 pointer-events-none" />
            <div className="relative h-full rounded-3xl border border-white/15 bg-white/10 backdrop-blur-2xl p-4 shadow-[0_30px_80px_-20px_rgba(59,130,246,0.35)]">
              <div className="absolute inset-0 rounded-3xl pointer-events-none shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2)]" />
              <AnimatedChart className="h-full w-full" />
              <div className="absolute top-4 left-4 rounded-xl border border-white/15 bg-black/30 backdrop-blur-xl px-3 py-2 text-sm text-white">
                VNINDEX <span className="text-emerald-300 font-semibold">+1.24%</span>
              </div>
              <div className="absolute bottom-4 right-4 rounded-xl border border-white/15 bg-black/30 backdrop-blur-xl px-3 py-2 text-sm text-white">
                SHS <span className="text-emerald-300 font-semibold">+2.08%</span>
              </div>
            </div>
          </div>
        </motion.div> */}
        
        {/* copy + CTAs */}
        <div className="max-w-xl">
          <motion.h1 initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative z-10 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-normal leading-[1.2] antialiased text-white">
            Đầu tư thông minh,
            <span className="block bg-clip-text text-transparent pb-[10px] bg-gradient-to-r from-cyan-300 via-violet-300 to-emerald-300">
              {" "}tương lai vững chắc
            </span>
          </motion.h1>

          <motion.p initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.05 }}
            className="mt-6 text-white/75 text-base sm:text-lg leading-relaxed">
            Nền tảng giao dịch chứng khoán SHS — nhanh chóng, an toàn, <br /> minh bạch.
            Công nghệ tối tân, phí cạnh tranh, hỗ trợ tận tâm.
          </motion.p>

          <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
            className="mt-6 flex flex-wrap gap-3">

            {/* ==== Nút v1 giữ nguyên (dark-only) ==== */}
            <a href="https://trading.shs.com.vn/" target="_blank" rel="noreferrer">
              <button
                className="relative overflow-hidden rounded-2xl px-6 py-3 font-semibold text-white
                           backdrop-blur-xl
                           bg-orange-200/10 border border-orange-600/30
                           hover:bg-orange-200/30 hover:shadow-[0_0_35px_rgba(254,215,170,1)]">
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
                         transition duration-500 ease-out">
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
                  className="w-full overflow-hidden">
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
        <div className="h-[515px]">  {/* CHÍNH là chiều cao khung (bên trái chart) */}
          <StackedCarouselFit
            items={items}
            designCardW={300}      // co nhỏ design space để scale up cho chắc
            designCardH={480}
            designPeek={0}
            safeTop={50}
            safeBottom={0}        // tăng nếu muốn cách đáy nhiều hơn
          />
        </div>
      </div>
    </div>
  );
}

/* ===== Main: v2 ⇄ v1 dark-only ===== */
type Stage = "v2" | "transition" | "v1";
type SweepDir = "up" | "down";

export default function SHSNoScrollLanding() {
  // v2 BG mode
  const [bgMode, setBgMode] = React.useState<"brand" | "image" | "video">("video");

  // mega menu state
  const MEGA = menuData as MegaMenuData;
  const findMainIndex = (kw: string) => Math.max(0, MEGA.mains.findIndex((m) => m.title.toLowerCase().includes(kw.toLowerCase())));
  const [open, setOpen] = React.useState<null | "mega">(null);
  const [mainIdx, setMainIdx] = React.useState<number>(() => findMainIndex("Về SHS"));
  const [sectionIdx, setSectionIdx] = React.useState<number>(0);

  // search
  const hideTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const INDEX = React.useMemo<SearchItem[]>(() => {
    const items: SearchItem[] = [];
    MEGA.mains.forEach((m) => {
      items.push({ title: m.title, url: m.url, group: "Main", path: m.title });
      m.sections?.forEach((s) => {
        items.push({ title: s.title, url: s.url, group: m.title, path: `${m.title} › ${s.title}` });
        s.children?.forEach((c) => {
          items.push({ title: c.title, url: c.url, group: `${m.title} / ${s.title}`, path: `${m.title} › ${s.title} › ${c.title}` });
        });
      });
    });
    return items;
  }, [MEGA]);
  const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
  const score = (q: string, t: string) => {
    const nq = norm(q), nt = norm(t);
    if (!nq) return 0;
    let sc = 0;
    if (nt.startsWith(nq)) sc += 3;
    if (nt.includes(nq)) sc += 1;
    sc += nq.split(" ").filter((tk) => tk && nt.includes(tk)).length * 0.5;
    return sc;
  };
  const [q, setQ] = React.useState("");
  const [openDrop, setOpenDrop] = React.useState(false);
  const results = React.useMemo(() => {
    if (!q) return [] as SearchItem[];
    return INDEX.map((i) => ({ i, s: Math.max(score(q, i.title), score(q, i.path)) }))
      .filter((x) => x.s > 0).sort((a, b) => b.s - a.s).slice(0, 8).map((x) => x.i);
  }, [q, INDEX]);
  const handleSelect = (url?: string | null) => {
    if (hideTimer.current) clearTimeout(hideTimer.current);
    setOpenDrop(false);
    if (url) window.location.href = url;
  };

  // transition
  const [stage, setStage] = React.useState<Stage>("v2");
  const [sweepOn, setSweepOn] = React.useState(false);
  const [sweepDir, setSweepDir] = React.useState<SweepDir>("up");

  const startTransition = () => {
    if (stage !== "v2") return;
    setSweepDir("up");
    setStage("transition");
    setSweepOn(true);
    setTimeout(() => { setStage("v1"); setSweepOn(false); }, 900);
  };
  const backToV2 = () => {
    if (stage !== "v1") return;
    setSweepDir("down");
    setStage("transition");
    setSweepOn(true);
    setTimeout(() => { setStage("v2"); setSweepOn(false); }, 900);
  };

  const currentMain: RootMenu | undefined = MEGA.mains[mainIdx];
  const HEADER_H = 96; // px ~ h-24

  return (
    <div className="relative h-[100dvh] w-full overflow-hidden bg-[#0b1220] text-white">
      {/* ===== BG (v2 only) ===== */}
      {stage !== "v1" && bgMode === "brand" && (
        <div className="absolute inset-0 z-0 pointer-events-none"
             style={{ background:
               "radial-gradient(1200px 800px at 15% 10%, rgba(56,189,248,0.25), transparent 60%), \
                radial-gradient(1000px 700px at 90% 85%, rgba(167,139,250,0.22), transparent 55%), \
                linear-gradient(180deg, #0b1220 0%, #070c16 100%)" }} />
      )}
      {stage !== "v1" && bgMode === "image" && (
        <div className="absolute inset-0 z-0 pointer-events-none">
          <img src={demoImage} alt="Background" className="w-full h-full object-cover pointer-events-none" />
          <div className="absolute inset-0 bg-black/35 pointer-events-none" />
        </div>
      )}
      {stage !== "v1" && bgMode === "video" && (
        <div className="absolute inset-0 z-0 pointer-events-none">
          <video className="w-full h-full object-cover pointer-events-none" src={demoVideo} autoPlay muted loop playsInline />
          <div className="absolute inset-0 bg-black/35 pointer-events-none" />
        </div>
      )}

      {/* ===== HEADER (fixed spacing) ===== */}
      <header
        className="fixed top-0 left-0 right-0 z-[500] w-full group/header"
        onMouseLeave={() => { setOpen(null); setSectionIdx(0); }}
      >
        {/* glass overlay toàn header khi hover/mở menu */}
        <span
          className={[
            "pointer-events-none absolute inset-0",
            // bỏ rounded để không lộ mép bo
            // chỉ giữ hairline mỏng nếu muốn
            "border-b border-white/10",
            "bg-white/8 backdrop-blur-md",
            "shadow-[0_2px_12px_-6px_rgba(0,0,0,0.35)]",                 // <<< bỏ bóng đổ gây vệt
            "opacity-0 transition",
            "group-hover/header:opacity-100",
            open ? "opacity-100" : "",
          ].join(" ")}
        />
        <div className="relative mx-auto max-w-7xl px-5 py-4 flex items-center gap-5">
          {/* logo */}
          <div className="shrink-0 flex items-center gap-3">
            <a href="https://shs-uat.shs.com.vn/vi">
              <div className="flex items-center gap-3 shrink-0">
                <img src={logo} alt="SHS Logo" className="h-full max-h-20 w-auto object-contain transition-opacity" />
              </div>
            </a>
          </div>

          {/* nav giữa (căn phải) */}
          <div className="flex-1 flex justify-end">
            <nav className="hidden sm:flex items-center gap-3 md:gap-6 transition">
              <button
                type="button"
                onMouseEnter={() => { setOpen("mega"); setMainIdx(findMainIndex("Về SHS")); setSectionIdx(0); }}
                className="px-2 py-1 rounded-md hover:bg-white/10">Về SHS</button>
              <button
                type="button"
                onMouseEnter={() => { setOpen("mega"); setMainIdx(findMainIndex("sản phẩm")); setSectionIdx(0); }}
                className="px-2 py-1 rounded-md hover:bg-white/10">Sản phẩm - Dịch vụ</button>
            </nav>
          </div>

          {/* cột phải: search + mở TK */}
          <div className="shrink-0 flex items-center gap-3">
            <div className="relative hidden lg:block"
              onMouseEnter={() => { if (hideTimer.current) clearTimeout(hideTimer.current); }}
              onMouseLeave={() => { hideTimer.current = setTimeout(() => setOpenDrop(false), 300); }}>
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm opacity-80">🔍</span>
              <input
                type="search" value={q}
                onChange={(e) => { setQ(e.target.value); setOpenDrop(true); }}
                onFocus={() => q && setOpenDrop(true)}
                onKeyDown={(e) => {
                  if (e.key === "Escape") { setOpenDrop(false); (e.target as HTMLInputElement).blur(); }
                  if (e.key === "Enter" && results[0]) handleSelect(results[0].url);
                }}
                placeholder="Mã CP, sản phẩm, dịch vụ, tin tức..."
                className="w-[280px] rounded-xl pl-9 pr-3 py-2 text-sm outline-none bg-white/10 text-white border border-white/15 focus:bg-white/15 shadow" />
              {openDrop && q && (
                <div className="absolute left-0 right-0 mt-2 rounded-xl overflow-hidden border border-white/12 bg-[#0b1220]/95 backdrop-blur-xl shadow-[0_20px_40px_-20px_rgba(0,0,0,0.65)] z-50">
                  <ul className="max-h-80 overflow-auto py-1">
                    {results.map((r) => (
                      <li key={r.path}>
                        <button onMouseDown={(e) => e.preventDefault()} onClick={() => handleSelect(r.url)}
                                className="w-full text-left px-3 py-2 text-sm hover:bg-white/10">
                          <div className="font-medium">{r.title}</div>
                          <div className="text-xs opacity-70">{r.path}</div>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <a href="https://motaikhoan.shs.com.vn/vi/ekyc" target="_blank" rel="noreferrer">
              <MagneticButton />
            </a>
          </div>
        </div>

        {/* MEGA MENU */}
        {open === "mega" && currentMain && (
          <div className="absolute left-0 right-0 top-[100%] z-40">
            <div className="mx-auto max-w-7xl px-4 sm:px-5 pt-4 pb-6 rounded-3xl border border-white/12
                            bg-white/[0.08] backdrop-blur-xl shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)] transition"
                 onMouseLeave={() => { setOpen(null); setSectionIdx(0); }}>
              <div className="flex items-center justify-between mb-3">
                <a href={currentMain.url || "#"} className="text-sm font-semibold underline underline-offset-4 hover:opacity-80">
                  {currentMain.title}
                </a>
              </div>

              <div className="grid grid-cols-[220px_260px_1fr] gap-6 min-h-[260px]">
                <div className="pr-2 border-r border-white/10">
                  <ul className="space-y-1">
                    {MEGA.mains.map((m, i) => (
                      <li key={m.title}>
                        <a href={m.url || "#"} onMouseEnter={() => { setMainIdx(i); setSectionIdx(0); }}
                           className={["block rounded-lg px-3 py-2 text-sm", i === mainIdx ? "bg-white/15 shadow" : "hover:bg-white/10"].join(" ")}>
                          {m.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="pr-2 border-r border-white/10">
                  <ul className="space-y-1">
                    {(currentMain.sections || []).map((sec, i) => (
                      <li key={sec.title}>
                        <a href={sec.url || "#"} onMouseEnter={() => setSectionIdx(i)}
                           className={["block rounded-lg px-3 py-2 text-sm", i === sectionIdx ? "bg-white/15 shadow" : "hover:bg-white/10"].join(" ")}>
                          {sec.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  {currentMain.sections?.[sectionIdx]?.children?.length ? (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
                      {currentMain.sections[sectionIdx].children.map((child) => (
                        <a key={child.title} href={child.url || "#"} className="rounded-lg px-3 py-2 text-sm hover:bg-white/10">
                          {child.title}
                        </a>
                      ))}
                    </div>
                  ) : (
                    <div className="opacity-70 text-sm px-1 py-2">Chưa có mục con.</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* ===== V2 content (hero), để dưới header ===== */}
      <motion.div initial={false} animate={{ opacity: stage === "transition" ? 0 : 1 }} transition={{ duration: 0.3 }}
        className={stage === "v1" ? "hidden" : ""}>
        <div className="absolute left-0 right-0 bottom-0 z-[200] pointer-events-none" style={{ top: HEADER_H }}>
          <div className="mx-auto max-w-7xl px-5 h-full grid grid-cols-4 items-end">
            <div className="col-span-1 col-start-1 mb-[10vh] max-w-xl text-left pointer-events-auto">
              <a href="https://www.shs.com.vn/" target="_blank" rel="noreferrer" className="inline-block" aria-label="SHS Website">
                <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: "easeOut" }}
                  className="font-gilroy font-bold text-7xl sm:text-8xl lg:text-9xl tracking-tight 
                             bg-clip-text text-transparent drop-shadow-[0_8px_35px_rgba(250,149,40,0.35)]
                             bg-gradient-to-r from-[#FA9528] to-[#F76F08]">
                  SHS
                </motion.h1>
              </a>
              <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut", delay: 0.05 }}
                className="font-gilroy mt-3 text-2xl sm:text-3xl lg:text-4xl font-semibold text-white whitespace-nowrap drop-shadow-[0_1px_10px_rgba(0,0,0,0.35)]">
                Kiến tạo tài chính thịnh vượng
              </motion.p>
              <motion.div initial={{ scaleX: 0, opacity: 0 }} animate={{ scaleX: 1, opacity: 1 }} transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
                className="mt-4 h-1 w-32 rounded-full bg-gradient-to-r from-[#FA9528] to-[#F76F08]" />
            </div>
          </div>
        </div>

        {/* BG mode dock */}
        <div className="fixed right-3 sm:top-1/2 sm:-translate-y-1/2 bottom-3 sm:bottom-auto z-30 pointer-events-auto">
          <div className="flex flex-col items-center gap-2 p-2 rounded-2xl border border-white/12 bg-white/10 backdrop-blur-md shadow-lg">
            {[
              { key: "brand" as const, label: "B", title: "Brand" },
              { key: "image" as const, label: "Img", title: "Image" },
              { key: "video" as const, label: "Vid", title: "Video" },
            ].map(({ key, label, title }) => (
              <button key={key} onClick={() => setBgMode(key)} aria-pressed={bgMode === key} aria-label={title} title={title}
                className={`w-9 h-9 rounded-lg text-[11px] font-semibold transition border border-white/15
                            ${bgMode === key ? "bg-gradient-to-b from-[#FA9528] to-[#F76F08] text-white shadow-md" : "bg-white/10 text-white hover:bg-white/15"}`}>
                {label}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ===== Sweep overlay (2 chiều, luôn dark) ===== */}
      <motion.div aria-hidden className="pointer-events-none fixed inset-0 z-[300]"
        style={{ transformOrigin: sweepDir === "up" ? "bottom center" : "top center" }}
        initial={false} animate={{ scaleY: sweepOn ? 1 : 0 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}>
        <div className="absolute inset-0" style={{ background:
          "radial-gradient(1200px 800px at 15% 100%, rgba(56,189,248,0.25), transparent 60%),\
           radial-gradient(900px 600px at 85% 80%, rgba(167,139,250,0.22), transparent 55%),\
           linear-gradient(180deg, #0b1220 0%, #070c16 100%)" }} />
      </motion.div>

      {/* ===== V1 overlay (no-scroll, né header bằng pt) ===== */}
      <div className={stage === "v1" ? "absolute inset-0 z-[400]" : "hidden"}>
        <div className="absolute inset-0 overflow-hidden pt-24 sm:pt-28">
          <LegacyV1 />
        </div>
      </div>

      {/* ===== Footer ===== */}
      <footer className="absolute bottom-3 left-0 right-0 z-[150] text-white/80">
        <div className="mx-auto max-w-7xl px-5 flex items-center justify-between text-xs">
          <div>© {new Date().getFullYear()} SHS. All rights reserved.</div>
          <div className="hidden sm:flex gap-4">
            <a href="#terms" className="hover:opacity-80">Điều khoản</a>
            <a href="#privacy" className="hover:opacity-80">Bảo mật</a>
          </div>
        </div>
      </footer>

      {/* ===== Arrow buttons ===== */}
      {stage === "v2" && (
        <CTAArrowRipple
          onClick={() => {
            setSweepDir("up");
            startTransition();
          }}
        />
      )}

      {stage === "v1" && (
        <CTAArrowRipple
          direction="up" // nếu comp có props đổi icon hướng
          onClick={() => {
            backToV2();
          }}
        />
      )}

      <GlobalClickRipple />
    </div>
  );
}
