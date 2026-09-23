# Studio desk verification — 23 September 2026

## Automated checks

- `npm test`: passes content validation and the real SQL migration against embedded PostgreSQL (PGlite).
- Policies tested: anonymous and non-editor accounts cannot write content, read drafts, read draft photos, self-grant editor status or remove referenced photos. Published entries and photos are readable. Archiving hides both; editors can restore items. Updates with a stale timestamp cannot overwrite later changes. Duplicate slugs and incomplete published entries are rejected.
- `npm run build`: passes, generating 16 entry pages. Dashboard JavaScript and CSS load separately from the public site.
- `verify-build.py`: passes H1, metadata, text, sitemap and admin indexing checks.
- `npm audit fix`: applied compatible build dependency patches; audit reported zero vulnerabilities.

## Browser checks

Using the explicit development preview at `http://127.0.0.1:4173`:

- Imported the existing three posts and six toys without adding invented live content.
- Created a post draft, checked it was absent from the public journal, published it from the content preview, and followed its link to verify the full two-paragraph story.
- Uploaded the existing hero illustration through the real file picker and browser image preparation flow. Published it as a clearly labelled preview memory. The gallery loaded the stored image after navigation/reload, with its caption and accessible description.
- Opened the enlarged memory viewer and dismissed it with Escape. Fixed a React Strict Mode cleanup issue found in this check.
- Created a toy with description, age, rupee price and two learning benefits. Verified its public card and the existing Nascere WhatsApp destination with the toy name encoded in the enquiry.
- Unpublished the toy and verified it disappeared publicly. Archived it using the in-page confirmation, filtered archived entries, then restored it as a draft.
- Verified responsive dashboard overview/editor and public Memories/navigation at 390 × 844 with no horizontal overflow or broken gallery images.
- Checked the production build at `http://127.0.0.1:4174/admin/`: without Supabase values it shows the connection screen, not the development editor, even though the local preview environment flag is enabled.

The demonstration records live only in this browser's IndexedDB. Test post is archived, test toy is a draft, and one clearly labelled illustration remains in the local memory album for previewing. These records are not part of the import seed or production deployment.

## Remaining live verification

A Supabase project has not been supplied. Email/password sign-in, real Storage uploads, session expiry and Vercel-to-Supabase connectivity must be checked after completing `ADMIN-SETUP.md`. The SQL tests exercise the access rules but do not replace that integration check. Nothing has been pushed or deployed by this task.
