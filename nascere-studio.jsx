import { useState, useEffect } from "react";

const C = {
    white: "#FFFFFF", off: "#FAFAFA", black: "#181818",
    pink: "#E82060", yellow: "#F5B700", teal: "#2EADA0", purple: "#7C6FE0",
    border: "#E8E8E8", muted: "#999", light: "#F5F5F5",
};

// Passcode that gates the "Manage Photos" panel on the Gallery page.
// Change this to whatever you like — it's a light gate to keep casual
// visitors from editing the gallery, not real account security.
const GALLERY_PASSCODE = "nascere2026";

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

// Placeholder gallery cards — shown alongside real uploaded photos until
// you've added enough of your own. Feel free to trim this list down as
// your real gallery grows.
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

// ─── IMAGE HELPER ────────────────────────────────────────────────
// Reads a File, shrinks it to a reasonable size, and returns a JPEG
// data URL — keeps uploads small enough to store comfortably.
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
                const ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0, w, h);
                resolve(canvas.toDataURL("image/jpeg", quality));
            };
            img.onerror = () => reject(new Error("Could not load image"));
            img.src = e.target.result;
        };
        reader.onerror = () => reject(new Error("Could not read file"));
        reader.readAsDataURL(file);
    });
}

// ─── DAISY SVG ───────────────────────────────────────────────────
function Daisy({ size = 80, stroke = C.black, fill = C.white }) {
    const cx = 100, cy = 100, innerR = 28, pLen = 22, pW = 8, dist = 50, n = 12;
    return (
        <svg width={size} height={size} viewBox="0 0 200 200">
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

// ─── LOGO ────────────────────────────────────────────────────────
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

// ─── TAG ─────────────────────────────────────────────────────────
function Tag({ label, color }) {
    return (
        <span style={{
            background: color + "18", color, border: `1px solid ${color}44`,
            borderRadius: 3, padding: "2px 10px", fontSize: 11, fontWeight: 700,
            letterSpacing: "0.07em", textTransform: "uppercase"
        }}>
            {label}
        </span>
    );
}

// ─── WHATSAPP BUTTON ─────────────────────────────────────────────
function WA({ text = "WhatsApp Us", style = {} }) {
    return (
        <a href="https://wa.me/916009208311" target="_blank" rel="noreferrer"
            style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: C.pink, color: C.white, textDecoration: "none",
                borderRadius: 4, padding: "12px 24px", fontFamily: "'DM Sans',sans-serif",
                fontWeight: 700, fontSize: 13, letterSpacing: "0.05em", textTransform: "uppercase",
                ...style
            }}>
            💬 {text}
        </a>
    );
}

// ─── GALLERY CARD (shared by Home teaser + Gallery page) ─────────
function GalleryCard({ item, tall }) {
    if (item.dataUrl) {
        return (
            <div style={{ position: "relative", borderRadius: 8, overflow: "hidden", background: C.light }}>
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
        <div style={{ background: item.bg, borderRadius: 8, padding: "28px 12px", textAlign: "center" }}>
            <div style={{ fontSize: 36, marginBottom: 6 }}>{item.emoji}</div>
            <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, fontWeight: 600, color: C.black }}>{item.label}</div>
        </div>
    );
}

// ─── NAV ─────────────────────────────────────────────────────────
function Nav({ page, go }) {
    const [mo, setMo] = useState(false);
    const items = ["Home", "Stories", "Gallery", "Programs", "About"];
    const handle = (p) => { go(p); setMo(false); };
    return (
        <>
            <nav style={{
                position: "fixed", top: 0, left: 0, right: 0, zIndex: 200,
                background: "rgba(255,255,255,0.97)", backdropFilter: "blur(8px)",
                borderBottom: `1px solid ${C.border}`, padding: "0 5%"
            }}>
                <div style={{
                    maxWidth: 1080, margin: "0 auto", display: "flex",
                    alignItems: "center", justifyContent: "space-between", height: 64
                }}>
                    <button onClick={() => handle("home")}
                        style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                        <Logo size="sm" />
                    </button>
                    <div className="ns-desk" style={{ display: "flex", gap: 28, alignItems: "center" }}>
                        {items.map(item => (
                            <button key={item} onClick={() => handle(item.toLowerCase())}
                                style={{
                                    background: "none", border: "none", cursor: "pointer",
                                    fontFamily: "'DM Sans',sans-serif", fontSize: 12,
                                    fontWeight: page === item.toLowerCase() ? 700 : 400,
                                    color: page === item.toLowerCase() ? C.pink : C.black,
                                    letterSpacing: "0.08em", textTransform: "uppercase",
                                    borderBottom: page === item.toLowerCase() ? `2px solid ${C.pink}` : "2px solid transparent",
                                    paddingBottom: 2, transition: "color 0.2s"
                                }}>
                                {item}
                            </button>
                        ))}
                        <WA text="WhatsApp" style={{ padding: "8px 16px", fontSize: 11 }} />
                    </div>
                    <button onClick={() => setMo(!mo)} className="ns-ham"
                        style={{ background: "none", border: "none", cursor: "pointer", fontSize: 22, display: "none" }}>
                        {mo ? "✕" : "☰"}
                    </button>
                </div>
            </nav>
            {mo && (
                <div style={{
                    position: "fixed", top: 64, left: 0, right: 0, zIndex: 199,
                    background: C.white, borderBottom: `1px solid ${C.border}`, padding: "8px 5% 20px"
                }}>
                    {items.map(item => (
                        <button key={item} onClick={() => handle(item.toLowerCase())}
                            style={{
                                display: "block", width: "100%", textAlign: "left",
                                background: "none", border: "none", cursor: "pointer",
                                fontFamily: "'DM Sans',sans-serif", fontSize: 16, fontWeight: 500,
                                padding: "14px 0", borderBottom: `1px solid ${C.border}`,
                                color: page === item.toLowerCase() ? C.pink : C.black
                            }}>
                            {item}
                        </button>
                    ))}
                    <WA text="WhatsApp Us" style={{ marginTop: 16 }} />
                </div>
            )}
            <style>{`
        @media(max-width:768px){.ns-desk{display:none!important;}.ns-ham{display:block!important;}}
        *{box-sizing:border-box;}html,body{margin:0;}
      `}</style>
        </>
    );
}

