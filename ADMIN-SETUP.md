# Nascere Studio desk

The website stays on Vercel. Supabase stores the posts, toy descriptions and photos, and provides a private editor login. The dashboard is at `/admin/`. This repository contains the complete integration, but a Supabase project must be connected before live editing works.

## One-time connection

1. Create a project at [Supabase](https://supabase.com/dashboard). Keep its database password private; it is not needed in the website.
2. Open the project's **SQL Editor**. Paste the entire file [`supabase/migrations/202609230001_studio_cms.sql`](supabase/migrations/202609230001_studio_cms.sql) and run it once. It creates the content tables, editor permissions and a private photo bucket. This migration expects a fresh project without these tables.
3. In **Authentication → Providers / Sign In**, keep email/password sign-in enabled and disable new user sign-ups. This site does not offer public registration.
4. In **Authentication → Users → Add user → Create new user**, create your editor with an email and a strong password, and confirm the email in the dashboard. Copy that user's UUID. Do not use an invitation link: this first version uses email/password login, without an invitation or password-recovery screen.
5. In SQL Editor, grant that account access, replacing the placeholder with its UUID:

   ```sql
   insert into public.studio_editors (user_id)
   values ('YOUR-USER-UUID-HERE');
   ```

   Only accounts explicitly listed here can edit. To revoke one, delete its row from `studio_editors`. If a password is lost, reset it through your Supabase administrator account; do not send passwords through chat or commit them.
6. From the project's **Connect / API settings**, copy the project URL and **publishable key** (the legacy public `anon` key also works). Never use a secret key, `service_role` key or database password in the frontend.
7. In your Vercel project's **Settings → Environment Variables**, add:

   | Name | Value |
   | --- | --- |
   | `VITE_SUPABASE_URL` | Your `https://…supabase.co` project URL |
   | `VITE_SUPABASE_PUBLISHABLE_KEY` | Your public publishable key |

   Enable these for the intended deployment environment. Use a separate Supabase project for Vercel previews if you want to experiment without changing live content. Leave `VITE_CMS_PREVIEW` unset on Vercel.
8. Deploy the updated code on Vercel, then **redeploy after adding or changing environment values**. Vite reads them at build time. The existing build command (`npm run build`) and output directory (`dist`) remain unchanged.
9. Open `https://www.nascere.in/admin/`, sign in and click **Import existing content**. This brings over the existing three journal posts and six toys. Repeating the import adds only missing entries; it preserves edits, drafts and archived items with the same URL name. Renaming an imported item's URL name makes it a different item, so a later import can bring its original version back.
10. Publish a test item, check its public page in a signed-out browser, then archive it. Verify photo uploads and editing before sharing access with anyone else.

Once cloud content is enabled, public pages show published database entries only. Until the first import, the Journal and Our Toys pages will be empty. Unconfigured deployments continue showing the original website content, and `/admin/` shows connection instructions.

## Everyday editing

- **Posts:** title, category, short description, full story, optional Instagram post code and cover photo. Published posts appear in the Studio journal and on the homepage. New posts use shareable links such as `/journal/post/?slug=your-story`.
- **Toys:** name, category, description, age guidance, optional rupee price, learning benefits, card color and photo. Every published toy includes the existing Nascere WhatsApp enquiry link with the toy's name.
- **Memories:** photo, title, caption, category and accessible photo description. Published photos appear at `/memories/`, with category filters and an enlarged image viewer.
- **Save draft** keeps an item private. **Publish** makes it visible. **Unpublish to draft** removes it from the website. **Archive** removes it while retaining it in the dashboard; use the Archived filter, open the item and publish it to restore it.
- Smaller **Display order** values appear first. Items with the same order show newest first.
- Upload JPEG, PNG or WebP files up to 8 MB. The browser resizes them to at most 2,000 pixels on the longest edge and converts them to WebP. Describe each photo for screen readers, and confirm permission before sharing pictures of children.
- Saving updates the database immediately. Open public tabs refresh on focus and every four minutes; reload for an immediate check. No Vercel rebuild is needed for content edits.
- If another editor saves the same item first, your save is rejected rather than overwriting their work. Copy your unsaved text, return to the list, refresh and reopen the item.

## Privacy, backups and scope

Permissions are enforced by database row-level security and Storage policies, not just the login screen. Visitors can read published entries and their photos; signed-in users without editor access cannot edit or see drafts. Uploaded files live in the private `studio-media` bucket. Temporary photo links last ten minutes, so a link obtained while a photo was published may still work briefly after unpublishing. Previously downloaded copies cannot be recalled.

Replacing a photo or abandoning an upload leaves the old file private in Storage. The dashboard deliberately does not permanently delete items or files. Review unused uploads in Supabase before removing them. Back up both database content and Storage files using the options available for your Supabase project; database backups alone do not include image files.

This dashboard manages posts, toys and memories. General page copy, navigation, branding, programmes and the WhatsApp number are still maintained in the website code. It does not process payments or orders. Newly created posts are rendered from the database in the browser; their generic entry page is excluded from search indexing. Server-rendered metadata for individual new posts would require a separate rendering change if search discovery becomes a priority.

Reference: [Supabase row-level security](https://supabase.com/docs/guides/database/postgres/row-level-security) and [Storage access control](https://supabase.com/docs/guides/storage/security/access-control).

## Local development and preview

For a **real backend**, copy `.env.example` to `.env.local`, fill in the two public Supabase values, and set `VITE_CMS_PREVIEW=false`. Run `npm install` and `npm run dev`. Use a dedicated development project if edits must not reach the live site.

For a **local demonstration without Supabase**, put `VITE_CMS_PREVIEW=true` in `.env.local` and run `npm run dev -- --port 4173`. Open `http://localhost:4173/admin/` and import the existing content. The banner clearly identifies this mode: entries and images are stored only in this browser's IndexedDB, for this origin. They do not sync to Vercel, Supabase or other browsers. Clearing site data deletes the demonstration content.

Preview mode only works in Vite development. A production build never enables the unauthenticated preview dashboard, even if this variable is accidentally set. `.env.local` is ignored by Git.

Verification commands:

```sh
npm test
npm run build
python verify-build.py
```

The database tests run the migration against an embedded PostgreSQL engine with Supabase's auth/storage schemas stubbed locally. They exercise the actual SQL policies; a live sign-in and Storage API check must still be done after connecting your project.
