import { useState, useEffect, useRef, useCallback } from "react";
import SplitText from "./SplitText";
import StaggeredMenu from "./StaggeredMenu";

/* ─── THEME COLORS ──────────────────────────────────────────────── */
const C = {
  white: "#FFFFFF", off: "#FAFAFA", black: "#181818",
  pink: "#E82060", yellow: "#F5B700", teal: "#2EADA0", purple: "#7C6FE0",
  border: "#E8E8E8", muted: "#999", light: "#F5F5F5",
};

const GALLERY_PASSCODE = "nascere2026";

/* ─── CONTENT DATA ──────────────────────────────────────────────── */
const STORIES = [
  {
    id: 1, tag: "Event", tc: C.pink, title: "Vawn Tlai — Arts & Music Nite", date: "Jun 2026", emoji: "🎭", bg: "#FFF0F5",
    excerpt: "Lo kal zawng zawng te! Our annual arts and music night — live performances, community art, and joy.",
    body: "Every year, Nascere Studio brings together students, parents, and teachers for our Arts & Music Night. This year's event features live keyboard performances by our music students, a display of artwork created throughout the year, and interactive art stations for families.\n\nDoors open at 5:30 PM. All are welcome. Come celebrate what your children have been learning and creating all year long."
  },
  {
    id: 2, tag: "Workshop", tc: C.teal, title: "Dinosaur Clay — A Rawr-some Class", date: "May 2026", emoji: "🦕", bg: "#E8FAF8",
    excerpt: "This week's craft class was all about dinosaurs. The children sculpted, painted, and gave each creature its own personality.",
    body: "Clay sessions are among the most loved parts of our arts program. Children from ages 5–10 worked with air-dry clay, building dinosaur figures and their own invented creatures.\n\nThe tactile experience of shaping clay builds fine motor skills, patience, and imaginative thinking. We finished by painting the dried sculptures with watercolors — every piece was one of a kind."
  },
  {
    id: 3, tag: "Music", tc: C.purple, title: "Why Music Belongs in Every Childhood", date: "Apr 2026", emoji: "🎵", bg: "#F0EDFF",
    excerpt: "Music is not just about learning notes — it builds memory, emotional expression, and discipline in ways that last a lifetime.",
    body: "At Nascere Studio, music is taught by Sir Rotluanga, who has worked with children in Aizawl for years. Our approach goes beyond scales and chords — we connect music to stories, emotions, and the world around us.\n\nResearch shows that children who learn music develop stronger language skills, better mathematical reasoning, and greater emotional intelligence. Our keyboard and rhythm classes for ages 3–12 are designed to be joyful first, technical second."
  },
  {
    id: 4, tag: "Update", tc: C.yellow, title: "First Day of Summer — New Classes Begin", date: "Jun 21, 2026", emoji: "🌞", bg: "#FFFBEA",
    excerpt: "Summer is here and so are new classes! Arts, music, and after-school programs are now open for enrollment.",
    body: "Summer at Nascere Studio is special. With school out, children have more time to explore and create without pressure. Our summer program includes extended arts sessions, music workshops, and free-form play-art Fridays.\n\nEnrollment is open for children 3–12 years. Limited spots available — message us on WhatsApp to register."
  },
  {
    id: 5, tag: "Art", tc: C.pink, title: "Drawing from Observation", date: "Mar 2026", emoji: "✏️", bg: "#FFF5F9",
    excerpt: "One of the most powerful things we teach is how to really look — and then translate what you see onto paper.",
    body: "Observational drawing is a foundational skill in visual art. We place simple objects — a cup, a leaf, a shoe — in front of children and ask them to draw what they actually see, not what they think it looks like.\n\nThis distinction matters enormously. The brain tries to shortcut — it wants to draw a symbol, not the actual object in front of you. Learning to truly see is the beginning of real drawing skill."
  },
  {
    id: 6, tag: "Community", tc: C.teal, title: "School Visits — Art in Every Classroom", date: "Feb 2026", emoji: "🏫", bg: "#E8FAF8",
    excerpt: "We visited three schools this term, bringing art and music sessions directly into classrooms across Aizawl.",
    body: "Our school visit program is one of the most meaningful things we do. We bring supplies, instruments, and activities directly to schools — making arts education accessible to every child in Aizawl.\n\nThis term we visited three schools, running 45-minute sessions on drawing, rhythm, and paper craft. The teachers were wonderful partners, and the children's enthusiasm was unforgettable."
  },
];

const GALLERY = [
  { id: "g1", emoji: "🦕", label: "Dinosaur Clay", cat: "Art", bg: "#E8FAF8" },
  { id: "g2", emoji: "🎹", label: "Piano Class", cat: "Music", bg: "#F0EDFF" },
  { id: "g3", emoji: "🌸", label: "Blossom Tree", cat: "Art", bg: "#FFE0ED" },
  { id: "g4", emoji: "🍍", label: "Pineapple Day", cat: "Art", bg: "#FFFBEA" },
  { id: "g5", emoji: "✂️", label: "Paper Craft", cat: "Craft", bg: "#E8F4FF" },
  { id: "g6", emoji: "🎭", label: "Arts Night", cat: "Events", bg: "#FFF0F5" },
  { id: "g7", emoji: "🐠", label: "Watercolor Fish", cat: "Art", bg: "#E0F8F4" },
  { id: "g8", emoji: "🌺", label: "Flower Pot", cat: "Craft", bg: "#FFE8D6" },
  { id: "g9", emoji: "🎨", label: "Art Workshop", cat: "Events", bg: "#F5EDFF" },
  { id: "g10", emoji: "⭐", label: "Astronomy Theme", cat: "Art", bg: "#E8EEFF" },
  { id: "g11", emoji: "🐝", label: "Bee Craft", cat: "Craft", bg: "#FFFBCC" },
  { id: "g12", emoji: "🥁", label: "Music Nite", cat: "Events", bg: "#FFF0F5" },
];

const PROGRAMS = [
  {
    icon: "🎨", name: "Arts & Craft", age: "Ages 3–12", color: C.pink,
    desc: "Painting, drawing, collage and sculpture in a joyful, exploratory environment. Every session is hands-on and process-focused — about making, not performing.",
    list: ["Watercolor & acrylic painting", "Clay & paper sculpture", "Observational drawing", "Mixed media collage", "Themed craft projects"]
  },
  {
    icon: "🎵", name: "Music Classes", age: "Ages 3–12", color: C.purple,
    desc: "Keyboard, rhythm and music theory taught by Sir Rotluanga. Music is approached through storytelling, play, and gradual skill-building — joyful first, technical second.",
    list: ["Keyboard basics to intermediate", "Rhythm & percussion", "Music theory for children", "Listening and ear training", "Group music sessions"]
  },
  {
    icon: "🏫", name: "School Visits", age: "All ages", color: C.teal,
    desc: "We come to your school with supplies and instruments. Interactive arts and music sessions designed for any class size — tailored to the curriculum.",
    list: ["45–60 minute sessions", "Art & craft activities", "Music introduction", "Curriculum-linked themes", "Teacher collaboration"]
  },
  {
    icon: "🎒", name: "After School Program", age: "Ages 5–12", color: "#F59E0B",
    desc: "A safe, creative space for children after school. Unwind through art, music, and free creative play in a warm, structured environment.",
    list: ["Mixed-age creative sessions", "Homework-friendly schedule", "Art & music rotation", "Social creative play", "Parent progress updates"]
  },
  {
    icon: "🧸", name: "Educational Toys & Wooden Blocks", age: "Ages 0–8", color: C.pink,
    desc: "Curated educational toys, Montessori wooden blocks, and craft kits designed to teach through play — available in our studio shop.",
    list: ["Montessori-style toys", "Wooden building blocks", "Art & craft kits", "Musical instruments for kids", "Age-appropriate picks"]
  },
  {
    icon: "🖼️", name: "Interactive Exhibitions", age: "All ages", color: C.teal,
    desc: "Periodic open studio events where families explore art together — immersive, community-focused, and always free to enter.",
    list: ["Student artwork displays", "Live art demonstrations", "Family-friendly activities", "Community participation", "Quarterly events"]
  },
];

