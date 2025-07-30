import "../assets/styles/workshops.css";
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
import {
  showModal,
  handleWorkshopFormSubmit,
  renderWorkshopFormHtml,
  closeModal,
} from "../components/modals/formModal.js";

export default function workshops(container) {
  container.innerHTML = "";
  const app = document.getElementById("app");

  const workshopsContainer = document.createElement("div");
  workshopsContainer.classList.add("workshops-container");

  const workshopsWrapper = document.createElement("div");
  workshopsWrapper.classList.add("workshops-wrapper");

  workshopsWrapper.innerHTML = `
    <ul class="workshops-nav" role="tablist">
      <li><button id="tab-enrolled" role="tab" type="button">
      <img src="src/assets/images/ticket-alt.svg" alt="" class="tab-icon" />
      <span>Inscritos</span>
      </button></li>
      <li><button id="tab-created" role="tab" type="button">
      <img src="src/assets/images/select.svg" alt="" class="tab-icon" />
      <span>Creados</span>
      </button></li>
      <li><button id="tab-saved" role="tab" type="button">
      <img src="src/assets/images/bookmark.svg" alt="" class="tab-icon" />
      <span>Guardados</span>
      </button></li>
    </ul>
    <div id="workshops-tab-content-button" class="create-button"></div>
    <div id="workshops-tab-content" class="tab-content"></div>
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
        currentUser.enrolledWorkshops?.includes(String(workshop.id))
      );
    }
    if (tab === "created") {
      return workshops.filter(
        (workshop) => String(workshop.userId) === String(currentUser.id)
      );
    }
    if (tab === "saved") {
      return workshops.filter((workshop) =>
        currentUser.savedWorkshops?.includes(String(workshop.id))
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
      createBtn.className = "btn-create-workshop styled-button";
      tabCreateButton.appendChild(createBtn);

      createBtn.addEventListener("click", () => {
        showModal(renderWorkshopFormHtml());
        handleWorkshopFormSubmit(async (formData) => {
          const newWorkshop = await createWorkshop(formData);
          currentUser.createdWorkshops.push(String(newWorkshop.id));

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

          closeModal();
          showToast("Taller creado exitosamente", "success");
          showTab("created");
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
      tabContent.innerHTML = `<p>${message}</p>`;
    }
  }

  function setActiveTab(tab) {
    ["enrolled", "created", "saved"].forEach((t) => {
      const btn = workshopsWrapper.querySelector(`#tab-${t}`);
      if (t === tab) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
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
