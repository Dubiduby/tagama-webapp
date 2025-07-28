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
  // --- Paginación: contenedor global ---
const paginationContainer = document.createElement("div");
paginationContainer.className = "pagination-container";
  

 
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
  container.appendChild(paginationContainer); 

   

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

// --- Paginación ---
function getWorkshopsPerPage() {
  if (window.innerWidth < 600) {
    return 8; // Por ejemplo, 4 en móvil
  } else if (window.innerWidth < 1000) {
    return 10; // Por ejemplo, 8 en tablet
  } else {
    return 15; // 15 en escritorio
  }
}
let currentPage = 1;
let totalPages = 1;
// --- Fin paginación ---

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

    // Ordenar por:
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

    // --- Paginación ---
    const workshopsPerPage = getWorkshopsPerPage();
    totalPages = Math.ceil(filtered.length / workshopsPerPage);
    if (currentPage > totalPages) currentPage = totalPages || 1;
    const start = (currentPage - 1) * workshopsPerPage;
    const end = start + workshopsPerPage;
    const paginatedWorkshops = filtered.slice(start, end);
    // --- Fin paginación ---
    // Render the workshopContainer
    workshopsContainer.innerHTML = "";
    if (paginatedWorkshops.length === 0) {
      workshopsContainer.innerHTML = "There are no workshops matching the filters."
    } else {
      renderWorkshops(workshopsContainer, paginatedWorkshops, categories, subcategories);
    }

    // --- Paginación: renderizar controles ---
    renderPaginationControls();
    // --- Fin paginación ---

    resetButton.addEventListener("click", () => {
      searchInput.value = "";
      categoriesFilter.selectedIndex = 0;
      updateSubcategoriesOptions(); // <-- Esto es importante
      subcategoriesFilter.selectedIndex = 0;
      monthInput.value = "";
      orderSelect.selectedIndex = 0;
      spotsCheckbox.checked = false;
      currentPage = 1; // Reinicia la página
      filterAndRender();
    });
  }
  // --- Paginación: controles ---
  function renderPaginationControls() {
    paginationContainer.innerHTML = "";
    if (totalPages <= 1) return;
    // Botón anterior
    const prevBtn = document.createElement("button");
    prevBtn.textContent = "Anterior";
    prevBtn.disabled = currentPage === 1;
    prevBtn.onclick = () => {
      currentPage--;
      filterAndRender();
    };
    paginationContainer.appendChild(prevBtn);

    // Texto de página actual
    const pageInfo = document.createElement("span");
    pageInfo.textContent = `Página ${currentPage} de ${totalPages}`;
    pageInfo.style.margin = "0 12px";
    paginationContainer.appendChild(pageInfo);

    // Botón siguiente
    const nextBtn = document.createElement("button");
    nextBtn.textContent = "Siguiente";
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.onclick = () => {
      currentPage++;
      filterAndRender();
    };
    paginationContainer.appendChild(nextBtn);
  }
  // --- Fin paginación ---
  
  // Events in each filter
  // Cambia los listeners de filtros para reiniciar la página
  searchInput.addEventListener("input", () => {
    currentPage = 1;
    filterAndRender();
  });
  categoriesFilter.addEventListener("change", () => {
    updateSubcategoriesOptions();
    currentPage = 1;
    filterAndRender();
  });
  subcategoriesFilter.addEventListener("change", () => {
    currentPage = 1;
    filterAndRender();
  });
  monthInput.addEventListener("change", () => {
    currentPage = 1;
    filterAndRender();
  });
  orderSelect.addEventListener("change", () => {
    currentPage = 1;
    filterAndRender();
  });
  spotsCheckbox.addEventListener("change", () => {
    currentPage = 1;
    filterAndRender();
  });

  // Actualiza la paginación al cambiar el tamaño de la ventana
  window.addEventListener('resize', () => {
    currentPage = 1;
    filterAndRender();
  });
  
  filterAndRender();
}