// ─── HOME ────────────────────────────────────────────────────────
function Home({ go, openStory, realPhotos }) {
    const teaser = [...realPhotos, ...GALLERY].slice(0, 6);
    return (
        <div>
            {/* HERO */}
            <section style={{
                minHeight: "100vh", display: "flex", alignItems: "center",
                padding: "80px 5% 60px", background: C.white, position: "relative", overflow: "hidden"
            }}>
                <div style={{
                    position: "absolute", right: "-6%", top: "50%", transform: "translateY(-50%)",
                    opacity: 0.05, pointerEvents: "none"
                }}>
                    <Daisy size={520} />
                </div>
                <div style={{
                    maxWidth: 1080, margin: "0 auto", display: "flex", alignItems: "center",
                    justifyContent: "space-between", gap: 60, flexWrap: "wrap", position: "relative", zIndex: 1
                }}>
                    <div style={{ flex: "1 1 400px" }}>
                        <Logo size="xl" />
                        <div style={{ marginTop: 24, display: "flex", gap: 20 }}>
                            {["Music", "Colors", "Stories"].map(p => (
                                <span key={p} style={{
                                    fontFamily: "'DM Sans',sans-serif", fontSize: 11,
                                    fontWeight: 700, letterSpacing: "0.16em", color: C.pink, textTransform: "uppercase"
                                }}>{p}</span>
                            ))}
                        </div>
                        <p style={{
                            marginTop: 24, fontSize: 16, color: C.muted, lineHeight: 1.8,
                            maxWidth: 440, fontFamily: "'DM Sans',sans-serif"
                        }}>
                            A child development studio for children aged 3–12. Growing young minds through
                            arts, craft, and music — in Aizawl, Mizoram.
                        </p>
                        <div style={{ marginTop: 32, display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
                            <WA text="Enroll via WhatsApp" />
                            <button onClick={() => go("programs")}
                                style={{
                                    background: "none", border: `1.5px solid ${C.border}`, cursor: "pointer",
                                    borderRadius: 4, padding: "12px 24px", fontFamily: "'DM Sans',sans-serif",
                                    fontWeight: 600, fontSize: 13, letterSpacing: "0.05em", textTransform: "uppercase", color: C.black
                                }}>
                                Our Programs →
                            </button>
                        </div>
                        <div style={{
                            marginTop: 40, paddingTop: 32, borderTop: `1px solid ${C.border}`,
                            display: "flex", gap: 40, flexWrap: "wrap"
                        }}>
                            {[["3–12", "Age Group"], ["Arts & Music", "What We Teach"], ["Aizawl", "Where We Are"]].map(([n, l]) => (
                                <div key={l}>
                                    <div style={{
                                        fontFamily: "'DM Sans',sans-serif", fontSize: 22, fontWeight: 700,
                                        color: C.black, letterSpacing: "-0.02em"
                                    }}>{n}</div>
                                    <div style={{
                                        fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: C.muted,
                                        letterSpacing: "0.06em", textTransform: "uppercase", marginTop: 2
                                    }}>{l}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div style={{ flex: "1 1 260px", display: "flex", justifyContent: "center" }}>
                        <Daisy size={260} />
                    </div>
                </div>
            </section>

            {/* THREE PILLARS */}
            <section style={{ padding: "80px 5%", background: C.black }}>
                <div style={{ maxWidth: 1080, margin: "0 auto" }}>
                    <div style={{ textAlign: "center", marginBottom: 52 }}>
                        <div style={{
                            fontFamily: "'DM Sans',sans-serif", fontSize: 11, fontWeight: 700,
                            letterSpacing: "0.16em", color: C.pink, textTransform: "uppercase", marginBottom: 12
                        }}>
                            What We Believe
                        </div>
                        <div style={{
                            fontFamily: "'DM Sans',sans-serif", fontSize: "clamp(26px,4vw,38px)",
                            fontWeight: 300, color: C.white, lineHeight: 1.2
                        }}>
                            Three pillars. One studio.
                        </div>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 1, background: "#2a2a2a" }}>
                        {[
                            {
                                title: "Music", emoji: "🎵", color: C.purple,
                                desc: "Music teaches rhythm, memory, discipline, and emotional expression. Every child is a musician waiting to be heard."
                            },
                            {
                                title: "Colors", emoji: "🎨", color: C.pink,
                                desc: "Color and visual art unlock observation, imagination, and fine motor skills. We make art every single day."
                            },
                            {
                                title: "Stories", emoji: "📖", color: C.yellow,
                                desc: "We document what we do, share what we learn, and build a community around creativity. This website is our story."
                            },
                        ].map(p => (
                            <div key={p.title} style={{ background: C.black, padding: "48px 36px" }}>
                                <div style={{ fontSize: 36, marginBottom: 20 }}>{p.emoji}</div>
                                <div style={{
                                    fontFamily: "'DM Sans',sans-serif", fontSize: 22, fontWeight: 700,
                                    color: C.white, letterSpacing: "-0.01em", marginBottom: 12
                                }}>{p.title}</div>
                                <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: "#777", lineHeight: 1.75 }}>{p.desc}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* LATEST STORIES */}
            <section style={{ padding: "80px 5%", background: C.white }}>
                <div style={{ maxWidth: 1080, margin: "0 auto" }}>
                    <div style={{
                        display: "flex", justifyContent: "space-between", alignItems: "baseline",
                        marginBottom: 40, flexWrap: "wrap", gap: 12
                    }}>
                        <div>
                            <div style={{
                                fontFamily: "'DM Sans',sans-serif", fontSize: 11, fontWeight: 700,
                                letterSpacing: "0.16em", color: C.pink, textTransform: "uppercase", marginBottom: 8
                            }}>From the Studio</div>
                            <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "clamp(22px,3vw,32px)", fontWeight: 300, color: C.black }}>
                                Latest Stories
                            </div>
                        </div>
                        <button onClick={() => go("stories")}
                            style={{
                                background: "none", border: "none", cursor: "pointer",
                                fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 600,
                                color: C.pink, textDecoration: "underline"
                            }}>
                            All Stories →
                        </button>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(290px,1fr))", gap: 20 }}>
                        {STORIES.slice(0, 3).map(s => (
                            <div key={s.id} onClick={() => openStory(s)}
                                style={{ cursor: "pointer", border: `1px solid ${C.border}`, borderRadius: 8, overflow: "hidden" }}
                                onMouseEnter={e => e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.08)"}
                                onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}>
                                <div style={{
                                    background: s.bg, height: 160, display: "flex",
                                    alignItems: "center", justifyContent: "center", fontSize: 60
                                }}>{s.emoji}</div>
                                <div style={{ padding: "18px 20px 22px" }}>
                                    <div style={{
                                        display: "flex", justifyContent: "space-between",
                                        alignItems: "center", marginBottom: 10
                                    }}>
                                        <Tag label={s.tag} color={s.tc} />
                                        <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: C.muted }}>{s.date}</span>
                                    </div>
                                    <div style={{
                                        fontFamily: "'DM Sans',sans-serif", fontSize: 16, fontWeight: 600,
                                        color: C.black, lineHeight: 1.3, marginBottom: 8
                                    }}>{s.title}</div>
                                    <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: C.muted, lineHeight: 1.65 }}>{s.excerpt}</div>
                                    <div style={{
                                        marginTop: 14, fontFamily: "'DM Sans',sans-serif", fontSize: 12,
                                        fontWeight: 700, color: C.pink
                                    }}>Read more →</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* GALLERY TEASER */}
            <section style={{ padding: "80px 5%", background: C.off }}>
                <div style={{ maxWidth: 1080, margin: "0 auto" }}>
                    <div style={{
                        display: "flex", justifyContent: "space-between", alignItems: "baseline",
                        marginBottom: 36, flexWrap: "wrap", gap: 12
                    }}>
                        <div>
                            <div style={{
                                fontFamily: "'DM Sans',sans-serif", fontSize: 11, fontWeight: 700,
                                letterSpacing: "0.16em", color: C.teal, textTransform: "uppercase", marginBottom: 8
                            }}>Kid's Creations</div>
                            <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "clamp(22px,3vw,32px)", fontWeight: 300, color: C.black }}>
                                From the Gallery
                            </div>
                        </div>
                        <button onClick={() => go("gallery")}
                            style={{
                                background: "none", border: "none", cursor: "pointer",
                                fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 600,
                                color: C.teal, textDecoration: "underline"
                            }}>
                            Full Gallery →
                        </button>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(140px,1fr))", gap: 10 }}>
                        {teaser.map(g => (
                            <div key={g.id} style={{ transition: "transform 0.2s", cursor: "default" }}
                                onMouseEnter={e => e.currentTarget.style.transform = "scale(1.04)"}
                                onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}>
                                <GalleryCard item={g} />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section style={{ padding: "80px 5%", background: C.white, textAlign: "center" }}>
                <div style={{ maxWidth: 540, margin: "0 auto" }}>
                    <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
                        <Daisy size={64} />
                    </div>
                    <div style={{
                        fontFamily: "'DM Sans',sans-serif", fontSize: "clamp(24px,4vw,38px)",
                        fontWeight: 300, color: C.black, lineHeight: 1.2, marginBottom: 12
                    }}>
                        Ready to enroll your child?
                    </div>
                    <p style={{
                        fontFamily: "'DM Sans',sans-serif", fontSize: 15, color: C.muted,
                        lineHeight: 1.75, marginBottom: 32
                    }}>
                        Reach out on WhatsApp and we'll find the right program for your little one.
                        Arts & Music Classes for ages 3–12, in Aizawl, Mizoram.
                    </p>
                    <WA text="Start on WhatsApp" style={{ fontSize: 14, padding: "14px 32px" }} />
                    <div style={{ marginTop: 20, fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: C.muted }}>
                        📍 Ramthanmawia Building, next to KFC, Zarkawt Main Road, Aizawl
                    </div>
                </div>
            </section>
        </div>
    );
}

