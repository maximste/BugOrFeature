export const MAX_TITLE_LENGTH = 200
export const MAX_BODY_LENGTH = 5000

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export const isUuid = (value: string): boolean => UUID_RE.test(value)

const escapeHtml = (text: string): string =>
  text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

// важен порядок: сначала обрезаем по длине, потом эскейпим — иначе можно разрезать посреди &entity;
export const sanitizeText = (
  value: unknown,
  maxLength: number
): string | null => {
  if (typeof value !== 'string') {
    return null
  }

  const trimmed = value.trim().slice(0, maxLength)

  if (!trimmed) {
    return null
  }

  return escapeHtml(trimmed)
}
