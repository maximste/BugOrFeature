export const sanitizeHelmet = (value: string, maxLength = 255): string => {
  return value
    .replace(
      /[\u0000-\u001F\u007F]/g /* eslint-disable-line no-control-regex */,
      ''
    ) // управляющие символы
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .trim()
    .slice(0, maxLength)
}
