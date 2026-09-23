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
import { WA, programs } from "./content";
import { ContentState, useContent } from "./cms/ContentProvider";
import { LinkButton, Eyebrow, WorkCard, ContactCTA, FlowerMark } from "./components";
export function ProgramDetail({ program: p }) {
  return (
    <>
      <section className="detail wrap page-section">
        <a className="text-link" href="/programs/">
          All programs
        </a>
        <div className="detail-grid">
          <div>
            <Eyebrow>LEARN & CRAFT · NASCERE STUDIO</Eyebrow>
            <h1>{p.title}</h1>
            <h3>{p.intro}</h3>
            <p>{p.description}</p>
            <LinkButton
              to={
                WA +
                "?text=" +
                encodeURIComponent(
                  "Hello Nascere! I would like to know more about " +
                    p.title +
                    ".",
                )
              }
            >
              Ask about this program
            </LinkButton>
          </div>
          <div className={"detail-panel " + p.color}>
            <p.icon size={100} weight="thin" />
            <h2>A little look inside</h2>
            <ul>
              {p.activities.map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ul>
            <p>{p.note}</p>
            <small>
              Class timings, fees and availability are confirmed by the studio.
            </small>
          </div>
        </div>
      </section>
      <ContactCTA />
    </>
  );
}
export function WorkDetail({ work: w }) {
  const { posts: works } = useContent();
  return (
    <section className="wrap page-section work-detail">
      <a className="text-link" href="/journal/">
        Back to the journal
      </a>
      <div className="detail-grid">
        <div>
          <Eyebrow>{w.category} · STUDIO JOURNAL</Eyebrow>
          <h1>{w.title}</h1>
          <p>{w.caption}</p>
          {w.post && <a
            className="text-link"
            href={"https://www.instagram.com/nascere_studio/p/" + w.post + "/"}
            target="_blank"
            rel="noreferrer"
          >
            See the original studio post <ArrowUpRight />
          </a>}
        </div>
        {(w.imageUrl || w.image) && <img
          src={w.imageUrl || "/assets/" + w.image + ".jpg"}
          alt={w.imageAlt || w.title + " — original Nascere Studio journal image"}
          width="512"
          height="640"
        />}
      </div>
      {w.body && <div className="post-body">{w.body.split(/\n\s*\n/).filter(Boolean).map((paragraph, index) => <p key={index}>{paragraph}</p>)}</div>}
      <h2>Keep exploring</h2>
      <div className="work-grid related">
        {works
          .filter((x) => x.slug !== w.slug)
          .map((x) => (
            <WorkCard key={x.slug} work={x} />
          ))}
      </div>
    </section>
  );
}
export function Contact() {
  const [name, setName] = useState("");
  const [program, setProgram] = useState("Arts & craft");
  return (
    <section className="contact-page wrap page-section">
      <Eyebrow>BIG ADVENTURES START WITH A HELLO</Eyebrow>
      <h1>
        Come grow
        <br />
        <em>with us.</em>
      </h1>
      <div className="contact-grid">
        <div>
          <p>
            Looking for a creative space for your child, or planning a visit for
            your school? We’d love to hear from you.
          </p>
          <h3>Find our little corner of Aizawl</h3>
          <p>
            Ramthanmawia Building, next to KFC
            <br />
            Zarkawt Main Road, Aizawl, Mizoram
          </p>
          <a
            className="text-link"
            href="https://www.google.com/maps/search/?api=1&query=Ramthanmawia+Building+Zarkawt+Aizawl"
            target="_blank"
            rel="noreferrer"
          >
            <MapPin />
            Open in Maps
          </a>
          <a className="contact-phone" href="tel:+916009208311">
            +91 60092 08311
          </a>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            window.open(
              WA +
                "?text=" +
                encodeURIComponent(
                  `Hello Nascere! My name is ${name.trim()}. I’m interested in ${program}. Could you share the timings, fees and availability?`,
                ),
              "_blank",
              "noopener,noreferrer",
            );
          }}
        >
          <h3>Let’s find a place to begin</h3>
          <label htmlFor="parent-name">Your name</label>
          <input
            id="parent-name"
            required
            maxLength={80}
            pattern={".*\\S.*"}
            title="Please enter your name"
            autoComplete="given-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="What should we call you?"
          />
          <label htmlFor="interest">I’m interested in</label>
          <select
            id="interest"
            value={program}
            onChange={(e) => setProgram(e.target.value)}
          >
            {programs.map((p) => (
              <option key={p.slug}>{p.title}</option>
            ))}
          </select>
          <button className="button" type="submit">
            Continue on WhatsApp <ArrowUpRight size={18} />
          </button>
          <small>
            This opens a draft in WhatsApp. You can review it before sending.
          </small>
        </form>
      </div>
    </section>
  );
}

