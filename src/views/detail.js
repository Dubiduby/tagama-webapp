import "../assets/styles/detail.css";
import {
  getCachedWorkshops,
  getCachedCategories,
  getCachedSubcategories,
  updateWorkshopCache,
} from "../utils/cache.js";
import dayjs from "../utils/day.js";
import { getCurrentUser, updateUser } from "../api/apiUsers.js";
import { showToast } from "../utils/toastify.js";
import { updateWorkshop } from "../api/apiWorkshops.js";
import { initMap } from "../utils/leaflet.js";

export default async function detail(container, id) {
  // Limpia solo el container, no el body.
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

  // Payment Modal logic
  function showPaymentModal(onSuccess, onCancel) {
    // Overlay
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = 0;
    overlay.style.left = 0;
    overlay.style.width = '100vw';
    overlay.style.height = '100vh';
    overlay.style.background = 'rgba(0,0,0,0.5)';
    overlay.style.display = 'flex';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    overlay.style.zIndex = 10000;

    // Modal
    const modal = document.createElement('div');
    modal.className = 'payment-card';
    modal.style.background = '#fff';
    modal.style.borderRadius = '10px';
    modal.style.boxShadow = '0 2px 16px rgba(0,0,0,0.2)';
    modal.style.padding = '2rem';
    modal.style.minWidth = '320px';
    modal.style.maxWidth = '90vw';
    modal.style.position = 'relative';

    // Close button
    const closeBtn = document.createElement('button');
    closeBtn.textContent = '×';
    closeBtn.style.position = 'absolute';
    closeBtn.style.top = '10px';
    closeBtn.style.right = '10px';
    closeBtn.style.background = 'transparent';
    closeBtn.style.border = 'none';
    closeBtn.style.fontSize = '1.5rem';
    closeBtn.style.cursor = 'pointer';
    closeBtn.addEventListener('click', () => {
      document.body.removeChild(overlay);
      if (onCancel) onCancel();
    });
    modal.appendChild(closeBtn);

    // Payment form (from your code, slightly adapted)
    const form = document.createElement('form');
    form.className = 'payment-form';
    form.style.display = 'flex';
    form.style.flexDirection = 'column';
    form.style.gap = '1rem';
    // Title
    const title = document.createElement('h1');
    title.textContent = 'Pago de servicios';
    form.appendChild(title);
    // Selector de proveedor
    const label = document.createElement('label');
    label.textContent = 'Elige tu método de pago: ';
    label.setAttribute('for', 'proveedor');
    form.appendChild(label);
    const select = document.createElement('select');
    select.id = 'proveedor';
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Selecciona un método de pago';
    defaultOption.disabled = true;
    defaultOption.selected = true;
    select.appendChild(defaultOption);
    ['Bizum', 'PayPal', 'Tarjeta'].forEach((prov) => {
      const option = document.createElement('option');
      option.value = prov.toLowerCase();
      option.textContent = prov;
      select.appendChild(option);
    });
    form.appendChild(select);
    // Campos para datos de tarjeta
    const cardFields = document.createElement('div');
    cardFields.className = 'card-fields';
    const cardNumberLabel = document.createElement('label');
    cardNumberLabel.textContent = 'Número de tarjeta:';
    cardNumberLabel.setAttribute('for', 'cardNumber');
    cardFields.appendChild(cardNumberLabel);
    const cardNumber = document.createElement('input');
    cardNumber.type = 'text';
    cardNumber.id = 'cardNumber';
    cardNumber.name = 'cardNumber';
    cardNumber.placeholder = '1234 5678 9012 3456';
    cardNumber.maxLength = '19';
    cardFields.appendChild(cardNumber);
    const holderLabel = document.createElement('label');
    holderLabel.textContent = 'Nombre del titular:';
    holderLabel.setAttribute('for', 'cardHolder');
    cardFields.appendChild(holderLabel);
    const cardHolder = document.createElement('input');
    cardHolder.type = 'text';
    cardHolder.id = 'cardHolder';
    cardHolder.name = 'cardHolder';
    cardHolder.placeholder = 'Juan Pérez';
    cardFields.appendChild(cardHolder);
    const row = document.createElement('div');
    row.className = 'row';
    const expiryDiv = document.createElement('div');
    const expiryLabel = document.createElement('label');
    expiryLabel.textContent = 'Fecha de caducidad:';
    expiryLabel.setAttribute('for', 'expiry');
    expiryDiv.appendChild(expiryLabel);
    const expiry = document.createElement('input');
    expiry.type = 'text';
    expiry.id = 'expiry';
    expiry.name = 'expiry';
    expiry.placeholder = 'MM/AA';
    expiry.maxLength = '5';
    expiryDiv.appendChild(expiry);
    row.appendChild(expiryDiv);
    const cvcDiv = document.createElement('div');
    const cvcLabel = document.createElement('label');
    cvcLabel.textContent = 'CVC:';
    cvcLabel.setAttribute('for', 'cvc');
    cvcDiv.appendChild(cvcLabel);
    const cvc = document.createElement('input');
    cvc.type = 'text';
    cvc.id = 'cvc';
    cvc.name = 'cvc';
    cvc.placeholder = '123';
    cvc.maxLength = '4';
    cvcDiv.appendChild(cvc);
    row.appendChild(cvcDiv);
    cardFields.appendChild(row);
    cardFields.style.display = 'none';
    form.appendChild(cardFields);
    // Bizum fields
    const bizumFields = document.createElement('div');
    bizumFields.className = 'payment-fields bizum-fields';
    bizumFields.style.display = 'none';
    const bizumLabel = document.createElement('label');
    bizumLabel.textContent = 'Número de teléfono:';
    bizumLabel.setAttribute('for', 'bizumPhone');
    bizumFields.appendChild(bizumLabel);
    const bizumPhone = document.createElement('input');
    bizumPhone.type = 'tel';
    bizumPhone.id = 'bizumPhone';
    bizumPhone.name = 'bizumPhone';
    bizumPhone.placeholder = '600 000 000';
    bizumPhone.maxLength = '12';
    bizumFields.appendChild(bizumPhone);
    const bizumInfo = document.createElement('p');
    bizumInfo.className = 'payment-info';
    bizumInfo.textContent = 'Recibirás una notificación en tu app de Bizum para confirmar el pago.';
    bizumInfo.style.fontSize = '0.9rem';
    bizumInfo.style.color = '#666';
    bizumInfo.style.marginTop = '0.5rem';
    bizumFields.appendChild(bizumInfo);
    form.appendChild(bizumFields);
    // PayPal fields
    const paypalFields = document.createElement('div');
    paypalFields.className = 'payment-fields paypal-fields';
    paypalFields.style.display = 'none';
    const paypalEmailLabel = document.createElement('label');
    paypalEmailLabel.textContent = 'Email de PayPal:';
    paypalEmailLabel.setAttribute('for', 'paypalEmail');
    paypalFields.appendChild(paypalEmailLabel);
    const paypalEmail = document.createElement('input');
    paypalEmail.type = 'email';
    paypalEmail.id = 'paypalEmail';
    paypalEmail.name = 'paypalEmail';
    paypalEmail.placeholder = 'tu@email.com';
    paypalFields.appendChild(paypalEmail);
    const paypalInfo = document.createElement('p');
    paypalInfo.className = 'payment-info';
    paypalInfo.textContent = 'Serás redirigido a PayPal para completar el pago de forma segura.';
    paypalInfo.style.fontSize = '0.9rem';
    paypalInfo.style.color = '#666';
    paypalInfo.style.marginTop = '0.5rem';
    paypalFields.appendChild(paypalInfo);
    form.appendChild(paypalFields);
    // Toggle fields
    function togglePaymentFields() {
      const selectedMethod = select.value;
      cardFields.style.display = 'none';
      bizumFields.style.display = 'none';
      paypalFields.style.display = 'none';
      if (selectedMethod === 'tarjeta') cardFields.style.display = 'block';
      else if (selectedMethod === 'bizum') bizumFields.style.display = 'block';
      else if (selectedMethod === 'paypal') paypalFields.style.display = 'block';
    }
    togglePaymentFields();
    select.addEventListener('change', togglePaymentFields);
    // Format card number
    cardNumber.addEventListener('input', (e) => {
      let value = e.target.value.replace(/\s/g, '').replace(/[^0-9]/gi, '');
      let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
      e.target.value = formattedValue;
    });
    expiry.addEventListener('input', (e) => {
      let value = e.target.value.replace(/\D/g, '');
      if (value.length >= 2) value = value.slice(0, 2) + '/' + value.slice(2);
      e.target.value = value;
    });
    cvc.addEventListener('input', (e) => {
      e.target.value = e.target.value.replace(/\D/g, '');
    });
    // Pay button
    const button = document.createElement('button');
    button.id = 'pagar';
    button.type = 'submit';
    button.textContent = 'Pagar';
    form.appendChild(button);
    // Status
    const status = document.createElement('div');
    status.id = 'status';
    form.appendChild(status);
    // Payment logic
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const proveedor = select.value;
      if (!proveedor) {
        status.textContent = 'Por favor, selecciona un método de pago.';
        return;
      }
      let isValid = true;
      let paymentData = {};
      if (proveedor === 'tarjeta') {
        paymentData = {
          number: cardNumber.value.replace(/\s/g, ''),
          expiry: expiry.value,
          cvc: cvc.value,
          holder: cardHolder.value
        };
        if (!paymentData.number || !paymentData.expiry || !paymentData.cvc || !paymentData.holder) {
          status.textContent = 'Por favor, completa todos los campos de la tarjeta.';
          isValid = false;
        }
      } else if (proveedor === 'bizum') {
        paymentData = { phone: bizumPhone.value };
        if (!paymentData.phone) {
          status.textContent = 'Por favor, introduce tu número de teléfono.';
          isValid = false;
        }
      } else if (proveedor === 'paypal') {
        paymentData = { email: paypalEmail.value };
        if (!paymentData.email) {
          status.textContent = 'Por favor, introduce tu email de PayPal.';
          isValid = false;
        }
      }
      if (!isValid) return;
      button.disabled = true;
      button.textContent = 'Procesando...';
      status.textContent = 'Procesando pago...';
      // Simulación de pago
      if (proveedor === 'tarjeta') {
        status.textContent = 'Procesando pago con tarjeta...';
        await new Promise(resolve => setTimeout(resolve, 2000));
        status.textContent = '¡Pago procesado correctamente!';
        await new Promise(resolve => setTimeout(resolve, 1500));
        document.body.removeChild(overlay);
        if (onSuccess) onSuccess();
        return;
      }
      if (proveedor === 'bizum') {
        status.textContent = 'Enviando solicitud a Bizum...';
        await new Promise(resolve => setTimeout(resolve, 2000));
        status.textContent = '¡Solicitud enviada! Revisa tu app de Bizum.';
        await new Promise(resolve => setTimeout(resolve, 1500));
        document.body.removeChild(overlay);
        if (onSuccess) onSuccess();
        return;
      }
      if (proveedor === 'paypal') {
        status.textContent = 'Conectando con PayPal...';
        await new Promise(resolve => setTimeout(resolve, 2000));
        status.textContent = '¡Pago procesado con PayPal!';
        await new Promise(resolve => setTimeout(resolve, 1500));
        document.body.removeChild(overlay);
        if (onSuccess) onSuccess();
        return;
      }
    });
    modal.appendChild(form);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
  }

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
    // Inscripción directa, sin plataforma de pago
    enrollBtn.disabled = true;
    enrollBtn.textContent = "Processing...";
    isEnrolled = currentUser.enrolledWorkshops.includes(id);
    const action = isEnrolled ? "cancel" : "enroll";
    if (isEnrolled) {
      currentUser.enrolledWorkshops = currentUser.enrolledWorkshops.filter(
        (workshopId) => workshopId !== id
      );
      workshopDetail.enrolled = workshopDetail.enrolled.filter(
        (userId) => userId !== currentUser.id
      );
    } else {
      currentUser.enrolledWorkshops.push(id);
      workshopDetail.enrolled.push(currentUser.id);
    }
    try {
      const [updatedWorkshop, updatedUser] = await Promise.all([
        updateWorkshop({ id: id, enrolled: workshopDetail.enrolled }),
        updateUser({ enrolledWorkshops: currentUser.enrolledWorkshops }),
      ]);
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));
      updateWorkshopCache(updatedWorkshop);
      isEnrolled = !isEnrolled;
      showToast(
        action === "cancel"
          ? "Your enroll was cancelled"
          : "You enrolled successfully",
        "success"
      );
      enrollBtn.textContent = isEnrolled ? "Cancel" : "Enroll";
      if (isEnrolled) {
        enrollBtn.style.background = "#e10505ff";
        enrollBtn.style.color = "#fff";
      } else {
        enrollBtn.style.background = "";
        enrollBtn.style.color = "";
      }
    } catch (error) {
      showToast("Error updating user or workshop", "error");
      if (action === "cancel") {
        currentUser.enrolledWorkshops.push(id);
        workshopDetail.enrolled.push(currentUser.id);
      } else {
        currentUser.enrolledWorkshops = currentUser.enrolledWorkshops.filter(
          (workshopId) => workshopId !== id
        );
        workshopDetail.enrolled = workshopDetail.enrolled.filter(
          (userId) => userId !== currentUser.id
        );
      }
    }
    enrollBtn.disabled = false;
    return;
  });
}
