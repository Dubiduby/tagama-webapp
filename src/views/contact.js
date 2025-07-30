import "../assets/styles/contact.css";
import { navigate } from "../router.js";
import { showToast } from "../utils/toastify.js";

export default function contact(container) {
  // Helper funcional para crear elementos
  function $(tag, props = {}, ...children) {
    const el = document.createElement(tag);
    Object.entries(props).forEach(([k, v]) => {
      if (k.startsWith("on") && typeof v === "function") {
        el.addEventListener(k.slice(2).toLowerCase(), v);
      } else if (k === "class") {
        el.className = v;
      } else if (k === "style" && typeof v === "object") {
        Object.assign(el.style, v);
      } else if (k === "for") {
        el.htmlFor = v;
      } else {
        el.setAttribute(k, v);
      }
    });
    children.flat().forEach((child) => {
      if (typeof child === "string" || typeof child === "number") {
        el.appendChild(document.createTextNode(child));
      } else if (child instanceof Node) {
        el.appendChild(child);
      }
    });
    return el;
  }

  container.innerHTML = "";

  // Crear mensaje de éxito
  const successMsg = document.createElement("div");
  successMsg.className = "contact-success";
  successMsg.style.display = "none";
  successMsg.textContent = "¡Tu mensaje ha sido enviado! (simulado)";

  // Crear inputs
  const nameInput = document.createElement("input");
  nameInput.type = "text";
  nameInput.className = "contact-input";
  nameInput.id = "contact-name";
  nameInput.name = "from_name";
  nameInput.placeholder = "Tu nombre";
  nameInput.required = true;

  const emailInput = document.createElement("input");
  emailInput.type = "email";
  emailInput.className = "contact-input";
  emailInput.id = "contact-email";
  emailInput.name = "from_email";
  emailInput.placeholder = "Tu email";
  emailInput.required = true;

  const messageInput = document.createElement("textarea");
  messageInput.className = "contact-input";
  messageInput.id = "contact-message";
  messageInput.name = "message";
  messageInput.placeholder = "Tu mensaje";
  messageInput.rows = 4;
  messageInput.required = true;

  // Crear botón de envío
  const submitBtn = document.createElement("button");
  submitBtn.type = "submit";
  submitBtn.className = "contact-btn";
  submitBtn.textContent = "Enviar";

  // Crear labels
  const nameLabel = document.createElement("label");
  nameLabel.htmlFor = "contact-name";
  nameLabel.textContent = "Nombre";

  const emailLabel = document.createElement("label");
  emailLabel.htmlFor = "contact-email";
  emailLabel.textContent = "Email";

  const messageLabel = document.createElement("label");
  messageLabel.htmlFor = "contact-message";
  messageLabel.textContent = "Mensaje";

  // Crear formulario
  const form = document.createElement("form");
  form.className = "contact-form";
  
  // Agregar elementos al formulario
  form.appendChild(nameLabel);
  form.appendChild(nameInput);
  form.appendChild(emailLabel);
  form.appendChild(emailInput);
  form.appendChild(messageLabel);
  form.appendChild(messageInput);
  form.appendChild(submitBtn);
  form.appendChild(successMsg);

  // Event listener para el formulario
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const SERVICE_ID = "service_go50l25";
    const TEMPLATE_ID = "template_xmcxylt";
    const WELCOME_TEMPLATE_ID = "template_u6ilac9";
    
    if (window.emailjs) {
      // Enviar mensaje al administrador
      window.emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, form).then(
        function () {
          // Enviar mensaje de bienvenida al usuario
          const userEmail = emailInput.value;
          const userName = nameInput.value;
          const userMessage = messageInput.value;
          
          // Parámetros para el mensaje de bienvenida
          const welcomeParams = {
            to_email: userEmail,
            to_name: userName,
            user_message: userMessage
          };
          
          // Enviar mensaje de bienvenida usando template específico
          window.emailjs.send(SERVICE_ID, WELCOME_TEMPLATE_ID, welcomeParams).then(
            function() {
              successMsg.style.display = "block";
              showToast("¡Mensaje enviado! Revisa tu email para la confirmación.", "success");
              setTimeout(() => {
                successMsg.style.display = "none";
                form.reset();
                navigate("/home");
              }, 3000);
            },
            function(error) {
              console.error("Error enviando bienvenida:", error);
              // Si falla el mensaje de bienvenida, aún mostrar éxito del mensaje principal
              successMsg.style.display = "block";
              showToast("¡Mensaje enviado! (Error al enviar confirmación)", "success");
              setTimeout(() => {
                successMsg.style.display = "none";
                form.reset();
                navigate("/home");
              }, 3000);
            }
          );
        },
        function (error) {
          showToast("Error al enviar mensaje: " + error.text, "error");
        }
      );
    } else {
      showToast(
        "EmailJS no está cargado. Verifica tu script CDN en index.html.",
        "error"
      );
    }
  });

  // Crear título
  const title = document.createElement("h1");
  title.className = "contact-title";
  title.textContent = "Contáctanos";

  // Crear descripción
  const description = document.createElement("p");
  description.className = "contact-desc";
  description.textContent = "¡Nos encantaría saber de ti! Completa el formulario de abajo.";

  // Crear contenedor principal
  const mainDiv = document.createElement("div");
  mainDiv.className = "contact-layout";
  
  // Agregar elementos al contenedor
  mainDiv.appendChild(title);
  mainDiv.appendChild(description);
  mainDiv.appendChild(form);

  // Agregar al container
  container.appendChild(mainDiv);
}
