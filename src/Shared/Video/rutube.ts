export function parseRutubeUrl(
  value: string | null | undefined,
): { id: string; embedUrl: string } | null {
  if (!value?.trim()) return null;
  try {
    const url = new URL(value.trim());
    if (
      !['http:', 'https:'].includes(url.protocol) ||
      !['rutube.ru', 'www.rutube.ru'].includes(url.hostname) ||
      url.username ||
      url.password ||
      url.port
    )
      return null;
    const match = url.pathname.match(
      /^\/(?:video\/(?:private\/)?|shorts\/|play\/embed\/)([a-f\d]{32}|\d+)\/?$/i,
    );
    if (!match) return null;
    const embed = new URL(`https://rutube.ru/play/embed/${match[1]}/`);
    const access = url.searchParams.get('p');
    const start = url.searchParams.get('t');
    if (access) embed.searchParams.set('p', access);
    if (start && /^\d+$/.test(start)) embed.searchParams.set('t', start);
    return { id: match[1], embedUrl: embed.href };
  } catch {
    return null;
  }
}
