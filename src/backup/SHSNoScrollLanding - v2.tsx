import React, { useState } from "react";
import { motion } from "framer-motion";
import logo from "../source/LOGO.png";
import logo_L from "../source/LOGO_D.png";
import MagneticButton from "./components/MagneticButton";
import GlobalClickRipple from "./components/GlobalClickRipple";
import ThemeToggle from "./components/ThemeToggle";
import demoImage from "../source/bgIMG.jpg"
import demoVideo from "../source/bgVID.mp4"
import menuData from "./assets/mega_menu.json";

type ChildItem = { title: string; url?: string | null };
type Section = { title: string; url?: string | null; children: ChildItem[] };
type RootMenu = { title: string; url?: string | null; sections: Section[] };
type MegaMenuData = { mains: RootMenu[] };

export default function SHSNoScrollLanding() {
  const [bgMode, setBgMode] = useState<"brand" | "image" | "video">("video");
  
  // Demo background assets
  //const demoImage =
  //  "https://images.unsplash.com/photo-1553729784-e91953dec042?q=80&w=1920&auto=format&fit=crop";
  //const demoVideo =
  //  "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4";
  
  const MEGA = menuData as MegaMenuData;
  const findMainIndex = (kw: string) =>
    Math.max(
      0,
      MEGA.mains.findIndex(m => m.title.toLowerCase().includes(kw.toLowerCase()))
    );

  const [open, setOpen] = useState<null | "mega">(null);
  const [mainIdx, setMainIdx] = useState<number>(() => findMainIndex("Về SHS"));
  const [sectionIdx, setSectionIdx] = useState<number>(0);

  // ===== Search index & logic =====
    type SearchItem = { title: string; url?: string | null; group: string; path: string };
    const hideTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
    const INDEX = React.useMemo<SearchItem[]>(() => {
      const items: SearchItem[] = [];
      MEGA.mains.forEach((m) => {
        items.push({ title: m.title, url: m.url, group: "Main", path: m.title });
        m.sections?.forEach((s) => {
          items.push({ title: s.title, url: s.url, group: m.title, path: `${m.title} › ${s.title}` });
          s.children?.forEach((c) => {
            items.push({
              title: c.title,
              url: c.url,
              group: `${m.title} / ${s.title}`,
              path: `${m.title} › ${s.title} › ${c.title}`,
            });
          });
        });
      });
      return items;
    }, [MEGA]);

    const norm = (s: string) =>
      s
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9\s]/g, " ")
        .replace(/\s+/g, " ")
        .trim();

    const score = (q: string, t: string) => {
      const nq = norm(q), nt = norm(t);
      if (!nq) return 0;
      let s = 0;
      if (nt.startsWith(nq)) s += 3;
      if (nt.includes(nq)) s += 1;
      const toks = nq.split(" ");
      s += toks.filter((tk) => tk && nt.includes(tk)).length * 0.5;
      return s;
    };

    const [q, setQ] = React.useState("");
    const [openDrop, setOpenDrop] = React.useState(false);

    const results = React.useMemo(() => {
      if (!q) return [] as SearchItem[];
      return INDEX
        .map((i) => ({ i, s: Math.max(score(q, i.title), score(q, i.path)) }))
        .filter((x) => x.s > 0)
        .sort((a, b) => b.s - a.s)
        .slice(0, 8)
        .map((x) => x.i);
    }, [q, INDEX]);

    const handleSelect = (url?: string | null) => {
      setOpenDrop(false);
      if (url) window.location.href = url;
    };

  const currentMain: RootMenu | undefined = MEGA.mains[mainIdx];

  const btn = (active: boolean) =>
    `rounded-xl px-3 py-1.5 border text-xs transition ${
      active
        ? "bg-white/80 text-slate-900 border-white shadow-sm dark:bg-white/20 dark:text-white dark:border-white/30"
        : "bg-white/20 text-white/80 border-white/20 hover:bg-white/30"
    }`;

  return (
    <div
      className="relative min-h-[100dvh] w-full overflow-y-auto
                 bg-transparent text-slate-800 dark:text-white"
    >
      {/* ===== Fullscreen Background (z-0 so it's visible) ===== */}
      {bgMode === "brand" && (
        <>
          {/* Light mode background */}
          <div
            className="absolute inset-0 z-0 pointer-events-none dark:hidden"
            style={{
              background:
                "radial-gradient(1200px 800px at 15% 10%, rgba(56,189,248,0.35), transparent 60%), \
                radial-gradient(1000px 700px at 90% 85%, rgba(167,139,250,0.28), transparent 55%), \
                linear-gradient(180deg, #f9fafb 0%, #e2e8f0 100%)",
            }}
          />

          {/* Dark mode background */}
          <div
            className="absolute inset-0 z-0 pointer-events-none hidden dark:block"
            style={{
              background:
                "radial-gradient(1200px 800px at 15% 10%, rgba(56,189,248,0.25), transparent 60%), \
                radial-gradient(1000px 700px at 90% 85%, rgba(167,139,250,0.22), transparent 55%), \
                linear-gradient(180deg, #0b1220 0%, #070c16 100%)",
            }}
          />
        </>
      )}

      {bgMode === "image" && (
        <div className="absolute inset-0 z-0 pointer-events-none">
          <img src={demoImage} alt="Background" className="w-full h-full object-cover pointer-events-none" />
          <div className="absolute inset-0 bg-black/35 pointer-events-none" />
        </div>
      )}

      {bgMode === "video" && (
        <div className="absolute inset-0 z-0 pointer-events-none">
          <video
            className="w-full h-full object-cover pointer-events-none"
            src={demoVideo}
            autoPlay
            muted
            loop
            playsInline
          />
          <div className="absolute inset-0 bg-black/35 pointer-events-none" />
        </div>
      )}

      {/* ===== Header (kept) ===== */}
      <header
        className="relative z-30 w-full group/header"
        onMouseLeave={() => {
          setOpen(null);
          setSectionIdx(0);   // nếu đang dùng state sectionIdx
          // hoặc đơn giản chỉ setOpen(null) thôi cũng đủ
        }}
      >
        {/* Glass overlay phủ toàn header khi hover hoặc khi mở menu */}
        <span
          className={[
            "pointer-events-none absolute inset-0 rounded-2xl",
            "border border-white/20 dark:border-white/15",
            "bg-white/40 dark:bg-white/10 backdrop-blur-md",
            "shadow-[0_8px_40px_-12px_rgba(0,0,0,0.25)]",
            "opacity-0 transition",
            "group-hover/header:opacity-100",
            open ? "opacity-100" : ""
          ].join(" ")}
        />

        <div className="relative mx-auto max-w-7xl px-5 py-4 flex items-center gap-5">
          {/* CỘT TRÁI: LOGO */}
          <div className="shrink-0 flex items-center gap-3">
            <a href="https://shs-uat.shs.com.vn/vi">
              <div className="flex items-center gap-3 shrink-0">
                <img
                  src={logo_L}
                  alt="SHS Logo Light"
                  className="h-full max-h-20 w-auto object-contain dark:hidden transition-opacity"
                />
                <img
                  src={logo}
                  alt="SHS Logo Dark"
                  className="h-full max-h-20 w-auto object-contain hidden dark:block transition-opacity"
                />
              </div>
            </a>
          </div>

          {/* CỘT GIỮA: NAV — CĂN GIỮA */}
          <div className="flex-1 flex justify-end">
            <nav className="hidden sm:flex items-center gap-3 md:gap-6 transition
                            text-slate-700 hover:text-slate-900
                            dark:text-white/80 dark:hover:text-white">
              {/* Về SHS */}
              <button
                type="button"
                onMouseEnter={() => {
                  setOpen("mega");
                  setMainIdx(findMainIndex("Về SHS"));
                  setSectionIdx(0);
                }}
                className="px-2 py-1 rounded-md hover:bg-white/40 dark:hover:bg-white/10"
              >
                Về SHS
              </button>
              {/* Sản phẩm - Dịch vụ */}
              <button
                type="button"
                onMouseEnter={() => {
                  setOpen("mega");
                  setMainIdx(findMainIndex("sản phẩm"));
                  setSectionIdx(0);
                }}
                className="px-2 py-1 rounded-md hover:bg-white/40 dark:hover:bg-white/10"
              >
                Sản phẩm - Dịch vụ
              </button>
            </nav>
          </div>

          {/* CỘT PHẢI: SEARCH + THEME + MỞ TK */}
          <div className="shrink-0 flex items-center gap-3">
            {/* Searchbox block (đã có icon 🔍, dropdown, delay 300ms) */}
            <div
              className="relative hidden lg:block"
              onMouseEnter={() => { if (hideTimer.current) clearTimeout(hideTimer.current); }}
              onMouseLeave={() => { hideTimer.current = setTimeout(() => setOpenDrop(false), 300); }}
            >
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm opacity-70">
                🔍
              </span>
              <input
                type="search"
                value={q}
                onChange={(e) => { setQ(e.target.value); setOpenDrop(true); }}
                onFocus={() => q && setOpenDrop(true)}
                onKeyDown={(e) => {
                  if (e.key === "Escape") { setOpenDrop(false); (e.target as HTMLInputElement).blur(); }
                  if (e.key === "Enter" && results[0]) handleSelect(results[0].url);
                }}
                placeholder="Mã CP, sản phẩm, dịch vụ, tin tức..."
                className="w-[280px] rounded-xl pl-9 pr-3 py-2 text-sm outline-none
                          bg-white/70 text-slate-900 border border-slate-300
                          focus:bg-white shadow
                          dark:bg-white/10 dark:text-white dark:border-white/15 dark:focus:bg-white/15"
              />
              {openDrop && q && (
                <div className="absolute left-0 right-0 mt-2 rounded-xl overflow-hidden
                                border border-white/30 dark:border-white/10
                                bg-white/90 dark:bg-[#0b1220]/90 backdrop-blur-xl
                                shadow-[0_20px_40px_-20px_rgba(0,0,0,0.45)] z-50">
                  <ul className="max-h-80 overflow-auto py-1">
                    {results.map((r) => (
                      <li key={r.path}>
                        <button
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => handleSelect(r.url)}
                          className="w-full text-left px-3 py-2 text-sm
                                    hover:bg-white/70 hover:text-slate-900
                                    dark:hover:bg-white/10"
                        >
                          <div className="font-medium">{r.title}</div>
                          <div className="text-xs opacity-70">{r.path}</div>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Theme + Mở tài khoản */}
            {/* <ThemeToggle />  // nếu muốn bật lại */}
            <a href="https://motaikhoan.shs.com.vn/vi/ekyc" target="_blank" rel="noreferrer">
              <MagneticButton />
            </a>
          </div>
        </div>

        {/* ========== MEGA MENU GLASS BOX ========== */}
        
        {open === "mega" && currentMain && (
          <div className="absolute left-0 right-0 top-[100%] z-40">
            <div
              className="mx-auto max-w-7xl px-4 sm:px-5 pt-4 pb-6
                        rounded-3xl border border-white/20 dark:border-white/15
                        bg-white/60 dark:bg-white/[0.08] backdrop-blur-xl
                        shadow-[0_20px_60px_-20px_rgba(0,0,0,0.45)]
                        transition"
              onMouseLeave={() => {
                setOpen(null);
                setSectionIdx(0);
              }}
            >
              {/* Tiêu đề main hiện tại (click vẫn vào trang tổng) */}
              <div className="flex items-center justify-between mb-3">
                <a
                  href={currentMain.url || "#"}
                  className="text-sm font-semibold underline underline-offset-4 hover:opacity-80"
                >
                  {currentMain.title}
                </a>

                {/* Mini search cho màn hẹp */}
                <div className="relative lg:hidden">
                  <input
                    type="search"
                    placeholder="Tìm nhanh..."
                    className="w-[220px] rounded-lg px-3 py-2 text-sm outline-none
                              bg-white/80 text-slate-900 border border-slate-300
                              focus:bg-white shadow
                              dark:bg-white/10 dark:text-white dark:border-white/15 dark:focus:bg-white/15"
                  />
                </div>
              </div>

              {/* Bố cục: [Main menu đầy đủ] | [Sections] | [Children] */}
              <div className="grid grid-cols-[220px_260px_1fr] gap-6 min-h-[260px]">
                {/* Cột 1: MAIN MENU (đủ mục lớn từ Excel) */}
                <div className="pr-2 border-r border-white/30 dark:border-white/10">
                  <ul className="space-y-1">
                    {MEGA.mains.map((m, i) => (
                      <li key={m.title}>
                        <a
                          href={m.url || "#"}
                          onMouseEnter={() => {
                            setMainIdx(i);
                            setSectionIdx(0);
                          }}
                          className={[
                            "block rounded-lg px-3 py-2 text-sm",
                            i === mainIdx
                              ? "bg-white/70 text-slate-900 shadow dark:bg-white/15 dark:text-white"
                              : "hover:bg-white/50 dark:hover:bg-white/10"
                          ].join(" ")}
                        >
                          {m.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Cột 2: SECTIONS của main đang chọn */}
                <div className="pr-2 border-r border-white/30 dark:border-white/10">
                  <ul className="space-y-1">
                    {(currentMain.sections || []).map((sec, i) => (
                      <li key={sec.title}>
                        <a
                          href={sec.url || "#"}
                          onMouseEnter={() => setSectionIdx(i)}
                          className={[
                            "block rounded-lg px-3 py-2 text-sm",
                            i === sectionIdx
                              ? "bg-white/70 text-slate-900 shadow dark:bg-white/15 dark:text-white"
                              : "hover:bg-white/50 dark:hover:bg-white/10"
                          ].join(" ")}
                        >
                          {sec.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Cột 3: CHILDREN của section đang chọn */}
                <div>
                  {currentMain.sections?.[sectionIdx]?.children?.length ? (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
                      {currentMain.sections[sectionIdx].children.map((child) => (
                        <a
                          key={child.title}
                          href={child.url || "#"}
                          className="rounded-lg px-3 py-2 text-sm hover:bg-white/50 dark:hover:bg-white/10"
                        >
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

      {/* ===== Hero text — left-aligned, placed in bottom-right quadrant ===== */}
      <div className="absolute inset-0 z-20 pointer-events-none">
        <div className="mx-auto max-w-7xl px-5 h-full grid grid-cols-4 items-end">
          <div className="col-span-1 col-start-1 mb-[10vh] max-w-xl text-left pointer-events-auto">
            <a
              href="https://www.shs.com.vn/"
              target="_blank"
              rel="noreferrer"
              className="inline-block"
              aria-label="SHS Website"
            >
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="font-gilroy font-bold text-7xl sm:text-8xl lg:text-9xl font-black tracking-tight 
                          bg-clip-text text-transparent 
                          drop-shadow-[0_8px_35px_rgba(250,149,40,0.35)]
                          bg-gradient-to-r from-[#FA9528] to-[#F76F08]"
              >
                SHS
              </motion.h1>
            </a>

            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.05 }}
              className="font-gilroy mt-3 text-2xl sm:text-3xl lg:text-4xl font-semibold 
                        text-white whitespace-nowrap
                        drop-shadow-[0_1px_10px_rgba(0,0,0,0.35)]"
            >
              Kiến tạo tài chính thịnh vượng
            </motion.p>

            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
              className="mt-4 h-1 w-32 rounded-full 
                        bg-gradient-to-r from-[#FA9528] to-[#F76F08]"
            />
          </div>
        </div>
      </div>

      {/* ===== Footer (kept) ===== */}
      <footer className="sticky bottom-0 sm:absolute sm:bottom-3 left-0 right-0 z-20 text-slate-200">
        <div className="mx-auto max-w-7xl px-5 flex items-center justify-between text-xs">
          <div>© {new Date().getFullYear()} SHS. All rights reserved.</div>
          <div className="hidden sm:flex gap-4">
            <a href="#terms" className="hover:opacity-80">
              Điều khoản
            </a>
            <a href="#privacy" className="hover:opacity-80">
              Bảo mật
            </a>
          </div>
        </div>
      </footer>

      {/* ===== BG Mode Dock (theo light/dark) ===== */}
      <div className="fixed right-3 sm:top-1/2 sm:-translate-y-1/2 bottom-3 sm:bottom-auto z-30 pointer-events-auto">
        <div className="flex flex-col items-center gap-2 p-2 rounded-2xl
                        border border-slate-200/60 dark:border-white/15
                        bg-white/60 dark:bg-black/40
                        backdrop-blur-md shadow-lg">
          {[
            { key: 'brand' as const, label: 'B', title: 'Brand' },
            { key: 'image' as const, label: 'Img', title: 'Image' },
            { key: 'video' as const, label: 'Vid', title: 'Video' },
          ].map(({ key, label, title }) => (
            <button
              key={key}
              onClick={() => setBgMode(key)}
              aria-pressed={bgMode === key}
              aria-label={title}
              title={title}
              className={
                `w-9 h-9 rounded-lg text-[11px] font-semibold transition
                focus:outline-none focus:ring-2 focus:ring-orange-300/60 dark:focus:ring-orange-400/50
                ${bgMode === key
                  // ACTIVE: gradient cam
                  ? 'bg-gradient-to-b from-[#FA9528] to-[#F76F08] text-white shadow-md'
                  // INACTIVE: border tối ở light, border nhạt ở dark
                  : 'border border-slate-400/70 dark:border-white/10 ' +
                    'bg-white/30 text-slate-700 hover:bg-white/50 ' +
                    'dark:bg-white/10 dark:text-white/80 dark:hover:bg-white/20'}`
              }
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <GlobalClickRipple />
    </div>
  );
}