/* ─── TOYS CATALOG DATA ─────────────────────────────────────────── */
const TOYS = [
  {
    id: "t1", emoji: "🧱", name: "Rainbow Stacking Blocks", cat: "Wooden", age: "1–4 yrs",
    color: C.pink, badge: "Bestseller",
    desc: "Hand-painted wooden blocks in 8 vibrant colors. Builds motor skills, color recognition, and spatial thinking."
  },
  {
    id: "t2", emoji: "🎹", name: "Mini Keyboard (25 keys)", cat: "Music", age: "3–8 yrs",
    color: C.purple, badge: "New",
    desc: "Battery-powered mini keyboard with built-in demo songs. Perfect for first-time music learners."
  },
  {
    id: "t3", emoji: "🎨", name: "Watercolor Starter Kit", cat: "Art Kit", age: "4–12 yrs",
    color: C.teal, badge: null,
    desc: "12-color professional-grade watercolor set with 2 brushes and 10 watercolor sheets included."
  },
  {
    id: "t4", emoji: "🧩", name: "Animal Shape Sorter", cat: "Wooden", age: "1–3 yrs",
    color: C.yellow, badge: null,
    desc: "Wooden shape sorter with 8 animal shapes. Teaches shape recognition, colors, and problem-solving."
  },
  {
    id: "t5", emoji: "🥁", name: "Kids Drum Set", cat: "Music", age: "3–8 yrs",
    color: C.purple, badge: "Popular",
    desc: "5-piece mini drum set with real drum skins. Develops rhythm, coordination, and musical confidence."
  },
  {
    id: "t6", emoji: "🏗️", name: "Architect Blocks (50 pc)", cat: "Wooden", age: "3–10 yrs",
    color: C.teal, badge: null,
    desc: "50 natural wood blocks in various geometric shapes. Builds spatial reasoning and creative design skills."
  },
  {
    id: "t7", emoji: "🖍️", name: "Giant Coloring Poster Set", cat: "Art Kit", age: "3–8 yrs",
    color: C.pink, badge: null,
    desc: "5 large-format A2 coloring posters with washable markers. Jungle, ocean, space, farm & city themes."
  },
  {
    id: "t8", emoji: "🎸", name: "Ukulele for Kids", cat: "Music", age: "5–12 yrs",
    color: C.yellow, badge: "New",
    desc: "Real 21-inch wooden ukulele — tuned and ready to play. Comes with a beginner chord chart."
  },
  {
    id: "t9", emoji: "🪆", name: "Montessori Nesting Dolls", cat: "Wooden", age: "2–5 yrs",
    color: C.pink, badge: null,
    desc: "Traditional hand-painted nesting set with 8 dolls. Size-ordering made magical — each hides a surprise."
  },
  {
    id: "t10", emoji: "🧪", name: "Science Explorer Kit", cat: "STEM", age: "6–12 yrs",
    color: C.teal, badge: "Popular",
    desc: "20 safe experiments, all materials included. Volcanoes, crystals, color mixing, and much more."
  },
  {
    id: "t11", emoji: "🔢", name: "Magnetic Number Board", cat: "STEM", age: "3–7 yrs",
    color: C.yellow, badge: null,
    desc: "Magnetic board with numbers, symbols, and shapes. Makes early maths tactile and genuinely fun."
  },
  {
    id: "t12", emoji: "🖌️", name: "Clay Sculpting Set", cat: "Art Kit", age: "4–12 yrs",
    color: C.teal, badge: null,
    desc: "Air-dry clay in 10 colors with sculpting tools and a how-to booklet. No baking required."
  },
];

/* ─── IMAGE HELPER ──────────────────────────────────────────────── */
function resizeImage(file, maxWidth = 900, quality = 0.72) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let w = img.width, h = img.height;
        if (w > maxWidth) { h = Math.round((h * maxWidth) / w); w = maxWidth; }
        const canvas = document.createElement("canvas");
        canvas.width = w; canvas.height = h;
        canvas.getContext("2d").drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.onerror = () => reject(new Error("Could not load image"));
      img.src = e.target.result;
    };
    reader.onerror = () => reject(new Error("Could not read file"));
    reader.readAsDataURL(file);
  });
}

/* ─── USE SCROLL REVEAL ─────────────────────────────────────────── */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal, .reveal-left, .reveal-scale");
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("visible"); io.unobserve(e.target); } }),
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  });
}

/* ─── DAISY SVG ─────────────────────────────────────────────────── */
function Daisy({ size = 80, stroke = C.black, fill = C.white, className = "" }) {
  const cx = 100, cy = 100, innerR = 28, pLen = 22, pW = 8, dist = 50, n = 12;
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" className={className}>
      {Array.from({ length: n }).map((_, i) => {
        const deg = i * (360 / n), rad = deg * Math.PI / 180;
        const px = cx + dist * Math.sin(rad), py = cy - dist * Math.cos(rad);
        return <ellipse key={i} cx={px} cy={py} rx={pW} ry={pLen}
          fill={fill} stroke={stroke} strokeWidth={2.5}
          transform={`rotate(${deg},${px},${py})`} />;
      })}
      <circle cx={cx} cy={cy} r={innerR} fill={C.yellow} stroke={stroke} strokeWidth={2.5} />
    </svg>
  );
}

/* ─── LOGO ──────────────────────────────────────────────────────── */
function Logo({ size = "md" }) {
  const map = { sm: [18, 8], md: [28, 11], lg: [52, 15], xl: [76, 19] };
  const [nSz, lSz] = map[size] || map.md;
  return (
    <div style={{ lineHeight: 1, fontFamily: "'DM Sans',sans-serif" }}>
      <div style={{ fontWeight: 300, fontSize: nSz, letterSpacing: "-0.01em", color: C.black }}>
        n<span style={{ color: C.pink, fontWeight: 600 }}>a</span>scere
      </div>
      <div style={{ fontWeight: 700, fontSize: lSz, letterSpacing: "0.16em", color: C.yellow, textTransform: "uppercase" }}>
        Learn & Craft
      </div>
      <div style={{ fontWeight: 400, fontSize: lSz * 0.85, letterSpacing: "0.22em", color: C.black, textTransform: "uppercase" }}>
        Studio
      </div>
    </div>
  );
}

/* ─── TAG ───────────────────────────────────────────────────────── */
function Tag({ label, color }) {
  return (
    <span style={{
      background: color + "18", color, border: `1px solid ${color}44`,
      borderRadius: 4, padding: "2px 10px", fontSize: 11, fontWeight: 700,
      letterSpacing: "0.07em", textTransform: "uppercase", fontFamily: "'DM Sans',sans-serif"
    }}>
      {label}
    </span>
  );
}

/* ─── WHATSAPP BUTTON ───────────────────────────────────────────── */
function WA({ text = "WhatsApp Us", style = {}, pulse = false }) {
  return (
    <a href="https://wa.me/916009208311" target="_blank" rel="noreferrer"
      className={`wa-btn${pulse ? " pulse" : ""}`}
      style={style}>
      💬 {text}
    </a>
  );
}

/* ─── GALLERY CARD ──────────────────────────────────────────────── */
function GalleryCard({ item, tall }) {
  if (item.dataUrl) {
    return (
      <div style={{ position: "relative", borderRadius: 10, overflow: "hidden", background: C.light }}>
        <img src={item.dataUrl} alt={item.label}
          style={{ width: "100%", height: tall ? 220 : 150, objectFit: "cover", display: "block" }} />
        <div style={{
          position: "absolute", left: 0, right: 0, bottom: 0,
          background: "linear-gradient(transparent, rgba(0,0,0,0.6))",
          padding: "24px 10px 8px"
        }}>
          <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, fontWeight: 700, color: C.white }}>
            {item.label}
          </div>
        </div>
      </div>
    );
  }
  return (
    <div style={{ background: item.bg, borderRadius: 10, padding: "28px 12px", textAlign: "center" }}>
      <div style={{ fontSize: 36, marginBottom: 6 }}>{item.emoji}</div>
      <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, fontWeight: 600, color: C.black }}>{item.label}</div>
    </div>
  );
}

