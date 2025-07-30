import { navigate } from "../router.js";
import { showToast } from "../utils/toastify.js";

export default function contact(container) {
  container.innerHTML = "";
  const wrapper = document.createElement("div");
  wrapper.className = "max-w-5xl mx-auto px-4 py-12";

  // Layout flex para copy y form
  const flexDiv = document.createElement("div");
  flexDiv.className = "flex flex-col md:flex-row gap-8 items-start";

  // Copy (izquierda)
  const copyDiv = document.createElement("div");
  copyDiv.className = "md:w-1/2 w-full mb-8 px-2 md:mb-0";
  copyDiv.innerHTML = `
    <h1 class="text-3xl md:text-4xl font-extrabold text-[#1e1d1d] mb-4">Contáctanos</h1>
    <div class="flex flex-col gap-2">
      <p class="text-[var(--color-gray)] mb-2">¿Has encontrado un error, tienes alguna sugerencia o simplemente quieres saludarnos?<br><br>En Tagama te escuchamos.</p>
      <p class="text-[var(--color-text)] mb-2 text-[#ad5733] font-bold text-lg">📩 hola@tagama.es</p>
      <p class="text-[var(--color-gray)] mb-2">O rellena el formulario y te responderemos lo antes posible.</p>
      <p class="text-[var(--color-text)]">Gracias por formar parte de esta pequeña gran red creativa en Tenerife 🧡</p>
    </div>
  `;

  // Formulario (derecha)
  const formDiv = document.createElement("div");
  formDiv.className = "md:w-1/2 w-full";
  const form = document.createElement("form");
  form.id = "contact-form";
  form.className = "bg-white rounded-2xl shadow p-6 flex flex-col gap-4";

  // Nombre
  const nameDiv = document.createElement("div");
  const nameLabel = document.createElement("label");
  nameLabel.htmlFor = "contact-name";
  nameLabel.className = "block text-sm font-medium mb-1";
  nameLabel.textContent = "Nombre";
  const nameInput = document.createElement("input");
  nameInput.type = "text";
  nameInput.id = "contact-name";
  nameInput.name = "from_name";
  nameInput.placeholder = "Tu nombre";
  nameInput.required = true;
  nameInput.className =
    "w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#ad5733]";
  nameDiv.appendChild(nameLabel);
  nameDiv.appendChild(nameInput);

  // Email
  const emailDiv = document.createElement("div");
  const emailLabel = document.createElement("label");
  emailLabel.htmlFor = "contact-email";
  emailLabel.className = "block text-sm font-medium mb-1";
  emailLabel.textContent = "Email";
  const emailInput = document.createElement("input");
  emailInput.type = "email";
  emailInput.id = "contact-email";
  emailInput.name = "from_email";
  emailInput.placeholder = "Tu email";
  emailInput.required = true;
  emailInput.className =
    "w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#ad5733]";
  emailDiv.appendChild(emailLabel);
  emailDiv.appendChild(emailInput);

  // Mensaje
  const messageDiv = document.createElement("div");
  const messageLabel = document.createElement("label");
  messageLabel.htmlFor = "contact-message";
  messageLabel.className = "block text-sm font-medium mb-1";
  messageLabel.textContent = "Mensaje";
  const messageInput = document.createElement("textarea");
  messageInput.id = "contact-message";
  messageInput.name = "message";
  messageInput.placeholder = "Tu mensaje";
  messageInput.rows = 4;
  messageInput.required = true;
  messageInput.className =
    "w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#ad5733]";
  messageDiv.appendChild(messageLabel);
  messageDiv.appendChild(messageInput);

  // Botón
  const submitBtn = document.createElement("button");
  submitBtn.type = "submit";
  submitBtn.className =
    "mt-2 bg-[#ad5733] text-white font-bold py-2 px-6 rounded-full hover:bg-[#797b6c] transition";
  submitBtn.textContent = "Enviar";

  // Mensaje de éxito
  const successMsg = document.createElement("div");
  successMsg.id = "contact-success";
  successMsg.className = "hidden text-green-600 text-center font-semibold mt-2";
  successMsg.textContent = "¡Tu mensaje ha sido enviado!";

  // Añadir campos al form
  form.appendChild(nameDiv);
  form.appendChild(emailDiv);
  form.appendChild(messageDiv);
  form.appendChild(submitBtn);
  form.appendChild(successMsg);

  formDiv.appendChild(form);

  // Añadir copy y form al flexDiv
  flexDiv.appendChild(copyDiv);
  flexDiv.appendChild(formDiv);
  wrapper.appendChild(flexDiv);
  container.appendChild(wrapper);

  // Lógica del formulario
  // Lógica del formulario
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const SERVICE_ID = "service_go50l25";
    const TEMPLATE_ID = "template_xmcxylt";
    const WELCOME_TEMPLATE_ID = "template_u6ilac9";

    if (window.emailjs) {
      window.emailjs
        .sendForm(SERVICE_ID, TEMPLATE_ID, form)
        .then(function () {
          // Enviar mensaje de bienvenida al usuario
          const userEmail = emailInput.value;
          const userName = nameInput.value;
          const userMessage = messageInput.value;
          const welcomeParams = {
            to_email: userEmail,
            to_name: userName,
            user_message: userMessage,
          };
          window.emailjs
            .send(SERVICE_ID, WELCOME_TEMPLATE_ID, welcomeParams)
            .then(function () {
              successMsg.classList.remove("hidden");
              showToast(
                "¡Mensaje enviado! Revisa tu email para la confirmación.",
                "success"
              );
              setTimeout(() => {
                successMsg.classList.add("hidden");
                form.reset();
                navigate("/home");
              }, 3000);
            })
            .catch(function (error) {
              console.error("Error enviando bienvenida:", error);
              successMsg.classList.remove("hidden");
              showToast(
                "¡Mensaje enviado! (Error al enviar confirmación)",
                "success"
              );
              setTimeout(() => {
                successMsg.classList.add("hidden");
                form.reset();
                navigate("/home");
              }, 3000);
            });
        })
        .catch(function (error) {
          showToast("Error al enviar mensaje: " + error.text, "error");
        });
    } else {
      showToast(
        "EmailJS no está cargado. Verifica tu script CDN en index.html.",
        "error"
      );
    }
  });
}
