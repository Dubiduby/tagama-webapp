import dayjs from "../../utils/day.js";
import { getCategories, getSubcategories } from "../../api/apiCategories.js";
import { getCurrentUser } from "../../api/apiUsers.js";
import { showToast } from "../../utils/toastify.js";

export async function createEditWorkshopModal({ data = {}, onSubmit }) {
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

  const formHtml = `
    <form id="workshop-form" class="workshop-form">
      <div class="form-group">
        <label for="title">Título</label>
        <input id="title" name="title" value="${data.title || ""}" required />
      </div>
      <div class="form-group">
        <label for="overview">Descripción</label>
        <textarea id="overview" name="overview">${
          data.overview || ""
        }</textarea>
      </div>
      <div class="form-group">
        <label for="requirements">Requisitos</label>
        <textarea id="requirements" name="requirements">${
          data.requirements || ""
        }</textarea>
      </div>
      <div class="form-group inline-group">
        <div>
          <label for="place">Lugar</label>
          <select id="place" name="place" required>
            <option value="Online" ${
              data.place === "Online" ? "selected" : ""
            }>Online</option>
            <option value="On-Site" ${
              data.place === "On-Site" ? "selected" : ""
            }>Presencial</option>
          </select>
        </div>
        <div id="address-group" style="${
          data.place === "Online" ? "display:none" : ""
        }">
          <label for="address">Dirección</label>
          <input id="address" name="address" value="${data.address || ""}" />
        </div>
      </div>
      <div class="form-group">
        <label for="date">Fecha</label>
        <input id="date" type="datetime-local" name="date" 
          value="${
            data.date ? dayjs.unix(data.date).format("YYYY-MM-DDTHH:mm") : ""
          }" required />
      </div>
      <div class="form-group inline-group">
        <div>
          <label for="category">Categoría</label>
          <select id="category-select" name="categoryId"></select>
        </div>
        <div>
          <label for="subcategory">Subcategoría</label>
          <select id="subcategory-select" name="subcategoryId"></select>
        </div>
      </div>
      <div class="form-group inline-group">
        <div>
          <label for="capacity">Capacidad</label>
          <input id="capacity" type="number" name="capacity" value="${
            data.capacity || ""
          }" required />
        </div>
        <div>
          <label for="price">Precio (€)</label>
          <input id="price" type="number" step="0.01" name="price" value="${
            data.price || 0
          }" />
        </div>
      </div>
      <div class="form-group">
        <label for="imageUrl">Imagen</label>
        <input id="imageUrl" name="imageUrl" type="hidden" value="${
          data.imageUrl || ""
        }" />
        <input id="image-upload" type="file" accept="image/*" />
        <button type="button" id="upload-btn" class="upload-btn">Subir imagen</button>
        <div id="image-preview" style="margin-top:10px;">
          ${
            data.imageUrl
              ? `<img src="${data.imageUrl}" alt="Imagen actual" style="max-width:100%;max-height:150px;" />`
              : ""
          }
        </div>
      </div>
      <button type="submit" class="btn-submit">Guardar</button>
    </form>
  `;
  modal.querySelector(".workshop-modal__content").innerHTML = formHtml;
  modal.style.display = "flex";

  const form = document.getElementById("workshop-form");
  const categories = await getCategories();
  const subcategories = await getSubcategories();
  const categorySelect = form.querySelector("#category-select");
  const subcategorySelect = form.querySelector("#subcategory-select");
  const placeSelect = form.querySelector("#place");
  const addressGroup = form.querySelector("#address-group");
  const imageInput = form.querySelector("#image-upload");
  const uploadBtn = form.querySelector("#upload-btn");
  const imageUrlInput = form.querySelector("#imageUrl");
  const imagePreview = form.querySelector("#image-preview");

  //upload button logic

  uploadBtn.addEventListener("click", async (event) => {
    event.preventDefault();
    const file = imageInput.files[0];
    if (!file) {
      showToast("Selecciona una imagen", "error");
      return;
    }
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "workshops");
    try {
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dpm2ylejh/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await res.json();
      if (data.secure_url) {
        imageUrlInput.value = data.secure_url;
        imagePreview.innerHTML = `<img src="${data.secure_url}" alt="Imagen subida" style="max-width:100%;max-height:150px;" />`;
        showToast("¡Imagen subida correctamente!", "succes");
      } else {
        showToast("Error al subir la imagen", "error");
      }
    } catch (error) {
      console.error("Error loading image");
      showToast("Fallo de red", "error");
    }
  });

  // fill categories
  categorySelect.innerHTML = categories
    .map(
      (c) =>
        `<option value="${c.id}" ${data.categoryId == c.id ? "selected" : ""}>${
          c.name
        }</option>`
    )
    .join("");

  // fill subcategories
  function renderSubcategories(categoryId) {
    const filtered = subcategories.filter(
      (s) => String(s.categoryId) === String(categoryId)
    );
    subcategorySelect.innerHTML = filtered
      .map(
        (s) =>
          `<option value="${s.id}" ${
            data.subcategoryId == s.id ? "selected" : ""
          }>${s.name}</option>`
      )
      .join("");
    if (filtered.length === 0) {
      subcategorySelect.innerHTML =
        '<option value="" disabled selected>-- No hay subcategorías --</option>';
    }
  }
  renderSubcategories(categorySelect.value);
  categorySelect.addEventListener("change", () => {
    renderSubcategories(categorySelect.value);
  });

  // show/hide direction
  if (placeSelect.value === "Online") {
    addressGroup.style.display = "none";
  } else {
    addressGroup.style.display = "block";
  }
  placeSelect.addEventListener("change", () => {
    if (placeSelect.value === "Online") {
      addressGroup.style.display = "none";
      addressGroup.querySelector("input").value = "";
    } else {
      addressGroup.style.display = "block";
    }
  });

  form.onsubmit = async (e) => {
    e.preventDefault();
    const currentUser = getCurrentUser();
    const formData = Object.fromEntries(new FormData(form));
    const workshop = {
      ...data,
      ...formData,
      date: dayjs(formData.date).unix(),
      instructorName: currentUser.name,
      enrolled: data.enrolled || [],
      capacity: Number(formData.capacity || 0),
      userId: currentUser.id,
    };
    await onSubmit(workshop);
    closeModal();
  };
}

export function closeModal() {
  const modal = document.getElementById("workshop-modal");
  if (modal) modal.style.display = "none";
}
