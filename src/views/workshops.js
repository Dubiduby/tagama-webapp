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
    <div class="border-b border-gray-200 dark:border-gray-700">
      <ul class="flex space-x-8 px-6" >
        <li class="flex-1">
          <button id="tab-enrolled" role="tab" type="button" class="w-full flex items-center justify-center gap-2 py-4 px-3 text-sm font-medium text-gray-500 border-b-2 border-transparent hover:text-gray-700 hover:border-gray-300 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5 text-dark-orange dark:text-light-orange">
  <path fill-rule="evenodd" d="M1.5 6.375c0-1.036.84-1.875 1.875-1.875h17.25c1.035 0 1.875.84 1.875 1.875v3.026a.75.75 0 0 1-.375.65 2.249 2.249 0 0 0 0 3.898.75.75 0 0 1 .375.65v3.026c0 1.035-.84 1.875-1.875 1.875H3.375A1.875 1.875 0 0 1 1.5 17.625v-3.026a.75.75 0 0 1 .374-.65 2.249 2.249 0 0 0 0-3.898.75.75 0 0 1-.374-.65V6.375Zm15-1.125a.75.75 0 0 1 .75.75v.75a.75.75 0 0 1-1.5 0V6a.75.75 0 0 1 .75-.75Zm.75 4.5a.75.75 0 0 0-1.5 0v.75a.75.75 0 0 0 1.5 0v-.75Zm-.75 3a.75.75 0 0 1 .75.75v.75a.75.75 0 0 1-1.5 0v-.75a.75.75 0 0 1 .75-.75Zm.75 4.5a.75.75 0 0 0-1.5 0V18a.75.75 0 0 0 1.5 0v-.75ZM6 12a.75.75 0 0 1 .75-.75H12a.75.75 0 0 1 0 1.5H6.75A.75.75 0 0 1 6 12Zm.75 2.25a.75.75 0 0 0 0 1.5h3a.75.75 0 0 0 0-1.5h-3Z" clip-rule="evenodd" />
</svg>

            <span>Inscritos</span>
          </button>
        </li>
        <li class="flex-1">
          <button id="tab-created" role="tab" type="button" class="w-full flex items-center justify-center gap-2 py-4 px-3 text-sm font-medium text-gray-500 border-b-2 border-transparent hover:text-gray-700 hover:border-gray-300 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5 text-dark-orange dark:text-light-orange">
  <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32l8.4-8.4Z" />
  <path d="M5.25 5.25a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3V13.5a.75.75 0 0 0-1.5 0v5.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V8.25a1.5 1.5 0 0 1 1.5-1.5h5.25a.75.75 0 0 0 0-1.5H5.25Z" />
</svg>
            <span>Creados</span>
          </button>
        </li>
        <li class="flex-1">
          <button id="tab-saved" role="tab" type="button" class="w-full flex items-center justify-center gap-2 py-4 px-3 text-sm font-medium text-gray-500 border-b-2 border-transparent hover:text-gray-700 hover:border-gray-300 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5 text-dark-orange dark:text-light-orange">
  <path fill-rule="evenodd" d="M6.32 2.577a49.255 49.255 0 0 1 11.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 0 1-1.085.67L12 18.089l-7.165 3.583A.75.75 0 0 1 3.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93Z" clip-rule="evenodd" />
</svg>

            <span>Guardados</span>
          </button>
        </li>
      </ul>
    </div>
    <div class="p-6">
      <div id="workshops-tab-content-button" class="mb-6 flex justify-center "></div>
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
        " px-6 py-3 bg-dark-green text-white rounded-lg font-medium hover:bg-[#5f6155] transition-colors shadow-sm dark:bg-light-yellow dark:text-dark-bg dark:hover:bg-[#f9f0dd]";
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
        btn.classList.remove("text-gray-500", "border-transparent", "dark:text-gray-400", "dark:border-transparent");
        btn.classList.add("text-grey-500", "border-dark-green", "dark:text-light-yellow", "dark:border-light-yellow");
      } else {
        btn.classList.remove("text-grey-500", "border-dark-green", "dark:text-light-yellow", "dark:border-light-yellow");
        btn.classList.add("text-gray-500", "border-transparent", "dark:text-gray-400", "dark:border-transparent");
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
