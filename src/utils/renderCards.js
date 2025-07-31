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
  workshopsContainer.className = "bg-[var(--color-bg)] w-full flex flex-wrap gap-8 justify-center items-center py-8 ";

  const workshopsList = document.createElement("ul");
  workshopsList.className = "w-full flex flex-wrap items-stretch gap-8 justify-center items-center list-none p-0 m-0";

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