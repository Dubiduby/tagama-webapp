// Módulo para el modal de pago

export function showPaymentModal(onSuccess, onCancel) {
  // Overlay
  const overlay = document.createElement("div");
  overlay.className = "payment-modal-overlay";
  overlay.style.position = "fixed";
  overlay.style.top = 0;
  overlay.style.left = 0;
  overlay.style.width = "100vw";
  overlay.style.height = "100vh";
  overlay.style.background = "rgba(0,0,0,0.5)";
  overlay.style.display = "flex";
  overlay.style.alignItems = "center";
  overlay.style.justifyContent = "center";
  overlay.style.zIndex = 10000;

  // Modal
  const app = document.createElement("div");
  app.className = "payment-card";
  app.style.position = "relative";

  // Close button
  const closeBtn = document.createElement("button");
  closeBtn.textContent = "×";
  closeBtn.style.position = "absolute";
  closeBtn.style.top = "10px";
  closeBtn.style.right = "10px";
  closeBtn.style.background = "transparent";
  closeBtn.style.border = "none";
  closeBtn.style.fontSize = "1.5rem";
  closeBtn.style.cursor = "pointer";
  closeBtn.addEventListener("click", () => {
    document.body.removeChild(overlay);
    if (onCancel) onCancel();
  });
  app.appendChild(closeBtn);

  // Formulario de pago
  const form = document.createElement("form");
  form.className = "payment-form";
  // Título
  const title = document.createElement("h1");
  title.textContent = "Pago de servicios";
  form.appendChild(title);
  // Selector de proveedor
  const label = document.createElement("label");
  label.textContent = "Elige tu método de pago: ";
  label.setAttribute("for", "proveedor");
  form.appendChild(label);
  const select = document.createElement("select");
  select.id = "proveedor";
  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "Selecciona un método de pago";
  defaultOption.disabled = true;
  defaultOption.selected = true;
  select.appendChild(defaultOption);
  ["Bizum", "PayPal", "Tarjeta"].forEach((prov) => {
    const option = document.createElement("option");
    option.value = prov.toLowerCase();
    option.textContent = prov;
    select.appendChild(option);
  });
  form.appendChild(select);
  // Campos para datos de tarjeta
  const cardFields = document.createElement("div");
  cardFields.className = "card-fields";
  const cardNumberLabel = document.createElement("label");
  cardNumberLabel.textContent = "Número de tarjeta:";
  cardNumberLabel.setAttribute("for", "cardNumber");
  cardFields.appendChild(cardNumberLabel);
  const cardNumber = document.createElement("input");
  cardNumber.type = "text";
  cardNumber.id = "cardNumber";
  cardNumber.name = "cardNumber";
  cardNumber.placeholder = "1234 5678 9012 3456";
  cardNumber.maxLength = "19";
  cardFields.appendChild(cardNumber);
  const holderLabel = document.createElement("label");
  holderLabel.textContent = "Nombre del titular:";
  holderLabel.setAttribute("for", "cardHolder");
  cardFields.appendChild(holderLabel);
  const cardHolder = document.createElement("input");
  cardHolder.type = "text";
  cardHolder.id = "cardHolder";
  cardHolder.name = "cardHolder";
  cardHolder.placeholder = "Juan Pérez";
  cardFields.appendChild(cardHolder);
  const row = document.createElement("div");
  row.className = "row";
  const expiryDiv = document.createElement("div");
  const expiryLabel = document.createElement("label");
  expiryLabel.textContent = "Fecha de caducidad:";
  expiryLabel.setAttribute("for", "expiry");
  expiryDiv.appendChild(expiryLabel);
  const expiry = document.createElement("input");
  expiry.type = "text";
  expiry.id = "expiry";
  expiry.name = "expiry";
  expiry.placeholder = "MM/AA";
  expiry.maxLength = "5";
  expiryDiv.appendChild(expiry);
  row.appendChild(expiryDiv);
  const cvcDiv = document.createElement("div");
  const cvcLabel = document.createElement("label");
  cvcLabel.textContent = "CVC:";
  cvcLabel.setAttribute("for", "cvc");
  cvcDiv.appendChild(cvcLabel);
  const cvc = document.createElement("input");
  cvc.type = "text";
  cvc.id = "cvc";
  cvc.name = "cvc";
  cvc.placeholder = "123";
  cvc.maxLength = "4";
  cvcDiv.appendChild(cvc);
  row.appendChild(cvcDiv);
  cardFields.appendChild(row);
  cardFields.style.display = "none";
  form.appendChild(cardFields);
  // Bizum fields
  const bizumFields = document.createElement("div");
  bizumFields.className = "payment-fields bizum-fields";
  bizumFields.style.display = "none";
  const bizumLabel = document.createElement("label");
  bizumLabel.textContent = "Número de teléfono:";
  bizumLabel.setAttribute("for", "bizumPhone");
  bizumFields.appendChild(bizumLabel);
  const bizumPhone = document.createElement("input");
  bizumPhone.type = "tel";
  bizumPhone.id = "bizumPhone";
  bizumPhone.name = "bizumPhone";
  bizumPhone.placeholder = "600 000 000";
  bizumPhone.maxLength = "12";
  bizumFields.appendChild(bizumPhone);
  const bizumInfo = document.createElement("p");
  bizumInfo.className = "payment-info";
  bizumInfo.textContent =
    "Recibirás una notificación en tu app de Bizum para confirmar el pago.";
  bizumInfo.style.fontSize = "0.9rem";
  bizumInfo.style.color = "#666";
  bizumInfo.style.marginTop = "0.5rem";
  bizumFields.appendChild(bizumInfo);
  form.appendChild(bizumFields);
  // PayPal fields
  const paypalFields = document.createElement("div");
  paypalFields.className = "payment-fields paypal-fields";
  paypalFields.style.display = "none";
  const paypalEmailLabel = document.createElement("label");
  paypalEmailLabel.textContent = "Email de PayPal:";
  paypalEmailLabel.setAttribute("for", "paypalEmail");
  paypalFields.appendChild(paypalEmailLabel);
  const paypalEmail = document.createElement("input");
  paypalEmail.type = "email";
  paypalEmail.id = "paypalEmail";
  paypalEmail.name = "paypalEmail";
  paypalEmail.placeholder = "tu@email.com";
  paypalFields.appendChild(paypalEmail);
  const paypalInfo = document.createElement("p");
  paypalInfo.className = "payment-info";
  paypalInfo.textContent =
    "Serás redirigido a PayPal para completar el pago de forma segura.";
  paypalInfo.style.fontSize = "0.9rem";
  paypalInfo.style.color = "#666";
  paypalInfo.style.marginTop = "0.5rem";
  paypalFields.appendChild(paypalInfo);
  form.appendChild(paypalFields);
  // Toggle fields
  function togglePaymentFields() {
    const selectedMethod = select.value;
    cardFields.style.display = "none";
    bizumFields.style.display = "none";
    paypalFields.style.display = "none";
    if (selectedMethod === "tarjeta") cardFields.style.display = "block";
    else if (selectedMethod === "bizum") bizumFields.style.display = "block";
    else if (selectedMethod === "paypal") paypalFields.style.display = "block";
  }
  togglePaymentFields();
  select.addEventListener("change", togglePaymentFields);
  // Format card number
  cardNumber.addEventListener("input", (e) => {
    let value = e.target.value.replace(/\s/g, "").replace(/[^0-9]/gi, "");
    let formattedValue = value.match(/.{1,4}/g)?.join(" ") || value;
    e.target.value = formattedValue;
  });
  expiry.addEventListener("input", (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length >= 2) value = value.slice(0, 2) + "/" + value.slice(2);
    e.target.value = value;
  });
  cvc.addEventListener("input", (e) => {
    e.target.value = e.target.value.replace(/\D/g, "");
  });
  // Pay button
  const button = document.createElement("button");
  button.id = "pagar";
  button.type = "submit";
  button.textContent = "Pagar";
  form.appendChild(button);
  // Status
  const status = document.createElement("div");
  status.id = "status";
  form.appendChild(status);
  // Lógica de pago
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const proveedor = select.value;
    if (!proveedor) {
      status.textContent = "Por favor, selecciona un método de pago.";
      return;
    }
    let isValid = true;
    let paymentData = {};
    if (proveedor === "tarjeta") {
      paymentData = {
        number: cardNumber.value.replace(/\s/g, ""),
        expiry: expiry.value,
        cvc: cvc.value,
        holder: cardHolder.value,
      };
      if (
        !paymentData.number ||
        !paymentData.expiry ||
        !paymentData.cvc ||
        !paymentData.holder
      ) {
        status.textContent =
          "Por favor, completa todos los campos de la tarjeta.";
        isValid = false;
      }
    } else if (proveedor === "bizum") {
      paymentData = { phone: bizumPhone.value };
      if (!paymentData.phone) {
        status.textContent = "Por favor, introduce tu número de teléfono.";
        isValid = false;
      }
    } else if (proveedor === "paypal") {
      paymentData = { email: paypalEmail.value };
      if (!paymentData.email) {
        status.textContent = "Por favor, introduce tu email de PayPal.";
        isValid = false;
      }
    }
    if (!isValid) return;
    button.disabled = true;
    button.textContent = "Procesando...";
    status.textContent = "Procesando pago...";
    // Simulación de pago
    setTimeout(() => {
      status.textContent = "¡Pago procesado correctamente!";
      setTimeout(() => {
        document.body.removeChild(overlay);
        if (onSuccess) onSuccess();
      }, 1200);
    }, 2000);
  });
  app.appendChild(form);
  overlay.appendChild(app);
  document.body.appendChild(overlay);
}
