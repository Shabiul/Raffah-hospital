import Logo from "./Logo";
import Tick from "./Tick";

const links = [
  { href: "#services", label: "Treatments" },
  { href: "#why", label: "Why Dentizz" },
  { href: "#visit", label: "First visit" },
  { href: "#team", label: "Dentist" },
  { href: "#faq", label: "FAQ" },
];

// Static markup: the menu toggle and the tone changes are driven by lib/motion.js.
export default function Header() {
  return (
    <>
      <header className="hdr" data-tone="light">
        <div className="hdr-in">
          <div className="hdr-lead">
            <a className="hdr-brand" href="#hero" aria-label="Dentizz, back to the top">
              <Logo />
              <span>Dentizz</span>
            </a>
            <p className="hdr-tag">Speciality dental care in Richmond Town</p>
          </div>
          <nav className="hdr-nav" aria-label="Main">
            {links.map((l) => (
              <a key={l.href} className="link" href={l.href}>
                {l.label}
              </a>
            ))}
          </nav>
          <div className="hdr-side">
            <a className="hdr-login" href="tel:+919845177371">
              <span>Call now</span>
              <Tick />
            </a>
            <a className="hdr-cta" href="#contact">
              <span>Book online</span>
              <Tick />
            </a>
          </div>
          <button
            className="ibtn hdr-menu"
            type="button"
            aria-expanded="false"
            aria-controls="menu"
            aria-label="Open menu"
            data-label-open="Open menu"
            data-label-close="Close menu"
          >
            <svg viewBox="0 0 16 16" aria-hidden="true">
              <path d="M8 1v14M1 8h14" stroke="currentColor" strokeWidth="1.4" fill="none" />
            </svg>
          </button>
        </div>
      </header>

      <div className="menu" id="menu">
        <nav aria-label="Menu">
          {links.map((l) => (
            <a key={l.href} href={l.href}>
              {l.label}
            </a>
          ))}
          <a href="#contact">Contact</a>
        </nav>
        <div className="menu-foot">
          <a className="link" href="tel:+919845177371">
            98451 77371
          </a>
          <a className="link" href="tel:08040923102">
            080 - 4092 3102
          </a>
        </div>
      </div>
    </>
  );
}