// ─── STORIES PAGE ────────────────────────────────────────────────
function StoriesPage({ story, setStory }) {
    const [filter, setFilter] = useState("All");
    const tags = ["All", "Event", "Workshop", "Music", "Art", "Update", "Community"];
    const filtered = filter === "All" ? STORIES : STORIES.filter(s => s.tag === filter);

    if (story) {
        return (
            <div style={{ maxWidth: 680, margin: "0 auto", padding: "60px 5% 100px" }}>
                <button onClick={() => setStory(null)}
                    style={{
                        background: "none", border: "none", cursor: "pointer",
                        fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: C.pink,
                        fontWeight: 600, marginBottom: 32, letterSpacing: "0.04em", padding: 0
                    }}>
                    ← All Stories
                </button>
                <div style={{
                    background: story.bg, height: 200, borderRadius: 12, display: "flex",
                    alignItems: "center", justifyContent: "center", fontSize: 80, marginBottom: 28
                }}>
                    {story.emoji}
                </div>
                <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 16 }}>
                    <Tag label={story.tag} color={story.tc} />
                    <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: C.muted }}>{story.date}</span>
                </div>
                <h1 style={{
                    fontFamily: "'DM Sans',sans-serif", fontSize: "clamp(22px,4vw,34px)",
                    fontWeight: 700, color: C.black, lineHeight: 1.2, margin: "0 0 24px"
                }}>{story.title}</h1>
                <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 24 }}>
                    {story.body.split("\n\n").map((para, i) => (
                        <p key={i} style={{
                            fontFamily: "'DM Sans',sans-serif", fontSize: 16, color: "#444",
                            lineHeight: 1.8, margin: "0 0 20px"
                        }}>{para}</p>
                    ))}
                </div>
                <div style={{ marginTop: 40, padding: 24, background: C.off, borderRadius: 8, textAlign: "center" }}>
                    <div style={{
                        fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontWeight: 600,
                        color: C.black, marginBottom: 12
                    }}>Have questions? We'd love to hear from you.</div>
                    <WA text="WhatsApp Us" />
                </div>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: 1080, margin: "0 auto", padding: "60px 5% 100px" }}>
            <div style={{ marginBottom: 48 }}>
                <div style={{
                    fontFamily: "'DM Sans',sans-serif", fontSize: 11, fontWeight: 700,
                    letterSpacing: "0.16em", color: C.pink, textTransform: "uppercase", marginBottom: 8
                }}>From the Studio</div>
                <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "clamp(28px,4vw,44px)", fontWeight: 300, color: C.black }}>
                    Stories
                </div>
                <p style={{
                    fontFamily: "'DM Sans',sans-serif", fontSize: 15, color: C.muted,
                    marginTop: 12, maxWidth: 480, lineHeight: 1.65
                }}>
                    Event recaps, ideas, updates, and reflections from Nascere Studio.
                    This is our main channel — updated regularly.
                </p>
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 36 }}>
                {tags.map(t => (
                    <button key={t} onClick={() => setFilter(t)}
                        style={{
                            background: filter === t ? C.black : "none", color: filter === t ? C.white : C.muted,
                            border: `1px solid ${filter === t ? C.black : C.border}`, borderRadius: 4,
                            padding: "6px 16px", fontFamily: "'DM Sans',sans-serif", fontSize: 12,
                            fontWeight: 600, cursor: "pointer", letterSpacing: "0.04em", textTransform: "uppercase"
                        }}>
                        {t}
                    </button>
                ))}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(290px,1fr))", gap: 24 }}>
                {filtered.map(s => (
                    <div key={s.id} onClick={() => setStory(s)}
                        style={{ cursor: "pointer", border: `1px solid ${C.border}`, borderRadius: 8, overflow: "hidden" }}
                        onMouseEnter={e => e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.08)"}
                        onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}>
                        <div style={{
                            background: s.bg, height: 180, display: "flex",
                            alignItems: "center", justifyContent: "center", fontSize: 64
                        }}>{s.emoji}</div>
                        <div style={{ padding: "18px 20px 22px" }}>
                            <div style={{
                                display: "flex", justifyContent: "space-between",
                                alignItems: "center", marginBottom: 10
                            }}>
                                <Tag label={s.tag} color={s.tc} />
                                <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: C.muted }}>{s.date}</span>
                            </div>
                            <div style={{
                                fontFamily: "'DM Sans',sans-serif", fontSize: 16, fontWeight: 600,
                                color: C.black, lineHeight: 1.3, marginBottom: 8
                            }}>{s.title}</div>
                            <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: C.muted, lineHeight: 1.65 }}>
                                {s.excerpt}
                            </div>
                            <div style={{
                                marginTop: 14, fontFamily: "'DM Sans',sans-serif", fontSize: 12,
                                fontWeight: 700, color: C.pink
                            }}>Read more →</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ─── GALLERY PAGE ────────────────────────────────────────────────
