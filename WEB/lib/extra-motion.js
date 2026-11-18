// @ts-nocheck
/* eslint-disable */
// Extra motion on top of the template animations. Expects window.gsap and window.ScrollTrigger.
export default function initExtraMotion() {
  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;
  if (!gsap || !ScrollTrigger) return;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  const root = document.documentElement;
  const SplitText = window.SplitText;

  // 0. Intro: a ring draws around the logo, then the curtain lifts and the hero lettering rises.
  const heroIntro = () => {
    const h1 = $(".giant");
    if (h1 && SplitText) {
      const sp = SplitText.create(h1, { type: "chars", mask: "chars" });
      gsap.from(sp.chars, {
        yPercent: 110,
        duration: 1.1,
        ease: "expo.out",
        stagger: 0.06,
        onComplete: () => sp.revert(),
      });
    }
    gsap.from(".hero-intro .lead, .hero-intro .roll, .hero-intro .actions, .hero-aim", {
      y: 28,
      autoAlpha: 0,
      duration: 0.9,
      ease: "power3.out",
      stagger: 0.12,
      delay: 0.25,
      clearProps: "transform,opacity,visibility",
    });
  };
  const loader = $(".loader");
  if (loader && root.classList.contains("intro")) {
    document.body.style.overflow = "hidden";
    const ring = $(".loader-ring", loader);
    gsap.set(ring, { strokeDasharray: 1, strokeDashoffset: 1 });
    gsap
      .timeline({
        onComplete: () => {
          loader.remove();
          root.classList.remove("intro");
          document.body.style.overflow = "";
          heroIntro();
        },
      })
      .to(ring, { strokeDashoffset: 0, duration: 1, ease: "power2.inOut" })
      .from($(".loader-mark img", loader), { scale: 0.5, autoAlpha: 0, duration: 0.7, ease: "back.out(2.4)" }, 0.15)
      .from($(".loader-name", loader), { y: 24, autoAlpha: 0, duration: 0.6, ease: "power3.out" }, 0.45)
      .to(loader, { yPercent: -100, duration: 0.95, ease: "expo.inOut" }, "+=0.35");
  } else {
    if (loader) loader.remove();
    heroIntro();
  }

  // 1. Reading-progress bar across the top of the page.
  const bar = $(".scroll-progress i");
  if (bar) {
    gsap.set(bar, { scaleX: 0, transformOrigin: "0 50%" });
    gsap.to(bar, {
      scaleX: 1,
      ease: "none",
      scrollTrigger: { start: 0, end: "max", scrub: 0.25 },
    });
  }

  // 2. Numbers count up when they scroll into view.
  $$(".fact-num").forEach((el) => {
    const target = parseInt(el.textContent, 10);
    if (!/^\d+$/.test(el.textContent.trim())) return;
    const o = { v: 0 };
    el.textContent = "0";
    ScrollTrigger.create({
      trigger: el,
      start: "top 88%",
      once: true,
      onEnter: () =>
        gsap.to(o, {
          v: target,
          duration: 1.8,
          ease: "power2.out",
          onUpdate: () => (el.textContent = Math.round(o.v)),
        }),
    });
  });

  // 3. Mosaic photos fade-scale in as they arrive.
  $$(".mo").forEach((fig) => {
    const img = $("img", fig);
    if (!img) return;
    gsap.fromTo(
      fig,
      { y: 40, autoAlpha: 0 },
      {
        y: 0,
        autoAlpha: 1,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: fig, start: "top 92%", once: true },
      },
    );
  });

  // 4. Magnetic buttons: they lean toward the pointer (desktop only).
  if (window.matchMedia("(hover:hover) and (pointer:fine)").matches) {
    $$(".btn, .hdr-cta").forEach((btn) => {
      const xTo = gsap.quickTo(btn, "x", { duration: 0.5, ease: "power3" });
      const yTo = gsap.quickTo(btn, "y", { duration: 0.5, ease: "power3" });
      btn.addEventListener("pointermove", (e) => {
        const r = btn.getBoundingClientRect();
        xTo((e.clientX - (r.left + r.width / 2)) * 0.18);
        yTo((e.clientY - (r.top + r.height / 2)) * 0.28);
      });
      btn.addEventListener("pointerleave", () => {
        xTo(0);
        yTo(0);
      });
    });
  }

  // 5. Posters drift sideways a little as you scroll past them (the idle float is CSS).
  $$(".qp img").forEach((img, i) => {
    const dir = i % 2 ? -1 : 1;
    gsap.fromTo(
      img,
      { rotation: -4 * dir },
      {
        rotation: 4 * dir,
        ease: "none",
        scrollTrigger: { trigger: img, start: "top bottom", end: "bottom top", scrub: 0.6 },
      },
    );
  });

  // 6. Rolling word in the hero line ("Dentistry that feels gentle / calm / caring / bright").
  const track = $(".roll-track");
  if (track) {
    const n = track.children.length - 1; // the last word copies the first, for a seamless loop
    const tl = gsap.timeline({ repeat: -1 });
    for (let i = 1; i <= n; i++) {
      tl.to(track, { yPercent: (-100 * i) / (n + 1), duration: 0.75, ease: "power3.inOut" }, "+=1.5");
    }
    tl.set(track, { yPercent: 0 });
  }

  // 7. Floating dental icons drift at their own speed as the page scrolls.
  $$(".fl").forEach((el) => {
    const speed = parseFloat(el.dataset.speed) || 40;
    gsap.fromTo(
      el,
      { y: -speed },
      {
        y: speed,
        ease: "none",
        scrollTrigger: { trigger: el.closest("section") || el, start: "top bottom", end: "bottom top", scrub: 0.8 },
      },
    );
  });

  // 8. The tooth outline draws itself, then fills and sparkles.
  const tooth = $(".tooth-draw");
  if (tooth) {
    const line = $(".td-line", tooth);
    gsap.set(line, { strokeDasharray: 1, strokeDashoffset: 1 });
    gsap
      .timeline({ scrollTrigger: { trigger: tooth, start: "top 80%", end: "bottom 45%", scrub: 0.7 } })
      .to(line, { strokeDashoffset: 0, ease: "none", duration: 1 })
      .to($(".td-fill", tooth), { opacity: 1, duration: 0.4 }, 0.8);
  }

  // 9. A smile is drawn across the footer as it comes into view.
  const smile = $(".smile-draw");
  if (smile) {
    const path = $("path", smile);
    gsap.set(path, { strokeDasharray: 1, strokeDashoffset: 1 });
    gsap.set($$(".cheek", smile), { scale: 0, transformOrigin: "50% 50%" });
    gsap
      .timeline({ scrollTrigger: { trigger: smile, start: "top 92%", end: "top 40%", scrub: 0.7 } })
      .to(path, { strokeDashoffset: 0, ease: "none", duration: 1 })
      .to($$(".cheek", smile), { scale: 1, duration: 0.25, stagger: 0.1, ease: "back.out(3)" }, 0.85);
  }

  // 10. Photos lean with scroll speed, then settle.
  const lean = $$(".mo, .gl");
  if (lean.length) {
    const set = gsap.quickSetter(lean, "skewY", "deg");
    const proxy = { s: 0 };
    ScrollTrigger.create({
      onUpdate: (self) => {
        const v = gsap.utils.clamp(-7, 7, self.getVelocity() / -260);
        if (Math.abs(v) > Math.abs(proxy.s)) {
          proxy.s = v;
          gsap.to(proxy, { s: 0, duration: 0.9, ease: "power3", overwrite: true, onUpdate: () => set(proxy.s) });
          set(v);
        }
      },
    });
  }

  // 11. A ring follows the pointer and grows over links and photos (mouse only).
  if (window.matchMedia("(hover:hover) and (pointer:fine)").matches) {
    const ring = document.createElement("div");
    ring.className = "cursor";
    ring.setAttribute("aria-hidden", "true");
    document.body.appendChild(ring);
    const xTo = gsap.quickTo(ring, "x", { duration: 0.35, ease: "power3" });
    const yTo = gsap.quickTo(ring, "y", { duration: 0.35, ease: "power3" });
    window.addEventListener(
      "pointermove",
      (e) => {
        ring.classList.add("on");
        xTo(e.clientX);
        yTo(e.clientY);
      },
      { passive: true },
    );
    document.addEventListener("pointerleave", () => ring.classList.remove("on"));
    document.addEventListener("pointerover", (e) => {
      const t = e.target.closest && e.target.closest("img[data-lightbox], a, button, summary, input, textarea, select");
      ring.classList.toggle("is-view", !!(t && t.matches && t.matches("img[data-lightbox]")));
      ring.classList.toggle("is-link", !!t);
    });
  }

  const fine = window.matchMedia("(hover:hover) and (pointer:fine)").matches;
  const lenisTo = (target, opts) => {
    if (window.__lenis) window.__lenis.scrollTo(target, opts);
    else if (target === 0) window.scrollTo({ top: 0, behavior: "smooth" });
    else target.scrollIntoView({ behavior: "smooth" });
  };

  // 12. The text band speeds up, slows down and even reverses as you scroll.
  const bandTrack = $(".band-track");
  if (bandTrack) {
    const tw = gsap.to(bandTrack, { xPercent: -50, duration: 46, ease: "none", repeat: -1 });
    let back;
    ScrollTrigger.create({
      onUpdate: (self) => {
        tw.timeScale(gsap.utils.clamp(-6, 8, 1 + self.getVelocity() / 220));
        clearTimeout(back);
        back = setTimeout(() => gsap.to(tw, { timeScale: 1, duration: 0.9, ease: "power2.out" }), 140);
      },
    });
  }

  // 13. Mosaic photos tilt in 3D toward the pointer.
  if (fine) {
    $$(".mo").forEach((fig) => {
      const img = $("img", fig);
      gsap.set(img, { transformPerspective: 900 });
      fig.addEventListener("pointermove", (e) => {
        const r = fig.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        gsap.to(img, { rotationY: px * 10, rotationX: -py * 10, scale: 1.06, duration: 0.45, ease: "power2.out", overwrite: "auto" });
      });
      fig.addEventListener("pointerleave", () =>
        gsap.to(img, { rotationX: 0, rotationY: 0, scale: 1, duration: 0.7, ease: "power3.out", overwrite: "auto" }),
      );
    });
  }

  // 14. The hero gently shifts with the pointer: bubbles and the poster at different depths.
  const hero = $(".hero");
  const heroPoster = $(".hero .qp-grid img");
  const bubbles = $(".bubbles");
  if (fine && hero && (heroPoster || bubbles)) {
    const mk = (el, p) => gsap.quickTo(el, p, { duration: 1.1, ease: "power3" });
    const bx = bubbles && mk(bubbles, "x");
    const by = bubbles && mk(bubbles, "y");
    const px = heroPoster && mk(heroPoster, "x");
    const py = heroPoster && mk(heroPoster, "y");
    hero.addEventListener("pointermove", (e) => {
      const nx = e.clientX / innerWidth - 0.5;
      const ny = e.clientY / innerHeight - 0.5;
      if (bx) { bx(nx * -36); by(ny * -24); }
      if (px) { px(nx * 34); py(ny * 24); }
    });
  }

  // 15. Back-to-top button whose ring fills as you read down the page.
  const top = document.createElement("button");
  top.type = "button";
  top.className = "totop";
  top.setAttribute("aria-label", "Back to top");
  top.innerHTML =
    '<svg viewBox="0 0 52 52" aria-hidden="true"><circle class="tr" cx="26" cy="26" r="24"/><circle class="pr" cx="26" cy="26" r="24" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1"/></svg><span class="ar" aria-hidden="true">\u2191</span>';
  document.body.appendChild(top);
  const prog = $(".pr", top);
  top.addEventListener("click", () => lenisTo(0, { duration: 1.6 }));
  ScrollTrigger.create({
    start: 0,
    end: "max",
    onUpdate: (self) => {
      prog.style.strokeDashoffset = String(1 - self.progress);
      top.classList.toggle("show", window.scrollY > 700);
    },
  });

  // 19. Drag the quote posters around; they spring back when let go (mouse only).
  if (fine && window.Draggable) {
    document.documentElement.classList.add("drag-on");
    $$(".qp img").forEach((img) => {
      const fig = img.closest(".qp");
      window.Draggable.create(img, {
        type: "x,y",
        zIndexBoost: false,
        onPress() {
          fig.classList.add("dragging");
          gsap.to(img, { scale: 1.07, duration: 0.2, overwrite: "auto" });
        },
        onRelease() {
          fig.classList.remove("dragging");
          gsap.to(img, { x: 0, y: 0, scale: 1, duration: 1.2, ease: "elastic.out(1, 0.45)", overwrite: "auto" });
        },
      });
    });
  }

  // 20. Clicking anywhere throws a small burst of sparkles (mouse only).
  if (fine) {
    const COLORS = ["#2563eb", "#22b8d6", "#c6f14d", "#ffffff"];
    document.addEventListener("pointerdown", (e) => {
      if (e.button !== 0) return;
      for (let i = 0; i < 9; i++) {
        const s = document.createElement("span");
        s.className = "spark";
        s.style.left = e.clientX + "px";
        s.style.top = e.clientY + "px";
        s.style.background = COLORS[i % COLORS.length];
        document.body.appendChild(s);
        const a = (Math.PI * 2 * i) / 9 + Math.random() * 0.6;
        const d = 28 + Math.random() * 38;
        gsap.fromTo(
          s,
          { x: 0, y: 0, scale: 1, opacity: 1 },
          {
            x: Math.cos(a) * d,
            y: Math.sin(a) * d,
            scale: 0,
            opacity: 0,
            rotation: 140,
            duration: 0.7 + Math.random() * 0.3,
            ease: "power2.out",
            onComplete: () => s.remove(),
          },
        );
      }
    });
  }

  // Things that pin or measure the finished layout wait until the template animations exist.
  const late = () => {
    // 16. Sideways photo tour: the section pins and the photos slide across as you scroll down.
    const tour = $(".tour");
    if (tour) {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1025px)", () => {
        const track = $(".tour-track", tour);
        const view = $(".tour-view", tour);
        const bar = $(".tour-bar i", tour);
        const dist = () => Math.max(0, track.scrollWidth - view.clientWidth);
        const tween = gsap.to(track, {
          x: () => -dist(),
          ease: "none",
          scrollTrigger: {
            trigger: tour,
            start: "top top",
            end: () => "+=" + (dist() + innerHeight * 0.3),
            pin: true,
            scrub: 0.6,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => gsap.set(bar, { scaleX: self.progress }),
          },
        });
        $$(".tour-card .tour-img img", tour).forEach((img) =>
          gsap.fromTo(
            img,
            { xPercent: -7 },
            {
              xPercent: 7,
              ease: "none",
              scrollTrigger: {
                trigger: img.closest(".tour-card"),
                containerAnimation: tween,
                start: "left right",
                end: "right left",
                scrub: true,
              },
            },
          ),
        );
      });
    }

    // 17. A photo opens from a small circle as you scroll to it.
    const rp = $(".reveal-photo");
    if (rp) {
      gsap.fromTo(
        rp,
        { clipPath: "circle(12% at 50% 50%)" },
        {
          clipPath: "circle(75% at 50% 50%)",
          ease: "none",
          scrollTrigger: { trigger: rp, start: "top 88%", end: "center 42%", scrub: 0.6 },
        },
      );
      gsap.fromTo(
        $("img", rp),
        { scale: 1.4 },
        { scale: 1, ease: "none", scrollTrigger: { trigger: rp, start: "top 88%", end: "bottom 30%", scrub: 0.6 } },
      );
    }

    // 18. Section dots on the right edge: they show where you are and jump on click (desktop).
    if (window.matchMedia("(min-width: 1025px)").matches) {
      const LABELS = {
        hero: "Top", about: "About", services: "Treatments", tour: "Photo tour", statement: "Our approach",
        why: "Why Dentizz", visit: "First visit", team: "Dentist", gallery: "Gallery", sectors: "Every age",
        finder: "Find a treatment", teeth: "Teeth chart", brush: "Brush timer", faq: "FAQ", contact: "Book",
      };
      const nav = document.createElement("nav");
      nav.className = "dots";
      nav.setAttribute("aria-label", "Page sections");
      const dots = [];
      $$("main [data-kind][id]")
        .filter((sec) => LABELS[sec.id])
        .forEach((sec) => {
          const dot = document.createElement("button");
          dot.type = "button";
          dot.className = "dot";
          dot.dataset.label = LABELS[sec.id];
          dot.setAttribute("aria-label", LABELS[sec.id]);
          dot.addEventListener("click", () => lenisTo(sec, { duration: 1.4, offset: sec.id === "hero" ? 0 : -70 }));
          nav.appendChild(dot);
          dots.push(dot);
          ScrollTrigger.create({
            trigger: sec,
            start: "top 55%",
            end: "bottom 55%",
            onToggle: (self) => {
              if (!self.isActive) return;
              dots.forEach((d) => d.classList.toggle("on", d === dot));
            },
          });
        });
      document.body.appendChild(nav);
    }

    ScrollTrigger.sort();
    ScrollTrigger.refresh();
  };
  setTimeout(late, 1100);
  window.addEventListener("load", () => setTimeout(() => ScrollTrigger.refresh(), 500), { once: true });

  ScrollTrigger.refresh();
}
