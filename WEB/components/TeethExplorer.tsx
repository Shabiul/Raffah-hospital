"use client";

import { useMemo, useState } from "react";

type Kind = { name: string; w: number; h: number; text: string; tip: string };

const ADULT: Kind[] = [
  { name: "Central incisor", w: 24, h: 36, text: "The front-and-centre teeth. They slice food and shape both your smile and the way you speak.", tip: "Floss between them, where food and plaque like to hide." },
  { name: "Lateral incisor", w: 22, h: 33, text: "Right beside the central incisors. They help you bite and cut, and frame your front smile.", tip: "Brush the backs as well as the fronts." },
  { name: "Canine", w: 24, h: 38, text: "The pointed teeth, often called eye teeth. They grip and tear food and help guide your bite.", tip: "They have long roots, so keep the gum line clean." },
  { name: "First premolar", w: 28, h: 31, text: "Between the canines and the molars. They hold and crush food before it is ground.", tip: "Angle the brush to the gum line on both sides." },
  { name: "Second premolar", w: 28, h: 31, text: "Work with the first premolars to crush food, and sit next to the big molars.", tip: "Do not skip the narrow gap behind them." },
  { name: "First molar", w: 35, h: 32, text: "Large, flat teeth that grind food. The first permanent molars usually arrive around age six.", tip: "Deep grooves trap food, so brush the chewing surface well." },
  { name: "Second molar", w: 34, h: 31, text: "More grinding teeth, usually arriving around age twelve.", tip: "Reach right to the back with a small-headed brush." },
  { name: "Wisdom tooth", w: 30, h: 27, text: "The last teeth to come, usually in the late teens or twenties. Some need checking, or removing, when there is no room.", tip: "If the back of your jaw hurts or swells, book a check-up." },
];

const CHILD: Kind[] = [
  { name: "Central incisor", w: 20, h: 30, text: "Baby front teeth. They often arrive first, around six months, and start to fall out from about age six.", tip: "Start brushing as soon as the first tooth appears." },
  { name: "Lateral incisor", w: 18, h: 28, text: "Baby teeth beside the front ones. They help with biting and hold space for the adult teeth.", tip: "Use a small, soft brush and a smear of toothpaste." },
  { name: "Canine", w: 20, h: 31, text: "Pointed baby teeth that help tear food.", tip: "Help your child brush until they can tie their own shoes." },
  { name: "First molar", w: 27, h: 27, text: "The first baby chewing teeth. They are replaced later by adult premolars.", tip: "Sealants and good brushing protect the grooves." },
  { name: "Second molar", w: 29, h: 27, text: "The last baby teeth to come. Children have twenty baby teeth in all.", tip: "Look after baby teeth: they guide the adult ones into place." },
];

type Pick = { arch: "upper" | "lower"; side: "L" | "R"; k: number };

// Place teeth along the arch edge by their widths, so large molars never overlap.
function layout(kinds: Kind[], rx: number, ry: number, fill: number) {
  const N = 400;
  const pts: { x: number; y: number; len: number }[] = [];
  let len = 0;
  for (let i = 0; i <= N; i++) {
    const th = Math.PI - (Math.PI * i) / N; // 180deg -> 0deg
    const x = rx * Math.cos(th);
    const y = -ry * Math.sin(th);
    if (i) len += Math.hypot(x - pts[i - 1].x, y - pts[i - 1].y);
    pts.push({ x, y, len });
  }
  const order = [...kinds.slice().reverse().map((k, i) => ({ k, idx: kinds.length - 1 - i, side: "L" as const })), ...kinds.map((k, i) => ({ k, idx: i, side: "R" as const }))];
  const total = order.reduce((s, t) => s + t.k.w, 0);
  const gap = (len * fill - total) / (order.length - 1);
  let at = (len - (total + gap * (order.length - 1))) / 2;
  return order.map((t) => {
    const mid = at + t.k.w / 2;
    at += t.k.w + gap;
    let j = pts.findIndex((p) => p.len >= mid);
    if (j < 1) j = 1;
    const a = pts[j - 1];
    const b = pts[j];
    const f = (mid - a.len) / Math.max(1e-6, b.len - a.len);
    return { ...t, x: a.x + (b.x - a.x) * f, y: a.y + (b.y - a.y) * f };
  });
}

