import "../assets/styles/workshops.css";
import {
  createWorkshop,
  updateWorkshop,
  deleteWorkshop,
  getWorkshops,
} from "../api/apiWorkshops";
import { showToast } from "../utils/toastify";
import { clearWorkshopsCache } from "../utils/cache";

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
    <div id="workshops-tab-content" class="tab-content"></div>
  `;

  workshopsContainer.appendChild(workshopsWrapper);
  app.appendChild(workshopsContainer);

  const tabContent = workshopsWrapper.querySelector("#workshops-tab-content");

  function showTab(tab) {
    tabContent.innerHTML = "";

    if (tab === "enrolled") {
      tabContent.textContent = "list of enrolled workshops";
    } else if (tab === "created") {
      const createBtn = document.createElement("button");
      createBtn.textContent = "+ New Workshop";
      createBtn.className = "btn-create-workshop styled-button";
      tabContent.appendChild(createBtn);

      const formContainer = document.createElement("div");
      formContainer.id = "workshop-form-container";
      formContainer.className = "form-wrapper";
      tabContent.appendChild(formContainer);

      createBtn.addEventListener("click", () => {
        renderWorkshopForm(formContainer);
      });

      loadCreatedWorkshops(tabContent);
    } else if (tab === "saved") {
      tabContent.textContent = "list of saved workshops";
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

  workshopsWrapper.querySelector("#tab-enrolled").addEventListener("click", (e) => {
    e.preventDefault();
    showTab("enrolled");
    setActiveTab("enrolled");
  });

  workshopsWrapper.querySelector("#tab-created").addEventListener("click", (e) => {
    e.preventDefault();
    showTab("created");
    setActiveTab("created");
  });

  workshopsWrapper.querySelector("#tab-saved").addEventListener("click", (e) => {
    e.preventDefault();
    showTab("saved");
    setActiveTab("saved");
  });

  showTab("enrolled");
  setActiveTab("enrolled");
}

async function loadCreatedWorkshops(container) {
  const user = JSON.parse(localStorage.getItem("currentUser"));
  const workshops = await getWorkshops();
  const created = workshops.filter((w) => w.instructor === user.name);

  const list = document.createElement("ul");
  list.className = "created-list styled-list";

  created.forEach((w) => {
    const item = document.createElement("li");
    item.className = "created-item";

    const info = document.createElement("div");
    info.className = "created-item-info";
    const enrolledCount = w.enrolled?.length || 0;
    const capacity = w.capacity || "?";

    info.innerHTML = `
      <strong>${w.title}</strong>
      <small>
        ${w.date || ""} • 
        ${formatDuration(w.time)} • 
        ${w.location || ""} • 
        ${w.price || "Free"}€ • 
        ${enrolledCount}/${capacity} spots
      </small>
    `;

    const actions = document.createElement("div");
    actions.className = "action-buttons";

    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.className = "styled-button small";
    editBtn.addEventListener("click", () => {
      renderWorkshopForm(document.getElementById("workshop-form-container"), w);
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.className = "styled-button small danger";
    deleteBtn.addEventListener("click", async () => {
      if (confirm("Delete this workshop?")) {
        await deleteWorkshop(w.id);
        showToast("Deleted", "success");
        clearWorkshopsCache();
        loadCreatedWorkshops(container);
      }
    });

    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);
    item.appendChild(info);
    item.appendChild(actions);
    list.appendChild(item);
  });

  container.appendChild(list);
}

function renderWorkshopForm(container, data = {}) {
  const isEdit = Boolean(data.id);
  container.innerHTML = `
    <h3 class="form-title">${isEdit ? "Edit" : "Create"} Workshop</h3>
    <form id="workshop-form" class="workshop-form">
      <input name="title" value="${data.title || ""}" placeholder="Title" required />
      <input name="imageUrl" value="${data.imageUrl || ""}" placeholder="Image URL" />
      <input name="price" value="${data.price || ""}" placeholder="Price (€)" />
      <input name="time" value="${data.time || ""}" placeholder="Duration (e.g. 90 or 2h)" />
      <input name="capacity" value="${data.capacity || ""}" placeholder="Capacity (max people)" />
      <input name="date" value="${data.date || ""}" placeholder="Start Date (e.g. 2025-08-10)" />
      <input name="location" value="${data.location || ""}" placeholder="Location (Online or On-Site)" />
      <textarea name="overview" placeholder="Overview">${data.overview || ""}</textarea>
      <button type="submit">${isEdit ? "Update" : "Create"}</button>
    </form>
  `;

  const form = container.querySelector("#workshop-form");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem("currentUser"));
    const formData = Object.fromEntries(new FormData(form));
    const workshop = {
      ...formData,
      instructor: user.name,
      enrolled: data.enrolled || [],
      categoryId: 1,
      subcategoryId: 1,
      capacity: Number(formData.capacity || 0),
    };

    try {
      if (isEdit) {
        await updateWorkshop(data.id, workshop);
        showToast("Workshop updated", "success");
      } else {
        await createWorkshop(workshop);
        showToast("Workshop created", "success");
      }
      clearWorkshopsCache();
      container.innerHTML = "";
      loadCreatedWorkshops(container.parentElement);
    } catch (err) {
      showToast("Something went wrong", "error");
    }
  });
}

function formatDuration(raw) {
  if (!raw) return "";
  if (raw.includes("h") || raw.includes("min")) return raw;
  const minutes = parseInt(raw);
  if (isNaN(minutes)) return raw;
  return minutes >= 60
    ? `${Math.floor(minutes / 60)}h ${minutes % 60 ? minutes % 60 + "min" : ""}`.trim()
    : `${minutes}min`;
}