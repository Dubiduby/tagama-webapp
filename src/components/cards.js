import "../assets/styles/main.css";
import { getCurrentUser, updateUser } from "../api/apiUsers";
import dayjs from "dayjs";
import { showToast } from "../utils/toastify";
import { updateWorkshopCache } from "../utils/cache.js";
import { updateWorkshop, deleteWorkshop } from "../api/apiWorkshops.js";
import {
  createEditWorkshopModal,
  closeModal,
} from "../components/modals/formModal.js";

export function workshopCards(workshop, subcategory, category) {
  const card = document.createElement("div");
  card.className = "workshop-card";

  const imageUrl = workshop.imageUrl
    ? workshop.imageUrl
    : new URL("../assets/images/no-image-default.jpg", import.meta.url).href;

  const divCardImage = document.createElement("div");
  divCardImage.className = "card-image";
  divCardImage.style.position = "relative";

  const img = document.createElement("img");
  img.src = imageUrl;
  img.alt = "Imagen del Taller";

  const currentUser = getCurrentUser();

  let optionsWrapper = null;
  if (
    currentUser &&
    currentUser.createdWorkshops &&
    currentUser.createdWorkshops.includes(String(workshop.id))
  ) {
    optionsWrapper = document.createElement("div");
    optionsWrapper.style.position = "absolute";
    optionsWrapper.style.top = "8px";
    optionsWrapper.style.right = "8px";

    const optionsBtn = document.createElement("button");
    optionsBtn.innerHTML = "⋮";
    optionsBtn.style.background = "rgba(0,0,0,0.6)";
    optionsBtn.style.color = "#fff";
    optionsBtn.style.border = "none";
    optionsBtn.style.borderRadius = "50%";
    optionsBtn.style.width = "28px";
    optionsBtn.style.height = "28px";
    optionsBtn.style.cursor = "pointer";
    optionsBtn.style.fontSize = "18px";
    optionsBtn.style.lineHeight = "18px";

    const dropdown = document.createElement("div");
    dropdown.style.display = "none";
    dropdown.style.position = "absolute";
    dropdown.style.top = "35px";
    dropdown.style.right = "0";
    dropdown.style.background = "#fff";
    dropdown.style.border = "1px solid #ddd";
    dropdown.style.borderRadius = "6px";
    dropdown.style.boxShadow = "0 2px 6px rgba(0,0,0,0.2)";
    dropdown.style.minWidth = "110px";
    dropdown.style.zIndex = "100";

    const editOption = document.createElement("button");
    editOption.textContent = "✏️ Editar";
    editOption.style.display = "block";
    editOption.style.width = "100%";
    editOption.style.padding = "6px 10px";
    editOption.style.background = "none";
    editOption.style.border = "none";
    editOption.style.textAlign = "left";
    editOption.style.cursor = "pointer";

    const deleteOption = document.createElement("button");
    deleteOption.textContent = "🗑️ Eliminar";
    deleteOption.style.display = "block";
    deleteOption.style.width = "100%";
    deleteOption.style.padding = "6px 10px";
    deleteOption.style.background = "none";
    deleteOption.style.border = "none";
    deleteOption.style.textAlign = "left";
    deleteOption.style.cursor = "pointer";
    deleteOption.style.color = "red";

    dropdown.appendChild(editOption);
    dropdown.appendChild(deleteOption);
    optionsWrapper.appendChild(optionsBtn);
    optionsWrapper.appendChild(dropdown);

    optionsBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      e.preventDefault();
      dropdown.style.display =
        dropdown.style.display === "block" ? "none" : "block";
    });

    document.addEventListener("click", (e) => {
      if (!optionsWrapper.contains(e.target)) {
        dropdown.style.display = "none";
      }
    });

    editOption.addEventListener("click", (e) => {
      e.stopPropagation();
      e.preventDefault();
      dropdown.style.display = "none";
      createEditWorkshopModal({
        data: workshop,
        onSubmit: async (formData) => {
          try {
            const updatedWorkshop = await updateWorkshop(formData);
            updateWorkshopCache(updatedWorkshop);
            closeModal();
            showToast("Taller actualizado exitosamente", "success");
            setTimeout(() => window.location.reload(), 1000);
          } catch (error) {
            showToast("Error al actualizar el taller", "error");
          }
        },
      });
    });

    deleteOption.addEventListener("click", async (e) => {
      e.stopPropagation();
      e.preventDefault();

      const confirmDelete = confirm(
        `¿Seguro que deseas eliminar el taller "${workshop.title}"?`
      );
      if (!confirmDelete) return;

      const workshopId = workshop.id;

      if (!workshopId || isNaN(Number(workshopId))) {
        showToast("Este taller no tiene un ID válido.", "error");
        return;
      }

      console.log("Deleting workshop ID:", workshopId);

      try {
        const success = await deleteWorkshop(workshopId);
        if (success) {
          const currentUser = getCurrentUser();
          currentUser.createdWorkshops = currentUser.createdWorkshops.filter(
            (wid) => String(wid) !== String(workshopId)
          );
          localStorage.setItem("currentUser", JSON.stringify(currentUser));
          await updateUser(currentUser);
          showToast("Taller eliminado exitosamente", "success");
          setTimeout(() => window.location.reload(), 1000);
        } else {
          showToast(`No se encontró taller con ID: ${workshopId}`, "error");
        }
      } catch (error) {
        console.error("Error deleting workshop:", error);
        showToast("Error al eliminar el taller", "error");
      }
    });
  }

  let bookmarkBtn = null;
  if (!optionsWrapper) {
    bookmarkBtn = document.createElement("button");
    bookmarkBtn.className = "add-btn";

    if (
      currentUser &&
      currentUser.savedWorkshops &&
      currentUser.savedWorkshops.includes(workshop.id)
    ) {
      bookmarkBtn.innerHTML = `<img src="${
        new URL("../assets/images/bookmark-check.svg", import.meta.url).href
      }" alt="Añadido a la lista">`;
    } else {
      bookmarkBtn.innerHTML = `<img src="${
        new URL("../assets/images/bookmark_Plus.svg", import.meta.url).href
      }" alt="Añadir a la lista">`;
    }

    bookmarkBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (!currentUser.savedWorkshops) currentUser.savedWorkshops = [];
      const idx = currentUser.savedWorkshops.indexOf(workshop.id);
      if (idx === -1) {
        currentUser.savedWorkshops.push(workshop.id);
        bookmarkBtn.innerHTML = `<img src="${
          new URL("../assets/images/bookmark-check.svg", import.meta.url).href
        }" alt="Añadido a la lista">`;
      } else {
        currentUser.savedWorkshops.splice(idx, 1);
        bookmarkBtn.innerHTML = `<img src="${
          new URL("../assets/images/bookmark_Plus.svg", import.meta.url).href
        }" alt="Añadir a la lista">`;
      }
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
      updateUser(currentUser);
    });
  }

  const divCardInfo = document.createElement("div");
  divCardInfo.className = "card-info";

  const titleCard = document.createElement("h3");
  titleCard.textContent = workshop.title;

  const divCardDetails = document.createElement("div");
  divCardDetails.className = "card-details";

  const dateSpan = document.createElement("span");
  dateSpan.className = "date";
  dateSpan.innerHTML = `<img src="${
    new URL("../assets/images/calendar.svg", import.meta.url).href
  }" alt="Calendario">  ${dayjs.unix(workshop.date).format("DD/MM/YYYY")}`;

  const locationSpan = document.createElement("span");
  locationSpan.className = "location";
  locationSpan.innerHTML = `<img src="${
    new URL("../assets/images/location-pin.svg", import.meta.url).href
  }" alt="Ubicación">  
  ${
    workshop.place === "Online"
      ? "Online"
      : workshop.address && workshop.address.trim() !== ""
      ? workshop.address
      : "Ubicación no disponible"
  }`;

  const durationSpan = document.createElement("span");
  durationSpan.className = "duration";
  const hours = Math.floor(workshop.duration / 60);
  const minutes = workshop.duration % 60;
  const formattedDuration =
    hours > 0
      ? `${hours}h${minutes > 0 ? ` ${minutes}min` : ""}`
      : `${minutes} min`;
  durationSpan.innerHTML = `<img src="${
    new URL("../assets/images/time.svg", import.meta.url).href
  }" alt="Duración"> ${formattedDuration}`;

  const spots = document.createElement("span");
  spots.className = "spots";
  spots.innerHTML = `<img src="${
    new URL("../assets/images/spots.svg", import.meta.url).href
  }" alt="Plazas">  ${workshop.enrolled.length}/${workshop.capacity}`;

  const workshopPrice = document.createElement("p");
  workshopPrice.textContent =
    workshop.price === 0 ? "Gratis" : `${workshop.price}€`;

  const workshopTagCat = document.createElement("span");
  workshopTagCat.className = "tags";
  if (category && category.name) workshopTagCat.textContent = category.name;

  const workshopTagSub = document.createElement("span");
  workshopTagSub.className = "tags";
  if (subcategory && subcategory.name)
    workshopTagSub.textContent = subcategory.name;

  card.appendChild(divCardImage);
  divCardImage.appendChild(img);

  if (optionsWrapper) divCardImage.appendChild(optionsWrapper);
  if (bookmarkBtn) divCardImage.appendChild(bookmarkBtn);

  card.appendChild(divCardInfo);
  divCardInfo.appendChild(titleCard);
  divCardInfo.appendChild(divCardDetails);

  divCardDetails.appendChild(dateSpan);
  divCardDetails.appendChild(locationSpan);
  divCardDetails.appendChild(durationSpan);
  divCardDetails.appendChild(spots);
  divCardDetails.appendChild(workshopPrice);

  if (category && category.name) divCardDetails.appendChild(workshopTagCat);
  if (subcategory && subcategory.name)
    divCardDetails.appendChild(workshopTagSub);

  const cardLink = document.createElement("a");
  cardLink.href = `/workshops/${workshop.id}`;
  cardLink.setAttribute("data-link", "");
  cardLink.appendChild(card);

  return cardLink;
}
