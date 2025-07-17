import "../assets/styles/detail.css";

export default function detail(container) {

  const workshop = {
    image: "src/assets/images/user.png",
    price: "149€",
    date: "Thursday, August 15, 2024",
    time: "11:00 AM (2 hours)",
    mode: "Online",
    spots: "X spots left of X",
    tags: ["Tech", "Online"],
    title: "TITLE OF WORKSHOP",
    instructor: "Name of instructor",
    overview: "Quodsi habent magnalia inter potentiam et divitias, et non illam quidem haec eo spectant haec quoque vos omnino desit illud quo solo felicitatis libertatisque perficiuntur.",
    requirements: [
      "Requirement 1",
      "Requirement 2",
      "Requirement 3",
      "Requirement 4",
      
    ],
    location: "Dirección del workshop"
  };

  document.body.innerHTML = "";

  // Back link
  const backLink = document.createElement('a');
  backLink.href = "#";
  backLink.className = "back-link";
  backLink.textContent = "< Back to Workshops";
  document.body.appendChild(backLink);

  // Contenedor principal
  const detailContent = document.createElement('div');
  detailContent.className = "workshop-detail-content";
  document.body.appendChild(detailContent);

  // Columna principal (imagen, tags, título, etc.)
  const mainColumn = document.createElement('div');
  mainColumn.className = "workshop-main-column";
  detailContent.appendChild(mainColumn);

  // Imagen arriba
  const imageDiv = document.createElement('div');
  imageDiv.className = "workshop-image";
  const img = document.createElement('img');
  img.src = workshop.image;
  img.alt = "Workshop image";
  imageDiv.appendChild(img);
  mainColumn.appendChild(imageDiv);

  // Tags
  const tagsDiv = document.createElement('div');
  tagsDiv.className = "workshop-tags";
  workshop.tags.forEach(tag => {
    const tagSpan = document.createElement('span');
    tagSpan.className = "tag";
    tagSpan.textContent = tag;
    tagsDiv.appendChild(tagSpan);
  });
  mainColumn.appendChild(tagsDiv);

  // Title
  const title = document.createElement('h1');
  title.className = "workshop-title";
  title.textContent = workshop.title;
  mainColumn.appendChild(title);

  // Instructor
  const instructor = document.createElement('div');
  instructor.className = "workshop-instructor";
  instructor.textContent = workshop.instructor;
  mainColumn.appendChild(instructor);

  // Tabs y contenido en un solo box
  const tabsBox = document.createElement('div');
  tabsBox.className = "workshop-tabs-box";

  // Tabs
  const tabsDiv = document.createElement('div');
  tabsDiv.className = "workshop-tabs";
  const overviewTab = document.createElement('button');
  overviewTab.className = "tab active";
  overviewTab.dataset.tab = "overview";
  overviewTab.textContent = "Overview";
  const requirementsTab = document.createElement('button');
  requirementsTab.className = "tab";
  requirementsTab.dataset.tab = "requirements";
  requirementsTab.textContent = "Requirements";
  tabsDiv.appendChild(overviewTab);
  tabsDiv.appendChild(requirementsTab);
  tabsBox.appendChild(tabsDiv);

  // Overview content
  const overviewDiv = document.createElement('div');
  overviewDiv.className = "workshop-tab-content";
  overviewDiv.id = "overview";
  const overviewP = document.createElement('p');
  overviewP.textContent = workshop.overview;
  overviewDiv.appendChild(overviewP);
  tabsBox.appendChild(overviewDiv);

  // Requirements content
  const requirementsDiv = document.createElement('div');
  requirementsDiv.className = "workshop-tab-content";
  requirementsDiv.id = "requirements";
  requirementsDiv.style.display = "none";
  const reqList = document.createElement('ul');
  workshop.requirements.forEach(req => {
    const li = document.createElement('li');
    li.textContent = req;
    reqList.appendChild(li);
  });
  requirementsDiv.appendChild(reqList);
  tabsBox.appendChild(requirementsDiv);

  // Añade el box al mainColumn
  mainColumn.appendChild(tabsBox);

  // Location
  const locationDiv = document.createElement('div');
  locationDiv.className = "workshop-location";
  const locationSpan = document.createElement('span');
  locationSpan.textContent = "Location";
  const locationP = document.createElement('p');
  locationP.textContent = workshop.location;
  locationDiv.appendChild(locationSpan);
  locationDiv.appendChild(locationP);
  mainColumn.appendChild(locationDiv);

  // Map
  const mapDiv = document.createElement('div');
  mapDiv.className = "workshop-map";
  mainColumn.appendChild(mapDiv);

  // Sidebar a la derecha
  const sidebar = document.createElement('aside');
  sidebar.className = "workshop-sidebar";

  const priceDiv = document.createElement('div');
  priceDiv.className = "workshop-price";
  priceDiv.textContent = workshop.price;
  sidebar.appendChild(priceDiv);

  // Fecha con icono
  const dateDiv = document.createElement('div');
  dateDiv.className = "workshop-date";
  dateDiv.style.display = "flex";
  dateDiv.style.alignItems = "center";
  const calendarIcon = document.createElement('span');
  calendarIcon.innerHTML = `<svg width="20" height="20" fill="none" stroke="#2563eb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>`;
  calendarIcon.style.marginRight = "8px";
  dateDiv.appendChild(calendarIcon);
  const dateText = document.createElement('span');
  dateText.textContent = workshop.date;
  dateDiv.appendChild(dateText);
  sidebar.appendChild(dateDiv);

  // Hora con icono
  const timeDiv = document.createElement('div');
  timeDiv.className = "workshop-time";
  timeDiv.style.display = "flex";
  timeDiv.style.alignItems = "center";
  const clockIcon = document.createElement('span');
  clockIcon.innerHTML = `<svg width="20" height="20" fill="none" stroke="#2563eb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>`;
  clockIcon.style.marginRight = "8px";
  timeDiv.appendChild(clockIcon);
  const timeText = document.createElement('span');
  timeText.textContent = workshop.time;
  timeDiv.appendChild(timeText);
  sidebar.appendChild(timeDiv);

  // Modo (ubicación) con icono
  const modeDiv = document.createElement('div');
  modeDiv.className = "workshop-mode";
  modeDiv.style.display = "flex";
  modeDiv.style.alignItems = "center";
  const locationIcon = document.createElement('span');
  locationIcon.innerHTML = `<svg width="20" height="20" fill="none" stroke="#2563eb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M12 21c-4.418 0-8-4.03-8-9a8 8 0 1 1 16 0c0 4.97-3.582 9-8 9z"/><circle cx="12" cy="12" r="3"/></svg>`;
  locationIcon.style.marginRight = "8px";
  modeDiv.appendChild(locationIcon);
  const modeText = document.createElement('span');
  modeText.textContent = workshop.mode;
  modeDiv.appendChild(modeText);
  sidebar.appendChild(modeDiv);

  // Plazas con icono
  const spotsDiv = document.createElement('div');
  spotsDiv.className = "workshop-spots";
  spotsDiv.style.display = "flex";
  spotsDiv.style.alignItems = "center";
  const peopleIcon = document.createElement('span');
  peopleIcon.innerHTML = `<svg width="20" height="20" fill="none" stroke="#2563eb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><circle cx="9" cy="7" r="4"/><circle cx="17" cy="7" r="4"/><path d="M2 21v-2a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4v2"/></svg>`;
  peopleIcon.style.marginRight = "8px";
  spotsDiv.appendChild(peopleIcon);
  const spotsText = document.createElement('span');
  spotsText.textContent = workshop.spots;
  spotsDiv.appendChild(spotsText);
  sidebar.appendChild(spotsDiv);

  // Botón
  const enrollBtn = document.createElement('button');
  enrollBtn.className = "enroll-btn";
  enrollBtn.textContent = "Enroll/Cancel";
  sidebar.appendChild(enrollBtn);

  detailContent.appendChild(sidebar);

  // Footer
  const footer = document.createElement('footer');
  footer.className = "footer";
  footer.textContent = "FOOTER";
  document.body.appendChild(footer);

  // Tabs logic
  [overviewTab, requirementsTab].forEach(tab => {
    tab.addEventListener('click', () => {
      overviewTab.classList.remove('active');
      requirementsTab.classList.remove('active');
      tab.classList.add('active');
      overviewDiv.style.display = tab.dataset.tab === "overview" ? "block" : "none";
      requirementsDiv.style.display = tab.dataset.tab === "requirements" ? "block" : "none";
    });
  });

}


