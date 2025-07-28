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

  const successMsg = $(
    "div",
    { class: "contact-success", style: { display: "none" } },
    "¡Tu mensaje ha sido enviado! (simulado)"
  );

  const nameInput = $("input", {
    type: "text",
    class: "contact-input",
    id: "contact-name",
    name: "from_name", // <-- Debe coincidir con la plantilla
    placeholder: "Tu nombre",
    required: true,
  });
  const emailInput = $("input", {
    type: "email",
    class: "contact-input",
    id: "contact-email",
    name: "from_email", // <-- Debe coincidir con la plantilla
    placeholder: "Tu email",
    required: true,
  });
  const messageInput = $("textarea", {
    class: "contact-input",
    id: "contact-message",
    name: "message", // <-- Debe coincidir con la plantilla
    placeholder: "Tu mensaje",
    rows: 4,
    required: true,
  });

  const form = $(
    "form",
    { class: "contact-form" },

    $("label", { for: "contact-name" }, "Nombre"),
    nameInput,
    $("label", { for: "contact-email" }, "Email"),
    emailInput,
    $("label", { for: "contact-message" }, "Mensaje"),
    messageInput,
    $("button", { type: "submit", class: "contact-btn" }, "Enviar"),
    successMsg
  );

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const SERVICE_ID = "service_go50l25";
    const TEMPLATE_ID = "template_xmcxylt";
    if (window.emailjs) {
      window.emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, form).then(
        function () {
          successMsg.style.display = "block";
          setTimeout(() => {
            successMsg.style.display = "none";
            form.reset();
            // Si quieres redirigir:
            navigate("/home");
          }, 2000);
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
  }); // <-- ¡Cierra aquí!

  // Luego el layout:
  const mainDiv = $(
    "div",
    { class: "contact-layout" },
    $("h1", { class: "contact-title" }, "Contáctanos"),
    $(
      "p",
      { class: "contact-desc" },
      "¡Nos encantaría saber de ti! Completa el formulario de abajo."
    ),
    form
  );

  container.appendChild(mainDiv);
}
