import dayjs from "../../utils/day.js";
import { getCategories, getSubcategories } from "../../api/apiCategories.js";
import { getCurrentUser } from "../../api/apiUsers.js";
import { showToast } from "../../utils/toastify.js";

export async function createEditWorkshopModal({ data = {}, onSubmit }) {
  let modal = document.getElementById("workshop-modal");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "workshop-modal";
    modal.className = "workshop-modal";

    const overlay = document.createElement("div");
    overlay.className = "workshop-modal__overlay";
    overlay.onclick = closeModal;

    const content = document.createElement("div");
    content.className = "workshop-modal__content";

    modal.appendChild(overlay);
    modal.appendChild(content);
    document.body.appendChild(modal);
  }

  const content = modal.querySelector(".workshop-modal__content");
  content.innerHTML = "";

  // Crear formulario
  const form = document.createElement("form");
  form.id = "workshop-form";
  form.className = "workshop-form";

  // Título
  const titleGroup = document.createElement("div");
  titleGroup.className = "form-group";

  const titleLabel = document.createElement("label");
  titleLabel.setAttribute("for", "title");
  titleLabel.textContent = "Título";

  const titleInput = document.createElement("input");
  titleInput.id = "title";
  titleInput.name = "title";
  titleInput.value = data.title || "";
  titleInput.required = true;

  titleGroup.appendChild(titleLabel);
  titleGroup.appendChild(titleInput);
  form.appendChild(titleGroup);

  // Descripción
  const overviewGroup = document.createElement("div");
  overviewGroup.className = "form-group";

  const overviewLabel = document.createElement("label");
  overviewLabel.setAttribute("for", "overview");
  overviewLabel.textContent = "Descripción";

  const overviewTextarea = document.createElement("textarea");
  overviewTextarea.id = "overview";
  overviewTextarea.name = "overview";
  overviewTextarea.textContent = data.overview || "";

  overviewGroup.appendChild(overviewLabel);
  overviewGroup.appendChild(overviewTextarea);
  form.appendChild(overviewGroup);

  // Requisitos
  const requirementsGroup = document.createElement("div");
  requirementsGroup.className = "form-group";

  const requirementsLabel = document.createElement("label");
  requirementsLabel.setAttribute("for", "requirements");
  requirementsLabel.textContent = "Requisitos";

  const requirementsTextarea = document.createElement("textarea");
  requirementsTextarea.id = "requirements";
  requirementsTextarea.name = "requirements";
  requirementsTextarea.textContent = data.requirements || "";

  requirementsGroup.appendChild(requirementsLabel);
  requirementsGroup.appendChild(requirementsTextarea);
  form.appendChild(requirementsGroup);

  // Modo y lugar
  const modeGroup = document.createElement("div");
  modeGroup.className = "form-group inline-group";

  const modeDiv = document.createElement("div");
  const modeLabel = document.createElement("label");
  modeLabel.setAttribute("for", "mode");
  modeLabel.textContent = "Modo";

  const modeSelect = document.createElement("select");
  modeSelect.id = "mode";
  modeSelect.name = "mode";
  modeSelect.required = true;

  const onlineOption = document.createElement("option");
  onlineOption.value = "Online";
  onlineOption.textContent = "Online";
  if (data.mode === "Online") onlineOption.selected = true;

  const presencialOption = document.createElement("option");
  presencialOption.value = "Presencial";
  presencialOption.textContent = "Presencial";
  if (data.mode === "Presencial") presencialOption.selected = true;

  modeSelect.appendChild(onlineOption);
  modeSelect.appendChild(presencialOption);
  modeDiv.appendChild(modeLabel);
  modeDiv.appendChild(modeSelect);
  modeGroup.appendChild(modeDiv);

  // Grupo de lugar y dirección
  const placeGroup = document.createElement("div");
  placeGroup.id = "place-group";
  placeGroup.style.display = data.mode === "Presencial" ? "block" : "none";

  const placeLabel = document.createElement("label");
  placeLabel.setAttribute("for", "place");
  placeLabel.textContent = "Lugar";

  const placeInput = document.createElement("input");
  placeInput.id = "place";
  placeInput.name = "place";
  placeInput.value = data.location || ""; // Usar el valor existente si hay datos
  placeInput.placeholder = "Ej: Centro, Oficina, Mi Casa";
  placeInput.style.width = "100%";
  placeInput.style.minWidth = "300px";
  placeInput.setAttribute("autocomplete", "off");

  const addressLabel = document.createElement("label");
  addressLabel.setAttribute("for", "address");
  addressLabel.textContent = "Dirección";

  const addressInput = document.createElement("input");
  addressInput.id = "address";
  addressInput.name = "address";
  addressInput.value = ""; // Siempre vacío para ver ejemplos
  addressInput.placeholder = "Ej: Calle papafrita 22, Santa Cruz de Tenerife";
  addressInput.style.width = "100%";
  addressInput.style.minWidth = "300px";
  addressInput.setAttribute("autocomplete", "off");

  // Campo oculto para las coordenadas
  const coordinatesInput = document.createElement("input");
  coordinatesInput.id = "coordinates";
  coordinatesInput.name = "coordinates";
  coordinatesInput.type = "hidden";
  // Manejar coordenadas existentes (pueden estar en formato string o objeto)
  let coordinatesValue = "";
  if (data.coordinates) {
    if (typeof data.coordinates === "string") {
      // Si es string, intentar parsear como JSON o como coordenadas separadas por coma
      try {
        const coords = JSON.parse(data.coordinates);
        coordinatesValue = JSON.stringify({ lat: coords.lat, lng: coords.lng });
      } catch {
        // Si no es JSON válido, asumir que es formato "lat,lng"
        const [lat, lng] = data.coordinates.split(",");
        if (lat && lng) {
          coordinatesValue = JSON.stringify({
            lat: parseFloat(lat),
            lng: parseFloat(lng),
          });
        }
      }
    } else if (typeof data.coordinates === "object") {
      // Si ya es un objeto, convertirlo al formato correcto
      coordinatesValue = JSON.stringify({
        lat: data.coordinates.lat,
        lng: data.coordinates.lng,
      });
    }
  }
  coordinatesInput.value = coordinatesValue;

  // Botón para geocodificar
  const geocodeBtn = document.createElement("button");
  geocodeBtn.type = "button";
  geocodeBtn.id = "geocode-btn";
  geocodeBtn.className = "geocode-btn";
  geocodeBtn.textContent = "Obtener coordenadas";
  geocodeBtn.style.marginTop = "10px";
  geocodeBtn.style.padding = "8px 16px";
  geocodeBtn.style.backgroundColor = "#2563eb";
  geocodeBtn.style.color = "white";
  geocodeBtn.style.border = "none";
  geocodeBtn.style.borderRadius = "4px";
  geocodeBtn.style.cursor = "pointer";

  // Indicador de estado
  const geocodeStatus = document.createElement("div");
  geocodeStatus.id = "geocode-status";
  geocodeStatus.style.marginTop = "5px";
  geocodeStatus.style.fontSize = "12px";

  // Lista de ejemplos de direcciones con alta precisión
  const addressExamples = [
    // Direcciones específicas y reconocibles por Nominatim con alta precisión
    {
      place: "Lugar del Workshop",
      address: "Avenida de San Sebastián, 51, Santa Cruz de Tenerife, España",
    },
    {
      place: "Lugar del Workshop",
      address: "Avenida Constitución, 1, Santa Cruz de Tenerife, España",
    },
    {
      place: "Lugar del Workshop",
      address: "Calle del Castillo, 1, Santa Cruz de Tenerife, España",
    },
    {
      place: "Lugar del Workshop",
      address: "Calle Consistorio, 9, Santa Cruz de Tenerife, España",
    },
    {
      place: "Lugar del Workshop",
      address: "Calle José Murphy, 12, Santa Cruz de Tenerife, España",
    },
    {
      place: "Lugar del Workshop",
      address: "Plaza de España, Santa Cruz de Tenerife, España",
    },
    {
      place: "Lugar del Workshop",
      address: "Plaza del Príncipe, Santa Cruz de Tenerife, España",
    },
    {
      place: "Lugar del Workshop",
      address: "Plaza de la Candelaria, Santa Cruz de Tenerife, España",
    },
    {
      place: "Lugar del Workshop",
      address: "Calle Molinos de Agua, La Laguna, España",
    },
    {
      place: "Lugar del Workshop",
      address: "Calle de la Concepción, La Laguna, España",
    },
    {
      place: "Lugar del Workshop",
      address: "Calle Carrera, La Laguna, España",
    },
    {
      place: "Lugar del Workshop",
      address: "Plaza del Adelantado, La Laguna, España",
    },
    {
      place: "Lugar del Workshop",
      address: "Calle Vía Láctea, La Laguna, España",
    },
    {
      place: "Lugar del Workshop",
      address: "Avenida de Anaga, Santa Cruz de Tenerife, España",
    },
    {
      place: "Lugar del Workshop",
      address: "Avenida Francisco La Roche, Santa Cruz de Tenerife, España",
    },
    {
      place: "Lugar del Workshop",
      address: "Calle San Simón, El Sauzal, España",
    },
    {
      place: "Lugar del Workshop",
      address: "Calle San Francisco, La Orotava, España",
    },
    {
      place: "Lugar del Workshop",
      address: "Calle Tomás Zerolo, La Orotava, España",
    },
    {
      place: "Lugar del Workshop",
      address: "Calle Retama, Puerto de la Cruz, España",
    },
    {
      place: "Lugar del Workshop",
      address: "Camino Cruz de Leandro, El Sauzal, España",
    },
    {
      place: "Lugar del Workshop",
      address: "Avenida de Los Cristianos, Arona, España",
    },
    {
      place: "Lugar del Workshop",
      address: "Avenida Loro Parque, Puerto de la Cruz, España",
    },
    {
      place: "Lugar del Workshop",
      address: "Avenida Siam, Costa Adeje, España",
    },
    {
      place: "Lugar del Workshop",
      address: "Carretera TF-21, La Orotava, España",
    },
    {
      place: "Lugar del Workshop",
      address: "Carretera del Norte, La Laguna, España",
    },
    {
      place: "Lugar del Workshop",
      address: "Carretera General del Sur, Granadilla de Abona, España",
    },
    {
      place: "Lugar del Workshop",
      address: "Muelle de Anaga, Santa Cruz de Tenerife, España",
    },
    {
      place: "Lugar del Workshop",
      address: "Muelle Pesquero, Puerto de la Cruz, España",
    },
    {
      place: "Lugar del Workshop",
      address: "Plaza de la Patrona de Canarias, Candelaria, España",
    },
    {
      place: "Lugar del Workshop",
      address: "Plaza Isla de la Madera, Santa Cruz de Tenerife, España",
    },
    {
      place: "Lugar del Workshop",
      address: "Calle General, Santa Cruz de Tenerife, España",
    },
    {
      place: "Lugar del Workshop",
      address: "Avenida Principal, La Laguna, España",
    },
    {
      place: "Lugar del Workshop",
      address: "Calle Secundaria, Puerto de la Cruz, España",
    },
    {
      place: "Lugar del Workshop",
      address: "Avenida Central, La Orotava, España",
    },
    { place: "Lugar del Workshop", address: "Calle Mayor, El Sauzal, España" },
    {
      place: "Lugar del Workshop",
      address: "Avenida del Mar, Costa Adeje, España",
    },
    { place: "Lugar del Workshop", address: "Calle Real, Arona, España" },
    {
      place: "Lugar del Workshop",
      address: "Avenida de la Paz, Granadilla de Abona, España",
    },
    { place: "Lugar del Workshop", address: "Calle Nueva, Candelaria, España" },
  ];

  // Contenedor para sugerencias
  const suggestionsContainer = document.createElement("div");
  suggestionsContainer.id = "suggestions-container";
  suggestionsContainer.style.display = "none";
  suggestionsContainer.style.position = "absolute";
  suggestionsContainer.style.backgroundColor = "white";
  suggestionsContainer.style.border = "1px solid #ddd";
  suggestionsContainer.style.borderRadius = "4px";
  suggestionsContainer.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
  suggestionsContainer.style.maxHeight = "200px";
  suggestionsContainer.style.overflowY = "auto";
  suggestionsContainer.style.zIndex = "1000";
  suggestionsContainer.style.width = "100%";

  // Función para mostrar sugerencias
  function showSuggestions(input, isPlaceInput = false) {
    const value = input.value.toLowerCase();
    if (value.length < 1) {
      suggestionsContainer.style.display = "none";
      return;
    }

    // Si es el campo de lugar, no mostrar sugerencias (es libre)
    if (isPlaceInput) {
      suggestionsContainer.style.display = "none";
      return;
    }

    // Solo mostrar sugerencias para el campo de dirección
    const filteredExamples = addressExamples.filter((example) => {
      return example.address.toLowerCase().includes(value);
    });

    if (filteredExamples.length === 0) {
      suggestionsContainer.style.display = "none";
      return;
    }

    suggestionsContainer.innerHTML = "";
    filteredExamples.slice(0, 6).forEach((example) => {
      const suggestionDiv = document.createElement("div");
      suggestionDiv.style.padding = "8px 12px";
      suggestionDiv.style.borderBottom = "1px solid #f3f4f6";
      suggestionDiv.style.cursor = "pointer";
      suggestionDiv.style.transition = "background-color 0.2s";

      const addressSpan = document.createElement("div");
      addressSpan.style.fontWeight = "bold";
      addressSpan.style.color = "#1f2937";
      addressSpan.style.fontSize = "12px";
      addressSpan.textContent = example.address;

      suggestionDiv.appendChild(addressSpan);

      suggestionDiv.addEventListener("click", () => {
        addressInput.value = example.address;
        suggestionsContainer.style.display = "none";
        validateAddressFields();
        showToast(
          "Dirección copiada. Haz clic en 'Obtener coordenadas'",
          "info"
        );
      });

      suggestionDiv.addEventListener("mouseenter", () => {
        suggestionDiv.style.backgroundColor = "#f3f4f6";
      });

      suggestionDiv.addEventListener("mouseleave", () => {
        suggestionDiv.style.backgroundColor = "white";
      });

      suggestionsContainer.appendChild(suggestionDiv);
    });

    suggestionsContainer.style.display = "block";
  }

  // Función para ocultar sugerencias
  function hideSuggestions() {
    setTimeout(() => {
      suggestionsContainer.style.display = "none";
    }, 200);
  }

  // Contenedor para el campo de lugar con posición relativa
  const placeInputContainer = document.createElement("div");
  placeInputContainer.style.position = "relative";
  placeInputContainer.appendChild(placeLabel);
  placeInputContainer.appendChild(placeInput);
  placeInputContainer.appendChild(suggestionsContainer);

  // Contenedor para el campo de dirección con posición relativa
  const addressInputContainer = document.createElement("div");
  addressInputContainer.style.position = "relative";
  addressInputContainer.appendChild(addressLabel);
  addressInputContainer.appendChild(addressInput);

  placeGroup.appendChild(placeInputContainer);
  placeGroup.appendChild(addressInputContainer);
  placeGroup.appendChild(coordinatesInput);
  placeGroup.appendChild(geocodeBtn);
  placeGroup.appendChild(geocodeStatus);
  modeGroup.appendChild(placeGroup);
  form.appendChild(modeGroup);

  // Fecha
  const dateGroup = document.createElement("div");
  dateGroup.className = "form-group";

  const dateLabel = document.createElement("label");
  dateLabel.setAttribute("for", "date");
  dateLabel.textContent = "Fecha";

  const dateInput = document.createElement("input");
  dateInput.id = "date";
  dateInput.type = "datetime-local";
  dateInput.name = "date";
  dateInput.required = true;
  if (data.date) {
    dateInput.value = dayjs.unix(data.date).format("YYYY-MM-DDTHH:mm");
  }

  dateGroup.appendChild(dateLabel);
  dateGroup.appendChild(dateInput);
  form.appendChild(dateGroup);

  // Categoría y subcategoría
  const categoryGroup = document.createElement("div");
  categoryGroup.className = "form-group inline-group";

  const categoryDiv = document.createElement("div");
  const categoryLabel = document.createElement("label");
  categoryLabel.setAttribute("for", "category");
  categoryLabel.textContent = "Categoría";

  const categorySelect = document.createElement("select");
  categorySelect.id = "category-select";
  categorySelect.name = "categoryId";

  categoryDiv.appendChild(categoryLabel);
  categoryDiv.appendChild(categorySelect);
  categoryGroup.appendChild(categoryDiv);

  const subcategoryDiv = document.createElement("div");
  const subcategoryLabel = document.createElement("label");
  subcategoryLabel.setAttribute("for", "subcategory");
  subcategoryLabel.textContent = "Subcategoría";

  const subcategorySelect = document.createElement("select");
  subcategorySelect.id = "subcategory-select";
  subcategorySelect.name = "subcategoryId";

  subcategoryDiv.appendChild(subcategoryLabel);
  subcategoryDiv.appendChild(subcategorySelect);
  categoryGroup.appendChild(subcategoryDiv);
  form.appendChild(categoryGroup);

  // Capacidad, duración y nivel en la misma fila
  const detailsGroup = document.createElement("div");
  detailsGroup.className = "form-group inline-group";

  // Capacidad
  const capacityDiv = document.createElement("div");
  const capacityLabel = document.createElement("label");
  capacityLabel.setAttribute("for", "capacity");
  capacityLabel.textContent = "Capacidad";

  const capacityInput = document.createElement("input");
  capacityInput.id = "capacity";
  capacityInput.type = "number";
  capacityInput.name = "capacity";
  capacityInput.value = data.capacity || "";
  capacityInput.required = true;

  capacityDiv.appendChild(capacityLabel);
  capacityDiv.appendChild(capacityInput);
  detailsGroup.appendChild(capacityDiv);

  // Duración
  const durationDiv = document.createElement("div");
  const durationLabel = document.createElement("label");
  durationLabel.setAttribute("for", "duration");
  durationLabel.textContent = "Duración Hrs";

  const durationInput = document.createElement("input");
  durationInput.id = "duration";
  durationInput.type = "number";
  durationInput.name = "duration";
  durationInput.value = data.duration || "";
  durationInput.placeholder = "Ej: 2";
  durationInput.required = true;

  durationDiv.appendChild(durationLabel);
  durationDiv.appendChild(durationInput);
  detailsGroup.appendChild(durationDiv);

  // Nivel
  const levelDiv = document.createElement("div");
  const levelLabel = document.createElement("label");
  levelLabel.setAttribute("for", "level");
  levelLabel.textContent = "Nivel";

  const levelSelect = document.createElement("select");
  levelSelect.id = "level";
  levelSelect.name = "level";
  levelSelect.required = true;

  const principianteOption = document.createElement("option");
  principianteOption.value = "Principiante";
  principianteOption.textContent = "Principiante";
  if (data.level === "Principiante") principianteOption.selected = true;

  const intermedioOption = document.createElement("option");
  intermedioOption.value = "Intermedio";
  intermedioOption.textContent = "Intermedio";
  if (data.level === "Intermedio") intermedioOption.selected = true;

  const avanzadoOption = document.createElement("option");
  avanzadoOption.value = "Avanzado";
  avanzadoOption.textContent = "Avanzado";
  if (data.level === "Avanzado") avanzadoOption.selected = true;

  levelSelect.appendChild(principianteOption);
  levelSelect.appendChild(intermedioOption);
  levelSelect.appendChild(avanzadoOption);

  levelDiv.appendChild(levelLabel);
  levelDiv.appendChild(levelSelect);
  detailsGroup.appendChild(levelDiv);
  form.appendChild(detailsGroup);

  // Precio en fila separada, más pequeño y centrado
  const priceGroup = document.createElement("div");
  priceGroup.className = "form-group";
  priceGroup.style.textAlign = "center";

  const priceLabel = document.createElement("label");
  priceLabel.setAttribute("for", "price");
  priceLabel.textContent = "Precio (€)";
  priceLabel.style.display = "block";
  priceLabel.style.marginBottom = "8px";

  const priceInput = document.createElement("input");
  priceInput.id = "price";
  priceInput.type = "number";
  priceInput.step = "0.01";
  priceInput.name = "price";
  priceInput.value = data.price || 0;
  priceInput.style.width = "200px";
  priceInput.style.margin = "0 auto";
  priceInput.style.display = "block";

  priceGroup.appendChild(priceLabel);
  priceGroup.appendChild(priceInput);
  form.appendChild(priceGroup);

  // Imagen
  const imageGroup = document.createElement("div");
  imageGroup.className = "form-group";

  const imageLabel = document.createElement("label");
  imageLabel.setAttribute("for", "imageUrl");
  imageLabel.textContent = "Imagen";

  const imageUrlInput = document.createElement("input");
  imageUrlInput.id = "imageUrl";
  imageUrlInput.name = "imageUrl";
  imageUrlInput.type = "hidden";
  imageUrlInput.value = data.imageUrl || "";

  const imageUploadInput = document.createElement("input");
  imageUploadInput.id = "image-upload";
  imageUploadInput.type = "file";
  imageUploadInput.accept = "image/*";

  const uploadBtn = document.createElement("button");
  uploadBtn.type = "button";
  uploadBtn.id = "upload-btn";
  uploadBtn.className = "upload-btn";
  uploadBtn.textContent = "Subir imagen";

  const imagePreview = document.createElement("div");
  imagePreview.id = "image-preview";
  imagePreview.style.marginTop = "10px";

  if (data.imageUrl) {
    const img = document.createElement("img");
    img.src = data.imageUrl;
    img.alt = "Imagen actual";
    img.style.maxWidth = "100%";
    img.style.maxHeight = "150px";
    imagePreview.appendChild(img);
  }

  imageGroup.appendChild(imageLabel);
  imageGroup.appendChild(imageUrlInput);
  imageGroup.appendChild(imageUploadInput);
  imageGroup.appendChild(uploadBtn);
  imageGroup.appendChild(imagePreview);
  form.appendChild(imageGroup);

  // Botón de envío
  const submitBtn = document.createElement("button");
  submitBtn.type = "submit";
  submitBtn.className = "btn-submit";
  submitBtn.textContent = "Guardar";
  form.appendChild(submitBtn);

  content.appendChild(form);
  modal.style.display = "flex";

  // Lógica del formulario
  const categories = await getCategories();
  const subcategories = await getSubcategories();

  // Llenar categorías
  categorySelect.innerHTML = categories
    .map(
      (c) =>
        `<option value="${c.id}" ${data.categoryId == c.id ? "selected" : ""}>${
          c.name
        }</option>`
    )
    .join("");

  // Función para renderizar subcategorías
  function renderSubcategories(categoryId) {
    const filtered = subcategories.filter(
      (s) => Number(s.categoryId) === Number(categoryId)
    );
    subcategorySelect.innerHTML = filtered
      .map(
        (s) =>
          `<option value="${s.id}" ${
            data.subcategoryId == s.id ? "selected" : ""
          }>${s.name}</option>`
      )
      .join("");
    if (filtered.length === 0) {
      subcategorySelect.innerHTML =
        '<option value="" disabled selected>-- No hay subcategorías --</option>';
    }
  }
  renderSubcategories(categorySelect.value);
  categorySelect.addEventListener("change", () => {
    renderSubcategories(categorySelect.value);
  });

  // Mostrar/ocultar campos según el modo
  if (modeSelect.value === "Presencial") {
    placeGroup.style.display = "block";
  } else {
    placeGroup.style.display = "none";
    placeGroup.querySelector("#place").value = "";
    placeGroup.querySelector("#address").value = "";
    placeGroup.querySelector("#coordinates").value = "";
  }
  modeSelect.addEventListener("change", () => {
    if (modeSelect.value === "Presencial") {
      placeGroup.style.display = "block";
    } else {
      placeGroup.style.display = "none";
      placeGroup.querySelector("#place").value = "";
      placeGroup.querySelector("#address").value = "";
      placeGroup.querySelector("#coordinates").value = "";
    }
  });

  // Función de geocodificación con Nominatim
  async function geocodeAddress() {
    const address = addressInput.value.trim();
    const location = placeInput.value.trim();

    if (!address) {
      geocodeStatus.textContent = "❌ Por favor, introduce una dirección";
      geocodeStatus.style.color = "#dc2626";
      showToast("Por favor, introduce una dirección", "error");
      return;
    }

    // Validación básica de formato de dirección
    if (address && address.length < 3) {
      geocodeStatus.textContent =
        "❌ La dirección es demasiado corta. Añade más detalles";
      geocodeStatus.style.color = "#dc2626";
      showToast("La dirección es demasiado corta. Añade más detalles", "error");
      return;
    }

    // Para geocodificación, usar solo la dirección, no el lugar
    const fullAddress = address;

    geocodeBtn.disabled = true;
    geocodeBtn.textContent = "Buscando...";
    geocodeStatus.textContent = "🔍 Obteniendo coordenadas...";
    geocodeStatus.style.color = "#2563eb";

    try {
      console.log("🔍 Buscando dirección:", fullAddress);

      // Primera búsqueda con la dirección completa
      let response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          fullAddress
        )}&limit=10&addressdetails=1&countrycodes=es`
      );

      if (!response.ok) {
        throw new Error("Error en la respuesta del servidor");
      }

      let data = await response.json();
      console.log("📡 Respuesta de Nominatim:", data);

      // Si no hay resultados, intentar con una búsqueda más específica en Tenerife
      if (!data || data.length === 0) {
        console.log(
          "🔍 No se encontraron resultados, intentando con 'Tenerife'"
        );
        response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            fullAddress + ", Tenerife"
          )}&limit=10&addressdetails=1&countrycodes=es`
        );

        if (!response.ok) {
          throw new Error("Error en la respuesta del servidor");
        }

        data = await response.json();
        console.log("📡 Segunda respuesta:", data);
      }

      // Si aún no hay resultados, intentar solo con la dirección y Tenerife
      if (!data || data.length === 0) {
        console.log("🔍 Intentando solo con la dirección y Tenerife:", address);
        response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            address + ", Tenerife"
          )}&limit=10&addressdetails=1&countrycodes=es`
        );

        if (!response.ok) {
          throw new Error("Error en la respuesta del servidor");
        }

        data = await response.json();
        console.log("📡 Tercera respuesta:", data);
      }

      if (data && data.length > 0) {
        const result = data[0];
        const lat = parseFloat(result.lat);
        const lon = parseFloat(result.lon);

        // Verificar la precisión del resultado
        const importance = parseFloat(result.importance || 0);
        const displayName = result.display_name || "";

        // Guardar coordenadas como objeto con lat y lng
        coordinatesInput.value = JSON.stringify({ lat: lat, lng: lon });

        if (importance > 0.02) {
          geocodeStatus.textContent = `✅ Coordenadas obtenidas: ${lat.toFixed(
            6
          )}, ${lon.toFixed(6)}`;
          geocodeStatus.style.color = "#059669";
          showToast("Coordenadas obtenidas correctamente", "success");
        } else {
          geocodeStatus.textContent = `⚠️ Coordenadas obtenidas (baja precisión): ${lat.toFixed(
            6
          )}, ${lon.toFixed(6)}`;
          geocodeStatus.style.color = "#f59e0b";
          showToast(
            "Coordenadas obtenidas con baja precisión. Considera ser más específico",
            "warning"
          );
        }
      } else {
        geocodeStatus.textContent =
          "❌ No se encontraron coordenadas para esta dirección";
        geocodeStatus.style.color = "#dc2626";
        showToast("No se encontraron coordenadas para esta dirección", "error");

        // Sugerencias específicas para mejorar la búsqueda
        setTimeout(() => {
          geocodeStatus.textContent =
            "💡 Sugerencias: Usa una de las direcciones de los ejemplos o añade 'España' al final";
          geocodeStatus.style.color = "#2563eb";
        }, 3000);
      }
    } catch (error) {
      console.error("Error en geocodificación:", error);
      geocodeStatus.textContent =
        "❌ Error al obtener coordenadas. Verifica tu conexión";
      geocodeStatus.style.color = "#dc2626";
      showToast("Error al obtener coordenadas. Verifica tu conexión", "error");
    } finally {
      geocodeBtn.disabled = false;
      geocodeBtn.textContent = "Obtener coordenadas";
    }
  }

  // Event listener para el botón de geocodificación
  geocodeBtn.addEventListener("click", geocodeAddress);

  // Validación en tiempo real de los campos de dirección
  function validateAddressFields() {
    const address = addressInput.value.trim();
    const place = placeInput.value.trim();

    if (address.length > 0 && address.length < 5) {
      geocodeStatus.textContent =
        "⚠️ La dirección es muy corta. Añade más detalles";
      geocodeStatus.style.color = "#f59e0b";
    } else if (address.length >= 5) {
      geocodeStatus.textContent =
        "✅ Dirección válida. Puedes obtener coordenadas";
      geocodeStatus.style.color = "#059669";
    } else {
      geocodeStatus.textContent = "";
    }
  }

  // Event listeners para validación en tiempo real y autocompletado
  addressInput.addEventListener("input", (e) => {
    validateAddressFields();
    showSuggestions(e.target, false);
  });

  placeInput.addEventListener("input", (e) => {
    validateAddressFields();
    // No mostrar sugerencias para el campo de lugar (es libre)
  });

  // Event listeners para ocultar sugerencias
  addressInput.addEventListener("blur", hideSuggestions);
  placeInput.addEventListener("blur", hideSuggestions);

  // Event listeners para mostrar sugerencias al hacer focus
  addressInput.addEventListener("focus", (e) => {
    if (e.target.value.length >= 1) {
      showSuggestions(e.target, false);
    }
  });

  // No mostrar sugerencias para el campo de lugar
  placeInput.addEventListener("focus", (e) => {
    // Campo libre, no mostrar sugerencias
  });

  // Lógica de subida de imagen
  uploadBtn.addEventListener("click", async (event) => {
    event.preventDefault();
    const file = imageUploadInput.files[0];
    if (!file) {
      showToast("Selecciona una imagen", "error");
      return;
    }
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "workshops");
    try {
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dpm2ylejh/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await res.json();
      if (data.secure_url) {
        imageUrlInput.value = data.secure_url;
        imagePreview.innerHTML = `<img src="${data.secure_url}" alt="Imagen subida" style="max-width:100%;max-height:150px;" />`;
        showToast("¡Imagen subida correctamente!", "succes");
      } else {
        showToast("Error al subir la imagen", "error");
      }
    } catch (error) {
      console.error("Error loading image");
      showToast("Fallo de red", "error");
    }
  });

  // Envío del formulario
  form.onsubmit = async (e) => {
    e.preventDefault();
    const currentUser = getCurrentUser();
    const formData = Object.fromEntries(new FormData(form));
    // Solo enviar place, address y coordinates si es presencial
    if (formData.mode !== "Presencial") {
      formData.location = "";
      formData.address = "";
      formData.coordinates = "";
    }
    // Procesar coordenadas antes de enviar
    let coordinates = null;
    if (formData.coordinates) {
      try {
        coordinates = JSON.parse(formData.coordinates);
      } catch (error) {
        console.error("Error parsing coordinates:", error);
      }
    }

    const workshop = {
      ...data,
      ...formData,
      coordinates: coordinates, // Enviar como objeto, no como string
      date: dayjs(formData.date).unix(),
      instructorName: currentUser.name,
      enrolled: data.enrolled || [],
      capacity: Number(formData.capacity || 0),
      duration: Number(formData.duration || 0),
      userId: currentUser.id,
    };
    await onSubmit(workshop);
    closeModal();
  };
}

export function closeModal() {
  const modal = document.getElementById("workshop-modal");
  if (modal) modal.style.display = "none";
}
