import { createServer } from "vite";
import { mkdir, readFile, writeFile } from "node:fs/promises";
const pages = {
  "/admin": ["Studio desk", "Manage Nascere Studio posts, toys and memories."],
  "/memories": ["Memories", "A photo album of colorful days, curious minds and creative moments at Nascere Studio."],
  "/journal/post": ["Studio story", "Stories and creative discoveries from Nascere Studio."],
  "/": [
    "Little minds. Big possibilities.",
    "Arts, craft and music for children aged 3–12 at Nascere Studio in Aizawl, Mizoram.",
  ],
  "/studio": [
    "Our studio",
    "Meet Nascere, a children's learn and craft studio in Aizawl. Growing young minds through music, colors and stories.",
  ],
  "/programs": [
    "Programs",
    "Explore arts and craft, music, school visits and educational toys at Nascere Studio.",
  ],
  "/toys": [
    "Our toys",
    "Explore educational toys, creative sets and wooden blocks from Nascere Studio, with easy WhatsApp enquiries.",
  ],
  "/contact": [
    "Get in touch",
    "Enquire about classes at Nascere Studio. Find us on Zarkawt Main Road, Aizawl, or contact us on WhatsApp.",
  ],
  "/journal": [
    "Studio journal",
    "Art, ideas and everyday learning from Nascere Studio's official journal.",
  ],
  "/programs/arts-craft": [
    "Arts & craft",
    "Painting, drawing, collage and sculpture for young creative minds at Nascere Studio.",
  ],
  "/programs/music": [
    "Music",
    "Keyboard, rhythm and music for young learners at Nascere Studio in Aizawl.",
  ],
  "/programs/school-visits": [
    "School visits",
    "Teaching support and arts and music school visits with Nascere Studio.",
  ],
  "/programs/educational-toys": [
    "Learning through play",
    "Explore educational toys and wooden blocks at Nascere Studio.",
  ],
  "/journal/ideas-on-paper": [
    "Ideas, on paper",
    "Drawing, collage and children's creative ideas from Nascere Studio.",
  ],
  "/journal/time-and-imagination": [
    "Time & imagination",
    "A hand-drawn watch and thoughts on childhood learning from Nascere Studio.",
  ],
  "/journal/a-world-of-stories": [
    "A world of stories",
    "Books, art and reflections on a child's early reading journey from Nascere Studio.",
  ],
};
const server = await createServer({
  mode: 'production',
  server: { middlewareMode: true },
  appType: "custom",
});
const { render } = await server.ssrLoadModule("/src/render.jsx");
const source = await readFile("dist/index.html", "utf8");
const escape = (s) => s.replaceAll("&", "&amp;").replaceAll('"', "&quot;");
for (const [route, [title, description]] of Object.entries(pages)) {
  const canonical =
    "https://www.nascere.in" + (route === "/" ? "/" : route + "/");
  let html = source
    .replace(
      /<title>.*?<\/title>/,
      `<title>${escape(title)} | Nascere Studio</title>`,
    )
    .replace(
      /(<meta\s+name="description"\s+content=")[^"]*/,
      `$1${escape(description)}`,
    )
    .replace(
      /(<meta\s+property="og:title"\s+content=")[^"]*/,
      `$1${escape(title)} | Nascere Studio`,
    )
    .replace(
      /(<meta\s+property="og:description"\s+content=")[^"]*/,
      `$1${escape(description)}`,
    )
    .replace(/(<meta\s+property="og:url"\s+content=")[^"]*/, `$1${canonical}`)
    .replace(/(<link rel="canonical" href=")[^"]*/, `$1${canonical}`);
  if (route === '/admin' || route === '/journal/post') html = html.replace('</head>', '<meta name="robots" content="noindex, nofollow" /></head>');
  const dir = "dist" + (route === "/" ? "" : route);
  await mkdir(dir, { recursive: true });
  await writeFile(
    dir + "/index.html",
    html.replace(
      '<div id="root"></div>',
      '<div id="root">' + render(route) + "</div>",
    ),
  );
}
await writeFile(
  "dist/robots.txt",
  "User-agent: *\nAllow: /\nDisallow: /admin/\nSitemap: https://www.nascere.in/sitemap.xml\n",
);
await writeFile(
  "dist/sitemap.xml",
  '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' +
    Object.keys(pages)
      .filter(p => p !== '/admin' && p !== '/journal/post')
      .map(
        (p) =>
          "<url><loc>https://www.nascere.in" +
          (p === "/" ? "/" : p + "/") +
          "</loc></url>",
      )
      .join("") +
    "</urlset>",
);
console.log(
  "Generated metadata and static entry files for " +
    Object.keys(pages).length +
    " routes.",
);

await server.close();