/* ─── LOADING SPLASH ────────────────────────────────────────────── */
function Splash({ visible }) {
  return (
    <div className={`splash-overlay${visible ? "" : " hidden"}`}>
      <Daisy size={72} className="splash-daisy" />
      <div className="splash-logo">n<span>a</span>scere</div>
      <div className="splash-tagline">Learn · Craft · Studio</div>
    </div>
  );
}

/* ─── SCROLL PROGRESS ───────────────────────────────────────────── */
function ScrollProgress() {
  useEffect(() => {
    const bar = document.getElementById("scroll-progress");
    if (!bar) return;
    const update = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = total > 0 ? `${(window.scrollY / total) * 100}%` : "0%";
    };
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  return <div id="scroll-progress" />;
}

/* ─── FLOATING DAISIES (hero background) ───────────────────────── */
function FloatingDaisies() {
  const daisies = [
    { size: 80, opacity: 0.06, top: "12%", left: "8%", cls: "float-1", stroke: C.pink },
    { size: 50, opacity: 0.05, top: "65%", left: "14%", cls: "float-3", stroke: C.teal },
    { size: 110, opacity: 0.04, top: "30%", right: "5%", cls: "float-2", stroke: C.purple },
    { size: 60, opacity: 0.06, top: "75%", right: "18%", cls: "float-4", stroke: C.yellow },
    { size: 40, opacity: 0.05, top: "50%", left: "50%", cls: "float-5", stroke: C.pink },
  ];
  return (
    <>
      {daisies.map((d, i) => (
        <div key={i} className={`floating-daisy ${d.cls}`}
          style={{ top: d.top, left: d.left, right: d.right, opacity: d.opacity }}>
          <Daisy size={d.size} stroke={d.stroke} fill="transparent" />
        </div>
      ))}
    </>
  );
}

/* ─── NAV ───────────────────────────────────────────────────────── */
function Nav({ page, go }) {
  const [scrolled, setScrolled] = useState(false);

  const menuItems = [
    { label: "Home",     ariaLabel: "Go to home page",   link: "home"     },
    { label: "Stories",  ariaLabel: "Read our stories",   link: "stories"  },
    { label: "Gallery",  ariaLabel: "Browse the gallery", link: "gallery"  },
    { label: "Programs", ariaLabel: "View our programs",  link: "programs" },
    { label: "Toys",     ariaLabel: "Shop our toys",      link: "toys"     },
    { label: "About",    ariaLabel: "Learn about us",     link: "about"    },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`nav-bar${scrolled ? " scrolled" : ""}`}>
      <div style={{
        maxWidth: 1080, margin: "0 auto", display: "flex",
        alignItems: "center", justifyContent: "space-between", height: 64
      }}>
        <button onClick={() => go("home")}
          style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
          <Logo size="sm" />
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <WA text="WhatsApp" style={{ padding: "8px 16px", fontSize: 11 }} />
          <StaggeredMenu
            position="right"
            items={menuItems}
            displayItemNumbering={true}
            menuButtonColor={C.black}
            colors={["#181818", "#1a0810"]}
            accentColor={C.pink}
            activePage={page}
            onNavigate={(link) => go(link)}
          />
        </div>
      </div>
    </nav>
  );
}

/* ─── HOME ──────────────────────────────────────────────────────── */
function Home({ go, openStory, realPhotos }) {
  useReveal();
  const teaser = [...realPhotos, ...GALLERY].slice(0, 6);

  return (
    <div>
      {/* HERO */}
      <section style={{
        minHeight: "100vh", display: "flex", alignItems: "center",
        padding: "80px 5% 60px", background: C.white,
        position: "relative", overflow: "hidden"
      }}>
        <div className="hero-shimmer" />
        <FloatingDaisies />

        <div style={{
          maxWidth: 1080, margin: "0 auto", display: "flex", alignItems: "center",
          justifyContent: "space-between", gap: 60, flexWrap: "wrap",
          position: "relative", zIndex: 1, width: "100%"
        }}>
          <div style={{ flex: "1 1 400px" }} className="reveal">
            <Logo size="xl" />
            <div style={{ marginTop: 24, display: "flex", gap: 20 }}>
              {["Music", "Colors", "Stories"].map((p, i) => (
                <span key={p} style={{
                  fontFamily: "'DM Sans',sans-serif", fontSize: 11,
                  fontWeight: 700, letterSpacing: "0.16em", color: C.pink,
                  textTransform: "uppercase",
                  animation: `splash-fade-up 0.6s ease ${0.2 + i * 0.1}s both`
                }}>{p}</span>
              ))}
            </div>
            <p style={{
              marginTop: 24, fontSize: 16, color: C.muted, lineHeight: 1.85,
              maxWidth: 440, fontFamily: "'DM Sans',sans-serif"
            }}>
              A child development studio for children aged 3–12. Growing young minds through
              arts, craft, and music — in Aizawl, Mizoram.
            </p>
            <div style={{ marginTop: 36, display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
              <WA text="Enroll via WhatsApp" pulse />
              <button onClick={() => go("programs")}
                style={{
                  background: "none", border: `1.5px solid ${C.border}`, cursor: "pointer",
                  borderRadius: 6, padding: "12px 24px", fontFamily: "'DM Sans',sans-serif",
                  fontWeight: 600, fontSize: 13, letterSpacing: "0.05em",
                  textTransform: "uppercase", color: C.black,
                  transition: "border-color 0.2s, background 0.2s"
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = C.black; e.currentTarget.style.background = C.off; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.background = "none"; }}>
                Our Programs →
              </button>
            </div>
            <div style={{
              marginTop: 48, paddingTop: 32, borderTop: `1px solid ${C.border}`,
              display: "flex", gap: 40, flexWrap: "wrap"
            }} className="stagger-children">
              {[["3–12", "Age Group"], ["Arts & Music", "What We Teach"], ["Aizawl", "Where We Are"]].map(([n, l]) => (
                <div key={l} className="reveal">
                  <div className="stat-value">{n}</div>
                  <div style={{
                    fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: C.muted,
                    letterSpacing: "0.06em", textTransform: "uppercase", marginTop: 4
                  }}>{l}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ flex: "1 1 260px", display: "flex", justifyContent: "center" }} className="reveal">
            <div style={{ animation: "float2 8s ease-in-out infinite" }}>
              <Daisy size={280} />
            </div>
          </div>
        </div>
      </section>

      {/* THREE PILLARS */}
      <section style={{ padding: "96px 5%", background: C.black }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }} className="reveal">
            <div className="section-label" style={{ color: C.pink, justifyContent: "center" }}>
              What We Believe
            </div>
            <div style={{
              fontFamily: "'DM Sans',sans-serif", fontSize: "clamp(26px,4vw,40px)",
              fontWeight: 300, color: C.white, lineHeight: 1.2
            }}>
              Three pillars. One studio.
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 2 }}
            className="stagger-children">
            {[
              { title: "Music", emoji: "🎵", color: C.purple, desc: "Music teaches rhythm, memory, discipline, and emotional expression. Every child is a musician waiting to be heard." },
              { title: "Colors", emoji: "🎨", color: C.pink, desc: "Color and visual art unlock observation, imagination, and fine motor skills. We make art every single day." },
              { title: "Stories", emoji: "📖", color: C.yellow, desc: "We document what we do, share what we learn, and build a community around creativity. This website is our story." },
            ].map(p => (
              <div key={p.title} className="pillar-card reveal"
                style={{ "--pillar-color": p.color }}
                onMouseEnter={e => e.currentTarget.querySelector(".pillar-line").style.opacity = "1"}
                onMouseLeave={e => e.currentTarget.querySelector(".pillar-line").style.opacity = "0"}>
                <div className="pillar-line" style={{
                  position: "absolute", bottom: 0, left: 0, right: 0, height: 3,
                  background: `linear-gradient(90deg, ${p.color}, transparent)`,
                  opacity: 0, transition: "opacity 0.3s"
                }} />
                <div style={{ fontSize: 40, marginBottom: 20 }}>{p.emoji}</div>
                <div style={{
                  fontFamily: "'DM Sans',sans-serif", fontSize: 22, fontWeight: 700,
                  color: C.white, letterSpacing: "-0.01em", marginBottom: 14
                }}>{p.title}</div>
                <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: "#777", lineHeight: 1.8 }}>{p.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LATEST STORIES */}
      <section style={{ padding: "96px 5%", background: C.white }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "baseline",
            marginBottom: 48, flexWrap: "wrap", gap: 12
          }} className="reveal">
            <div>
              <div className="section-label" style={{ color: C.pink }}>From the Studio</div>
              <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "clamp(22px,3vw,36px)", fontWeight: 300, color: C.black }}>
                Latest Stories
              </div>
            </div>
            <button onClick={() => go("stories")}
              style={{
                background: "none", border: "none", cursor: "pointer",
                fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 700,
                color: C.pink, textDecoration: "underline"
              }}>
              All Stories →
            </button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(290px,1fr))", gap: 24 }}
            className="stagger-children">
            {STORIES.slice(0, 3).map(s => (
              <div key={s.id} onClick={() => openStory(s)} className="story-card reveal">
                <div style={{
                  background: s.bg, height: 180, display: "flex",
                  alignItems: "center", justifyContent: "center", fontSize: 64
                }}>{s.emoji}</div>
                <div style={{ padding: "20px 22px 24px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                    <Tag label={s.tag} color={s.tc} />
                    <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: C.muted }}>{s.date}</span>
                  </div>
                  <div style={{
                    fontFamily: "'DM Sans',sans-serif", fontSize: 17, fontWeight: 700,
                    color: C.black, lineHeight: 1.3, marginBottom: 10
                  }}>{s.title}</div>
                  <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: C.muted, lineHeight: 1.7 }}>{s.excerpt}</div>
                  <div style={{
                    marginTop: 16, fontFamily: "'DM Sans',sans-serif", fontSize: 12,
                    fontWeight: 700, color: C.pink
                  }}>Read more →</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GALLERY TEASER */}
      <section style={{ padding: "96px 5%", background: C.off }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "baseline",
            marginBottom: 40, flexWrap: "wrap", gap: 12
          }} className="reveal">
            <div>
              <div className="section-label" style={{ color: C.teal }}>Kid's Creations</div>
              <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "clamp(22px,3vw,36px)", fontWeight: 300, color: C.black }}>
                From the Gallery
              </div>
            </div>
            <button onClick={() => go("gallery")}
              style={{
                background: "none", border: "none", cursor: "pointer",
                fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 700,
                color: C.teal, textDecoration: "underline"
              }}>
              Full Gallery →
            </button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(150px,1fr))", gap: 12 }}
            className="stagger-children">
            {teaser.map(g => (
              <div key={g.id} className="gallery-item reveal">
                <GalleryCard item={g} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "100px 5%", background: C.white, textAlign: "center" }}>
        <div style={{ maxWidth: 560, margin: "0 auto" }} className="reveal">
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 28 }}>
            <div style={{ animation: "float3 6s ease-in-out infinite" }}>
              <Daisy size={72} />
            </div>
          </div>
          <div style={{
            fontFamily: "'DM Sans',sans-serif", fontSize: "clamp(26px,4vw,42px)",
            fontWeight: 300, color: C.black, lineHeight: 1.2, marginBottom: 16
          }}>
            Ready to enroll your child?
          </div>
          <p style={{
            fontFamily: "'DM Sans',sans-serif", fontSize: 16, color: C.muted,
            lineHeight: 1.8, marginBottom: 36
          }}>
            Reach out on WhatsApp and we'll find the right program for your little one.
            Arts & Music Classes for ages 3–12, in Aizawl, Mizoram.
          </p>
          <WA text="Start on WhatsApp" style={{ fontSize: 14, padding: "14px 36px" }} pulse />
          <div style={{ marginTop: 24, fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: C.muted }}>
            📍 Ramthanmawia Building, next to KFC, Zarkawt Main Road, Aizawl
          </div>
        </div>
      </section>
    </div>
  );
}

