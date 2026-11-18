"use client";

import { useState } from "react";
import Tick from "./Tick";

type Result = { title: string; text: string; reason: string };

const OPTIONS: { label: string; result: Result }[] = [
  {
    label: "Tooth pain or swelling",
    result: {
      title: "Check-up, root canal or gum care",
      text: "Pain that lingers or comes with swelling should be examined soon. Call us for the earliest slot and Dr. Azeez will find the cause and explain your options.",
      reason: "Tooth pain or swelling: needs an examination",
    },
  },
  {
    label: "Crooked or gapped teeth",
    result: {
      title: "Orthodontics & aligners",
      text: "Braces or clear aligners can straighten teeth at any age. A first visit covers what would suit your teeth and your lifestyle.",
      reason: "Interested in orthodontics / aligners",
    },
  },
  {
    label: "Missing or broken teeth",
    result: {
      title: "Crowns, bridges & dentures",
      text: "Crowns protect damaged teeth, bridges close a gap, and dentures replace several teeth. We will explain which fits your case.",
      reason: "Missing or broken tooth: crowns, bridges or dentures",
    },
  },
  {
    label: "Stains or a dull smile",
    result: {
      title: "Aesthetic dentistry",
      text: "Restoring your smile is our speciality. Come in and we will look at what can brighten and refresh the way your teeth look.",
      reason: "Interested in aesthetic dentistry",
    },
  },
  {
    label: "Wisdom tooth trouble",
    result: {
      title: "Wisdom tooth removal",
      text: "A tooth at the back that hurts, swells or keeps getting trapped food may need attention. An examination shows whether it should come out.",
      reason: "Wisdom tooth trouble",
    },
  },
  {
    label: "A check-up for my child",
    result: {
      title: "Child dentistry",
      text: "Children are welcome for gentle first visits and regular check-ups, and our clinic has a kids' corner to help them feel at ease.",
      reason: "Check-up for my child",
    },
  },
  {
    label: "A routine check-up and cleaning",
    result: {
      title: "Check-up & scaling",
      text: "Regular check-ups and cleaning keep small problems small. Come in for an exam and a clean, and we will tell you how your teeth are doing.",
      reason: "Routine check-up and cleaning",
    },
  },
];

function bookWith(reason: string) {
  window.dispatchEvent(new CustomEvent("dz-prefill", { detail: { reason } }));
  const el = document.getElementById("contact");
  const lenis = (window as unknown as { __lenis?: { scrollTo: (t: Element, o?: object) => void } }).__lenis;
  if (el) {
    if (lenis) lenis.scrollTo(el, { duration: 1.4 });
    else el.scrollIntoView({ behavior: "smooth" });
  }
}

export default function Finder() {
  const [picked, setPicked] = useState<number | null>(null);
  const result = picked === null ? null : OPTIONS[picked].result;

  return (
    <div className="finder">
      <div className="finder-q" role="group" aria-label="What brings you in?">
        {OPTIONS.map((o, i) => (
          <button
            key={o.label}
            type="button"
            className={`chip${picked === i ? " on" : ""}`}
            aria-pressed={picked === i}
            onClick={() => setPicked(i)}
          >
            {o.label}
          </button>
        ))}
      </div>

      <div className="finder-a" aria-live="polite">
        {result ? (
          <div className="finder-card" key={picked}>
            <span className="finder-tag">Suggested for you</span>
            <h3>{result.title}</h3>
            <p>{result.text}</p>
            <div className="finder-actions">
              <button className="btn" type="button" onClick={() => bookWith(result.reason)}>
                <span>Book this visit</span>
                <Tick />
              </button>
              <a className="link" href="tel:+919845177371">
                Call 98451 77371
              </a>
              <button className="link-reset" type="button" onClick={() => setPicked(null)}>
                Start over
              </button>
            </div>
            <p className="finder-note">This is a starting point, not a diagnosis. Dr. Azeez will examine you and explain what is needed.</p>
          </div>
        ) : (
          <div className="finder-empty">
            <span className="finder-pulse" aria-hidden="true" />
            <p>Pick what is closest to your situation and we will point you to the right treatment.</p>
          </div>
        )}
      </div>
    </div>
  );
}
