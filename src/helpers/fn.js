// Removes any HTML/script-like content from a string.
// Even though we're not rendering raw HTML anywhere yet, sanitizing
// early protects us if we ever display user text without escaping it.
export function stripHtml(text) {
  return text.replace(/<[^>]*>/g, "");
}

// Collapses multiple spaces/newlines into single spaces, trims edges.
export function normalizeWhitespace(text) {
  return text.replace(/\s+/g, " ").trim();
}

// Full text-cleaning pipeline for any free-text field (review body, question, etc.)
export function sanitizeText(text) {
  if (typeof text !== "string") return "";
  return normalizeWhitespace(stripHtml(text));
}

// Cleans, lowercases, trims, and deduplicates an array (or single string) of tags
export function normalizeCategories(categories) {
  let categoryList = [];

  if (Array.isArray(categories)) {
    categoryList = [...new Set(
      categories
        .filter((c) => typeof c === "string" && c.trim().length > 0)
        .map((c) => sanitizeText(c).toLowerCase())
    )];
  } else if (typeof categories === "string" && categories.trim().length > 0) {
    categoryList = [sanitizeText(categories).toLowerCase()];
  }

  return categoryList.length > 0 ? categoryList : ["general"];
}

// Checks a piece of text meets a minimum/maximum length after sanitizing.
// Returns { valid, cleaned, error }
export function validateTextLength(text, { min = 1, max = 5000, fieldName = "Text" } = {}) {
  const cleaned = sanitizeText(text);

  if (cleaned.length < min) {
    return { valid: false, cleaned, error: `${fieldName} must be at least ${min} characters.` };
  }
  if (cleaned.length > max) {
    return { valid: false, cleaned, error: `${fieldName} cannot exceed ${max} characters.` };
  }
  return { valid: true, cleaned, error: null };
}