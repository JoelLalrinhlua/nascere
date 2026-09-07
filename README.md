# Nascere Studio

A responsive, illustrated redesign for Nascere's arts, craft and music studio in Aizawl.

## Develop and build

- `npm install`
- `npm run dev -- --host 127.0.0.1 --port 4173`
- `npm run build`
- `npm run preview -- --host 127.0.0.1 --port 4174`

On this machine, use `C:\Program Files\nodejs\npm.cmd` if the default npm command points to a missing installation.

The build renders complete HTML for 13 routes, including the toy catalogue plus program and journal detail pages. It generates route-specific metadata, canonical URLs, Open Graph tags, robots.txt and sitemap.xml. Host the generated `dist` directory with directory-index support and trailing-slash redirects. Internal links and canonical URLs use trailing slashes. The local production preview redirects slashless page URLs to their directory forms, preventing homepage HTML from being served for a detail page. The canonical production domain is https://www.nascere.in/; update the metadata before deploying to another domain.

## Content and architecture

- `src/content.js`: programs, toy catalogue, editorial journal entries and source links.
- `src/components.jsx`: navigation, hero, sections, cards and footer.
- `src/pages.jsx`: toy catalogue, program details, journal details and contact.
- `src/App.jsx`: route selection and page-level behavior.
- `src/index.css`: base layout and responsive rules.
- `src/brand.css`: original brand colors, typography, flower treatments and responsive art direction.
- `build-pages.mjs` and `src/render.jsx`: static prerendering.

The contact form and toy catalogue prepare WhatsApp drafts for the verified studio number. They do not submit or store personal information locally. WhatsApp is the enquiry destination; no booking or payment system is implied. Class fees, toy prices, timings and availability are confirmed by the studio.

## Sources and art direction

Official sources inspected on 7 September 2026:
- https://www.nascere.in/ — studio identity, ages, offerings, address, telephone.
- https://www.instagram.com/nascere_studio/ — confirms arts and music, school visits, educational toys, official journal artwork.

Journal titles are editorial labels for the source images, not invented project names or events. Each detail page links to its original Instagram post. The original text within images is preserved.

The supplied horizontal Nascere wordmark is used directly in the navigation. The earlier studio lockup remains the source for recurring flower marks. The original pink (#E82060), yellow (#F5B700), teal (#2EADA0) and purple (#7C6FE0) lead the palette. Darker accessible accents support small text and buttons. The hero is an original generated interpretation of the supplied house-and-children composition, recolored for Nascere and using the studio sunflower in place of the sun; it does not depict the actual premises or student work. Journal images come from the official Instagram. No invented reviews, awards or staff profiles are presented. The initial sage-green direction was superseded by the user’s instruction to prioritize the original brand.

## Verification

See `design-qa.md` for responsive visual checks and interaction results. Browser screenshots are in `qa/`.
