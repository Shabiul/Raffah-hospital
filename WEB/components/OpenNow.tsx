"use client";

import { useEffect, useState } from "react";

// Clinic hours (India Standard Time), in minutes after midnight.
// Mon to Sat: 10:30-13:00 and 17:00-20:30. Friday: 17:00-20:30 only. Sunday: closed.
const MORNING: [number, number] = [10 * 60 + 30, 13 * 60];
const EVENING: [number, number] = [17 * 60, 20 * 60 + 30];
const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const sessions = (day: number): [number, number][] => (day === 0 ? [] : day === 5 ? [EVENING] : [MORNING, EVENING]);
const clock = (m: number) => {
  const h = Math.floor(m / 60);
  const mm = m % 60;
  return `${((h + 11) % 12) + 1}${mm ? ":" + String(mm).padStart(2, "0") : ""} ${h < 12 ? "am" : "pm"}`;
};

function status(now = new Date()) {
  const p = Object.fromEntries(
    new Intl.DateTimeFormat("en-US", { timeZone: "Asia/Kolkata", weekday: "short", hour: "numeric", minute: "numeric", hour12: false })
      .formatToParts(now)
      .map((x) => [x.type, x.value]),
  );
  const day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(p.weekday);
  const mins = (Number(p.hour) % 24) * 60 + Number(p.minute);

  const today = sessions(day);
  const current = today.find(([a, b]) => mins >= a && mins < b);
  if (current) return { open: true, text: `Open now · until ${clock(current[1])}` };

  const next = today.find(([a]) => mins < a);
  if (next) return { open: false, text: `Closed · opens today at ${clock(next[0])}` };

  for (let i = 1; i <= 7; i++) {
    const d = (day + i) % 7;
    const s = sessions(d);
    if (s.length) return { open: false, text: `Closed · opens ${i === 1 ? "tomorrow" : DAYS[d]} at ${clock(s[0][0])}` };
  }
  return { open: false, text: "Closed" };
}

export default function OpenNow({ className = "" }: { className?: string }) {
  const [s, setS] = useState<ReturnType<typeof status> | null>(null);

  useEffect(() => {
    setS(status());
    const id = setInterval(() => setS(status()), 30000);
    return () => clearInterval(id);
  }, []);

  if (!s) return null;
  return (
    <p className={`open-pill ${s.open ? "is-open" : "is-closed"} ${className}`} role="status">
      <i aria-hidden="true" />
      {s.text}
    </p>
  );
}
