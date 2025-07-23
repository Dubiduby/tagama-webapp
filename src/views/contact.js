import "../assets/styles/contact.css";
import { navigate } from "../router.js";

export default function contact(container)  {
  // Helper funcional para crear elementos
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

  container.innerHTML = "";

  const successMsg = $("div", { class: "contact-success", style: { display: "none" } }, "Your message has been sent! (simulated)");

  const nameInput = $("input", { type: "text", class: "contact-input", id: "contact-name", placeholder: "Your name", required: true });
  const emailInput = $("input", { type: "email", class: "contact-input", id: "contact-email", placeholder: "Your email", required: true });
  const messageInput = $("textarea", { class: "contact-input", id: "contact-message", placeholder: "Your message", rows: 4, required: true });

  const form = $("form", { class: "contact-form", onsubmit: e => {
    e.preventDefault();
    successMsg.style.display = "block";
    setTimeout(() => {
      successMsg.style.display = "none";
      form.reset();
      navigate("/home"); // <-- Redirige a Home después de mostrar el mensaje
    }, 2500);
  }},
    $("label", { for: "contact-name" }, "Name"),
    nameInput,
    $("label", { for: "contact-email" }, "Email"),
    emailInput,
    $("label", { for: "contact-message" }, "Message"),
    messageInput,
    $("button", { type: "submit", class: "contact-btn" }, "Send"),
    successMsg
  );

  const mainDiv = $("div", { class: "contact-layout" },
    $("h1", { class: "contact-title" }, "Contact Us"),
    $("p", { class: "contact-desc" }, "We would love to hear from you! Fill out the form below."),
    form
  );

  container.appendChild(mainDiv);
}


