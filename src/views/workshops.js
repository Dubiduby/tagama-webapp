import "../assets/styles/workshops.css";
import { showToast } from "../utils/toastify";
import { getCurrentUser, updateUser } from "../api/apiUsers";
import {
  getCachedWorkshops,
  getCachedCategories,
  getCachedSubcategories,
  updateWorkshopCache,
  clearWorkshopsCache,
} from "../utils/cache.js";
import { renderWorkshops } from "../utils/renderCards.js";
import { createWorkshop, updateWorkshop } from "../api/apiWorkshops.js";
import dayjs from "dayjs";

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
      <span>Enrolled</span>
      </button></li>
      <li><button id="tab-created" role="tab" type="button">
      <img src="src/assets/images/select.svg" alt="" class="tab-icon" />
      <span>Created</span>
      </button></li>
      <li><button id="tab-saved" role="tab" type="button">
      <img src="src/assets/images/bookmark.svg" alt="" class="tab-icon" />
      <span>Saved</span>
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

  //filter workshops depending of which tab you are
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
  }

  //render the content of the tabs
  async function showTab(tab) {
    const currentUser = getCurrentUser();

    //It does all the request together so it takes less time
    const [workshops, categories, subcategories] = await Promise.all([
      getCachedWorkshops(),
      getCachedCategories(),
      getCachedSubcategories(),
    ]);

    const filteredWorkshops = filterWorkshopsByTab(workshops, currentUser, tab);

    if (tab === "created") {
      tabCreateButton.innerHTML = "";
      const createBtn = document.createElement("button");
      createBtn.textContent = "+ New Workshop";
      createBtn.className = "btn-create-workshop styled-button";
      tabCreateButton.appendChild(createBtn);

      createBtn.addEventListener("click", () => {
        showModal(renderWorkshopFormHtml());
        handleWorkshopFormSubmit(async (formData) => {
          // 1. Create the workshop and obtain id
          const newWorkshop = await createWorkshop(formData);

          // add the new workshop to the currentUser
          currentUser.createdWorkshops.push(String(newWorkshop.id));

          // 3. updateUser with the new workshop and update localStorage
          const updatedUser = await updateUser({
            createdWorkshops: currentUser.createdWorkshops,
          });
          if (updatedUser) {
            localStorage.setItem(
              "currentUser",
              JSON.stringify({ ...currentUser, ...updatedUser })
            );
          }

          // Update local cache workshop
          updateWorkshopCache(newWorkshop);

          // close modal, show toastify and refresh the tab
          closeModal();

          showToast("Workshop created succesfully", "success");
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
      if (tab === "enrolled") message = "You didn't enroll to any workshop yet";
      if (tab === "created") message = "You haven't created any workshops yet";
      if (tab === "saved") message = "You haven't saved any workshops yet";
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

//   const user = JSON.parse(localStorage.getItem("currentUser"));
//   const workshops = await getWorkshops();
//   const created = workshops.filter((w) => w.instructor === user.name);

//   const list = document.createElement("ul");
//   list.className = "created-list styled-list";

//   created.forEach((w) => {
//     const item = document.createElement("li");
//     item.className = "created-item";

//     const info = document.createElement("div");
//     info.className = "created-item-info";
//     const enrolledCount = w.enrolled?.length || 0;
//     const capacity = w.capacity || "?";

//     info.innerHTML = `
//       <strong>${w.title}</strong>
//       <small>
//         ${w.date || ""} •
//         ${formatDuration(w.time)} •
//         ${w.location || ""} •
//         ${w.price || "Free"}€ •
//         ${enrolledCount}/${capacity} spots
//       </small>
//     `;

//     const actions = document.createElement("div");
//     actions.className = "action-buttons";

//     const editBtn = document.createElement("button");
//     editBtn.textContent = "Edit";
//     editBtn.className = "styled-button small";
//     editBtn.addEventListener("click", () => {
//       renderWorkshopForm(document.getElementById("workshop-form-container"), w);
//     });

//     const deleteBtn = document.createElement("button");
//     deleteBtn.textContent = "Delete";
//     deleteBtn.className = "styled-button small danger";
//     deleteBtn.addEventListener("click", async () => {
//       if (confirm("Delete this workshop?")) {
//         await deleteWorkshop(w.id);
//         showToast("Deleted", "success");
//         clearWorkshopsCache();
//         loadCreatedWorkshops(container);
//       }
//     });

//     actions.appendChild(editBtn);
//     actions.appendChild(deleteBtn);
//     item.appendChild(info);
//     item.appendChild(actions);
//     list.appendChild(item);
//   });

//   container.appendChild(list);
// }

//new version-------------------
function renderWorkshopFormHtml(data = {}) {
  const isEdit = Boolean(data.id);
  return `
    <div class="workshop-modal__header">
      <h3>${isEdit ? "Editar" : "Crear"} Workshop</h3>
      <button class="workshop-modal__close" aria-label="Close" type="button">&times;</button>
    </div>
    <form id="workshop-form" class="workshop-form">
      <input name="title" value="${
        data.title || ""
      }" placeholder="Title" required />
      <input name="imageUrl" value="${
        data.imageUrl || ""
      }" placeholder="Image URL" />
      <input name="price" value="${data.price || ""}" placeholder="Price (€)" />
      <input name="duration" value="${
        formatDuration(data.duration) || ""
      }" placeholder="Duration (e.g. 90 or 2h)" />
      <input name="capacity" value="${
        data.capacity || ""
      }" placeholder="Capacity (max people)" />
      <input name="date" value="${
        data.date || ""
      }" placeholder="Start Date (e.g. 2025-08-10)" />
      <input name="location" value="${
        data.location || ""
      }" placeholder="Location (Online or On-Site)" />
      <textarea name="overview" placeholder="Overview">${
        data.overview || ""
      }</textarea>
      <button type="submit">${isEdit ? "Editar" : "Crear"}</button>
    </form>
  `;
}

function handleWorkshopFormSubmit(onSubmit, data = {}) {
  const modal = document.getElementById("workshop-modal");
  const form = modal.querySelector("#workshop-form");
  const closeBtn = modal.querySelector(".workshop-modal__close");
  closeBtn.onclick = closeModal;

  form.onsubmit = async (e) => {
    e.preventDefault();
    const currentUser = getCurrentUser();
    const formData = Object.fromEntries(new FormData(form));
    const workshop = {
      ...data, //data from existing workshop (if editing)
      ...formData, //data from de form
      instructorName: currentUser.name,
      enrolled: data.enrolled || [],
      categoryId: 1,
      subcategoryId: 1,
      capacity: Number(formData.capacity || 0),
      userId: currentUser.id,
    };
    await onSubmit(workshop);
  };
}

function formatDuration(raw) {
  if (!raw) return "";
  if (raw.includes("h") || raw.includes("min")) return raw;
  const minutes = parseInt(raw);
  if (isNaN(minutes)) return raw;
  return minutes >= 60
    ? `${Math.floor(minutes / 60)}h ${
        minutes % 60 ? (minutes % 60) + "min" : ""
      }`.trim()
    : `${minutes}min`;
}

//modal form
function showModal(contentHtml) {
  let modal = document.getElementById("workshop-modal");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "workshop-modal";
    modal.className = "workshop-modal";
    modal.innerHTML = `
      <div class="workshop-modal__overlay"></div>
      <div class="workshop-modal__content"></div>
    `;
    document.body.appendChild(modal);
    modal.querySelector(".workshop-modal__overlay").onclick = closeModal;
  }
  modal.querySelector(".workshop-modal__content").innerHTML = contentHtml;
  modal.style.display = "flex";
}

function closeModal() {
  const modal = document.getElementById("workshop-modal");
  if (modal) modal.style.display = "none";
}
