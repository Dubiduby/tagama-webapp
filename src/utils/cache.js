import { getWorkshops } from "../api/apiWorkshops";
import { getCategories, getSubcategories } from "../api/apiCategories";

const CACHE_KEYS = {
  workshops: "cache_workshops",
  categories: "cache_categories",
  subcategories: "cache_subcategories",
};

//Workshops cache
export async function getCachedWorkshops() {
  const stored = localStorage.getItem(CACHE_KEYS.workshops);
  if (stored) {
    return JSON.parse(stored);
  }
  const workshops = await getWorkshops();
  if (workshops) {
    localStorage.setItem(CACHE_KEYS.workshops, JSON.stringify(workshops));
  }
  return workshops;
}
export function clearWorkshopsCache() {
  localStorage.removeItem(CACHE_KEYS.workshops);
}

// categories cache
export async function getCachedCategories() {
  const stored = localStorage.getItem(CACHE_KEYS.categories);
  if (stored) {
    return JSON.parse(stored);
  }
  const categories = await getCategories();
  if (categories) {
    localStorage.setItem(CACHE_KEYS.categories, JSON.stringify(categories));
  }
  return categories;
}
export function clearCategoriesCache() {
  localStorage.removeItem(CACHE_KEYS.categories);
}

// subcategories cache
export async function getCachedSubcategories() {
  const stored = localStorage.getItem(CACHE_KEYS.subcategories);
  if (stored) {
    return JSON.parse(stored);
  }
  const subcategories = await getSubcategories();
  if (subcategories) {
    localStorage.setItem(
      CACHE_KEYS.subcategories,
      JSON.stringify(subcategories)
    );
  }
  return subcategories;
}
export function clearSubcategoriesCache() {
  localStorage.removeItem(CACHE_KEYS.subcategories);
}

//clear all cache
export function clearCache() {
  clearWorkshopsCache();
  clearCategoriesCache();
  clearSubcategoriesCache();
}
