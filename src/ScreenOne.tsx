import React from "react";
import { motion } from "framer-motion";

type Props = {
  HEADER_H: number;
  bgMode: "brand" | "image" | "video";
  setBgMode: (v: "brand" | "image" | "video") => void;
};

export default function ScreenOne({ HEADER_H, bgMode, setBgMode }: Props) {
  return (
    <div className="absolute left-0 right-0 bottom-0 z-[200] pointer-events-none" style={{ top: HEADER_H*2 }}>
      {/* Hero text block */}
      <div className="mx-auto max-w-7xl px-5 h-full grid grid-cols-4 items-end">
        <div className="col-span-1 col-start-1 mb-[10vh] max-w-xl text-left pointer-events-auto">
          <a href="https://www.shs.com.vn/" target="_blank" rel="noreferrer" className="inline-block" aria-label="SHS Website">
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="font-gilroy font-bold text-7xl sm:text-8xl lg:text-9xl tracking-tight 
                         bg-clip-text text-transparent drop-shadow-[0_8px_35px_rgba(250,149,40,0.35)]
                         bg-gradient-to-r from-[#FA9528] to-[#F76F08]"
            >
              SHS
            </motion.h1>
          </a>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.05 }}
            className="font-gilroy mt-3 text-2xl sm:text-3xl lg:text-4xl font-semibold text-white whitespace-nowrap drop-shadow-[0_1px_10px_rgba(0,0,0,0.35)]"
          >
            Kiến tạo tài chính thịnh vượng
          </motion.p>
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
            className="mt-4 h-1 w-32 rounded-full bg-gradient-to-r from-[#FA9528] to-[#F76F08]"
          />
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
            <button
              key={key}
              onClick={() => setBgMode(key)}
              aria-pressed={bgMode === key}
              aria-label={title}
              title={title}
              className={`w-9 h-9 rounded-lg text-[11px] font-semibold transition border border-white/15
                          ${bgMode === key ? "bg-gradient-to-b from-[#FA9528] to-[#F76F08] text-white shadow-md" : "bg-white/10 text-white hover:bg-white/15"}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
