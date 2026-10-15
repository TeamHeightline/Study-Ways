import { FILE_URL } from '../../../settings';

// Older cards have an image at a stable storage key without a database relation.
export function cardImageUrl(id: number, path?: string | null, version = 0) {
  const image = path?.trim() || `cards-images/card/${id}`;
  const url = /^https?:\/\//i.test(image)
    ? image
    : `${FILE_URL.replace(/\/$/, '')}/${image.replace(/^\/+/, '')}`;
  if (!version) return url;
  const result = new URL(url);
  result.searchParams.set('v', String(version));
  return result.toString();
}
