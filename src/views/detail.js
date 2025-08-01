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

  const backLink = document.createElement("a");
  backLink.href = "/workshops";
  backLink.className =
    "inline-flex items-center text-dark-orange hover:text-dark-green font-medium mb-6 transition-colors dark:text-light-orange dark:hover:text-[#d8c3a9]";
  backLink.innerHTML = `<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>Volver a Talleres`;
  container.appendChild(backLink);

  const detailContent = document.createElement("div");
  detailContent.className =
    "max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 items-start";
  container.appendChild(detailContent);

  const mainColumn = document.createElement("div");
  mainColumn.className = "lg:col-span-2 space-y-6";
  detailContent.appendChild(mainColumn);

  const imageDiv = document.createElement("div");
  imageDiv.className = "w-full h-96 rounded-xl overflow-hidden";
  const img = document.createElement("img");
  img.src = workshopDetail.imageUrl;
  img.alt = "Imagen del taller";
  img.className = "w-full h-full object-cover";
  imageDiv.appendChild(img);
  mainColumn.appendChild(imageDiv);

  const tagsDiv = document.createElement("div");
  tagsDiv.className = "flex gap-2 flex-wrap";

  const subcategoryTag = document.createElement("span");
  subcategoryTag.className =
    "px-3 py-1 bg-dark-green text-white text-sm font-medium rounded-full";
  subcategoryTag.textContent = subcategory.name;
  tagsDiv.appendChild(subcategoryTag);

  const categoryTag = document.createElement("span");
  categoryTag.className =
    "px-3 py-1 bg-dark-orange text-white text-sm font-medium rounded-full";
  categoryTag.textContent = category.name;
  tagsDiv.appendChild(categoryTag);
  mainColumn.appendChild(tagsDiv);

  const title = document.createElement("h1");
  title.className = "text-3xl font-bold text-[var(--color-title)]";
  title.textContent = workshopDetail.title;
  mainColumn.appendChild(title);

  const instructor = document.createElement("div");
  instructor.className =
    "text-lg text-dark-orange font-semibold text-3xl dark:text-light-orange";
  instructor.textContent = `  ${workshopDetail.instructorName} `;
  mainColumn.appendChild(instructor);

  const tabsBox = document.createElement("div");
  tabsBox.className =
    "bg-white rounded-xl shadow-sm border border-[#e4e6eb] bg-white dark:bg-dark-bg dark:text-[#f4f2f0]  dark:border-gray-500 dark:border-opacity-50";

  const tabsDiv = document.createElement("div");
  tabsDiv.className =
    "flex rounded-xl border-b border-gray-500  border-opacity-50  dark:border-gray-500 dark:border-opacity-50 text-3xl  ";
  const overviewTab = document.createElement("button");
  overviewTab.className =
    "flex-1 px-6 py-4 text-sm rounded-xl rounded-xl font-medium  text-dark-bg hover:border-b hover:border-dark-green  bg-white dark:bg-dark-bg dark:text-[#d8c3a9]  ";
  overviewTab.dataset.tab = "overview";
  overviewTab.textContent = "Descripción";
  const requirementsTab = document.createElement("button");
  requirementsTab.className =
    "flex-1 px-6 py-4 text-sm rounded-xl   font-medium bg-white text-dark-bg hover:border-b hover:border-dark-green  dark:bg-dark-bg dark:text-[#d8c3a9] ";
  requirementsTab.dataset.tab = "requirements";
  requirementsTab.textContent = "Requisitos";
  tabsDiv.appendChild(overviewTab);
  tabsDiv.appendChild(requirementsTab);
  tabsBox.appendChild(tabsDiv);

  const overviewDiv = document.createElement("div");
  overviewDiv.className = "p-6";
  overviewDiv.id = "overview";
  const overviewP = document.createElement("p");
  overviewP.className = "text-dark-bg leading-relaxed   dark:text-white";
  overviewP.textContent = workshopDetail.overview;
  overviewDiv.appendChild(overviewP);
  tabsBox.appendChild(overviewDiv);

  const requirementsDiv = document.createElement("div");
  requirementsDiv.className = "p-6";
  requirementsDiv.id = "requirements";
  requirementsDiv.style.display = "none";
  const reqP = document.createElement("p");
  reqP.className = "text-dark-bg leading-relaxed  dark:text-white";
  reqP.textContent = workshopDetail.requirements;
  requirementsDiv.appendChild(reqP);
  tabsBox.appendChild(requirementsDiv);

  mainColumn.appendChild(tabsBox);

  if (workshopDetail.mode === "Presencial") {
    const locationDiv = document.createElement("div");
    locationDiv.className =
      "bg-white rounded-lg p-6 dark:bg-[#202020] border border-[#e4e6eb] dark:border-gray-500 dark:border-opacity-50";
    const locationSpan = document.createElement("span");
    locationSpan.className =
      "block text-sm font-medium text-black mb-2 dark:text-light-yellow";
    locationSpan.textContent = "Ubicación";
    const locationP = document.createElement("p");
    locationP.className = "text-dark-bg dark:text-white";
    locationP.textContent = workshopDetail.address;
    locationDiv.appendChild(locationSpan);
    locationDiv.appendChild(locationP);
    mainColumn.appendChild(locationDiv);

    const mapDiv = document.createElement("div");
    mapDiv.id = "map";
    mapDiv.className = "w-full rounded-lg overflow-hidden";
    mapDiv.style.height = "50vh";
    mainColumn.appendChild(mapDiv);

    if (workshopDetail.coordinates) {
      initMap(
        workshopDetail.coordinates,
        workshopDetail.address || workshopDetail.place
      );
    } else {
      console.warn("No coordinates available for workshop:", workshopDetail.id);

      const noMapDiv = document.createElement("div");
      noMapDiv.className =
        "flex items-center justify-center h-full bg-gray-100 text-gray-500";
      noMapDiv.textContent = "No hay mapa disponible para este workshop";
      mapDiv.appendChild(noMapDiv);
    }
  }

  const sidebar = document.createElement("aside");
  sidebar.className =
    "space-y-6 bg-[#ffff] p-5 rounded-xl border border-[#e4e6eb] dark:bg-[var(--color-2bg)] dark:border-gray-500 dark:border-opacity-50";

  const priceDiv = document.createElement("div");
  priceDiv.className = "text-3xl font-bold text-dark-bg dark:text-white";
  priceDiv.textContent =
    workshopDetail.price === 0 ? "Gratis" : `${workshopDetail.price}€`;
  sidebar.appendChild(priceDiv);

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

  const dateDiv = createInfoItem(
    `<svg xmlns="http://www.w3.org/2000/svg"
       width="18"
       height="18"
       viewBox="0 0 24 24"
       fill="none"
       stroke="currentColor"
       stroke-width="2"
       stroke-linecap="round"
       stroke-linejoin="round"
       class="w-5 h-5 inline-block object-contain mr-1 align-middle text-dark-orange dark:text-light-orange"
       aria-hidden="true">
    <path d="M8 2v4"/>
    <path d="M16 2v4"/>
    <rect width="18" height="18" x="3" y="4" rx="2"/>
    <path d="M3 10h18"/>
  </svg>`,
    dateTime.format("dddd, D MMMM YYYY, HH:mm"),
    "class= dark:text-yellow-50"
  );
  sidebar.appendChild(dateDiv);

  const timeDiv = createInfoItem(
    `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 inline-block object-contain mr-1 align-middle text-dark-orange dark:text-light-orange">
  <path stroke-linecap="round" stroke-linejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
</svg>`,
    workshopDetail.duration + " h",
    "class= dark:text-yellow-50"
  );
  sidebar.appendChild(timeDiv);

  const modeDiv = createInfoItem(
    ` <svg xmlns="http://www.w3.org/2000/svg"
       width="24"
       height="24"
       viewBox="0 0 24 24"
       fill="none"
       stroke="currentColor"
       stroke-width="2"
       stroke-linecap="round"
       stroke-linejoin="round"
       class="w-5 h-5 inline-block object-contain mr-1 align-middle text-dark-orange dark:text-light-orange">
    <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>`,
    workshopDetail.mode,
    "class= dark:text-yellow-50"
  );
  sidebar.appendChild(modeDiv);

  const spotsDiv = createInfoItem(
    `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 inline-block object-contain mr-1 align-middle text-dark-orange dark:text-light-orange">
  <path stroke-linecap="round" stroke-linejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
</svg>`,
    `${workshopDetail.enrolled.length} plazas disponibles de ${workshopDetail.capacity}`,
    "class= dark:text-yellow-50"
  );
  sidebar.appendChild(spotsDiv);

  const levelDiv = createInfoItem(
    `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5 inline-block object-contain mr-1 align-middle text-dark-orange dark:text-light-orange"><path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z"/><path d="M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12"/><path d="M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17"/></svg>`,
    workshopDetail.level || "No especificado",
    "class= dark:text-yellow-50"
  );
  sidebar.appendChild(levelDiv);

  const enrollBtn = document.createElement("button");
  enrollBtn.className =
    "w-full px-6 py-3 rounded-lg font-medium transition-colors";
  if (isEnrolled) {
    enrollBtn.textContent = "Cancelar";
    enrollBtn.className +=
      " bg-red-500 text-white hover:bg-red-600 dark:bg-red-500 dark:hover:bg-red-600";
  } else {
    enrollBtn.textContent = "Inscribirse";
    enrollBtn.className +=
      " bg-dark-orange text-white hover:bg-[#934728] dark:bg-dark-green dark:text-white dark:hover:bg-[#5f6155]";
  }

  sidebar.appendChild(enrollBtn);

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

  if (currentUser.createdWorkshops.includes(id)) {
    enrollBtn.style.display = "none";
    editBtn.style.display = "block";
    deleteBtn.style.display = "block";
  }

  sidebar.appendChild(editBtn);
  sidebar.appendChild(deleteBtn);
  detailContent.appendChild(sidebar);

  [overviewTab, requirementsTab].forEach((tab) => {
    tab.addEventListener("click", () => {
      [overviewTab, requirementsTab].forEach((t) => {
        t.classList.remove(
          "text-indigo-600",
          "border-b",
          "bg-dark-orange",
          "dark:bg-dark-orange"
        );
        t.classList.add("text-gray-500", "border-transparent");
      });
      tab.classList.remove(
        "text-gray-500",
        "border-transparent",
        "border-b",
        "dark:text-[#d8c3a9]"
      );
      tab.classList.add(
        "text-dark-bg",
        "border-b",
        "border-dark-green",
        "dark:text-light-yellow"
      );

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
      return;
    }

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
          }, 2000);
        } catch (error) {
          showToast("Error al eliminar el taller", "error");
          console.error("Error deleting workshop:", error);
        }
      },
    });
  });
}
