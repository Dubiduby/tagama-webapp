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
  // Card container
  const card = document.createElement("div");
  card.className =
    "w-80 md:w-96 min-h-[420px] bg-[var(--color-2bg)] rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.08)] overflow-hidden flex flex-col transition-transform transition-shadow duration-150 relative hover:-translate-y-1.5 hover:scale-[1.03] hover:shadow-[0_6px_24px_rgba(0,0,0,0.15)] dark:border-[#797b6c] border-[1px]";
  // "bg-[var(--color-2bg)]  rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.08)] overflow-hidden w-96 flex flex-col transition-transform transition-shadow duration-150 relative hover:-translate-y-1.5 hover:scale-[1.03] hover:shadow-[0_6px_24px_rgba(0,0,0,0.15)] dark:border-[#797b6c] border-[1px]";

  // Card image container
  const imageUrl = workshop.imageUrl
    ? workshop.imageUrl
    : new URL("../assets/images/no-image-default.jpg", import.meta.url).href;

  const divCardImage = document.createElement("div");

  divCardImage.className =
    "w-full h-[180px] md:h-[200px] bg-[#f3f3f3] flex items-center justify-center relative";

  // --- TAGS SOBRE LA IMAGEN ---
  const tagsContainer = document.createElement("div");
  tagsContainer.className = "absolute top-3 left-3 flex gap-2 z-10";

  const workshopTagCat = document.createElement("span");
  workshopTagCat.className =
    "bg-[#ad5733] text-[#f1e2c2] rounded-[12px] px-3 py-[2px] text-[0.8rem] font-medium ";
  workshopTagCat.textContent = category && category.name ? category.name : "";

  const workshopTagSub = document.createElement("span");
  workshopTagSub.className =
    "bg-[#ad5733] text-[#f1e2c2] rounded-[12px] px-2 py-[2px] text-[0.8rem] font-medium ";
  workshopTagSub.textContent =
    subcategory && subcategory.name ? subcategory.name : "";

  tagsContainer.appendChild(workshopTagCat);
  tagsContainer.appendChild(workshopTagSub);

  const img = document.createElement("img");
  img.src = imageUrl;
  img.alt = "Imagen del Taller";
  img.className = "w-full h-full object-cover rounded-t-2xl";

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

  // Botón de bookmark (add/save) siempre presente, pero solo funcional si el usuario no es el creador
  const buttonAdd = document.createElement("button");
  buttonAdd.className =
    "absolute top-3 right-3 bg-[#f7f7f7] border-none rounded-full p-2 cursor-pointer shadow-[0_2px_6px_rgba(0,0,0,0.08)] transition-colors duration-200 hover:bg-[#e0e0e0]";
  const isCreator =
    currentUser &&
    currentUser.createdWorkshops &&
    currentUser.createdWorkshops.includes(String(workshop.id));
  if (
    currentUser &&
    currentUser.savedWorkshops &&
    currentUser.savedWorkshops.includes(workshop.id)
  ) {
    buttonAdd.innerHTML = `<img src="${
      new URL("../assets/images/bookmark-check.svg", import.meta.url).href
    }" alt="Añadido a la lista" class="w-5 h-5 block object-contain">`;
  } else {
    buttonAdd.innerHTML = `<img src="${
      new URL("../assets/images/bookmark_Plus.svg", import.meta.url).href
    }" alt="Añadir a la lista" class="w-5 h-5 block object-contain">`;
  }
  if (!isCreator) {
    buttonAdd.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      //always get de update user
      let currentUser = JSON.parse(localStorage.getItem("currentUser"));
      if (!currentUser.savedWorkshops) currentUser.savedWorkshops = [];
      const idx = currentUser.savedWorkshops.indexOf(workshop.id);
      if (idx === -1) {
        currentUser.savedWorkshops.push(workshop.id);
        buttonAdd.innerHTML = `<img src="${
          new URL("../assets/images/bookmark-check.svg", import.meta.url).href
        }" alt="Añadido a la lista" class="w-5 h-5 block object-contain">`;
      } else {
        currentUser.savedWorkshops.splice(idx, 1);
        buttonAdd.innerHTML = `<img src="${
          new URL("../assets/images/bookmark_Plus.svg", import.meta.url).href
        }" alt="Añadir a la lista" class="w-5 h-5 block object-contain">`;
      }
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
      updateUser(currentUser);
    });
  } else {
    // Si es el creador, deshabilita el botón y ocúltalo visualmente
    buttonAdd.style.display = "none";
  }

  // Card info
  const divCardInfo = document.createElement("div");
  divCardInfo.className = "p-4 flex-1 flex flex-col gap-2";

  const titleCard = document.createElement("h3");
  titleCard.textContent = workshop.title;
  titleCard.className =
    "mb-2 text-[1.15rem] text-[var(--color-title)] font-semibold line-clamp-2";

  // Card details
  const divCardDetails = document.createElement("div");
  divCardDetails.className =
    "flex flex-col  gap-x-4 gap-y-2 text-[0.95rem] text-[#666]";

  const dateSpan = document.createElement("span");
  dateSpan.className =
    " text-[var(--color-text)] flex items-center gap-[0.4em] font-semibold";
  dateSpan.innerHTML = `<img src="${
    new URL("../assets/images/calendar.svg", import.meta.url).href
  }" alt="Calendario" class="w-5 h-5 inline-block object-contain mr-1 align-middle">  ${dayjs
    .unix(workshop.date)
    .format("DD/MM/YYYY")}`;

  const locationSpan = document.createElement("span");
  locationSpan.className =
    " text-[var(--color-text)] flex  items-center gap-[0.2rem] font-semibold";
  locationSpan.innerHTML = `<img src="${
    new URL("../assets/images/location-pin.svg", import.meta.url).href
  }" alt="Ubicación" class="w-5 h-5 inline-block object-contain mr-1 align-middle">  ${
    workshop.mode
  }`;

  const durationSpan = document.createElement("span");
  durationSpan.className =
    "text-[var(--color-text)] flex items-center gap-[0.4em] font-semibold";

  const hours = Math.floor(workshop.duration / 60);
  const minutes = workshop.duration % 60;
  const formattedDuration =
    hours > 0
      ? `${hours}h${minutes > 0 ? ` ${minutes}min` : ""}`
      : `${minutes} min`;
  durationSpan.innerHTML = `<img src="${
    new URL("../assets/images/time.svg", import.meta.url).href
  }" alt="Duración" class="w-5 h-5 inline-block object-contain mr-1 align-middle"> ${formattedDuration}`;

  const spots = document.createElement("span");
  spots.className =
    "text-[var(--color-text)] flex items-center gap-[0.4em] font-semibold";
  spots.innerHTML = `<img src="${
    new URL("../assets/images/spots.svg", import.meta.url).href
  }" alt="Plazas" class="w-5 h-5 inline-block object-contain mr-1 align-middle">  ${
    workshop.enrolled.length
  }/${workshop.capacity}`;

  // Price
  const workshopPrice = document.createElement("span");
  workshopPrice.textContent =
    workshop.price === 0 ? "Gratis" : `${workshop.price}€`;

  workshopPrice.className =
    "text-[#797b6c]  font-bold text-[#1a1a1a] text-xl dark:text-[#f4f2f0]";

  const price_spots = document.createElement("div");
  price_spots.className = "flex  gap-60 items-center ";
  price_spots.appendChild(spots);
  price_spots.appendChild(workshopPrice);

  // Final structure
  card.appendChild(divCardImage);
  divCardImage.appendChild(img);
  divCardImage.appendChild(tagsContainer);
  if (optionsWrapper) divCardImage.appendChild(optionsWrapper);
  divCardImage.appendChild(buttonAdd);

  card.appendChild(divCardInfo);
  divCardInfo.appendChild(titleCard);
  divCardInfo.appendChild(divCardDetails);

  divCardDetails.appendChild(dateSpan);
  divCardDetails.appendChild(locationSpan);
  divCardDetails.appendChild(durationSpan);

  divCardDetails.appendChild(price_spots);

  // Link para la card
  const cardLink = document.createElement("a");
  cardLink.href = `/workshops/${workshop.id}`;
  cardLink.setAttribute("data-link", "");
  cardLink.appendChild(card);

  return cardLink;
}
