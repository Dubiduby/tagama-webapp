import { getCurrentUser, updateUser } from "../api/apiUsers";
import dayjs from "dayjs";
import { showToast } from "../utils/toastify";
import { updateWorkshopCache } from "../utils/cache.js";
import { updateWorkshop } from "../api/apiWorkshops.js";
import {
  showModal,
  handleWorkshopFormSubmit,
  renderWorkshopFormHtml,
  closeModal,
} from "../utils/formModal.js";

export function workshopCards(workshop, subcategory, category) {
  // Card container
  const card = document.createElement("div");
  card.className ="w-80 md:w-96 min-h-[420px] bg-[var(--color-2bg)] rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.08)] overflow-hidden flex flex-col transition-transform transition-shadow duration-150 relative hover:-translate-y-1.5 hover:scale-[1.03] hover:shadow-[0_6px_24px_rgba(0,0,0,0.15)] dark:border-[#797b6c] border-[1px]";
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

  // Add/save button
  const buttonAdd = document.createElement("button");
  buttonAdd.className =
    "absolute top-3 right-3 bg-[#f7f7f7] border-none rounded-full p-2 cursor-pointer shadow-[0_2px_6px_rgba(0,0,0,0.08)] transition-colors duration-200 hover:bg-[#e0e0e0]";
  buttonAdd.innerHTML = `<img src="${
    new URL("../assets/images/bookmark_Plus.svg", import.meta.url).href
  }" alt="Añadir a la lista" class="w-7 h-7 block object-contain">`;
  buttonAdd.setAttribute("data-workshop-id", workshop.id);
  buttonAdd.setAttribute("aria-label", "Añadir a la lista");

  const currentUser = getCurrentUser();

  // Check if workshop is created by current user
  if (
    currentUser &&
    currentUser.createdWorkshops &&
    currentUser.createdWorkshops.includes(String(workshop.id))
  ) {
    buttonAdd.innerHTML = `<img src="${
      new URL("../assets/images/select.svg", import.meta.url).href
    }" alt="Editar taller" class="w-7 h-7 block object-contain">`;
    buttonAdd.setAttribute("aria-label", "Editar taller");
  } else if (
    currentUser &&
    currentUser.savedWorkshops &&
    currentUser.savedWorkshops.includes(workshop.id)
  ) {
    buttonAdd.innerHTML = `<img src="${
      new URL("../assets/images/bookmark-check.svg", import.meta.url).href
    }" alt="Añadido a la lista" class="w-7 h-7 block object-contain">`;
  } else {
    buttonAdd.innerHTML = `<img src="${
      new URL("../assets/images/bookmark_Plus.svg", import.meta.url).href
    }" alt="Añadir a la lista" class="w-7 h-7 block object-contain">`;
  }

  // Card info
  const divCardInfo = document.createElement("div");
  divCardInfo.className = "p-4 flex-1 flex flex-col gap-2";

  const titleCard = document.createElement("h3");
  titleCard.textContent = workshop.title;
  titleCard.className = "mb-2 text-[1.15rem] text-[var(--color-title)] font-semibold line-clamp-2";

  // Card details
  const divCardDetails = document.createElement("div");
  divCardDetails.className =
    "flex flex-col  gap-x-4 gap-y-2 text-[0.95rem] text-[#666]";

  const dateSpan = document.createElement("span");
  dateSpan.className =
    " text-[var(--color-text)] flex items-center gap-[0.4em] font-semibold";
  dateSpan.innerHTML = `<img src="${
    new URL("../assets/images/calendar.svg", import.meta.url).href
  }" alt="Calendario" class="w-[18px] h-[18px] inline-block object-contain mr-1 align-middle">  ${dayjs
    .unix(workshop.date)
    .format("DD/MM/YYYY")}`;

  const locationSpan = document.createElement("span");
  locationSpan.className =
    " text-[var(--color-text)] flex  items-center gap-[0.2rem] font-semibold";
  locationSpan.innerHTML = `<img src="${
    new URL("../assets/images/location-pin.svg", import.meta.url).href
  }" alt="Ubicación" class="w-[18px] h-[18px] inline-block object-contain mr-1 align-middle">  ${workshop.mode}`;

  const durationSpan = document.createElement("span");
  durationSpan.className =
    "text-[var(--color-text)] flex items-center gap-[0.4em] font-semibold";
  durationSpan.innerHTML = `<img src="${
    new URL("../assets/images/time.svg", import.meta.url).href
  }" alt="Duración" class="w-[18px] h-[18px] inline-block object-contain mr-1 align-middle">  ${workshop.duration} min`;

  const spots = document.createElement("span");
  spots.className =
    "text-[var(--color-text)] flex items-center gap-[0.4em] font-semibold";
  spots.innerHTML = `<img src="${
    new URL("../assets/images/spots.svg", import.meta.url).href
  }" alt="Plazas" class="w-[18px] h-[18px] inline-block object-contain mr-1 align-middle">  ${workshop.enrolled.length}/${workshop.capacity}`;

  // Price
  const workshopPrice = document.createElement("span");
  workshopPrice.textContent =
    workshop.price === 0 ? "Gratis" : `${workshop.price}€`;
  workshopPrice.className = "text-[#797b6c]  font-bold text-[#1a1a1a] text-xl dark:text-[#f4f2f0]";
 
  const price_spots = document.createElement("div");
  price_spots.className = "flex  gap-60 items-center ";
  price_spots.appendChild(spots);
   price_spots.appendChild(workshopPrice);
  
 
 


 
  // Final structure
  card.appendChild(divCardImage);
  divCardImage.appendChild(img);
  divCardImage.appendChild(tagsContainer);
  divCardImage.appendChild(buttonAdd);

  card.appendChild(divCardInfo);
  divCardInfo.appendChild(titleCard);
  divCardInfo.appendChild(divCardDetails);

  divCardDetails.appendChild(dateSpan);
  divCardDetails.appendChild(locationSpan);
  divCardDetails.appendChild(durationSpan);
  divCardDetails.appendChild(price_spots);

  // Event listener para el botón
  buttonAdd.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    const currentUser = getCurrentUser();

    // Check if workshop is created by current user
    if (
      currentUser &&
      currentUser.createdWorkshops &&
      currentUser.createdWorkshops.includes(String(workshop.id))
    ) {
      // Handle edit workshop - open modal with workshop data
      showModal(renderWorkshopFormHtml(workshop));
      handleWorkshopFormSubmit(async (formData) => {
        try {
          const updatedWorkshop = await updateWorkshop(formData);
          updateWorkshopCache(updatedWorkshop);
          closeModal();
          showToast("Taller actualizado exitosamente", "success");
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        } catch (error) {
          showToast("Error al actualizar el taller", "error");
          console.error("Error updating workshop:", error);
        }
      }, workshop);
    } else {
      // Handle save/unsave workshop
      if (!currentUser.savedWorkshops) currentUser.savedWorkshops = [];

      const position = currentUser.savedWorkshops.indexOf(workshop.id);
      if (position === -1) {
        currentUser.savedWorkshops.push(workshop.id);
        buttonAdd.innerHTML = `<img src="${
          new URL("../assets/images/bookmark-check.svg", import.meta.url).href
        }" alt="Añadido a la lista" class="w-7 h-7 block object-contain">`;
      } else {
        currentUser.savedWorkshops.splice(position, 1);
        buttonAdd.innerHTML = `<img src="${
          new URL("../assets/images/bookmark_Plus.svg", import.meta.url).href
        }" alt="Añadir a la lista" class="w-7 h-7 block object-contain">`;
      }
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
      updateUser(currentUser);
    }
  });

  // Link para la card
  const cardLink = document.createElement("a");
  cardLink.href = `/workshops/${workshop.id}`;
  cardLink.setAttribute("data-link", "");
  cardLink.appendChild(card);

  return cardLink;
}