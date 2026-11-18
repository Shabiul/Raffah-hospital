"use client";

import { useEffect, useState } from "react";

const TOTAL = 120;
const R = 92;
const CIRC = 2 * Math.PI * R;

const ZONES = [
  { name: "Top left", tip: "Small gentle circles, outside then inside." },
  { name: "Top right", tip: "Angle the brush toward the gum line." },
  { name: "Bottom right", tip: "Do not forget the chewing surfaces." },
  { name: "Bottom left", tip: "Finish with a soft brush of your tongue." },
];

// Four wedges of a circle (viewBox 0 0 200 200, centre 100,100, radius 74).
const WEDGES = [
  "M100 100 L100 26 A74 74 0 0 0 26 100 Z", // top left
  "M100 100 L174 100 A74 74 0 0 0 100 26 Z", // top right
  "M100 100 L100 174 A74 74 0 0 0 174 100 Z", // bottom right
  "M100 100 L26 100 A74 74 0 0 0 100 174 Z", // bottom left
];

export default function BrushTimer() {
  const [left, setLeft] = useState(TOTAL);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setLeft((l) => Math.max(0, +(l - 0.25).toFixed(2))), 250);
    return () => clearInterval(id);
  }, [running]);

  useEffect(() => {
    if (left === 0) setRunning(false);
  }, [left]);

  const elapsed = TOTAL - left;
  const done = left === 0;
  const started = elapsed > 0;
  const zone = Math.min(3, Math.floor(elapsed / 30));
  const mm = String(Math.floor(Math.ceil(left) / 60));
  const ss = String(Math.ceil(left) % 60).padStart(2, "0");

  return (
    <div className="brush">
      <div className="brush-dial">
        <svg viewBox="0 0 200 200" role="img" aria-label={`Brushing timer, ${mm}:${ss} left`}>
          <circle cx="100" cy="100" r={R} className="b-track" />
          <circle
            cx="100"
            cy="100"
            r={R}
            className="b-ring"
            strokeDasharray={CIRC}
            strokeDashoffset={CIRC * (1 - left / TOTAL)}
            transform="rotate(-90 100 100)"
          />
          {WEDGES.map((d, i) => (
            <path
              key={i}
              d={d}
              className={`b-wedge${(started || running) && !done && i === zone ? " on" : ""}${done ? " done" : ""}`}
            />
          ))}
          <line x1="100" y1="26" x2="100" y2="174" className="b-cross" />
          <line x1="26" y1="100" x2="174" y2="100" className="b-cross" />
        </svg>
        <div className="brush-time">
          {done ? "Done!" : `${mm}:${ss}`}
        </div>
      </div>

      <div className="brush-copy">
        <p className="brush-zone">
          {done ? "Two minutes. Lovely." : started || running ? ZONES[zone].name : "Ready when you are"}
        </p>
        <p className="brush-tip">
          {done
            ? "Now floss, rinse and smile. Brush, floss, rinse, smile!"
            : started || running
              ? ZONES[zone].tip
              : "Dentists suggest brushing for two minutes, 30 seconds in each quarter of your mouth."}
        </p>
        <div className="brush-actions">
          <button
            className="btn"
            type="button"
            onClick={() => {
              if (done) setLeft(TOTAL);
              setRunning((r) => !r);
            }}
          >
            <span>{done ? "Brush again" : running ? "Pause" : started ? "Resume" : "Start brushing"}</span>
          </button>
          {(started || done) && (
            <button
              className="btn btn-line"
              type="button"
              onClick={() => {
                setRunning(false);
                setLeft(TOTAL);
              }}
            >
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
