import type { CSSProperties } from "react";

// The clinic's quote posters, shown as the original images. On desktop they float in
// empty parts of a section; on small screens (or with `flow`) they sit in the page flow.
const posters: Record<number, { w: number; h: number; alt: string }> = {
  17: { w: 258, h: 258, alt: "Start your morning with a smile" },
  18: { w: 272, h: 376, alt: "A smile is the prettiest thing you can wear" },
  19: { w: 251, h: 251, alt: "Be true to your teeth or they'll be false to you" },
  20: { w: 250, h: 250, alt: "Brush, floss, rinse, smile!" },
  21: { w: 292, h: 261, alt: "Smile: sunshine is good for your teeth!" },
  22: { w: 250, h: 350, alt: "Healthy drinks, healthy teeth" },
  23: { w: 264, h: 316, alt: "Your teeth are as unique as a fingerprint" },
  24: { w: 261, h: 261, alt: "Yes! Your perfect smile is within reach. Ask us how?" },
  25: { w: 213, h: 258, alt: "Don't rush when you brush" },
  26: { w: 378, h: 370, alt: "Oral dental health check-up: what problems could poor dental health cause" },
  27: { w: 298, h: 162, alt: "When you see a person a smile, give them one of yours" },
  28: { w: 264, h: 174, alt: "Healthy drinks, healthy teeth" },
  29: { w: 234, h: 328, alt: "Life is short, smile while you still have teeth" },
  30: { w: 280, h: 254, alt: "Doctor, Engineer + Artist = Dentist" },
};

type Props = {
  n: keyof typeof posters;
  /** CSS position for desktop (top/left/right/bottom), width and rotation */
  at?: { top?: string; left?: string; right?: string; bottom?: string; width?: number; rotate?: number };
  /** Keep in the normal flow instead of floating */
  flow?: boolean;
  /** Sit in the hero grid's empty cell */
  grid?: boolean;
};

export default function Poster({ n, at = {}, flow = false, grid = false }: Props) {
  const p = posters[n];
  const { width, rotate, ...pos } = at;
  const style = {
    ...pos,
    "--w": `${width ?? p.w}px`,
    "--r": `${rotate ?? 0}deg`,
  } as CSSProperties;
  return (
    <figure className={`qp${flow ? " qp-flow" : ""}${grid ? " qp-grid" : ""}`} style={style}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`/quotes/q${n}.png`} alt={p.alt} width={p.w} height={p.h} loading="lazy" data-reveal />
    </figure>
  );
}
