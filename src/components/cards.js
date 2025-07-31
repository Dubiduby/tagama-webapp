import { getCurrentUser, updateUser } from "../api/apiUsers";
import dayjs from "dayjs";
import { showToast } from "../utils/toastify";
import {
  clearWorkshopsCache,
  getCachedWorkshops,
  updateWorkshopCache,
} from "../utils/cache.js";
import {
  updateWorkshop,
  deleteWorkshop,
  createWorkshop,
} from "../api/apiWorkshops.js";
import {
  createEditWorkshopModal,
  closeModal,
} from "../components/modals/formModal.js";
import { showConfirmModal } from "./modals/confirmModal.js";

export function workshopCards(workshop, subcategory, category) {
  // Card container
  const card = document.createElement("div");
  card.className =
    "w-96 max-w-xs md:max-w-lg lg:max-w-xl xl:max-w-2xl h-full flex-1 bg-[var(--color-2bg)]  rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.08)] overflow-hidden flex flex-col transition-transform transition-shadow duration-150 relative hover:-translate-y-1.5 hover:scale-[1.03] hover:shadow-[0_6px_24px_rgba(0,0,0,0.15)] dark:border-[#797b6c] border-[1px] ";
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
  tagsContainer.className =
    "absolute top-3 left-3 flex gap-2 z-10 max-w-[250px] md:max-w-[300px]";

  const workshopTagCat = document.createElement("span");
  workshopTagCat.className =
    "bg-dark-green text-white rounded-[12px] px-3 py-[2px] text-[0.75rem] md:text-[0.8rem] font-medium ";
  workshopTagCat.textContent = category && category.name ? category.name : "";

  const workshopTagSub = document.createElement("span");
  workshopTagSub.className =
    "bg-[#ad5733] text-white rounded-[12px] px-2 py-[2px] text-[0.75rem] md:text-[0.8rem] font-medium ";
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
    optionsWrapper.className = "absolute top-2 right-2";

    const optionsBtn = document.createElement("button");
    optionsBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-ellipsis-vertical-icon lucide-ellipsis-vertical"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>`;
    optionsBtn.className = `
    bg-white dark:bg-black/60 text-black dark:text-white border rounded-full
    w-9 h-9 cursor-pointer text-base leading-[18px]
    flex items-center justify-center
  `;

    const dropdown = document.createElement("div");
    dropdown.className = `
    hidden absolute top-9 right-0 bg-[var(--color-bg)] border border-gray-200 rounded-md
    shadow-md min-w-[110px] z-50
  `;

    const editOption = document.createElement("button");
    editOption.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pencil-icon lucide-pencil"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/></svg> Editar`;
    editOption.className = `
    flex gap-2 items-center w-full px-3 py-1.5 text-left text-sm text-[--color-grey]
    hover:bg-dark-green/10 cursor-pointer
    bg-transparent border-none
  `;

    const deleteOption = document.createElement("button");
    deleteOption.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-x-icon lucide-circle-x"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg> <p>Eliminar</p>`;
    deleteOption.className = `
    flex gap-2 items-center w-full px-3 py-1.5 text-left text-sm
    hover:bg-dark-green/10 cursor-pointer text-red-600 dark:text-red-400
    bg-transparent border-none
  `;

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
            let result;
            // Si el workshop tiene ID, intentar actualizar
            if (formData.id) {
              try {
                result = await updateWorkshop(formData);
                showToast("Taller actualizado exitosamente", "success");
              } catch (error) {
                // Si el workshop no existe (404), crear uno nuevo
                if (error.message.includes("not found")) {
                  console.log("Workshop not found, creating new one...");
                  delete formData.id; // Remover ID para crear nuevo
                  result = await createWorkshop(formData);
                  showToast("Taller creado exitosamente", "success");
                } else {
                  throw error; // Re-throw otros errores
                }
              }
            } else {
              // Si no tiene ID, crear nuevo workshop
              result = await createWorkshop(formData);
              showToast("Taller creado exitosamente", "success");
            }

            updateWorkshopCache(result);
            closeModal();
            setTimeout(() => window.location.reload(), 1000);
          } catch (error) {
            console.error("Error in workshop submission:", error);
            showToast("Error al procesar el taller", "error");
          }
        },
      });
    });

    deleteOption.addEventListener("click", (e) => {
      e.stopPropagation();
      e.preventDefault();

      showConfirmModal({
        message: `¿Seguro que deseas eliminar el taller "${workshop.title}"?`,
        buttonText: "eliminar",
        buttonColor: "red",
        onConfirm: async () => {
          try {
            const workshopId = workshop.id;

            if (!workshopId || isNaN(Number(workshopId))) {
              showToast("Este taller no tiene un ID válido.", "error");
              return;
            }

            // Deshabilitar UI, mostrar feedback si quieres
            deleteOption.disabled = true;
            deleteOption.textContent = "Procesando...";

            const success = await deleteWorkshop(workshopId);
            if (success) {
              const currentUser = getCurrentUser();
              currentUser.createdWorkshops =
                currentUser.createdWorkshops.filter(
                  (wid) => String(wid) !== String(workshopId)
                );
              localStorage.setItem("currentUser", JSON.stringify(currentUser));
              await updateUser(currentUser);
              clearWorkshopsCache();
              getCachedWorkshops();
              showToast("Taller eliminado exitosamente", "success");
              setTimeout(() => window.location.reload(), 1000);
            } else {
              showToast(`No se encontró taller con ID: ${workshopId}`, "error");
              // Aquí podrías reactivar el botón si quieres
              deleteOption.disabled = false;
              deleteOption.textContent = "Eliminar";
            }
          } catch (error) {
            console.error("Error deleting workshop:", error);
            showToast("Error al eliminar el taller", "error");
            deleteOption.disabled = false;
            deleteOption.textContent = "Eliminar";
          }
        },
      });
    });
  }

  // Botón de bookmark
  const buttonAdd = document.createElement("button");
  buttonAdd.className =
    "absolute top-3 right-3 bg-white border-none rounded-full p-2 cursor-pointer shadow-[0_2px_6px_rgba(0,0,0,0.08)] transition-colors duration-200 hover:bg-[#e0e0e0] dark:bg-[#141414]";
  const isCreator =
    currentUser &&
    currentUser.createdWorkshops &&
    currentUser.createdWorkshops.includes(String(workshop.id));

  // Function to render the button icon based on saved status
  function renderButtonIcon() {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const isSaved = currentUser?.savedWorkshops?.includes(String(workshop.id));

    buttonAdd.innerHTML = isSaved
      ? `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5 block object-contain text-black dark:text-white"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2Z"/><path d="m9 10 2 2 4-4"/></svg>`
      : `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5 block object-contain text-black dark:text-white"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/><line x1="12" x2="12" y1="7" y2="13"/><line x1="15" x2="9" y1="10" y2="10"/></svg> `;
  }

  if (!isCreator) {
    renderButtonIcon();
    buttonAdd.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      //always get de update user
      let currentUser = JSON.parse(localStorage.getItem("currentUser"));
      if (!currentUser.savedWorkshops) currentUser.savedWorkshops = [];
      const idx = currentUser.savedWorkshops.indexOf(String(workshop.id));
      if (idx === -1) {
        currentUser.savedWorkshops.push(String(workshop.id));
        buttonAdd.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5 block object-contain text-black dark:text-white"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2Z"/><path d="m9 10 2 2 4-4"/></svg>`;
      } else {
        currentUser.savedWorkshops.splice(idx, 1);
        buttonAdd.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5 block object-contain text-black dark:text-white"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/><line x1="12" x2="12" y1="7" y2="13"/><line x1="15" x2="9" y1="10" y2="10"/></svg> `;
      }
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
      updateUser(currentUser);
      renderButtonIcon();
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
    "mb-2 text-[1rem] md:text-[1.15rem] text-[var(--color-title)] font-semibold line-clamp-2  break-words";

  // Card details
  const divCardDetails = document.createElement("div");
  divCardDetails.className = "flex flex-col  gap-x-4 gap-y-2 text-[0.95rem] ";

  const dateSpan = document.createElement("span");
  dateSpan.className =
    " text-[var(--color-text)] text-[14px] md:text-[1.2rem]flex items-center gap-[0.4em]";
  dateSpan.innerHTML = `  <svg xmlns="http://www.w3.org/2000/svg"
       width="18"
       height="18"
       viewBox="0 0 24 24"
       fill="none"
       stroke="currentColor"
       stroke-width="2"
       stroke-linecap="round"
       stroke-linejoin="round"
       class="w-5 h-5 inline-block object-contain mr-1 align-middle text-dark-orange dark:text-light-orange"
       aria-hidden="true">
    <path d="M8 2v4"/>
    <path d="M16 2v4"/>
    <rect width="18" height="18" x="3" y="4" rx="2"/>
    <path d="M3 10h18"/>
  </svg>
  ${dayjs.unix(workshop.date).format("DD/MM/YYYY")}`;

  const locationSpan = document.createElement("span");
  locationSpan.className =
    " text-[var(--color-text)] flex  items-center gap-[0.2rem]";
  locationSpan.innerHTML = ` <svg xmlns="http://www.w3.org/2000/svg"
       width="24"
       height="24"
       viewBox="0 0 24 24"
       fill="none"
       stroke="currentColor"
       stroke-width="2"
       stroke-linecap="round"
       stroke-linejoin="round"
       class="w-5 h-5 inline-block object-contain mr-1 align-middle text-dark-orange dark:text-light-orange">
    <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
  ${workshop.mode}`;

  const durationSpan = document.createElement("span");
  durationSpan.className =
    "text-[var(--color-text)] flex items-center gap-[0.4em]";

  // const hours = Math.floor(workshop.duration / 60);
  // const minutes = workshop.duration % 60;
  // const formattedDuration =
  //   hours > 0
  //     ? `${hours}h${minutes > 0 ? ` ${minutes}min` : ""}`
  //     : `${minutes} min`;
  const hours = Math.floor(workshop.duration / 60);
  const minutes = workshop.duration % 60;
  const formattedDuration =
    minutes === 0 ? `${hours}h` : `${hours}h ${minutes}min`;
  durationSpan.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5 inline-block object-contain mr-1 align-middle text-dark-orange dark:text-light-orange"><path d="M12 6v6l4 2"/><circle cx="12" cy="12" r="10"/></svg>  ${formattedDuration}`;

  const spots = document.createElement("span");
  spots.className = "text-[var(--color-text)] flex items-center gap-[0.4em]";
  spots.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 inline-block object-contain mr-1 align-middle text-dark-orange dark:text-light-orange">
  <path stroke-linecap="round" stroke-linejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
</svg>
   ${workshop.enrolled.length}/${workshop.capacity}`;

  // Price
  const workshopPrice = document.createElement("span");
  workshopPrice.textContent =
    workshop.price === 0 ? "Gratis" : `${workshop.price}€`;

  workshopPrice.className =
    "text-[#797b6c]  font-bold text-[#1a1a1a] text-lg dark:text-[#f4f2f0]";

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