export default function TeethExplorer() {
  const [mode, setMode] = useState<"adult" | "child">("adult");
  const [pick, setPick] = useState<Pick>({ arch: "upper", side: "R", k: 0 });
  const kinds = mode === "adult" ? ADULT : CHILD;

  const cfg = mode === "adult" ? { rx: 196, ry: 152, fill: 0.9 } : { rx: 168, ry: 126, fill: 0.74 };
  const teeth = useMemo(() => layout(kinds, cfg.rx, cfg.ry, cfg.fill), [kinds, cfg.rx, cfg.ry, cfg.fill]);

  const cur = kinds[Math.min(pick.k, kinds.length - 1)];
  const count = mode === "adult" ? 32 : 20;
  const where = `${pick.arch === "upper" ? "Upper" : "Lower"} ${pick.side === "R" ? "right" : "left"}`;

  const Arch = ({ arch }: { arch: "upper" | "lower" }) => {
    const cy = arch === "upper" ? 188 : 212;
    return (
      <g transform={`translate(250 ${cy})`}>
        {teeth.map((t) => {
          const y = arch === "upper" ? t.y : -t.y;
          // The crown points toward the centre of the arch.
          const rot = (Math.atan2(-y, -t.x) * 180) / Math.PI - 90;
          const on = pick.arch === arch && pick.side === t.side && pick.k === t.idx;
          return (
            <g
              key={`${mode}-${arch}-${t.side}-${t.idx}`}
              className={`tooth${on ? " on" : ""}`}
              transform={`translate(${t.x.toFixed(1)} ${y.toFixed(1)}) rotate(${rot.toFixed(1)})`}
            >
              <g className="tooth-in" style={{ animationDelay: `${(t.idx + (t.side === "R" ? 0.5 : 0)) * 35}ms` }}>
                <rect
                  x={-t.k.w / 2}
                  y={-t.k.h / 2}
                  width={t.k.w}
                  height={t.k.h}
                  rx={t.k.w * 0.38}
                  role="button"
                  tabIndex={0}
                  aria-label={`${arch === "upper" ? "Upper" : "Lower"} ${t.side === "R" ? "right" : "left"} ${t.k.name}`}
                  aria-pressed={on}
                  onClick={() => setPick({ arch, side: t.side, k: t.idx })}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setPick({ arch, side: t.side, k: t.idx });
                    }
                  }}
                />
              </g>
            </g>
          );
        })}
      </g>
    );
  };

  return (
    <div className="teeth">
      <div className="teeth-chart">
        <div className="teeth-toggle" role="group" aria-label="Which teeth">
          <button type="button" className={mode === "adult" ? "on" : ""} aria-pressed={mode === "adult"} onClick={() => { setMode("adult"); setPick({ arch: "upper", side: "R", k: 0 }); }}>
            Adult · 32 teeth
          </button>
          <button type="button" className={mode === "child" ? "on" : ""} aria-pressed={mode === "child"} onClick={() => { setMode("child"); setPick({ arch: "upper", side: "R", k: 0 }); }}>
            Child · 20 teeth
          </button>
        </div>
        <svg viewBox="0 0 500 400" role="group" aria-label="Chart of teeth. Select a tooth to learn about it.">
          <Arch arch="upper" />
          <Arch arch="lower" />
          <text x="250" y="204" textAnchor="middle" className="teeth-mid">tap a tooth</text>
        </svg>
      </div>

      <div className="teeth-info" aria-live="polite">
        <span className="finder-tag">{where}</span>
        <h3 key={`${mode}-${pick.arch}-${pick.side}-${pick.k}`}>{cur.name}</h3>
        <p>{cur.text}</p>
        <p className="teeth-tip">
          <b>Care tip</b> {cur.tip}
        </p>
        <p className="teeth-count">
          {mode === "adult" ? "Adults" : "Children"} have <b>{count}</b> teeth: {count / 4} in each quarter of the mouth.
        </p>
      </div>
    </div>
  );
}
