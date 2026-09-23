import { publicEntries } from './model';
import { seedEntries } from './seed';

const DB_NAME = 'nascere-cms-preview-v1';
let database;
function db() {
  if (!database) database = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      request.result.createObjectStore('entries', { keyPath: 'id' });
      request.result.createObjectStore('images');
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
  return database;
}
async function run(store, mode, action) {
  const connection = await db();
  return new Promise((resolve, reject) => {
    const transaction = connection.transaction(store, mode);
    const request = action(transaction.objectStore(store));
    transaction.oncomplete = () => resolve(request.result);
    transaction.onerror = () => reject(transaction.error);
    transaction.onabort = () => reject(transaction.error || new Error('Could not save the preview.'));
  });
}
export async function previewList(admin = false) {
  const entries = await run('entries', 'readonly', store => store.getAll());
  return admin ? entries : publicEntries(entries);
}
export async function previewSave(entry) {
  const entries = await previewList(true);
  const current = entries.find(item => item.id === entry.id);
  if (current && current.updated_at !== entry.updated_at) throw new Error('This item changed in another tab. Reopen it before saving.');
  if (entries.some(item => item.kind === entry.kind && item.slug === entry.slug && item.id !== entry.id)) throw new Error('That URL name is already used. Please choose another.');
  const now = new Date().toISOString();
  const saved = { ...entry, id: entry.id || crypto.randomUUID(), created_at: entry.created_at || now, updated_at: now };
  delete saved.imageUrl;
  await run('entries', 'readwrite', store => store.put(saved));
  return saved;
}
export async function previewImport() {
  const existing = await previewList(true);
  for (const item of seedEntries()) {
    if (!existing.some(e => e.kind === item.kind && e.slug === item.slug)) await previewSave(item);
  }
}
export async function previewUpload(file) {
  const path = 'preview/' + crypto.randomUUID() + '.webp';
  const dataUrl = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
  await run('images', 'readwrite', store => store.put(dataUrl, path));
  return path;
}
export async function previewImage(path) {
  return run('images', 'readonly', store => store.get(path));
}
