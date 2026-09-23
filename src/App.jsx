import { lazy, Suspense, useEffect, useState } from "react";
import { programs } from "./content";
import { ContentProvider, ContentState, useContent } from './cms/ContentProvider';
import Memories from './Memories';
const Admin = lazy(() => import('./admin/Admin'));
const AdminLoading = () => <main className="wrap page-section"><h1>Opening your studio desk…</h1></main>;
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
  return <ContentProvider><Site initialPath={initialPath}/></ContentProvider>;
}
function Site({ initialPath }) {
  const { posts: works, loading, error, previewMode } = useContent();
  const path =
    (initialPath || window.location.pathname).replace(/\/$/, "") || "/";
  const [querySlug, setQuerySlug] = useState('');
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); setQuerySlug(new URLSearchParams(window.location.search).get('slug') || ''); }, [path]);
  const p = programs.find((p) => path === "/programs/" + p.slug);
  const w = works.find((w) => path === '/journal/post' ? querySlug === w.slug : path === "/journal/" + w.slug);
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
        "/memories": "Memories",
        "/admin": "Studio desk",
        "/journal/post": "Studio story",
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
  if (path === '/admin') return mounted ? <Suspense fallback={<AdminLoading />}><Admin /></Suspense> : <AdminLoading />;
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
  else if (path === "/memories") content = <Memories />;
  else if (path === "/contact") content = <Contact />;
  else if (p) content = <ProgramDetail program={p} />;
  else if (w) content = <WorkDetail work={w} />;
  else if (path.startsWith('/journal/') && (loading || error || (path === '/journal/post' && !querySlug))) content = <section className="wrap page-section"><h1>Studio story</h1><ContentState empty={!loading && !error}>Choose a story from the <a href="/journal/">studio journal</a>.</ContentState></section>;
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
      {previewMode && <div className="cms-preview-note">Local content preview · <a href="/admin/">Open studio desk</a> · Changes here do not affect the live website.</div>}
      <main id="main">{content}</main>
      <Footer />
    </div>
  );
}
