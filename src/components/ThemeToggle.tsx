import { useEffect, useState } from "react";

export default function ThemeToggle() {
  // Mặc định DARK nếu chưa có gì trong localStorage
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("theme");
      if (stored === "dark" || stored === "light") return stored === "dark";
      // lần đầu: default dark
      return true;
    }
    return true;
  });

  // Đồng bộ <html class="dark"> + localStorage mỗi lần đổi
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  return (
    <button
      onClick={() => setIsDark(v => !v)}
      aria-label="Toggle theme"
      className="rounded-xl px-3 py-2 text-sm font-medium
                 bg-white/70 text-slate-900 border border-slate-200 shadow
                 hover:bg-white transition
                 dark:bg-white/10 dark:text-white dark:border-white/15 dark:hover:bg-white/15"
    >
      {isDark ? "☀️" : "🌙"}
    </button>
  );
}