/* ─── STORIES PAGE ──────────────────────────────────────────────── */
function StoriesPage({ story, setStory }) {
  useReveal();
  const [filter, setFilter] = useState("All");
  const tags = ["All", "Event", "Workshop", "Music", "Art", "Update", "Community"];
  const filtered = filter === "All" ? STORIES : STORIES.filter(s => s.tag === filter);

  if (story) {
    return (
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "60px 5% 100px" }} className="page-enter">
        <button onClick={() => setStory(null)}
          style={{
            background: "none", border: "none", cursor: "pointer",
            fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: C.pink,
            fontWeight: 700, marginBottom: 36, letterSpacing: "0.04em", padding: 0,
            display: "flex", alignItems: "center", gap: 6
          }}>
          ← All Stories
        </button>
        <div style={{
          background: story.bg, height: 240, borderRadius: 16, display: "flex",
          alignItems: "center", justifyContent: "center", fontSize: 88, marginBottom: 32
        }}>{story.emoji}</div>
        <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 18 }}>
          <Tag label={story.tag} color={story.tc} />
          <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: C.muted }}>{story.date}</span>
        </div>
        <h1 style={{
          fontFamily: "'DM Sans',sans-serif", fontSize: "clamp(22px,4vw,36px)",
          fontWeight: 800, color: C.black, lineHeight: 1.2, margin: "0 0 28px"
        }}>{story.title}</h1>
        <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 28 }}>
          {story.body.split("\n\n").map((para, i) => (
            <p key={i} style={{
              fontFamily: "'DM Sans',sans-serif", fontSize: 16, color: "#444",
              lineHeight: 1.9, margin: "0 0 22px"
            }}>{para}</p>
          ))}
        </div>
        <div style={{ marginTop: 48, padding: 28, background: C.off, borderRadius: 12, textAlign: "center" }}>
          <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 15, fontWeight: 600, color: C.black, marginBottom: 16 }}>
            Have questions? We'd love to hear from you.
          </div>
          <WA text="WhatsApp Us" />
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1080, margin: "0 auto", padding: "60px 5% 100px" }} className="page-enter">
      <div style={{ marginBottom: 52 }} className="reveal">
        <div className="section-label" style={{ color: C.pink }}>From the Studio</div>
        <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "clamp(28px,4vw,48px)", fontWeight: 300, color: C.black }}>
          Stories
        </div>
        <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 15, color: C.muted, marginTop: 14, maxWidth: 480, lineHeight: 1.7 }}>
          Event recaps, ideas, updates, and reflections from Nascere Studio. This is our main channel — updated regularly.
        </p>
      </div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 40 }} className="reveal">
        {tags.map(t => (
          <button key={t} onClick={() => setFilter(t)}
            style={{
              background: filter === t ? C.black : "none",
              color: filter === t ? C.white : C.muted,
              border: `1px solid ${filter === t ? C.black : C.border}`, borderRadius: 6,
              padding: "7px 18px", fontFamily: "'DM Sans',sans-serif", fontSize: 12,
              fontWeight: 600, cursor: "pointer", letterSpacing: "0.04em",
              textTransform: "uppercase", transition: "all 0.2s ease"
            }}>
            {t}
          </button>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(290px,1fr))", gap: 28 }}
        className="stagger-children">
        {filtered.map(s => (
          <div key={s.id} onClick={() => setStory(s)} className="story-card reveal">
            <div style={{
              background: s.bg, height: 190, display: "flex",
              alignItems: "center", justifyContent: "center", fontSize: 68
            }}>{s.emoji}</div>
            <div style={{ padding: "20px 22px 24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <Tag label={s.tag} color={s.tc} />
                <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: C.muted }}>{s.date}</span>
              </div>
              <div style={{
                fontFamily: "'DM Sans',sans-serif", fontSize: 17, fontWeight: 700,
                color: C.black, lineHeight: 1.3, marginBottom: 10
              }}>{s.title}</div>
              <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: C.muted, lineHeight: 1.7 }}>{s.excerpt}</div>
              <div style={{
                marginTop: 16, fontFamily: "'DM Sans',sans-serif", fontSize: 12,
                fontWeight: 700, color: C.pink
              }}>Read more →</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── GALLERY PAGE ──────────────────────────────────────────────── */
function GalleryPage({ realPhotos, loading, error, onSave, onReload }) {
  useReveal();
  const [cat, setCat] = useState("All");
  const cats = ["All", "Art", "Music", "Craft", "Events"];
  const combined = [...realPhotos, ...GALLERY];
  const filtered = cat === "All" ? combined : combined.filter(g => g.cat === cat);

  const [showUnlock, setShowUnlock] = useState(false);
  const [passInput, setPassInput] = useState("");
  const [passError, setPassError] = useState("");
  const [managing, setManaging] = useState(false);
  const [addLabel, setAddLabel] = useState("");
  const [addCat, setAddCat] = useState("Art");
  const [pendingUrl, setPendingUrl] = useState(null);
  const [reading, setReading] = useState(false);
  const [addBusy, setAddBusy] = useState(false);
  const [addError, setAddError] = useState("");
  const [busyId, setBusyId] = useState(null);

  const tryUnlock = () => {
    if (passInput === GALLERY_PASSCODE) {
      setManaging(true); setShowUnlock(false); setPassInput(""); setPassError("");
    } else {
      setPassError("That passcode isn't right.");
    }
  };

  const handleFile = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    setAddError(""); setReading(true);
    try {
      setPendingUrl(await resizeImage(file));
    } catch {
      setAddError("Couldn't read that image — try a different file.");
    } finally {
      setReading(false);
    }
  };

  const addPhoto = async () => {
    if (!pendingUrl || !addLabel.trim()) return;
    setAddBusy(true); setAddError("");
    const newPhoto = { id: "p" + Date.now(), label: addLabel.trim(), cat: addCat, dataUrl: pendingUrl };
    try {
      await onSave([newPhoto, ...realPhotos]);
      setAddLabel(""); setPendingUrl(null);
    } catch {
      setAddError("Couldn't save this photo — it may be too large, or the connection dropped.");
    } finally {
      setAddBusy(false);
    }
  };

  const deletePhoto = async (id) => {
    setBusyId(id); setAddError("");
    try {
      await onSave(realPhotos.filter(p => p.id !== id));
    } catch {
      setAddError("Couldn't delete that photo. Try again.");
    } finally {
      setBusyId(null);
    }
  };

  const inputStyle = {
    width: "100%", border: `1px solid ${C.border}`, borderRadius: 6, padding: "9px 14px",
    fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: C.black, background: C.white,
  };

  return (
    <div style={{ maxWidth: 1080, margin: "0 auto", padding: "60px 5% 100px" }} className="page-enter">
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "flex-start",
        flexWrap: "wrap", gap: 20, marginBottom: 40
      }}>
        <div className="reveal">
          <div className="section-label" style={{ color: C.teal }}>Kid's Creations</div>
          <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "clamp(28px,4vw,48px)", fontWeight: 300, color: C.black }}>
            Gallery
          </div>
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 15, color: C.muted, marginTop: 14, maxWidth: 480, lineHeight: 1.7 }}>
            Artwork, craft projects, music moments, and events from our studio.
          </p>
        </div>
        <div className="reveal">
          {!managing ? (
            <button onClick={() => { setShowUnlock(!showUnlock); setPassError(""); }}
              style={{
                background: "none", border: `1.5px solid ${C.border}`, cursor: "pointer",
                borderRadius: 6, padding: "10px 20px", fontFamily: "'DM Sans',sans-serif",
                fontWeight: 600, fontSize: 12, letterSpacing: "0.05em", textTransform: "uppercase", color: C.black,
                transition: "border-color 0.2s, background 0.2s"
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = C.black; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; }}>
              🔒 Manage Photos
            </button>
          ) : (
            <button onClick={() => { setManaging(false); setPendingUrl(null); setAddError(""); }}
              style={{
                background: C.black, border: "none", cursor: "pointer",
                borderRadius: 6, padding: "10px 20px", fontFamily: "'DM Sans',sans-serif",
                fontWeight: 600, fontSize: 12, letterSpacing: "0.05em", textTransform: "uppercase", color: C.white
              }}>
              ✓ Done Editing
            </button>
          )}
          {showUnlock && !managing && (
            <div style={{
              marginTop: 10, background: C.off, border: `1px solid ${C.border}`,
              borderRadius: 10, padding: 16, width: 230
            }}>
              <input type="password" value={passInput} onChange={e => setPassInput(e.target.value)}
                placeholder="Passcode" style={inputStyle}
                onKeyDown={e => e.key === "Enter" && tryUnlock()} />
              {passError && <div style={{ color: C.pink, fontSize: 11, marginTop: 6 }}>{passError}</div>}
              <button onClick={tryUnlock}
                style={{
                  marginTop: 10, width: "100%", background: C.black, color: C.white,
                  border: "none", borderRadius: 6, padding: "9px 0", fontFamily: "'DM Sans',sans-serif",
                  fontWeight: 700, fontSize: 12, cursor: "pointer"
                }}>
                Unlock
              </button>
            </div>
          )}
        </div>
      </div>

      {managing && (
        <div style={{
          marginBottom: 36, padding: 24, background: C.off,
          border: `1px solid ${C.border}`, borderRadius: 12
        }}>
          <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 700, color: C.black, marginBottom: 16 }}>
            Add a Photo
          </div>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "flex-end" }}>
            <div style={{ flex: "1 1 180px" }}>
              <label style={{ display: "block", fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: C.muted, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Image File
              </label>
              <input type="file" accept="image/*" onChange={handleFile} style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12 }} />
              {reading && <div style={{ fontSize: 11, color: C.muted, marginTop: 4 }}>Reading image…</div>}
            </div>
            <div style={{ flex: "1 1 180px" }}>
              <label style={{ display: "block", fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: C.muted, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Caption
              </label>
              <input type="text" value={addLabel} onChange={e => setAddLabel(e.target.value)}
                placeholder="e.g. Watercolor Fish" style={inputStyle} />
            </div>
            <div style={{ flex: "0 1 150px" }}>
              <label style={{ display: "block", fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: C.muted, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Category
              </label>
              <select value={addCat} onChange={e => setAddCat(e.target.value)} style={inputStyle}>
                {["Art", "Music", "Craft", "Events"].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <button onClick={addPhoto} disabled={!pendingUrl || !addLabel.trim() || addBusy}
              style={{
                background: (!pendingUrl || !addLabel.trim() || addBusy) ? C.muted : C.teal,
                color: C.white, border: "none", borderRadius: 6, padding: "10px 20px",
                fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: 12,
                letterSpacing: "0.05em", textTransform: "uppercase",
                cursor: (!pendingUrl || !addLabel.trim() || addBusy) ? "default" : "pointer"
              }}>
              {addBusy ? "Saving…" : "Add to Gallery"}
            </button>
          </div>
          {pendingUrl && (
            <div style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 10 }}>
              <img src={pendingUrl} alt="preview" style={{ width: 64, height: 64, objectFit: "cover", borderRadius: 8 }} />
              <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: C.muted }}>Ready to add ✓</span>
            </div>
          )}
          {addError && <div style={{ color: C.pink, fontSize: 12, marginTop: 10, fontFamily: "'DM Sans',sans-serif" }}>{addError}</div>}

          {realPhotos.length > 0 && (
            <div style={{ marginTop: 28, paddingTop: 20, borderTop: `1px solid ${C.border}` }}>
              <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontWeight: 700, color: C.black, marginBottom: 14 }}>
                Your uploaded photos ({realPhotos.length})
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(90px,1fr))", gap: 10 }}>
                {realPhotos.map(p => (
                  <div key={p.id} style={{ position: "relative" }}>
                    <img src={p.dataUrl} alt={p.label} style={{ width: "100%", height: 80, objectFit: "cover", borderRadius: 8 }} />
                    <button onClick={() => deletePhoto(p.id)} disabled={busyId === p.id}
                      title="Delete photo"
                      style={{
                        position: "absolute", top: 4, right: 4, background: "rgba(0,0,0,0.65)", color: C.white,
                        border: "none", borderRadius: "50%", width: 24, height: 24, cursor: "pointer", fontSize: 14,
                        lineHeight: "24px", padding: 0
                      }}>
                      {busyId === p.id ? "…" : "×"}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div style={{ marginTop: 16, fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: C.muted }}>
            Photos you add here are visible to everyone who visits this page.
          </div>
        </div>
      )}

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 40 }} className="reveal">
        {cats.map(c => (
          <button key={c} onClick={() => setCat(c)}
            style={{
              background: cat === c ? C.black : "none", color: cat === c ? C.white : C.muted,
              border: `1px solid ${cat === c ? C.black : C.border}`, borderRadius: 6,
              padding: "7px 18px", fontFamily: "'DM Sans',sans-serif", fontSize: 12,
              fontWeight: 600, cursor: "pointer", letterSpacing: "0.04em",
              textTransform: "uppercase", transition: "all 0.2s ease"
            }}>
            {c}
          </button>
        ))}
      </div>

      {loading && <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: C.muted, padding: "20px 0" }}>Loading gallery…</div>}
      {error && (
        <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: C.pink, padding: "12px 0", display: "flex", alignItems: "center", gap: 12 }}>
          Couldn't load your uploaded photos.
          <button onClick={onReload} style={{
            background: "none", border: `1px solid ${C.pink}`, color: C.pink,
            borderRadius: 4, padding: "4px 12px", cursor: "pointer", fontFamily: "'DM Sans',sans-serif", fontSize: 12
          }}>Retry</button>
        </div>
      )}

      {!loading && (
        <div style={{ columns: "3 180px", gap: 14 }}>
          {filtered.map(g => (
            <div key={g.id} className="gallery-item reveal" style={{ marginBottom: 14, breakInside: "avoid" }}>
              <GalleryCard item={g} tall />
            </div>
          ))}
        </div>
      )}
      {!loading && filtered.length === 0 && (
        <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: C.muted, padding: "20px 0" }}>
          No photos in this category yet.
        </div>
      )}
    </div>
  );
}

