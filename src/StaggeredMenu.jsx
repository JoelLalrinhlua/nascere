import { useState, useEffect, useRef } from "react";
import gsap from "gsap";

/**
 * StaggeredMenu — Right-side panel navigation with GSAP stagger animations.
 * Styled to match Nascere Studio: dark #181818 panel, #E82060 pink accent,
 * #F5B700 yellow, DM Sans typeface. Slides in from the right.
 */
export default function StaggeredMenu({
  position = "right",
  items = [],
  socialItems = [],
  displaySocials = false,
  displayItemNumbering = false,
  menuButtonColor = "#181818",
  colors = ["#181818", "#1a0810"],
  accentColor = "#E82060",
  onMenuOpen = () => {},
  onMenuClose = () => {},
  onNavigate = null,
  activePage = "",
}) {
  const [isOpen, setIsOpen]   = useState(false);
  const [mounted, setMounted] = useState(false);

  const panelRef    = useRef(null);
  const backdropRef = useRef(null);
  const itemsRef    = useRef([]);
  const socialsRef  = useRef([]);
  const dividerRef  = useRef(null);
  const eyebrowRef  = useRef(null);
  const footerRef   = useRef(null);
  const isClosing   = useRef(false);

  const isRight = position !== "left";

  /* ── Open ─────────────────────────────────────────────────────── */
  const openMenu = () => {
    // Reset refs so stale entries don't bleed through
    itemsRef.current   = new Array(items.length).fill(null);
    socialsRef.current = new Array(socialItems.length).fill(null);
    setMounted(true);
    setIsOpen(true);
    onMenuOpen();
  };

  /* ── Close ────────────────────────────────────────────────────── */
  const closeMenu = () => {
    if (isClosing.current) return;
    isClosing.current = true;

    const visItems   = itemsRef.current.filter(Boolean);
    const visSocials = socialsRef.current.filter(Boolean);

    const tl = gsap.timeline({
      onComplete: () => {
        setIsOpen(false);
        setMounted(false);
        isClosing.current = false;
        onMenuClose();
      },
    });

    const allContent = [
      footerRef.current,
      ...visSocials.reverse(),
      ...visItems.slice().reverse(),
      dividerRef.current,
      eyebrowRef.current,
    ].filter(Boolean);

    tl.to(allContent, {
      x: 24, opacity: 0,
      duration: 0.16, stagger: 0.025, ease: "power2.in",
    });

    tl.to(panelRef.current, {
      clipPath: isRight ? "inset(0 0 0 100%)" : "inset(0 100% 0 0)",
      duration: 0.46, ease: "power4.inOut",
    }, "-=0.05");

    tl.to(backdropRef.current, {
      opacity: 0, duration: 0.28, ease: "power2.out",
    }, "<+0.08");
  };

  /* ── Animate in ───────────────────────────────────────────────── */
  useEffect(() => {
    if (!mounted || !panelRef.current) return;

    const panel    = panelRef.current;
    const backdrop = backdropRef.current;
    const visItems   = itemsRef.current.filter(Boolean);
    const visSocials = socialsRef.current.filter(Boolean);
    const extras = [eyebrowRef.current, dividerRef.current, footerRef.current].filter(Boolean);

    gsap.set(panel,   { clipPath: isRight ? "inset(0 0 0 100%)" : "inset(0 100% 0 0)" });
    gsap.set(backdrop, { opacity: 0 });
    gsap.set([...visItems, ...visSocials, ...extras], { x: 36, opacity: 0 });

    const tl = gsap.timeline();

    tl.to(panel, { clipPath: "inset(0 0% 0 0%)", duration: 0.56, ease: "power4.inOut" });
    tl.to(backdrop, { opacity: 1, duration: 0.36, ease: "power2.out" }, "<+0.04");
    tl.to(extras, { x: 0, opacity: 1, duration: 0.3, stagger: 0.055, ease: "power2.out" }, "-=0.22");
    tl.to(visItems, { x: 0, opacity: 1, duration: 0.44, stagger: 0.06, ease: "power3.out" }, "-=0.22");
    if (visSocials.length) {
      tl.to(visSocials, { x: 0, opacity: 1, duration: 0.3, stagger: 0.05, ease: "power2.out" }, "-=0.18");
    }
  }, [mounted]);

  /* ── ESC to close ─────────────────────────────────────────────── */
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape" && isOpen) closeMenu(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen]);

  /* ── Prevent body scroll ──────────────────────────────────────── */
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  return (
    <>
      {/* ── Hamburger button — hidden when panel is open ──────────── */}
      <button
        onClick={openMenu}
        aria-label="Open menu"
        aria-expanded={isOpen}
        style={{
          position: "relative",
          zIndex: 1200,
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: "10px 8px",
          display: isOpen ? "none" : "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 5,
          borderRadius: 8,
          transition: "background 0.2s ease",
        }}
        onMouseEnter={e => { e.currentTarget.style.background = "rgba(0,0,0,0.05)"; }}
        onMouseLeave={e => { e.currentTarget.style.background = "none"; }}
      >
        <span style={{
          display: "block", width: 24, height: 2,
          background: menuButtonColor, borderRadius: 2,
        }} />
        <span style={{
          display: "block", width: 16, height: 2,
          background: menuButtonColor, borderRadius: 2,
        }} />
        <span style={{
          display: "block", width: 24, height: 2,
          background: menuButtonColor, borderRadius: 2,
        }} />
      </button>

      {/* ── Backdrop ──────────────────────────────────────────────── */}
      {mounted && (
        <div
          ref={backdropRef}
          onClick={closeMenu}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1050,
            background: "rgba(18, 14, 22, 0.5)",
            backdropFilter: "blur(5px)",
            WebkitBackdropFilter: "blur(5px)",
            cursor: "pointer",
          }}
        />
      )}

      {/* ── Side panel ────────────────────────────────────────────── */}
      {mounted && (
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
          style={{
            position: "fixed",
            top: 0,
            [isRight ? "right" : "left"]: 0,
            width: "min(400px, 86vw)",
            height: "100dvh",
            zIndex: 1100,
            background: `linear-gradient(170deg, ${colors[0]} 0%, ${colors[1] || "#000"} 100%)`,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            boxShadow: isRight
              ? "-28px 0 72px rgba(0,0,0,0.32)"
              : "28px 0 72px rgba(0,0,0,0.32)",
          }}
        >
          {/* ── Panel header bar ──────────────────────────────────── */}
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 20px 0 28px",
            height: 60,
            flexShrink: 0,
            borderBottom: "1px solid rgba(255,255,255,0.07)",
          }}>
            {/* Brand mark */}
            <div style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 14,
              fontWeight: 700,
              color: "rgba(255,255,255,0.45)",
              letterSpacing: "0.01em",
            }}>
              n<span style={{ color: accentColor }}>a</span>scere
            </div>

            {/* Close button */}
            <button
              onClick={closeMenu}
              aria-label="Close menu"
              style={{
                background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 8,
                width: 34,
                height: 34,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: "rgba(255,255,255,0.6)",
                fontSize: 13,
                transition: "background 0.2s, color 0.2s, transform 0.25s ease, border-color 0.2s",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = accentColor;
                e.currentTarget.style.color = "#fff";
                e.currentTarget.style.borderColor = accentColor;
                e.currentTarget.style.transform = "rotate(90deg)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = "rgba(255,255,255,0.07)";
                e.currentTarget.style.color = "rgba(255,255,255,0.6)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
                e.currentTarget.style.transform = "rotate(0deg)";
              }}
            >
              ✕
            </button>
          </div>

          {/* ── Scrollable nav body ───────────────────────────────── */}
          <div style={{
            flex: 1,
            overflowY: "auto",
            padding: "28px 28px 0",
            display: "flex",
            flexDirection: "column",
          }}>
            {/* Eyebrow */}
            <div
              ref={eyebrowRef}
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.25)",
                marginBottom: 12,
              }}
            >
              Menu
            </div>

            {/* Accent divider */}
            <div
              ref={dividerRef}
              style={{
                width: 28,
                height: 2,
                background: accentColor,
                borderRadius: 2,
                marginBottom: 22,
              }}
            />

            {/* Nav items */}
            <nav aria-label="Primary navigation">
              {items.map((item, i) => {
                const isActive = item.link === activePage;
                return (
                  <div
                    key={item.label}
                    ref={el => { itemsRef.current[i] = el; }}
                  >
                    <button
                      aria-label={item.ariaLabel || item.label}
                      aria-current={isActive ? "page" : undefined}
                      onClick={() => {
                        if (onNavigate) onNavigate(item.link);
                        closeMenu();
                      }}
                      style={{
                        background: "none",
                        border: "none",
                        borderBottom: "1px solid rgba(255,255,255,0.05)",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: 14,
                        padding: "10px 0",
                        width: "100%",
                        transition: "transform 0.26s cubic-bezier(0.22,1,0.36,1)",
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.transform = "translateX(6px)";
                        const lbl = e.currentTarget.querySelector(".sm-lbl");
                        const num = e.currentTarget.querySelector(".sm-num");
                        if (lbl) lbl.style.color = "#ffffff";
                        if (num) num.style.color = accentColor;
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.transform = "translateX(0)";
                        const lbl = e.currentTarget.querySelector(".sm-lbl");
                        const num = e.currentTarget.querySelector(".sm-num");
                        if (lbl) lbl.style.color = isActive ? "#ffffff" : "rgba(255,255,255,0.45)";
                        if (num) num.style.color = "rgba(255,255,255,0.18)";
                      }}
                    >
                      {displayItemNumbering && (
                        <span
                          className="sm-num"
                          style={{
                            fontFamily: "'DM Sans', sans-serif",
                            fontSize: 10,
                            fontWeight: 600,
                            color: "rgba(255,255,255,0.18)",
                            minWidth: 20,
                            letterSpacing: "0.06em",
                            flexShrink: 0,
                            transition: "color 0.18s",
                          }}
                        >
                          {String(i + 1).padStart(2, "0")}
                        </span>
                      )}
                      <span
                        className="sm-lbl"
                        style={{
                          fontFamily: "'DM Sans', sans-serif",
                          fontSize: "clamp(22px, 2.8vw, 36px)",
                          fontWeight: 800,
                          letterSpacing: "-0.02em",
                          lineHeight: 1.2,
                          color: isActive ? "#ffffff" : "rgba(255,255,255,0.45)",
                          transition: "color 0.18s ease",
                          flex: 1,
                          textAlign: "left",
                        }}
                      >
                        {item.label}
                      </span>
                      {isActive ? (
                        <span style={{
                          width: 6, height: 6, borderRadius: "50%",
                          background: accentColor, flexShrink: 0,
                          boxShadow: `0 0 8px ${accentColor}99`,
                        }} />
                      ) : (
                        <span style={{
                          fontSize: 13,
                          color: "rgba(255,255,255,0.12)",
                          flexShrink: 0,
                          transition: "color 0.18s",
                        }}>→</span>
                      )}
                    </button>
                  </div>
                );
              })}
            </nav>

            {/* Socials */}
            {displaySocials && socialItems.length > 0 && (
              <div style={{
                display: "flex",
                gap: 18,
                alignItems: "center",
                flexWrap: "wrap",
                marginTop: 20,
              }}>
                <span style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 9,
                  fontWeight: 700,
                  color: "rgba(255,255,255,0.2)",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                }}>Follow</span>
                {socialItems.map((s, i) => (
                  <a
                    key={s.label}
                    href={s.link}
                    target="_blank"
                    rel="noreferrer"
                    ref={el => { socialsRef.current[i] = el; }}
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: 12,
                      fontWeight: 600,
                      color: "rgba(255,255,255,0.32)",
                      textDecoration: "none",
                      letterSpacing: "0.03em",
                      transition: "color 0.18s ease",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.color = "#fff"; }}
                    onMouseLeave={e => { e.currentTarget.style.color = "rgba(255,255,255,0.32)"; }}
                  >
                    {s.label}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* ── Panel footer ──────────────────────────────────────── */}
          <div
            ref={footerRef}
            style={{
              flexShrink: 0,
              padding: "16px 28px 24px",
              borderTop: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            <a
              href="https://wa.me/916009208311"
              target="_blank"
              rel="noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: accentColor,
                color: "#fff",
                textDecoration: "none",
                borderRadius: 8,
                padding: "10px 20px",
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 700,
                fontSize: 12,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                transition: "transform 0.2s ease, box-shadow 0.2s ease, background 0.2s",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = `0 8px 24px ${accentColor}55`;
                e.currentTarget.style.background = "#c91a52";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.background = accentColor;
              }}
            >
              💬 Enroll via WhatsApp
            </a>
          </div>

          {/* ── Side accent stripe ────────────────────────────────── */}
          <div style={{
            position: "absolute",
            top: 0,
            [isRight ? "left" : "right"]: 0,
            width: 2,
            height: "100%",
            background: `linear-gradient(to bottom, ${accentColor} 0%, transparent 55%)`,
            opacity: 0.6,
            pointerEvents: "none",
          }} />

          {/* ── Decorative daisy watermark ────────────────────────── */}
          <div style={{
            position: "absolute",
            bottom: "-8%",
            [isRight ? "left" : "right"]: "-10%",
            opacity: 0.035,
            pointerEvents: "none",
            transform: "rotate(12deg)",
          }}>
            <svg width={240} height={240} viewBox="0 0 200 200">
              {Array.from({ length: 12 }).map((_, idx) => {
                const deg = idx * 30, rad = deg * Math.PI / 180;
                const px  = 100 + 50 * Math.sin(rad);
                const py  = 100 - 50 * Math.cos(rad);
                return (
                  <ellipse key={idx} cx={px} cy={py} rx={8} ry={22}
                    fill="white" transform={`rotate(${deg},${px},${py})`} />
                );
              })}
              <circle cx={100} cy={100} r={28} fill="white" />
            </svg>
          </div>
        </div>
      )}
    </>
  );
}
