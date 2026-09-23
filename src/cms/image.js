import { MAX_IMAGE_BYTES } from './model';

export async function prepareImage(file) {
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) throw new Error('Choose a JPG, PNG or WebP photo.');
  if (file.size > MAX_IMAGE_BYTES) throw new Error('Please choose a photo smaller than 8 MB.');
  const bitmap = await createImageBitmap(file).catch(() => { throw new Error('This photo could not be read. Please choose another image.'); });
  try {
    if (bitmap.width * bitmap.height > 80000000) throw new Error('This photo is too large. Please resize it before uploading.');
    const scale = Math.min(1, 2000 / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext('2d').drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/webp', .86));
    if (!blob || blob.type !== 'image/webp') throw new Error('Your browser could not prepare this image. Please try a current browser.');
    return blob;
  } finally { bitmap.close(); }
}
