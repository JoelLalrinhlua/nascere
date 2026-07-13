import { useEffect, useRef } from "react";
import gsap from "gsap";

/**
 * SplitText — GSAP-powered per-character/word/line text animation.
 * Triggered by IntersectionObserver so it fires when the text scrolls into view.
 *
 * Props mirror the React Bits API:
 *   text, className, delay, duration, ease, splitType,
 *   from, to, threshold, rootMargin, textAlign,
 *   onLetterAnimationComplete, showCallback, style
 */
export default function SplitText({
  text = "",
  className = "",
  delay = 50,
  duration = 1,
  ease = "power3.out",
  splitType = "chars",
  from = { opacity: 0, y: 40 },
  to = { opacity: 1, y: 0 },
  threshold = 0.1,
  rootMargin = "0px",
  textAlign = "left",
  onLetterAnimationComplete,
  showCallback = false,
  style = {},
}) {
  const containerRef = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || !text) return;

    // ── Build individual <span> units ────────────────────────────
    let units = [];

    if (splitType === "chars") {
      units = [...text].map((char) => {
        const s = document.createElement("span");
        s.style.display = "inline-block";
        s.style.whiteSpace = "pre";
        s.textContent = char;
        return s;
      });
    } else if (splitType === "words") {
      const words = text.split(" ");
      units = words.map((word, i) => {
        const s = document.createElement("span");
        s.style.display = "inline-block";
        s.textContent = i < words.length - 1 ? word + "\u00A0" : word;
        return s;
      });
    } else {
      // "lines" or anything else — treat entire text as one unit
      const s = document.createElement("span");
      s.style.display = "inline-block";
      s.textContent = text;
      units = [s];
    }

    // Stamp them into the DOM
    el.innerHTML = "";
    units.forEach((s) => el.appendChild(s));

    // Set GSAP starting state
    gsap.set(units, { ...from });

    // ── IntersectionObserver trigger ─────────────────────────────
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated.current) {
            hasAnimated.current = true;

            gsap.to(units, {
              ...to,
              duration,
              ease,
              stagger: delay / 1000, // convert ms → seconds
              onComplete() {
                if (showCallback && typeof onLetterAnimationComplete === "function") {
                  onLetterAnimationComplete();
                }
              },
            });

            observer.disconnect();
          }
        });
      },
      { threshold, rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
    // Re-run whenever text changes (page navigation)
  }, [text, splitType, delay, duration, ease]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ textAlign, lineHeight: "inherit", ...style }}
    />
  );
}
