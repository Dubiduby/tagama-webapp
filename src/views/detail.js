import {
  getCachedWorkshops,
  getCachedCategories,
  getCachedSubcategories,
  updateWorkshopCache,
  clearWorkshopsCache,
} from "../utils/cache.js";
import dayjs from "../utils/day.js";
import { getCurrentUser, updateUser } from "../api/apiUsers.js";
import { showToast } from "../utils/toastify.js";
import Toastify from "toastify-js";
import { updateWorkshop, deleteWorkshop } from "../api/apiWorkshops.js";
import { initMap } from "../utils/leaflet.js";
import { showPaymentModal } from "../components/modals/paymentModal.js";
import { createEditWorkshopModal } from "../components/modals/formModal.js";
import { showConfirmModal } from "../components/modals/confirmModal.js";
import { navigate } from "../router.js";

export default async function detail(container, id) {
  // Limpia solo el container, no el body
  container.innerHTML = "";

  const currentUser = getCurrentUser();
  let isEnrolled = currentUser.enrolledWorkshops.includes(id);

  const [workshopsCache, categories, subcategories] = await Promise.all([
    getCachedWorkshops(),
    getCachedCategories(),
    getCachedSubcategories(),
  ]);

  const workshopDetail = workshopsCache.find((item) => item.id === id);

  const category = categories.find(
    (item) => Number(item.id) === Number(workshopDetail.categoryId)
  );
  const subcategory = subcategories.find(
    (item) => Number(item.id) === Number(workshopDetail.subcategoryId)
  );
  const dateTime = dayjs.unix(workshopDetail.date);
  const hours = Math.floor(workshopDetail.duration / 60);
  const minutes = workshopDetail.duration % 60;
  const formattedDuration =
    minutes === 0 ? `${hours}h` : `${hours}h ${minutes}min`;

  // Back link
  const backLink = document.createElement("a");
  backLink.href = "/workshops";
  backLink.className =
    "inline-flex items-center text-indigo-600 hover:text-indigo-700 font-medium mb-6 transition-colors";
  backLink.innerHTML = `<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>Volver a Talleres`;
  container.appendChild(backLink);

  // Contenedor principal
  const detailContent = document.createElement("div");
  detailContent.className =
    "max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8";
  container.appendChild(detailContent);

  // Columna principal (imagen, tags, título, etc.)
  const mainColumn = document.createElement("div");
  mainColumn.className = "lg:col-span-2 space-y-6";
  detailContent.appendChild(mainColumn);

  // Imagen arriba
  const imageDiv = document.createElement("div");
  imageDiv.className = "w-full h-96 rounded-xl overflow-hidden";
  const img = document.createElement("img");
  img.src = workshopDetail.imageUrl;
  img.alt = "Imagen del taller";
  img.className = "w-full h-full object-cover";
  imageDiv.appendChild(img);
  mainColumn.appendChild(imageDiv);

  // Tags
  const tagsDiv = document.createElement("div");
  tagsDiv.className = "flex gap-2 flex-wrap";

  const subcategoryTag = document.createElement("span");
  subcategoryTag.className =
    "px-3 py-1 bg-indigo-100 text-indigo-800 text-sm font-medium rounded-full";
  subcategoryTag.textContent = subcategory.name;
  tagsDiv.appendChild(subcategoryTag);

  const categoryTag = document.createElement("span");
  categoryTag.className =
    "px-3 py-1 bg-gray-100 text-gray-800 text-sm font-medium rounded-full";
  categoryTag.textContent = category.name;
  tagsDiv.appendChild(categoryTag);
  mainColumn.appendChild(tagsDiv);

  // Title
  const title = document.createElement("h1");
  title.className = "text-3xl font-bold text-gray-900";
  title.textContent = workshopDetail.title;
  mainColumn.appendChild(title);

  // Instructor
  const instructor = document.createElement("div");
  instructor.className = "text-lg text-gray-600";
  instructor.textContent = workshopDetail.instructorName;
  mainColumn.appendChild(instructor);

  // Tabs y contenido en un solo box
  const tabsBox = document.createElement("div");
  tabsBox.className = "bg-white rounded-xl shadow-sm border border-gray-200";

  // Tabs
  const tabsDiv = document.createElement("div");
  tabsDiv.className = "flex border-b border-gray-200";
  const overviewTab = document.createElement("button");
  overviewTab.className =
    "flex-1 px-6 py-4 text-sm font-medium text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50";
  overviewTab.dataset.tab = "overview";
  overviewTab.textContent = "Descripción";
  const requirementsTab = document.createElement("button");
  requirementsTab.className =
    "flex-1 px-6 py-4 text-sm font-medium text-gray-500 border-b-2 border-transparent hover:text-gray-700 hover:border-gray-300 transition-colors";
  requirementsTab.dataset.tab = "requirements";
  requirementsTab.textContent = "Requisitos";
  tabsDiv.appendChild(overviewTab);
  tabsDiv.appendChild(requirementsTab);
  tabsBox.appendChild(tabsDiv);

  // Overview content
  const overviewDiv = document.createElement("div");
  overviewDiv.className = "p-6";
  overviewDiv.id = "overview";
  const overviewP = document.createElement("p");
  overviewP.className = "text-gray-700 leading-relaxed";
  overviewP.textContent = workshopDetail.overview;
  overviewDiv.appendChild(overviewP);
  tabsBox.appendChild(overviewDiv);

  // Requirements content
  const requirementsDiv = document.createElement("div");
  requirementsDiv.className = "p-6";
  requirementsDiv.id = "requirements";
  requirementsDiv.style.display = "none";
  const reqP = document.createElement("p");
  reqP.className = "text-gray-700 leading-relaxed";
  reqP.textContent = workshopDetail.requirements;
  requirementsDiv.appendChild(reqP);
  tabsBox.appendChild(requirementsDiv);

  // Añade el box al mainColumn
  mainColumn.appendChild(tabsBox);

  if (workshopDetail.mode === "Presencial") {
    // Location
    const locationDiv = document.createElement("div");
    locationDiv.className = "bg-gray-50 rounded-lg p-6";
    const locationSpan = document.createElement("span");
    locationSpan.className = "block text-sm font-medium text-gray-700 mb-2";
    locationSpan.textContent = "Ubicación";
    const locationP = document.createElement("p");
    locationP.className = "text-gray-900";
    locationP.textContent = workshopDetail.address;
    locationDiv.appendChild(locationSpan);
    locationDiv.appendChild(locationP);
    mainColumn.appendChild(locationDiv);

    // Map
    const mapDiv = document.createElement("div");
    mapDiv.id = "map";
    mapDiv.className = "w-full rounded-lg overflow-hidden";
    mapDiv.style.height = "50vh";
    mainColumn.appendChild(mapDiv);

    // Verificar que las coordenadas existen antes de inicializar el mapa
    if (workshopDetail.coordinates) {
      console.log("Coordinates for map:", workshopDetail.coordinates);
      initMap(
        workshopDetail.coordinates,
        workshopDetail.address || workshopDetail.place
      );
    } else {
      console.warn("No coordinates available for workshop:", workshopDetail.id);
      // Mostrar mensaje de que no hay mapa disponible
      const noMapDiv = document.createElement("div");
      noMapDiv.className =
        "flex items-center justify-center h-full bg-gray-100 text-gray-500";
      noMapDiv.textContent = "No hay mapa disponible para este workshop";
      mapDiv.appendChild(noMapDiv);
    }
  }

  // Sidebar a la derecha
  const sidebar = document.createElement("aside");
  sidebar.className = "space-y-6";

  const priceDiv = document.createElement("div");
  priceDiv.className = "text-3xl font-bold text-gray-900";
  priceDiv.textContent =
    workshopDetail.price === 0 ? "Gratis" : `${workshopDetail.price}€`;
  sidebar.appendChild(priceDiv);

  // Función para crear elementos de información con iconos
  function createInfoItem(iconSvg, text, className = "") {
    const div = document.createElement("div");
    div.className = `flex items-center gap-3 text-gray-700 ${className}`;
    const icon = document.createElement("span");
    icon.innerHTML = iconSvg;
    icon.className = "flex-shrink-0";
    const span = document.createElement("span");
    span.textContent = text;
    div.appendChild(icon);
    div.appendChild(span);
    return div;
  }

  // Fecha con icono
  const dateDiv = createInfoItem(
    `<svg width="20" height="20" fill="none" stroke="#2563eb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>`,
    dateTime.format("dddd, D MMMM YYYY, HH:mm")
  );
  sidebar.appendChild(dateDiv);

  // Hora con icono
  const timeDiv = createInfoItem(
    `<svg width="20" height="20" fill="none" stroke="#2563eb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>`,
    workshopDetail.duration + " h"
  );
  sidebar.appendChild(timeDiv);

  // Modo (ubicación) con icono
  const modeDiv = createInfoItem(
    `<svg width="20" height="20" fill="none" stroke="#2563eb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M12 21c-4.418 0-8-4.03-8-9a8 8 0 1 1 16 0c0 4.97-3.582 9-8 9z"/><circle cx="12" cy="12" r="3"/></svg>`,
    workshopDetail.mode
  );
  sidebar.appendChild(modeDiv);

  // Plazas con icono
  const spotsDiv = createInfoItem(
    `<svg width="20" height="20" fill="none" stroke="#2563eb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><circle cx="9" cy="7" r="4"/><circle cx="17" cy="7" r="4"/><path d="M2 21v-2a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4v2"/></svg>`,
    `${workshopDetail.enrolled.length} plazas disponibles de ${workshopDetail.capacity}`
  );
  sidebar.appendChild(spotsDiv);

  // Nivel con icono
  const levelDiv = createInfoItem(
    `<svg width="20" height="20" fill="none" stroke="#2563eb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>`,
    workshopDetail.level || "No especificado"
  );
  sidebar.appendChild(levelDiv);

  // Botón enroll/cancel
  const enrollBtn = document.createElement("button");
  enrollBtn.className =
    "w-full px-6 py-3 rounded-lg font-medium transition-colors";
  if (isEnrolled) {
    enrollBtn.textContent = "Cancelar";
    enrollBtn.className += " bg-red-600 text-white hover:bg-red-700";
  } else {
    enrollBtn.textContent = "Inscribirse";
    enrollBtn.className += " bg-indigo-600 text-white hover:bg-indigo-700";
  }

  sidebar.appendChild(enrollBtn);

  // Edit and delete buttons
  const editBtn = document.createElement("button");
  editBtn.className =
    "w-full px-6 py-3 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors";
  editBtn.textContent = "Editar";
  editBtn.style.display = "none";
  const deleteBtn = document.createElement("button");
  deleteBtn.className =
    "w-full px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors";
  deleteBtn.textContent = "Eliminar";
  deleteBtn.style.display = "none";

  // if is created workshop then hide enroll btn
  if (currentUser.createdWorkshops.includes(id)) {
    enrollBtn.style.display = "none";
    editBtn.style.display = "block";
    deleteBtn.style.display = "block";
  }

  sidebar.appendChild(editBtn);
  sidebar.appendChild(deleteBtn);
  detailContent.appendChild(sidebar);

  // Tabs logic
  [overviewTab, requirementsTab].forEach((tab) => {
    tab.addEventListener("click", () => {
      // Update tab styles
      [overviewTab, requirementsTab].forEach((t) => {
        t.classList.remove(
          "text-indigo-600",
          "border-indigo-600",
          "bg-indigo-50"
        );
        t.classList.add("text-gray-500", "border-transparent");
      });
      tab.classList.remove("text-gray-500", "border-transparent");
      tab.classList.add("text-indigo-600", "border-indigo-600", "bg-indigo-50");

      // Update content visibility
      overviewDiv.style.display =
        tab.dataset.tab === "overview" ? "block" : "none";
      requirementsDiv.style.display =
        tab.dataset.tab === "requirements" ? "block" : "none";
    });
  });

  enrollBtn.addEventListener("click", async () => {
    async function updateEnrollment(enroll) {
      if (enroll) {
        currentUser.enrolledWorkshops.push(id);
        workshopDetail.enrolled.push(currentUser.id);
      } else {
        currentUser.enrolledWorkshops = currentUser.enrolledWorkshops.filter(
          (wid) => wid !== id
        );
        workshopDetail.enrolled = workshopDetail.enrolled.filter(
          (uid) => uid !== currentUser.id
        );
      }
      console.log(workshopDetail.enrolled);
      const [updatedWorkshop, updatedUser] = await Promise.all([
        updateWorkshop({
          id: String(id),
          enrolled: workshopDetail.enrolled,
        }),
        updateUser({
          enrolledWorkshops: currentUser.enrolledWorkshops,
        }),
      ]);
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));
      updateWorkshopCache(updatedWorkshop);
      isEnrolled = enroll;
    }

    function updateButton(enrolled) {
      enrollBtn.textContent = enrolled ? "Cancelar" : "Inscribirse";
      enrollBtn.className =
        "w-full px-6 py-3 rounded-lg font-medium transition-colors";
      if (enrolled) {
        enrollBtn.className += " bg-red-600 text-white hover:bg-red-700";
      } else {
        enrollBtn.className += " bg-indigo-600 text-white hover:bg-indigo-700";
      }
      enrollBtn.disabled = false;
    }

    // Cancelar inscripción
    if (isEnrolled) {
      showConfirmModal({
        message: "¿Estás seguro de que quieres cancelar tu inscripción?",
        buttonText: "cancelar",
        buttonColor: "red",
        onConfirm: async () => {
          enrollBtn.disabled = true;
          enrollBtn.textContent = "Procesando...";
          try {
            await updateEnrollment(false);
            showToast("¡Inscripción cancelada!", "success");
            setTimeout(() => window.location.reload(), 1200);
          } catch {
            showToast("Error al cancelar la inscripción", "error");
            updateButton(true);
          }
        },
      });
      return; // <---- IMPORTANTE: Termina aquí para no seguir con inscripción
    }

    // Inscripción gratuita
    if (workshopDetail.price === 0) {
      enrollBtn.disabled = true;
      enrollBtn.textContent = "Procesando...";
      try {
        await updateEnrollment(true);
        showToast("Te has inscrito exitosamente", "success");
        updateButton(true);
      } catch {
        showToast("Error al actualizar usuario o taller", "error");
        updateButton(false);
      }
      return;
    }

    // Inscripción de pago
    showPaymentModal(async () => {
      enrollBtn.disabled = true;
      enrollBtn.textContent = "Procesando...";
      try {
        await updateEnrollment(true);
        showToast("Te has inscrito exitosamente", "success");
        updateButton(true);
      } catch {
        showToast("Error al actualizar usuario o taller", "error");
        updateButton(false);
      }
    });
  });

  editBtn.addEventListener("click", (event) => {
    createEditWorkshopModal({
      data: workshopDetail,
      onSubmit: async (formData) => {
        try {
          const updatedWorkshop = await updateWorkshop(formData);
          updateWorkshopCache(updatedWorkshop);
          showToast("Taller actualizado exitosamente", "success");
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        } catch (error) {
          showToast("Error al actualizar el taller", "error");
          console.error("Error updating workshop:", error);
        }
      },
    });
  });

  deleteBtn.addEventListener("click", () => {
    showConfirmModal({
      message:
        "¿Estás seguro de que quieres eliminar el workshop?<br><br>Esta acción no se puede deshacer.",
      buttonText: "eliminar",
      buttonColor: "red",
      onConfirm: async () => {
        try {
          const workshopDeleted = await deleteWorkshop(id);

          clearWorkshopsCache(),
            getCachedWorkshops(),
            showToast("Taller eliminado correctamente", "success");

          setTimeout(() => {
            navigate("/workshops");
          }, 2000); // Wait 2 seconds for toast to be visible
        } catch (error) {
          showToast("Error al eliminar el taller", "error");
          console.error("Error deleting workshop:", error);
        }
      },
    });
  });
}
