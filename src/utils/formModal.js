import { getCurrentUser } from "../api/apiUsers.js";

export function renderWorkshopFormHtml(data = {}) {
  const isEdit = Boolean(data.id);
  return `
      <div class="workshop-modal__header">
        <h3>${isEdit ? "Edit" : "Create"} Workshop</h3>
        <button class="workshop-modal__close" aria-label="Close" type="button">&times;</button>
      </div>
      <form id="workshop-form" class="workshop-form">
        <input name="title" value="${
          data.title || ""
        }" placeholder="Title" required />
        <input name="imageUrl" value="${
          data.imageUrl || ""
        }" placeholder="Image URL" />
        <input name="price" value="${
          data.price || ""
        }" placeholder="Price (€)" />
        <input name="duration" value="${
          data.duration || ""
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
        <button type="submit">${isEdit ? "Update" : "Create"}</button>
      </form>
    `;
}

export function handleWorkshopFormSubmit(onSubmit, data = {}) {
  const modal = document.getElementById("workshop-modal");
  const form = modal.querySelector("#workshop-form");
  const closeBtn = modal.querySelector(".workshop-modal__close");
  closeBtn.onclick = closeModal;

  form.onsubmit = async (e) => {
    e.preventDefault();
    const currentUser = getCurrentUser();
    const formData = Object.fromEntries(new FormData(form));
    const workshop = {
      ...data,
      ...formData,
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

export function showModal(contentHtml) {
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

export function closeModal() {
  const modal = document.getElementById("workshop-modal");
  if (modal) modal.style.display = "none";
}
