import Header from "@/components/Header";
import ContactForm from "@/components/ContactForm";
import Motion from "@/components/Motion";
import Logo from "@/components/Logo";
import Tick from "@/components/Tick";
import Poster from "@/components/Poster";

const img = (name: string) => `/images/${name}.jpg`;

const services = [
  {
    title: "Child dentistry",
    text: "Gentle check-ups and everyday care for children, in a clinic with a kids' corner of their own.",
    points: ["First visits", "Check-ups", "Child-friendly care"],
    img: img("svc-child"),
    alt: "A child having a gentle first dental visit",
    poster: { n: 22, width: 190, rotate: 3 },
  },
  {
    title: "Orthodontics & aligners",
    text: "Straighten your teeth with braces or clear aligners, planned around your smile.",
    points: ["Orthodontics", "Braces", "Aligners"],
    img: img("svc-braces"),
    alt: "Close-up of braces on teeth",
  },
  {
    title: "Crowns, bridges & dentures",
    text: "Replace or restore missing and damaged teeth so you can eat and smile with confidence.",
    points: ["Crowns", "Bridges", "Dentures"],
    img: img("svc-implants"),
    alt: "A dentist showing a dental implant model",
    poster: { n: 19, width: 200, rotate: -3 },
  },
  {
    title: "Aesthetic dentistry",
    text: "Restoring your smile is our speciality, with treatments that look natural and feel right.",
    points: ["Smile restoration", "Aesthetic treatments"],
    img: img("svc-aesthetic"),
    alt: "A dentist explaining a smile design",
  },
  {
    title: "Root canal & wisdom tooth removal",
    text: "Treatment for painful or infected teeth, and careful removal of troublesome wisdom teeth.",
    points: ["Root canal treatment", "Wisdom tooth removal"],
    img: img("svc-checkup"),
    alt: "A routine dental check-up",
    poster: { n: 25, width: 180, rotate: 4 },
  },
];

const why = [
  {
    title: "A registered dentist",
    tag: "Registered dentist",
    text: "Dr. Abdul Azeez (Reg. No. 14934A) looks after your treatment.",
  },
  {
    title: "Complete dental care",
    tag: "Complete care",
    text: "From child dentistry to dentures, eight areas of care under one roof.",
  },
  {
    title: "Open six days a week",
    tag: "Six days a week",
    text: "Monday to Saturday, with morning and evening sessions. Closed on Sundays.",
  },
  {
    title: "Easy to find",
    tag: "Easy to find",
    text: "#10, Serpentine Street, opposite Blessington Apartment, Richmond Town.",
  },
];

