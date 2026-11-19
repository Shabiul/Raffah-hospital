import Header from "@/components/Header";
import ContactForm from "@/components/ContactForm";
import Motion from "@/components/Motion";
import Tagline from "@/components/Tagline";
import Tick from "@/components/Tick";
import Poster from "@/components/Poster";
import Lightbox from "@/components/Lightbox";
import { Bubbles, Floater, Loader, SmileArc, ToothDraw, Wave } from "@/components/Decor";
import Finder from "@/components/Finder";
import BrushTimer from "@/components/BrushTimer";
import OpenNow from "@/components/OpenNow";
import TeethExplorer from "@/components/TeethExplorer";
import HoursWeek from "@/components/HoursWeek";
import { ABOUT, COLLAGE, GRID, HERO, full, medium, photos, small } from "@/lib/gallery";

const img = (name: string) => `/images/${name}.jpg`;

const TOUR: [number, string][] = [
  [11, "The front door on Serpentine Street"],
  [1, "Waiting lounge"],
  [25, "Reception"],
  [6, "Consultation desk"],
  [12, "Treatment room"],
  [18, "Waiting area"],
  [20, "Sterilisation corner"],
  [22, "Instrument counter"],
];

const services = [
  {
    title: "General dentistry",
    text: "Thorough examinations, meticulous cleaning and conservative restorations that keep minor concerns minor.",
    points: ["Check-ups", "Scaling & polishing", "Fillings"],
    img: img("svc-checkup"),
    alt: "A dentist examining a patient in the dental chair",
  },
  {
    title: "Child dentistry",
    text: "Reassuring first appointments and attentive everyday care, in a practice with a children's corner of its own.",
    points: ["First visits", "Check-ups", "Child-friendly care"],
    img: img("svc-child"),
    alt: "A dentist checking a young boy's teeth",
  },
  {
    title: "Orthodontics & aligners",
    text: "Precisely planned braces and clear aligners that align your teeth and refine your smile.",
    points: ["Orthodontics", "Braces", "Aligners"],
    img: img("svc-braces"),
    alt: "Close-up of braces on teeth",
  },
  {
    title: "Root canal treatment",
    text: "Skilful, comfortable treatment that preserves the natural tooth and relieves pain at its source.",
    points: ["Root canal treatment", "Tooth pain relief"],
    img: img("svc-root"),
    alt: "A dental treatment chair ready for root canal treatment",
  },
  {
    title: "Wisdom tooth removal",
    text: "Oral and maxillofacial surgery: the careful, considered removal of wisdom teeth that cause pain, swelling or crowding.",
    points: ["Wisdom tooth removal", "Oral & maxillofacial surgery"],
    img: img("svc-surgery"),
    alt: "A dentist removing a tooth with the patient reclined",
  },
  {
    title: "Crowns & bridges",
    text: "Durable, finely crafted restorations that rebuild damaged teeth and close gaps with strength and confidence.",
    points: ["Crowns", "Bridges"],
    img: img("svc-implants"),
    alt: "A crown and implant model beside teeth models",
  },
  {
    title: "Dentures",
    text: "Comfortable, natural-looking dentures, crafted to restore function and the pleasure of a full smile.",
    points: ["Complete dentures", "Partial dentures"],
    img: img("svc-dentures"),
    alt: "A model of a complete set of dentures",
  },
  {
    title: "Aesthetic dentistry",
    text: "Restoring your smile is our speciality: refined, natural-looking results that feel entirely your own.",
    points: ["Smile restoration", "Aesthetic treatments"],
    img: img("svc-aesthetic"),
    alt: "A close-up of a bright, natural smile",
  },
];

const why = [
  { title: "Explain before we treat", text: "You see your X-rays and photos on screen and agree to every step before it begins." },
  { title: "No unnecessary work", text: "If a tooth can be saved or watched, we say so, even when it means a smaller bill." },
  { title: "Fixed, written prices", text: "Every plan comes with a written quote, and the final bill matches it." },
  { title: "Sterile every time", text: "Instruments are autoclaved and sealed for each patient, and you watch us open them." },
  { title: "Comfort comes first", text: "Numbing gel, noise-cancelling headphones and breaks whenever you raise a hand." },
  { title: "Care that follows up", text: "We call after every major treatment and remind you when your next visit is due." },
];

