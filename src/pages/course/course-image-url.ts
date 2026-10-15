import { FILE_URL } from '../../settings';

export function courseImageUrl(
  id: string | number,
  path?: string | null,
  version = 0,
) {
  const image = path?.trim() || `cards-course-images/course/${id}`;
  const url = /^https?:\/\//i.test(image)
    ? image
    : `${FILE_URL.replace(/\/$/, '')}/${image.replace(/^\/+/, '')}`;
  if (!version) return url;
  const result = new URL(url);
  result.searchParams.set('v', String(version));
  return result.toString();
}
