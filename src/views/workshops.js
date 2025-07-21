import "../assets/styles/workshops.css";
import { getCurrentUser } from "../api/apiUsers";
import {
  getCachedWorkshops,
  getCachedCategories,
  getCachedSubcategories,
} from "../utils/cache.js";
import { renderWorkshops } from "../utils/renderCards.js";

export default function workshops(container) {
  container.innerHTML = "";

  const app = document.getElementById("app");

  // Contenedor general
  const workshopsContainer = document.createElement("div");
  workshopsContainer.classList.add("workshops-container");

  // Wrapper interior
  const workshopsWrapper = document.createElement("div");
  workshopsWrapper.classList.add("workshops-wrapper");

  // tabs navigation
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
    <div id="workshops-tab-content"></div>
  `; // Use button instead of <a> because is the same page
  //role tablist and role tab is for accesibility with keyboard

  workshopsContainer.appendChild(workshopsWrapper);
  app.appendChild(workshopsContainer);

  // dinamic content container
  const tabContent = workshopsWrapper.querySelector("#workshops-tab-content");

  //filter workshops depending of which tab you are
  function filterWorkshopsByTab(workshops, currentUser, tab) {
    if (tab === "enrolled") {
      return workshops.filter((workshop) =>
        currentUser.enrolledWorkshops?.includes(String(workshop.id))
      );
    }
    if (tab === "created") {
      return workshops.filter(
        (workshop) => String(workshop.creatorId) === String(currentUser.id)
      );
    }
    if (tab === "saved") {
      return workshops.filter((workshop) =>
        currentUser.savedWorkshops?.includes(String(workshop.id))
      );
    }
  }

  //render the content of the tabs
  async function showTab(tab) {
    const currentUser = getCurrentUser();

    //It does all the request together so it takes less time
    const [workshops, categories, subcategories] = await Promise.all([
      getCachedWorkshops(),
      getCachedCategories(),
      getCachedSubcategories(),
    ]);

    const filteredWorkshops = filterWorkshopsByTab(workshops, currentUser, tab);

    if (filteredWorkshops.length > 0) {
      renderWorkshops(tabContent, filteredWorkshops, categories, subcategories);
    } else {
      let message = "";
      if (tab === "enrolled") message = "You didn't enroll to any workshop yet";
      if (tab === "created") message = "You haven't created any workshops yet";
      if (tab === "saved") message = "You haven't saved any workshops yet";
      tabContent.innerHTML = `<p>${message}</p>`;
    }
  }

  //add event listener to the tabs
  workshopsWrapper
    .querySelector("#tab-enrolled")
    .addEventListener("click", (e) => {
      e.preventDefault();
      showTab("enrolled");
      setActiveTab("enrolled");
    });
  workshopsWrapper
    .querySelector("#tab-created")
    .addEventListener("click", (e) => {
      e.preventDefault();
      showTab("created");
      setActiveTab("created");
    });
  workshopsWrapper
    .querySelector("#tab-saved")
    .addEventListener("click", (e) => {
      e.preventDefault();
      showTab("saved");
      setActiveTab("saved");
    });

  // show first tab by default
  showTab("enrolled");
  setActiveTab("enrolled");

  //add and remove the active state to the tab
  function setActiveTab(tab) {
    ["enrolled", "created", "saved"].forEach((t) => {
      const btn = workshopsWrapper.querySelector(`#tab-${t}`);
      if (t === tab) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active"); //delete the active in the others
      }
    });
  }
}
