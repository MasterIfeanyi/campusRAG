
// Cleans and normalizes categories: lowercase, trimmed, deduplicated
export const normalizeCategories = (categories) => {
  let categoryList = [];

  if (Array.isArray(categories)) {
    categoryList = [...new Set(
      categories
        .filter((c) => typeof c === "string" && c.trim().length > 0)
        .map((c) => c.trim().toLowerCase())
    )];
  } else if (typeof categories === "string" && categories.trim().length > 0) {
    categoryList = [categories.trim().toLowerCase()];
  }

  return categoryList.length > 0 ? categoryList : ["general"];
}


