import "../assets/styles/detail.css";
import {
  getCachedWorkshops,
  getCachedCategories,
  getCachedSubcategories,
  updateWorkshopCache,
} from "../utils/cache.js";
import dayjs from "../utils/day.js";
import { getCurrentUser, updateUser, deleteUser } from "../api/apiUsers.js";
import { showToast } from "../utils/toastify.js";
import Toastify from "toastify-js";
import { updateWorkshop } from "../api/apiWorkshops.js";
import { initMap } from "../utils/leaflet.js";

export default async function detail(container, id) {
  // Limpia solo el container, no el body
  container.innerHTML = "";
  const currentUser = getCurrentUser();
  let isEnrolled = currentUser.enrolledWorkshops.includes(id);

  const [workshopsCache, categories, subcategories] = await Promise.all([
    getCachedWorkshops(),
    getCachedCategories(),
    getCachedSubcategories(),
  ]);

  const workshopDetail = workshopsCache.find((item) => item.id === id);
  const category = categories.find(
    (item) => Number(item.id) === Number(workshopDetail.categoryId)
  );
  const subcategory = subcategories.find(
    (item) => Number(item.id) === Number(workshopDetail.subcategoryId)
  );
  const dateTime = dayjs.unix(workshopDetail.date);
  const hours = Math.floor(workshopDetail.duration / 60);
  const minutes = workshopDetail.duration % 60;
  const formattedDuration =
    minutes === 0 ? `${hours}h` : `${hours}h ${minutes}min`;

  const workshop = {
    image: `${workshopDetail.imageUrl}`,
    price: workshopDetail.price,
    date: dateTime.format("dddd, D MMMM YYYY, HH:mm"),
    duration: formattedDuration,
    mode: workshopDetail.mode,
    spots: `${workshopDetail.enrolled.length} spots left of ${workshopDetail.capacity}`,
    tags: [subcategory.name, category.name],
    title: workshopDetail.title,
    instructor: workshopDetail.instructorName,
    overview: workshopDetail.overview,
    requirements: workshopDetail.requirements,
    location: workshopDetail.location,
    address: workshopDetail.address,
    coordinates: workshopDetail.coordinates,
  };

  // Back link
  const backLink = document.createElement("a");
  backLink.href = "/workshops";
  backLink.className = "back-link";
  backLink.textContent = "< Back to Workshops";
  container.appendChild(backLink);

  // Contenedor principal
  const detailContent = document.createElement("div");
  detailContent.className = "workshop-detail-content";
  container.appendChild(detailContent);

  // Columna principal (imagen, tags, título, etc.)
  const mainColumn = document.createElement("div");
  mainColumn.className = "workshop-main-column";
  detailContent.appendChild(mainColumn);

  // Imagen arriba
  const imageDiv = document.createElement("div");
  imageDiv.className = "workshop-image";
  const img = document.createElement("img");
  img.src = workshop.image;
  img.alt = "Workshop image";
  imageDiv.appendChild(img);
  mainColumn.appendChild(imageDiv);

  // Tags
  const tagsDiv = document.createElement("div");
  tagsDiv.className = "workshop-tags";
  workshop.tags.forEach((tag) => {
    const tagSpan = document.createElement("span");
    tagSpan.className = "tag";
    tagSpan.textContent = tag;
    tagsDiv.appendChild(tagSpan);
  });
  mainColumn.appendChild(tagsDiv);

  // Title
  const title = document.createElement("h1");
  title.className = "workshop-title";
  title.textContent = workshop.title;
  mainColumn.appendChild(title);

  // Instructor
  const instructor = document.createElement("div");
  instructor.className = "workshop-instructor";
  instructor.textContent = workshop.instructor;
  mainColumn.appendChild(instructor);

  // Tabs y contenido en un solo box
  const tabsBox = document.createElement("div");
  tabsBox.className = "workshop-tabs-box";

  // Tabs
  const tabsDiv = document.createElement("div");
  tabsDiv.className = "workshop-tabs";
  const overviewTab = document.createElement("button");
  overviewTab.className = "tab active";
  overviewTab.dataset.tab = "overview";
  overviewTab.textContent = "Overview";
  const requirementsTab = document.createElement("button");
  requirementsTab.className = "tab";
  requirementsTab.dataset.tab = "requirements";
  requirementsTab.textContent = "Requirements";
  tabsDiv.appendChild(overviewTab);
  tabsDiv.appendChild(requirementsTab);
  tabsBox.appendChild(tabsDiv);

  // Overview content
  const overviewDiv = document.createElement("div");
  overviewDiv.className = "workshop-tab-content";
  overviewDiv.id = "overview";
  const overviewP = document.createElement("p");
  overviewP.textContent = workshop.overview;
  overviewDiv.appendChild(overviewP);
  tabsBox.appendChild(overviewDiv);

  // Requirements content
  const requirementsDiv = document.createElement("div");
  requirementsDiv.className = "workshop-tab-content";
  requirementsDiv.id = "requirements";
  requirementsDiv.style.display = "none";
  const reqP = document.createElement("p");
  reqP.textContent = workshop.requirements;
  requirementsDiv.appendChild(reqP);
  tabsBox.appendChild(requirementsDiv);

  // Añade el box al mainColumn
  mainColumn.appendChild(tabsBox);

  if (workshop.mode === "On site") {
    // Location
    const locationDiv = document.createElement("div");
    locationDiv.className = "workshop-location";
    const locationSpan = document.createElement("span");
    locationSpan.textContent = "Location";
    const locationP = document.createElement("p");
    locationP.textContent = workshop.address;
    locationDiv.appendChild(locationSpan);
    locationDiv.appendChild(locationP);
    mainColumn.appendChild(locationDiv);

    // Map
    const mapDiv = document.createElement("div");
    mapDiv.id = "map";
    mapDiv.className = "workshop-map";
    mapDiv.style.height = "50vh";
    mainColumn.appendChild(mapDiv);
    initMap(workshop.coordinates, workshop.location);
  }

  // Sidebar a la derecha
  const sidebar = document.createElement("aside");
  sidebar.className = "workshop-sidebar";

  const priceDiv = document.createElement("div");
  priceDiv.className = "workshop-price";
  priceDiv.textContent = workshop.price === 0 ? "Free" : `${workshop.price}€`;
  sidebar.appendChild(priceDiv);

  // Fecha con icono
  const dateDiv = document.createElement("div");
  dateDiv.className = "workshop-date";
  dateDiv.style.display = "flex";
  dateDiv.style.alignItems = "center";
  const calendarIcon = document.createElement("span");
  calendarIcon.innerHTML = `<svg width="20" height="20" fill="none" stroke="#2563eb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>`;
  calendarIcon.style.marginRight = "8px";
  dateDiv.appendChild(calendarIcon);
  const dateText = document.createElement("span");
  dateText.textContent = workshop.date;
  dateDiv.appendChild(dateText);
  sidebar.appendChild(dateDiv);

  // Hora con icono
  const timeDiv = document.createElement("div");
  timeDiv.className = "workshop-time";
  timeDiv.style.display = "flex";
  timeDiv.style.alignItems = "center";
  const clockIcon = document.createElement("span");
  clockIcon.innerHTML = `<svg width="20" height="20" fill="none" stroke="#2563eb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>`;
  clockIcon.style.marginRight = "8px";
  timeDiv.appendChild(clockIcon);
  const timeText = document.createElement("span");
  timeText.textContent = workshop.duration;
  timeDiv.appendChild(timeText);
  sidebar.appendChild(timeDiv);

  // Modo (ubicación) con icono
  const modeDiv = document.createElement("div");
  modeDiv.className = "workshop-mode";
  modeDiv.style.display = "flex";
  modeDiv.style.alignItems = "center";
  const locationIcon = document.createElement("span");
  locationIcon.innerHTML = `<svg width="20" height="20" fill="none" stroke="#2563eb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M12 21c-4.418 0-8-4.03-8-9a8 8 0 1 1 16 0c0 4.97-3.582 9-8 9z"/><circle cx="12" cy="12" r="3"/></svg>`;
  locationIcon.style.marginRight = "8px";
  modeDiv.appendChild(locationIcon);
  const modeText = document.createElement("span");
  modeText.textContent = workshop.mode;
  modeDiv.appendChild(modeText);
  sidebar.appendChild(modeDiv);

  // Plazas con icono
  const spotsDiv = document.createElement("div");
  spotsDiv.className = "workshop-spots";
  spotsDiv.style.display = "flex";
  spotsDiv.style.alignItems = "center";
  const peopleIcon = document.createElement("span");
  peopleIcon.innerHTML = `<svg width="20" height="20" fill="none" stroke="#2563eb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><circle cx="9" cy="7" r="4"/><circle cx="17" cy="7" r="4"/><path d="M2 21v-2a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4v2"/></svg>`;
  peopleIcon.style.marginRight = "8px";
  spotsDiv.appendChild(peopleIcon);
  const spotsText = document.createElement("span");
  spotsText.textContent = workshop.spots;
  spotsDiv.appendChild(spotsText);
  sidebar.appendChild(spotsDiv);

  // Botón
  const enrollBtn = document.createElement("button");
  enrollBtn.className = "enroll-btn";
  if (isEnrolled) {
    enrollBtn.textContent = "Cancel";
    enrollBtn.style.background = "#e10505ff";
    enrollBtn.style.color = "#fff";
  } else {
    enrollBtn.textContent = "Enroll";
    enrollBtn.style.background = "";
    enrollBtn.style.color = "";
  }

  sidebar.appendChild(enrollBtn);

  detailContent.appendChild(sidebar);

  // Tabs logic
  [overviewTab, requirementsTab].forEach((tab) => {
    tab.addEventListener("click", () => {
      overviewTab.classList.remove("active");
      requirementsTab.classList.remove("active");
      tab.classList.add("active");
      overviewDiv.style.display =
        tab.dataset.tab === "overview" ? "block" : "none";
      requirementsDiv.style.display =
        tab.dataset.tab === "requirements" ? "block" : "none";
    });
  });

  enrollBtn.addEventListener("click", async () => {
    if (isEnrolled) {
      // Show confirmation dialog before cancelling
      let cancelToastId = null;
      if (cancelToastId) return;
      cancelToastId = Toastify({
        text: `\n          <span>Are you sure you want to cancel your subscription?</span>\n          <button id=\"confirm-cancel-btn\" style=\"margin-left:10px;padding:4px 10px;background:#e10505ff;color:#fff;border:none;border-radius:4px;cursor:pointer;\">Yes, cancel</button>\n        `,
        duration: -1, // Persistent: only closes on user action
        gravity: "top",
        position: "center",
        close: true,
        escapeMarkup: false,
        backgroundColor: "#e10505ff",
        stopOnFocus: true,
        callback: () => { cancelToastId = null; }
      }).showToast();

      setTimeout(() => {
        const confirmBtn = document.getElementById("confirm-cancel-btn");
        if (confirmBtn) {
          confirmBtn.onclick = async (e) => {
            e.stopPropagation();
            enrollBtn.disabled = true;
            enrollBtn.textContent = "Processing...";
            // Remove workshop from user's enrolledWorkshops
            currentUser.enrolledWorkshops = currentUser.enrolledWorkshops.filter(
              (workshopId) => workshopId !== id
            );
            // Remove user from workshop's enrolled list
            workshopDetail.enrolled = workshopDetail.enrolled.filter(
              (userId) => userId !== currentUser.id
            );
            try {
              const [updatedWorkshop, updatedUser] = await Promise.all([
                updateWorkshop({ id: id, enrolled: workshopDetail.enrolled }),
                updateUser({ enrolledWorkshops: currentUser.enrolledWorkshops }),
              ]);
              localStorage.setItem("currentUser", JSON.stringify(updatedUser));
              updateWorkshopCache(updatedWorkshop);
              showToast("Subscription cancelled!", "success");
              setTimeout(() => window.location.reload(), 1200);
            } catch (error) {
              showToast("Error cancelling subscription", "error");
              enrollBtn.disabled = false;
              enrollBtn.textContent = "Cancel";
              enrollBtn.style.background = "#e10505ff";
              enrollBtn.style.color = "#fff";
            }
          };
        }
      }, 100);
      return;
    }
    // Normal enroll logic if not enrolled
    enrollBtn.disabled = true;
    enrollBtn.textContent = "Processing...";
    isEnrolled = currentUser.enrolledWorkshops.includes(id);
    const action = isEnrolled ? "cancel" : "enroll";
    if (!isEnrolled) {
      currentUser.enrolledWorkshops.push(id);
      workshopDetail.enrolled.push(currentUser.id);
      try {
        const [updatedWorkshop, updatedUser] = await Promise.all([
          updateWorkshop({ id: id, enrolled: workshopDetail.enrolled }),
          updateUser({ enrolledWorkshops: currentUser.enrolledWorkshops }),
        ]);
        if (!updateWorkshop || !updateUser) {
          throw new Error("Update workshop or user failed");
        }
        localStorage.setItem("currentUser", JSON.stringify(updatedUser));
        updateWorkshopCache(updatedWorkshop);
        isEnrolled = true;
        showToast("You enrolled successfully", "success");
        enrollBtn.textContent = "Cancel";
        enrollBtn.style.background = "#e10505ff";
        enrollBtn.style.color = "#fff";
      } catch (error) {
        showToast("Error updating user or workshop", "error");
        currentUser.enrolledWorkshops = currentUser.enrolledWorkshops.filter(
          (workshopId) => workshopId !== id
        );
        workshopDetail.enrolled = workshopDetail.enrolled.filter(
          (userId) => userId !== currentUser.id
        );
      }
      enrollBtn.disabled = false;
    }
  });

  // Utility function for element creation (copied from profile.js)
  function $(tag, props = {}, ...children) {
    const el = document.createElement(tag);
    Object.entries(props).forEach(([k, v]) => {
      if (k.startsWith('on') && typeof v === 'function') {
        el.addEventListener(k.slice(2).toLowerCase(), v);
      } else if (k === 'class') {
        el.className = v;
      } else if (k === 'style' && typeof v === 'object') {
        Object.assign(el.style, v);
      } else if (k === 'for') {
        el.htmlFor = v;
      } else {
        el.setAttribute(k, v);
      }
    });
    children.flat().forEach(child => {
      if (typeof child === 'string' || typeof child === 'number') {
        el.appendChild(document.createTextNode(child));
      } else if (child instanceof Node) {
        el.appendChild(child);
      }
    });
    return el;
  }
}
