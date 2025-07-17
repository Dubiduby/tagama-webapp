// src/utils/render.js
import { workshopCards } from "../components/cards.js";
import {
    getCachedWorkshops,
    getCachedCategories,
    getCachedSubcategories,
  } from "../utils/cache.js";

export function renderWorkshops(container, workshops, categories, subcategories) {
container.innerHTML = "";
  const workshopsContainer = document.createElement("div");
  workshopsContainer.className = "workshops-container";

  const workshopsList = document.createElement("ul");
  workshopsList.className = "workshops-list";

  const workshopsFragment = document.createDocumentFragment();

  workshops.forEach((workshop) => {
    const subcategory = subcategories.find(
      (subcategory) => Number(subcategory.id) === Number(workshop.subcategoryId)
    );
    
    const category = categories.find(
      (category) => Number(category.id) === Number(workshop.categoryId) // Convertir a número para comparar y evitar problemas de tipado
    );
    
    //console.log("Workshop:", workshop);
//console.log("CategoryId buscado:", workshop.categoryId);
//console.log("Categoría encontrada:", category);
 
    workshopsFragment.appendChild(workshopCards(workshop, subcategory, category));
  });

  workshopsList.appendChild(workshopsFragment);
  workshopsContainer.appendChild(workshopsList);

  container.appendChild(workshopsContainer);
}