const steps = [
  {
    when: "Step one",
    title: "Call or send a request",
    text: "Use the form below, or call 98451 77371.",
  },
  {
    when: "Step two",
    title: "We confirm a time",
    text: "We call you back to confirm a slot in the morning or evening session.",
  },
  {
    when: "Your visit",
    title: "Exam and a clear plan",
    text: "Dr. Abdul Azeez and his team conduct a thorough examination, then set out your options and a clear, considered treatment plan.",
  },
  {
    when: "After treatment",
    title: "Follow-up care",
    text: "Dr. Abdul Azeez and his team schedule your follow-up care and advise on how best to protect your results.",
  },
];

const ages = [
  { name: "Children", note: "Child dentistry and check-ups" },
  { name: "Teenagers", note: "Orthodontics and aligners" },
  { name: "Adults", note: "Root canals, crowns, wisdom teeth" },
  { name: "Seniors", note: "Dentures, bridges, gum care" },
];

const faqs = [
  {
    q: "When is the clinic open?",
    a: "Monday to Saturday, 10:30 am to 1:00 pm and 5:00 pm to 8:30 pm. On Fridays we are open from 5:00 pm to 8:30 pm only. The clinic is closed on Sundays.",
  },
  {
    q: "How do I book an appointment?",
    a: "Send a request with the form on this page, or call 98451 77371.",
  },
  {
    q: "What treatments do you offer?",
    a: "Child dentistry, orthodontics, aligners, crowns and bridges, aesthetic dentistry, root canal treatment, dentures and wisdom tooth removal.",
  },
  {
    q: "Do you treat children?",
    a: "Yes. Child dentistry is one of our areas of care, and the clinic has a kids' corner.",
  },
  {
    q: "Why is an oral health check-up important?",
    a: "Poor dental health can be linked to heart disease, strokes, mouth cancer, diabetes, gum disease, tooth loss, bad breath, dental decay and lung conditions. A regular check-up helps catch problems early.",
  },
  {
    q: "Are everyone's teeth different?",
    a: "Yes. Tooth 'prints', just like fingerprints, are unique to every individual.",
  },
  {
    q: "Where are you?",
    a: "#10, Serpentine Street, opposite Blessington Apartment, Richmond Town, Bengaluru - 560 025.",
  },
];

