import { getCurrentUser } from "../../api/apiUsers.js";

export function renderWorkshopFormHtml(data = {}) {
  const isEdit = Boolean(data.id);
  return `
      <div class="workshop-modal__header">
        <h3>${isEdit ? "Editar" : "Crear"} Taller</h3>
        <button class="workshop-modal__close" aria-label="Cerrar" type="button">&times;</button>
      </div>
      <form id="workshop-form" class="workshop-form">
        <input name="title" value="${
          data.title || ""
        }" placeholder="Título" required />
        <input name="imageUrl" value="${
          data.imageUrl || ""
        }" placeholder="URL de la imagen" />
        <input name="price" value="${
          data.price || ""
        }" placeholder="Precio (€)" />
        <input name="duration" value="${
          data.duration || ""
        }" placeholder="Duración (ej. 90 o 2h)" />
        <input name="capacity" value="${
          data.capacity || ""
        }" placeholder="Capacidad (máx. personas)" />
        <input name="date" value="${
          data.date || ""
        }" placeholder="Fecha de inicio (ej. 2025-08-10)" />
        <input name="location" value="${
          data.location || ""
        }" placeholder="Ubicación (Online o Presencial)" />
        <textarea name="overview" placeholder="Descripción">${
          data.overview || ""
        }</textarea>
        <button type="submit">${isEdit ? "Actualizar" : "Crear"}</button>
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
