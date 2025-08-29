import React from "react";
import { motion } from "framer-motion";
import GlobalClickRipple from "./components/GlobalClickRipple";
import MagneticButton from "./components/MagneticButton";

/* ===== ASSETS ===== */
import logo from "../source/LOGO.png";
import demoImage from "../source/bgIMG.jpg";
import demoVideo from "../source/bgVID.mp4";

/* ===== DATA ===== */
import menuData from "./assets/mega_menu.json";

/* ===== LOCAL SCREENS ===== */
import ScreenOne from "./ScreenOne";
import ScreenTwo from "./ScreenTwo";

/* ===== Types ===== */
type ChildItem = { title: string; url?: string | null };
type Section = { title: string; url?: string | null; children: ChildItem[] };
type RootMenu = { title: string; url?: string | null; sections: Section[] };
type MegaMenuData = { mains: RootMenu[] };

type Stage = "v2" | "transition" | "v1";
type SweepDir = "up" | "down";

const HEADER_H = 96; // px

export default function SHSNoScrollLanding() {
  // background mode for ScreenOne
  const [bgMode, setBgMode] = React.useState<"brand" | "image" | "video">("video");

  // mega menu state
  const MEGA = menuData as MegaMenuData;
  const findMainIndex = (kw: string) =>
    Math.max(0, MEGA.mains.findIndex((m) => m.title.toLowerCase().includes(kw.toLowerCase())));
  const [open, setOpen] = React.useState<null | "mega">(null);
  const [mainIdx, setMainIdx] = React.useState<number>(() => findMainIndex("Về SHS"));
  const [sectionIdx, setSectionIdx] = React.useState<number>(0);
  const currentMain: RootMenu | undefined = MEGA.mains[mainIdx];

  // transition stage
  const [stage, setStage] = React.useState<Stage>("v2");
  const [sweepOn, setSweepOn] = React.useState(false);
  const [sweepDir, setSweepDir] = React.useState<SweepDir>("up");

  const startTransition = () => {
    if (stage !== "v2") return;
    setSweepDir("up");
    setStage("transition");
    setSweepOn(true);
    setTimeout(() => {
      setStage("v1");
      setSweepOn(false);
    }, 900);
  };
  const backToV2 = () => {
    if (stage !== "v1") return;
    setSweepDir("down");
    setStage("transition");
    setSweepOn(true);
    setTimeout(() => {
      setStage("v2");
      setSweepOn(false);
    }, 900);
  };

  // search (kept lightweight, same logic as before)
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
    const nq = norm(q),
      nt = norm(t);
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
      .filter((x) => x.s > 0)
      .sort((a, b) => b.s - a.s)
      .slice(0, 8)
      .map((x) => x.i);
  }, [q, INDEX]);
  const handleSelect = (url?: string | null) => {
    if (hideTimer.current) clearTimeout(hideTimer.current);
    setOpenDrop(false);
    if (url) window.location.href = url;
  };

  return (
    <div className="relative h-[100dvh] w-full overflow-hidden bg-[#0b1220] text-white">
      {/* ===== BG (v2 only) ===== */}
      {stage !== "v1" && bgMode === "brand" && (
        <div
          className="absolute inset-0 z-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(1200px 800px at 15% 10%, rgba(56,189,248,0.25), transparent 60%), \
               radial-gradient(1000px 700px at 90% 85%, rgba(167,139,250,0.22), transparent 55%), \
               linear-gradient(180deg, #0b1220 0%, #070c16 100%)",
          }}
        />
      )}
      {stage !== "v1" && bgMode === "image" && (
        <div className="absolute inset-0 z-0 pointer-events-none">
          <img src={demoImage} alt="Background" className="w-full h-full object-cover pointer-events-none" />
          <div className="absolute inset-0 bg-black/35 pointer-events-none" />
        </div>
      )}
      {stage !== "v1" && bgMode === "video" && (
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

      {/* ===== HEADER ===== */}
      <header
        className="fixed top-0 left-0 right-0 z-[500] w-full group/header"
        onMouseLeave={() => {
          setOpen(null);
          setSectionIdx(0);
        }}
      >
        <span
          className={[
            "pointer-events-none absolute inset-0",
            "border-b border-white/10",
            "bg-white/8 backdrop-blur-md",
            "shadow-[0_2px_12px_-6px_rgba(0,0,0,0.35)]",
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
                onMouseEnter={() => {
                  setOpen("mega");
                  setMainIdx(findMainIndex("Về SHS"));
                  setSectionIdx(0);
                }}
                className="px-2 py-1 rounded-md hover:bg-white/10"
              >
                Về SHS
              </button>
              <button
                type="button"
                onMouseEnter={() => {
                  setOpen("mega");
                  setMainIdx(findMainIndex("sản phẩm"));
                  setSectionIdx(0);
                }}
                className="px-2 py-1 rounded-md hover:bg-white/10"
              >
                Sản phẩm - Dịch vụ
              </button>
            </nav>
          </div>

          {/* cột phải: search + mở TK */}
          <div className="shrink-0 flex items-center gap-3">
            <div
              className="relative hidden lg:block"
              onMouseEnter={() => {
                if (hideTimer.current) clearTimeout(hideTimer.current);
              }}
              onMouseLeave={() => {
                hideTimer.current = setTimeout(() => setOpenDrop(false), 300);
              }}
            >
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm opacity-80">
                🔍
              </span>
              <input
                type="search"
                value={q}
                onChange={(e) => {
                  setQ(e.target.value);
                  setOpenDrop(true);
                }}
                onFocus={() => q && setOpenDrop(true)}
                onKeyDown={(e) => {
                  if (e.key === "Escape") {
                    setOpenDrop(false);
                    (e.target as HTMLInputElement).blur();
                  }
                  if (e.key === "Enter" && results[0]) handleSelect(results[0].url);
                }}
                placeholder="Mã CP, sản phẩm, dịch vụ, tin tức..."
                className="w/[280px] rounded-xl pl-9 pr-3 py-2 text-sm outline-none bg-white/10 text-white border border-white/15 focus:bg-white/15 shadow"
              />
              {openDrop && q && (
                <div className="absolute left-0 right-0 mt-2 rounded-xl overflow-hidden border border-white/12 bg-[#0b1220]/95 backdrop-blur-xl shadow-[0_20px_40px_-20px_rgba(0,0,0,0.65)] z-50">
                  <ul className="max-h-80 overflow-auto py-1">
                    {results.map((r) => (
                      <li key={r.path}>
                        <button
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => handleSelect(r.url)}
                          className="w-full text-left px-3 py-2 text-sm hover:bg-white/10"
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

            <a href="https://motaikhoan.shs.com.vn/vi/ekyc" target="_blank" rel="noreferrer">
              <MagneticButton />
            </a>
          </div>
        </div>

        {/* MEGA MENU */}
        {open === "mega" && currentMain && (
          <div className="absolute left-0 right-0 top-[100%] z-40">
            <div
              className="mx-auto max-w-7xl px-4 sm:px-5 pt-4 pb-6 rounded-3xl border border-white/12
                            bg-white/[0.08] backdrop-blur-xl shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)] transition"
              onMouseLeave={() => {
                setOpen(null);
                setSectionIdx(0);
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <a
                  href={currentMain.url || "#"}
                  className="text-sm font-semibold underline underline-offset-4 hover:opacity-80"
                >
                  {currentMain.title}
                </a>
              </div>

              <div className="grid grid-cols-[220px_260px_1fr] gap-6 min-h-[260px]">
                <div className="pr-2 border-r border-white/10">
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
                            i === mainIdx ? "bg-white/15 shadow" : "hover:bg-white/10",
                          ].join(" ")}
                        >
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
                        <a
                          href={sec.url || "#"}
                          onMouseEnter={() => setSectionIdx(i)}
                          className={[
                            "block rounded-lg px-3 py-2 text-sm",
                            i === sectionIdx ? "bg-white/15 shadow" : "hover:bg-white/10",
                          ].join(" ")}
                        >
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
                        <a key={child.title} href={child.url || "#"} className="rounded-lg px-3 py-2 text-sm hover:bg:white/10">
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

      {/* ===== Screen One (v2) content ===== */}
      <motion.div
        initial={false}
        animate={{ opacity: stage === "transition" ? 0 : 1 }}
        transition={{ duration: 0.3 }}
        className={stage === "v1" ? "hidden" : ""}
      >
        <ScreenOne HEADER_H={HEADER_H} bgMode={bgMode} setBgMode={setBgMode} />
      </motion.div>

      {/* ===== Sweep overlay ===== */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[300]"
        style={{ transformOrigin: sweepDir === "up" ? "bottom center" : "top center" }}
        initial={false}
        animate={{ scaleY: sweepOn ? 1 : 0 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(1200px 800px at 15% 100%, rgba(56,189,248,0.25), transparent 60%),\
           radial-gradient(900px 600px at 85% 80%, rgba(167,139,250,0.22), transparent 55%),\
           linear-gradient(180deg, #0b1220 0%, #070c16 100%)",
          }}
        />
      </motion.div>

      {/* ===== Screen Two (v1) overlay ===== */}
      <div className={stage === "v1" ? "absolute inset-0 z-[400]" : "hidden"}>
        <div className="absolute inset-0 overflow-hidden">
          <ScreenTwo />
        </div>
      </div>

      {/* ===== Footer ===== */}
      <footer className="absolute bottom-3 left-0 right-0 z-[150] text-white/80">
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

      {/* ===== Arrow buttons ===== */}
      {stage === "v2" && (
        <button
          onClick={() => {
            setSweepDir("up");
            startTransition();
          }}
          className="fixed left-1/2 -translate-x-1/2 bottom-6 z-[300] h-14 w-14 rounded-full
                     bg-white/15 text-white border border-white/25 shadow-xl backdrop-blur-xl
                     hover:bg-white/20 flex items-center justify-center transition"
          aria-label="Xem tiếp"
          title="Xem tiếp"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 5v14M12 19l-6-6M12 19l6-6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )}
      {stage === "v1" && (
        <button
          onClick={() => {
            backToV2();
          }}
          className="fixed left-1/2 -translate-x-1/2 bottom-6 z-[450] h-14 w-14 rounded-full
                     bg:white/15 text-white border border-white/25 shadow-xl backdrop-blur-xl
                     hover:bg-white/20 flex items-center justify-center transition"
          aria-label="Quay về"
          title="Quay về"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 19V5M12 5l-6 6M12 5l6 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )}

      <GlobalClickRipple />
    </div>
  );
}
