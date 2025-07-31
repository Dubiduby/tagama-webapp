export function showPaymentModal(onSuccess, onCancel) {
  // Overlay
  const overlay = document.createElement("div");
  overlay.className =
    "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[10000]";

  // Modal
  const app = document.createElement("div");
  app.className =
    "relative bg-[var(--color-bg)] dark:bg-[var(--color-2bg)] text-[var(--color-text)] rounded-lg shadow-lg w-full max-w-md p-6";

  // Botón de cerrar
  const closeBtn = document.createElement("button");
  closeBtn.textContent = "×";
  closeBtn.className =
    "absolute top-2 right-2 text-2xl text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white";
  closeBtn.addEventListener("click", () => {
    document.body.removeChild(overlay);
    if (onCancel) onCancel();
  });
  app.appendChild(closeBtn);

  // Formulario
  const form = document.createElement("form");
  form.className = "space-y-4";

  // Título
  const title = document.createElement("h1");
  title.textContent = "Pago de servicios";
  title.className = "text-xl font-semibold text-[var(--color-title)]";
  form.appendChild(title);

  // Selector de proveedor
  const label = document.createElement("label");
  label.textContent = "Elige tu método de pago:";
  label.setAttribute("for", "proveedor");
  label.className = "block text-sm font-medium";
  form.appendChild(label);

  const select = document.createElement("select");
  select.id = "proveedor";
  select.className =
    "w-full border border-gray-300 rounded px-3 py-2 mt-1 bg-white dark:bg-[var(--color-bg)]";
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

  // Campos para tarjeta
  const cardFields = document.createElement("div");
  cardFields.className = "space-y-3 hidden";

  const makeInputGroup = (labelText, id, type, placeholder, maxLength) => {
    const wrapper = document.createElement("div");
    const label = document.createElement("label");
    label.textContent = labelText;
    label.setAttribute("for", id);
    label.className = "block text-sm font-medium";
    const input = document.createElement("input");
    input.type = type;
    input.id = id;
    input.name = id;
    input.placeholder = placeholder;
    if (maxLength) input.maxLength = maxLength;
    input.className =
      "w-full border border-gray-300 rounded px-3 py-2 mt-1 bg-white dark:bg-[var(--color-bg)]";
    wrapper.appendChild(label);
    wrapper.appendChild(input);
    return { wrapper, input };
  };

  const { wrapper: cardNumberWrap, input: cardNumber } = makeInputGroup(
    "Número de tarjeta:",
    "cardNumber",
    "text",
    "1234 5678 9012 3456",
    19
  );
  cardFields.appendChild(cardNumberWrap);

  const { wrapper: cardHolderWrap, input: cardHolder } = makeInputGroup(
    "Nombre del titular:",
    "cardHolder",
    "text",
    "Juan Pérez"
  );
  cardFields.appendChild(cardHolderWrap);

  const row = document.createElement("div");
  row.className = "flex gap-4";

  const { wrapper: expiryWrap, input: expiry } = makeInputGroup(
    "Fecha de caducidad:",
    "expiry",
    "text",
    "MM/AA",
    5
  );
  const { wrapper: cvcWrap, input: cvc } = makeInputGroup(
    "CVC:",
    "cvc",
    "text",
    "123",
    4
  );

  row.appendChild(expiryWrap);
  row.appendChild(cvcWrap);
  cardFields.appendChild(row);
  form.appendChild(cardFields);

  // Bizum
  const bizumFields = document.createElement("div");
  bizumFields.className = "hidden space-y-2";
  const { wrapper: bizumWrap, input: bizumPhone } = makeInputGroup(
    "Número de teléfono:",
    "bizumPhone",
    "tel",
    "600 000 000",
    12
  );
  bizumFields.appendChild(bizumWrap);
  const bizumInfo = document.createElement("p");
  bizumInfo.textContent =
    "Recibirás una notificación en tu app de Bizum para confirmar el pago.";
  bizumInfo.className = "text-sm text-gray-600 dark:text-gray-400";
  bizumFields.appendChild(bizumInfo);
  form.appendChild(bizumFields);

  // PayPal
  const paypalFields = document.createElement("div");
  paypalFields.className = "hidden space-y-2";
  const { wrapper: paypalWrap, input: paypalEmail } = makeInputGroup(
    "Email de PayPal:",
    "paypalEmail",
    "email",
    "tu@email.com"
  );
  paypalFields.appendChild(paypalWrap);
  const paypalInfo = document.createElement("p");
  paypalInfo.textContent =
    "Serás redirigido a PayPal para completar el pago de forma segura.";
  paypalInfo.className = "text-sm text-gray-600 dark:text-gray-400";
  paypalFields.appendChild(paypalInfo);
  form.appendChild(paypalFields);

  // Mostrar campos
  function togglePaymentFields() {
    cardFields.classList.add("hidden");
    bizumFields.classList.add("hidden");
    paypalFields.classList.add("hidden");
    const method = select.value;
    if (method === "tarjeta") cardFields.classList.remove("hidden");
    else if (method === "bizum") bizumFields.classList.remove("hidden");
    else if (method === "paypal") paypalFields.classList.remove("hidden");
  }
  togglePaymentFields();
  select.addEventListener("change", togglePaymentFields);

  // Format
  cardNumber.addEventListener("input", (e) => {
    let value = e.target.value.replace(/\s/g, "").replace(/\D/g, "");
    let formatted = value.match(/.{1,4}/g)?.join(" ") || value;
    e.target.value = formatted;
  });
  expiry.addEventListener("input", (e) => {
    let v = e.target.value.replace(/\D/g, "");
    if (v.length >= 2) v = v.slice(0, 2) + "/" + v.slice(2);
    e.target.value = v;
  });
  cvc.addEventListener("input", (e) => {
    e.target.value = e.target.value.replace(/\D/g, "");
  });

  // Botón de pago
  const button = document.createElement("button");
  button.id = "pagar";
  button.type = "submit";
  button.textContent = "Pagar";
  button.className =
    "bg-dark-orange text-white px-4 py-2 rounded hover:bg-orange-700 transition";
  form.appendChild(button);

  // Estado
  const status = document.createElement("div");
  status.id = "status";
  status.className = "text-sm mt-2 text-center";
  form.appendChild(status);

  // Enviar
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const proveedor = select.value;
    let isValid = true;
    let paymentData = {};
    if (!proveedor) {
      status.textContent = "Por favor, selecciona un método de pago.";
      return;
    }
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