export function Toys() {
  const { toys } = useContent();
  const [filter, setFilter] = useState("All");
  const categories = ["All", ...new Set(toys.map((toy) => toy.category))];
  const visible = toys.filter((toy) => filter === "All" || toy.category === filter);
  const enquire = (name) =>
    WA + "?text=" + encodeURIComponent(`Hello Nascere! I’m interested in the ${name}. Could you share its price, details and current availability?`);

  return (
    <section className="toys-page page-section">
      <div className="wrap toys-intro">
        <div>
          <Eyebrow>PLAY · DISCOVER · GROW</Eyebrow>
          <h1>Little toys.<br /><em>Big discoveries.</em></h1>
        </div>
        <div className="toys-intro-copy">
          <FlowerMark size={62} />
          <p>Thoughtful playthings for curious hands and growing minds. Explore a selection of educational toys, creative sets and wooden blocks from Nascere.</p>
          <small>Our selection changes often. Ask us on WhatsApp for the latest price and availability.</small>
        </div>
      </div>

      <div className="wrap">
        <div className="filters toy-filters" aria-label="Filter toys">
          {categories.map((category) => (
            <button key={category} aria-pressed={category === filter} onClick={() => setFilter(category)}>{category}</button>
          ))}
        </div>
        <div className="toy-grid" aria-live="polite">
          <ContentState empty={!toys.length}>New playthings are on their way. Ask the studio about the current selection.</ContentState>
          {visible.map((toy) => {
            const Icon = toy.icon || Shapes;
            return (
              <article className={`toy-card toy-${toy.color} reveal visible`} key={toy.id || toy.name}>
                <div className="toy-art">{toy.imageUrl ? <img src={toy.imageUrl} alt={toy.imageAlt || toy.name} loading="lazy"/> : <><Icon size={86} weight="thin" /><FlowerMark size={28} /></>}</div>
                <div className="toy-meta"><span>{toy.category}</span><span>{toy.age}</span></div>
                <h2>{toy.name}</h2>
                <p>{toy.description}</p>
                {toy.price !== '' && toy.price != null && <p className="toy-price">₹{Number(toy.price).toLocaleString('en-IN', { minimumFractionDigits: Number.isInteger(Number(toy.price)) ? 0 : 2, maximumFractionDigits: 2 })}</p>}
                {toy.develops.filter(Boolean).length > 0 && <><h3>What it helps grow</h3>
                <ul>{toy.develops.filter(Boolean).map((benefit,index) => <li key={index}>{benefit}</li>)}</ul></>}
                <a className="button toy-button" href={enquire(toy.name)} target="_blank" rel="noreferrer">Ask about this toy <ArrowUpRight size={17} /></a>
              </article>
            );
          })}
        </div>
      </div>

      <div className="toy-help">
        <div className="wrap">
          <FlowerMark size={58} />
          <div><Eyebrow>NOT SURE WHERE TO START?</Eyebrow><h2>Tell us what they love.<br /><em>We’ll help you choose.</em></h2></div>
          <LinkButton to={WA + "?text=" + encodeURIComponent("Hello Nascere! I’m looking for a toy for my child. Could you help me choose?")}>Get a toy recommendation</LinkButton>
        </div>
      </div>
    </section>
  );
}