function GalleryPage({ realPhotos, loading, error, onSave, onReload }) {
    const [cat, setCat] = useState("All");
    const cats = ["All", "Art", "Music", "Craft", "Events"];
    const combined = [...realPhotos, ...GALLERY];
    const filtered = cat === "All" ? combined : combined.filter(g => g.cat === cat);

    // passcode gate
    const [showUnlock, setShowUnlock] = useState(false);
    const [passInput, setPassInput] = useState("");
    const [passError, setPassError] = useState("");
    const [managing, setManaging] = useState(false);

    // add-photo form
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
            const dataUrl = await resizeImage(file);
            setPendingUrl(dataUrl);
        } catch (err) {
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
        } catch (err) {
            setAddError("Couldn't save this photo — it may be too large, or the connection dropped. Try a smaller image.");
        } finally {
            setAddBusy(false);
        }
    };

    const deletePhoto = async (id) => {
        setBusyId(id); setAddError("");
        try {
            await onSave(realPhotos.filter(p => p.id !== id));
        } catch (err) {
            setAddError("Couldn't delete that photo. Try again.");
        } finally {
            setBusyId(null);
        }
    };

    const inputStyle = {
        width: "100%", border: `1px solid ${C.border}`, borderRadius: 4, padding: "9px 12px",
        fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: C.black, background: C.white,
    };

    return (
        <div style={{ maxWidth: 1080, margin: "0 auto", padding: "60px 5% 100px" }}>
            <div style={{
                display: "flex", justifyContent: "space-between", alignItems: "flex-start",
                flexWrap: "wrap", gap: 20, marginBottom: 40
            }}>
                <div>
                    <div style={{
                        fontFamily: "'DM Sans',sans-serif", fontSize: 11, fontWeight: 700,
                        letterSpacing: "0.16em", color: C.teal, textTransform: "uppercase", marginBottom: 8
                    }}>Kid's Creations</div>
                    <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "clamp(28px,4vw,44px)", fontWeight: 300, color: C.black }}>
                        Gallery
                    </div>
                    <p style={{
                        fontFamily: "'DM Sans',sans-serif", fontSize: 15, color: C.muted,
                        marginTop: 12, maxWidth: 480, lineHeight: 1.65
                    }}>
                        Artwork, craft projects, music moments, and events from our studio.
                    </p>
                </div>
                <div>
                    {!managing ? (
                        <button onClick={() => { setShowUnlock(!showUnlock); setPassError(""); }}
                            style={{
                                background: "none", border: `1.5px solid ${C.border}`, cursor: "pointer",
                                borderRadius: 4, padding: "10px 18px", fontFamily: "'DM Sans',sans-serif",
                                fontWeight: 600, fontSize: 12, letterSpacing: "0.05em", textTransform: "uppercase", color: C.black
                            }}>
                            🔒 Manage Photos
                        </button>
                    ) : (
                        <button onClick={() => { setManaging(false); setPendingUrl(null); setAddError(""); }}
                            style={{
                                background: C.black, border: "none", cursor: "pointer",
                                borderRadius: 4, padding: "10px 18px", fontFamily: "'DM Sans',sans-serif",
                                fontWeight: 600, fontSize: 12, letterSpacing: "0.05em", textTransform: "uppercase", color: C.white
                            }}>
                            Done Editing
                        </button>
                    )}
                    {showUnlock && !managing && (
                        <div style={{
                            marginTop: 10, background: C.off, border: `1px solid ${C.border}`,
                            borderRadius: 8, padding: 14, width: 220
                        }}>
                            <input type="password" value={passInput} placeholder="Enter passcode"
                                onChange={e => setPassInput(e.target.value)}
                                onKeyDown={e => { if (e.key === "Enter") tryUnlock(); }}
                                style={inputStyle} />
                            {passError && <div style={{ color: C.pink, fontSize: 11, marginTop: 6, fontFamily: "'DM Sans',sans-serif" }}>{passError}</div>}
                            <button onClick={tryUnlock}
                                style={{
                                    marginTop: 8, width: "100%", background: C.pink, color: C.white, border: "none",
                                    borderRadius: 4, padding: "8px 0", fontFamily: "'DM Sans',sans-serif", fontWeight: 700,
                                    fontSize: 12, letterSpacing: "0.05em", textTransform: "uppercase", cursor: "pointer"
                                }}>
                                Unlock
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* MANAGE PANEL */}
            {managing && (
                <div style={{
                    background: C.off, border: `1px solid ${C.border}`, borderRadius: 8,
                    padding: 24, marginBottom: 40
                }}>
                    <div style={{
                        fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontWeight: 700,
                        color: C.black, marginBottom: 16
                    }}>Add a photo</div>
                    <div style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "flex-end" }}>
                        <div style={{ flex: "1 1 200px" }}>
                            <label style={{
                                display: "block", fontFamily: "'DM Sans',sans-serif", fontSize: 11,
                                color: C.muted, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em"
                            }}>Photo</label>
                            <input type="file" accept="image/*" onChange={handleFile} style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12 }} />
                            {reading && <div style={{ fontSize: 11, color: C.muted, marginTop: 4 }}>Reading image…</div>}
                        </div>
                        <div style={{ flex: "1 1 180px" }}>
                            <label style={{
                                display: "block", fontFamily: "'DM Sans',sans-serif", fontSize: 11,
                                color: C.muted, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em"
                            }}>Caption</label>
                            <input type="text" value={addLabel} onChange={e => setAddLabel(e.target.value)}
                                placeholder="e.g. Watercolor Fish" style={inputStyle} />
                        </div>
                        <div style={{ flex: "0 1 150px" }}>
                            <label style={{
                                display: "block", fontFamily: "'DM Sans',sans-serif", fontSize: 11,
                                color: C.muted, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em"
                            }}>Category</label>
                            <select value={addCat} onChange={e => setAddCat(e.target.value)} style={inputStyle}>
                                {["Art", "Music", "Craft", "Events"].map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <button onClick={addPhoto} disabled={!pendingUrl || !addLabel.trim() || addBusy}
                            style={{
                                background: (!pendingUrl || !addLabel.trim() || addBusy) ? C.muted : C.teal, color: C.white,
                                border: "none", borderRadius: 4, padding: "10px 20px", fontFamily: "'DM Sans',sans-serif",
                                fontWeight: 700, fontSize: 12, letterSpacing: "0.05em", textTransform: "uppercase",
                                cursor: (!pendingUrl || !addLabel.trim() || addBusy) ? "default" : "pointer"
                            }}>
                            {addBusy ? "Saving…" : "Add to Gallery"}
                        </button>
                    </div>
                    {pendingUrl && (
                        <div style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 10 }}>
                            <img src={pendingUrl} alt="preview" style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 6 }} />
                            <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: C.muted }}>Ready to add</span>
                        </div>
                    )}
                    {addError && <div style={{ color: C.pink, fontSize: 12, marginTop: 10, fontFamily: "'DM Sans',sans-serif" }}>{addError}</div>}

                    {realPhotos.length > 0 && (
                        <div style={{ marginTop: 28, paddingTop: 20, borderTop: `1px solid ${C.border}` }}>
                            <div style={{
                                fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontWeight: 700,
                                color: C.black, marginBottom: 14
                            }}>Your uploaded photos ({realPhotos.length})</div>
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(90px,1fr))", gap: 10 }}>
                                {realPhotos.map(p => (
                                    <div key={p.id} style={{ position: "relative" }}>
                                        <img src={p.dataUrl} alt={p.label} style={{ width: "100%", height: 80, objectFit: "cover", borderRadius: 6 }} />
                                        <button onClick={() => deletePhoto(p.id)} disabled={busyId === p.id}
                                            title="Delete photo"
                                            style={{
                                                position: "absolute", top: 4, right: 4, background: "rgba(0,0,0,0.65)", color: C.white,
                                                border: "none", borderRadius: "50%", width: 22, height: 22, cursor: "pointer", fontSize: 13,
                                                lineHeight: "22px", padding: 0
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

            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 36 }}>
                {cats.map(c => (
                    <button key={c} onClick={() => setCat(c)}
                        style={{
                            background: cat === c ? C.black : "none", color: cat === c ? C.white : C.muted,
                            border: `1px solid ${cat === c ? C.black : C.border}`, borderRadius: 4,
                            padding: "6px 16px", fontFamily: "'DM Sans',sans-serif", fontSize: 12,
                            fontWeight: 600, cursor: "pointer", letterSpacing: "0.04em", textTransform: "uppercase"
                        }}>
                        {c}
                    </button>
                ))}
            </div>

            {loading && (
                <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: C.muted, padding: "20px 0" }}>
                    Loading gallery…
                </div>
            )}
            {error && (
                <div style={{
                    fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: C.pink, padding: "12px 0",
                    display: "flex", alignItems: "center", gap: 12
                }}>
                    Couldn't load your uploaded photos.
                    <button onClick={onReload} style={{
                        background: "none", border: `1px solid ${C.pink}`, color: C.pink,
                        borderRadius: 4, padding: "4px 12px", cursor: "pointer", fontFamily: "'DM Sans',sans-serif", fontSize: 12
                    }}>
                        Retry
                    </button>
                </div>
            )}

            {!loading && (
                <div style={{ columns: "3 160px", gap: 12 }}>
                    {filtered.map(g => (
                        <div key={g.id} style={{ marginBottom: 12, breakInside: "avoid", transition: "transform 0.2s" }}
                            onMouseEnter={e => e.currentTarget.style.transform = "scale(1.03)"}
                            onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}>
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

// ─── PROGRAMS PAGE ───────────────────────────────────────────────
function ProgramsPage() {
    const [open, setOpen] = useState(null);
    return (
        <div style={{ maxWidth: 1080, margin: "0 auto", padding: "60px 5% 100px" }}>
            <div style={{ marginBottom: 52 }}>
                <div style={{
                    fontFamily: "'DM Sans',sans-serif", fontSize: 11, fontWeight: 700,
                    letterSpacing: "0.16em", color: C.pink, textTransform: "uppercase", marginBottom: 8
                }}>What We Offer</div>
                <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "clamp(28px,4vw,44px)", fontWeight: 300, color: C.black }}>
                    Programs
                </div>
                <p style={{
                    fontFamily: "'DM Sans',sans-serif", fontSize: 15, color: C.muted,
                    marginTop: 12, maxWidth: 480, lineHeight: 1.65
                }}>
                    Every program is designed to nurture creativity, build skills, and make learning joyful
                    for children aged 3–12.
                </p>
            </div>
            <div style={{ border: `1px solid ${C.border}`, borderRadius: 8, overflow: "hidden" }}>
                {PROGRAMS.map((p, i) => (
                    <div key={p.name}
                        style={{ borderBottom: i < PROGRAMS.length - 1 ? `1px solid ${C.border}` : "none" }}>
                        <button onClick={() => setOpen(open === i ? null : i)}
                            style={{
                                width: "100%", background: open === i ? C.off : C.white, border: "none",
                                cursor: "pointer", padding: "22px 28px", display: "flex",
                                alignItems: "center", gap: 16, textAlign: "left"
                            }}>
                            <span style={{ fontSize: 26 }}>{p.icon}</span>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 16, fontWeight: 600, color: C.black }}>
                                    {p.name}
                                </div>
                                <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: C.muted, marginTop: 2 }}>{p.age}</div>
                            </div>
                            <span style={{ color: p.color, fontSize: 22, fontWeight: 300, lineHeight: 1 }}>
                                {open === i ? "−" : "+"}
                            </span>
                        </button>
                        {open === i && (
                            <div style={{ padding: "4px 28px 28px 70px" }}>
                                <p style={{
                                    fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: "#555",
                                    lineHeight: 1.75, margin: "0 0 18px"
                                }}>{p.desc}</p>
                                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 22 }}>
                                    {p.list.map(item => (
                                        <span key={item}
                                            style={{
                                                background: p.color + "12", color: p.color,
                                                border: `1px solid ${p.color}30`, borderRadius: 4,
                                                padding: "4px 12px", fontFamily: "'DM Sans',sans-serif",
                                                fontSize: 12, fontWeight: 500
                                            }}>
                                            {item}
                                        </span>
                                    ))}
                                </div>
                                <WA text={`Ask about ${p.name}`} style={{ fontSize: 12, padding: "9px 18px" }} />
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

// ─── ABOUT PAGE ──────────────────────────────────────────────────
function AboutPage() {
    return (
        <div>
            <section style={{ padding: "80px 5% 60px", background: C.white, borderBottom: `1px solid ${C.border}` }}>
                <div style={{ maxWidth: 1080, margin: "0 auto", display: "flex", gap: 60, flexWrap: "wrap", alignItems: "center" }}>
                    <div style={{ flex: "1 1 360px" }}>
                        <div style={{
                            fontFamily: "'DM Sans',sans-serif", fontSize: 11, fontWeight: 700,
                            letterSpacing: "0.16em", color: C.pink, textTransform: "uppercase", marginBottom: 12
                        }}>Our Story</div>
                        <div style={{
                            fontFamily: "'DM Sans',sans-serif", fontSize: "clamp(26px,4vw,44px)",
                            fontWeight: 300, color: C.black, lineHeight: 1.15
                        }}>
                            Built on a belief that every child is a natural creator.
                        </div>
                    </div>
                    <div style={{ flex: "1 1 320px" }}>
                        <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 15, color: C.muted, lineHeight: 1.8, margin: 0 }}>
                            Nascere Studio was founded with one idea — that arts and music are not extras,
                            they are essentials. We use creativity as a tool for child development, building
                            confidence, focus, and joy in every session. From our studio in Aizawl to
                            classrooms across Mizoram, we've walked alongside hundreds of families.
                        </p>
                    </div>
                </div>
            </section>

            <section style={{ padding: "72px 5%", background: C.off }}>
                <div style={{ maxWidth: 1080, margin: "0 auto" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 16 }}>
                        {[
                            {
                                l: "Music", i: "🎵", c: C.purple,
                                t: "Sir Rotluanga leads our music program — keyboard, rhythm, and theory taught through joy and play for ages 3–12."
                            },
                            {
                                l: "Colors", i: "🎨", c: C.pink,
                                t: "Our art team guides children through painting, drawing, sculpture, and mixed media — every single week."
                            },
                            {
                                l: "Stories", i: "📖", c: C.yellow,
                                t: "We document classes, events, and milestones — on this website and Instagram — so every moment is remembered."
                            },
                            {
                                l: "Community", i: "🤝", c: C.teal,
                                t: "We visit schools, host parents, and run exhibitions. Nascere Studio belongs to all of Aizawl."
                            },
                        ].map(v => (
                            <div key={v.l}
                                style={{
                                    background: C.white, border: `1px solid ${C.border}`,
                                    borderRadius: 8, padding: "24px 20px", borderTop: `3px solid ${v.c}`
                                }}>
                                <div style={{ fontSize: 28, marginBottom: 10 }}>{v.i}</div>
                                <div style={{
                                    fontFamily: "'DM Sans',sans-serif", fontSize: 15, fontWeight: 700,
                                    color: C.black, marginBottom: 8
                                }}>{v.l}</div>
                                <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: C.muted, lineHeight: 1.7 }}>{v.t}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section style={{ padding: "72px 5%", background: C.white }}>
                <div style={{ maxWidth: 1080, margin: "0 auto", display: "flex", gap: 60, flexWrap: "wrap" }}>
                    <div style={{ flex: "1 1 280px" }}>
                        <div style={{
                            fontFamily: "'DM Sans',sans-serif", fontSize: 11, fontWeight: 700,
                            letterSpacing: "0.16em", color: C.pink, textTransform: "uppercase", marginBottom: 16
                        }}>Find Us</div>
                        <div style={{
                            fontFamily: "'DM Sans',sans-serif", fontSize: 17, fontWeight: 600,
                            color: C.black, marginBottom: 8
                        }}>Nascere Studio</div>
                        <p style={{
                            fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: C.muted,
                            lineHeight: 1.8, margin: "0 0 20px"
                        }}>
                            Ramthanmawia Building<br />
                            Next to KFC, Zarkawt Main Road<br />
                            Aizawl, Mizoram 796001
                        </p>
                        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                            <a href="tel:+916009208311"
                                style={{
                                    fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: C.black,
                                    textDecoration: "none", fontWeight: 500
                                }}>📞 +91 6009208311</a>
                            <a href="https://instagram.com/nascere_studio" target="_blank" rel="noreferrer"
                                style={{
                                    fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: C.black,
                                    textDecoration: "none", fontWeight: 500
                                }}>📸 @nascere_studio</a>
                            <a href="https://instagram.com/nascere_craft" target="_blank" rel="noreferrer"
                                style={{
                                    fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: C.black,
                                    textDecoration: "none", fontWeight: 500
                                }}>🛍️ @nascere_craft</a>
                        </div>
                    </div>
                    <div style={{ flex: "1 1 300px" }}>
                        <div style={{
                            fontFamily: "'DM Sans',sans-serif", fontSize: 11, fontWeight: 700,
                            letterSpacing: "0.16em", color: C.teal, textTransform: "uppercase", marginBottom: 16
                        }}>Get in Touch</div>
                        <p style={{
                            fontFamily: "'DM Sans',sans-serif", fontSize: 15, color: C.muted,
                            lineHeight: 1.75, marginBottom: 24
                        }}>
                            The quickest way to reach us is WhatsApp. Message us to enroll your child,
                            ask about programs, or arrange a school visit.
                        </p>
                        <WA text="Chat on WhatsApp" style={{ fontSize: 14, padding: "14px 28px" }} />
                        <div style={{ marginTop: 20, padding: 20, background: C.off, borderRadius: 8 }}>
                            <div style={{
                                fontFamily: "'DM Sans',sans-serif", fontSize: 12, fontWeight: 700,
                                color: C.black, marginBottom: 6
                            }}>Class Hours</div>
                            <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: C.muted, lineHeight: 1.8 }}>
                                Mon – Fri: 9:00 AM – 6:00 PM<br />
                                Saturday: 9:00 AM – 2:00 PM<br />
                                Sunday: Closed
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section style={{ padding: "60px 5%", background: C.black, textAlign: "center" }}>
                <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
                    <Daisy size={56} stroke={C.white} fill={C.black} />
                </div>
                <div style={{
                    fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: "#555",
                    letterSpacing: "0.16em", textTransform: "uppercase"
                }}>
                    nascere studio · music · colors · stories · aizawl, mizoram
                </div>
            </section>
        </div>
    );
}

// ─── FOOTER ──────────────────────────────────────────────────────
function Footer({ go }) {
    return (
        <footer style={{ background: C.off, padding: "32px 5%", borderTop: `1px solid ${C.border}` }}>
            <div style={{
                maxWidth: 1080, margin: "0 auto", display: "flex",
                justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16
            }}>
                <button onClick={() => go("home")}
                    style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                    <Logo size="sm" />
                </button>
                <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
                    {["Home", "Stories", "Gallery", "Programs", "About"].map(item => (
                        <button key={item} onClick={() => go(item.toLowerCase())}
                            style={{
                                background: "none", border: "none", cursor: "pointer",
                                fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: C.muted,
                                letterSpacing: "0.06em", textTransform: "uppercase"
                            }}>
                            {item}
                        </button>
                    ))}
                </div>
                <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: C.muted }}>
                    © 2026 Nascere Studio
                </div>
            </div>
        </footer>
    );
}

