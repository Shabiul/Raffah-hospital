import type { CSSProperties } from "react";

// Decorative, aria-hidden motion graphics. Their movement is driven by lib/extra-motion.js and CSS.

const TOOTH =
  "M30 12 C18 12 8 22 8 38 C8 52 16 60 20 76 C23 92 26 108 34 108 C42 108 42 88 50 88 C58 88 58 108 66 108 C74 108 77 92 80 76 C84 60 92 52 92 38 C92 22 82 12 70 12 C62 12 56 18 50 18 C44 18 38 12 30 12 Z";

export function Loader() {
  return (
    <div className="loader" aria-hidden="true">
      <div className="loader-mark">
        <svg viewBox="0 0 120 120">
          <circle className="loader-ring" cx="60" cy="60" r="56" pathLength={1} />
        </svg>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/tooth.png" alt="" width={630} height={887} />
      </div>
      <p className="loader-name">Dentizz</p>
    </div>
  );
}

// Rising bubbles for the hero. Fixed values keep the server and browser markup identical.
const BUBBLES = [
  [6, 14, 11, 0, 30], [12, 24, 14, 3, -20], [19, 10, 9, 6, 24], [26, 30, 16, 1.5, -30],
  [33, 16, 10, 8, 20], [40, 22, 13, 4.5, -16], [47, 12, 8, 10, 26], [9, 18, 12, 12, -22],
  [22, 26, 15, 7, 18], [36, 12, 9, 2.5, -26], [44, 20, 12, 9.5, 22], [15, 9, 8, 5.5, -14],
];
export function Bubbles() {
  return (
    <div className="bubbles" aria-hidden="true">
      {BUBBLES.map(([x, s, d, dl, dx], i) => (
        <i
          key={i}
          className="bubble"
          style={{ "--x": `${x}%`, "--s": `${s}px`, "--d": `${d + 6}s`, "--dl": `-${dl}s`, "--dx": `${dx}px` } as CSSProperties}
        />
      ))}
    </div>
  );
}

const ICONS: Record<string, React.ReactNode> = {
  tooth: <path d={TOOTH} transform="scale(.48) translate(0 0)" fill="none" stroke="currentColor" strokeWidth="5" strokeLinejoin="round" />,
  sparkle: <path d="M24 3 C25.5 16 32 22.5 45 24 C32 25.5 25.5 32 24 45 C22.5 32 16 25.5 3 24 C16 22.5 22.5 16 24 3Z" fill="currentColor" />,
  drop: <path d="M24 5 C24 5 10 21 10 30 a14 14 0 0 0 28 0 C38 21 24 5 24 5Z" fill="none" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />,
  brush: (
    <g fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
      <path d="M6 40 L30 16" />
      <path d="M28 14 L34 8 L40 14 L34 20 Z" />
      <path d="M36 6 L42 12 M30 10 L36 16" />
    </g>
  ),
  ring: <circle cx="24" cy="24" r="16" fill="none" stroke="currentColor" strokeWidth="3" />,
  plus: <path d="M24 8v32M8 24h32" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />,
};

export function Floater({
  kind,
  size = 48,
  speed = 40,
  dur = 14,
  style,
}: {
  kind: keyof typeof ICONS;
  size?: number;
  /** How far (px) it drifts vertically across the section while scrolling */
  speed?: number;
  dur?: number;
  style: CSSProperties;
}) {
  return (
    <span
      className="fl"
      data-speed={speed}
      aria-hidden="true"
      style={{ ...style, "--s": `${size}px`, "--d": `${dur}s` } as CSSProperties}
    >
      <svg viewBox="0 0 48 48">{ICONS[kind]}</svg>
    </span>
  );
}

export function ToothDraw() {
  return (
    <div className="tooth-draw" aria-hidden="true">
      <svg viewBox="-14 -6 128 132" fill="none">
        <path className="td-fill" d={TOOTH} />
        <path className="td-line" d={TOOTH} pathLength={1} />
        <path className="td-spark s1" d="M104 8 C105 14 108 17 114 18 C108 19 105 22 104 28 C103 22 100 19 94 18 C100 17 103 14 104 8Z" />
        <path className="td-spark s2" d="M-8 44 C-7 48 -5 50 -1 51 C-5 52 -7 54 -8 58 C-9 54 -11 52 -15 51 C-11 50 -9 48 -8 44Z" />
        <path className="td-spark s3" d="M96 96 C97 99 98 100 101 101 C98 102 97 103 96 106 C95 103 94 102 91 101 C94 100 95 99 96 96Z" />
      </svg>
    </div>
  );
}

export function SmileArc() {
  return (
    <svg className="smile-draw" viewBox="0 0 1000 150" aria-hidden="true">
      <path pathLength={1} d="M30 30 C 250 190, 750 190, 970 30" />
      <circle className="cheek" cx="30" cy="30" r="9" />
      <circle className="cheek" cx="970" cy="30" r="9" />
    </svg>
  );
}

export function Wave() {
  return (
    <div className="wave" aria-hidden="true">
      <svg viewBox="0 0 2000 100" preserveAspectRatio="none">
        <path d="M0 0H2000V50C1750 100 1250 0 1000 50C750 100 250 0 0 50Z" />
      </svg>
    </div>
  );
}
