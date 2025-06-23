export const isValidUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === "http:" || urlObj.protocol === "https:";
  } catch (error) {
    return false;
  }
};

export const isValidSlug = (slug: string): boolean => {
  const slugRegex = /^[a-zA-Z0-9-_]+$/;
  return slugRegex.test(slug) && slug.length >= 3 && slug.length <= 50;
};

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const sanitizeSlug = (slug: string): string => {
  return slug.toLowerCase().replace(/[^a-z0-9-_]/g, "");
};