// ─── MAIN APP ────────────────────────────────────────────────────
export default function App() {
    const [page, setPage] = useState("home");
    const [story, setStory] = useState(null);

    const [realPhotos, setRealPhotos] = useState([]);
    const [galleryLoading, setGalleryLoading] = useState(true);
    const [galleryError, setGalleryError] = useState(null);

    async function loadPhotos() {
        setGalleryLoading(true);
        setGalleryError(null);
        try {
            const res = await window.storage.get("gallery:photos", true);
            setRealPhotos(res && res.value ? JSON.parse(res.value) : []);
        } catch (e) {
            // Missing key just means no photos uploaded yet — not an error state.
            setRealPhotos([]);
        } finally {
            setGalleryLoading(false);
        }
    }

    async function savePhotos(newList) {
        const result = await window.storage.set("gallery:photos", JSON.stringify(newList), true);
        if (!result) throw new Error("Storage write failed");
        setRealPhotos(newList);
    }

    useEffect(() => { loadPhotos(); }, []);

    const go = (p) => {
        setPage(p);
        if (p !== "stories") setStory(null);
        try { window.scrollTo(0, 0); } catch (e) { }
    };

    const openStory = (s) => {
        setStory(s);
        setPage("stories");
        try { window.scrollTo(0, 0); } catch (e) { }
    };

    return (
        <div style={{ fontFamily: "'DM Sans',sans-serif", background: C.white, color: C.black, minHeight: "100vh" }}>
            <link href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&display=swap" rel="stylesheet" />
            <Nav page={page} go={go} />
            <div style={{ paddingTop: 64 }}>
                {page === "home" && <Home go={go} openStory={openStory} realPhotos={realPhotos} />}
                {page === "stories" && <StoriesPage story={story} setStory={setStory} />}
                {page === "gallery" && <GalleryPage realPhotos={realPhotos} loading={galleryLoading}
                    error={galleryError} onSave={savePhotos} onReload={loadPhotos} />}
                {page === "programs" && <ProgramsPage />}
                {page === "about" && <AboutPage />}
            </div>
            <Footer go={go} />
        </div>
    );
}
