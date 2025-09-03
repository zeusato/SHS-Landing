import type { Config } from 'tailwindcss'

export default {
  darkMode: 'class', // <<< THÊM DÒNG NÀY
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      keyframes: {
        shine: {
          '0%':  { transform: 'translateX(-150%) skewX(-12deg)' },  // ngoài mép trái
          '40%': { transform: 'translateX(250%) skewX(-12deg)'  },  // vượt hẳn mép phải
          '41%': { transform: 'translateX(-150%) skewX(-12deg)' },  // reset về đầu
          '100%':{ transform: 'translateX(-150%) skewX(-12deg)' },  // đứng chờ = delay
        },
        hoverSweep: {
          '0%':   { transform: 'translateX(-150%) skewX(-12deg)', opacity: '0' },
          '20%':  { opacity: '0.6' },
          '80%':  { transform: 'translateX(150%) skewX(-12deg)', opacity: '0.6' },
          '100%': { transform: 'translateX(150%) skewX(-12deg)', opacity: '0' },
        },
        ripple: {
          "0%": { transform: "scale(0)", opacity: "0.6" },
          "100%": { transform: "scale(1)", opacity: "0" },
    },
      },
      animation: {
        shine: 'shine 4s ease-in-out infinite', // ~2s chạy + ~3s nghỉ
        hoverSweep: 'hoverSweep 1.2s ease-out forwards',
        ripple: "ripple 0.8s ease-out",
      },
      fontFamily: {
        sans: ["Inter", "Gilroy", "sans-serif"],
      },
    }
  },
  plugins: [],
} satisfies Config