import { useEffect, useRef, useState } from "react";
import {
  ArrowUpRight,
  ArrowRight,
  PaintBrush,
  MusicNotes,
  Shapes,
  Books,
  List,
  X,
  Flower,
  MapPin,
  InstagramLogo,
} from "@phosphor-icons/react";
import { WA, programs, works } from "./content";
export function LinkButton({ children, to = "/contact/", light = false }) {
  return (
    <a className={`button ${light ? "light" : ""}`} href={to}>
      {children}
      <ArrowUpRight size={17} />
    </a>
  );
}
export function FlowerMark({ size = 48, className = "" }) {
  return (
    <span
      aria-hidden="true"
      className={"flower-mark " + className}
      style={{ "--flower-size": size + "px" }}
    />
  );
}
export function Brand() {
  return (
    <a href="/" className="brand" aria-label="Nascere Studio home">
      <img
        src="/assets/nascere-wordmark.png"
        width="240"
        height="240"
        alt="Nascere"
      />
    </a>
  );
}
export function Header({ path }) {
  const [open, setOpen] = useState(false);
  const trigger = useRef(null);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    document.querySelector("main")?.toggleAttribute("inert", open);
    document.querySelector("footer")?.toggleAttribute("inert", open);
    const key = (e) => {
      if (open && e.key === "Tab") {
        const items = [
          ...document.querySelectorAll("header a,header button"),
        ].filter((el) => el.getClientRects().length);
        const first = items[0],
          last = items.at(-1);
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
      if (e.key === "Escape") {
        setOpen(false);
        trigger.current?.focus();
      }
    };
    const resize = () => {
      if (window.innerWidth > 650) setOpen(false);
    };
    window.addEventListener("resize", resize);
    window.addEventListener("keydown", key);
    return () => {
      document.body.style.overflow = "";
      document.querySelector("main")?.removeAttribute("inert");
      document.querySelector("footer")?.removeAttribute("inert");
      window.removeEventListener("keydown", key);
      window.removeEventListener("resize", resize);
    };
  }, [open]);
  return (
    <header>
      <div className="nav-wrap">
        <Brand />
        <nav aria-label="Main navigation" className={open ? "is-open" : ""}>
          <a
            href="/studio/"
            aria-current={path === "/studio" ? "page" : undefined}
          >
            Our studio
          </a>
          <a
            href="/programs/"
            aria-current={path.startsWith("/programs") ? "page" : undefined}
          >
            Programs
          </a>
          <a
            href="/toys/"
            aria-current={path === "/toys" ? "page" : undefined}
          >
            Our toys
          </a>
          <a
            href="/journal/"
            aria-current={path.startsWith("/journal") ? "page" : undefined}
          >
            Studio journal
          </a>
          <a href="/contact/">Get in touch</a>
          <a className="mobile-enroll" href={WA}>
            Enquire about a class
          </a>
        </nav>
        <a className="nav-cta" href="/contact/">
          Let’s talk <ArrowUpRight size={16} />
        </a>
        <button
          ref={trigger}
          className="menu-toggle"
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={26} /> : <List size={26} />}
        </button>
      </div>
    </header>
  );
}
export function Eyebrow({ children }) {
  return <p className="eyebrow">{children}</p>;
}
export function Hero() {
  return (
    <section className="hero">
      <div className="hero-main wrap">
        <div className="hero-copy">
          <Eyebrow>
            <FlowerMark size={25} /> A CHILDHOOD FULL OF COLOR
          </Eyebrow>
          <h1>
            Little minds.
            <br />
            <em>Big possibilities.</em>
          </h1>
          <p>
            For the music makers. The color explorers.
            <br />
            The wonderfully curious.
            <br />
            <span>Arts, craft & music for children aged 3–12 in Aizawl.</span>
          </p>
          <div className="hero-actions">
            <LinkButton>Find their happy place</LinkButton>
            <a className="text-link" href="/programs/">
              Explore programs <ArrowRight size={18} />
            </a>
          </div>
          <p className="hero-note">
            A little messy. A lot of learning. Always Nascere.
          </p>
        </div>
        <div className="hero-visual">
          <img
            className="hero-art"
            src="/assets/nascere-hero-scene.webp"
            alt="Three children and a little dog beside a heart-shaped playhouse, colorful trees and Nascere’s sunflower"
            width="1536"
            height="1024"
            fetchpriority="high"
          />
          <span className="art-caption">a space to make, play & become</span>
        </div>
      </div>
      <div className="hero-foot">
        <div className="wrap">
          <span>
            <MusicNotes size={24} weight="light" /> Music
          </span>
          <FlowerMark size={30} />
          <span>
            <PaintBrush size={24} weight="light" /> Colors
          </span>
          <FlowerMark size={30} />
          <span>
            <Books size={24} weight="light" /> Stories
          </span>
          <small>THREE LITTLE WORDS. A WORLD OF POSSIBILITY.</small>
        </div>
      </div>
    </section>
  );
}
export function Introduction({ full = false }) {
  return (
    <section className="introduction">
      <div className="wrap intro-grid reveal">
        <div>
          <Eyebrow>WELCOME TO NASCERE</Eyebrow>
          <h2>
            Room to wonder.
            <br />
            Space to <em>grow.</em>
          </h2>
        </div>
        <div className="intro-copy">
          <FlowerMark size={60} />
          <p>
            Some of the best learning begins with a little curiosity. A brush
            dipped in color. A melody played for the first time. A story that
            opens up a whole new world.
          </p>
          <p>
            At Nascere, we bring arts, craft and music into childhood — creating
            a warm space for young minds to explore and express themselves.
          </p>
          {!full && (
            <a className="text-link" href="/studio/">
              A little more about us <ArrowRight />
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
export function ProgramGrid() {
  return (
    <div className="program-grid">
      {programs.map(({ slug, title, icon: Icon, color, description }, i) => (
        <a
          className="program-card reveal"
          key={slug}
          href={"/programs/" + slug + "/"}
        >
          <div className={"program-icon " + color}>
            <Icon size={57} weight="thin" />
          </div>
          <span className="program-number">0{i + 1}</span>
          <h3>{title}</h3>
          <p>{description.split(". ")[0]}.</p>
          <span className="program-link">
            Explore <ArrowUpRight size={18} />
          </span>
        </a>
      ))}
    </div>
  );
}
export function Programs({ page = false }) {
  const Heading = page ? "h1" : "h2";
  return (
    <section className={"programs " + (page ? "page-section" : "")}>
      <div className="wrap">
        <div className="section-heading reveal">
          <div>
            <Eyebrow>FIND THEIR KIND OF HAPPY</Eyebrow>
            <Heading>
              A little spark.
              <br />
              <em>So many ways to shine.</em>
            </Heading>
          </div>
          <p>
            No two children are the same.
            <br />
            There’s more than one way to shine.
          </p>
        </div>
        <ProgramGrid />
      </div>
    </section>
  );
}
export function WorkCard({ work }) {
  return (
    <a className="work-card reveal" href={"/journal/" + work.slug + "/"}>
      <div className="work-image">
        <img
          src={"/assets/" + work.image + ".jpg"}
          alt={work.title + " — original post from Nascere Studio"}
          width="512"
          height="640"
          loading="lazy"
        />
        <span className="image-arrow">
          <ArrowUpRight size={24} />
        </span>
      </div>
      <div className="work-caption">
        <div>
          <Eyebrow>{work.category} · FROM OUR INSTAGRAM</Eyebrow>
          <h3>{work.title}</h3>
        </div>
        <ArrowUpRight size={23} />
      </div>
    </a>
  );
}
export function Journal({ page = false }) {
  const Heading = page ? "h1" : "h2";
  const [filter, setFilter] = useState("All");
  return (
    <section className={"journal " + (page ? "page-section" : "")}>
      <div className="wrap">
        <div className="section-heading reveal">
          <div>
            <Eyebrow>LIFE AT THE STUDIO</Eyebrow>
            <Heading>
              Made with little hands.
              <br />
              <em>And big imagination.</em>
            </Heading>
          </div>
          {!page && (
            <a className="text-link" href="/journal/">
              The studio journal <ArrowRight />
            </a>
          )}
        </div>
        {page && (
          <div className="filters" aria-label="Filter journal">
            {["All", "Art", "Learning"].map((f) => (
              <button
                key={f}
                aria-pressed={f === filter}
                onClick={() => setFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>
        )}
        <div className="work-grid">
          {works
            .filter((w) => filter === "All" || w.category === filter)
            .map((w) => (
              <WorkCard key={w.slug} work={w} />
            ))}
        </div>
      </div>
    </section>
  );
}
export function Approach() {
  return (
    <section className="approach">
      <div className="approach-flower">
        <FlowerMark size={88} />
      </div>
      <div className="wrap reveal">
        <Eyebrow>A LITTLE BIT OF THE NASCERE WAY</Eyebrow>
        <h2>
          Less perfect.
          <br />
          More possibilities.
        </h2>
        <div className="principles">
          {[
            [
              "Curiosity comes first",
              "There is room for questions, experiments and unexpected ideas.",
            ],
            [
              "Every voice belongs",
              "Through art, music and stories, children find ways to express themselves.",
            ],
            [
              "Joy is part of learning",
              "Play and creativity are at the heart of what we do.",
            ],
          ].map(([title, text], i) => (
            <div key={title}>
              <span>0{i + 1}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
export function ContactCTA() {
  return (
    <section className="contact-cta wrap reveal">
      <FlowerMark size={64} />
      <Eyebrow>THEIR NEXT LITTLE ADVENTURE</Eyebrow>
      <h2>
        Their next adventure
        <br />
        starts with <em>a little hello.</em>
      </h2>
      <p>
        Tell us a little about your child.
        <br />
        We’ll help you find a good place to begin.
      </p>
      <LinkButton>Say hello to Nascere</LinkButton>
    </section>
  );
}
export function Footer() {
  return (
    <footer>
      <div className="wrap footer-grid">
        <div>
          <Brand />
          <p>
            Growing young minds through
            <br />
            music, colors and stories.
          </p>
        </div>
        <div>
          <Eyebrow>EXPLORE</Eyebrow>
          <a href="/studio/">Our studio</a>
          <a href="/programs/">Programs</a>
          <a href="/toys/">Our toys</a>
          <a href="/journal/">Studio journal</a>
        </div>
        <div>
          <Eyebrow>COME SAY HELLO</Eyebrow>
          <p>
            Ramthanmawia Building, next to KFC
            <br />
            Zarkawt Main Road
            <br />
            Aizawl, Mizoram
          </p>
          <a href="tel:+916009208311">+91 60092 08311</a>
        </div>
        <div>
          <Eyebrow>STAY CURIOUS</Eyebrow>
          <a
            href="https://www.instagram.com/nascere_studio/"
            target="_blank"
            rel="noreferrer"
          >
            Instagram <InstagramLogo size={17} />
          </a>
          <a href={WA} target="_blank" rel="noreferrer">
            WhatsApp <ArrowUpRight size={17} />
          </a>
        </div>
      </div>
      <div className="wrap footer-bottom">
        <span>© {new Date().getFullYear()} Nascere Studio</span>
        <span>A little creativity goes a long way.</span>
      </div>
    </footer>
  );
}
