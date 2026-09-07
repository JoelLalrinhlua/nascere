# Design QA — Nascere Studio

final result: passed

## Latest logo and hero refinement — 7 September 2026

- Source visual truth: `C:/Users/joelk/Downloads/Untitled design (9).png`, 240 × 240 pixels. The visible wordmark occupies the horizontal center of its white source canvas.
- Implementation evidence: `qa/refined-hero-desktop.png`, captured from `http://127.0.0.1:4174/` at a 1280 × 720 CSS viewport. The in-app capture is 1265 × 711 pixels because browser framing is excluded; comparison used the visible navigation and hero regions at their native proportions.
- State: homepage, initial load, desktop navigation, no hover or menu state.
- Full-view comparison: the supplied lowercase wordmark, including the pink illustrated “a”, is used directly in the navigation. Its geometry and colors are unchanged. The shorter 96px navigation bar gives the wide mark appropriate clear space and improves the hero’s first-screen balance.
- Focused comparison: the source and implementation were opened together. Letter shapes, spacing, pink “a” detail, black color and white surround remain faithful. The image is clipped only through its unused white canvas; the artwork itself is not cropped or redrawn.
- Typography: the existing DM Sans and Cormorant hierarchy remains legible and balanced; headline wrapping and button labels are unchanged.
- Spacing and layout: the hero grid now gives the illustration slightly more width, shortens the navigation, and aligns the text and scene centers more deliberately.
- Colors: the hero background is matched to the artwork’s sampled corner color `rgb(255, 251, 243)`. This removes the visible rectangular seam while preserving Nascere pink, yellow, teal and lavender.
- Image quality: both the supplied 240px logo and 1536 × 1024 hero artwork loaded successfully. The logo is displayed below its native size. No stretching, replacement typography or reconstructed logo geometry is used.
- Copy: all approved hero copy remains intact.
- Interaction and browser checks: navigation remained functional, no horizontal overflow was detected at 1280px, both image assets reported complete with correct natural dimensions, and the browser console was empty.
- Findings: no actionable P0, P1 or P2 mismatch remains. A real-device mobile capture is a residual test gap; the existing 650px responsive rules were retained and adjusted for the shorter logo lockup and taller blended illustration.
- Comparison history: the initial implementation used the previous full studio lockup and multiply-blended the hero artwork against a different cream. This created a visible image rectangle and excess header height. The source wordmark replaced that asset, the blend was removed, the canvas color was matched, and the hero/header proportions were rebalanced. The post-fix evidence is `qa/refined-hero-desktop.png`.

Final result for this refinement: passed.

## Design authority

The latest user request supersedes literal matching to the initial sage-green inspiration. The original Nascere identity is now primary: its supplied logo, pink/yellow/teal/purple palette, flower, and playful children's studio personality. The original inspiration informs spacing and presentation only.

Primary visual source: `C:/Users/joelk/AppData/Local/Temp/codex-clipboard-7a2af91b-a577-4a19-ae15-90df352c40a7.jpg` (150 × 150). Preserved locally in `public/assets/nascere-logo.jpg`.
Official sources inspected: https://www.nascere.in/ and https://www.instagram.com/nascere_studio/.

## Evidence

- `qa/brand-comparison.jpg`: supplied logo and original palette beside the redesigned desktop first screen. This is a brand comparison, not a claim of pixel-identical layout.
- `qa/hero-v2-desktop.png`: final production hero with the requested house, children, trees, dog and Nascere sunflower scene.
- `qa/toys-desktop.png`: final production Our Toys catalogue and category controls.
- `qa/brand-mobile.png`: production mobile first screen, 375 × 811 captured pixels at a 390 × 844 CSS viewport.
- `qa/brand-tablet.png`: production tablet, 753 × 1004 captured pixels at a 768 × 1024 CSS viewport.
- `qa/brand-footer.png`: production CTA and footer.

The in-app capture surface excludes scrollbar/platform framing and may resample screenshots. Comparisons assess the actual CSS viewport and browser DOM geometry; no findings are based on those capture-density differences. The comparison board scales the desktop capture proportionally to 1050 pixels wide, while retaining the supplied logo at its original size. Earlier sage-green screenshots in `qa/` are superseded and are not final acceptance evidence.

## Required visual surfaces

- Typography: DM Sans retains the original studio's friendly sans-serif foundation. Controlled serif italics add contrast to short headlines. Body sizes, line lengths and heading wraps were inspected at desktop, tablet and mobile widths. The supplied wordmark is displayed as an image, not retyped.
- Spacing: generous desktop margins, a contained hero image, clear navigation, four desktop program cards and two mobile columns. The mobile hero deliberately stacks copy and artwork. No horizontal overflow was observed at 390, 768 or 1440 CSS pixels.
- Color: original brand tokens are #E82060, #F5B700, #2EADA0 and #7C6FE0. Cream/white provides whitespace. Deeper pink and teal support readable controls and text. The sage landscape palette has been removed from the active visual direction.
- Images and symbols: supplied logo proportions are preserved; recurring small flowers use the actual source asset. The final hero follows the supplied right-side composition with the house, three children, trees and dog, recolored in Nascere’s palette; its sun is replaced by the Nascere sunflower. Journal images retain their source captions and aspect ratios. No broken images were found.
- Content: real studio name, ages 3–12, services, Aizawl address and WhatsApp number are retained. Journal labels are editorial titles linked to original posts. No testimonials, awards, clients or staff were invented.

## Interaction and production checks

- Mobile menu opens, marks the rest of the document inert, closes with Escape and restores focus to the menu button.
- Program navigation and program-detail content work.
- Journal detail routes load their own prerendered HTML. Both slashless and trailing-slash input URLs resolve correctly in the production preview.
- Journal Learning filter returns one entry; Art returns two.
- Contact form prevents blank submission and prepares a WhatsApp draft with the selected program. Verified the destination phone and the test draft text. No message was sent.
- The Our Toys filters correctly reduce the catalogue by Build, Discover, Music and Create. Each toy prepares a specific WhatsApp enquiry for price, details and current availability.
- Final production browser console: no errors, including no hydration errors.
- Production build passed. All 13 generated HTML pages have one H1 and individual metadata. Sitemap contains 13 URLs.
- CSS respects reduced-motion preferences. Animations use opacity/transform, with soft section entrances and small flower/card/button hover treatments.
- Final hero WebP is 47,146 bytes. Production JavaScript is approximately 65 KB gzip; CSS approximately 7 KB gzip. Core Web Vitals have not been measured in a deployed environment.

## Iteration history

1. Initial serif weight was too heavy for the first reference; corrected during the initial design pass.
2. Initial production preview returned homepage HTML for slashless detail URLs. Fixed through canonical directory links and preview redirects. Retested with production HTML and browser console: passed.
3. User elevated the original brand above the initial visual reference. Replaced the sage landscape, rebuilt the hero around the sunflower and creative materials, restored original brand colors and the supplied logo, and refined the program cards.
4. Tablet hero image was too wide and cropped. Reduced its width and adjusted headline sizing. Post-fix tablet evidence shows the complete main collage with no overlapping text.
5. Replaced the collage with a composition-matched house, children, trees and dog illustration in Nascere colors, using the sunflower as the focal symbol.
6. Added a six-item toy catalogue with availability language, developmental details, filters and item-specific WhatsApp enquiries. No prices or stock claims were invented.

## Remaining polish

The supplied logo is 150 pixels square. It is used at or below its native size; a future vector master could improve high-density rendering. No outstanding P0/P1/P2 findings in the tested flows. Other browsers, deployment configuration and real-device performance remain outside this local verification.
