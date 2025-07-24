import "../assets/styles/home.css";
import { renderWorkshops } from "../utils/renderCards.js";
import {
  getCachedWorkshops,
  getCachedCategories,
  getCachedSubcategories,
} from "../utils/cache.js";
import dayjs from "dayjs";

export default async function home(container) {
  container.innerHTML= "";
  const workshops = await getCachedWorkshops();
  const categories = await getCachedCategories();
  const subcategories = await getCachedSubcategories();

 
  // Search
  const searchInput = document.createElement("input");
  searchInput.type = "text";
  searchInput.placeholder = "Search workshop...";
  searchInput.className = "search-input";
  container.appendChild(searchInput);

   // Botón para mostrar/ocultar filtros
   const filtersToggleBtn = document.createElement("button");
   filtersToggleBtn.textContent = "Filters";
   filtersToggleBtn.className = "filters-toggle-btn";
   container.appendChild(filtersToggleBtn);

   //Search an filters container
   const searchContainer= document.createElement("div");
   searchContainer.className= "search-container";
   searchContainer.appendChild(searchInput);
   searchContainer.appendChild(filtersToggleBtn);
   container.appendChild(searchContainer);

     // All filteers container
  const allFiltersContainer = document.createElement("div");
  allFiltersContainer.className= "all-filters-container";

  allFiltersContainer.appendChild(searchContainer);
  

 
   // Mostrar/ocultar filtros al hacer click
   filtersToggleBtn.addEventListener("click", () => {
     filterContainer.classList.toggle("hidden");
   });

  // Filtros
  const filterContainer = document.createElement("div");
  filterContainer.className = "filter-container";


  // Categoría
  const categoriesFilter = document.createElement("select");
  categoriesFilter.className = "category-filter";
  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "All categories";
  categoriesFilter.appendChild(defaultOption);

  categories.forEach(category => {
    const option = document.createElement("option");
    option.value = category.id;
    option.textContent = category.name;
    categoriesFilter.appendChild(option);
  });

  // Subcategoría
  const subcategoriesFilter = document.createElement("select");
  subcategoriesFilter.className = "subcategory-filter";
  const defaultSubcategoryOption = document.createElement("option");
  defaultSubcategoryOption.value = "";
  defaultSubcategoryOption.textContent = "All subcategories";
  subcategoriesFilter.appendChild(defaultSubcategoryOption);
  subcategories.forEach(subcategory => {
    const option = document.createElement("option");
    option.value = subcategory.id;
    option.textContent = subcategory.name;
    subcategoriesFilter.appendChild(option);
  });

  // Fecha por meses
  const monthInput = document.createElement("input");
  monthInput.type = "month";
  monthInput.className = "month-filter";

  // Ordenar por
  const orderSelect = document.createElement("select");
  orderSelect.className = "order-filter";
  [
    { value: "recent", text: "Upcoming" },
    { value: "oldest", text: "Farthest" },
    { value: "priceAsc", text: "Cheapest" },
    { value: "priceDesc", text: "Expensive" },
  ].forEach(opt => {
    const option = document.createElement("option");
    option.value = opt.value;
    option.textContent = opt.text;
    orderSelect.appendChild(option);
  });

  // Plazas disponibles
  const spotsCheckbox = document.createElement("input");
  spotsCheckbox.type = "checkbox";
  spotsCheckbox.className = "spots-filter";
  const spotsLabel = document.createElement("label");
  spotsLabel.textContent = "Only available spots";
  spotsLabel.appendChild(spotsCheckbox);

  const workshopsContainer = document.createElement("div");
  workshopsContainer.className = "workshops-list";

  // Botón para resetear filtros
const resetButton = document.createElement("button");
resetButton.textContent = "Clear";
resetButton.className = "reset-filters-btn";

  // Añadir filtros al contenedor
  //filterContainer.appendChild(searchInput);
  filterContainer.appendChild(categoriesFilter);
  filterContainer.appendChild(subcategoriesFilter);
  filterContainer.appendChild(monthInput);
  filterContainer.appendChild(orderSelect);
  filterContainer.appendChild(spotsLabel);
  filterContainer.appendChild(resetButton);
  allFiltersContainer.appendChild(filterContainer);
  container.appendChild(allFiltersContainer);
  container.appendChild(workshopsContainer);

   

 // Función para actualizar las subcategorías según la categoría seleccionada
 function updateSubcategoriesOptions() {
  // Limpia todas las opciones
  subcategoriesFilter.innerHTML = "";
  // Opción por defecto
  const defaultSubcategoryOption = document.createElement("option");
  defaultSubcategoryOption.value = "";
  defaultSubcategoryOption.textContent = "All subcategories";
  subcategoriesFilter.appendChild(defaultSubcategoryOption);

  // Si hay una categoría seleccionada, filtra las subcategorías
  const selectedCategoryId = categoriesFilter.value;
  const filteredSubcategories = selectedCategoryId
    ? subcategories.filter(sub => String(sub.categoryId) === String(selectedCategoryId))
    : subcategories;

  filteredSubcategories.forEach(subcategory => {
    const option = document.createElement("option");
    option.value = subcategory.id;
    option.textContent = subcategory.name;
    subcategoriesFilter.appendChild(option);
  });
  // Resetea el valor seleccionado
  subcategoriesFilter.value = "";
}

// Inicializa las subcategorías
updateSubcategoriesOptions();

  function filterAndRender() {
    let filtered = [...workshops];
    //Search Filter
    const searchValue = searchInput.value.toLowerCase();
    if (searchValue) {
      filtered = filtered.filter(workshops => workshops.title.toLowerCase().includes(searchValue));
    }
    // Categories Filter
    const categoriesValue = categoriesFilter.value;
    if (categoriesValue) {
      filtered = filtered.filter(workshops => workshops.categoryId === Number(categoriesValue));
    }
    // Subcategories Filter
    const subcategoriesValue = subcategoriesFilter.value;
    if (subcategoriesValue) {
      filtered = filtered.filter(workshops => workshops.subcategoryId === Number(subcategoriesValue));
    }
    // Date Filter
    const monthValue = monthInput.value; // "YYYY-MM" format
    if (monthValue) {
      filtered = filtered.filter(workshops => dayjs.unix(workshops.date).format("YYYY-MM") === monthValue);
    }
    // Spots Filter
    if (spotsCheckbox.checked) {
      filtered = filtered.filter(workshops => workshops.enrolled.length < workshops.capacity);
    }

    // Order for:
    const orderValue = orderSelect.value;
    if (orderValue === "recent") {
      filtered = filtered.sort((a, b) => dayjs.unix(a.date).diff(dayjs.unix(b.date)));
    } else if (orderValue === "oldest") {
      filtered = filtered.sort((a, b) => dayjs.unix(b.date).diff(dayjs.unix(a.date)));
    } else if (orderValue === "priceAsc") {
      filtered = filtered.sort((a, b) => a.price - b.price);
    } else if (orderValue === "priceDesc") {
      filtered = filtered.sort((a, b) => b.price - a.price);
    }
    // Render the workshopContainer
    workshopsContainer.innerHTML = "";
    if (filtered.length === 0) {
      workshopsContainer.innerHTML = "There are no workshops matching the filters."
    } else {
      renderWorkshops(workshopsContainer, filtered, categories, subcategories);
    }

    resetButton.addEventListener("click", () => {
      searchInput.value = "";
      categoriesFilter.selectedIndex = 0;
      updateSubcategoriesOptions(); // <-- Esto es importante
      subcategoriesFilter.selectedIndex = 0;
      monthInput.value = "";
      orderSelect.selectedIndex = 0;
      spotsCheckbox.checked = false;
      filterAndRender();
    });
  }

  // Events in each filter
  searchInput.addEventListener("input", filterAndRender);
  categoriesFilter.addEventListener("change", () => {
    updateSubcategoriesOptions();
    filterAndRender();
  });
  subcategoriesFilter.addEventListener("change", filterAndRender);
  monthInput.addEventListener("change", filterAndRender);
  orderSelect.addEventListener("change", filterAndRender);
  spotsCheckbox.addEventListener("change", filterAndRender);

  
  filterAndRender();
}
