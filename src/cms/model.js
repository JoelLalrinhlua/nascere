export const KINDS = { post: 'Posts', toy: 'Toys', memory: 'Memories' };
export const STATUSES = ['draft', 'published', 'archived'];
export const COLORS = ['pink', 'yellow', 'teal', 'purple'];
export const MAX_IMAGE_BYTES = 8 * 1024 * 1024;

export function slugify(value) {
  return value.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 100).replace(/-$/, '');
}

export function blankEntry(kind) {
  return { kind, title: '', slug: '', category: kind === 'post' ? 'Studio life' : kind === 'toy' ? 'Build' : 'At the studio', summary: '', body: '', image_path: '', image_alt: '', status: 'draft', sort_order: 0, details: { age: '', price: '', benefits: [], color: 'pink', instagram: '' } };
}

export function validateEntry(entry) {
  if (!Object.hasOwn(KINDS, entry.kind)) return 'Choose a valid content type.';
  if (!entry.title.trim()) return 'Add a title before saving.';
  if (entry.title.length > 160) return 'Keep the title under 160 characters.';
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(entry.slug) || entry.slug.length > 100) return 'Use a URL name with lowercase letters, numbers and single hyphens.';
  if (!STATUSES.includes(entry.status)) return 'Choose a valid publication status.';
  if (!entry.category.trim() || entry.category.length > 100) return 'Add a category of up to 100 characters.';
  if (entry.image_alt.length > 500) return 'Keep the photo description under 500 characters.';
  if (entry.details?.instagram && !/^[A-Za-z0-9_-]{1,80}$/.test(entry.details.instagram)) return 'Use only the short code from the Instagram post link.';
  if (entry.summary.length > 1200 || entry.body.length > 40000) return 'The description or post is too long.';
  if (!Number.isInteger(Number(entry.sort_order)) || Number(entry.sort_order) < 0 || Number(entry.sort_order) > 9999) return 'Display order must be a whole number between 0 and 9999.';
  if (entry.image_path && !entry.image_alt.trim()) return 'Describe the image for visitors using screen readers.';
  if (entry.status === 'published') {
    if (entry.kind === 'memory' && !entry.image_path) return 'Upload a photo before publishing a memory.';
    if (entry.kind !== 'memory' && !entry.summary.trim()) return 'Add a description before publishing.';
  }
  const price = entry.details?.price;
  if (price !== '' && price != null && (!/^[0-9]{1,8}(\.[0-9]{1,2})?$/.test(String(price)) || Number(price) > 10000000)) return 'Enter a price with at most two decimal places, or leave it empty for price enquiries.';
  return '';
}

export function postFromEntry(entry) {
  return { slug: entry.slug, title: entry.title, category: entry.category, imageUrl: entry.imageUrl || '', imageAlt: entry.image_alt, caption: entry.summary, body: entry.body, post: entry.details?.instagram || '', managed: true };
}
export function toyFromEntry(entry) {
  return { id: entry.id, name: entry.title, category: entry.category, imageUrl: entry.imageUrl || '', imageAlt: entry.image_alt, age: entry.details?.age || '', price: entry.details?.price ?? '', description: entry.summary, develops: entry.details?.benefits || [], color: COLORS.includes(entry.details?.color) ? entry.details.color : 'pink' };
}

export function publicEntries(entries) {
  return entries.filter(entry => entry.status === 'published').sort((a,b) => a.sort_order - b.sort_order || b.created_at.localeCompare(a.created_at));
}
