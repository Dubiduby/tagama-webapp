import { renderWorkshops } from "../utils/renderCards.js";
import {
  getCachedWorkshops,
  getCachedCategories,
  getCachedSubcategories,
} from "../utils/cache.js";
import dayjs from "dayjs";

export default async function home(container) {
  container.innerHTML = "";
  const workshops = await getCachedWorkshops();
  const categories = await getCachedCategories();
  const subcategories = await getCachedSubcategories();
  const app = document.getElementById("app");
  app.className = "bg-[var(--color-bg)] ";
  // Search
  const searchInput = document.createElement("input");
  searchInput.type = "text";
  searchInput.placeholder = "Buscar taller...";
  searchInput.className = "flex-1 min-w-0 max-w-[400px] p-2 text-base rounded border border-gray-200 bg-white focus:border-light-orange focus:outline-none";

  // Botón para mostrar/ocultar filtros
  const filtersToggleBtn = document.createElement("button");
  filtersToggleBtn.textContent = "Filtros";
  filtersToggleBtn.className = "block px-3 py-1 bg-[var(--color-text)] text-[#fafafa] border-none rounded-lg text-lg font-semibold cursor-pointer transition-colors duration-200 ml-2 whitespace-nowrap hover:bg-[#5f6155] dark:text-dark-bg dark:hover:bg-[#d8c3a9]";

  // Search and filters container
  const searchContainer = document.createElement("div");
  searchContainer.className = "bg-[var(--color-bg)] w-full flex flex-row items-center gap-3 mb-3 max-w-[1100px] md:max-w-[900px] lg:max-w-[1100px] justify-center";
  searchContainer.appendChild(searchInput);
  searchContainer.appendChild(filtersToggleBtn);

  // All filters container
  const allFiltersContainer = document.createElement("div");
  allFiltersContainer.className = "bg-[var(--color-bg)] w-full pt-32 max-w-[1100px] mx-auto mb-8 flex flex-col items-center md:max-w-[900px] lg:max-w-[1100px]";
  allFiltersContainer.appendChild(searchContainer);

  // Filtros
  const filterContainer = document.createElement("div");
  filterContainer.className = "w-full flex flex-row justify-center gap-16 flex-wrap gap-3 items-center bg-white p-4 rounded-xl mb-6  max-w-[1100px] md:max-w-[900px] lg:max-w-[1100px] md:gap-4 md:p-6 lg:gap-6 lg:p-8 lg:rounded-2xl hidden dark:bg-dark-bg";

  // Mostrar/ocultar filtros al hacer click
  filtersToggleBtn.addEventListener("click", () => {
    filterContainer.classList.toggle("hidden");
  });

  // Categoría
  const categoriesFilter = document.createElement("select");
  categoriesFilter.className = "min-w-[160px] max-w-[220px] flex-1 text-base p-2 border border-gray-200 rounded bg-[var(--color-bg)]  transition-colors duration-200 w-full text-black focus:border-[#a78bfa] focus:outline-none  dark:text-white dark:border-opacity-20 ";
  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "Todas las categorías";
  categoriesFilter.appendChild(defaultOption);

  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category.id;
    option.textContent = category.name;
    categoriesFilter.appendChild(option);
  });

  // Subcategoría
  const subcategoriesFilter = document.createElement("select");
  subcategoriesFilter.className = "min-w-[160px] max-w-[220px] flex-1 text-base p-2 border border-gray-200 bg-[var(--color-bg)] rounded  transition-colors duration-200 w-full text-black focus:border-[#a78bfa] focus:outline-none dark:text-white dark:border-opacity-20";
  const defaultSubcategoryOption = document.createElement("option");
  defaultSubcategoryOption.value = "";
  defaultSubcategoryOption.textContent = "Todas las subcategorías";
  subcategoriesFilter.appendChild(defaultSubcategoryOption);
  subcategories.forEach((subcategory) => {
    const option = document.createElement("option");
    option.value = subcategory.id;
    option.textContent = subcategory.name;
    subcategoriesFilter.appendChild(option);
  });

  // Fecha por meses
  const monthInput = document.createElement("input");
  monthInput.type = "month";
  monthInput.className = "min-w-[160px] max-w-[220px] flex-1 text-base p-2 border border-gray-200 rounded bg-[var(--color-bg)] transition-colors duration-200 w-full text-black focus:border-[#a78bfa] focus:outline-none dark:text-white dark:border-opacity-20";

  // Ordenar por
  const orderSelect = document.createElement("select");
  orderSelect.className = "min-w-[160px] max-w-[220px] flex-1 text-base p-2 border border-gray-200 rounded bg-[var(--color-bg)] transition-colors duration-200 w-full text-black focus:border-[#a78bfa] focus:outline-none dark:text-white dark:border-opacity-20";
  [
    { value: "recent", text: "Próximos" },
    { value: "oldest", text: "Más lejanos" },
    { value: "priceAsc", text: "Más baratos" },
    { value: "priceDesc", text: "Más caros" },
  ].forEach((opt) => {
    const option = document.createElement("option");
    option.value = opt.value;
    option.textContent = opt.text;
    orderSelect.appendChild(option);
  });

  // Plazas disponibles
  const spotsCheckbox = document.createElement("input");
  spotsCheckbox.type = "checkbox";
  spotsCheckbox.className = "accent-[#6c2ccc]";
  const spotsLabel = document.createElement("label");
  spotsLabel.className = "flex items-center gap-2 text-base cursor-pointer select-none text-dark-bg dark:text-light-bg";
  spotsLabel.textContent = "Solo con plazas disponibles";
  spotsLabel.appendChild(spotsCheckbox);

  // Botón para resetear filtros
  const resetButton = document.createElement("button");
  resetButton.textContent = "Limpiar";
  resetButton.className =  `
  min-w-[120px] max-w-[120px] w-full flex-1
  px-4 py-2 mt-1
  bg-dark-orange text-[#fafafa] rounded text-base font-medium
  cursor-pointer transition-colors transition-transform duration-200
  shadow-sm hover:shadow-md
  transform  hover:scale-[1.02] active:scale-[0.98]
  hover:bg-[#934728] hover:text-[#f4f3f7] hover:border-[#c4b5fd]
  dark:bg-dark-green dark:hover:bg-[#5f6155] dark:border-none
`;

  //clear and spots container
  const filterClearContainer = document.createElement("div");
  filterClearContainer.className = "w-full flex items-center justify-center gap-12  ";
  filterClearContainer.appendChild(spotsLabel);
  filterClearContainer.appendChild(resetButton);

  // Añadir filtros al contenedor
  filterContainer.appendChild(categoriesFilter);
  filterContainer.appendChild(subcategoriesFilter);
  filterContainer.appendChild(monthInput);
  filterContainer.appendChild(orderSelect);

  // filterContainer.appendChild(spotsLabel);
  // filterContainer.appendChild(resetButton);
   filterContainer.appendChild(filterClearContainer);
  allFiltersContainer.appendChild(filterContainer);
 

  // Workshops list
  const workshopsContainer = document.createElement("div");
  workshopsContainer.className = "w-full flex flex-wrap gap-8 justify-center items-center py-8";

  // --- Paginación: contenedor global ---
  const paginationContainer = document.createElement("div");
  paginationContainer.className = "flex justify-center items-center gap-3 mt-8";

  // Montar todo
  container.appendChild(allFiltersContainer);
  container.appendChild(workshopsContainer);
  container.appendChild(paginationContainer);

  // Función para actualizar las subcategorías según la categoría seleccionada
  function updateSubcategoriesOptions() {
    subcategoriesFilter.innerHTML = "";
    const defaultSubcategoryOption = document.createElement("option");
    defaultSubcategoryOption.value = "";
    defaultSubcategoryOption.textContent = "Todas las subcategorías";
    subcategoriesFilter.appendChild(defaultSubcategoryOption);

    const selectedCategoryId = categoriesFilter.value;
    const filteredSubcategories = selectedCategoryId
      ? subcategories.filter(
          (sub) => String(sub.categoryId) === String(selectedCategoryId)
        )
      : subcategories;

    filteredSubcategories.forEach((subcategory) => {
      const option = document.createElement("option");
      option.value = subcategory.id;
      option.textContent = subcategory.name;
      subcategoriesFilter.appendChild(option);
    });
    subcategoriesFilter.value = "";
  }

  // Inicializa las subcategorías
  updateSubcategoriesOptions();

  // --- Paginación ---
  function getWorkshopsPerPage() {
    if (window.innerWidth < 600) {
      return 8;
    } else if (window.innerWidth < 1000) {
      return 10;
    } else {
      return 15;
    }
  }
  let currentPage = 1;
  let totalPages = 1;

  function filterAndRender() {
    let filtered = [...workshops];
    //Search Filter
    const searchValue = searchInput.value.toLowerCase();
    if (searchValue) {
      filtered = filtered.filter((workshops) =>
        workshops.title.toLowerCase().includes(searchValue)
      );
    }
    // Categories Filter
    const categoriesValue = categoriesFilter.value;
    if (categoriesValue) {
      filtered = filtered.filter(
        (workshops) => workshops.categoryId === Number(categoriesValue)
      );
    }
    // Subcategories Filter
    const subcategoriesValue = subcategoriesFilter.value;
    if (subcategoriesValue) {
      filtered = filtered.filter(
        (workshops) => workshops.subcategoryId === Number(subcategoriesValue)
      );
    }
    // Date Filter
    const monthValue = monthInput.value;
    if (monthValue) {
      filtered = filtered.filter(
        (workshops) =>
          dayjs.unix(workshops.date).format("YYYY-MM") === monthValue
      );
    }
    // Spots Filter
    if (spotsCheckbox.checked) {
      filtered = filtered.filter(
        (workshops) => workshops.enrolled.length < workshops.capacity
      );
    }

    // Ordenar por:
    const orderValue = orderSelect.value;
    if (orderValue === "recent") {
      filtered = filtered.sort((a, b) =>
        dayjs.unix(a.date).diff(dayjs.unix(b.date))
      );
    } else if (orderValue === "oldest") {
      filtered = filtered.sort((a, b) =>
        dayjs.unix(b.date).diff(dayjs.unix(a.date))
      );
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

    // Render the workshopContainer
    workshopsContainer.innerHTML = "";
    if (paginatedWorkshops.length === 0) {
      workshopsContainer.innerHTML =
        "No hay talleres que coincidan con los filtros.";
    } else {
      renderWorkshops(
        workshopsContainer,
        paginatedWorkshops,
        categories,
        subcategories
      );
    }

    // --- Paginación: renderizar controles ---
    renderPaginationControls();
    // --- Fin paginación ---

    resetButton.addEventListener("click", () => {
      searchInput.value = "";
      categoriesFilter.selectedIndex = 0;
      updateSubcategoriesOptions();
      subcategoriesFilter.selectedIndex = 0;
      monthInput.value = "";
      orderSelect.selectedIndex = 0;
      spotsCheckbox.checked = false;
      currentPage = 1;
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
    prevBtn.className = "bg-dark-orange border-2 border-yellow-900 text-white px-4 py-1.5 rounded cursor-pointer text-base font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#934728]  hover:border-yellow-900 focus-visible:bg-[#934728] focus-visible:text-white focus-visible:border-yellow-900 dark:bg-light-yellow  dark:text-dark-bg dark:hover:bg-[#d8c3a9] dark:border-dark-green dark:hover:border-dark-green dark:focus-visible:bg-[#d8c3a9] dark:focus-visible:text-white dark:focus-visible:border-dark-green ";
    prevBtn.onclick = () => {
      currentPage--;
      filterAndRender();
    };
    paginationContainer.appendChild(prevBtn);

    // Texto de página actual
    const pageInfo = document.createElement("span");
    pageInfo.textContent = `Página ${currentPage} de ${totalPages}`;
    pageInfo.className = "text-base text-dark-bg font-medium mx-3 dark:text-light-bg";
    paginationContainer.appendChild(pageInfo);

    // Botón siguiente
    const nextBtn = document.createElement("button");
    nextBtn.textContent = "Siguiente";
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.className = "bg-dark-orange border-2 border-yellow-900 text-white px-4 py-1.5 rounded cursor-pointer text-base font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#934728] hover:text-white hover:border-yellow-900 focus-visible:bg-[#934728] focus-visible:text-white focus-visible:border-yellow-900 dark:bg-light-yellow  dark:text-dark-bg dark:hover:bg-[#d8c3a9] dark:border-dark-green dark:hover:border-dark-green dark:focus-visible:bg-[#d8c3a9] dark:focus-visible:text-white dark:focus-visible:border-dark-green";
    nextBtn.onclick = () => {
      currentPage++;
      filterAndRender();
    };
    paginationContainer.appendChild(nextBtn);
  }
  // --- Fin paginación ---

  // Events in each filter
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

  window.addEventListener("resize", () => {
    currentPage = 1;
    filterAndRender();
  });

  filterAndRender();
}