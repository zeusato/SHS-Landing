import * as React from "react";
import { ChevronRight, ChevronLeft, X } from "lucide-react";
import menuData from "../assets/mega_menu.json";

type ChildItem = { title: string; url?: string | null };
type Section = { title: string; url?: string | null; children?: ChildItem[] };
type RootMenu = { title: string; url?: string | null; sections?: Section[] };
type MegaMenuData = { mains: RootMenu[] };

type StackEntry =
  | { kind: "root"; items: RootMenu[] }
  | { kind: "main"; title: string; items: Section[] }
  | { kind: "section"; title: string; items: ChildItem[] };

export default function MobileMegaMenu() {
  const data = menuData as MegaMenuData;
  const rootLevel: StackEntry = { kind: "root", items: data.mains || [] };

  const [open, setOpen] = React.useState(false);
  const [stack, setStack] = React.useState<StackEntry[]>([rootLevel]);

  React.useEffect(() => {
    if (open) setStack([rootLevel]);
  }, [open]);

  // scroll lock khi mở
  React.useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const current = stack[stack.length - 1];
  const push = (entry: StackEntry) => setStack((s) => [...s, entry]);
  const pop = () => setStack((s) => (s.length > 1 ? s.slice(0, -1) : s));

  const goMain = (m: RootMenu) => {
    const sections = m.sections || [];
    if (sections.length === 0 && m.url) {
      window.location.href = m.url;
      return;
    }
    push({ kind: "main", title: m.title, items: sections });
  };
  const goSection = (s: Section) => {
    const children = s.children || [];
    if (children.length === 0 && s.url) {
      window.location.href = s.url;
      return;
    }
    push({ kind: "section", title: s.title, items: children });
  };
  const goLeaf = (c: ChildItem) => {
    if (c.url) window.location.href = c.url;
  };

  return (
    <>
      {/* === Nút hamburger === */}
      <button
        className="sm:hidden rounded-xl p-2 border border-white/15 bg-white/10 hover:bg-white/15
                   backdrop-blur-md shadow ml-2"
        aria-label="Mở menu"
        onClick={() => setOpen(true)}
      >
        <div className="w-5 h-[2px] bg-white mb-[5px]" />
        <div className="w-5 h-[2px] bg-white mb-[5px] opacity-80" />
        <div className="w-5 h-[2px] bg-white opacity-60" />
      </button>

      {/* === Overlay Menu === */}
      <div
        aria-hidden={!open}
        className={[
          "fixed inset-0 z-[600]",
          open ? "pointer-events-auto" : "pointer-events-none",
        ].join(" ")}
      >
        <div
          onClick={() => setOpen(false)}
          className={[
            "absolute inset-0 transition-opacity",
            open ? "opacity-100" : "opacity-0",
            "bg-black/40",
          ].join(" ")}
        />

        <div
          role="dialog"
          aria-modal="true"
          className={[
            "absolute left-0 top-0 h-full w-[88%] max-w-[420px]",
            "border border-white/12 bg-white/10 backdrop-blur-xl",
            "shadow-[0_30px_80px_-20px_rgba(0,0,0,0.65)]",
            "transition-transform duration-300",
            open ? "translate-x-0" : "-translate-x-full",
            "text-white flex flex-col rounded-r-2xl",
          ].join(" ")}
        >
          {/* header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              {stack.length > 1 ? (
                <button
                  onClick={pop}
                  className="rounded-lg p-2 hover:bg-white/10 border border-white/10"
                  aria-label="Quay lại"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
              ) : null}
              <a href="https://shs-uat.shs.com.vn/vi">
              <div className="font-semibold">
                {current.kind === "root"
                  ? "Trang chủ"
                  : current.title}
              </div>
              </a>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="rounded-lg p-2 hover:bg-white/10 border border-white/10"
              aria-label="Đóng"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* list */}
          <div className="flex-1 overflow-y-auto px-2 py-2">
            <ul className="space-y-1">
              {current.kind === "root" &&
                current.items.map((m) => {
                  const hasChild = (m.sections?.length || 0) > 0;
                  return (
                    <li key={m.title}>
                      <button
                        onClick={() => goMain(m)}
                        className="w-full flex items-center justify-between gap-3 rounded-xl px-3 py-3 text-[15px]
                                   bg-white/5 hover:bg-white/10 border border-white/10"
                      >
                        <span>{m.title}</span>
                        {hasChild && <ChevronRight className="h-5 w-5 opacity-80" />}
                      </button>
                    </li>
                  );
                })}

              {current.kind === "main" &&
                current.items.map((s) => {
                  const hasChild = (s.children?.length || 0) > 0;
                  return (
                    <li key={s.title}>
                      <button
                        onClick={() => goSection(s)}
                        className="w-full flex items-center justify-between gap-3 rounded-xl px-3 py-3 text-[15px]
                                   bg-white/5 hover:bg-white/10 border border-white/10"
                      >
                        <span>{s.title}</span>
                        {hasChild && <ChevronRight className="h-5 w-5 opacity-80" />}
                      </button>
                    </li>
                  );
                })}

              {current.kind === "section" &&
                current.items.map((c) => (
                  <li key={c.title}>
                    <button
                      onClick={() => goLeaf(c)}
                      className="w-full flex items-center justify-between gap-3 rounded-xl px-3 py-3 text-[15px]
                                 bg-white/5 hover:bg-white/10 border border-white/10"
                    >
                      <span>{c.title}</span>
                    </button>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
