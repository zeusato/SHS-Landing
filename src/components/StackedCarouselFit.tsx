import * as React from "react";
import { motion, animate, useMotionValue } from "framer-motion";

/**
 * StackedCarouselFit (cố định kích thước hoặc tùy chỉnh)
 * - Carousel sẽ hiển thị theo kích thước cố định hoặc được truyền vào.
 * - Không còn cơ chế co giãn tự động theo kích thước vùng chứa.
 * - Căn giữa trong khung.
 */

export type StackedItem = {
  id: string;
  image?: string;
  header: string;
  content: string;
};

type Props = {
  items: StackedItem[];
  className?: string;
  // Kích thước cố định của carousel
  width?: string; // Ví dụ: "100%", "800px"
  height?: string; // Ví dụ: "500px", "75vh"
  // Kích thước các thẻ con
  designCardW?: number;
  designCardH?: number;
  designPeek?: number; // Phần nhìn thấy của thẻ ở hai bên
  safeTop?: number;
  safeBottom?: number;
  showDots?: boolean;
};

// Hàm để xử lý số dư (modulo) đảm bảo kết quả luôn dương
function mod(a: number, n: number) {
  return ((a % n) + n) % n;
}

export default function StackedCarouselFit({
  items = [],
  className = "",
  width = "100%", // Giá trị mặc định cho chiều rộng
  height = "550px", // Giá trị mặc định cho chiều cao
  designCardW = 480,
  designCardH = 260,
  designPeek = 64,
  safeTop = 24,
  safeBottom = 32,
  showDots = true,
}: Props) {
  const N = items.length || 0;
  const [active, setActive] = React.useState(0);

  const gap = 20;
  const itemSpreadUnit = designCardW * 0.21 + gap; // Khoảng cách từ tâm thẻ này đến tâm thẻ kế tiếp

  // Tính toán chiều rộng không gian thiết kế thực tế cần để hiển thị các thẻ
  // Các thẻ hiển thị là off = -2, -1, 0, 1, 2
  // Vị trí tâm thẻ ngoài cùng bên trái (off = -2): -2 * itemSpreadUnit
  // Vị trí tâm thẻ ngoài cùng bên phải (off = 2): 2 * itemSpreadUnit
  //
  // Chiều rộng từ cạnh trái của thẻ ngoài cùng bên trái đến cạnh phải của thẻ ngoài cùng bên phải
  const minXEdgeOfOuterVisibleCard = (-2 * itemSpreadUnit) - (designCardW / 2);
  const maxXEdgeOfOuterVisibleCard = (2 * itemSpreadUnit) + (designCardW / 2);
  const totalVisibleCardsSpan = maxXEdgeOfOuterVisibleCard - minXEdgeOfOuterVisibleCard;

  // Chiều rộng không gian thiết kế cuối cùng, đảm bảo đủ rộng cho cả nội dung và các phần peek
  const calculatedDesignWidth = Math.max(
    designCardW + 2 * designPeek, // Chiều rộng cơ bản (thẻ chính + 2 bên peek)
    totalVisibleCardsSpan + (designPeek * 2) // Chiều rộng cần thiết cho các thẻ + padding
  );

  const designWidth = calculatedDesignWidth; // Cập nhật designWidth
  const designHeight = safeTop + designCardH + safeBottom + (showDots ? 14 : 0);


  // Hook này không còn cần thiết cho việc co giãn nữa, đã loại bỏ
  // Ref để tham chiếu đến div bao ngoài (wrapper) và div chứa nội dung thiết kế
  const wrapRef = React.useRef<HTMLDivElement>(null);
  const designRef = React.useRef<HTMLDivElement>(null);

  // Xử lý tương tác - cuộn chuột
  const wheelLock = React.useRef(false);
  const onWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (wheelLock.current || N <= 1) return;
    wheelLock.current = true;
    const dir = e.deltaY > 0 || e.deltaX > 0 ? 1 : -1;
    setActive((v) => mod(v + dir, N));
    setTimeout(() => (wheelLock.current = false), 260);
  };

  // Xử lý tương tác - kéo (drag)
  const dragX = useMotionValue(0);
  const onDragEnd = (_: any, info: { offset: { x: number } }) => {
    const dx = info.offset.x;
    if (Math.abs(dx) < 30) {
      animate(dragX, 0, { duration: 0.2 });
      return;
    }
    setActive((v) => mod(v + (dx < 0 ? 1 : -1), N));
    animate(dragX, 0, { duration: 0.2 });
  };

  // Hàm chuyển đến một item cụ thể
  const to = (idx: number) => setActive(mod(idx, N));
  // Hàm chuyển đến item tiếp theo hoặc trước đó
  const go = (dir: 1 | -1) => setActive((v) => mod(v + dir, N));

  // Tính toán offset có dấu để xác định vị trí tương đối của các thẻ
  const signedOffset = (i: number) => {
    const raw = i - active;
    const wrapped = ((raw % N) + N) % N;
    const alt = wrapped - N;
    return Math.abs(wrapped) <= Math.abs(alt) ? wrapped : alt;
  };

  return (
    <div
      ref={wrapRef} // Đây là div bao ngoài, kích thước của nó sẽ quyết định kích thước hiển thị
      className={[
        "relative overflow-hidden rounded-3xl", // Bỏ w-full h-full để dùng width/height từ props

        className,
      ].join(" ")}
      style={{ width, height }} // Áp dụng width và height từ props vào đây
      onWheel={onWheel}
    >
      {/* Container của không gian thiết kế (không còn co giãn, dùng kích thước cố định) */}
      <div
        ref={designRef} // Đây là div chứa toàn bộ nội dung carousel
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 origin-center"
        style={{
          width: designWidth, // Kích thước cố định của design space
          height: designHeight, // Kích thước cố định của design space
          // transform: `scale(${scale})`, // Không còn scale nữa
        }}
      >
        <motion.div
          className="absolute"
          style={{
            top: safeTop,
            left: '50%', // Đặt điểm neo ở giữa theo chiều ngang
            x: dragX,
            translateX: '-50%', // Dịch chuyển khối chứa sang trái 50% chiều rộng của chính nó để căn giữa
          }}
          drag="x"
          dragElastic={0.12}
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={onDragEnd}
        >
          {items.map((it, i) => {
            const off = signedOffset(i);
            if (Math.abs(off) > 2) return null;

            // Tính toán giá trị translateX để đặt tâm thẻ vào đúng vị trí `off * itemSpreadUnit`
            const xTranslation = (off * itemSpreadUnit) - (designCardW / 2);
            const scaleFace = off === 0 ? 1 : off === -1 || off === 1 ? 0.95 : 0.9;
            const opacity = off === 0 ? 1 : off === -1 || off === 1 ? 0.9 : 0.72;
            const z = 100 - Math.abs(off);
            const y = off === 0 ? 0 : Math.abs(off) * 4;

            return (
              <motion.div
                key={it.id}
                className="absolute -translate-y-1/2"
                style={{
                  x: xTranslation, // Áp dụng giá trị translateX đã tính toán
                  y,
                  zIndex: z,
                  scale: scaleFace,
                  opacity,
                  width: designCardW,
                }}
                initial={false}
                animate={{ x: xTranslation, y, scale: scaleFace, opacity }}
                transition={{ type: "spring", stiffness: 260, damping: 26 }}
              >
                <button
                  onClick={() => (off === 0 ? undefined : to(i))}
                  className="text-left w-full rounded-2xl overflow-hidden border border-white/12 bg-white/8 backdrop-blur-xl text-white shadow-[0_20px_60px_-30px_rgba(0,0,0,0.6)] hover:bg-white/10 transition focus:outline-none focus:ring-2 focus:ring-white/30"
                  style={{ pointerEvents: "auto" }}
                >
                  <div className="grid grid-rows-[4fr_1fr]" style={{ height: designCardH }}>
                    <div className="relative overflow-hidden">
                      {it.image ? (
                        <img
                          src={it.image}
                          alt={it.header}
                          className="w-full h-full object-contain select-none"
                          draggable={false}
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-cyan-400/35 via-violet-400/35 to-emerald-400/35" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-transparent pointer-events-none" />
                    </div>
                    <div className="px-4 py-3 bg-[#0b1220]/70">
                      <div className="text-base font-semibold leading-tight tracking-wide line-clamp-1">
                        {it.header}
                      </div>
                      <div className="mt-0.5 text-xs text-white/80 leading-snug line-clamp-2">
                        {it.content}
                      </div>
                    </div>
                  </div>
                </button>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Các chấm chỉ báo (dots) trong không gian thiết kế */}
        {showDots && N > 1 && (
          <div className="absolute left-1/2 -translate-x-1/2" style={{ bottom: 0 }}>
            <div className="flex gap-2">
              {items.map((_, i) => (
                <button
                  key={i}
                  onClick={() => to(i)}
                  aria-label={`Đi đến slide ${i + 1}`}
                  className={[
                    "h-2.5 w-2.5 rounded-full border border-white/35 transition",
                    i === active ? "bg-white shadow" : "bg-white/25 hover:bg-white/45"
                  ].join(" ")}
                />
              ))}
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
