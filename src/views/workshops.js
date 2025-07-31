import { showToast } from "../utils/toastify";
import { getCurrentUser, updateUser } from "../api/apiUsers";
import {
  getCachedWorkshops,
  getCachedCategories,
  getCachedSubcategories,
  updateWorkshopCache,
} from "../utils/cache.js";
import { renderWorkshops } from "../utils/renderCards.js";
import { createWorkshop } from "../api/apiWorkshops.js";
import { createEditWorkshopModal } from "../components/modals/formModal.js";

export default function workshops(container) {
  container.innerHTML = "";
  const app = document.getElementById("app");

  const workshopsContainer = document.createElement("div");
  workshopsContainer.className = "max-w-7xl mx-auto p-6";

  const workshopsWrapper = document.createElement("div");
  workshopsWrapper.className = "rounded-xl overflow-hidden";

  workshopsWrapper.innerHTML = `
    <div class="border-b border-gray-200">
      <ul class="flex space-x-8 px-6" role="tablist">
        <li class="flex-1">
          <button id="tab-enrolled" role="tab" type="button" class="w-full flex items-center justify-center gap-2 py-4 px-3 text-sm font-medium text-gray-500 border-b-2 border-transparent hover:text-gray-700 hover:border-gray-300 transition-colors">
            <img src="src/assets/images/ticket-alt.svg" alt="" class="w-5 h-5" />
            <span>Inscritos</span>
          </button>
        </li>
        <li class="flex-1">
          <button id="tab-created" role="tab" type="button" class="w-full flex items-center justify-center gap-2 py-4 px-3 text-sm font-medium text-gray-500 border-b-2 border-transparent hover:text-gray-700 hover:border-gray-300 transition-colors">
            <img src="src/assets/images/select.svg" alt="" class="w-5 h-5" />
            <span>Creados</span>
          </button>
        </li>
        <li class="flex-1">
          <button id="tab-saved" role="tab" type="button" class="w-full flex items-center justify-center gap-2 py-4 px-3 text-sm font-medium text-gray-500 border-b-2 border-transparent hover:text-gray-700 hover:border-gray-300 transition-colors">
            <img src="src/assets/images/bookmark.svg" alt="" class="w-5 h-5" />
            <span>Guardados</span>
          </button>
        </li>
      </ul>
    </div>
    <div class="p-6">
      <div id="workshops-tab-content-button" class="mb-6"></div>
      <div id="workshops-tab-content" class="min-h-64"></div>
    </div>
  `;

  workshopsContainer.appendChild(workshopsWrapper);
  app.appendChild(workshopsContainer);

  const tabCreateButton = workshopsWrapper.querySelector(
    "#workshops-tab-content-button"
  );
  const tabContent = workshopsWrapper.querySelector("#workshops-tab-content");

  function filterWorkshopsByTab(workshops, currentUser, tab) {
    if (tab === "enrolled") {
      return workshops.filter((workshop) =>
        currentUser.enrolledWorkshops?.includes(workshop.id)
      );
    }
    if (tab === "created") {
      return workshops.filter((workshop) => workshop.userId === currentUser.id);
    }
    if (tab === "saved") {
      return workshops.filter((workshop) =>
        currentUser.savedWorkshops?.includes(workshop.id)
      );
    }
    return [];
  }

  async function showTab(tab) {
    const currentUser = getCurrentUser();

    const [workshops, categories, subcategories] = await Promise.all([
      getCachedWorkshops(),
      getCachedCategories(),
      getCachedSubcategories(),
    ]);

    const filteredWorkshops = filterWorkshopsByTab(workshops, currentUser, tab);

    if (tab === "created") {
      tabCreateButton.innerHTML = "";
      const createBtn = document.createElement("button");
      createBtn.textContent = "+ Nuevo Taller";
      createBtn.className =
        "px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-sm";
      tabCreateButton.appendChild(createBtn);

      createBtn.addEventListener("click", () => {
        createEditWorkshopModal({
          data: {},
          onSubmit: async (formData) => {
            const newWorkshop = await createWorkshop(formData);
            currentUser.createdWorkshops.push(newWorkshop.id);

            const updatedUser = await updateUser({
              createdWorkshops: currentUser.createdWorkshops,
            });
            if (updatedUser) {
              localStorage.setItem(
                "currentUser",
                JSON.stringify({ ...currentUser, ...updatedUser })
              );
            }

            updateWorkshopCache(newWorkshop);
            showToast("Taller creado exitosamente", "success");
            showTab("created");
          },
        });
      });
    } else {
      tabCreateButton.innerHTML = "";
    }

    if (filteredWorkshops.length > 0) {
      renderWorkshops(tabContent, filteredWorkshops, categories, subcategories);
    } else {
      let message = "";
      if (tab === "enrolled")
        message = "Aún no te has inscrito en ningún taller";
      if (tab === "created") message = "Aún no has creado ningún taller";
      if (tab === "saved") message = "Aún no has guardado ningún taller";
      tabContent.innerHTML = `<p class="text-center text-gray-500 text-lg py-12">${message}</p>`;
    }
  }

  function setActiveTab(tab) {
    ["enrolled", "created", "saved"].forEach((t) => {
      const btn = workshopsWrapper.querySelector(`#tab-${t}`);
      if (t === tab) {
        btn.classList.remove("text-gray-500", "border-transparent");
        btn.classList.add("text-indigo-600", "border-indigo-600");
      } else {
        btn.classList.remove("text-indigo-600", "border-indigo-600");
        btn.classList.add("text-gray-500", "border-transparent");
      }
    });
  }

  // Tab event listeners
  workshopsWrapper
    .querySelector("#tab-enrolled")
    .addEventListener("click", (e) => {
      e.preventDefault();
      showTab("enrolled");
      setActiveTab("enrolled");
    });

  workshopsWrapper
    .querySelector("#tab-created")
    .addEventListener("click", (e) => {
      e.preventDefault();
      showTab("created");
      setActiveTab("created");
    });

  workshopsWrapper
    .querySelector("#tab-saved")
    .addEventListener("click", (e) => {
      e.preventDefault();
      showTab("saved");
      setActiveTab("saved");
    });

  showTab("enrolled");
  setActiveTab("enrolled");
}
