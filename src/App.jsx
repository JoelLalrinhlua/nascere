import { useEffect } from "react";
import { programs, works } from "./content";
import {
  Header,
  Hero,
  Introduction,
  Programs,
  Journal,
  Approach,
  ContactCTA,
  Footer,
  Eyebrow,
  LinkButton,
} from "./components";
import { ProgramDetail, WorkDetail, Contact, Toys } from "./pages";
export default function App({ initialPath } = {}) {
  const path =
    (initialPath || window.location.pathname).replace(/\/$/, "") || "/";
  const p = programs.find((p) => path === "/programs/" + p.slug);
  const w = works.find((w) => path === "/journal/" + w.slug);
  useEffect(() => {
    const title =
      p?.title ||
      w?.title ||
      {
        "/": "Little minds. Big possibilities.",
        "/studio": "Our studio",
        "/programs": "Programs",
        "/toys": "Our toys",
        "/journal": "Studio journal",
        "/contact": "Get in touch",
      }[path] ||
      "Page not found";
    document.title = title + " | Nascere Studio";
    document
      .querySelector('link[rel="canonical"]')
      ?.setAttribute(
        "href",
        "https://www.nascere.in" + (path === "/" ? "/" : path + "/"),
      );
    document
      .querySelector('meta[property="og:title"]')
      ?.setAttribute("content", document.title);
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            observer.unobserve(e.target);
          }
        }),
      { threshold: 0.08 },
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [path, p, w]);
  let content;
  if (path === "/")
    content = (
      <>
        <div className="home-garden">
          <Hero />
          <Introduction />
          <Programs />
        </div>
        <div className="home-stories">
          <Journal />
          <Approach />
        </div>
        <ContactCTA />
      </>
    );
  else if (path === "/studio")
    content = (
      <>
        <section className="studio-top wrap page-section">
          <Eyebrow>OUR STUDIO · AIZAWL, MIZORAM</Eyebrow>
          <h1>
            A childhood
            <br />
            full of <em>possibility.</em>
          </h1>
          <img
            src="/assets/creative-world.webp"
            alt="Sunflower and creative art materials in Nascere’s playful brand colors"
            width="1536"
            height="1024"
          />
        </section>
        <Introduction full />
        <Approach />
        <ContactCTA />
      </>
    );
  else if (path === "/programs")
    content = (
      <>
        <Programs page />
        <ContactCTA />
      </>
    );
  else if (path === "/journal") content = <Journal page />;
  else if (path === "/toys") content = <Toys />;
  else if (path === "/contact") content = <Contact />;
  else if (p) content = <ProgramDetail program={p} />;
  else if (w) content = <WorkDetail work={w} />;
  else
    content = (
      <section className="wrap page-section">
        <Eyebrow>404</Eyebrow>
        <h1>A little lost?</h1>
        <p>Let’s get you back to the studio.</p>
        <LinkButton to="/">Back home</LinkButton>
      </section>
    );
  return (
    <div className={path === "/" ? "site site-home" : "site"}>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Header path={path} />
      <main id="main">{content}</main>
      <Footer />
    </div>
  );
}
