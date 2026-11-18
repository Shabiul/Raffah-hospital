"use client";

import { useEffect, useRef, useState } from "react";

// Hours in minutes after midnight, drawn on a 10:00 to 21:00 axis.
const START = 10 * 60;
const END = 21 * 60;
const M: [number, number] = [10 * 60 + 30, 13 * 60];
const E: [number, number] = [17 * 60, 20 * 60 + 30];

const WEEK: { day: string; short: string; slots: [number, number][] }[] = [
  { day: "Monday", short: "Mon", slots: [M, E] },
  { day: "Tuesday", short: "Tue", slots: [M, E] },
  { day: "Wednesday", short: "Wed", slots: [M, E] },
  { day: "Thursday", short: "Thu", slots: [M, E] },
  { day: "Friday", short: "Fri", slots: [E] },
  { day: "Saturday", short: "Sat", slots: [M, E] },
  { day: "Sunday", short: "Sun", slots: [] },
];

const pct = (m: number) => ((m - START) / (END - START)) * 100;
const clock = (m: number) => {
  const h = Math.floor(m / 60);
  const mm = m % 60;
  return `${((h + 11) % 12) + 1}${mm ? ":" + String(mm).padStart(2, "0") : ""}${h < 12 ? "am" : "pm"}`;
};

export default function HoursWeek() {
  const ref = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(false);
  const [today, setToday] = useState<string | null>(null);

  useEffect(() => {
    const wd = new Intl.DateTimeFormat("en-US", { timeZone: "Asia/Kolkata", weekday: "long" }).format(new Date());
    setToday(wd);
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) return setSeen(true);
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div className={`week${seen ? " seen" : ""}`} ref={ref}>
      <p className="week-title">This week at Dentizz</p>
      <ul>
        {WEEK.map((d, i) => (
          <li key={d.day} className={d.day === today ? "today" : ""} style={{ ["--i" as string]: i }}>
            <span className="week-day">
              {d.short}
              {d.day === today && <em>today</em>}
            </span>
            <span className="week-track" aria-label={d.slots.length ? d.slots.map((s) => `${clock(s[0])} to ${clock(s[1])}`).join(" and ") : "Closed"}>
              {d.slots.map((s) => (
                <i key={s[0]} style={{ left: `${pct(s[0])}%`, width: `${pct(s[1]) - pct(s[0])}%` }} />
              ))}
              {!d.slots.length && <b>Closed</b>}
            </span>
          </li>
        ))}
      </ul>
      <div className="week-axis" aria-hidden="true">
        {[10, 12, 14, 16, 18, 20].map((h) => (
          <span key={h} style={{ left: `${pct(h * 60)}%` }}>
            {clock(h * 60)}
          </span>
        ))}
      </div>
    </div>
  );
}
