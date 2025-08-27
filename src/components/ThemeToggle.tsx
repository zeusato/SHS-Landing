import { useEffect, useState } from "react";

export default function ThemeToggle() {
  // Khởi tạo state isDark: nếu html có class "dark" thì true
  const [isDark, setIsDark] = useState<boolean>(() =>
    typeof document !== "undefined"
      ? document.documentElement.classList.contains("dark")
      : false
  );

  // Mỗi lần state isDark thay đổi thì cập nhật lại <html> và localStorage
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

  // Nút toggle hiển thị khác nhau tùy theo isDark
  return (
    <button
      onClick={() => setIsDark((v) => !v)}
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