import { supabase, BUCKET, previewMode } from './client';
import { validateEntry } from './model';
import { seedEntries } from './seed';

const preview = () => import('./preview-store');
function check(error) {
  if (!error) return;
  if (error.code === '23505') throw new Error('That URL name is already used. Please choose another.');
  throw new Error(error.message || 'Something went wrong. Please try again.');
}
export async function hydrateImages(entries) {
  const paths = [...new Set(entries.map(e => e.image_path).filter(p => p && !p.startsWith('/assets/')))];
  const imageMap = {};
  if (paths.length && previewMode) {
    const store = await preview();
    await Promise.all(paths.map(async path => { imageMap[path] = await store.previewImage(path); }));
  } else if (paths.length && supabase) {
    const { data, error } = await supabase.storage.from(BUCKET).createSignedUrls(paths, 600);
    check(error);
    for (const item of data || []) if (item.signedUrl) imageMap[item.path] = item.signedUrl;
  }
  return entries.map(entry => ({ ...entry, imageUrl: entry.image_path?.startsWith('/assets/') ? entry.image_path : imageMap[entry.image_path] || '' }));
}
export async function listEntries(admin = false) {
  if (previewMode) return hydrateImages(await (await preview()).previewList(admin));
  if (!supabase) return [];
  const entries = [];
  const batchSize = 500;
  for (let offset = 0; ; offset += batchSize) {
    let query = supabase.from('studio_entries').select('*').order('sort_order').order('created_at', { ascending: false }).order('id').range(offset, offset + batchSize - 1);
    if (!admin) query = query.eq('status', 'published');
    const { data, error } = await query;
    check(error);
    entries.push(...(data || []));
    if (!data || data.length < batchSize) break;
  }
  return hydrateImages(entries);
}
export async function isEditor() {
  if (previewMode) return true;
  const { data, error } = await supabase.rpc('is_studio_editor');
  check(error);
  return data === true;
}
export async function saveEntry(entry) {
  const validation = validateEntry(entry);
  if (validation) throw new Error(validation);
  const payload = { kind: entry.kind, title: entry.title.trim(), slug: entry.slug, category: entry.category.trim(), summary: entry.summary.trim(), body: entry.body.trim(), image_path: entry.image_path || '', image_alt: entry.image_alt.trim(), status: entry.status, sort_order: Number(entry.sort_order), details: entry.details };
  if (previewMode) return (await preview()).previewSave({ ...payload, ...(entry.id ? { id: entry.id, created_at: entry.created_at, updated_at: entry.updated_at } : {}) });
  const query = entry.id
    ? supabase.from('studio_entries').update(payload).eq('id', entry.id).eq('updated_at', entry.updated_at)
    : supabase.from('studio_entries').insert(payload);
  const { data, error } = await query.select().maybeSingle();
  check(error);
  if (!data) throw new Error('This item changed in another session, or you no longer have access. Refresh the list and reopen it before saving.');
  return data;
}
export async function importExisting() {
  if (previewMode) return (await preview()).previewImport();
  const { error } = await supabase.from('studio_entries').upsert(seedEntries(), { onConflict: 'kind,slug', ignoreDuplicates: true });
  check(error);
}
export async function uploadImage(file) {
  if (previewMode) return (await preview()).previewUpload(file);
  const { data: { user }, error } = await supabase.auth.getUser();
  check(error);
  if (!user) throw new Error('Please sign in again before uploading.');
  const path = `${user.id}/${crypto.randomUUID()}.webp`;
  const { error: uploadError } = await supabase.storage.from(BUCKET).upload(path, file, { contentType: 'image/webp', upsert: false, cacheControl: '600' });
  check(uploadError);
  return path;
}
export function notifyContentChanged() {
  if (typeof BroadcastChannel !== 'undefined') {
    const channel = new BroadcastChannel('nascere-content');
    channel.postMessage('changed');
    channel.close();
  }
}