const steps = [
  {
    when: "Step one",
    title: "Call or send a request",
    text: "Use the form below, or call 98451 77371 or 080 - 4092 3102.",
  },
  {
    when: "Step two",
    title: "We confirm a time",
    text: "We call you back to confirm a slot in the morning or evening session.",
  },
  {
    when: "Your visit",
    title: "Exam and a clear plan",
    text: "Dr. Azeez checks your teeth and gums and explains your options in plain words.",
  },
  {
    when: "After treatment",
    title: "Follow-up care",
    text: "We tell you how to look after your teeth and when to come back.",
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
    a: "Send a request with the form on this page, or call 98451 77371 or 080 - 4092 3102.",
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
      <Header />

      <main>
        <section className="hero sheet" id="hero" data-kind="hero" data-tone="light">
          <div className="hero-pin">
            <div className="hero-grid">
              <div className="hero-word">
                <h1 className="giant" style={{ ["--len" as string]: 7 }}>
                  Dentizz
                </h1>
              </div>
              <figure className="hero-window">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img("treatment-room-wide")}
                  alt="Two dental chairs in the Dentizz treatment room"
                  width={1204}
                  height={1600}
                />
              </figure>
              <div className="hero-intro">
                <p className="lead">
                  Dentizz is a speciality dental clinic in Richmond Town, Bengaluru, caring for
                  children and adults with braces, aligners, root canals, crowns, dentures and
                  more.
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
              <Poster n={17} grid at={{ rotate: -4, width: 200 }} />
              <div className="hero-aim">
                <p>Our promise</p>
                <p>Add smile to your face.</p>
              </div>
            </div>
            <div className="hero-stage" aria-hidden="true" />
            <p className="hero-statement">Add smile to your face.</p>
          </div>
        </section>

        <section className="about sheet" id="about" data-kind="about" data-tone="light">
          <div className="grid about-top">
            <h2 className="about-title" data-split>
              Speciality dental care, close to home in Richmond Town.
            </h2>
            <figure className="about-photo frame" data-parallax="12">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img("reception")}
                alt="The Dentizz reception and waiting area"
                width={1600}
                height={1204}
                loading="lazy"
              />
            </figure>
            <div className="about-copy" data-reveal>
              <p className="lead">
                Dr. Abdul Azeez and the Dentizz team look after your teeth and gums, from a
                child&apos;s first visit to dentures. Come in, sit down, and we will explain every
                step.
              </p>
              <a className="link" href="#team">
                Meet the dentist
              </a>
            </div>
          </div>
          <ul className="facts grid">
            <li className="fact">
              <span className="fact-rule" data-rule />
              <strong className="fact-num">8</strong>
              <span className="fact-label">areas of dental care under one roof</span>
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
            <li className="fact">
              <span className="fact-rule" data-rule />
              <strong className="fact-num">2</strong>
              <span className="fact-label">phone lines to book or ask a question</span>
            </li>
          </ul>
          <Poster n={18} at={{ right: "4%", top: "8%", rotate: 3, width: 225 }} />
        </section>

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
                    <img src={s.img} alt={s.alt} width={1400} height={933} loading="lazy" />
                  </figure>
                  <h3>{s.title}</h3>
                  <p className="svc-text">{s.text}</p>
                  <ul className="svc-points">
                    {s.points.map((p) => (
                      <li key={p}>{p}</li>
                    ))}
                  </ul>
                  {s.poster && (
                    <Poster
                      n={s.poster.n as 19 | 22 | 25}
                      at={{ right: "3%", bottom: "28px", width: s.poster.width, rotate: s.poster.rotate }}
                    />
                  )}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="principles" id="why" data-kind="values" data-tone="accent">
          <div className="pr-field ruled">
            <div className="pr-head">
              <h2>Why Dentizz</h2>
              <p>Four reasons patients in Richmond Town choose us for their teeth.</p>
            </div>
            <div className="pr-mark" aria-hidden="true" />
            <ol className="pr-list">
              {why.map((w) => (
                <li className="principle" data-tag={w.tag} key={w.title}>
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
              <Poster n={20} flow at={{ rotate: -3, width: 220 }} />
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
              <Poster n={24} flow at={{ rotate: 3, width: 220 }} />
            </div>
          </div>
        </section>

        <section className="team sheet" id="team" data-kind="team" data-tone="dark">
          <div className="grid tm-head">
            <h2 data-split>Meet Dr. Abdul Azeez</h2>
            <p className="soft">Dentizz is led by Dr. Abdul Azeez, registered dentist, Reg. No. 14934A.</p>
          </div>
          <div className="qp-row">
            <Poster n={28} flow at={{ rotate: -3, width: 297 }} />
            <Poster n={30} flow at={{ rotate: 3, width: 283 }} />
          </div>
          <div className="tm-foot">
            <p className="soft">Mon to Sat, 10:30 am to 1:00 pm and 5:00 pm to 8:30 pm.</p>
            <a className="btn" href="#contact">
              <span>Book a consultation</span>
              <Tick />
            </a>
          </div>
        </section>

        <section className="gallery sheet" id="gallery" data-kind="gallery" data-tone="light">
          <div className="grid gl-head">
            <h2 data-split>A calm place for care</h2>
            <p>
              A bright, clean clinic on Serpentine Street, with a comfortable waiting area and
              modern treatment chairs.
            </p>
          </div>
          <div className="collage">
            {[
              ["gl-a", "-8", "waiting-lounge", 1600, 1204, "The waiting lounge"],
              ["gl-b", "14", "signboard", 1200, 1600, "The Dentizz signboard on Serpentine Street"],
              ["gl-c", "26", "storefront", 1200, 1600, "The Dentizz clinic entrance"],
              ["gl-d", "4", "treatment-room", 1204, 1600, "A treatment room with dental chair"],
              ["gl-e", "20", "treatment-room-wide", 1204, 1600, "Two dental chairs side by side"],
            ].map(([cls, depth, name, w, h, alt]) => (
              <figure className={`gl ${cls} frame`} data-depth={depth} key={cls as string}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img(name as string)}
                  alt={alt as string}
                  width={w as number}
                  height={h as number}
                  loading="lazy"
                />
              </figure>
            ))}
          </div>
          <Poster n={21} at={{ left: "52%", top: "4%", rotate: 3, width: 220 }} />
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
          <div className="qp-row">
            <Poster n={27} flow at={{ rotate: -3, width: 290 }} />
            <Poster n={26} flow at={{ rotate: 2, width: 400 }} />
          </div>
        </section>

        <section className="faq sheet" id="faq" data-kind="faq" data-tone="paper">
          <div className="grid fq-grid">
            <div className="fq-head">
              <h2 data-split>Questions patients ask</h2>
              <p className="muted">Can&apos;t find your answer? Call 98451 77371.</p>
              <Poster n={23} flow at={{ rotate: -3, width: 200 }} />
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
        </section>

        <section className="contact sheet" id="contact" data-kind="contact" data-tone="dark">
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
                    <br />
                    <a className="link" href="tel:08040923102">
                      080 - 4092 3102
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
          </div>
          <Poster n={29} at={{ right: "3%", top: "2%", rotate: 3, width: 165 }} />
        </section>
      </main>

      <footer className="ftr" id="site-footer" data-tone="dark">
        <div className="grid ftr-grid">
          <div className="ftr-col ftr-lead">
            <p>Add smile to your face.</p>
            <a className="btn" href="#contact">
              <span>Book a consultation</span>
              <Tick />
            </a>
          </div>
          <nav className="ftr-col" aria-label="Clinic">
            <p className="ftr-h">Clinic</p>
            <a className="link" href="#services">Treatments</a>
            <a className="link" href="#why">Why Dentizz</a>
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
            <a className="link" href="tel:08040923102">080 - 4092 3102</a>
            <a className="link ftr-top" href="#hero">Back to top</a>
          </div>
        </div>
        <div className="ftr-word" style={{ ["--len" as string]: 7 }} aria-hidden="true">
          <Logo />
          <span className="ftr-name">Dentizz</span>
        </div>
        <div className="ftr-base">
          <span>&copy; 2026 Dentizz Speciality Dental Care</span>
          <span>Richmond Town, Bengaluru</span>
        </div>
      </footer>

      <Motion />
    </>
  );
}