export default function Home() {
  return (
    <>
      <Loader />
      <div className="scroll-progress" aria-hidden="true">
        <i />
      </div>
      <Header />

      <main>
        <section className="hero sheet" id="hero" data-kind="hero" data-tone="light">
          <div className="hero-pin">
            <Bubbles />
            <div className="hero-grid">
              <div className="hero-word">
                <h1 className="giant" style={{ ["--len" as string]: 7, ["--k" as string]: 0.47 }}>
                  Dentizz
                </h1>
              </div>
              <figure className="hero-window">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={full(HERO)}
                  alt={photos[HERO].alt}
                  width={1600}
                  height={1204}
                />
              </figure>
              <div className="hero-intro">
                <p className="lead">
                  Dentizz is a speciality dental practice in Richmond Town, Bengaluru, offering
                  precise, unhurried and compassionate care to patients of every age, from a
                  child&apos;s first appointment to complete smile rehabilitation.
                </p>
                <p className="roll">
                  Dentistry that feels{" "}
                  <span className="roll-words">
                    <span className="roll-track">
                      <b>meticulous</b>
                      <b>gentle</b>
                      <b>assured</b>
                      <b>enduring</b>
                      <b>meticulous</b>
                    </span>
                  </span>
                </p>
                <div className="actions">
                  <a className="btn" href="#contact">
                    <span>Book a consultation</span>
                    <Tick />
                  </a>
                  <a className="link" href="#services">
                    Explore treatments
                  </a>
                </div>
              </div>
              <div className="hero-aim">
                <p>Our promise</p>
                <Tagline />
                <OpenNow className="hero-open" />
              </div>
            </div>
            <div className="hero-stage" aria-hidden="true" />
            <p className="hero-statement">Expert dental care, meticulously delivered.</p>
          </div>
        </section>

        <section className="about sheet" id="about" data-kind="about" data-tone="light">
          <div className="grid about-top">
            <h2 className="about-title" data-split>
              Considered, expert dental care in the heart of Richmond Town.
            </h2>
            <figure className="about-photo frame" data-parallax="12">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={full(ABOUT)}
                alt={photos[ABOUT].alt}
                width={1204}
                height={1600}
                loading="lazy"
              />
            </figure>
            <div className="about-copy" data-reveal>
              <p className="lead">
                Dr. Abdul Azeez and his team pair clinical precision with an unhurried, personal
                approach. Every treatment is explained with clarity before it begins, and carried
                out with exacting attention to detail.
              </p>
              <a className="link" href="#team">
                Meet the dentist
              </a>
            </div>
          </div>
          <ul className="facts grid" style={{ gridTemplateColumns: "repeat(3, minmax(0, 1fr))" }}>
            <li className="fact">
              <span className="fact-rule" data-rule />
              <strong className="fact-num">2</strong>
              <span className="fact-label">decades of smiling for Bangalore</span>
            </li>
            <li className="fact">
              <span className="fact-rule" data-rule />
              <strong className="fact-num">6</strong>
              <span className="fact-label">days a week, Monday to Saturday</span>
            </li>
            <li className="fact">
              <span className="fact-rule" data-rule />
              <strong className="fact-num">2</strong>
              <span className="fact-label">sessions a day, morning and evening</span>
            </li>
          </ul>
          <Floater kind="sparkle" size={34} speed={60} style={{ right: "6%", top: "46%" }} />
          <Floater kind="drop" size={30} speed={-40} dur={11} style={{ left: "48%", top: "6%" }} />
        </section>

        <div className="band" aria-hidden="true">
          <ul className="band-track">
            {[0, 1].flatMap((c) =>
              ["Orthodontics", "Aligners", "Root canal", "Crowns & bridges", "Dentures", "Aesthetic dentistry", "Kids' dentistry", "Wisdom tooth removal"].map((w) => (
                <li className="band-item" key={`${c}-${w}`}>
                  <span className="w">{w}</span>
                  <i className="band-dot" />
                </li>
              )),
            )}
          </ul>
        </div>

        <section className="services sheet" id="services" data-kind="services" data-tone="light">
          <div className="grid svc-head">
            <h2 data-split>All your dental care, one roof</h2>
            <p>
              Check-ups, treatments and cosmetic care in one place, so your records and your plan
              stay together.
            </p>
          </div>
          <div className="grid svc-body">
            <div className="svc-stage" aria-hidden="true" />
            <ul className="svc-list">
              {services.map((s) => (
                <li className="svc" key={s.title}>
                  <figure className="svc-media frame">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={s.img}
                      srcSet={`${s.img.replace(".jpg", "-700.jpg")} 700w, ${s.img} 1400w`}
                      sizes="(max-width: 1024px) 92vw, 45vw"
                      alt={s.alt}
                      width={1400}
                      height={933}
                      loading="lazy"
                    />
                  </figure>
                  <h3>{s.title}</h3>
                  <p className="svc-text">{s.text}</p>
                  <ul className="svc-points">
                    {s.points.map((p) => (
                      <li key={p}>{p}</li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="tour" id="tour" data-kind="tour" data-tone="dark">
          <div className="tour-head">
            <h2 data-split>Take a look around</h2>
            <p>Scroll sideways through the clinic, from the front door to the treatment room.</p>
          </div>
          <div className="tour-view">
            <ul className="tour-track">
              {TOUR.map(([n, label], i) => (
                <li className="tour-card" key={n}>
                  <div className="tour-img">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={medium(n)} srcSet={`${small(n)} 480w, ${medium(n)} 900w`} sizes="(max-width: 1024px) 78vw, 30vw" data-full={full(n)} data-lightbox="" alt={photos[n].alt} width={photos[n].w} height={photos[n].h} decoding="async" fetchPriority="low" />
                  </div>
                  <p>
                    <span>{String(i + 1).padStart(2, "0")}</span>
                    {label}
                  </p>
                </li>
              ))}
            </ul>
          </div>
          <div className="tour-bar" aria-hidden="true">
            <i />
          </div>
        </section>

        <section className="statement sheet" id="statement" data-kind="statement" data-tone="light">
          <p className="statement-text" data-words>
            We listen first, explain with clarity and treat with precision, so that every visit leaves you with a healthier smile and complete peace of mind.
          </p>
          <figure className="reveal-photo">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/gallery/signboard.jpg" alt="The Dentizz signboard on Serpentine Street" width={860} height={645} loading="lazy" />
          </figure>
        </section>

        <section className="principles" id="why" data-kind="values" data-tone="accent">
          <div className="pr-field ruled">
            <div className="pr-head">
              <h2>How we care</h2>
              <p>Six promises every Dentizz doctor makes to every patient, every visit.</p>
            </div>
            <div className="pr-mark" aria-hidden="true" />
            <ol className="pr-list">
              {why.map((w) => (
                <li className="principle" key={w.title}>
                  <h3>{w.title}</h3>
                  <p>{w.text}</p>
                </li>
              ))}
            </ol>
            <div className="pr-progress" aria-hidden="true">
              <i />
            </div>
          </div>
        </section>

        <section className="process sheet" id="visit" data-kind="steps" data-tone="light">
          <div className="grid pc-grid">
            <div className="pc-head">
              <h2 data-split>Your first visit, simply</h2>
              <p>Four clear steps from hello to a healthy smile, with no surprises along the way.</p>
              <a className="btn btn-line" href="#contact">
                <span>Book a visit</span>
                <Tick />
              </a>
            </div>
            <div className="pc-track">
              <span className="pc-fill" aria-hidden="true" />
              <ol className="steps">
                {steps.map((s) => (
                  <li className="step" key={s.title}>
                    <p className="step-when">{s.when}</p>
                    <h3>{s.title}</h3>
                    <p>{s.text}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
          <Floater kind="brush" size={44} speed={50} dur={12} style={{ left: "44%", top: "8%" }} />
          <Floater kind="sparkle" size={28} speed={-50} style={{ right: "10%", top: "70%" }} />
        </section>

        <section className="team sheet" id="team" data-kind="team" data-tone="dark">
          <div className="grid tm-head">
            <h2 data-split>Meet Dr. Abdul Azeez</h2>
            <p className="soft">
              Dr. Abdul Azeez leads a dedicated team offering exacting, compassionate dentistry across
              every discipline of oral care.
            </p>
          </div>
          <div className="qp-row">
            <ToothDraw />
          </div>
          <div className="tm-foot">
            <p className="soft">Mon to Sat, 10:30 am to 1:00 pm and 5:00 pm to 8:30 pm.</p>
            <a className="btn" href="#contact">
              <span>Book a consultation</span>
              <Tick />
            </a>
          </div>
        </section>

        <section className="sectors sheet" id="sectors" data-kind="industries" data-tone="tint">
          <div className="grid sc-head">
            <h2 data-split>Care for every age</h2>
            <p>From a child&apos;s first visit to a grandparent&apos;s new denture, every stage of life is welcome.</p>
          </div>
          <ul className="sc-list">
            {ages.map((a) => (
              <li className="sector" data-drift key={a.name}>
                <h3 className="sector-name">{a.name}</h3>
                <p className="sector-note">{a.note}</p>
              </li>
            ))}
          </ul>
          <Floater kind="ring" size={42} speed={50} dur={13} style={{ right: "8%", top: "12%" }} />
          <Floater kind="sparkle" size={30} speed={-40} style={{ left: "50%", bottom: "8%" }} />
        </section>

        <section className="voices sheet" id="voices" data-kind="reviews" data-tone="paper">
          <div className="grid vc-head">
            <h2 data-split>Principles of a healthy smile</h2>
            <p>
              A collection of reminders, kept close at the practice, on the small daily habits that
              safeguard your teeth for a lifetime.
            </p>
          </div>
          <div className="qwall">
            <Poster n={17} flow at={{ rotate: -3, width: 230 }} />
            <Poster n={18} flow at={{ rotate: 2, width: 250 }} />
            <Poster n={19} flow at={{ rotate: -2, width: 230 }} />
            <Poster n={20} flow at={{ rotate: 3, width: 225 }} />
            <Poster n={21} flow at={{ rotate: -3, width: 260 }} />
            <Poster n={22} flow at={{ rotate: 2, width: 230 }} />
            <Poster n={23} flow at={{ rotate: -2, width: 240 }} />
            <Poster n={24} flow at={{ rotate: 3, width: 235 }} />
            <Poster n={25} flow at={{ rotate: -3, width: 200 }} />
            <Poster n={26} flow at={{ rotate: 1, width: 360 }} />
            <Poster n={27} flow at={{ rotate: -2, width: 280 }} />
            <Poster n={28} flow at={{ rotate: 3, width: 250 }} />
            <Poster n={29} flow at={{ rotate: -3, width: 215 }} />
            <Poster n={30} flow at={{ rotate: 2, width: 260 }} />
          </div>
        </section>

        <section className="finder-sec sheet" id="finder" data-kind="finder" data-tone="light">
          <div className="grid fn-head">
            <h2 data-split>Not sure where to start?</h2>
            <p>Tell us what is bothering you and we will suggest the treatment to ask about.</p>
          </div>
          <Finder />
        </section>

        <section className="teeth-sec sheet" id="teeth" data-kind="teeth" data-tone="paper">
          <div className="grid fn-head">
            <h2 data-split>Meet your teeth</h2>
            <p>Tap any tooth to see what it does and how to look after it. Switch between adult and baby teeth.</p>
          </div>
          <TeethExplorer />
        </section>

        <section className="brush-sec sheet" id="brush" data-kind="brush" data-tone="dark">
          <div className="grid fn-head">
            <h2 data-split>Brush like a pro</h2>
            <p>A two-minute timer that walks you around your mouth. Try it tonight.</p>
          </div>
          <BrushTimer />
        </section>

        <section className="faq sheet" id="faq" data-kind="faq" data-tone="paper">
          <div className="grid fq-grid">
            <div className="fq-head">
              <h2 data-split>Questions patients ask</h2>
              <p className="muted">Can&apos;t find your answer? Call 98451 77371.</p>
            </div>
            <div className="fq-list">
              {faqs.map((f) => (
                <details className="fq" key={f.q}>
                  <summary>
                    {f.q}
                    <span className="fq-icon" aria-hidden="true" />
                  </summary>
                  <p className="fq-a">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
          <Floater kind="tooth" size={56} speed={70} dur={16} style={{ right: "6%", top: "8%" }} />
          <Floater kind="plus" size={26} speed={-40} dur={9} style={{ left: "46%", bottom: "12%" }} />
        </section>

        <section className="contact sheet" id="contact" data-kind="contact" data-tone="dark">
          <Wave />
          <div className="grid ct-grid">
            <h2 className="ct-title" data-split>
              Your healthier smile starts with one visit.
            </h2>
            <div className="ct-details">
              <dl>
                <div>
                  <dt>Address</dt>
                  <dd>
                    #10, Serpentine Street, Opp Blessington Apartment,
                    <br />
                    Richmond Town, Bengaluru - 560 025
                  </dd>
                </div>
                <div>
                  <dt>Phone</dt>
                  <dd>
                    <a className="link" href="tel:+919845177371">
                      98451 77371
                    </a>
                  </dd>
                </div>
                <div>
                  <dt>Clinic timings</dt>
                  <dd>
                    Mon to Sat: 10:30 am to 1:00 pm
                    <br />
                    and 5:00 pm to 8:30 pm
                    <br />
                    Friday: 5:00 pm to 8:30 pm
                    <br />
                    Sunday: holiday
                  </dd>
                  <dd>
                    <OpenNow />
                  </dd>
                </div>
                <div>
                  <dt>Online</dt>
                  <dd>
                    <a className="link" href="mailto:abukdrazeez98@gmail.com">
                      abukdrazeez98@gmail.com
                    </a>
                    <br />
                    <a
                      className="link"
                      href="https://www.instagram.com/denti_zz"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      @denti_zz on Instagram
                    </a>
                  </dd>
                </div>
              </dl>
            </div>
            <ContactForm />
            <div className="ct-week">
              <HoursWeek />
            </div>
          </div>
        </section>
      </main>

      <footer className="ftr" id="site-footer" data-tone="dark">
        <div className="grid ftr-grid">
          <div className="ftr-col ftr-lead">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="ftr-logo" src="/logo-full-white.png" alt="Dentizz: Add Smile to your Face" width={1301} height={329} />
            <a className="btn" href="#contact">
              <span>Book a consultation</span>
              <Tick />
            </a>
          </div>
          <nav className="ftr-col" aria-label="Clinic">
            <p className="ftr-h">Clinic</p>
            <a className="link" href="#services">Treatments</a>
            <a className="link" href="#why">How we care</a>
            <a className="link" href="#team">Dentist</a>
            <a className="link" href="#faq">FAQ</a>
          </nav>
          <div className="ftr-col">
            <p className="ftr-h">Visit</p>
            <p>#10, Serpentine Street, Richmond Town, Bengaluru - 560 025</p>
            <p>Mon to Sat, closed Sundays</p>
          </div>
          <div className="ftr-col">
            <p className="ftr-h">Call</p>
            <a className="link" href="tel:+919845177371">98451 77371</a>
            <a className="link ftr-top" href="#hero">Back to top</a>
          </div>
        </div>
        <SmileArc />
        <div className="ftr-word" style={{ ["--len" as string]: 7, ["--k" as string]: 0.56 }} aria-hidden="true">
          <span className="ftr-name">DENTIZZ</span>
        </div>
        <div className="ftr-base">
          <span>&copy; 2026 Dentizz Speciality Dental Care</span>
          <span>Richmond Town, Bengaluru</span>
        </div>
      </footer>

      <nav className="mbar" aria-label="Quick actions">
        <a className="mbar-call" href="tel:+919845177371">
          Call
        </a>
        <a className="mbar-book" href="#contact">
          Book appointment
        </a>
      </nav>

      <Lightbox />
      <Motion />
    </>
  );
}
