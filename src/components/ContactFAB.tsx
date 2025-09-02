import React, { useEffect, useMemo, useRef, useState } from "react";
import contacts from "../assets/contact.json";

type Region = "bac" | "trung" | "nam";
type Role = "chi_nhanh" | "pgd";

type Branch = {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  region: Region;
  role: Role;
};

const REGIONS: { key: Region | "all"; label: string }[] = [
  { key: "all", label: "Tất cả miền" },
  { key: "bac", label: "Miền Bắc" },
  { key: "trung", label: "Miền Trung" },
  { key: "nam", label: "Miền Nam" }
];

const ROLES: { key: Role | "all"; label: string }[] = [
  { key: "all", label: "Tất cả loại" },
  { key: "chi_nhanh", label: "Chi nhánh" },
  { key: "pgd", label: "PGD" }
];

// Headset icon (glass-friendly)
function PhoneIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 
               19.79 19.79 0 0 1-8.63-3.07 
               19.5 19.5 0 0 1-6-6 
               19.79 19.79 0 0 1-3.07-8.67 
               A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 
               12.19 12.19 0 0 0 .65 2.57 
               2 2 0 0 1-.45 2.11l-1.27 1.27 
               a16 16 0 0 0 6 6l1.27-1.27 
               a2 2 0 0 1 2.11-.45 
               12.19 12.19 0 0 0 2.57.65 
               A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

export default function ContactFAB() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Thông tin liên hệ"
        className="
          fixed bottom-6 right-3.5 z-[600] h-12 w-12 rounded-full
          border border-white/20 bg-white/10 backdrop-blur-xl text-white
          shadow-[0_8px_30px_rgba(0,0,0,0.25)]
          transition duration-300 ease-out
          hover:bg-white/15 hover:shadow-[0_0_35px_rgba(56,189,248,0.7)]
          focus:outline-none focus:ring focus:ring-cyan-300/40
        "
      >
        <PhoneIcon className="h-6 w-6 translate-x-[10px]" />
      </button>

      {open && <ContactSheet onClose={() => setOpen(false)} data={contacts as Branch[]} />}
    </>
  );
}

function ContactSheet({ onClose, data }: { onClose: () => void; data: Branch[] }) {
  const [segRegion, setSegRegion] = useState<Region | "all">("all");
  const [segRole, setSegRole] = useState<Role | "all">("all");
  const sheetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!sheetRef.current) return;
      if (!sheetRef.current.contains(e.target as Node)) onClose();
    };
    window.addEventListener("mousedown", onClick);
    return () => window.removeEventListener("mousedown", onClick);
  }, [onClose]);

  const list = useMemo(() => {
    return (data as Branch[]).filter(b =>
      (segRegion === "all" ? true : b.region === segRegion) &&
      (segRole   === "all" ? true : b.role   === segRole)
    );
  }, [data, segRegion, segRole]);

  return (
    <div className="fixed inset-0 z-[650]">
      {/* backdrop glassy */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />

      {/* sheet: glass + ẩn scrollbar */}
      <div
        ref={sheetRef}
        role="dialog" aria-modal="true"
        className="
          absolute bottom-0 left-0 right-0 mx-auto
          max-h-[80vh] overflow-y-auto rounded-t-2xl
          border border-white/15 bg-white/10 backdrop-blur-xl
          shadow-[0_8px_30px_rgba(0,0,0,0.35)]
          p-4 scrollbar-none
          md:top-1/2 md:-translate-y-1/2 md:rounded-2xl
          md:max-w-[560px] md:h-auto
        "
      >
        {/* header */}
        <div className="mb-3 flex items-center justify-between">
          <div className="font-semibold text-white/90 text-xl">Thông tin liên hệ</div>
            <button
            onClick={onClose}
            className="px-3 py-1.5 text-sm rounded-lg
                        border border-orange-500/30 
                        bg-orange-500/20 hover:bg-orange-500/30
                        text-white transition"
            >
            Đóng
            </button>
        </div>

        {/* Segments: Region + Role (2 hàng nhỏ, gọn) */}
        <div className="mb-2 flex gap-2 text-sm overflow-x-auto">
          {[{key:"all",label:"Tất cả"}, ...REGIONS.filter(r=>r.key!=="all")].map(x=>(
            <button key={x.key as string}
              onClick={()=>setSegRegion(x.key as any)}
              className={`px-3 py-1.5 rounded-full text-xs whitespace-nowrap border transition
                ${segRegion===x.key
                  ? "bg-cyan-500/80 text-white border-cyan-400"
                  : "bg-white/10 text-white/85 border-white/20 hover:bg-white/15"}`}
            >
              {x.label}
            </button>
          ))}
        </div>
        <div className="mb-3 flex gap-2 text-sm overflow-x-auto">
          {ROLES.map(x=>(
            <button key={x.key as string}
              onClick={()=>setSegRole(x.key as any)}
              className={`px-3 py-1.5 rounded-full text-xs whitespace-nowrap border transition
                ${segRole===x.key
                  ? "bg-cyan-500/80 text-white border-cyan-400"
                  : "bg-white/10 text-white/85 border-white/20 hover:bg-white/15"}`}
            >
              {x.label}
            </button>
          ))}
        </div>

        {/* list */}
        <ul className="space-y-3">
          {list.map((b) => (
            <li key={b.id}
              className="rounded-xl p-3 border border-white/15 bg-white/10 backdrop-blur text-white/90"
            >
              <div className="font-semibold">
                {b.name}
              </div>

              <div className="mt-1 text-sm text-white/80">{b.address}</div>

              <div className="mt-2 flex items-center gap-2 text-sm">
                <a href={`tel:${b.phone}`}
                   className="px-2 py-1 rounded-lg border border-white/20 bg-white/10 hover:bg-white/15">
                  Gọi: {b.phone}
                </a>
                <a href={`mailto:${b.email}`}
                   className="px-2 py-1 rounded-lg border border-white/20 bg-white/10 hover:bg-white/15">
                  Email
                </a>
                <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(b.address)}`}
                   target="_blank" rel="noopener"
                   className="px-2 py-1 rounded-lg border border-white/20 bg-white/10 hover:bg-white/15">
                  Map
                </a>
                <button
                  onClick={() => navigator.clipboard.writeText(
                    `${b.name}\n${b.address}\nTel: ${b.phone}\nEmail: ${b.email}`
                  )}
                  className="ml-auto px-2 py-1 rounded-lg border border-white/20 bg-white/10 hover:bg-white/15">
                  Copy
                </button>
              </div>
            </li>
          ))}
        </ul>

        {list.length === 0 && (
          <div className="text-sm text-white/75 p-3">Không có dữ liệu.</div>
        )}
      </div>
    </div>
  );
}