/* ─── PROGRAMS PAGE ─────────────────────────────────────────────── */
function ProgramsPage() {
  useReveal();
  const [open, setOpen] = useState(null);

  return (
    <div style={{ maxWidth: 1080, margin: "0 auto", padding: "60px 5% 100px" }} className="page-enter">
      <div style={{ marginBottom: 56 }} className="reveal">
        <div className="section-label" style={{ color: C.pink }}>What We Offer</div>
        <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "clamp(28px,4vw,48px)", fontWeight: 300, color: C.black }}>
          Programs
        </div>
        <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 15, color: C.muted, marginTop: 14, maxWidth: 480, lineHeight: 1.7 }}>
          Every program is designed to nurture creativity, build skills, and make learning joyful for children aged 3–12.
        </p>
      </div>
      <div style={{ border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden" }} className="reveal">
        {PROGRAMS.map((p, i) => (
          <div key={p.name} style={{ borderBottom: i < PROGRAMS.length - 1 ? `1px solid ${C.border}` : "none" }}>
            <button onClick={() => setOpen(open === i ? null : i)}
              style={{
                width: "100%", background: open === i ? C.off : C.white, border: "none",
                cursor: "pointer", padding: "24px 32px", display: "flex",
                alignItems: "center", gap: 18, textAlign: "left",
                transition: "background 0.2s ease"
              }}>
              <span style={{ fontSize: 28 }}>{p.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 17, fontWeight: 700, color: C.black }}>
                  {p.name}
                </div>
                <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: C.muted, marginTop: 3 }}>{p.age}</div>
              </div>
              <span style={{
                color: p.color, fontSize: 28, fontWeight: 300, lineHeight: 1,
                transition: "transform 0.3s ease",
                transform: open === i ? "rotate(45deg)" : "rotate(0deg)"
              }}>+</span>
            </button>
            <div className={`program-body${open === i ? " open" : ""}`}>
              <div style={{ padding: "0 32px 32px 78px" }}>
                <p style={{
                  fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: "#555",
                  lineHeight: 1.8, margin: "0 0 20px"
                }}>{p.desc}</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 24 }}>
                  {p.list.map(item => (
                    <span key={item} className="prog-tag"
                      style={{
                        background: p.color + "12", color: p.color,
                        border: `1px solid ${p.color}30`
                      }}>
                      {item}
                    </span>
                  ))}
                </div>
                <WA text={`Ask about ${p.name}`} style={{ fontSize: 12, padding: "9px 20px" }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── ABOUT PAGE ────────────────────────────────────────────────── */
function AboutPage() {
  useReveal();
  return (
    <div className="page-enter">
      <section style={{ padding: "80px 5% 60px", background: C.white, borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 1080, margin: "0 auto", display: "flex", gap: 72, flexWrap: "wrap", alignItems: "center" }}>
          <div style={{ flex: "1 1 360px" }} className="reveal-left">
            <div className="section-label" style={{ color: C.pink }}>Our Story</div>
            <div style={{
              fontFamily: "'DM Sans',sans-serif", fontSize: "clamp(26px,4vw,48px)",
              fontWeight: 300, color: C.black, lineHeight: 1.15
            }}>
              Built on a belief that every child is a natural creator.
            </div>
          </div>
          <div style={{ flex: "1 1 320px" }} className="reveal">
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 16, color: C.muted, lineHeight: 1.9, margin: 0 }}>
              Nascere Studio was founded with one idea — that arts and music are not extras,
              they are essentials. We use creativity as a tool for child development, building
              confidence, focus, and joy in every session. From our studio in Aizawl to
              classrooms across Mizoram, we've walked alongside hundreds of families.
            </p>
          </div>
        </div>
      </section>

      <section style={{ padding: "80px 5%", background: C.off }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 18 }}
            className="stagger-children">
            {[
              { l: "Music", i: "🎵", c: C.purple, t: "Sir Rotluanga leads our music program — keyboard, rhythm, and theory taught through joy and play for ages 3–12." },
              { l: "Colors", i: "🎨", c: C.pink, t: "Our art team guides children through painting, drawing, sculpture, and mixed media — every single week." },
              { l: "Stories", i: "📖", c: C.yellow, t: "We document classes, events, and milestones — on this website and Instagram — so every moment is remembered." },
              { l: "Community", i: "🤝", c: C.teal, t: "We visit schools, host parents, and run exhibitions. Nascere Studio belongs to all of Aizawl." },
            ].map(v => (
              <div key={v.l} className="value-card reveal"
                style={{ borderTop: `3px solid ${v.c}` }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>{v.i}</div>
                <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 16, fontWeight: 700, color: C.black, marginBottom: 10 }}>{v.l}</div>
                <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: C.muted, lineHeight: 1.75 }}>{v.t}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: "80px 5%", background: C.white }}>
        <div style={{ maxWidth: 1080, margin: "0 auto", display: "flex", gap: 72, flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 280px" }} className="reveal-left">
            <div className="section-label" style={{ color: C.pink }}>Find Us</div>
            <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 18, fontWeight: 700, color: C.black, marginBottom: 10 }}>
              Nascere Studio
            </div>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: C.muted, lineHeight: 1.9, margin: "0 0 24px" }}>
              Ramthanmawia Building<br />
              Next to KFC, Zarkawt Main Road<br />
              Aizawl, Mizoram 796001
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <a href="tel:+916009208311"
                style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: C.black, textDecoration: "none", fontWeight: 500, display: "flex", alignItems: "center", gap: 8 }}>
                📞 +91 6009208311
              </a>
              <a href="https://instagram.com/nascere_studio" target="_blank" rel="noreferrer"
                className="insta-link" style={{ alignSelf: "flex-start" }}>
                📸 @nascere_studio
              </a>
              <a href="https://instagram.com/nascere_craft" target="_blank" rel="noreferrer"
                style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: C.black, textDecoration: "none", fontWeight: 500 }}>
                🛍️ @nascere_craft
              </a>
            </div>
          </div>
          <div style={{ flex: "1 1 300px" }} className="reveal">
            <div className="section-label" style={{ color: C.teal }}>Get in Touch</div>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 15, color: C.muted, lineHeight: 1.8, marginBottom: 28 }}>
              The quickest way to reach us is WhatsApp. Message us to enroll your child,
              ask about programs, or arrange a school visit.
            </p>
            <WA text="Chat on WhatsApp" style={{ fontSize: 14, padding: "14px 30px" }} pulse />
            <div style={{ marginTop: 24, padding: 22, background: C.off, borderRadius: 10 }}>
              <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 700, color: C.black, marginBottom: 8 }}>Class Hours</div>
              <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: C.muted, lineHeight: 1.9 }}>
                Mon – Fri: 9:00 AM – 6:00 PM<br />
                Saturday: 9:00 AM – 2:00 PM<br />
                Sunday: Closed
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: "64px 5%", background: C.black, textAlign: "center" }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
          <div style={{ animation: "float1 6s ease-in-out infinite" }}>
            <Daisy size={56} stroke={C.white} fill={C.black} />
          </div>
        </div>
        <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: "#555", letterSpacing: "0.18em", textTransform: "uppercase" }}>
          nascere studio · music · colors · stories · aizawl, mizoram
        </div>
      </section>
    </div>
  );
}

