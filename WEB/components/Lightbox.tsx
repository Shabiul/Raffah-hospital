"use client";

import { useCallback, useEffect, useState } from "react";

type Item = { src: string; alt: string };

// Click any gallery photo (img with data-lightbox and data-full) to view it large.
export default function Lightbox() {
  const [items, setItems] = useState<Item[]>([]);
  const [index, setIndex] = useState<number | null>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const img = (e.target as Element | null)?.closest?.("img[data-lightbox]") as HTMLImageElement | null;
      if (!img) return;
      const all = Array.from(document.querySelectorAll<HTMLImageElement>("img[data-lightbox]"));
      setItems(all.map((i) => ({ src: i.dataset.full || i.src, alt: i.alt })));
      setIndex(all.indexOf(img));
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  const close = useCallback(() => setIndex(null), []);
  const step = useCallback(
    (d: number) => setIndex((i) => (i === null ? i : (i + d + items.length) % items.length)),
    [items.length],
  );

  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [index, close, step]);

  if (index === null || !items[index]) return null;
  const cur = items[index];
  let touchX = 0;

  return (
    <div
      className="lb"
      role="dialog"
      aria-modal="true"
      aria-label="Photo viewer"
      data-lenis-prevent
      onClick={(e) => e.target === e.currentTarget && close()}
      onTouchStart={(e) => (touchX = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        const dx = e.changedTouches[0].clientX - touchX;
        if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
      }}
    >
      <button className="lb-btn lb-x" onClick={close} aria-label="Close">
        &times;
      </button>
      <button className="lb-btn lb-prev" onClick={() => step(-1)} aria-label="Previous photo">
        &#8249;
      </button>
      <figure className="lb-fig">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={cur.src} alt={cur.alt} />
        <figcaption>
          {index + 1} / {items.length} · {cur.alt}
        </figcaption>
      </figure>
      <button className="lb-btn lb-next" onClick={() => step(1)} aria-label="Next photo">
        &#8250;
      </button>
    </div>
  );
}
