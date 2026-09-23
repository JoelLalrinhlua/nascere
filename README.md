# Nascere Studio

A responsive, illustrated redesign for Nascere's arts, craft and music studio in Aizawl.

## Develop and build

- `npm install`
- `npm run dev -- --host 127.0.0.1 --port 4173`
- `npm run build`
- `npm run preview -- --host 127.0.0.1 --port 4174`

On this machine, use `C:\Program Files\nodejs\npm.cmd` if the default npm command points to a missing installation.

The build creates HTML entry files for 16 routes, including the admin dashboard, Memories gallery, toy catalogue and program/journal detail pages. With Supabase connected, managed content loads in the browser after the page shell; without it, the original journal and toys are prerendered. It generates route-specific metadata, canonical URLs, Open Graph tags, robots.txt and a 14-URL sitemap. Admin and the generic dynamic post entry are excluded from indexing. Host `dist` with directory-index support and trailing-slash redirects; `vercel.json` supplies the Vercel settings. The canonical domain is https://www.nascere.in/.

## Admin dashboard

Open `/admin/` to manage posts, toys and memory photos. Read [ADMIN-SETUP.md](ADMIN-SETUP.md) for the Supabase migration, editor account, Vercel environment values and local demonstration mode. A Supabase project must be connected before live editing works. Do not use a service-role or secret key in this frontend.

## Content and architecture

- `src/content.js`: programs, toy catalogue, editorial journal entries and source links.
- `src/components.jsx`: navigation, hero, sections, cards and footer.
- `src/pages.jsx`: toy catalogue, program details, journal details and contact.
- `src/App.jsx`: route selection and page-level behavior.
- `src/index.css`: base layout and responsive rules.
- `src/brand.css`: original brand colors, typography, flower treatments and responsive art direction.
- `src/continuous.css`: homepage-only continuous landscape, curved transitions, open program layouts and responsive image blending.
- `src/admin/`: editor login, dashboard, publishing forms and responsive dashboard styles.
- `src/cms/`: Supabase access, shared public content, validation, image preparation and development-only IndexedDB preview.
- `src/Memories.jsx`: public photo album and accessible enlarged-photo viewer.
- `supabase/migrations/`: content schema, editor allowlist and database/photo access policies.
- `tests/cms.test.mjs`: content validation and executable PostgreSQL policy checks (`npm test`).
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