/* ─── FOOTER ────────────────────────────────────────────────────── */
function Footer({ go }) {
  return (
    <footer style={{ background: C.off, padding: "36px 5%", borderTop: `1px solid ${C.border}` }}>
      <div style={{
        maxWidth: 1080, margin: "0 auto", display: "flex",
        justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 20
      }}>
        <button onClick={() => go("home")}
          style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
          <Logo size="sm" />
        </button>
        <div style={{ display: "flex", gap: 24, flexWrap: "wrap", alignItems: "center" }}>
          {["Home", "Stories", "Gallery", "Programs", "Toys", "About"].map(item => (
            <button key={item} onClick={() => go(item.toLowerCase())}
              style={{
                background: "none", border: "none", cursor: "pointer",
                fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: C.muted,
                letterSpacing: "0.06em", textTransform: "uppercase",
                transition: "color 0.2s"
              }}
              onMouseEnter={e => e.currentTarget.style.color = C.black}
              onMouseLeave={e => e.currentTarget.style.color = C.muted}>
              {item}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <a href="https://instagram.com/nascere_studio" target="_blank" rel="noreferrer"
            className="insta-link" style={{ padding: "7px 14px", fontSize: 12 }}>
            📸 Instagram
          </a>
          <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: C.muted }}>
            © 2026 Nascere Studio
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ─── TOYS PAGE ─────────────────────────────────────────────────── */
function ToysPage() {
  useReveal();
  const [cat, setCat] = useState("All");
  const cats = ["All", "Wooden", "Music", "Art Kit", "STEM"];
  const filtered = cat === "All" ? TOYS : TOYS.filter(t => t.cat === cat);

  const catColors = { Wooden: C.teal, Music: C.purple, "Art Kit": C.pink, STEM: C.yellow };

  return (
    <div className="page-enter">
      {/* ── HERO ── */}
      <section style={{
        background: `linear-gradient(135deg, #fff5f8 0%, #f0edff 50%, #e8faf8 100%)`,
        padding: "100px 5% 80px", position: "relative", overflow: "hidden"
      }}>
        {/* subtle floating shapes */}
        <div style={{ position: "absolute", top: "10%", right: "4%", opacity: 0.08, animation: "float2 10s ease-in-out infinite", pointerEvents: "none" }}>
          <Daisy size={200} stroke={C.purple} fill="transparent" />
        </div>
        <div style={{ position: "absolute", bottom: "5%", left: "2%", opacity: 0.07, animation: "float4 14s ease-in-out infinite", pointerEvents: "none" }}>
          <Daisy size={120} stroke={C.teal} fill="transparent" />
        </div>

        <div style={{ maxWidth: 1080, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
          <div className="section-label reveal" style={{ color: C.pink, justifyContent: "center", marginBottom: 20 }}>nascere craft shop</div>

          {/* ── SplitText hero heading ── */}
          <SplitText
            text="Our Toy Shop"
            splitType="chars"
            delay={45}
            duration={0.9}
            ease="power3.out"
            from={{ opacity: 0, y: 48 }}
            to={{ opacity: 1, y: 0 }}
            threshold={0.1}
            rootMargin="-40px"
            textAlign="center"
            onLetterAnimationComplete={() => {}}
            showCallback
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "clamp(42px, 8vw, 88px)",
              fontWeight: 800,
              color: C.black,
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              marginBottom: 20,
            }}
          />

          {/* ── SplitText subtitle ── */}
          <SplitText
            text="Curated educational toys, Montessori wooden blocks, art kits & instruments — designed to teach through play."
            splitType="words"
            delay={25}
            duration={0.7}
            ease="power2.out"
            from={{ opacity: 0, y: 20 }}
            to={{ opacity: 1, y: 0 }}
            threshold={0.1}
            rootMargin="-20px"
            textAlign="center"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "clamp(15px, 2vw, 18px)",
              color: C.muted,
              lineHeight: 1.8,
              maxWidth: 580,
              margin: "0 auto 36px",
            }}
          />

          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }} className="reveal">
            <WA text="Order via WhatsApp" pulse style={{ fontSize: 14, padding: "13px 30px" }} />
            <a href="https://instagram.com/nascere_craft" target="_blank" rel="noreferrer"
              className="insta-link" style={{ padding: "13px 22px", fontSize: 13 }}>
              📸 @nascere_craft
            </a>
          </div>

          {/* Stats row */}
          <div style={{
            marginTop: 52, display: "flex", justifyContent: "center", gap: 48, flexWrap: "wrap",
            paddingTop: 36, borderTop: "1px solid rgba(0,0,0,0.07)"
          }} className="stagger-children">
            {[["12+", "Toy Categories"], ["0–12", "Age Range"], ["100%", "Curated Picks"]].map(([v, l]) => (
              <div key={l} className="reveal" style={{ textAlign: "center" }}>
                <div className="stat-value" style={{ fontSize: 28, color: C.pink }}>{v}</div>
                <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: C.muted, letterSpacing: "0.08em", textTransform: "uppercase", marginTop: 4 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CATALOG ── */}
      <section style={{ background: C.white, padding: "72px 5% 100px" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>

          {/* Category Filter */}
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 48, justifyContent: "center" }} className="reveal">
            {cats.map(c => {
              const col = c === "All" ? C.black : catColors[c];
              const active = cat === c;
              return (
                <button key={c} onClick={() => setCat(c)}
                  style={{
                    padding: "9px 22px",
                    borderRadius: 50,
                    border: `2px solid ${active ? col : C.border}`,
                    background: active ? col : C.white,
                    color: active ? C.white : C.muted,
                    fontFamily: "'DM Sans',sans-serif",
                    fontSize: 12, fontWeight: 700,
                    letterSpacing: "0.05em", textTransform: "uppercase",
                    cursor: "pointer",
                    transition: "all 0.22s cubic-bezier(0.22,1,0.36,1)",
                    boxShadow: active ? `0 4px 16px ${col}44` : "none"
                  }}>
                  {c === "Wooden" && "🪵 "}{c === "Music" && "🎵 "}{c === "Art Kit" && "🎨 "}{c === "STEM" && "🔬 "}{c}
                </button>
              );
            })}
          </div>

          {/* Product Grid */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: 24
          }} className="stagger-children">
            {filtered.map(toy => (
              <div key={toy.id} className="reveal"
                style={{
                  background: C.white,
                  border: `1px solid ${C.border}`,
                  borderRadius: 16,
                  overflow: "hidden",
                  transition: "transform 0.3s cubic-bezier(0.22,1,0.36,1), box-shadow 0.3s ease",
                  position: "relative"
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = "translateY(-6px)";
                  e.currentTarget.style.boxShadow = `0 20px 56px rgba(0,0,0,0.10)`;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}>

                {/* Badge */}
                {toy.badge && (
                  <div style={{
                    position: "absolute", top: 12, right: 12, zIndex: 2,
                    background: toy.color, color: C.white,
                    fontFamily: "'DM Sans',sans-serif", fontSize: 10, fontWeight: 800,
                    letterSpacing: "0.08em", textTransform: "uppercase",
                    padding: "4px 10px", borderRadius: 50,
                    boxShadow: `0 3px 10px ${toy.color}55`
                  }}>
                    {toy.badge}
                  </div>
                )}

                {/* Emoji Display */}
                <div style={{
                  height: 160,
                  background: `linear-gradient(135deg, ${toy.color}14, ${toy.color}08)`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 64,
                  borderBottom: `1px solid ${toy.color}22`,
                  position: "relative", overflow: "hidden"
                }}>
                  {/* subtle grid pattern */}
                  <div style={{
                    position: "absolute", inset: 0,
                    backgroundImage: `radial-gradient(circle, ${toy.color}18 1px, transparent 1px)`,
                    backgroundSize: "20px 20px"
                  }} />
                  <span style={{ position: "relative", zIndex: 1, filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.12))" }}>{toy.emoji}</span>
                </div>

                {/* Info */}
                <div style={{ padding: "18px 20px 20px" }}>
                  {/* Cat + Age row */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                    <span style={{
                      background: toy.color + "18", color: toy.color,
                      border: `1px solid ${toy.color}33`,
                      borderRadius: 4, padding: "2px 9px",
                      fontFamily: "'DM Sans',sans-serif", fontSize: 10, fontWeight: 700,
                      letterSpacing: "0.06em", textTransform: "uppercase"
                    }}>{toy.cat}</span>
                    <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: C.muted, fontWeight: 500 }}>
                      {toy.age}
                    </span>
                  </div>

                  <div style={{
                    fontFamily: "'DM Sans',sans-serif", fontSize: 16, fontWeight: 700,
                    color: C.black, lineHeight: 1.3, marginBottom: 8
                  }}>{toy.name}</div>

                  <div style={{
                    fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: C.muted,
                    lineHeight: 1.65, marginBottom: 18
                  }}>{toy.desc}</div>

                  <a href={`https://wa.me/916009208311?text=Hi! I'm interested in the ${encodeURIComponent(toy.name)} from Nascere Craft Shop.`}
                    target="_blank" rel="noreferrer"
                    style={{
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                      background: toy.color, color: C.white,
                      borderRadius: 8, padding: "10px 0",
                      fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: 12,
                      letterSpacing: "0.04em", textTransform: "uppercase",
                      textDecoration: "none",
                      transition: "opacity 0.2s, transform 0.2s"
                    }}
                    onMouseEnter={e => { e.currentTarget.style.opacity = "0.88"; e.currentTarget.style.transform = "scale(1.02)"; }}
                    onMouseLeave={e => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "scale(1)"; }}>
                    💬 Enquire on WhatsApp
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom CTA banner */}
          <div className="reveal" style={{
            marginTop: 72, borderRadius: 20, overflow: "hidden",
            background: `linear-gradient(135deg, ${C.black} 60%, #2a1040 100%)`,
            padding: "52px 40px", textAlign: "center", position: "relative"
          }}>
            <div style={{ position: "absolute", top: "50%", right: 24, transform: "translateY(-50%)", opacity: 0.06, animation: "float3 8s ease-in-out infinite", pointerEvents: "none" }}>
              <Daisy size={180} stroke={C.white} fill="transparent" />
            </div>
            <div style={{ position: "relative", zIndex: 1 }}>
              <div style={{ fontSize: 40, marginBottom: 16 }}>🛍️</div>
              <div style={{
                fontFamily: "'DM Sans',sans-serif", fontSize: "clamp(22px,4vw,34px)",
                fontWeight: 700, color: C.white, lineHeight: 1.2, marginBottom: 12
              }}>Can't find what you're looking for?</div>
              <p style={{
                fontFamily: "'DM Sans',sans-serif", fontSize: 15, color: "#888",
                lineHeight: 1.75, marginBottom: 28, maxWidth: 480, margin: "0 auto 28px"
              }}>We regularly stock new toys, craft kits, and instruments. Message us on WhatsApp or visit @nascere_craft on Instagram to see our full range.</p>
              <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                <WA text="Browse All Toys" pulse style={{ fontSize: 14, padding: "13px 28px" }} />
                <a href="https://instagram.com/nascere_craft" target="_blank" rel="noreferrer"
                  className="insta-link" style={{ padding: "13px 22px", fontSize: 13 }}>
                  📸 @nascere_craft
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ─── MAIN APP ──────────────────────────────────────────────────── */
export default function App() {
  const [splashVisible, setSplashVisible] = useState(true);
  const [page, setPage] = useState("home");
  const [story, setStory] = useState(null);
  const [pageKey, setPageKey] = useState(0);

  const [realPhotos, setRealPhotos] = useState([]);
  const [galleryLoading, setGalleryLoading] = useState(true);
  const [galleryError, setGalleryError] = useState(null);

  // Hide splash after 2s
  useEffect(() => {
    const t = setTimeout(() => setSplashVisible(false), 2000);
    return () => clearTimeout(t);
  }, []);

  async function loadPhotos() {
    setGalleryLoading(true);
    setGalleryError(null);
    try {
      if (window.storage) {
        const res = await window.storage.get("gallery:photos", true);
        setRealPhotos(res && res.value ? JSON.parse(res.value) : []);
      } else {
        setRealPhotos([]);
      }
    } catch {
      setRealPhotos([]);
    } finally {
      setGalleryLoading(false);
    }
  }

  async function savePhotos(newList) {
    if (!window.storage) throw new Error("Storage not available");
    const result = await window.storage.set("gallery:photos", JSON.stringify(newList), true);
    if (!result) throw new Error("Storage write failed");
    setRealPhotos(newList);
  }

  useEffect(() => { loadPhotos(); }, []);

  const go = (p) => {
    setPage(p);
    setPageKey(k => k + 1);
    if (p !== "stories") setStory(null);
    try { window.scrollTo({ top: 0, behavior: "smooth" }); } catch { }
  };

  const openStory = (s) => {
    setStory(s);
    setPage("stories");
    setPageKey(k => k + 1);
    try { window.scrollTo({ top: 0, behavior: "smooth" }); } catch { }
  };

  return (
    <>
      <Splash visible={splashVisible} />
      <ScrollProgress />
      <div style={{ fontFamily: "'DM Sans',sans-serif", background: C.white, color: C.black, minHeight: "100vh" }}>
        <Nav page={page} go={go} />
        <div style={{ paddingTop: 64 }}>
          <div key={pageKey}>
            {page === "home" && <Home go={go} openStory={openStory} realPhotos={realPhotos} />}
            {page === "stories" && <StoriesPage story={story} setStory={setStory} />}
            {page === "gallery" && <GalleryPage realPhotos={realPhotos} loading={galleryLoading}
              error={galleryError} onSave={savePhotos} onReload={loadPhotos} />}
            {page === "programs" && <ProgramsPage />}
            {page === "toys" && <ToysPage />}
            {page === "about" && <AboutPage />}
          </div>
        </div>
        <Footer go={go} />
      </div>
    </>
  );
}
