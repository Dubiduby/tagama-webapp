const baseUrl = "https://6877717edba809d901ef5c45.mockapi.io/categories";

export async function getCategories() {
  const url = `${baseUrl}/categories`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    const workshops = await response.json();
    console.log(workshops);
    return workshops;
  } catch (error) {
    console.error("Error fetching categories", error);
    return null;
  }
}

export async function getSubcategories() {
  const url = `${baseUrl}/subcategories`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    const workshops = await response.json();
    console.log(workshops);
    return workshops;
  } catch (error) {
    console.error("Error fetching subcategories", error);
    return null;
  }
}
