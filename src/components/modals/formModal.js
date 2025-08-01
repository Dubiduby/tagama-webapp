import dayjs from "../../utils/day.js";
import { getCategories, getSubcategories } from "../../api/apiCategories.js";
import { getCurrentUser } from "../../api/apiUsers.js";
import { showToast } from "../../utils/toastify.js";

export async function createEditWorkshopModal({ data = {}, onSubmit }) {
  let modal = document.getElementById("workshop-modal");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "workshop-modal";
    modal.className = "fixed inset-0 z-50 flex items-center justify-center p-4";

    const overlay = document.createElement("div");
    overlay.className = "absolute inset-0 bg-black bg-opacity-50";
    overlay.onclick = closeModal;

    const content = document.createElement("div");
    content.className =
      "relative bg-white dark:bg-[#1a1a1a] rounded-2xl shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto";

    modal.appendChild(overlay);
    modal.appendChild(content);
    document.body.appendChild(modal);
  }

  const content =
    modal.querySelector(".workshop-modal__content") ||
    modal.querySelector("div:last-child");
  content.innerHTML = "";

  const form = document.createElement("form");
  form.id = "workshop-form";
  form.className =
    "p-6 flex flex-col gap-4 dark:border-solid dark:border-dark-green dark:border";

  const titleGroup = document.createElement("div");
  titleGroup.className = "mb-4";

  const titleLabel = document.createElement("label");
  titleLabel.setAttribute("for", "title");
  titleLabel.className =
    "block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300";
  titleLabel.textContent = "Título";

  const titleInput = document.createElement("input");
  titleInput.id = "title";
  titleInput.name = "title";
  titleInput.value = data.title || "";
  titleInput.required = true;
  titleInput.className =
    "w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#ad5733] dark:focus:ring-[#f49167] bg-white dark:bg-[#141414] text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400";

  titleGroup.appendChild(titleLabel);
  titleGroup.appendChild(titleInput);
  form.appendChild(titleGroup);

  const overviewGroup = document.createElement("div");
  overviewGroup.className = "mb-4";

  const overviewLabel = document.createElement("label");
  overviewLabel.setAttribute("for", "overview");
  overviewLabel.className =
    "block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300";
  overviewLabel.textContent = "Descripción";

  const overviewTextarea = document.createElement("textarea");
  overviewTextarea.id = "overview";
  overviewTextarea.name = "overview";
  overviewTextarea.textContent = data.overview || "";
  overviewTextarea.className =
    "w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#ad5733] dark:focus:ring-[#f49167] bg-white dark:bg-[#141414] text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400";

  overviewGroup.appendChild(overviewLabel);
  overviewGroup.appendChild(overviewTextarea);
  form.appendChild(overviewGroup);

  const requirementsGroup = document.createElement("div");
  requirementsGroup.className = "mb-4";

  const requirementsLabel = document.createElement("label");
  requirementsLabel.setAttribute("for", "requirements");
  requirementsLabel.className =
    "block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300";
  requirementsLabel.textContent = "Requisitos";

  const requirementsTextarea = document.createElement("textarea");
  requirementsTextarea.id = "requirements";
  requirementsTextarea.name = "requirements";
  requirementsTextarea.textContent = data.requirements || "";
  requirementsTextarea.className =
    "w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#ad5733] dark:focus:ring-[#f49167] bg-white dark:bg-[#141414] text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400";

  requirementsGroup.appendChild(requirementsLabel);
  requirementsGroup.appendChild(requirementsTextarea);
  form.appendChild(requirementsGroup);

  const modeGroup = document.createElement("div");
  modeGroup.className = "mb-4";

  const modeLabel = document.createElement("label");
  modeLabel.setAttribute("for", "mode");
  modeLabel.className =
    "block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300";
  modeLabel.textContent = "Modo";

  const modeSelect = document.createElement("select");
  modeSelect.id = "mode";
  modeSelect.name = "mode";
  modeSelect.required = true;
  modeSelect.className =
    "w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#ad5733] dark:focus:ring-[#f49167] bg-white dark:bg-[#141414] text-gray-900 dark:text-white";

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
  modeGroup.appendChild(modeLabel);
  modeGroup.appendChild(modeSelect);

  const placeGroup = document.createElement("div");
  placeGroup.id = "place-group";
  placeGroup.className = "mt-4";
  placeGroup.style.display = data.mode === "Presencial" ? "block" : "none";

  const placeLabel = document.createElement("label");
  placeLabel.setAttribute("for", "place");
  placeLabel.className =
    "block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300";
  placeLabel.textContent = "Lugar";

  const placeInput = document.createElement("input");
  placeInput.id = "place";
  placeInput.name = "place";
  placeInput.value = data.location || "";
  placeInput.placeholder = "Ej: Centro, Oficina, Mi Casa";
  placeInput.className =
    "w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#ad5733] dark:focus:ring-[#f49167] bg-white dark:bg-[#141414] text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400";
  placeInput.setAttribute("autocomplete", "off");

  const addressLabel = document.createElement("label");
  addressLabel.setAttribute("for", "address");
  addressLabel.className =
    "block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300";
  addressLabel.textContent = "Dirección";

  const addressInput = document.createElement("input");
  addressInput.id = "address";
  addressInput.name = "address";
  addressInput.value = "";
  addressInput.placeholder = "Ej: Calle papafrita 22, Santa Cruz de Tenerife";
  addressInput.className =
    "w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#ad5733] dark:focus:ring-[#f49167] bg-white dark:bg-[#141414] text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400";
  addressInput.setAttribute("autocomplete", "off");

  const coordinatesInput = document.createElement("input");
  coordinatesInput.id = "coordinates";
  coordinatesInput.name = "coordinates";
  coordinatesInput.type = "hidden";

  let coordinatesValue = "";
  if (data.coordinates) {
    if (typeof data.coordinates === "string") {
      try {
        const coords = JSON.parse(data.coordinates);
        coordinatesValue = JSON.stringify({ lat: coords.lat, lng: coords.lng });
      } catch {
        const [lat, lng] = data.coordinates.split(",");
        if (lat && lng) {
          coordinatesValue = JSON.stringify({
            lat: parseFloat(lat),
            lng: parseFloat(lng),
          });
        }
      }
    } else if (typeof data.coordinates === "object") {
      coordinatesValue = JSON.stringify({
        lat: data.coordinates.lat,
        lng: data.coordinates.lng,
      });
    }
  }
  coordinatesInput.value = coordinatesValue;

  const geocodeBtn = document.createElement("button");
  geocodeBtn.type = "button";
  geocodeBtn.textContent = "📍 Obtener coordenadas";
  geocodeBtn.className =
    "mt-2 bg-[#ad5733] dark:bg-[#f49167] text-white font-bold py-2 px-4 rounded-full hover:bg-[#797b6c] dark:hover:bg-[#ad5733] transition text-sm";
  geocodeBtn.onclick = geocodeAddress;

  const geocodeStatus = document.createElement("div");
  geocodeStatus.id = "geocode-status";
  geocodeStatus.className = "mt-2 text-sm";

  placeGroup.appendChild(placeLabel);
  placeGroup.appendChild(placeInput);
  placeGroup.appendChild(addressLabel);
  placeGroup.appendChild(addressInput);
  placeGroup.appendChild(coordinatesInput);
  placeGroup.appendChild(geocodeBtn);
  placeGroup.appendChild(geocodeStatus);
  modeGroup.appendChild(placeGroup);
  form.appendChild(modeGroup);

  const dateGroup = document.createElement("div");
  dateGroup.className = "mb-4";

  const dateLabel = document.createElement("label");
  dateLabel.setAttribute("for", "date");
  dateLabel.className =
    "block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300";
  dateLabel.textContent = "Fecha";

  const dateInput = document.createElement("input");
  dateInput.id = "date";
  dateInput.type = "datetime-local";
  dateInput.name = "date";
  dateInput.required = true;
  if (data.date) {
    dateInput.value = dayjs.unix(data.date).format("YYYY-MM-DDTHH:mm");
  }
  dateInput.className =
    "w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#ad5733] dark:focus:ring-[#f49167] bg-white dark:bg-[#141414] text-gray-900 dark:text-white";

  dateGroup.appendChild(dateLabel);
  dateGroup.appendChild(dateInput);
  form.appendChild(dateGroup);

  const categoryGroup = document.createElement("div");
  categoryGroup.className = "mb-4 flex gap-4";

  const categoryDiv = document.createElement("div");
  categoryDiv.className = "flex-1";
  const categoryLabel = document.createElement("label");
  categoryLabel.setAttribute("for", "category");
  categoryLabel.className =
    "block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300";
  categoryLabel.textContent = "Categoría";

  const categorySelect = document.createElement("select");
  categorySelect.id = "category-select";
  categorySelect.name = "categoryId";
  categorySelect.className =
    "w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#ad5733] dark:focus:ring-[#f49167] bg-white dark:bg-[#141414] text-gray-900 dark:text-white";

  categoryDiv.appendChild(categoryLabel);
  categoryDiv.appendChild(categorySelect);
  categoryGroup.appendChild(categoryDiv);

  const subcategoryDiv = document.createElement("div");
  subcategoryDiv.className = "flex-1";
  const subcategoryLabel = document.createElement("label");
  subcategoryLabel.setAttribute("for", "subcategory");
  subcategoryLabel.className =
    "block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300";
  subcategoryLabel.textContent = "Subcategoría";

  const subcategorySelect = document.createElement("select");
  subcategorySelect.id = "subcategory-select";
  subcategorySelect.name = "subcategoryId";
  subcategorySelect.className =
    "w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#ad5733] dark:focus:ring-[#f49167] bg-white dark:bg-[#141414] text-gray-900 dark:text-white";

  subcategoryDiv.appendChild(subcategoryLabel);
  subcategoryDiv.appendChild(subcategorySelect);
  categoryGroup.appendChild(subcategoryDiv);
  form.appendChild(categoryGroup);

  const detailsGroup = document.createElement("div");
  detailsGroup.className = "mb-4 flex gap-4";

  const capacityDiv = document.createElement("div");
  capacityDiv.className = "flex-1";
  const capacityLabel = document.createElement("label");
  capacityLabel.setAttribute("for", "capacity");
  capacityLabel.className =
    "block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300";
  capacityLabel.textContent = "Capacidad";

  const capacityInput = document.createElement("input");
  capacityInput.id = "capacity";
  capacityInput.type = "number";
  capacityInput.name = "capacity";
  capacityInput.value = data.capacity || "";
  capacityInput.required = true;
  capacityInput.className =
    "w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#ad5733] dark:focus:ring-[#f49167] bg-white dark:bg-[#141414] text-gray-900 dark:text-white";

  capacityDiv.appendChild(capacityLabel);
  capacityDiv.appendChild(capacityInput);
  detailsGroup.appendChild(capacityDiv);

  const durationDiv = document.createElement("div");
  durationDiv.className = "flex-1";
  const durationLabel = document.createElement("label");
  durationLabel.setAttribute("for", "duration");
  durationLabel.className =
    "block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300";
  durationLabel.textContent = "Duración Hrs";

  const durationInput = document.createElement("input");
  durationInput.id = "duration";
  durationInput.type = "number";
  durationInput.name = "duration";
  durationInput.value = data.duration || "";
  durationInput.placeholder = "Ej: 1.5";
  durationInput.step = "0.1";
  durationInput.required = true;

  durationInput.className =
    "w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#ad5733] dark:focus:ring-[#f49167] bg-white dark:bg-[#141414] text-gray-900 dark:text-white";

  durationDiv.appendChild(durationLabel);
  durationDiv.appendChild(durationInput);
  detailsGroup.appendChild(durationDiv);

  const levelDiv = document.createElement("div");
  levelDiv.className = "flex-1";
  const levelLabel = document.createElement("label");
  levelLabel.setAttribute("for", "level");
  levelLabel.className =
    "block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300";
  levelLabel.textContent = "Nivel";

  const levelSelect = document.createElement("select");
  levelSelect.id = "level";
  levelSelect.name = "level";
  levelSelect.required = true;
  levelSelect.className =
    "w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#ad5733] dark:focus:ring-[#f49167] bg-white dark:bg-[#141414] text-gray-900 dark:text-white";

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

  const priceGroup = document.createElement("div");
  priceGroup.className = "mb-4 text-center";

  const priceLabel = document.createElement("label");
  priceLabel.setAttribute("for", "price");
  priceLabel.className =
    "block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300";
  priceLabel.textContent = "Precio (€)";

  const priceInput = document.createElement("input");
  priceInput.id = "price";
  priceInput.type = "number";
  priceInput.step = "0.01";
  priceInput.name = "price";
  priceInput.value = data.price || 0;
  priceInput.className =
    "w-48 border border-gray-300 dark:border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#ad5733] dark:focus:ring-[#f49167] bg-white dark:bg-[#141414] text-gray-900 dark:text-white";

  priceGroup.appendChild(priceLabel);
  priceGroup.appendChild(priceInput);
  form.appendChild(priceGroup);

  const imageGroup = document.createElement("div");
  imageGroup.className = "mb-4";

  const imageLabel = document.createElement("label");
  imageLabel.setAttribute("for", "imageUrl");
  imageLabel.className =
    "block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300";
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
  imageUploadInput.className =
    "w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#ad5733] dark:focus:ring-[#f49167] bg-white dark:bg-[#141414] text-gray-900 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-200 dark:file:bg-gray-600 file:text-gray-700 dark:file:text-gray-200 hover:file:bg-gray-300 dark:hover:file:bg-gray-500 file:cursor-pointer";

  const uploadBtn = document.createElement("button");
  uploadBtn.type = "button";
  uploadBtn.id = "upload-btn";
  uploadBtn.className =
    "mt-2 bg-[#ad5733] dark:bg-[#f49167] text-white font-bold py-2 px-4 rounded-full hover:bg-[#797b6c] dark:hover:bg-[#ad5733] transition text-sm";
  uploadBtn.textContent = "Subir imagen";

  const imagePreview = document.createElement("div");
  imagePreview.id = "image-preview";
  imagePreview.className = "mt-4";

  if (data.imageUrl) {
    const img = document.createElement("img");
    img.src = data.imageUrl;
    img.alt = "Imagen actual";
    img.className = "max-w-full max-h-36 rounded";
    imagePreview.appendChild(img);
  }

  imageGroup.appendChild(imageLabel);
  imageGroup.appendChild(imageUrlInput);
  imageGroup.appendChild(imageUploadInput);
  imageGroup.appendChild(uploadBtn);
  imageGroup.appendChild(imagePreview);
  form.appendChild(imageGroup);

  const buttonGroup = document.createElement("div");
  buttonGroup.className = "flex gap-4 mt-6";

  const cancelBtn = document.createElement("button");
  cancelBtn.type = "button";
  cancelBtn.textContent = "Cancelar";
  cancelBtn.className =
    "flex-1 bg-gray-500 text-white font-bold py-2 px-6 rounded-full hover:bg-gray-600 transition";
  cancelBtn.onclick = closeModal;

  const submitBtn = document.createElement("button");
  submitBtn.type = "submit";
  submitBtn.textContent = data.id ? "Actualizar Taller" : "Crear Taller";
  submitBtn.className =
    "flex-1 bg-[#ad5733] dark:bg-[#f49167] text-white font-bold py-2 px-6 rounded-full hover:bg-[#797b6c] dark:hover:bg-[#ad5733] transition";

  buttonGroup.appendChild(cancelBtn);
  buttonGroup.appendChild(submitBtn);
  form.appendChild(buttonGroup);

  content.appendChild(form);

  const categories = await getCategories();
  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category.id;
    option.textContent = category.name;
    if (data.categoryId === category.id) option.selected = true;
    categorySelect.appendChild(option);
  });

  if (data.categoryId) {
    await renderSubcategories(data.categoryId);
  } else if (categories.length > 0) {
    await renderSubcategories(categories[0].id);
    categorySelect.value = categories[0].id;
  }

  modeSelect.addEventListener("change", (e) => {
    const placeGroup = document.getElementById("place-group");
    if (e.target.value === "Presencial") {
      placeGroup.style.display = "block";
    } else {
      placeGroup.style.display = "none";

      placeInput.value = "";
      addressInput.value = "";
      coordinatesInput.value = "";
    }
  });

  categorySelect.addEventListener("change", async (e) => {
    const categoryId = e.target.value;
    await renderSubcategories(categoryId);
  });

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
        imagePreview.innerHTML = `<img src="${data.secure_url}" alt="Imagen subida" class="max-w-full max-h-36 rounded" />`;
        showToast("¡Imagen subida correctamente!", "success");
      } else {
        showToast("Error al subir la imagen", "error");
      }
    } catch (error) {
      console.error("Error loading image");
      showToast("Fallo de red", "error");
    }
  });

  form.onsubmit = async (e) => {
    e.preventDefault();
    const currentUser = getCurrentUser();
    const formData = Object.fromEntries(new FormData(form));

    if (formData.mode !== "Presencial") {
      formData.location = "";
      formData.address = "";
      formData.coordinates = "";
    }

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
      coordinates: coordinates,
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

  async function renderSubcategories(categoryId) {
    const subcategories = await getSubcategories();
    const filtered = subcategories.filter(
      (s) => Number(s.categoryId) === Number(categoryId)
    );

    subcategorySelect.innerHTML = "";

    if (filtered.length === 0) {
      const noOption = document.createElement("option");
      noOption.value = "";
      noOption.textContent = "-- No hay subcategorías --";
      noOption.disabled = true;
      noOption.selected = true;
      subcategorySelect.appendChild(noOption);
    } else {
      filtered.forEach((subcategory) => {
        const option = document.createElement("option");
        option.value = subcategory.id;
        option.textContent = subcategory.name;
        if (data.subcategoryId === subcategory.id) option.selected = true;
        subcategorySelect.appendChild(option);
      });
    }
  }

  async function geocodeAddress() {
    const address = addressInput.value.trim();
    const location = placeInput.value.trim();

    if (!address) {
      geocodeStatus.textContent = "❌ Por favor, introduce una dirección";
      geocodeStatus.className = "mt-2 text-sm text-red-600";
      showToast("Por favor, introduce una dirección", "error");
      return;
    }

    if (address && address.length < 3) {
      geocodeStatus.textContent =
        "❌ La dirección es demasiado corta. Añade más detalles";
      geocodeStatus.className = "mt-2 text-sm text-red-600";
      showToast("La dirección es demasiado corta. Añade más detalles", "error");
      return;
    }

    const fullAddress = address;

    geocodeBtn.disabled = true;
    geocodeBtn.textContent = "Buscando...";
    geocodeStatus.textContent = "🔍 Obteniendo coordenadas...";
    geocodeStatus.className = "mt-2 text-sm text-blue-600";

    try {
      let response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          fullAddress
        )}&limit=10&addressdetails=1&countrycodes=es`
      );

      if (!response.ok) {
        throw new Error("Error en la respuesta del servidor");
      }

      let data = await response.json();

      if (!data || data.length === 0) {
        response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            fullAddress + ", Tenerife"
          )}&limit=10&addressdetails=1&countrycodes=es`
        );

        if (!response.ok) {
          throw new Error("Error en la respuesta del servidor");
        }

        data = await response.json();
      }

      if (!data || data.length === 0) {
        response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            address + ", Tenerife"
          )}&limit=10&addressdetails=1&countrycodes=es`
        );

        if (!response.ok) {
          throw new Error("Error en la respuesta del servidor");
        }

        data = await response.json();
      }

      if (data && data.length > 0) {
        const result = data[0];
        const lat = parseFloat(result.lat);
        const lon = parseFloat(result.lon);

        const importance = parseFloat(result.importance || 0);
        const displayName = result.display_name || "";

        coordinatesInput.value = JSON.stringify({ lat: lat, lng: lon });

        if (importance > 0.02) {
          geocodeStatus.textContent = `✅ Coordenadas obtenidas: ${lat.toFixed(
            6
          )}, ${lon.toFixed(6)}`;
          geocodeStatus.className = "mt-2 text-sm text-green-600";
          showToast("Coordenadas obtenidas correctamente", "success");
        } else {
          geocodeStatus.textContent = `⚠️ Coordenadas obtenidas (baja precisión): ${lat.toFixed(
            6
          )}, ${lon.toFixed(6)}`;
          geocodeStatus.className = "mt-2 text-sm text-yellow-600";
          showToast(
            "Coordenadas obtenidas con baja precisión. Considera ser más específico",
            "warning"
          );
        }
      } else {
        geocodeStatus.textContent =
          "❌ No se encontraron coordenadas para esta dirección";
        geocodeStatus.className = "mt-2 text-sm text-red-600";
        showToast("No se encontraron coordenadas para esta dirección", "error");

        setTimeout(() => {
          geocodeStatus.textContent =
            "💡 Sugerencias: Usa una de las direcciones de los ejemplos o añade 'España' al final";
          geocodeStatus.className = "mt-2 text-sm text-blue-600";
        }, 3000);
      }
    } catch (error) {
      console.error("Error en geocodificación:", error);
      geocodeStatus.textContent =
        "❌ Error al obtener coordenadas. Verifica tu conexión";
      geocodeStatus.className = "mt-2 text-sm text-red-600";
      showToast("Error al obtener coordenadas. Verifica tu conexión", "error");
    } finally {
      geocodeBtn.disabled = false;
      geocodeBtn.textContent = "📍 Obtener coordenadas";
    }
  }
}

export function closeModal() {
  const modal = document.getElementById("workshop-modal");
  if (modal) {
    modal.remove();
  }
}
