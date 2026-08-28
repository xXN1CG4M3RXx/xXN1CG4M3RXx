export const sanitizeUrl = (url) => {
  if (!url) return "#";
  try {
    const parsed = new URL(url, window.location.origin);
    if (['http:', 'https:', 'mailto:', 'tel:'].includes(parsed.protocol)) {
      return parsed.href;
    }
  } catch (e) {
    // If URL parsing fails, check if it's a relative path starting with /
    if (url.startsWith('/')) {
      return url;
    }
  }
  return "#";
};
