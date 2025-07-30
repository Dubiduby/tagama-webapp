import "../assets/styles/detail.css";
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
  console.log(id);
  const workshopDetail = workshopsCache.find(
    (item) => Number(item.id) === Number(id)
  );
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
  backLink.className = "back-link";
  backLink.textContent = "< Volver a Talleres";
  container.appendChild(backLink);

  // Contenedor principal
  const detailContent = document.createElement("div");
  detailContent.className = "workshop-detail-content";
  container.appendChild(detailContent);

  // Columna principal (imagen, tags, título, etc.)
  const mainColumn = document.createElement("div");
  mainColumn.className = "workshop-main-column";
  detailContent.appendChild(mainColumn);

  // Imagen arriba
  const imageDiv = document.createElement("div");
  imageDiv.className = "workshop-image";
  const img = document.createElement("img");
  img.src = workshopDetail.imageUrl;
  img.alt = "Imagen del taller";
  imageDiv.appendChild(img);
  mainColumn.appendChild(imageDiv);

  // Tags
  const tagsDiv = document.createElement("div");
  tagsDiv.className = "workshop-tags";

  const subcategoryTag = document.createElement("span");
  subcategoryTag.className = "tag";
  subcategoryTag.textContent = subcategory.name;
  tagsDiv.appendChild(subcategoryTag);

  const categoryTag = document.createElement("span");
  categoryTag.className = "tag";
  categoryTag.textContent = category.name;
  tagsDiv.appendChild(categoryTag);
  mainColumn.appendChild(tagsDiv);

  // Title
  const title = document.createElement("h1");
  title.className = "workshop-title";
  title.textContent = workshopDetail.title;
  mainColumn.appendChild(title);

  // Instructor
  const instructor = document.createElement("div");
  instructor.className = "workshop-instructor";
  instructor.textContent = workshopDetail.instructorName;
  mainColumn.appendChild(instructor);

  // Tabs y contenido en un solo box
  const tabsBox = document.createElement("div");
  tabsBox.className = "workshop-tabs-box";

  // Tabs
  const tabsDiv = document.createElement("div");
  tabsDiv.className = "workshop-tabs";
  const overviewTab = document.createElement("button");
  overviewTab.className = "tab active";
  overviewTab.dataset.tab = "overview";
  overviewTab.textContent = "Descripción";
  const requirementsTab = document.createElement("button");
  requirementsTab.className = "tab";
  requirementsTab.dataset.tab = "requirements";
  requirementsTab.textContent = "Requisitos";
  tabsDiv.appendChild(overviewTab);
  tabsDiv.appendChild(requirementsTab);
  tabsBox.appendChild(tabsDiv);

  // Overview content
  const overviewDiv = document.createElement("div");
  overviewDiv.className = "workshop-tab-content";
  overviewDiv.id = "overview";
  const overviewP = document.createElement("p");
  overviewP.textContent = workshopDetail.overview;
  overviewDiv.appendChild(overviewP);
  tabsBox.appendChild(overviewDiv);

  // Requirements content
  const requirementsDiv = document.createElement("div");
  requirementsDiv.className = "workshop-tab-content";
  requirementsDiv.id = "requirements";
  requirementsDiv.style.display = "none";
  const reqP = document.createElement("p");
  reqP.textContent = workshopDetail.requirements;
  requirementsDiv.appendChild(reqP);
  tabsBox.appendChild(requirementsDiv);

  // Añade el box al mainColumn
  mainColumn.appendChild(tabsBox);

  if (workshopDetail.mode === "Presencial") {
    // Location
    const locationDiv = document.createElement("div");
    locationDiv.className = "workshop-location";
    const locationSpan = document.createElement("span");
    locationSpan.textContent = "Ubicación";
    const locationP = document.createElement("p");
    locationP.textContent = workshopDetail.address;
    locationDiv.appendChild(locationSpan);
    locationDiv.appendChild(locationP);
    mainColumn.appendChild(locationDiv);

    // Map
    const mapDiv = document.createElement("div");
    mapDiv.id = "map";
    mapDiv.className = "workshop-map";
    mapDiv.style.height = "50vh";
    mainColumn.appendChild(mapDiv);
    initMap(workshopDetail.coordinates, workshopDetail.location);
  }

  // Sidebar a la derecha
  const sidebar = document.createElement("aside");
  sidebar.className = "workshop-sidebar";

  const priceDiv = document.createElement("div");
  priceDiv.className = "workshop-price";
  priceDiv.textContent =
    workshopDetail.price === 0 ? "Gratis" : `${workshopDetail.price}€`;
  sidebar.appendChild(priceDiv);

  // Fecha con icono
  const dateDiv = document.createElement("div");
  dateDiv.className = "workshop-date";
  dateDiv.style.display = "flex";
  dateDiv.style.alignItems = "center";
  const calendarIcon = document.createElement("span");
  calendarIcon.innerHTML = `<svg width="20" height="20" fill="none" stroke="#2563eb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>`;
  calendarIcon.style.marginRight = "8px";
  dateDiv.appendChild(calendarIcon);
  const dateText = document.createElement("span");
  dateText.textContent = dateTime.format("dddd, D MMMM YYYY, HH:mm");
  dateDiv.appendChild(dateText);
  sidebar.appendChild(dateDiv);

  // Hora con icono
  const timeDiv = document.createElement("div");
  timeDiv.className = "workshop-time";
  timeDiv.style.display = "flex";
  timeDiv.style.alignItems = "center";
  const clockIcon = document.createElement("span");
  clockIcon.innerHTML = `<svg width="20" height="20" fill="none" stroke="#2563eb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>`;
  clockIcon.style.marginRight = "8px";
  timeDiv.appendChild(clockIcon);
  const timeText = document.createElement("span");
  timeText.textContent = formattedDuration;
  timeDiv.appendChild(timeText);
  sidebar.appendChild(timeDiv);

  // Modo (ubicación) con icono
  const modeDiv = document.createElement("div");
  modeDiv.className = "workshop-mode";
  modeDiv.style.display = "flex";
  modeDiv.style.alignItems = "center";
  const locationIcon = document.createElement("span");
  locationIcon.innerHTML = `<svg width="20" height="20" fill="none" stroke="#2563eb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M12 21c-4.418 0-8-4.03-8-9a8 8 0 1 1 16 0c0 4.97-3.582 9-8 9z"/><circle cx="12" cy="12" r="3"/></svg>`;
  locationIcon.style.marginRight = "8px";
  modeDiv.appendChild(locationIcon);
  const modeText = document.createElement("span");
  modeText.textContent = workshopDetail.mode;
  modeDiv.appendChild(modeText);
  sidebar.appendChild(modeDiv);

  // Plazas con icono
  const spotsDiv = document.createElement("div");
  spotsDiv.className = "workshop-spots";
  spotsDiv.style.display = "flex";
  spotsDiv.style.alignItems = "center";
  const peopleIcon = document.createElement("span");
  peopleIcon.innerHTML = `<svg width="20" height="20" fill="none" stroke="#2563eb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><circle cx="9" cy="7" r="4"/><circle cx="17" cy="7" r="4"/><path d="M2 21v-2a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4v2"/></svg>`;
  peopleIcon.style.marginRight = "8px";
  spotsDiv.appendChild(peopleIcon);
  const spotsText = document.createElement("span");
  spotsText.textContent = `${workshopDetail.enrolled.length} plazas disponibles de ${workshopDetail.capacity}`;
  spotsDiv.appendChild(spotsText);
  sidebar.appendChild(spotsDiv);

  // Botón enroll/cancel
  const enrollBtn = document.createElement("button");
  enrollBtn.className = "enroll-btn";
  if (isEnrolled) {
    enrollBtn.textContent = "Cancelar";
    enrollBtn.style.background = "#e10505ff";
    enrollBtn.style.color = "#fff";
  } else {
    enrollBtn.textContent = "Inscribirse";
    enrollBtn.style.background = "";
    enrollBtn.style.color = "";
  }

  sidebar.appendChild(enrollBtn);

  // Edit and delete buttons
  const editBtn = document.createElement("button");
  editBtn.className = "edit-btn";
  editBtn.textContent = "Editar";
  editBtn.style.display = "none";
  const deleteBtn = document.createElement("button");
  deleteBtn.className = "delete-workshop-button";
  deleteBtn.textContent = "Eliminar";
  deleteBtn.style.display = "none";

  // if is created workshop then hide enroll btn
  if (currentUser.createdWorkshops.includes(String(id))) {
    enrollBtn.style.display = "none";
    editBtn.style.display = "block";
    deleteBtn.style.display = "block";
  }

  sidebar.appendChild(editBtn);
  sidebar.appendChild(deleteBtn); // Ahora el botón de eliminar está justo debajo del de editar
  detailContent.appendChild(sidebar);

  // Tabs logic
  [overviewTab, requirementsTab].forEach((tab) => {
    tab.addEventListener("click", () => {
      overviewTab.classList.remove("active");
      requirementsTab.classList.remove("active");
      tab.classList.add("active");
      overviewDiv.style.display =
        tab.dataset.tab === "overview" ? "block" : "none";
      requirementsDiv.style.display =
        tab.dataset.tab === "requirements" ? "block" : "none";
    });
  });

  enrollBtn.addEventListener("click", async () => {
    // Función interna para actualizar usuario y taller
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
      const [updatedWorkshop, updatedUser] = await Promise.all([
        updateWorkshop({ id: id, enrolled: workshopDetail.enrolled }),
        updateUser({ enrolledWorkshops: currentUser.enrolledWorkshops }),
      ]);
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));
      updateWorkshopCache(updatedWorkshop);
      isEnrolled = enroll;
    }

    // Función interna para actualizar el botón
    function updateButton(enrolled) {
      enrollBtn.textContent = enrolled ? "Cancelar" : "Inscribirse";
      enrollBtn.style.background = enrolled ? "#e10505ff" : "";
      enrollBtn.style.color = enrolled ? "#fff" : "";
      enrollBtn.disabled = false;
    }

    // Cancelar inscripción
    if (isEnrolled) {
      let cancelToastId = null;
      if (cancelToastId) return;
      cancelToastId = Toastify({
        text: `<span>¿Estás seguro de que quieres cancelar tu inscripción?</span>
          <button id=\"confirm-cancel-btn\" style=\"margin-left:10px;padding:4px 10px;background:#e10505ff;color:#fff;border:none;border-radius:4px;cursor:pointer;\">Sí, cancelar</button>`,
        duration: -1,
        gravity: "top",
        position: "center",
        close: true,
        escapeMarkup: false,
        backgroundColor: "#e10505ff",
        stopOnFocus: true,
        callback: () => {
          cancelToastId = null;
        },
      }).showToast();

      setTimeout(() => {
        const confirmBtn = document.getElementById("confirm-cancel-btn");
        if (confirmBtn) {
          confirmBtn.onclick = async (e) => {
            e.stopPropagation();
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
          };
        }
      }, 100);
      return;
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
