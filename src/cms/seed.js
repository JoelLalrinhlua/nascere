import { works, toys } from '../content';
import { blankEntry, slugify } from './model';

// Used only by the explicit, non-destructive "Import existing content" action.
export function seedEntries() {
  return [
    ...works.map((w, index) => ({ ...blankEntry('post'), title: w.title, slug: w.slug, summary: w.caption, category: w.category, image_path: `/assets/${w.image}.jpg`, image_alt: w.title + ' — Nascere Studio', status: 'published', sort_order: index, details: { instagram: w.post } })),
    ...toys.map((t, index) => ({ ...blankEntry('toy'), title: t.name, slug: slugify(t.name), category: t.category, summary: t.description, status: 'published', sort_order: index, details: { age: t.age, price: '', benefits: t.develops, color: t.color } })),
  ];
}
