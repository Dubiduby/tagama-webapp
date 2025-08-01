import { navigate } from "../router.js";
import { showToast } from "../utils/toastify.js";

export default function contact(container) {
  container.innerHTML = "";
  const wrapper = document.createElement("div");
  wrapper.className = "max-w-5xl mx-auto px-4 py-12";

  const flexDiv = document.createElement("div");
  flexDiv.className = "flex flex-col md:flex-row gap-8 items-start";

  const copyDiv = document.createElement("div");
  copyDiv.className = "md:w-1/2 w-full mb-8 px-2 md:mb-0";

  const title = document.createElement("h1");
  title.className =
    "text-3xl md:text-4xl font-extrabold text-[#1e1d1d] dark:text-white mb-4";
  title.textContent = "Contáctanos";
  copyDiv.appendChild(title);

  const contentDiv = document.createElement("div");
  contentDiv.className = "flex flex-col gap-2";

  const p1 = document.createElement("p");
  p1.className = "text-[var(--color-grey)] mb-2";
  p1.textContent =
    "¿Has encontrado un error, tienes alguna sugerencia o simplemente quieres saludarnos?";
  const br1 = document.createElement("br");
  const br2 = document.createElement("br");
  const textNode = document.createTextNode("En Tagama te escuchamos.");
  p1.appendChild(br1);
  p1.appendChild(br2);
  p1.appendChild(textNode);
  contentDiv.appendChild(p1);

  const emailP = document.createElement("p");
  emailP.className =
    "text-[var(--color-text)] dark:text-[var(--color-text)] mb-2 text-[#ad5733] dark:text-[#f49167] font-bold text-lg";
  emailP.textContent = "📩 hola@tagama.es";
  contentDiv.appendChild(emailP);

  const p2 = document.createElement("p");
  p2.className = "text-[var(--color-grey)] mb-2";
  p2.textContent =
    "O rellena el formulario y te responderemos lo antes posible.";
  contentDiv.appendChild(p2);

  const p3 = document.createElement("p");
  p3.className = "text-[var(--color-text)] dark:text-[var(--color-text)]";
  p3.textContent =
    "Gracias por formar parte de esta pequeña gran red creativa en Tenerife 🧡";
  contentDiv.appendChild(p3);

  copyDiv.appendChild(contentDiv);

  const formDiv = document.createElement("div");
  formDiv.className = "md:w-1/2 w-full";
  const form = document.createElement("form");
  form.id = "contact-form";
  form.className =
    "bg-white dark:bg-[#1a1a1a] rounded-2xl shadow p-6 flex flex-col gap-4 border border-gray-200 dark:border-gray-700";

  const nameDiv = document.createElement("div");
  const nameLabel = document.createElement("label");
  nameLabel.htmlFor = "contact-name";
  nameLabel.className =
    "block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300";
  nameLabel.textContent = "Nombre";
  const nameInput = document.createElement("input");
  nameInput.type = "text";
  nameInput.id = "contact-name";
  nameInput.name = "from_name";
  nameInput.placeholder = "Tu nombre";
  nameInput.required = true;
  nameInput.className =
    "w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#ad5733] dark:focus:ring-[#f49167] bg-white dark:bg-[#141414] text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400";
  nameDiv.appendChild(nameLabel);
  nameDiv.appendChild(nameInput);

  const emailDiv = document.createElement("div");
  const emailLabel = document.createElement("label");
  emailLabel.htmlFor = "contact-email";
  emailLabel.className =
    "block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300";
  emailLabel.textContent = "Email";
  const emailInput = document.createElement("input");
  emailInput.type = "email";
  emailInput.id = "contact-email";
  emailInput.name = "from_email";
  emailInput.placeholder = "Tu email";
  emailInput.required = true;
  emailInput.className =
    "w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#ad5733] dark:focus:ring-[#f49167] bg-white dark:bg-[#141414] text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400";
  emailDiv.appendChild(emailLabel);
  emailDiv.appendChild(emailInput);

  const messageDiv = document.createElement("div");
  const messageLabel = document.createElement("label");
  messageLabel.htmlFor = "contact-message";
  messageLabel.className =
    "block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300";
  messageLabel.textContent = "Mensaje";
  const messageInput = document.createElement("textarea");
  messageInput.id = "contact-message";
  messageInput.name = "message";
  messageInput.placeholder = "Tu mensaje";
  messageInput.rows = 4;
  messageInput.required = true;
  messageInput.className =
    "w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#ad5733] dark:focus:ring-[#f49167] bg-white dark:bg-[#141414] text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400";
  messageDiv.appendChild(messageLabel);
  messageDiv.appendChild(messageInput);

  const submitBtn = document.createElement("button");
  submitBtn.type = "submit";
  submitBtn.className =
    "mt-2 bg-[#ad5733] dark:bg-[#f49167] text-white font-bold py-2 px-6 rounded-full hover:bg-[#797b6c] dark:hover:bg-[#ad5733] transition";
  submitBtn.textContent = "Enviar";

  const successMsg = document.createElement("div");
  successMsg.id = "contact-success";
  successMsg.className =
    "hidden text-green-600 dark:text-green-400 text-center font-semibold mt-2";
  successMsg.textContent = "¡Tu mensaje ha sido enviado!";

  form.appendChild(nameDiv);
  form.appendChild(emailDiv);
  form.appendChild(messageDiv);
  form.appendChild(submitBtn);
  form.appendChild(successMsg);

  formDiv.appendChild(form);

  flexDiv.appendChild(copyDiv);
  flexDiv.appendChild(formDiv);
  wrapper.appendChild(flexDiv);
  container.appendChild(wrapper);

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const SERVICE_ID = "service_go50l25";
    const TEMPLATE_ID = "template_xmcxylt";
    const WELCOME_TEMPLATE_ID = "template_u6ilac9";

    if (window.emailjs) {
      window.emailjs
        .sendForm(SERVICE_ID, TEMPLATE_ID, form)
        .then(function () {
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
