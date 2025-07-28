import "../assets/styles/main.css";
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
  const card = document.createElement("div");
  card.className = "workshop-card";

  const imageUrl = workshop.imageUrl
    ? workshop.imageUrl
    : new URL("../assets/images/no-image-default.jpg", import.meta.url).href;

  const divCardImage = document.createElement("div");
  divCardImage.className = "card-image";

  const img = document.createElement("img");
  img.src = imageUrl;
  img.alt = "Workshop Image";
  //divCardImage.appendChild(img);

  const buttonAdd = document.createElement("button");
  buttonAdd.className = "add-btn";
  buttonAdd.innerHTML = `<img src="${
    new URL("../assets/images/bookmark_Plus.svg", import.meta.url).href
  }" alt="Add to the list">`;
  buttonAdd.setAttribute("data-workshop-id", workshop.id);
  buttonAdd.setAttribute("aria-label", "Add to the list");

  const currentUser = getCurrentUser();

  // Check if workshop is created by current user
  if (
    currentUser &&
    currentUser.createdWorkshops &&
    currentUser.createdWorkshops.includes(String(workshop.id))
  ) {
    // If workshop is created by current user, show edit icon
    buttonAdd.innerHTML = `<img src="${
      new URL("../assets/images/select.svg", import.meta.url).href
    }" alt="Edit workshop">`;
    buttonAdd.setAttribute("aria-label", "Edit workshop");
  } else if (
    currentUser &&
    currentUser.savedWorkshops &&
    currentUser.savedWorkshops.includes(workshop.id)
  ) {
    // If workshop is saved, show the "Added" icon
    buttonAdd.innerHTML = `<img src="${
      new URL("../assets/images/bookmark-check.svg", import.meta.url).href
    }" alt="Added to the list">`;
  } else {
    // If not saved, show the normal bookmark icon
    buttonAdd.innerHTML = `<img src="${
      new URL("../assets/images/bookmark_Plus.svg", import.meta.url).href
    }" alt="Add to the list">`;
  }

  const divCardInfo = document.createElement("div");
  divCardInfo.className = "card-info";
  const titleCard = document.createElement("h3");
  titleCard.textContent = workshop.title;
  // divCardInfo.appendChild(titleCard);

  const divCardDetails = document.createElement("div");
  divCardDetails.className = "card-details";

  const dateSpan = document.createElement("span");
  dateSpan.className = "date";
  dateSpan.innerHTML = `<img src="${
    new URL("../assets/images/calendar.svg", import.meta.url).href
  }" alt="Calendar">  ${dayjs.unix(workshop.date).format("DD/MM/YYYY")}`;
  //dateSpan.textContent= workshop.date;

  const locationSpan = document.createElement("span");
  locationSpan.className = "location";
  locationSpan.innerHTML = `<img src="${
    new URL("../assets/images/location-pin.svg", import.meta.url).href
  }" alt="Location">  ${workshop.mode}`;

  const durationSpan = document.createElement("span");
  durationSpan.className = "duration";
  durationSpan.innerHTML = `<img src="${
    new URL("../assets/images/time.svg", import.meta.url).href
  }" alt="Duration">  ${workshop.duration} min`;

  const spots = document.createElement("span");
  spots.className = "spots";
  spots.innerHTML = `<img src="${
    new URL("../assets/images/spots.svg", import.meta.url).href
  }" alt="Spots">  ${workshop.enrolled.length}/${workshop.capacity}`;

  const workshopPrice = document.createElement("p");
  workshopPrice.textContent =
    workshop.price === 0 ? "Free" : `${workshop.price}€`;

  const workshopTagCat = document.createElement("span");
  workshopTagCat.className = "tags";
  workshopTagCat.textContent = category && category.name ? category.name : "";
  const workshopTagSub = document.createElement("span");
  workshopTagSub.className = "tags";
  workshopTagSub.textContent =
    subcategory && subcategory.name ? subcategory.name : "";

  card.appendChild(divCardImage);
  divCardImage.appendChild(img);
  divCardImage.appendChild(buttonAdd);

  card.appendChild(divCardInfo);
  divCardInfo.appendChild(titleCard);
  divCardInfo.appendChild(divCardDetails);

  divCardDetails.appendChild(dateSpan);
  divCardDetails.appendChild(locationSpan);
  divCardDetails.appendChild(durationSpan);
  divCardDetails.appendChild(spots);
  divCardDetails.appendChild(workshopPrice);
  divCardDetails.appendChild(workshopTagCat);
  divCardDetails.appendChild(workshopTagSub);

  //TODO:Add event listener icon saved
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
          showToast("Workshop updated successfully", "success");
          // Re-render the current page to show updated data
          window.location.reload();
        } catch (error) {
          showToast("Error updating workshop", "error");
          console.error("Error updating workshop:", error);
        }
      }, workshop);
    } else {
      // Handle save/unsave workshop (existing logic)
      if (!currentUser.savedWorkshops) currentUser.savedWorkshops = [];

      const position = currentUser.savedWorkshops.indexOf(workshop.id);
      if (position === -1) {
        currentUser.savedWorkshops.push(workshop.id);
        buttonAdd.innerHTML = `<img src="${
          new URL("../assets/images/bookmark-check.svg", import.meta.url).href
        }" alt="Added to the list">`;
      } else {
        currentUser.savedWorkshops.splice(position, 1);
        buttonAdd.innerHTML = `<img src="${
          new URL("../assets/images/bookmark_Plus.svg", import.meta.url).href
        }" alt="Add to the list">`;
      }
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
      updateUser(currentUser);
    }
  });

  //added so be able to go to the detail page
  const cardLink = document.createElement("a");
  cardLink.href = `/workshops/${workshop.id}`;
  cardLink.setAttribute("data-link", "");
  cardLink.appendChild(card);

  return cardLink;
}
