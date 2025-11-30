export const slugify = (value = '') =>
  value
    .toString()
    .trim()
    .toLowerCase()
    // replace spaces and punctuation with hyphens; keep CJK and word characters
    .replace(/[\s/\\:,.;!?()[\]{}"'<>&#]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')

export default slugify
